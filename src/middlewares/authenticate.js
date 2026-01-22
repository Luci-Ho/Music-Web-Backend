import jwt from 'jsonwebtoken';

export const authenticateOptional = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = decoded;
    } catch (err) {
      req.user = null;
    }
  }

  next();
};
 //middleware cho user chưa đăng nhập vẫn xem được home page