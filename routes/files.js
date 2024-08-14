const express = require('express');
const mongoose = require('mongoose');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
const { storage, getGfs } = require('../db');


const upload = multer({ storage });

// Route 1: Add a new file using: POST "/api/files/addfile". login required
router.post('/addfile', upload.single('file'), (req, res) => {

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // const userId = req.body.userId
    // console.log('Body:', userId);
    // console.log('File info:', req.file);
    
    res.json({ file: req.file });

  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'An error occurred while uploading the file' });
  }
});


// Route 2: Get all the files using: GET "/api/files/getfiles". login required

router.get('/getfiles/:userId', async (req, res) => {

  const userId = req.params.userId;
  // console.log('Received userId:', userId);
  const gfs = getGfs();

  try {

    if (!gfs) {
      return res.status(500).json({ error: 'GridFS not initialized' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    console.log(userId)

    const files = await gfs.collection('uploads.files').find({ 'metadata.userId': new mongoose.Types.ObjectId(userId) }).toArray();
    console.log('Files found:', files);
   
    
    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'No files found for the given user' });
    }

    res.json(files);

  } catch (error) {
    console.error('Error retrieving files:', error);
    res.status(500).json({ error: 'An error occurred while retrieving the files' });
  }
});


// Route 3: DELETE an existing file using: DELETE "/api/notes/deletefile". login required

router.delete('/deletefile/:id', fetchuser, async (req, res) => {

  try {
    const fileID = req.params.id;
    console.log(fileID)
    
    const gfs = getGfs();
    if (!gfs) {
      return res.status(500).json({ error: 'GridFS not initialized' });
    }

    const objectId = new mongoose.Types.ObjectId(fileID);
    console.log('Converted ObjectId:', objectId);

    const file = await gfs.collection('uploads.files').findOne({ _id: objectId });
    
    console.log(file)
    if (!file) {
      return res.status(404).send('File not found');
    }

    if (file.metadata.userId.toString() !== req.user.id) {
      return res.status(401).send('Not authorized');
    }

    await gfs.collection('uploads.files').deleteOne({ _id: objectId });
    await gfs.collection('uploads.chunks').deleteMany({ files_id: objectId });

    res.json({ message: 'File deleted successfully' });

  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;