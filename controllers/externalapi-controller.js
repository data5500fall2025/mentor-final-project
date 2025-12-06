const axios = require("axios");

exports.getDogImages = async (req, res, next) => {
  try {
    const url = "https://dog.ceo/api/breeds/image/random/3";

    const response = await axios.get(url);

    const images = response.data.message; // array of image URLs

    res.render("external-api", {
      pageTitle: "External API",
      pageClass: "external-api-page",
      images
    });
  } catch (err) {
    console.log("External API Error:", err);
    next(err);
  }
};
