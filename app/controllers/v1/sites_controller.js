'use strict';

const Nodal = require('nodal');
const scraper = require('website-scraper');
const Site = Nodal.require('app/models/site.js');
const URL = require('url');
const webshot = require('webshot');
const s3 = require('../../helpers/s3');
const fs = require('fs');
const archiver = require('archiver');

class V1SitesController extends Nodal.Controller {

    parseOrderBy(query) {

        let orderBy = [];

        if (!query.__orderBy) return false;

        orderBy = query.__orderBy.split('|');

        return orderBy;

    }

    index() {

        let order = this.parseOrderBy(this.params.query);

        let Query = Site.query().where(this.params.query);

        if(order) {
            Query = Query.orderBy(...order);
        }

        Query.end((err, models) => {
            this.respond(err || models);
        });

    }

    show() {

        Site.find(this.params.route.id, (err, model) => {

            this.respond(err || model);

        });

    }

    create() {

        let url = this.params.body.url;

        // Create the path to save the site
        this.params.body.directory = this.createSiteDirectory(url);

        // // Add the additional options for the scraper
        this.params.body.entire_site = this.params.body.entire_site || false;

        this.params.body.base_path = process.env.BASE_PATH;

        this.params.body.processed = false;
        this.params.body.title = null;

        Site.create(this.params.body, (err, model) => {

            this.process(model);
            this.respond(err || model);

        });

    }

    process(site) {

        // Setup the scrape options
        let siteObject = site.toObject();

        // Run the site scraper
        this.scrape(siteObject).then((data) => {

            console.log('Done Scraping Site ' + siteObject.url);

            let screenshot_path = siteObject.directory + 'www/screenshot.png';

            let title = this.getPageTitle(data);
            site.set('title', title);
            site.save();

            //Take the screenshot
            webshot(siteObject.url, screenshot_path, (image) => {

                console.log('Done with image for ' + siteObject.url);

                // Upload to s3.
                let uploader = this.uploadToS3(siteObject);

                uploader.on('error', function(err) {
                    console.error("unable to sync:", err.stack);
                });

                // uploader.on('progress', function() {
                //     console.log("progress", uploader.progressAmount, uploader.progressTotal);
                // });

                uploader.on('end', () => {

                    // Zip site and upload to S3
                    let zip = this.zipSite(siteObject);

                    zip.then((data) => {

                        let zipUpload = this.zipUploadS3(siteObject);

                        zipUpload.then((upload) => {

                            site.set('processed', true);
                            site.set('screenshot', screenshot_path);
                            site.save();

                        }).catch((err) => {
                            console.log(err)
                        });


                    });



                });



            });



        }).error(error => {

            console.log(error);

        })
    }

    /**
     *
     * @param data
     * @returns null|string
     */
    getPageTitle(data) {

        let html = (!!data[0]) ? data[0].getText() : false;
        let title = null;

        if(html) {

            let reg = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/gi;

            let results = reg.exec(html);

            title = (results && results[2]) ? results[2].replace(/^\s\s*/, '').replace(/\s\s*$/, '') : null;

        }

        return title;

    }

    scrape(site) {

        let options = this.defaultScrapeOptions();

        // Add the URL and custom directory
        options.urls.push(site.url);
        options.directory = site.directory + 'www/';
        options.recursive = site.entire_site;

        // Function to determine which links to follow
        // Skips external ones

        options.urlFilter = (site_url) => {

            let giveURLHost = URL.parse(site.url).host;
            let currentURLHost = URL.parse(site_url).host;

            return currentURLHost === giveURLHost;

        };


        // Run the scraper
        return scraper(options);

    }

    uploadToS3(site) {

        let params = {
            localDir: site.directory,
            deleteRemoved: true, // default false, whether to remove s3 objects
                                 // that have no corresponding local file.
            s3Params: {
                Bucket: process.env.S3_BUCKET,
                Prefix: site.directory,
                ACL: 'public-read'
                // other options supported by putObject, except Body and ContentLength.
                // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
            }
        };

        return s3.uploadDir(params);

    }

    zipUploadS3(site) {

        return new Promise((resolve, reject) => {

            let params = {
                localFile: site.directory + 'archive/site.zip',
                // that have no corresponding local file.
                s3Params: {
                    Bucket: process.env.S3_BUCKET,
                    Key: site.directory + 'archive/site.zip',
                    ACL: 'public-read'
                    // other options supported by putObject, except Body and ContentLength.
                    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
                },
            };

            let uploader = s3.uploadFile(params);

            uploader.on('error', (err) => {

                reject(err);

            });

            // uploader.on('progress', function() {
            //     console.log("progress", uploader.progressAmount, uploader.progressTotal);
            // });

            uploader.on('end', () => {

                resolve(uploader);

            });

        });



    }

    zipSite(site) {

        return new Promise((resolve, reject) => {
            let output_dir = site.directory + 'archive/';
            let output_file = output_dir + 'site.zip';
            let site_dir = site.directory + 'www/';

            // Create dir if missing
            if (!fs.existsSync(output_dir)){
                fs.mkdirSync(output_dir);
            }

            let output = fs.createWriteStream(output_file);

            let archive = archiver('zip', {
                store: true // Sets the compression method to STORE.
            });


            output.on('close', () => {

                resolve(archive);

            });


            archive.on('error', (err) => {

                reject(err);

            });

            archive.pipe(output);

            archive.directory(site_dir,false).finalize();


        });


    }

    defaultScrapeOptions() {
        return {
            urls: [],
            directory: 'data/',
            prettifyUrls: true,
            recursive: false,
            maxDepth: 25,
            sources: [
                { selector: 'style' },
                { selector: '[style]', attr: 'style' },
                { selector: '[data-src]', attr: 'data-src' },
                { selector: '[data-image-large]', attr: 'data-image-large' },
                { selector: '[data-image-small]', attr: 'data-image-small' },
                { selector: 'img', attr: 'src' },
                { selector: 'source', attr: 'src' },
                { selector: 'img', attr: 'srcset' },
                { selector: 'input', attr: 'src' },
                { selector: 'object', attr: 'data' },
                { selector: 'embed', attr: 'src' },
                { selector: 'param[name="movie"]', attr: 'value' },
                { selector: 'script', attr: 'src' },
                { selector: 'link[rel="stylesheet"]', attr: 'href' },
                { selector: 'link[rel*="icon"]', attr: 'href' },
                { selector: 'svg *[xlink\\:href]', attr: 'xlink:href' },
                { selector: 'svg *[href]', attr: 'href' }
            ]

        }
    }

    friendlyURLName(url) {

        let name = URL.parse(url).host;

        //remove dots
        name = name.replace(/\./g,'_');

        return name;

    }

    createSiteDirectory(url) {

        let domain = this.friendlyURLName(url);

        // add the unix timestamp
        return process.env.ROOT_SCRAPE_DIR + domain + '_' + Math.floor(new Date() / 1000) + '/';

    }


}

module.exports = V1SitesController;
