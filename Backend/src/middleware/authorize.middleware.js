const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized Access",
        });
      }

      // Check if user's role is allowed
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden: You do not have permission to access this resource",
        });
      }

      next();
    } catch (error) {
      console.error("Authorization Error:", error);

      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
};

export default authorize;
