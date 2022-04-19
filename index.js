const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
require('dotenv').config();
require("./models/db.js");
const port = process.env.PORT || 4000;
const cookieParser = require('cookie-parser');

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

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