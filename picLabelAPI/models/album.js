let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Album = new Schema({
    _id: { type: Schema.ObjectId, auto: true },
    accountId: Schema.ObjectId,
    imageId: [Schema.ObjectId],
    shareWithAccountId: [Schema.ObjectId],
    name: String,
    lastModifiedDate: Date
});

module.exports = mongoose.model('Album', Album);