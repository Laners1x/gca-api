const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  discordId: { type: String, required: true, index: true  },
  userName: { type: String, required: true, index: true  },
  robloxId: { type: Number, required: true, index: true  },
  verified: { type: Boolean, default: false, index: true  },
  signedTo: { type: String, default: null, index: true  },
  contractStatus: {type: String, default: "N/A", index: true},
  rating: { type: String, default: 'N/A', index: true  },
  fine: {
  type: [{
    reason: String,
    amount: Number,
    date: { type: Date, default: Date.now }
  }],
  default: [],
  index: true
  },
  fineHistory: { 
  type: 
    [{
    amount: Number,
    reason: String,
    date: { type: Date, default: Date.now }
  }], 
  default: [], index: true  },
  banned: { type: Boolean, default: false, index: true  },
  signedHistory: { 
    type: [
      {
        teamName: String,
        _id: mongoose.Schema.Types.ObjectId,
      }
    ], 
    default: [] , index: true 
  }
}, { timestamps: true , collection: 'playerdata'});

module.exports = mongoose.model('Player', playerSchema);