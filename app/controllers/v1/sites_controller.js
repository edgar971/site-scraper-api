'use strict';

const Nodal = require('nodal');
const scraper = require('website-scraper');
const Site = Nodal.require('app/models/site.js');

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

    Site.create(this.params.body, (err, model) => {

      this.respond(err || model);

    });

  }

  scrape(model) {

    let options = this.defaultScrapeOptions();
    options.urls.push(model.toObject().url);

      console.log(url);

    scraper(options, (error, result) => {

      console.log(error, result);

    });

  }

  defaultScrapeOptions() {
    return {
      urls: []
    }
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
