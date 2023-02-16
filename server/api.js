const apiRouter = require('express').Router();
require('dotenv').config();

const { database, costFees, postDB } = require('./db');

const { calculateResidential, calculateAverage, titleCase, validatePost } = require('../calculations/cost');

const PORT = process.env.PORT;

const NAME = process.env.NAME

// Get returns Hello World
apiRouter.get('/hello', (req, res) => {
  res.send("Hello World");

})

// Get returns an error
apiRouter.get('/error', (req, res) => {
  res.status(404).send("An error as occured");

})

// Get returns the status
apiRouter.get('/status', (req, res) => {
  res.send(`listening on ${NAME} port ${PORT}`);

})

// GET returns a list of the emails in the database
apiRouter.get('/email-list', (req, res) => {
  const emailList = database.map(db => db.email);
  res.send(emailList);

});

// GET returns a list of the emails in the database
apiRouter.get('/region-avg/:region', (req, res) => {
  // Find if there's any :region of that name in the database, sends (404) if not.
  const regionFind = database.find(c => c.region === req.params.region);
  if (!regionFind) return res.status(404).send("Region not found");

  // Returns the list of objects that contains :region 
  const regionList = database.filter(c => c.region === req.params.region);

  // Fee calculations
  const regionMapFee = regionList.map(c => c.fee);
  var parseFee = regionMapFee.map(function (x) {
    return parseFloat(x, 10);

  });

  console.log("Average fee: " + calculateAverage(parseFee));

  // Rating calculations
  const regionMapRating = regionList.map(c => c.rating);
  var parseRating = regionMapRating.map(function (x) {
    return parseFloat(x, 10);

  });

  console.log("Average Rating: " + calculateAverage(parseRating));

  // Schema to display the correct key:value pairs for my res.send()
  const schema = {
    region: req.params.region,
    rating: calculateAverage(parseRating),
    fee: calculateAverage(parseFee)

  }

  res.send(schema);

});

// Get returns the required elevator number and the total cost
apiRouter.get('/calc-residential/:select/:floors/:app', (req, res) => {
  const selectFind = titleCase(req.params.select);
  if (selectFind !== "Standard" && selectFind !== "Premium" && selectFind !== "Excelium") return res.status(404).send("Invalid tier");
  
  const floorsFind = parseInt(req.params.floors);
  if (isNaN(floorsFind) || floorsFind <= 0) return res.status(404).send("Invalid number");

  const appFind = parseInt(req.params.app);
  if (isNaN(appFind) || appFind <= 0) return res.status(404).send("Invalid number");

  costFees.push(calculateResidential(selectFind, floorsFind, appFind))

  console.log("Cost Fees saved: ")
  console.log(costFees)

  res.send(calculateResidential(selectFind, floorsFind, appFind));

})

apiRouter.post('/contact-us', (req, res) => {
  const { error } = validatePost(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const userPost = {
      id: postDB.length + 1,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      message: req.body.message

  }
  postDB.push(userPost);

  console.log(postDB);
  res.send(userPost);

});

module.exports = apiRouter