import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

//check json web token
export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Bạn chưa đăng nhập hoặc thiếu token'
    });
  }

  try {
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload?.id) {
      return res.status(401).json({
        message: 'Token không hợp lệ'
      });
    }

    const user = await User.findById(payload.id).select('-password');
    if (!user) {
      return res.status(401).json({
        message: 'Tài khoản không tồn tại'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Token đã hết hạn hoặc không hợp lệ'
    });
  }
};

//phân quyền
export const authorizeRole = (roles = []) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: 'Bạn chưa đăng nhập'
    });
  }

  if (!roles.length) return next();

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      message: 'Bạn không có quyền thực hiện chức năng này'
    });
  }

  next();
};

export default { authenticate, authorizeRole };
