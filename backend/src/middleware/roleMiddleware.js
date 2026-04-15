// Restrict access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user is populated by the 'protect' middleware called before this
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};