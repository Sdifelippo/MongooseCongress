const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/senatorsdb');

const senatorSchema = new Schema ({
  "id": {type: Number },
  "party": { type: String, required: true },
  "state": { type: String, required: true },
  "person": { "gender": { type: String, required: true },
              "firstname": { type: String, required: true },
              "lastname": { type: String, required: true },
              "birthday": { type: Date, required: true },
            },
  "phone": {type: String},
  "extra": {
    "address": {type: String},
    "contact_form": {type: String},
       "fax": {type: String},
       "office": {type: String},
  }

});

senatorSchema.statics.findAndSort = function (findRestrictions, howToRender) {
  this
    .find(findRestrictions)
    .sort({ "person.lastname": 1})
    .then(function(senators) {
      howToRender(senators);
    });
}

senatorSchema.statics.deleteSenator = function (findRestrictions, howToRender) {
  this
    .deleteOne(findRestrictions)
    .sort({ "person.lastname": 1})
    .then(function(senators) {
      howToRender(senators);
    });
}

const Senator = mongoose.model('Senator', senatorSchema, 'senators')

module.exports = Senator;
