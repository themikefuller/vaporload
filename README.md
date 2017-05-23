# Vaporload
Express Middleware for accepting an upload and removing the temporary file.

Vaporload uses multer and multer-autoreap to accept an incoming file in the request object, save it somewhere temporarily, add it to req.file, and then remove the temporary file when the response object is sent out.

## Example

    // Express app
    var express = require('express');
    var app = express();
    app.set('json spaces', 4);

    // Require vaporload
    var vaporload = require('vaporload');

    // Options for vaporload
    var options = {
      "maxsize": 550000,
      "field": "file",
      "dest":"/tmp"
    };

    // Use vaporload as middleware
    app.post('/uploads',vaporload(options));

    // Catch Upload errors
    app.use(function(err,req,res,next) {
      if (err.code == "LIMIT_FILE_SIZE") {
        console.log('file was too big');
      }
      res.status(413);
      res.json({"error":err});
    });

    // Do something with file if it was uploaded
    app.post('/uploads',function(req,res,next) {
      if (req.file) {
        // Do something with file
        // Temporary file will be deleted when the response object is sent.
        res.json(req.file);
      } else {
        res.json({"message":"No file uploaded"});
      }
    });

    // Start app
    app.listen(3003);
  
  
## Options

### maxsize

Maximum acceptable size (in bytes) for the uploaded file. Defaults to 550000 bytes (550KB);

### field

Specify the name of the request body field that is checked for an uploaded file. This would be the name of the file input field in the HTML form. Defaults to "file"

### dest

This is the directory that uploaded files will be temporarily saved to after they are received. After Express sends out the response, this file will be deleted, regardless of whether it was saved or used elsewhere. This will attempt to default to "/tmp/". It is important for the app to have read/write access to the specified directory.
