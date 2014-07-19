var gulp = require('gulp'),
    path = require('path'),
    lr = require('tiny-lr'),
    express = require('express'),
    connectlr = require('connect-livereload'),
    gutil = require('gulp-util'),
    server = lr(),
    EXPRESS_PORT = 1337,
    ROOT = process.cwd(),
    LIVERELOAD_PORT = 35729;

function startExpress() {
  var app = express();

  app.use(connectlr());
  app.use(express.static(ROOT));
  app.listen(EXPRESS_PORT);
}

function startLR() {
  server.listen(LIVERELOAD_PORT);
}

function pingLR(event) {
  var fileName = path.relative(ROOT, event.path);

  server.changed({
    body: {
      files: [fileName]
    }
  });
}

gulp.task('watch', ['build-dev'], function() {
  startExpress();
  startLR();
  gulp.watch('src/**/*', ['build-dev']);
  gulp.watch('dist/ScrollListView.js').on('change', pingLR);

  gutil.log('[server started]', 'http://localhost:' + EXPRESS_PORT + '/example/index.html');
});

