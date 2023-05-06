const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    author: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxLength: 50,
      minLength: 1,
    },
    body: {
      type: String,
      required: true,
      maxLength: 200,
      minLength: 1,
    },
  },
  { timestamps: true, sort: { createdAt: -1 } }
);

module.exports = mongoose.model("Message", MessageSchema);
