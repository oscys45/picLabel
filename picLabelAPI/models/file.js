let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let File = new Schema({
    _id: { type: Schema.ObjectId, auto: true },
    accountId: Schema.ObjectId,
    src: String,
    thumbSrc: String,
    lastModified: Number,
    lastModifiedDate: Date,
    name: String,
    type: String
});

module.exports = mongoose.model('File', File);