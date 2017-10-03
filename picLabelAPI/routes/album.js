let express = require('express');
let passport = require('passport');
let sharp = require('sharp');
let router = express.Router();
let Album = require('../models/album');

/**
 * Get all albums for user.
 */
router.get('/users/:userId',
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        let query = { accountId: req.params.userId };

        Album.find(query, (err, files) => {
            res.json(files);
        });
    });

/**
 * Get single album.
 */
router.get('/:albumId',
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        let query = { _id: req.params.albumId };

        Album.find(query, (err, files) => {
            res.json(files);
        });
    });

/**
 * Insert a single album.
 */
router.post('/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        let album = new Album( req.body );

        album.save();

        res.json({
            success: true,
            message: 'Album save successful',
            album: album
        });
    });

/**
 * Update album.
 */
router.put('/:albumId',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        let query = { _id: req.params.albumId };

        Album.update(query,
            { imageId: req.body.imageId,
              shareWithAccountId: req.body.shareWithAccountId,
              name: req.body.name,
              lastModified: req.body.lastModified
            },
            { },
            (err, doc) => {
                res.json({
                    success: true,
                    message: 'Album save successful'
                });
            });
    });

module.exports = router;