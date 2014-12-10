DFStorage
=======

[![Build Status](https://drone.io/github.com/codeflyer/DFStorage/status.png)](https://drone.io/github.com/codeflyer/DFStorage/latest)
[![npm version](https://badge.fury.io/js/df-storage.svg)](http://badge.fury.io/js/df-storage)

DFStorage is a module for the storage of file in different way.
Currently supports storage in file system and in MongoDb GridFs.

[Project Home Page](https://github.com/codeflyer/DFStorage)

##Quickstart
```javascript
var storages = require('df-storage');
var myGridFs = new storages.GridFS(
    {db: someMongoDbConnection}
);
storages.setStorage('my-storage', myGridFs);

//...

var myStorage = storages.getStorage('my-storage');
myStorage.save(pathToSourceFile, uniqueID);

//...

function someMiddlwareFunc(req, res, next) {
  var myStorage = storages.getStorage('my-storage');
  myStorage.sendToResponse(req.query.uniqueID, res);
}
```

##FileFsStorage

```
var FileFs = require('df-storage').FileFS;

var fileFs = new FileFs({
  path: rootPath,
  deep : 3,
  contentType : 'text/html'
});
```

 * ```path```, define the root path of the storage in the filesystem
 * ```deep```, define the number of subfolders used for saving the file.
 (eg. If the file name/uid is ```someFileName``` and the deep value is equal 
 to 3, will be saved in s/o/m/someFileName)
 * ```contentType```, the default content type of the file saved

n addition to the original file will be saved another file containing
metadata with the name ```someFileName.json```.

 * ```filename```, the name/uid of the file
 * ```contentType```, The content type of the file
 * ```length```, The size of the file
 * ```metadata```, additional custom metadata

##GridFsStorage

```
var GridFs = require('df-storage').GridFS;

var gridFs = new GridFs({
  db: connectionManager.getConnection(),
  collectionRoot: 'my-collection-root',
  chunkSize: 10000,
  contentType: 'html/zip'
});
```

 * ```db```, a mongodb conncetion
 * ```collectionRoot```, the base name of the mongoDb collection used by the
 gridFs.
 * ```chunkSize```, the default size of the chunk
 * ```contentType```, the default content type of the file saved

in addition to the original file will be saved some metadata.

 * ```filename```, the name/uid of the file
 * ```contentType```, The content type of the file
 * ```chunkSize```, the size of the chunk
 * ```length```, The size of the file
 * ```metadata```, additional custom metadata

##API

##save(originalPath, UID, options) -> Promise()
Save a file from a source (originalPath) with the Id (UID)

 * originalPath, the source
 * UID, the UID in the storage
 * options:
   * metadata, additional custom metadata
   * chunkSize, the size of chunk (only in the GridFs)
   * contentType, the contentType

If chunkSize and contentType aren't defined the default values are used.

##load(UID, readStream)
Load a file (UID) into the readStream
 * UID, the UID in the storage
 * readStream, a readStream

##sendToResponse(UID, response)
Send the file directly to the responseObject
 * UID, the UID in the storage
 * response, http response object

Adds to the response data also contentType and fileSize

##loadMeta(UID) -> Promise(metadata)
Load the metadata of the file
 * UID, the UID in the storage

##remove(UID) -> Promise()
Remove the file
 * UID, the UID in the storage

##exists(UID) -> Promise(exists)
Check if file exists
 * UID, the UID in the storage


#TODO
 * Improve documentation
 * Implement more storage (Eg. Amazon S3)
 * Implement methods for different storage comunication
   * Copy
   * Sync
 * Improve my English!! :)

#Contacts
 * Davide Fiorello <davide@codeflyer.com>
 * [<img src="https://static.licdn.com/scds/common/u/img/webpromo/btn_profile_greytxt_80x15.png" width="80" height="15" border="0" alt="View Davide Fiorello's profile on LinkedIn">](http://it.linkedin.com/pub/davide-fiorello/2/20a/789)
 * [GitHub](https://github.com/codeflyer)

#License
Copyright 2014 Davide Fiorello MIT License (enclosed)