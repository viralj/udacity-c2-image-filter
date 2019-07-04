import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import * as EmailValidator from 'email-validator';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

const TEST_EMAIL = "test@user.com";
const TEST_PASS = "ThisIsMyPassw0rd";

(async () => {

    const app = express();

    const port = process.env.PORT || 8082; // env port or default port to listen

    app.use(bodyParser.json());

    // to check of url contain an image file type?
    const isImageUrl = require('is-image-url');

    // Verify URL if it exist?
    const urlExists = require('url-exists-deep');


    //VERY BAD
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    // Root URI call
    app.get("/", async (req, res) => {
        res.send("Try /filteredimage?image_url=\"\" with actual image url.")
    });


    // Filter an image based on a public url
    app.get("/filteredimage", async (req: Request, res: Response) => {
        const email = req.body.email;
        const password = req.body.password;

        // This is not secure way to handle email and password but I had to save constants as some of my tests were
        // not picking system env variables

        // Verifying email and password, validating email address
        if (!email || !password || !EmailValidator.validate(email)) {
            return res.status(400).send({auth: false, message: `Failed to authenticate request.`});
        }

        if (email !== (process.env.SERVER_USER || TEST_EMAIL)) {
            return res.status(400).send({auth: false, message: `Failed to authenticate request.`});
        }
        if (password !== (process.env.SERVER_PASSWORD|| TEST_PASS)) {
            return res.status(400).send({auth: false, message: `Failed to authenticate request.`});
        }

        // publicly accessible image URL
        const {image_url} = req.query;

        // Verifying image_url query and validating url
        if (!image_url || !isImageUrl(image_url)) {
            return res.status(400).send('`image_url` is required!');
        }

        // Validating image_url
        urlExists(image_url).then(function (exists: { href: any; }) {
            if (!exists) {
                return res.status(400).send('The `image_url` is bad!');
            } else {

                // Filter the image using helper function
                filterImageFromURL(image_url).then((data) => {

                    // Send the filtered image file in the response
                    return res.sendFile(data, {}, function (err) {
                        if (err) {
                            return res.status(500).send('Something went wrong!');
                        } else {

                            // Deleting file using helper function
                            deleteLocalFiles([data]).catch((err) => {
                                if (err) {
                                    return res.status(400).send('The `image_url` is bad!');
                                }
                            });
                        }
                    });
                }).catch((err) => {
                    if (err) {
                        return res.status(500).send('Something went wrong!');
                    }
                })
            }
        });
    });


    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${ port }`);
        console.log(`press CTRL+C to stop server`);
    });
})();