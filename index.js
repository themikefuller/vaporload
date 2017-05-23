var multer = require('multer');
var autoReap  = require('multer-autoreap');

function Uploader(options) {
  return function(req,res,next) {

    if (!options.maxsize) {
      options.maxsize = 550000;
    }

    if (!options.field) {
      options.field = "file";
    }

    if (!options.dest) {
      options.dest = "/tmp/";
    }

    var storage = multer.diskStorage({
      destination: function(req,file,cb) {
        cb(null,options.dest.replace(/\/$/, "") + '/');
      },
      filename: function(req,file,cb) {
        cb(null, options.field + '-' + Date.now());
      }
    });

    var upload = multer({
      storage: storage,
      limits: {fileSize:options.maxsize}
    }).single(options.field);

    upload(req,res,function(err){
      if (err) {
        next(err);
      } else {
        autoReap(req,res,function(err){
          next();
        });
      }
    });

  };

}

module.exports = Uploader;
