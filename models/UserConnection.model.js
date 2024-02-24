const { Schema, model } = require('mongoose');

const userConnectionSchema = new Schema(
  {
    requester: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

const UserConnection = model('UserConnection', userConnectionSchema);

module.exports = UserConnection;
