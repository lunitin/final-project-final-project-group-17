/* Node.js server defined here */

var path     = require('path');
var express  = require('express');
var exphbs   = require('express-handlebars');
var app      = express();
var port     = process.env.PORT || 3000;
var bp       = require('body-parser');
var db       = require('./database');
var serveDB = require('./db.json');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

/* Body Parser Middleware */
app.use(bp.json());

/* Database Middleware */
app.get("/ajax/loadtasks", function(req, res) {
  res.status(200).send(db.loadAllTasks());
});

app.get("/ajax/loadtasks/:groupId", function(req, res) {
  res.status(200).send(db.loadAllTasksByGroup(req.params.groupId));
});

app.get("/ajax/deltask/:taskId", function(req, res) {
  if (db.deleteTask(req.params.taskId)) {
    res.status(200).send("OK");
  } else {
    res.status(500).send("ERROR");
  }
});

app.post("/ajax/savetask", function(req, res) {
  id = db.saveTask(req.body);
  if (parseInt(id) > 0) {
    res.status(200).send(JSON.stringify({task_id: id}));
  } else {
    res.status(500).send("ERROR");
  }
});

app.get('/', function (req, res)
{
	res.status(200).render('index', {task: JSON.parse(db.loadAllTasks())});
});

// app.get('/tasks/:postId', function(req, res, next) {
//   var postId = req.params.postId;
//   if (postData[postId])
// 	{
//     var post = postData[postId];
//     res.status(200).render('index', {posts: [post]});
// 	}
// 	else
// 	{
// 		next();
// 	}
// });

/* Serve public directory */
app.use(express.static('public'));


/* 404 Route */
app.get('*', function (req, res) {
  res.status(404).render('404');
});

app.listen(port, function () {
  console.log("== Server is listening on port", port);
});
