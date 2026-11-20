
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log('JWT_SECRET loaded:', Boolean(process.env.JWT_SECRET));
    console.log('Authorization header present:', Boolean(authHeader));

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];

    console.log('Token present:', Boolean(token));

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    console.log('JWT verification successful');

    next();

  } catch (error) {
    console.error('JWT Verification Error:', error.name);
    console.error('JWT Error Message:', error.message);

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
};
