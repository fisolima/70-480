var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res) {

    var indexPagePath = path.join(__dirname, 'public', 'index.html');

    res.sendFile(indexPagePath);
});


router.get('/pages', function (req, res) {

    var pages = [];
    var level = 0;
    var publicPath = path.join(__dirname, '../public');
    
    function AbsolutePathToUrl(filePath) {
        var url = filePath.replace(publicPath, '');

        url = url.replace(/[\\]/g, '/');
        
        url = url.replace('//', '/');
        
        return url;
    }

    function ProcessFolderEnd()
    {
        res.json(pages);    
    }

    function ProcessFolder(currentPath, currentPages) {
        level++;

        fs.readdir(currentPath, function(err, files) {
            if (err) {
                throw new Error(err);
            }

            files.forEach(function (fileName) {
                var filePath = path.join(currentPath, fileName);
                var stat = fs.statSync(filePath);

                if (stat.isFile() && fileName.endsWith('.html')) {
                    var url = AbsolutePathToUrl(filePath);
                    currentPages.push({
                        name: fileName,
                        address: url
                    });
                } else if (stat.isDirectory()) {
                    var nodeFolder = {
                        name: fileName,
                        links: []
                    }

                    currentPages.push(nodeFolder);

                    ProcessFolder(filePath, nodeFolder.links);
                }
            });

            level--;

            if (level === 0)
                ProcessFolderEnd();
        });
    }

    ProcessFolder(path.join(publicPath, 'exercises'), pages);
});

module.exports = router;