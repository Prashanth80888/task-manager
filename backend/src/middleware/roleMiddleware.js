export const authorize = (...roles) => {
  return (req, res, next) => {
    // Fallback to 'user' if role is missing for some reason
    const userRole = req.user?.role || 'user'; 

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        message: `Access Denied: Role '${userRole}' unauthorized.`,
      });
    }
    next();
  };
};