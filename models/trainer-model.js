const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Trainer name is required"],
    },
    imageUrl: {
      type: String,
      required: [true, "Trainer image is required"],
    },
    description: {
      type: String,
      required: [true, "Trainer description is required"],
    },
    slug: {
      type: String,
      
    },
  },
  { timestamps: true }
);

// Auto-generate slug
trainerSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name.toLowerCase().trim().replace(/\s+/g, "-");
  }
  next();
});

module.exports = mongoose.model("Trainer", trainerSchema, "trainers");
