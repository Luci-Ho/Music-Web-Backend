import bcrypt from "bcryptjs";
import User from "../models/User.model.js";

const SALT_ROUNDS = 10;

// GET /api/users?search=abc
export const getAllUsers = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const filter = {};
    if (search?.trim()) {
      const q = search.trim();
      filter.$or = [
        { username: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
        { role: { $regex: q, $options: "i" } },
      ];
    }

    // password select:false => không trả ra
    const users = await User.find(filter)
      .select("_id legacyId username email phone role favorites playlists createdAt")
      .sort({ createdAt: -1 })
      .limit(200);

    return res.json(users);
  } catch (e) {
    console.error("getAllUsers error:", e);
    return res.status(500).json({ message: "Failed to get users" });
  }
};

// GET /api/users/:_id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params._id).select(
      "_id legacyId username email phone role favorites playlists createdAt"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (e) {
    console.error("getUserById error:", e);
    return res.status(500).json({ message: "Failed to get user" });
  }
};

// POST /api/users
export const createUser = async (req, res) => {
  try {
    const { legacyId, username, email, phone, role = "user", password } = req.body;

    if (!username?.trim()) return res.status(400).json({ message: "username is required" });
    if (!email?.trim()) return res.status(400).json({ message: "email is required" });
    if (!phone?.trim()) return res.status(400).json({ message: "phone is required" });
    if (!password) return res.status(400).json({ message: "password is required" });

    const normalizedEmail = email.trim().toLowerCase();

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) return res.status(409).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      legacyId: legacyId?.trim() || undefined,
      username: username.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      role,
      password: hashed,
      favorites: [],
      playlists: [],
    });

    return res.status(201).json({
      _id: user._id,
      legacyId: user.legacyId,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      favorites: user.favorites,
      playlists: user.playlists,
      createdAt: user.createdAt,
    });
  } catch (e) {
    console.error("createUser error:", e);

    // handle mongoose duplicate key
    if (e?.code === 11000) {
      const key = Object.keys(e.keyPattern || {})[0] || "field";
      return res.status(409).json({ message: `Duplicate ${key}` });
    }

    return res.status(500).json({ message: "Failed to create user" });
  }
};

// PATCH /api/users/:_id
export const updateUser = async (req, res) => {
  try {
    const { legacyId, username, email, phone, role, password } = req.body;

    const update = {};
    if (typeof legacyId === "string") update.legacyId = legacyId.trim() || undefined;
    if (typeof username === "string") update.username = username.trim();
    if (typeof email === "string") update.email = email.trim().toLowerCase();
    if (typeof phone === "string") update.phone = phone.trim();
    if (typeof role === "string") update.role = role;

    if (typeof password === "string" && password.length > 0) {
      update.password = await bcrypt.hash(password, SALT_ROUNDS);
    }

    const user = await User.findByIdAndUpdate(req.params._id, update, {
      new: true,
      runValidators: true,
    }).select("_id legacyId username email phone role favorites playlists createdAt");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(user);
  } catch (e) {
    console.error("updateUser error:", e);

    if (e?.code === 11000) {
      const key = Object.keys(e.keyPattern || {})[0] || "field";
      return res.status(409).json({ message: `Duplicate ${key}` });
    }

    return res.status(500).json({ message: "Failed to update user" });
  }
};

// DELETE /api/users/:_id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params._id).select(
      "_id legacyId username email phone role createdAt"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "Deleted", user });
  } catch (e) {
    console.error("deleteUser error:", e);
    return res.status(500).json({ message: "Failed to delete user" });
  }
};
