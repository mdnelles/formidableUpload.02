const express       = require('express'),
	media          = express.Router(),
	cors           = require('cors'),
     fs             = require('fs-extra'),
     formidable     = require('formidable'),
     rf             = require('./RoutFuctions');

media.use(cors())

media.post('/getmedia', rf.verifyToken, (req, res) => {
     
     const path = './client/public/upload/';

     var arr = []; // this will be an array of objects

     fs.readdirSync(path, {withFileTypes: true})
          .filter(item => !item.isDirectory())
          .map( function(item,index){
               o = {
                    name:item.name,
                    bgc:'-'
               }
               arr.push(o)
          });

          res.send(arr);
   
})

//media.post('/uploadFile', rf.verifyToken, (req, res) => {
media.post('/uploadFile', rf.verifyToken, (req, res) => {
     
     const path = './client/public/upload/';
  /*   
console.log("==============start")
console.log(req.headers)
console.log("==============end")
*/
/*     console.log('Bearer')
     console.log(Bearer)

     console.log('token')
     console.log('token') */

 

     var form = new formidable.IncomingForm();
     form.uploadDir = path;
     form.encoding = 'binary';
   
     form.parse(req, function(err, fields, files) {

          console.log('files.files:')
          //console.log(files)
          
          if (err) {
               console.log(err);
               res.send('upload failed')
          } else {
               var oldpath = files.files.path;
               var newpath = path + files.files.name;
               fs.rename(oldpath, newpath, function (err) {
                    if (err) throw err;
                    res.send('complete').end();
               });
          }
     });
})

media.post('/removeFile', rf.verifyToken, (req, res) => {
     
     console.log('in removeFile');
     const path = './client/public/upload/';
     const fileName = req.body.fileName;
     
     // With Promises:
     fs.remove('/tmp/myfile')
     fs.remove(path + fileName)
     .then(() => {
          console.log('success delete file: ' + fileName)
          res.send('ok').end()
     })
     .catch(err => {
          console.error('Failed in deleting file ' + fileName + ' Err: ' + err)
          res.send('failed to delete file').end();
     })
     


})

module.exports = media