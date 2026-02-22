import { registerUserService } from '../services/auth.service.js';

export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const newUser = await registerUserService({ email, password });

    return res.status(201).json(newUser);
  } catch (error) {
    return next(error);
  }
};
