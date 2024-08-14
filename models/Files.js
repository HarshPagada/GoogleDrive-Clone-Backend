// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const FileSchema = new Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',  // Reference to the user who owns the file
//         required: true
//     },
//     name: {
//         type: String,
//         required: true
//     },
//     //   path: {
//     //     type: String,  // Can be used for hierarchical paths or URLs
//     //     required: true
//     //   },
//     type: {
//         type: String,  // MIME type, e.g., 'image/jpeg', 'video/mp4'
//         required: true
//     },
//     size: {
//         type: Number,  // Size of the file in bytes
//         required: true
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now
//     },
//     //   parentFolder: {
//     //     type: mongoose.Schema.Types.ObjectId,
//     //     ref: 'Folder'  // Reference to the parent folder (if any)
//     //   },
//     //   sharedWith: [{
//     //     user: {
//     //       type: mongoose.Schema.Types.ObjectId,
//     //       ref: 'User'
//     //     },
//     //     permission: {
//     //       type: String,  // e.g., 'read', 'write'
//     //       default: 'read'
//     //     }
//     //   }],
//     //   version: {
//     //     type: Number,
//     //     default: 1  // To keep track of file versions
//     //   }
// });

// module.exports = mongoose.model('Files', FileSchema);
