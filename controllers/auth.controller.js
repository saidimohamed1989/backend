const Role = require("../models/Role");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const removeUploadimg = require("../utils/removeUploadimg");
// -----------------------REGISTER---------------
exports.register = async (req, res) => {
  try {
    const { userName, email, password, phone, roleTitre } = req.body;
    //!image
    let profilePic = null;
    if (req.file) {
      profilePic = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }
    //console.log(profilePic)
    //check email exist
    const existUser = await User.findOne({ email }).populate("role");
    if (existUser) {
      removeUploadimg(req.file);      
      return res.status(400).json({
        success: false,
        errors: [{ message: "Email already exists" }],
      });
    }
    //role exist +normalisation
    if (!roleTitre || typeof roleTitre !== "string") {
      removeUploadimg(req.file);
      return res.status(400).json({
        success: false,
        errors: [{ message: "Role required!!" }],
      });
    }
    
    const normRoleTitre = roleTitre.trim().toUpperCase();
    console.log("normRoleTitre",normRoleTitre);
    const existRole = await Role.findOne({ titre: normRoleTitre });
    console.log("existRole",existRole);
    if (!existRole) {
       removeUploadimg(req.file);
      return res.status(400).json({
        success: false,
        errors: [{ message: "Role Invalid" }],
      });
    }
    // console.log(existRole)
    //todohash password
    const hashedPassword = await bcrypt.hash(password, 10);
    //creation user
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      phone,
      //!rajouter l'image
      profilePic,
      role: existRole._id,
    });
    //save
    await newUser.save();
    //response success
    res.status(201).json({
      sucess: true,
      message: ["User registerd successfully"],
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      errors: [{ message: "Fail to create user!!" }],
    });
  }
};  


// -----------------------LOGIN---------------
exports.login = async (req, res) => {
  try {
    //check du email?
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email }).populate("role");
    console.log(foundUser);
    if (!foundUser) {
      return res.status(400).json({
        success: false,
        errors: [{ message: "Bad Credentials 1" }],
      });
    }

    //compare password
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        errors: [{ message: "Bad Credentials 2" }],
      });
    }

    //!token
    const token = jwt.sign(
      { id: foundUser._id, role: foundUser.role.titre },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    //store token in cookie
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
      });   
    //response
    res.status(200).json({
      success: true,
      message: ["Login successuffully!"],
      user: foundUser,
   
    });

  } catch (error) {
     removeUploadimg(req.file);
    // error
    res.status(500).json({
      success: false,
      errors: [{ message: "Fail to connect user!!" }],
    });
  }
};

//logout
exports.logout = (req, res) => {
    try{

    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.status(200).json({
        success: true,
        message: ["Logout successfully!"],
    });
    }catch(error){
        res.status(500).json({
            success: false,
            errors: [{ message: "Fail to logout user!!" }],
        });
    }
};

//current user
exports.currentUser = async (req, res) => {
    try {
      const foundUser = await User.findById(req.user.id).populate("role");
      if (!foundUser) {
        return res.status(404).json({
          success: false,
          errors: [{ message: "User not found." }],
        });
      }
      return res.status(200).json({
        success: true,
        user: foundUser,
      }); 
    } catch (error) {
      res.status(500).json({
        success: false, 
        errors: [{ message: "Server error." }],
      });
    }
};