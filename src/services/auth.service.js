import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.model.js";

const genAccessToken = (user) =>
  jwt.sign(
    { id: user._id, level: user.level },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

const genRefreshToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

export const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Wrong password");

  const accessToken = genAccessToken(user);
  const refreshToken = genRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken, user };
};

export const refresh = async (token) => {
  const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(payload.id);
  if (!user || user.refreshToken !== token)
    throw new Error("Invalid refresh token");

  return genAccessToken(user);
};
