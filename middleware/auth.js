const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Get the access token from the request header
    const accessToken = req.header('Authorization').replace('Bearer ', '');

    if (!accessToken) {
      return res.status(401).json({ error: 'Access token not found' });
    }

    // Verify the access token
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

    // Add the decoded data to the request object for later use
    req.user = decoded;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid access token' });
  }
};

module.exports = authMiddleware;
