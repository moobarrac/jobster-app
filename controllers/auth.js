const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJwtToken();
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      token,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  const isPasswordCorrect = await user.createPassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  const token = user.createJwtToken();
  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      token,
    },
  });
};

const updateUser = async (req, res) => {
  const {
    body: { email, location, lastName, name },
    user: { userId },
  } = req;
  if (!email || !name || !lastName || !location) {
    throw new BadRequestError("Please provide all vlaues");
  }
  const user = await User.findByIdAndUpdate({ _id: userId }, req.body, {
    new: true,
    runValidators: true,
  });
  const token = user.createJwtToken();

  res.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      token,
    },
  });
};

module.exports = {
  register,
  login,
  updateUser,
};
