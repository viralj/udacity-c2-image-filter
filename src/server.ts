import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import Jimp = require('jimp');

(async () => {

  const app = express();
  const port = process.env.PORT || 8082; // default port to listen
  
  app.use(bodyParser.json());

  async function filterImageFromURL(inputURL: string): Promise<string>{
    // open a file called "lenna.png"
    return new Promise( async resolve => {
      const photo = await Jimp.read(inputURL);
      const outpath = '/tmp/filtered.'+Math.floor(Math.random() * 2000)+'.jpg';
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname+outpath, (img)=>{
          resolve(outpath);
        });
    });

  }

  async function deleteLocalFiles(files:Array<string>){
    for( let file of files) {
      fs.unlinkSync(path.join(__dirname, file));
    }
  }

  // Root URI call
  app.get( "/filteredimage", async ( req, res ) => {

    const { image_url } = req.query;
    
    if(!image_url) { // this  regex that they are urls
      return res.status(422).send(`image_url is required`);
    }

    const filteredpath = await filterImageFromURL(image_url);

    await res.sendFile(__dirname + filteredpath);

    res.on('finish', () => {
      deleteLocalFiles([filteredpath]);
    });
  });
  
  // Root URI call
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();