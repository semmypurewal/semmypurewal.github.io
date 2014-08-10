---
layout: post
title: 'Node.js: Combining the Express Server and Twitter Worker'
date: '2013-04-03T13:23:00-07:00'
tags: []
tumblr_url: http://blog.semmy.me/post/47033007807/node-js-combining-the-express-server-and-twitter
---
If you   ve followed the tutorials up to this point, we have two Node.js source files. We have app.js which is the Express server that returns the JSON object containing the counts of the words, and you have twitter.js which we can think of as a worker. The code for twitter.js looks something like this:

var twitter = require("ntwitter");
var redis = require("redis");
var credentials = require("./credentials.js");

//create redis client                                                                                                                                                                                                                       
var client = redis.createClient();

var t = new twitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret
});

t.stream(
    "statuses/filter",
    { track: ["awesome", "cool", "rad"] },
    function(stream) {
        stream.on("data", function(tweet) {
            console.log(tweet.text);
            //if awesome is in the tweet text, increment the counter                                                                                                                                                                        
            if(tweet.text.indexOf("awesome") > -1) {
                client.incr(''awesome'');
            }
        });
    }
);

http.createServer(function (req, res) {
    client.get("awesome", function (error, awesomeCount) {
        if (error !== null) {
            //handle error here
            console.log("error: " + error);
        } else {
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.end("The awesome count is " + awesomeCount);
        }
    });
}).listen(3000);

And the code for app.js might look something like this:

// We need to ''require'' the                                                                                                                            
// following modules                                                                                                                    
var express = require("express"),
    http = require("http"),
    path = require("path"),
    app = express();

// This is our basic configuration                                                                                                                     
app.configure(function () {
    // Define our static file directory, it will be ''public''                                                                                           
    app.use(express.static(path.join(__dirname, ''public'')));
});

// Create the http server and get it to                                                                                                                
// listen on the specified port 3000                                                                                                                   
http.createServer(app).listen(3000, function(){
    console.log("Express server listening on port 3000");
});


// Create and return the word counts as a JSON object
app.get("/counts.json", function (req, res) {
    redisClient.mget(["awesome", "cool", "rad"] , function (error, results) {
	if (error !== null) {
            // handle error here                                                                                                                       
            console.log("ERROR: " + error);
        } else {
            var jsonObject = {
		"awesome": results[0],
                "cool": results[1],
                "rad": results[2]
                // ...etc
            };
            // use res.json to return JSON objects instead of strings
            res.json(jsonObject);
        }
    });
});

Our current workflow is a bit unsustainable right now, since we have to run the twitter worker for a bit, then stop it, and then start our express server, to display our data to the user. We   d like to just start the application once and have it initialize the worker to run in the background.

We can do this by converting twitter.js into a module. We did something similar to have our twitter credentials file separated from our twitter.js file. A basic module looks something like this:

var ImportantFunction = function () {
    //code for the module goes here
}

module.exports = ImportantFunction;

In the credentials.js example, we exported a JavaScript object literal, and that   s fine as well. In fact, your module can export multiple things if you include them as part of the    exports    object.

var ImportantFunction = function () {
    //code for the function goes here
}

var objectLiteral = {
    "hello":"world";
}

module.exports.ImportantFunction = ImportantFunction;
module.exports.objectLiteral = objectLiteral;

You can then access these from another file by using the require statement:

var myModule = require("./myModule.js");

//access ImportantFunction
var ImportantFunction = myModule.ImportantFunction;
var objectLiteral = myModule.objectLiteral;

For our app, we   ll simply wrap the twitter object in a function called worker, and export that directly. We   ll also remove the http server, since that will now be handled entirely by Express. This makes our code look something like this:

var worker = function () {
    var twitter = require("ntwitter");
    var redis = require("redis");
    var credentials = require("./credentials.js");

    //create redis client                                                                                                                                                                                                                       
    var client = redis.createClient();

    var t = new twitter({
        consumer_key: credentials.consumer_key,
        consumer_secret: credentials.consumer_secret,
        access_token_key: credentials.access_token_key,
        access_token_secret: credentials.access_token_secret
    });

    t.stream(
        ''statuses/filter'',
        { track: ["awesome", "cool", "rad"] },
        function(stream) {
            stream.on("data", function(tweet) {
                console.log(tweet.text);
                //if awesome is in the tweet text, increment the counter                                                                                                                                                                        
                if(tweet.text.indexOf("awesome") > -1) {
                    client.incr("awesome");
                }
            });
        }
    );
};

module.exports = worker;

And now we can require it in our app.js program by modifying it to be the following:

// We need to ''require'' the                                                                                                                            
// following modules                                                                                                                    
var express = require("express"),
    http = require("http"),
    path = require("path"),
    app = express(),
    twitterWorker = require("./twitter.js");

And then we can start the worker before we start the server by calling the function:

// Start our Twitter worker
twitterWorker();

// Create the http server and get it to                                                                                                                
// listen on the specified port 3000                                                                                                                   
http.createServer(app).listen(3000, function(){
    console.log("Express server listening on port 3000");
});

Now, running the Express server should launch the twitter worker. If you load localhost:3000, you should be able to reload the page and watch the numbers update.
