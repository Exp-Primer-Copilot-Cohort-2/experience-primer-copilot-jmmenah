// Create web server
// 
// This file is the entry point for the application. It sets up the web server and listens for requests.
// It also sets up the database connection and initializes the data model.
// 
// To run the application, execute the following command:
// node comments.js
// 
// The application listens on port 3000.
// To access the application, open a web browser and navigate to the following URL:
// http://localhost:3000
// 
// To stop the application, press Ctrl+C in the terminal window where the application is running.

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Comment = require('./models/comment');

// Connect to the database
mongoose.connect('mongodb://localhost/comments');

// Create the Express application
var app = express();

// Set up the body parser middleware
app.use(bodyParser.json());

// Set up the route for the root of the web server
app.get('/', function (req, res) {
    res.send('Hello World!');
});

// Set up the route for the /comments URL
app.route('/comments')
    .get(function (req, res) {
        // Retrieve all comments from the database
        Comment.find(function (err, comments) {
            if (err) {
                res.send(err);
            } else {
                res.json(comments);
            }
        });
    })
    .post(function (req, res) {
        // Create a new comment
        var comment = new Comment(req.body);
        comment.save(function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send('Comment added');
            }
        });
    });

// Set up the route for the /comments/:comment_id URL
app.route('/comments/:comment_id')
    .get(function (req, res) {
        // Retrieve a comment by ID
        Comment.findById(req.params.comment_id, function (err, comment) {
            if (err) {
                res.send(err);
            } else {
                res.json(comment);
            }
        });
    })
    .put(function (req, res) {
        // Update a comment by ID
        Comment.findById(req.params.comment_id, function (err, comment) {
            if (err) {
                res.send(err);
            } else {
                comment.name = req.body.name;
                comment.text = req.body.text;
                comment.save(function (err) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send('Comment updated');
                    }
                });
            }
        });
    })
    .delete(function (req, res) {
        // Delete a comment by ID
        Comment.remove({ _id: req.params.comment_id }, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send('Comment deleted');
            }
        });
    });