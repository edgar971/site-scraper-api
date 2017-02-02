'use strict';

const Nodal = require('nodal');

class CreateSites extends Nodal.Migration {

  constructor(db) {
    super(db);
    this.id = 2017012421491140;
  }

  up() {

    return [
      this.createTable("sites", [

          {
              "name":"url","type":"string"
          },
          {
              "name":"directory","type":"string"
          },
          {
              "name":"base_path","type":"string"
          },
          {
              "name":"screenshot","type":"string"
          },
          {
              "name":"entire_site","type":"boolean"
          },
          {
              "name":"processed","type":"boolean"
          }

      ])
    ];

  }

  down() {

    return [
      this.dropTable("sites")
    ];

  }

}

module.exports = CreateSites;
