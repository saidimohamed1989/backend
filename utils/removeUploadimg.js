const fs = require('fs');

const removeUploadimg = (file) => {
    if(!file || !file.path) return;
    fs.unlink(file.path, (err) => {
        if (err && err.code !== 'ENOENT') {
            console.error(`Error deleting file `, err.message);
        }
    });
};
    module.exports = removeUploadimg;
