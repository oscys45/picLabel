let express = require('express');
let router = express.Router();
let passport = require('passport');

let Account = require('../models/account');

/**
 * Get all users
 */
router.get('/',
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        Account.find({}, (err, users) => {
            res.json(users);
        });
    });

/**
 * Get single user.
 */
router.get('/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        Account.find({ _id : req.params.fileId }, (err, user) => {
            res.json(user);
        });
    });

/**
 * Update user.
 */
router.put('/:userId',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        let query = {_id: req.params.userId};
        let user = new Account(req.body);

        Account.update(query,
            {
                username: user.username,
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName,
                displayName: user.displayName,
                email: user.email,
                roles: user.roles
            },
            {},
            (err, doc) => {
                res.json({
                    success: true,
                    message: 'User save successful'
                });
            });
    });

/**
 * Insert a single user.
 */
router.post('/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        let user = new Account( req.body );

        user.save();

        res.json({
            success: true,
            message: 'User save successful',
            file: file
        });
    });

module.exports = router;