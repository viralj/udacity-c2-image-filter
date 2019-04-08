import express from 'express';
import bodyParser from 'body-parser';
import { spawn } from 'child_process';
import AWS = require('aws-sdk');

const config = {
  write: {
    in_dir: "./input",
    out_dir: "./output"
  },
  aws: {
    "aws_region": process.env.AWS_REGION,
    "aws_profile": process.env.AWS_PROFILE,
    "aws_media_bucket": process.env.AWS_MEDIA_BUCKET
  }
}

//Configure AWS
if(config.aws.aws_profile !== "DEPLOYED") {
  var credentials = new AWS.SharedIniFileCredentials({profile: config.aws.aws_profile});
  AWS.config.credentials = credentials;
}

export const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: config.aws.aws_region,
  params: {Bucket: config.aws.aws_media_bucket}
});

(async () => {

  const app = express();
  const port = 8081; // default port to listen
  
  app.use(bodyParser.json());
  
  //VERY BAD
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  // Root URI call
  app.get( "/", async ( req, res ) => {
    res.send( "try post /canary" );
  } );
  
  // Root URI call
  app.post( "/canary", async ( req, res ) => {
    const { filename } = req.body;

    var params = {
      Bucket: config.aws.aws_media_bucket, 
      Key: filename
     };
    // const file = s3.getObject(params, config.write.in_dir + filename).then

    const pythonProcess = spawn('python3', ["src/image_filter.py"]);
    if(pythonProcess !== undefined) {
      pythonProcess.stdout.on('data', (data) => {
        // Do something with the data returned from python script
        console.log(data.toString())
      });
    }

    res.send( "try post /canary" );
  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();