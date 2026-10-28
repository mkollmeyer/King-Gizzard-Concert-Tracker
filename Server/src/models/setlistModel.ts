import mongoose from 'mongoose';

// Define the structural schema for a single document
const setSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'User ID is required'],
      trim: true
    },
    songs: {
      type: Map,
      of: Number,
      required: [true, 'Song count is required']
    },
    cities: {
      type: Map,
      of: Number,
      required: [true, 'Cities are required']
    },
    numofSongs: {
        type: Number,
        required: [true, 'Number of songs is required']
    },
  },
  {
    timestamps: true
  }
);

export interface show {
  setlist: Record<string, number>;
  city: Record<string, number>;
  num_songs: Number;
};

// Compile and export the model to handle queries against the 'setlists' collection
export const Setlist = mongoose.model('Setlist', setSchema);