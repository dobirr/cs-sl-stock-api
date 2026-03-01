import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { env } from '../config/env.js';

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

export const loginUserService = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error('Email and password are required');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const jwtToken = jwt.sign({ sub: user._id.toString(), email: user.email }, env.jwtSecret, {
    expiresIn: '5h',
  });

  return {
    token: jwtToken,
    user: { id: user._id, email: user.email },
  };
};

export const getMeService = async (userId) => {
  if (!userId) {
    const error = new Error('User id is required');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return {
    id: user._id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
