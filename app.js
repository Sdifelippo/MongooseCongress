// dependency requirement for libraries
const express = require('express');
const mongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const Senator = require('./models/senators');

// const path = require('path');
const mustacheExpress = require('mustache-express');

// create app instance for Express
const app = express();

// Configure Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// run this command at the terminal to import the senator data into Mongo
// mongoimport --db senatorsdb --collection senators --file senators.json
var url = 'mongodb://localhost:27017/senatorsdb';

// Allows public folder to be served statically to browsers
app.use(express.static('public'));

// Connect templating engine to app instance
app.engine('mustache', mustacheExpress());
// Connect views folder to views name in app instance
app.set('views', './views');
// Connect view engine to mustache
app.set('view engine', 'mustache');

app.get('/', function(req, res) {
  // render a page template called index and pass an object
  Senator.findAndSort({}, function(senators) {
    res.render('index', {
      senators
    });
  })
});

app.get('/add_senator', function(req, res, id) {
  res.render('add_senator');
});

app.post('/add_senator', function(req, res) {
  let newSenator = {
    "id": req.body.id + 1,
    "party": req.body.party,
    "state": req.body.state,
    "person": {
      "gender": req.body.gender,
      "firstname": req.body.name.split(" ")[0],
      "lastname": req.body.name.split(" ")[1],
      "birthday": req.body.birthdate
    },
  }
  Senator.create(newSenator).then(function() {
    res.redirect('/');
  }).catch(function() {
    res.render('add_senator', {
      error: true,
      senator: newSenator
    })
  })
});

app.get('/:id', function(req, res) {
  const senatorId = req.params.id;
  Senator.findSenator({
    id: senatorId
  }, function(results) {
    res.render('specific_senator', {
      senator: results
    });
  })
});

app.post('/:id', function(req, res) {
  const senatorId = req.params.id;
  Senator.deleteSenator({ id: senatorId }, function() {
    res.redirect('/')
    console.log('successful deletion!');
  })(function(err){
    console.log('Delete unsuccessful');
  });
});

// make app listen on a particular port (starts server)
app.listen(3000, function() {
  console.log('Senator express application running...');
});
