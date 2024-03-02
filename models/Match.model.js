const { Schema, model } = require('mongoose');

const matchSchema = new Schema(
  {
    users: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    restaurants: [{
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    }]
  },
  {
    timestamps: true
  }
);

const Match = model('Match', matchSchema);

module.exports = Match;
