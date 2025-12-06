const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      maxlength: 50
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      maxlength: 50
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },

    // replaces your isAdmin field
    roles: {
      type: [String],
      default: ["user"],
    },

    // final project requirement
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

// Hash password before save (fixed)
userSchema.pre("save", async function () {
  console.log("🔐 Pre-save hook triggered for:", this.email);

  if (!this.isModified("password")) {
    console.log("Password not modified - skipping hash.");
    return;
  }

  console.log("Hashing password...");
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log("Password hashed successfully.");
});


// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema, "users");
