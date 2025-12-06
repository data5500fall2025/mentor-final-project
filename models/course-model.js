const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      minlength: [1, "Title must be between 1 and 50 characters"],
      maxlength: [50, "Title must be between 1 and 50 characters"],
    },

    image: {
      type: String,
      required: [true, "Image is required"],
      validate: {
        validator: function (value) {
          return /\.(jpg|jpeg|png)$/i.test(value);
        },
        message: "Image must be a .jpg, .jpeg, or .png file",
      },
    },

    summary: {
      type: String,
      required: [true, "Summary is required"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a positive number"],
    },

    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },

    registrants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    likes: {
      type: Number,
      default: 0,
    },

    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
      required: true,
    },

    schedule: {
      type: String,
      required: [true, "Schedule is required"],
    },

    slug: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

// Auto-generate slug WITHOUT next()
courseSchema.pre("save", function () {
  if (this.isModified("title")) {
    this.slug = this.title.toLowerCase().trim().replace(/\s+/g, "-");
  }
});

module.exports = mongoose.model("Course", courseSchema, "courses");
