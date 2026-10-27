import mongoose from 'mongoose';

// Define the structural schema for a single document
const modelSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'ID is required'],
      unique: true,
      trim: true
    },
    userID: {
      type: String,
      required: [true, 'User ID is required'],
      trim: true
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiration time is required']
    }
  },
  {
    timestamps: true
  }
);

export interface Session {
  id: string;
  userID: string;
  expiresAt: Date;
};

// Compile and export the model to handle queries against the 'users' collection
export const sessions = mongoose.model('Sessions', modelSchema);