let bcrypt = require('bcrypt');
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Account = new Schema({
    _id: { type: Schema.ObjectId, auto: true },
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    displayName: String,
    email: String,
    roles: [String]
});

// pre-Save, hash password.
Account.pre('save', function(next) {

    bcrypt.genSalt(10, (err, salt) =>{
        if (err) {
            return next(err);
        }
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }

            this.password = hash;
            next();
        });
    });
});

Account.methods.comparePassword = function(pw, cb) {

    bcrypt.compare(pw, this.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('Account', Account);