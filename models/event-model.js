const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      minlength: [1, "Title must be between 1 and 50 characters"],
      maxlength: [50, "Title must be between 1 and 50 characters"],
    },

    summary: {
      type: String,
      required: [true, "Summary is required"],
      minlength: [1, "Summary must be between 1 and 350 characters"],
      maxlength: [350, "Summary must be between 1 and 350 characters"],
    },

    image: {
      type: String,
      required: [true, "Event image is required"],
      validate: {
        validator: function (value) {
          return /\.(jpg|jpeg|png)$/i.test(value);
        },
        message: "Image must be a .jpg, .jpeg, or .png file",
      },
    },

    date: {
      type: Date,
      required: [true, "Event date is required"],
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema, "events");
