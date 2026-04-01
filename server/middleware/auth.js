const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Authentication required" });

  try {
    const secret = process.env.JWT_SECRET || "your_jwt_secret_here";
    const payload = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
