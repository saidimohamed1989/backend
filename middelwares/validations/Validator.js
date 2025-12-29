const {validationResult} = require("express-validator");
const removeUploadimg = require("../../utils/removeUploadimg");

module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        removeUploadimg(req.file);
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({message: err.msg})),

        });
    }
    next();
}