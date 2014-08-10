---
layout: post
title: Persistence with Redis and Node.js
date: '2012-02-26T19:15:00-08:00'
tags:
- nodejs
- redis
- db
tumblr_url: http://blog.semmy.me/post/18348581070/persistence-with-redis-and-node-js
---
In my previous two blog posts, we set up a Node.js development environment using Vagrant and Chef, and then we used the ntwitter module to connect to Twitter   s streaming API. Next, we   d like to store some information on the server and then display this information to the user. In this post, we   re going to focus on the former: we   ll write some code that keeps tracks some aggregate information about the tweets using Redis. I   ll assume you   ve worked your way through the previous two tutorials.

Redis is a key-value store; some refer to it as a data-structure server. These are different from traditional databases in that they store information in volatile memory (keeping it very fast)  and also allow you to organize data into traditional structures (hashes, lists, sets, etc). It is perfect for storing data that needs to be accessed quickly (like session information) or for caching to improve the response time of your applications.

Our goal is to keep track of the number of times each of the following words appear:    awesome,       cool,       rad,       gnarly,    and    groovy.    To do this, we   ll simply use a key for each of the words, and each value will be an integer representing the number of times the word appears.

To get a feeling for how redis works, let   s interact with it via the command line client. Fire up vagrant and ssh into the box


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

So now we know how to create a key for each word and then increment the value interactively, but we   d like to be able to do it programmatically in Node. To do this, we   ll need to install the redis module via npm. To do this enter your app directory on your virtual machine and install redis.


$ cd app
$ npm install redis


Next, on your host machine, open the twitter.js file that we created in the last tutorial. It should be in the app directory, and you can open it in any text editor you   d like. Modify it so it looks like this:

var twitter = require(''ntwitter'');
var redis = require(''redis'');
var credentials = require(''./credentials.js'');

//create redis client                                                                                                                                                                                                                       
var client = redis.createClient();

//if the ''awesome'' key doesn''t exist, create it                                                                                                                                                                                             
client.exists(''awesome'', function(error, exists) {
    if(error) {
        console.log(''ERROR: ''+error);
    } else if(!exists) {
        client.set(''awesome'', 0); //create the awesome key
    };
});

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
            if(tweet.text.match(/awesome/)) {
                client.incr(''awesome'');
            }
        });
    }
);

The new lines in this program illustrate the non-blocking, event-driven nature of Node.js.  If you   re coming from a more traditional programming background, you might be more comfortable with this approach checking the existence of the awesome key:


var exists = client.exists(''awesome''); //returns true if the key exists
if(!exists) {
    client.set(''awesome'', 0);
};

In the first line of this code, note that the program halts until the Redis (or other DB) client returns the result of the query. So in the second line (the if statement), we can use the boolean value.

Node   s approach is different. It queries Redis, and while it   s waiting for the response, it continues executing the remainder of the program. That   s why we send in an anonymous function as a callback to the query     this tells node what to do when Redis returns with an answer. The variables in our anonymous function take on the actual values when Redis returns; they act like the left hand side of the assignment operator in the blocking approach.

So the non-blocking approach ends up looking like:

//redis gives a value to error and exists                                                                                                                                                                                          
client.exists(''awesome'', function(error, exists) {
    //if error is defined, then there was probably some
    //problem connecting to redis
    if(error) {
        console.log(''ERROR: ''+error);
    }
    //otherwise exists will be available, and we can do something with it
    else if(!exists) {
        client.set(''awesome'', 0); //create the awesome key
    };
});

You can now modify this code so it keeps track of the counts for all of the words that the ntwitter module is watching. This program will be our background worker; my next blog post will show you how to use second Node.js program to create a web server that will allow us to share these counts on a web page. We   ll use the Express web framework to do this.
