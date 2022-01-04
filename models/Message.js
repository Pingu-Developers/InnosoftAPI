const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    avatar: {
      type: String
    }
  }
);

const MessageSchema = new Schema(
  {
    text: {
      type: String,
      required: true
    },
    datetime: {
      type: Date,
      required: true
    },
    room: {
      type: String,
      required: true
    },
    user: {
      type: UserSchema,
      required: true
    }
  }
);

module.exports = mongoose.model('Message', MessageSchema);
