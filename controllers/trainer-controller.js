const Trainer = require("../models/trainer-model");

// ===============================
// PUBLIC: DISPLAY ALL TRAINERS
// ===============================
exports.getTrainers = async (req, res, next) => {
  try {
    const trainers = await Trainer.find().sort({ name: 1 }); // alphabetical

    return res.render("trainers", {
      pageTitle: "Trainers",
      pageClass: "trainers-page",
      trainers,
    });
  } catch (err) {
    return next(err);
  }
};

// ===============================
// UTILITY: GET TOP TRAINERS
// Used on the home page
// ===============================
exports.getTopTrainersById = async (limit) => {
  try {
    return await Trainer.find()
      .sort({ name: 1 })
      .limit(limit);
  } catch (err) {
    console.error("🔥 Trainer sort error:", err);
    return [];
  }
};
