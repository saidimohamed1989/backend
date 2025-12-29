const Role = require('../../models/Role');


async function seedRoles() {
    try {
       const count = await Role.countDocuments();
       if (count > 0) {
              console.log("Roles already seeded");
              return;
       }
       await Role.insertMany([
           { titre: 'ADMIN', permission: []},
         { titre: 'RECRUT', permission: []},
           { titre: 'AGENT', permission: []}
       ]);
       console.log("Roles seeded successfully");
    } catch (error) {
        console.error("Error seeding roles:", error);
    }
}   
//seedRoles();
module.exports = seedRoles;
