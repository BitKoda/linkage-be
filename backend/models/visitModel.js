const mongoose = require("mongoose");
const { Schema } = mongoose;

const visitSchema = Schema(
  {
    volunteerId: {
      type: Schema.Types.ObjectId,
      required: [true, "please input volunteerId"],
    },
    volunteerFirstName: {
      type: Schema.Types.String,
      required: [true, "Please input first name"],
    },
    volunteerLastName: {
      type: Schema.Types.String,
      required: [true, "Please input last name"],
    },
    visiteeId: {
      type: Schema.Types.ObjectId,
      required: [true, "please input visiteeId"],
    },
    visiteeFirstName: {
      type: Schema.Types.String,
      required: [true, "Please input first name"],
    },
    visiteeLastName: {
      type: Schema.Types.String,
      required: [true, "Please input last name"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Visit", visitSchema);
