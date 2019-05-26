import express from 'express';
import bodyParser from 'body-parser';
import { spawn } from 'child_process';
import https from 'https';
import fs from 'fs';
import path from 'path';

(async () => {

  const app = express();
  const port = 8082; // default port to listen
  
  app.use(bodyParser.json());
  
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  async function downloadURLtoFile(url: string) {
    const filename = '/tmp/'+Math.floor(Math.random() * 2000)+'.jpg';
    const absolute = path.join(__dirname,filename)
    const file = await fs.createWriteStream(absolute, {flags: 'w'});
    const request = await https.get(url, function(response) {
      response.pipe(file);
    });

    return filename;
  }

  async function filterLocalImage(inputPath: string): Promise<string>{
    const outputPath_builder = inputPath.split('.');
    outputPath_builder.splice(1,0,'filtered');
    const outputPath = outputPath_builder.join('.');
    const pythonProcess = spawn('python3', ["src/image_filter.py", "/"+inputPath, "/"+outputPath]);

    let python;
    if(pythonProcess !== undefined) {
      await pythonProcess.stdout.on('data', (data) => {
        console.log(data.toString())
      });

      return new Promise( async (resolve) => {
        await pythonProcess.stdout.on('end', () => {
          return resolve(outputPath)
        });
      })

    }

  }

  async function deleteLocalFiles(files:Array<string>){
    for( let file of files) {
      fs.unlinkSync(path.join(__dirname, file));
    }
  }

  // Root URI call
  app.get( "/processedimage", async ( req, res ) => {

    const { image_url } = req.query;
    
    if(!image_url) { // this  regex that they are urls
      return res.status(422).send(`image_url is required`);
    }

    const filepath = await downloadURLtoFile(image_url);
    const filteredpath = await filterLocalImage(filepath);

    await res.sendFile(__dirname +'/'+ filteredpath);

    res.on('finish', () => {
      deleteLocalFiles([filepath, filteredpath]);
    });
  });
  
  // Root URI call
  app.get( "/", async ( req, res ) => {
    res.send("try the correct endpoint")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();