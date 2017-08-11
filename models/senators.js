const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/senatorsdb');

const senatorSchema = new Schema ({
  "id": Number,
  "party": { type: String, required: true },
  "state": { type: String, required: true },
  "person": { "gender": { type: String, required: true },
              "firstname": { type: String, required: true },
              "lastname": { type: String, required: true },
              "birthday": { type: Date, required: true },
            },
  "phone": String,
  "extra": {
    "address": String,
    "contact_form": String,
       "fax": String,
       "office": String,
  }

});

senatorSchema.statics.findAndSort = function (findRestrictions, howToRender) {
  this
    .find(findRestrictions)
    .then(function(senators) {
      howToRender(senators);
    });
}

senatorSchema.statics.deleteSenator = function (findRestrictions, redirect) {
  this
    .deleteOne(findRestrictions)
    .then(function() {
      redirect();
    });
}
senatorSchema.statics.findOneSenator = function (findRestrictions, howToRender) {
  this
    .findOne(findRestrictions)
    .then(function(senators) {
      howToRender(senators);
    });
}

const Senator = mongoose.model('Senator', senatorSchema, 'senators')

module.exports = Senator;
