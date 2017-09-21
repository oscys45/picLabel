let express = require('express');
let router = express.Router();

let Account = require('../models/account');

/**
 * Get all users
 */
router.get('/', (req, res, next) => {
    Account.find({}, (err, users) => {
        res.json(users);
    });
});

/**
 * Get single user.
 */
router.get('/:id', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;