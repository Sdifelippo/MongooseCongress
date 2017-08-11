const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/senatorsdb');

const senatorSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  congress_numbers: String,
  party: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  person: {
    gender: {
      type: String,
      required: true
    },
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    birthday: {
      type: Date,
      required: true
    },
    bioguideid: String,
    cspanid: Number,
    twitterid: String,
    youtubeid: String,
    gender_label: String
  },
  phone: {
    type: String,
    required: true
  },
  extra: {
    address:  String,
    contact_form: String,
    fax: String,
    office: String
  },
  startdate: Date,
  enddate: Date,
  description: String,

})

senatorSchema.statics.findAndSort = function(find, render) {
  this
    .find(find)
    .sort({ 'person.lastname': 1})
    .then(function(results) {
      render(results);
    });
}

senatorSchema.statics.findSenator = function(find, render) {
  this
    .findOne(find)
    .then(function(results) {
      render(results);
    });
}

senatorSchema.statics.deleteSenator = function(find, render) {
  this
    .deleteOne(find)
    .then(function(senator) {
      render(senator);
    });
}

const Senator = mongoose.model('Senator', senatorSchema, 'senators');

module.exports = Senator;
