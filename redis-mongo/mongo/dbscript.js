db = connect( 'mongodb://localhost/' );
db.admin.createUser({
    user: 'karim',
    pwd: 'diesesmotdepasse3veryschwer',
    role: [{role: 'root', db: 'admin'}]
});
db.karim.createUser({
    user: 'karim',
    pwd: 'diesesmotdepasse3veryschwer',
    role: [{role: 'dbOwner', db: 'karim'}]
});