const weatherController = require('../../controllers/weather/weatherController');
const { verifyToken } = require("../../middlewares/verifyToken");

const router = require("express").Router();

router.get("/viewCurrentWeather", verifyToken, weatherController.getCurrentWeather);

module.exports = router;