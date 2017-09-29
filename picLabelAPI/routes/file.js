let express = require('express');
let passport = require('passport');
let sharp = require('sharp');
let router = express.Router();
let File = require('../models/file');

/**
 * Get all files for user.
 */
router.get('/users/:userId',
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        let query = { accountId: req.params.userId };

        File.find(query, (err, files) => {
            res.json(files);
        });
    });

/**
 * Get single file.
 */
router.get('/:fileId',
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        res.send(req.params.fileId);
    });

/**
 * Insert a single file.
 */
router.post('/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        let file = new File( req.body );
        let srcBuffer = new Buffer(file.src.replace(/^data:image\/jpeg;base64,/, ""), 'base64');

        // Resize for a thumbnail.
        sharp(srcBuffer).resize(130, 100).max().toBuffer((err, output) => {
            if (err) {
                throw err;
            }

           file.thumbSrc = "data:image/jpeg;base64," + output.toString('base64');
           file.save();

            res.json({
                success: true,
                message: 'File save successful',
                file: file
            });
        });


    });

/**
 * Update file.  All we ever update is src because that's what contains the Exifs.  Name, too.
 */
router.put('/:fileId',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        let query = { _id: req.params.fileId };

        File.update(query,
                    { src: req.body.src,
                      name: req.body.name },
                    { },
                    (err, doc) => {
                    res.json({
                        success: true,
                        message: 'File save successful'
                    });
        });
});

module.exports = router;