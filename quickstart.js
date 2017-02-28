var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var bodyParser = require("body-parser");
var express = require('express');
var app = express();
var port = process.env.PORT || 5000;
var service = google.tasks('v1');
var isAuthed = false;

const CLIENT_ID = '337711831038-ptt8gohu94rtb3j2aqp8e5hahkceld0q.apps.googleusercontent.com';
const CLIENT_SECRET = 'WkH439pEYD8U1CVmMuE8ElYW';
const SCOPE = 'https://www.googleapis.com/auth/tasks';

var TASKLIST_ID = "";
app.use(express.static('public'));
app.use(express.static('src/views'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// --------------------------------------------------
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(
    CLIENT_ID,
    CLIENT_SECRET
);

google.options({
    auth: oauth2Client
});

function url() {
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPE
    });
}

app.get('/auth/tasks', function (req, res) {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl + "/callback";
    oauth2Client.redirectUri_ = fullUrl;
    res.send(url());
});

app.get('/auth/tasks/callback',
    function (req, res) {
        var code = req.query.code;
        oauth2Client.getToken(code, function (err, tokens) {
            if (!err) {
                oauth2Client.setCredentials(tokens);
                getTasklists(oauth2Client);
                isAuthed = true;
            }
        });
        res.redirect('/');

    });

function getTasklists() {
    service.tasklists.list({
        auth: google.options.auth
    }, function (err, response) {
        if (err) {
            console.log('The get tasklist API returned an error: ' + err);
            return;
        }
        var items = response.items;
        if (items.length == 0) {
            console.log('No task lists found.');
        } else {
            console.log(items[0].id);
            TASKLIST_ID = items[0].id;
        }
    });
};


// --------------------------------------------------

app.get('/isAuthed', function (req, res) {
    res.send(isAuthed);
});

app.get('/tasks', function (req, res) {
    if (TASKLIST_ID !== "") {
        service.tasks.list({
            auth: google.options.auth,
            tasklist: TASKLIST_ID
        }, function (err, response) {
            if (err) {
                console.log('The get all tasks API returned an error: ' + err);
                return;
            }
            res.send(response.items);


        });
    }
});

app.delete('/', function (req, res) {
    service.tasks.delete({
        auth: google.options.auth,
        tasklist: TASKLIST_ID,
        task: req.body.id
    }, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        res.end();

    });
});

app.put('/', function (req, res, next) {
    service.tasks.update({
        auth: google.options.auth,
        tasklist: TASKLIST_ID,
        task: req.body.id,
        resource: req.body

    }, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        res.send(response);
    });

});

app.post('/post', function (req, res) {
    service.tasks.insert({
        auth: google.options.auth,
        tasklist: TASKLIST_ID,
        task: req.body.id,
        resource: req.body
    }, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        console.log(response);

        res.send(response);
    });

});

// --------------------------------------------------


app.listen(port);
module.exports = app;