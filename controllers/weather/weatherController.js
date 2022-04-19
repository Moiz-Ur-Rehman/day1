const axios = require("axios");

const getCurrentWeather = async (req, res) => {
  try {
    const { location } = req.body;
    const url = `http://api.weatherapi.com/v1/current.json?key=${
      process.env.API_KEY || "d8a2b231187940b2ab234627221404"
    }&q=${location}`;
    const response = await axios.get(url);
    res.status(200).json({
      message: "success",
      data: response.data,
    });
  } catch (err) {
    res.status(500).json({
      message: "error in fetching weather",
      Error: err,
    });
  }
};

module.exports = { getCurrentWeather };
