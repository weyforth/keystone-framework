
var keystone = require('keystone');

if(process.env.NODE_ENV != 'production'){
  var chokidar = require('chokidar');
  var browserSync = require('browser-sync');

  browserSync.init({
    logLevel: 'silent',
    proxy: 'localhost',
  });

  var watcher = chokidar.watch([
    './routes',
    './models',
  ], {
    usePolling: true,
    interval: 1000,
  });

  watcher.on('ready', function() {
    watcher.on('all', function(event, path) {
      Object.keys(require.cache).forEach(function(id) {
        if (/\/src\/routes\//.test(id))
          delete require.cache[id];

        var refreshModels = false;
        if (/\/src\/models\//.test(id)){

          for(var cacheId in require.cache){
            if (/\/src\/models\//.test(cacheId)){
              delete require.cache[cacheId];
            }
          }

          refreshModels = true;
        }

        if(refreshModels){
          keystone.mongoose.models = {};
          keystone.mongoose.modelSchemas = {};
          keystone.import('./models');
        }

      });

      browserSync.reload(path);

    });
  });

  var templateWatcher = chokidar.watch([
    './templates',
  ], {
    usePolling: true,
    interval: 1000,
  });

  templateWatcher.on('ready', function() {
    templateWatcher.on('all', function(event, path) {
      browserSync.reload(path);
    });
  });
}
