let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose');

let Account = new Schema({
    _id: { type: Schema.ObjectId, auto: true },
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    displayName: String,
    email: String
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);