const { Schema, model } = require('mongoose');

const matchSchema = new Schema(
  {
    user: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
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
