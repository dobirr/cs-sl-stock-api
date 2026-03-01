import { loginUserService, registerUserService, getMeService } from '../services/auth.service.js';

export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const newUser = await registerUserService({ email, password });

    return res.status(201).json(newUser);
  } catch (error) {
    return next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await loginUserService({ email, password });

    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const me = await getMeService(req.user.id);
    return res.status(200).json(me);
  } catch (error) {
    return next(error);
  }
};
