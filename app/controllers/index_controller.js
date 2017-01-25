'use strict';

const Nodal = require('nodal');

class IndexController extends Nodal.Controller {

  get() {

    this.respond({message: 'Website Scraper'});

  }

}

module.exports = IndexController;
