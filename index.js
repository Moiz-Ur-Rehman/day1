const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();
require("dotenv").config();
require("./models/db.js");
const port = process.env.PORT || 4000;
const cookieParser = require("cookie-parser");
const { client } = require("./redis.js");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

function setResponse(username, repos) {
  return `<h2>${username} has: ${repos} repositories</h2>`;
}
const cache = async (req, res, next) => {
  const { username } = req.params;
  const cachedRepos = await client.get(username);
  if (cachedRepos) {
    console.log("from cache");
    res.send(setResponse(username, cachedRepos));
  } else {
    next();
  }
};
async function getRepos(req, res) {
  try {
    const { username } = req.params;
    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json();
    const repos = data.public_repos;

    client.setEx(username, 3600, repos);
    res.send(setResponse(username, repos));
  } catch (err) {
    res.status(500).json({
      message: "error in fetching repositories",
      message: err,
    });
  }
}
// routes
const userRoutes = require("./routes/user/userRoutes");
const weatherRoutes = require("./routes/weather/weatherRoutes");
app.use("/user", userRoutes);
app.use("/weather", weatherRoutes);

app.listen(port, () => {
  console.log(`Server is running Fine on port ${port}`);
});
app.get("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.status(200).send("Server is running Fine on port " + port);
});
app.get("/repos/:username", cache, getRepos);
