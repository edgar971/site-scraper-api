'use strict';

const Nodal = require('nodal');

class Site extends Nodal.Model {}

Site.setDatabase(Nodal.require('db/main.js'));
Site.setSchema(Nodal.my.Schema.models.Site);

Site.validates('url', 'The site URL is required!', v => v && v.length > 0);

module.exports = Site;
