const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please input first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please input last name"],
    },
    email: { type: String, required: [true, "please input email"] },
    postcode: { type: String, required: [true, "please input postcode"] },
    approved: { type: Boolean, default: false, required: true },
    userRole: { type: String, required: [true, "Please choose role"] },
    interests: {
      type: Array,
      required: [true, "Please choose some Interests"],
    },
    lastVisit: {
      type: Array,
      required: false,
    },
    latitude: { type: Number },
    longitude: { type: Number }    
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
