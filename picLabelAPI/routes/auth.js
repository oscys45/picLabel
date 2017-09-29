let express = require('express');
let router = express.Router();
let passport = require('passport');
let jwt = require('jsonwebtoken');
let JwtStrategy = require("passport-jwt").Strategy;
let ExtractJwt = require("passport-jwt").ExtractJwt;

let Account = require('../models/account');

// Configure passport
let jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
jwtOptions.secretOrKey = 'myJwtSecret';

passport.use(new JwtStrategy(jwtOptions, (payload, next) => {

    Account.findOne({ username: payload.user.username }, (err, account) => {
        if (account) {
            next(null, account);
        } else {
            next(null, false);
        }
    });
}));

/**
 * Authenticate user, return a token.
 * TODO:  Add last login date.
 */
router.post('/',

    (req, res) => {
        let username = "";

        if (req.body.username && req.body.password) {
            username = req.body.username;
        } else {
            res.status(401).json({ success: false, message: "Missing username or password" });
        }

        Account.findOne({ username: username }, (err, account) => {
            if (!account) {
                res.status(401).json({ success: false, message: "User not found" });
            }

            account.comparePassword(req.body.password, (err, isMatch) => {
                if (isMatch && !err) {
                    // Create token if the password matched and no error was thrown
                    let token = jwt.sign({ user: account }, jwtOptions.secretOrKey, { expiresIn: "2 days" });

                    res.status(200).json({
                        success: true,
                        message: 'Authentication successful',
                        token: token
                    });
                } else {
                    res.status(401).json({ success: false, message: err });
                }
            });
        });
    });

/**
 * Register new user.
 */
router.post('/register',
    (req, res) => {
        let newUser = new Account({ username : req.body.username,
                                    password: req.body.password,
                                    firstName: req.body.firstName,
                                    lastName: req.body.lastName,
                                    displayName: req.body.displayName,
                                    email: req.body.email,
                                    roles: req.body.roles});
        newUser.save((err, account) => {
            if (err) {
                return res.json({ success: false, message: err});
            }

            let token = jwt.sign({ user: account }, jwtOptions.secretOrKey, { expiresIn: "2 days" });
            res.json({
                success: true,
                message: 'Registration/authentication successful',
                token
            });
        });
    });

module.exports = router;
