// console.clear('');

import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import AppRouter from './router'
import dbConnect from './database'

import nodemailer from 'nodemailer'
import {createSMTPServer} from './config'
// const mailgun = require("mailgun-js");
import mailgun from 'nodemailer-mailgun-transport'



import path from 'path'

//multer for image upload
import multer from 'multer'

const PORT = process.env.PORT || 3000;
const app = express();
app.server = http.createServer(app);


app.use(morgan('dev'));

app.use(cors({
    exposedHeaders: "*"
}));

app.use(express.json({
    limit: '50mb'
}));

//Storage path 
const storageDir = path.join(__dirname, '..', 'storage')
let [month, date, year] = new Date().toLocaleDateString("en-US").split("/")

//Set storage config with multer.diskStorage
const storageConfig = multer.diskStorage({

    destination: (req, file, callback) => {
        callback(null, storageDir)
    },
    filename: (req, file, callback) => {
        let fileName = file.originalname.toString().slice(0, -4)

        // callback(null, fileName + "_" + Date.now() + path.extname(file.originalname))
        callback(null, file.originalname)
    }
})

//Storage Stream to upload 
const upload = multer({ storage: storageConfig })
 // create reusable transporter object using the default SMTP transport
const email = nodemailer.createTransport(mailgun(createSMTPServer));

app.set('root', __dirname);
app.set('storageDir', storageDir)
app.set('upload', upload)
app.email = email


/**
 * connect callback comming from database.js
 * @param app to set app('db', client)
 * @param db
 */

dbConnect(app, (client) => {

    if (client.connect()) {

        console.log('Database connected...')
    }

    new AppRouter(app)
        // app.set('db', client)
    app.server.listen(PORT, () => {
        console.log(`App is running on port ${app.server.address().port}`);
    });

})


//init AppRouter class instance from router.js


// } else {
//     console.log(err + ' Database connection error, please check log')
//     throw (err);

// }






//listling server 

export default app;

// const MongoClient = require('mongodb').MongoClient;