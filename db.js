const mongoose = require('mongoose');

// file store
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const {GridFsStorage} = require('multer-gridfs-storage');
const path = require('path');

const mongoURI = 'mongodb://127.0.0.1:27017/google-drive';

let gfs;

const connectMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Initialize GridFS stream
    const conn = mongoose.connection;
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
    // console.log('GridFS stream initialized and collection set');

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

const storage = new GridFsStorage({
  url: mongoURI,
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

module.exports = {
  connectMongo,
  getGfs: () => gfs,
  storage
};




