const mongoose = require("mongoose");
const path = require("path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const requestLogger = require("./middleware");

const app = express();

// ===============================
// BODY PARSING (must be first)
// ===============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// SESSION SETUP
// ===============================
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri:
    process.env.MONGODB_URI ||
    "mongodb+srv://a02362497_db_user:bitenodebistro@cluster0.3k99g4e.mongodb.net/Final-Exam",
  collection: "sessions",
});

app.use(
  session({
    secret: "supersecretkey123",
    resave: false,
    saveUninitialized: false,
    store,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

// Make session available in all EJS views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// ===============================
// VIEW ENGINE SETUP
// ===============================
app.set("view engine", "ejs");
app.set("views", "views");
app.use(expressLayouts);
app.set("layout", "layout");

// ===============================
// STATIC FILES + LOGGING
// ===============================
app.use(express.static(path.join(__dirname, "public")));
app.use(requestLogger);


// ROUTES

const homeRoutes = require("./routes/home-routes");
const courseRoutes = require("./routes/course-routes");
const trainerRoutes = require("./routes/trainer-routes");
const eventRoutes = require("./routes/event-routes");
const contactRoutes = require("./routes/contact-routes");
const userRoutes = require("./routes/user-routes");
const adminRoutes = require("./routes/admin-routes");  
const apiRoutes = require("./routes/api-routes");
const externalApiRoutes = require("./routes/externalapi-routes");

app.use("/auth", userRoutes);
app.use("/admin", adminRoutes);       
app.use("/courses", courseRoutes);
app.use("/trainers", trainerRoutes);
app.use("/events", eventRoutes);
app.use("/contacts", contactRoutes);
app.use("/", homeRoutes);
app.use("/api", apiRoutes);
app.use("/externalapi", externalApiRoutes);

// ERROR CONTROLLER
const errorController = require("./controllers/error-controller");

// 404 Handler
app.use(errorController.get404);

// 500 Handler (must have 4 parameters!)
app.use(errorController.get500);


// ===============================
// MONGOOSE CONNECTION
// ===============================
mongoose
  .connect(
    process.env.MONGODB_URI ||
      "mongodb+srv://a02362497_db_user:bitenodebistro@cluster0.3k99g4e.mongodb.net/Final-Exam"
  )
  .then(() => {
    console.log("Connected to MongoDB!");
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((err) => console.log("MongoDB error:", err));
