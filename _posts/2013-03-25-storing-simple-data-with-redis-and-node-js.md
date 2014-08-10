---
layout: post
title: Storing Simple Data with Redis and Node.js
date: '2013-03-25T09:12:00-07:00'
tags: []
tumblr_url: http://blog.semmy.me/post/46247962979/storing-simple-data-with-redis-and-node-js
---
In my previous two blog posts, we set up a Node.js development environment using Vagrant and Chef, and then we used the ntwitter module to connect to Twitter   s streaming API. Next, we   d like to store some information on the server that will remain even after the server shuts down, and then we   d like to display this information to the user. In this post, we   re going to focus on the former: we   ll write some code that keeps track some aggregate information about the tweets using Redis. I   ll assume you   ve worked your way through the previous two tutorials.

Redis is a key-value store; some refer to it as a data-structure server. These are different from traditional databases in that they store information in volatile memory (keeping it very fast)  and also allow you to organize data into traditional structures (hashes, lists, sets, etc). It is perfect for storing data that needs to be accessed quickly (like session information) or for caching to improve the response time of your applications.

Our goal is to keep track of the number of times each of the following words appear:    awesome,       cool,       rad,       gnarly,    and    groovy.    To do this, we   ll simply use a key for each of the words, and each value will be an integer representing the number of times the word appears.

To get a feeling for how redis works, let   s interact with it via the command line client. Fire up vagrant and ssh into the box.


$ vagrant up
$ vagrant ssh


Now we should be logged into our virtual machine where redis is already installed and configured. The following command starts up the redis client and creates a key for    awesome    and sets its value to 0.


$ redis-cli
redis 127.0.0.1:6379> set awesome 0


If all goes well, redis should respond with    OK.    We can check the value of the key by using the get command, and we can increment it by using the incr command.


redis 127.0.0.1:6379> get awesome
"0"
redis 127.0.0.1:6379> incr awesome
(integer) 1
redis 127.0.0.1:6379> incr awesome
(integer) 2
redis 127.0.0.1:6379> get awesome
"2"


To exit out of the interactive redis client, you can type    exit    or press CTRL-D to send an End-Of-File character to the process. If you want to practice and learn more about redis, try out this outstanding interactive redis tutorial.

So now we know how to create a key for each word and then increment the value interactively, but we   d like to be able to do it programmatically in Node. To do this, we   ll need to install the redis module via npm.

Previously, we had used npm from the command line to install the ntwitter module. This makes sense when just starting out, but as we move forward it   s going to make sense to track our dependencies in a more formal way. To do this, we use a special file called package.json, which keeps track of some meta-information about our project.

In your app directory create a new file called package.json, and copy/paste the content below.

{
    "name": "tutorial",
    "description": "a tutorial on using node, twitter, redis, and express",
    "version": "0.0.1",
    "dependencies": {
        "ntwitter": "0.5.x",
        "redis": "0.8.x"
    }
}

As you can see, this specifies some basic meta-information about your project, including the dependencies. Using this instead of installing your modules by hand has two advantages. The first is that we can now install all dependencies by simply typing the following command on your vagrant virtual machine.


$ cd app
$ npm install --no-bin-links


The second is that it allows us to keep our node_modules directory (which contains all of our dependencies) out of our git repository. So now we can open up the .gitignore file that we created in the previous tutorial and modify it to look like this:


credentials.js
node_modules


Once that   s finished, let   s go ahead and make a commit to our git repository so that we   ll have a clean working directory.


$ git add package.json
$ git add .gitignore
$ git commit -m "add package.json and ignore node_modules directory"


Next, on your host machine, open the twitter.js file that we created in the last tutorial. It should be in the app directory, and you can open it in any text editor you   d like. Modify it so it looks like this:

var twitter = require(''ntwitter'');
var redis = require(''redis'');
var credentials = require(''./credentials.js'');

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
    { track: [''awesome'', ''cool'', ''rad'', ''gnarly'', ''groovy''] },
    function(stream) {
        stream.on(''data'', function(tweet) {
            console.log(tweet.text);
            //if awesome is in the tweet text, increment the counter                                                                                                                                                                        
            if(tweet.text.indexOf("awesome") > -1) {
                client.incr(''awesome'');
            }
        });
    }
);

We can let this code run for a bit and this should keep track of the number of tweets containing the word    awesome    in Redis. We can verify this by stopping the program (with CTRL-C) and then reconnecting with the redis-cli program and getting the value of the    awesome    key. We can clear out the contents of Redis at any time by typing    flushall    at the redis-cli prompt.

We may also want to create a web server to show the awesome count if someone visits the server over http. This can be done by copying some of the code from our original server.js file that came with node-dev-bootstrap. First, we   ll have to require the node.js http module by including this line at the top of our file:

var http = require("http");

Then, further down in the twitter worker code, we can create an HTTP server that responds to requests by copying the code from the original server.js file:

http.createServer(function (req, res) {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end(''Hello World!\n'');
}).listen(3000);

To have it respond by sharing the awesome count in redis, we   ll need to asynchronously request the data from the redis database. Modify this code so it looks like this: 

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

The new lines in this program illustrate the non-blocking, event-driven nature of Node.js. If you   re coming from a more traditional programming background, you might be more comfortable with this approach to getting the value of the key:

var awesomeCount = client.get("awesome");

In the first line of this code, note that the program halts until the Redis (or other DB) client returns the result of the query. So in any subsequent lines, we can use awesomeCount just like any other variable.

Node   s approach is different. It queries Redis, and while it   s waiting for the response, it continues executing the remainder of the program. That   s why we send in a function as a callback to the query     this tells Node what to do when Redis returns with an answer. The variables in our anonymous function take on the actual values when Redis returns; in part they act like the left hand side of the assignment operator in the blocking approach.

The error variable will be null if the result is successful; it will be set to an error object otherwise. That   s why we wrap the code in an if statement to check the status of the error object.

So our code to pull a key out of the redis database ends up looking something like this:

client.get("awesome", function (error, awesomeCount) {
    if (error !== null) {
        //handle error here
        console.log("error: " + error);
    } else {
        res.writeHead(200, {"Content-Type": "text/plain"});
        res.end("The awesome count is " + awesomeCount);
    } 
});

Now you can run your twitter.js file by typing:

$ node twitter.js

and you can visit the page in your web browser by typing localhost:3000 in the address bar.

You should now modify this code so it keeps track of the counts for all of the words that the ntwitter module is watching. This program will eventually become a background worker; my next blog post will show you how a better way to share these counts on a web page. We   ll use the Express web framework to do this.
