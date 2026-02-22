import bcrypt from 'bcrypt';
import { User } from '../models/user.model.js';

const SALT_ROUNDS = 10;

const hashPassword = async (password) => bcrypt.hash(password, SALT_ROUNDS);

export const registerUserService = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error('Email and password are required');
    error.statusCode = 400;
    throw error;
  }

  const UserExists = await User.findOne({ email });

  if (UserExists) {
    const error = new Error('Email is already in use');
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await hashPassword(password);

  const newUser = new User({ email, passwordHash });
  await newUser.save();

  return {
    id: newUser._id,
    email: newUser.email,
  };
};
