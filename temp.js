/**
 * Created by MarcoC on 2/27/17.
 */
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var bodyParser = require("body-parser");
var express = require('express');
var app = express();
var port = process.env.PORT || 5000;
var service = google.tasks('v1');

const TASKLIST_ID = 'MTI1MjkyOTc4MTA3NzU5ODQ4NjI6MDow';
app.use(express.static('public'));
app.use(express.static('src/views'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


function getAuth(callback) {
// Load client secrets from a local file.
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            return;
        }
        // Authorize a client with the loaded credentials, then call the
        // Google Tasks API.
        authorize(JSON.parse(content), callback);
    });
    // If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/tasks-nodejs-quickstart.json
    var SCOPES = ['https://www.googleapis.com/auth/tasks'];
    var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
        process.env.USERPROFILE) + '/.credentials/';
    var TOKEN_PATH = TOKEN_DIR + 'tasks-nodejs-quickstart.json';
    console.log(TOKEN_PATH);
    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     *
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback) {
        var clientSecret = credentials.installed.client_secret;
        var clientId = credentials.installed.client_id;
        var redirectUrl = credentials.installed.redirect_uris[0];
        var auth = new googleAuth();
        var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, function (err, token) {
            if (err) {
                getNewToken(oauth2Client, callback);
            } else {
                oauth2Client.credentials = JSON.parse(token);
                callback(oauth2Client);
            }
        });
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     *
     * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback to call with the authorized
     *     client.
     */
    function getNewToken(oauth2Client, callback) {
        var authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES
        });
        console.log('Authorize this app by visiting this url: ', authUrl);
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('Enter the code from that page here: ', function (code) {
            rl.close();
            oauth2Client.getToken(code, function (err, token) {
                if (err) {
                    console.log('Error while trying to retrieve access token', err);
                    return;
                }
                oauth2Client.credentials = token;
                storeToken(token);
                callback(oauth2Client);
            });
        });
    }

    /**
     * Store token to disk be used in later program executions.
     *
     * @param {Object} token The token to store to disk.
     */
    function storeToken(token) {
        try {
            fs.mkdirSync(TOKEN_DIR);
        } catch (err) {
            if (err.code != 'EEXIST') {
                throw err;
            }
        }
        fs.writeFile(TOKEN_PATH, JSON.stringify(token));
        console.log('Token stored to ' + TOKEN_PATH);
    }
}

//TODO: Send post request to Task API to update a Task
app.post('/', function (req, res, next) {
    console.log('POST : ', req.body);
});

//TODO: TaskID and TaskListID to Delete Task
app.delete('/', function (req, res, next) {
    console.log('Delete request : ', req.body.id);
});

//TODO: Send put request to Task API to insert new Task
app.put('/', function (req, res, next) {
    console.log('PUT : ', req.body);

    getAuth(insertTask);
    function insertTask(auth) {
        var task = new Task();
        req.body;
        task.auth = auth;
        task.tasklist = TASKLIST_ID;
        console.log(task);
        service.tasks.insert(task, function (err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                return;
            }
            console.log(response);
            // var items = response.items;
            // if (items.length == 0) {
            //     console.log('No task lists found.');
            // } else {
            //     console.log();
            //     console.log('Task lists:');
            //     // return items;
            //     res.send(200);
            //
            //     for (var i = 0; i < items.length; i++) {
            //         var item = items[i];
            //         console.log('%s (%s)', item.title, item.id);
            //
            //     }
            // }
        });
    }

});

app.get('/tasks', function (req, res) {
    getAuth(getAllTasks);
    function getAllTasks(auth) {
        service.tasks.list({
            auth: auth,
            tasklist: TASKLIST_ID
        }, function (err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                return;
            }
            var items = response.items;
            if (items.length == 0) {
                console.log('No task lists found.');
            } else {
                console.log();
                console.log('Task lists:');
                // return items;
                res.send(items);
                //
                // for (var i = 0; i < items.length; i++) {
                //     var item = items[i];
                //     console.log('%s (%s)', item.title, item.id);
                //
                // }
            }
        });
    }
});


app.listen(port, function (err) {
    console.log('running on', port);
});

module.exports = app;