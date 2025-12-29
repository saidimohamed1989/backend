const jwt = require("jsonwebtoken");
const User = require("../models/User");
const isAuth = async(req, res, next) => {
  try {
   // verify config
   if(!process.env.JWT_SECRET){  
    return res.status(500).json({
        success: false,
        errors: [{ message: "JWT_SECRET is not defined in environment variables!" }],
      });
   }
   //get token from cookies
   const token = req.cookies.token;  
    if (!token) {
        return res.status(401).json({
            success: false,
            errors: [{ message: "Access denied! No token provided." }],
          });
    }
    //decode token
    let decoded = jwt.verify(token, process.env.JWT_SECRET); 
    //user existence
    const foundUser = await User.findById(decoded.id).populate("role");
    if (!foundUser) {
        return res.status(404).json({
            success: false,
            errors: [{ message: "User not exist." }],
          });
    }
  req.user ={
    id: foundUser._id,
    role: foundUser.role.titre
  }
    next(); 
  } catch (error) {
    res.status(500).json({
        success: false,
        errors: [{ message: "server failed!" }],
        });
  }
};
module.exports = isAuth;