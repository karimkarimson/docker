// console.log("####### USER CREATED:    " + process.env.MONGODB_ROOT);
// console.log("####### PASSWORD CREATED:    " + process.env.MONGODB_PASSWD);
// db.createRole({
//   role: "admin",
//   privileges: [
//      { resource: { <resource> }, actions: [ "<action>", ... ] },
//      ...
//   ],
//   roles: [
//      { role: "<role>", db: "<database>" } | "<role>",
//       ...
//   ],
//   authenticationRestrictions: [
//     {
//       clientSource: ["<IP>" | "<CIDR range>", ...],
//       serverAddress: ["<IP>" | "<CIDR range>", ...]
//     },
//     ...
//   ]
// });
db.createUser({user: 'karim', pwd: 'diesesmotdepasse3veryschwer', roles: [{role: 'root', db: 'admin'}]})