const User = require('../models/User');
const Role = require('../models/Role');

// GET /api/users
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().populate('role');
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ success: false, errors: [{ message: 'Failed to fetch users' }] });
  }
};

// GET /api/users/:id
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate('role');
    if (!user) return res.status(404).json({ success: false, errors: [{ message: 'User not found' }] });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ success: false, errors: [{ message: 'Failed to fetch user' }] });
  }
};

// PUT /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, roleTitre, phone } = req.body;
    const update = {};
    if (name) update.userName = name;
    if (email) update.email = email;
    if (phone) update.phone = phone;

    // handle uploaded profile picture
    if (req.file) {
      update.profilePic = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    if (role || roleTitre) {
      let roleDoc = null;
      if (role && role.match && role.match(/^[0-9a-fA-F]{24}$/)) {
        roleDoc = await Role.findById(role);
      } else if (roleTitre || role) {
        const titre = (roleTitre || role).toString().trim().toUpperCase();
        roleDoc = await Role.findOne({ titre });
      }
      if (!roleDoc) return res.status(400).json({ success: false, errors: [{ message: 'Invalid role' }] });
      update.role = roleDoc._id;
    }

    const user = await User.findByIdAndUpdate(id, update, { new: true }).populate('role');
    if (!user) return res.status(404).json({ success: false, errors: [{ message: 'User not found' }] });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ success: false, errors: [{ message: 'Failed to update user' }] });
  }
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ success: false, errors: [{ message: 'User not found' }] });
    res.status(200).json({ success: true, message: ['User deleted'] });
  } catch (error) {
    res.status(500).json({ success: false, errors: [{ message: 'Failed to delete user' }] });
  }
};
