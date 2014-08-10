---
layout: post
title: Using Express to Serve Static Content and Dynamic JSON
date: '2013-03-27T14:31:00-07:00'
tags: []
tumblr_url: http://blog.semmy.me/post/46435273508/using-express-to-serve-static-content-and-dynamic-json
---
If you worked through the previous tutorials, I hope that you managed to create a basic node.js development environment using Vagrant, stream data from twitter, and, finally, store aggregate information about that data in a Redis data store. To get data from the Redis data store to the web browser, we used the http library to return a simple text page. So if you also completed the suggested exercise in the previous tutorial, your code might look something like this:

var server = http.createServer(function (req, res) {
    client.mget(["awesome","cool"], function(err, results) {
        if (err !== null) {
            //handle error here
            console.log("error: " + err);
        } else {
  	    var response = "<b>Hello from my http server!!</b>";
	    response += "<p>Total awesome: " + results[0] + "</p>";
	    response += "<p>Total cool: " + results[1] + "</p>";
	    res.writeHead(200, {"Content-Type": "text/html"});
	    res.end(response);
        }
    });
}).listen(3000);

Note that we used Redis   s mget command to send in an array of keys and get back an array of values. This isn   t something that I described in my previous blog posts, but it is described in the Redis documentation. If you continue to use Redis, it would be helpful to become familiar with some of the commands and data structures that Redis offers.

Now suppose we wanted to actually style this code and include some javascript. Notice how quickly this can add complexity to our callback function:

 var server = http.createServer(function (req, res) {
    client.mget(["awesome","cool"], function(err, results) {
        if (err !== null) {
            //handle error here
            console.log("error: " + err);
        } else {
            var response += "<script>";
            response += "//script stuff here";
            response += "</script>";
            response += "<style>";
            response += "//style stuff here";
            response += "</style>";
            response += "<b>Hello from my http server!!</b> <br/>";
	    response += "<p>Total awesome: " + results[0] + "</p>";
	    response += "<p>Total cool: " + results[1] + "</p>";
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(response);
        }
    });
}).listen(3000); 

This is definitely an unsustainable approach. In fact, if you   re coming from an apache or rails background, this likely seems a little ridiculous. Does this mean we need to hard-code static html files as strings in our code?

That   s where the Express web framework comes in. Express is a web application framework for Node.js that is inspired by the Sinatra framework for Ruby. It creates a layer on top of the http library which provides these features among others. In this post, I   ll describe how to install express and create an Express application. Then I   ll talk a little bit about how to edit and create routes in your application.

Start by firing up your Vagrant virtual machine and ssh   ing into it. Next, you   ll want to add express to your package.json file. After adding it, your file should look something like this:

{
    "name": "tutorial",
    "description": "a tutorial on using node, twitter, redis, and express",
    "version": "0.0.1",
    "dependencies": {
	"express": "3.1.x",
        "ntwitter": "0.5.x",
        "redis": "0.8.x"
    }
}

And now we can use npm install to install it in our node_modules directory.

$ npm install --no-bin-links

Next, we   ll create a very basic express application in a new file. Create a file called app.js that looks like this:

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

app.get("/", function (req, res) {
    //send "Hello World" to the client as html
    res.send("Hello World!");
});

Save this file and run it using Node.

$ node app.js

You should see that Express is listening on port 3000, and now you should be able to point your browser to localhost:3000 and see    Hello World!   

We can specify other routes by providing other calls to the get method in the app object. For example, add the following to your code after the    Hello World    route:

app.get("/goodbye", function (req, res) {
    //send "Goodbye World" to the client as html
    res.send("Goodbye World!");
});

app.get("/login", function (req, res) {
    res.send("You need to login!");
});

Run your server and then visit    localhost:3000/goodbye    and    localhost:3000/login    in your web browser. You should see the message associated with the route.

We can add any number of routes to our server, but we   re really interested in serving up static html, css and JavaScript files so that we don   t have to create long strings. To do this, we   ll create a public directory in our app folder:

mkdir public

In our express configuration, we   ve specified that this directory will be used to serve our static content. Inside that directory, let   s make an    index.html    file with the following content.

<!DOCTYPE html>
<html>
  <head>
  </head>

  <body>
    <p>This is a static file!</p>
    <script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
  </body>
</html>

We should now be able to go to    localhost:3000/index.html    in our browser and see the contents of this file displayed as HTML. Now we   ll create a route that returns JSON from our server, and we   ll have our client side JavaScript request it via Ajax. To start with, we   ll create a route that connects to redis and gets our awesomeCount out. Make sure you   ve let the twitter.js program run for a few seconds so that Redis is populated with a count.

Since we don   t have the Redis module included in our app.js file, let   s modify the require section of our code to look something like this:

var express = require("express"),
    http = require("http"),
    path = require("path"),
    redisClient = require("redis").createClient(),
    app = express();

Next, add the following route to your express app:

app.get("/counts.json", function	(req, res) {
    redisClient.get("awesome", function	(error, awesomeCount) {
	if (error !== null) {
            // handle error here                                                                                                                       
            console.log("ERROR: " + error);
        } else {
            var jsonObject = {
		"awesome":awesomeCount
            };
            // use res.json to return JSON objects instead of strings
            res.json(jsonObject);
        }
    });
});

Now if we go to    localhost:3000/counts.json    in our web browser, we should see the file as a server-generated JSON object. We   ll continue by creating a client-side JavaScript file to consume the JSON object. Inside your    public    directory, create a directory called javascripts and a file called client-app.js with the following content:

var main = function () {
    $.getJSON("/counts.json", function (response) {
        $("body").append("<p>awesome:"+response.awesome+"</p>");
    });
};

$(document).ready(main);

And now include that file in your index.html with a script tag, right below the jQuery script tag:

<script src="/javascripts/client-app.js"></script>

After that, if you navigate your browser back to localhost:3000/index.html, you should see the number of times the word    awesome    has appeared.

It should now be straightforward to create any number of routes to pull data from Redis as JSON objects. If you   ve successfully used mget to pull data from Redis on the server as in the previous example, it should be relatively easy to modify the counts.json route callback to return an array of all of the counts. Do that now and have your client display all of them with jQuery.
