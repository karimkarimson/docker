const express = require('express');
const rr = require('redis');
const mongoose = require('mongoose');
// import { createClient } from 'redis';

/*
################
* SET-UP Section
################
*/

//* Server
const xp = express();
const port = 3000;
// const host = 'localhost';


//* Redis
const redisUser = process.env.REDIS_USER;
const redisPassword = process.env.REDIS_PASSWORD;

console.log("connecting to redisdb");
const client = rr.createClient({
    url: `redis://${redisUser}:${redisPassword}@redis:6379`
    // url: `redis://[[testuser]:[testpasswordthatshouldbeververylong]]@redis:6379`
    // url: `redis://testuser:longp2@redis:6379`
});
client.connect();

//* MONGODB
const mongoUser = process.env.MONGODB_ROOT;
const mongoPassword = process.env.MONGODB_PASSWD;
const mongoPort = process.env.MONGO_PORT;
const mongoINITDB = process.env.MONGODB_INITDB;
const mongoHost = process.env.MONGODB_HOST;

const mongoDBSimple = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoINITDB}`;
// const mongoDBSimple = `mongodb://${mongoHost}:${mongoPort}/${mongoINITDB}`;
console.log("####### CONNECTION STRING:    " + mongoDBSimple);

(async () => {
    await mongoose.connect(mongoDBSimple);
        // .catch(err => console.log(err));
        // .on('connecting', () => console.log('connecting to MongoDB...'))
        // .on('connected', () => console.log('MongoDB connected!'))
        // .on('error', err => console.log('MongoDB connection error: ' + err))
        // .on('disconnecting', () => console.log('MongoDB disconnecting'));
    // console.log('MONGO DB connected');
})().catch(err => console.log(err));

//! listen to DB-Connection failure
mongoose.connection.on('error', err => {
    console.warn(err);
});

const dbDataSchema = new mongoose.Schema({
    ip: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    email: { type: String },
    data: { type: Array }
});
const Data = mongoose.model('Data', dbDataSchema);
(async () => {
    await Data.createCollection();
})();

/* 
################
* Server Routes and Functions
################
*/

xp.get('/', (req, res) => {
    res.status(200).send('Hello World!');
});

//* REDIS
xp.get('/setredis', (req, res) => {
    console.log("/setredis")
    console.log(req.ip);
    const redisKey = req.query.key;
    const redisValue = req.query.value;
    // const data = `${redisKey}:${redisValue}`
    const user = `user-${req.ip}`;
    
    // console.log(JSON.stringify(data));
    (async () => {
        await client.hSet(user, redisKey, redisValue)
            .then(console.log("redis set new value"))
            .catch(console.error);
    })();
    res.status(200).send(`Redis Key: ${redisKey} with Value: ${redisValue} has been set`);
});
xp.get('/getredis', (req, res) => {
    console.log("/getredis");

    const user = `user-${req.ip}`;
    (async () => {
        let userSession = await client.hGetAll(user);
        console.log(userSession);
        res.status(200).send(userSession);
    })();
});

//* MONGODB
xp.get('/setmongo', (req, res) => {
    console.log("/setmongo");
    const ip = req.ip;
    const date = new Date();
    const data = new Data({ip: ip, date: date, email: '', data: []});
    (async () => { 
        await Data.create(data)
            .catch(err => console.log(err));
        res.status(200).send(`MongoDB Key: ${ip} with Value: ${date} has been set`);
    })();
});
xp.get('/getmongo', (req, res) => {
    console.log("/getmongo");
    (async () => {
        const theUserID = await Data.exists({ ip: `${req.ip}`});
        // fetch User with id
        const theUser = await Data.findById(theUserID);

        if (theUser) {
            res.status(200).send(`User with ID: ${theUser} ID: ${theUserID}`);
        } else {
            res.status(204).send(`No data found for IP: ${req.ip}`);
        };
    })();
});

/*
################
* Server Start
################
*/

xp.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
    }
);