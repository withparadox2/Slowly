// Upload bundle to the server

var Client = require('ftp');

function getUploadedFiles() {
  var walk = require('walk');
  var files = [];
  var walker = walk.walkSync('./dist', {
    followLinks: false,
    listeners: {
      file: function (root, stat, next) {
        if (stat.name.endsWith('.zip') && !stat.name.endsWith('.map')) {
          files.push(root + '/' + stat.name);
        }
        next();
      }
    }
  });

  return files;
}

function upload() {
  var c = new Client();
  c.on('ready', function () {
    console.log('Connection established')
    const files = getUploadedFiles()

    function uploadFile(i) {
      if (i >= files.length) {
        console.log('All uploaded')
        c.end()
        return
      }
      const localFile = files[i]
      const remoteFile = localFile.replace('./dist', 'public_html/Slowly')

      console.log(`${i + 1}/${files.length} upload ${localFile} to ${remoteFile}`)

      c.put(localFile, remoteFile, function (err) {
        if (err) {
          c.end()
          throw err
        } else {
          uploadFile(i + 1)
        }
      });
    }

    uploadFile(0)
  })

  c.on('error', function (err) {
    console.log(err)
    c.end()
  })

  // connect to localhost:21 as anonymous
  c.connect({
    host: '122.10.112.129',
    port: 21,
    user: 'withpara',
    password: '@gsd4206211991'
  });
}

upload()