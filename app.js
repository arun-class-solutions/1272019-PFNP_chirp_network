//Require modules and models

var express = require("express");
var models = require("./models/index");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

var app = express();

//Set view engine

app.set("view engine", "ejs");

//Middleware

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(methodOverride("_method"));

app.get("/", function(req, res) {
    res.redirect(301, "/chirps");
});

// REST requests
// HTTP request type -> Action
// GET -> Read
// POST -> Create
// PUT -> Update
// DELETE -> Destroy

// Routing
// Template: {resource}/{identifier}

//Get all chirps
app.get("/chirps", (req, res) => {
  // Step 1: Retrieve all chirps from database
  // Step 2: Generate HTML with all chirps inside
  // Step 3: Send completed HTML to the browser
  // To view your site, navigate to http://localhost:3000/chirps
  models.Chirp.findAll().then((chirps) => {
    res.render("index", { chirps });
  });
});

//Create new chirp
app.post("/chirps", (req, res) => {
  // Step 1: Retrieve new chirp from user input (form submission)
  // Step 2: Save new chirp to the database
  // Step 3: Redirect to show all chirps page
  var newChirp = req.body;

  models.Chirp.create(newChirp).then(() => {
    res.redirect("/chirps");
  });
});

//Get specific chirp
app.get("/chirps/:id/edit", (req, res) => {
  // Step 1: Retrieve specific chirp from the database via its ID
  // Step 2: Generate HTML for the specific chirp
  // Step 3: Send completed HTML to the browser
  var chirpId = req.params.id;

  models.Chirp.findById(chirpId).then((chirp) => {
    res.render("edit", { chirp });
  });
});

//Edit a chirp
app.put("/chirps/:id", (req, res) => {
  // Step 1: Retrieve the edited chirp from user input (form submission)
  // Step 2: Find specific chirp in the database via its ID
  // Step 3: Update specific chirp with user input
  // Step 4: Redirect back to show all chirps page
  var editedChirp = req.body;
  var chirpId = req.params.id;

  models.Chirp.findById(chirpId).then((chirp) => {
    chirp.updateAttributes(editedChirp).then(() => {
      res.redirect("/chirps");
    });
  });
});

//Delete a chirp
// .destroy() with nothing in the parentheses is how you delete something from the db
app.delete("/chirps/:id", (req, res) => {
  // Step 1: Find specific chirp in DB via its ID
  // Step 2: Destroy specific chirp from DB
  // Step 3: Redirect back to show all chirps page
  var chirpId = req.params.id;

  models.Chirp.findById(chirpId).then((chirp) => {
    chirp.destroy().then(() => {
      res.redirect("/chirps");
    });
  });
});

app.listen(process.env.PORT || 3000);
