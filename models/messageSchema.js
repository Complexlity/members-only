const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxLength: 30,
      minLength: 8,
    },
    body: {
      type: String,
      required: true,
      maxLength: 50,
      minLength: 10,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
