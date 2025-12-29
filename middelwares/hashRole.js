const hashRole =  (...allowedRoles) => {
    return (req, res, next) => {
            if(!req.user){
                return  res.status(401).json({
                    success: false,
                    errors: [{ message: "Not authorized.." }],
                  });
            }
            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    errors: [{ message: "Forbidden! You don't have enough permission." }],
                  });
            }
            next();
        }
    }
module.exports = hashRole;