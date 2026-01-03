import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import Level from '../models/Level.model.js';

const genAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });

const genRefreshToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const defaultLevel = await Level.findOne({ name: 'User' });
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: passwordHash,
      level: defaultLevel ? defaultLevel._id : undefined,
    });

    const accessToken = genAccessToken(user);
    const refreshToken = genRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({ user: { id: user._id, email: user.email, username: user.username }, accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = genAccessToken(user);
    const refreshToken = genRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken, user: { id: user._id, email: user.email, username: user.username } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const refresh = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Refresh token required' });

    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== token) return res.status(401).json({ message: 'Invalid refresh token' });

    const accessToken = genAccessToken(user);
    res.json({ accessToken });
  } catch (err) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const me = async (req, res) => {
  const user = req.user;
  res.json({ id: user._id, email: user.email, username: user.username, role: user.role });
};
