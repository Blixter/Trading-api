const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const auth = require('./routes/auth');
const depots = require('./routes/depots');
const objects = require('./routes/objects');
const stock = require("./stock.js");


// Config with environment variables
require('dotenv').config();

const port = process.env.PORT;

app.use(cors());

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

// This is middleware called for all routes.
// Middleware takes three parameters.
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/auth', auth);
app.use('/depots', depots);
app.use('/objects', objects);


app.use((req, res, next) => {
    var err = new Error("Not Found");

    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title":  err.message,
                "detail": err.message,
                "detail": err.message
            }
        ]
    });
});

var gold = {
    name: "Gold",
    data: [],
    range: {
        min: 440, 
        max: 500
    }
};

var silver = {
    name: "Silver",
    data: [],
    range: {
        min: 100,
        max: 200,
    }
};

var stockObjects = [gold, silver];


io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

setInterval(function () {
    if (gold.data.length > 50 || silver.data.length > 50) {
        gold.data = gold.data.slice(gold.data.length - 20, gold.data.length);
        silver.data = silver.data.slice(silver.data.length - 20, silver.data.length);
    }
    stockObjects.map((obj) => {
        obj.data = stock.getNewSeries(obj.data, new Date().getTime(), obj.range
        );
        return obj;
    });

    io.emit("stocks", stockObjects);
}, 5000);

// Start up server
const server = http.listen(port, () => console.log('Proj-api listening on port ' + port));

module.exports = server;
