import fs from 'fs';
import Jimp = require('jimp');

/*
 * filterImageFromURL
 *
 * Helper function that downloads, filters, and saves the image locally ad returns absolute path of the local image
 *
 * :params
 *      inputURL: string - an image url file
 * :return
 *      an absolute path of locally saved image file
 *
 * */
export async function filterImageFromURL(inputURL: string): Promise<string> {

    return new Promise(async resolve => {

        const photo = await Jimp.read(inputURL);

        const outPath = '/tmp/filtered.' + Math.floor(Math.random() * 2000) + '.jpg';

        await photo
            .resize(256, 256) // resize
            .quality(60) // set JPEG quality
            .greyscale() // set greyscale
            .write(__dirname + outPath, (img) => {
                resolve(__dirname + outPath);
            });
    });
}

/*
 * deleteLocalFiles
 *
 * Helper function to delete files on the local disk
 *
 * :input
 *      files: Array<string> an array of absolute paths of files
 * */
export async function deleteLocalFiles(files: Array<string>) {
    for (let file of files) {
        fs.unlinkSync(file);
    }
}