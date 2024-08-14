const mongoose = require('mongoose');

// file store
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const {GridFsStorage} = require('multer-gridfs-storage');
const path = require('path');
require('dotenv').config()

const mongoURI = process.env.API_KEY;

let gfs;
let db;
let storage;

const connectMongo = async () => {
  try {
    db = await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Initialize GridFS stream
    gfs = Grid(db.connection, mongoose.mongo);
    gfs.collection('uploads');

    // Create GridFsStorage instance after db is initialized
     storage = new GridFsStorage({
      db: db,
      file: (req, file) => {
        return new Promise((resolve, reject) => {
          crypto.randomBytes(16, (err, buf) => {
            if (err) {
              return reject(err);
            }
            const filename = buf.toString('hex') + path.extname(file.originalname);
            const fileInfo = {
              filename: filename,
              bucketName: 'uploads',
              metadata: {
                userId: req.body.userId
              }
            };
            resolve(fileInfo);
          });
        });
      }
    });

    // console.log(gfs)
// console.log(db)
// console.log(storage)

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};




 // Export storage instance
 module.exports = {
  connectMongo,
  getGfs: () => gfs,
  storage
};