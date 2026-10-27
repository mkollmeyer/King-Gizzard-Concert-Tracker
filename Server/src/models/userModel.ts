import mongoose from 'mongoose';

// Define the structural schema for a single document
const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'User ID is required'],
      unique: true,
      trim: true
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long']
    }
  },
  {
    timestamps: true
  }
);

// Compile and export the model to handle queries against the 'users' collection
export const Users = mongoose.model('Users', userSchema);