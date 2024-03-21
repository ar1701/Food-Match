if(process.env.NODE_ENV != "production") {
  require("dotenv").config(); 
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const User = require("./models/user.js");
const LocalStrategy = require("passport-local");
const passport = require("passport");
const axios = require("axios");
const Food = require("./models/food.js");



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { error } = require("console");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const dbUrl = process.env.ATLASDB_URL;
async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then(() => {
    console.log("Connection Succeeded");
  })
  .catch((err) => console.log(err));

  const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
      secret: process.env.SECRET,
    },
    touchAfter: 24*60*60,
  });
  
  store.on("error", (error)=>{
    console.log("Error in MONGO SESSION STORE: ", error);
  })

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

let api_key = process.env.API_KEY;
let url = 'https://api.api-ninjas.com/v1/recipe?query=';

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

let port = 8080;
app.listen(port, () => {
  console.log("Listening to the Port " + port);
});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.post('/search', async (req, res) => {
  let { foodName } = req.body;
  try {
    // Fetch data from external API
    const response = await axios.get(url + foodName + "&X-Api-Key=" + api_key);
    const data = response.data;

    // Query database for existing food items
    const existingFoodItems = await Food.find({ title: { $in: data.map(item => item.title) } });

    // Iterate over fetched data
    for (let one of data) {
      // Check if the item already exists in the database
      const existingItem = existingFoodItems.find(item => item.title === one.title);
      
      // If the item doesn't exist, save it to the database
      if (!existingItem) {
        let newFood = new Food({
          title: one.title,
          ingredients: one.ingredients,
          servings: one.servings,
          instructions: one.instructions
        });
        await newFood.save();
      }
    }

    // Render the template with fetched data
    res.render("./listings/food.ejs", { data, foodName });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' }); // Sending an error response
  }
});

app.get("/search/:title", async(req,res)=>{
  let {title} = req.params;
  let item = await Food.find({title: title});
  item = item[0];
  res.render("./listings/item.ejs", {item});
  
})

app.all("*", (req, res, next) => {
  res.redirect("/listings");
  next();
});


