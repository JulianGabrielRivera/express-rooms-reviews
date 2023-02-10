// models/User.model.js
const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
    },
    password: String,
    fullName: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
