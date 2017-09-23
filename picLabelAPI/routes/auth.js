let express = require('express');
let router = express.Router();
let passport = require('passport');
let jwt = require('jsonwebtoken');
let LocalStrategy = require('passport-local').Strategy;

let Account = require('../models/account');

// Configure passport
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

/**
 * Authenticate user, return a token.
 */
router.post('/',
    passport.authenticate('local'),
    (req, res) => {
        let token = jwt.sign({user: req.user}, 'myJwtSecret', { expiresIn: "2 days" });
        res.json({
            success: true,
            message: 'Authentication successful',
            token: token
        });
    });

/**
 * Register new user.
 */
router.post('/register',
    (req, res) => {
        Account.register(new Account({ username : req.body.username,
                                       firstName: req.body.firstName,
                                       lastName: req.body.lastName,
                                        displayName: req.body.displayName,
                                        email: req.body.email}),
            req.body.password,
            (err, account) => {
                if (err) {
                    return res.render('register', { user: account });
                }

                passport.authenticate('local')
                let token = jwt.sign({user: account}, 'myJwtSecret', { expiresIn: "2 days" });
                res.json({
                    success: true,
                    message: 'Registration/authentication successful',
                    token
                });
            });
    });

module.exports = router;
