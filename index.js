require("dotenv").config({ path: "./secret.env" });

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Import Routes
const users = require("./routes/user_route");
const news = require("./routes/news_route");
const newsMedia = require("./routes/newsMedia_route");
const jobOffer = require("./routes/jobOffer_route");
const applications = require("./routes/applications_route");
const services = require("./routes/service_route");
const info = require("./routes/info_routes");
const reviews = require("./routes/review_routes");
const links = require("./routes/links_routes");
const messages = require("./routes/messages_routes");
const projects = require("./routes/projects_routes");
const projectMedia = require("./routes/projectMedia_routes");
const employees = require("./routes/employees_routes");
const heroMedia = require("./routes/heroMedia_routes");

const languageMiddleware = require("./middlewares/languageMiddleware");

//Middleware
app.use(languageMiddleware);

//API's
app.use("/api", users);
app.use("/api", news);
app.use("/api", newsMedia);
app.use("/api", jobOffer);
app.use("/api", applications);
app.use("/api", services);
app.use("/api", info);
app.use("/api", reviews);
app.use("/api", links);
app.use("/api", messages);
app.use("/api", projects);
app.use("/api", projectMedia);
app.use("/api", employees);
app.use("/api", heroMedia);

//Start Server
const PORT = process.env.PORT || 3100;
async function startServer() {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}
startServer();

const pool = require("./config/db");

//Test Database Connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Connection successful!");
    connection.release();
  } catch (error) {
    console.error("Connection failed:", error.message);
  }
}

testConnection();
