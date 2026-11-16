
import jwt from 'jsonwebtoken';
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // Check whether the token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }
    // Extract the JWT
    const token = authHeader.split(' ')[1];
    // Verify the JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    // Attach authenticated user information to request
    req.user = decoded;
    // Continue to the controller
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
};
