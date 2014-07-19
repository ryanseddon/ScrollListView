var fs = require('fs'),
    onlyScripts = require('./util/scriptFilter'),
    tasks = fs.readdirSync('./gulp/tasks/').filter(onlyScripts);

tasks.forEach(function(task) {
  require('./tasks/' + task);
});
