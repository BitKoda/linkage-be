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
    password: { type: String, required: [true, "please input password"] },
    postcode: { type: String, required: [true, "please input postcode"] },
    approved: { type: Boolean, default: false, required: true },
    userRole: { type: String, required: [true, "Please choose role"] },
    avatar_url: {
      type: String,
      default:
        "https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?k=20&m=1214428300&s=170667a&w=0&h=NPyJe8rXdOnLZDSSCdLvLWOtIeC9HjbWFIx8wg5nIks=",
      required: false,
    },
    interests: {
      type: Array,
      default: [],
      required: [true, "Please choose some Interests"],
    },
    needs: {
      type: Array,
      default: [],
    },
    bio: {
      type: String,
      default: "",
    },
    age: {
      type: Number,
      default: 75,
    },
    lastVisit: {
      type: Array,
      default: [],
      required: false,
    },
    latitude: { type: Number },
    longitude: { type: Number },
  },

  {
    timestamps: true,
  }
);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.__v;

    delete returnedObject.password;
  },
});

module.exports = mongoose.model("User", userSchema);
