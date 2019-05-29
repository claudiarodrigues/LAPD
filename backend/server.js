require('dotenv').config()
 
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const bcrypt = require('bcrypt');


/**
 * Database and models
 */ 
const dataModel = require("./models");
const Data = dataModel.models.Data    //model for htu21d
const { User, validate } = require('./models/user'); //model for the Users
const Plant = require('./models/plant'); //model for the Plants


/**
 * Sensors
 */ 
const sensor1 = require("./htu21d/sensor");
 

/**
 * Create express instance
 */
const app = express();
app.use(cors());
app.use(logger("dev"));

const router = express.Router();


/**
 * Connect to database and listen to defined port
 */
dataModel.connectDb().then(async() => {
  app.listen(process.env.PORT, () => 
    console.log(`LISTENING ON PORT ${process.env.PORT}`));
    
    //start reading sensor
    sensor1.start();
});



/**
 * Configure express to use body parser, so data is already transformed
 * to JSON and can be used as the 'request.body' property
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


/**
 * Create the endpoints
 */
router.get("/getSensor", (req, res) => {
  return res.json({ data: sensor1.getValues() });
});


/**
 * Create User with bcrypt
 */
router.post('/register', async (req, res) => {
  // First Validate The Request
  const { error } = validate(req.body);
  if (error) {
      return res.status(400).send(error.details[0].message);
  }

  // Check if this user already exists
  let user = await User.findOne({ username: req.body.username });
  if (user) {
      return res.status(400).send('That user already exists!');
  } else {
    // Hash and insert the new user if they do not exist yet
    let hashedPW = bcrypt.hashSync(req.body.password, 10);
	        user = new User({
          username: req.body.username,
          password: hashedPW
        });
        await user.save();
        res.send(user);
  }
});

function compareHash(password, hash)
{
	if(bcrypt.compareSync(password, hash)) {
	 return true
	} else {
	 return false
	}
}

/**
 * Login User
 */
router.post('/login', async (req, res) => {
  // First Validate The Request
  const { error } = validate(req.body);
  if (error) {
      return res.status(400).send(error.details[0].message);
  }

  // Check if this user already exists
  let user = await User.findOne({ username: req.body.username });
  if (user) {
      if(compareHash(req.body.password, user.password)) {
        return res.status(200).send('Valid Login');
      }
      else {
        return res.status(400).send('Wrong Password');
      }
  } else {
      return res.status(400).send('That user doesnt exist!');
  }
});


/**
 * Add plant
 */
router.post('/addPlant', async (req, res) => {
  // First Validate The Request
  const { error } = validate(req.body);
  if (error) {
      return res.status(400).send(error.details[0].message);
  }

  // Check if this user already exists
  let user = await User.findOne({ username: req.body.username });
  if (user) {
      plant = new Plant({
        userID: user._id,
        name: req.body.name,
        species: req.body.species,
      });
      let response = await plant.save();
      res.send(response);
  } else {
      return res.status(400).send('That user doesnt exist!');
  }
});

/**
 * Get my plants
 */
router.get('/myPlants', async (req, res) => {
  // First Validate The Request
  const { error } = validate(req.body);
  if (error) {
      return res.status(400).send(error.details[0].message);
  }

  // Check if this user already exists
  let user = await User.findOne({ username: req.body.username });
  if (user) {
    let plants = await Plant.findAll({userID: user._id})
    console.log(plants);
  } else {
      return res.status(400).send('That user doesnt exist!');
  }
});

// Development Testing Routes
 
/**
 * TODO: Delete this
 * Delete User 
 */
router.post('/deleteUser', async (req, res) => {
  // First Validate The Request
  const { error } = validate(req.body);
  if (error) {
      return res.status(400).send(error.details[0].message);
  }

  // Check if this user already exists
  let user = await User.findOne({ username: req.body.username });
  if (user) {
      //Delete's User
      let response = await User.deleteOne({ username: req.body.username})
      res.send(response);
  } else {
      return res.status(400).send('That user doesnt exist!');
  }
});

/**
 * TODO: Delete this
 * Delete User 
 */
router.get('/getUser', async (req, res) => {
  // Check if this user already exists
  let user = await User.findOne({ username: req.body.username });
  res.json({user: user});
});

// append /api for http requests
app.use("/api", router);

 


