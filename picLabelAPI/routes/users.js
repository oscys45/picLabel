let express = require('express');
let router = express.Router();
let passport = require('passport');

let Account = require('../models/account');

/**
 * Get all users
 */
router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    Account.find({}, (err, users) => {
        res.json(users);
    });
});

/**
 * Get single user.
 */
router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.send('respond with a resource');
});

module.exports = router;