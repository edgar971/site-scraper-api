'use strict';

const Nodal = require('nodal');
const scraper = require('website-scraper');
const Site = Nodal.require('app/models/site.js');
const URL = require('url');
class V1SitesController extends Nodal.Controller {




    index() {

        Site.query()
            .where(this.params.query)
            .end((err, models) => {

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

        this.params.body.processed = false;

        Site.create(this.params.body, (err, model) => {

            this.scrape(model);
            this.respond(err || model);

        });

    }

    scrape(site) {

        // Setup the scrape options
        let options = this.defaultScrapeOptions();
        let siteObject = site.toObject();

        options.urls.push(siteObject.url);
        options.directory = siteObject.directory;
        options.recursive = siteObject.entire_site;

        // Function to determine which links to follow
        options.urlFilter = (site_url) => {

            let giveURLHost = URL.parse(siteObject.url).host;
            let currentURLHost = URL.parse(site_url).host;

            return currentURLHost === giveURLHost;

        };

        // Run the site scraper
        scraper(options).then((data) => {

            console.log('Done processing ' + siteObject.url);
            site.set('processed', true);
            site.save();

        }).error(error => {

            console.log(error);

        })


    }

    defaultScrapeOptions() {
        return {
            urls: [],
            directory: 'data/',
            prettifyUrls: true,
            filenameGenerator: 'bySiteStructure',
            recursive: false,
            maxDepth: 10,
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

    createSiteDirectory(url) {

        let domain = URL.parse(url).host;

        // add the unix timestamp
        return process.env.ROOT_SCRAPE_DIR + domain + '_' + Math.floor(new Date() / 1000) + '/';

    }

    // Not needed
    // update() {
    //
    //   Site.update(this.params.route.id, this.params.body, (err, model) => {
    //
    //     this.respond(err || model);
    //
    //   });
    //
    // }
    //
    // destroy() {
    //
    //   Site.destroy(this.params.route.id, (err, model) => {
    //
    //     this.respond(err || model);
    //
    //   });
    //
    // }

}

module.exports = V1SitesController;
