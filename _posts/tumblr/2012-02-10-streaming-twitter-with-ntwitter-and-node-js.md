---
layout: post
title: Streaming Twitter with nTwitter and Node.js
date: '2012-02-10T17:34:00-08:00'
tags:
- nodejs twitter ntwitter tutorial
tumblr_url: http://blog.semmy.me/post/17390049513/streaming-twitter-with-ntwitter-and-node-js
---
Accessing the Twitter streaming API with Node.js is a breeze with the nTwitter module. This post should show you how to set up a twitter application, install ntwitter, and start getting data from the streaming API. Before we begin, you   ll need to set up a Node.js development environment in Vagrant by following the instructions  here.

If you   d like to create a new project in git (which I recommend), then you   ll want to delete the .git folder in the main directory of the node-dev-bootstrap repository.


$ rm -rf .git


Enter the app directory, and initialize a new git repository.


$ cd app
$ git init


Next, login to your vagrant box, enter the app directory and add the ntwitter module via npm


$ vagrant ssh
$ cd app
$ npm install ntwitter


To get set up, you   ll need to first set up an application by heading here and logging in with your twitter credentials. Once you fill out the form and accept the licensing terms, you   ll need to go to the bottom of the page and click    create my access token    button. This will generate all of the credentials that you need to use the streaming API.

Set up a file called credentials.js in your app directory. Since the app folder is shared between your vagrant VM and your local machine, you can use any text editor to set up this file in the app folder on your local machine. This file will be organized as a CommonJS module so you can include it via a require statement in your program All you need to do is replace the strings below with your actual credentials.

var credentials = {
    consumer_key: ''your consumer key here'',
    consumer_secret: ''your consumer secret here'',
    access_token_key: ''your access token key here'',
    access_token_secret: ''your access token secret here''
};

module.exports = credentials;


Next, we   ll create a simple program in our app directory that prints out tweets that contain any of the following words:    awesome   ,    rad   ,    cool,       gnarly,    and    groovy.    Save the following code in a file called twitter.js.

var twitter = require(''ntwitter'');
var credentials = require(''./credentials.js'');

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
        });
    }
);

If everything is set up correctly, you can run your app from your vagrant VM. If you don   t have a terminal window open that you   ve already run vagrant ssh in, you   ll need to do that first and enter the app directory.

node twitter.js


and you should see tweets (assuming anyone is tweeting about awesome, rad or cool stuff, which is highly likely). To stop the stream, press CTRL-C to halt the node process.

Note that it uses the credentials file that you created in the previous step. Why should we keep our credentials in a separate file? It   s always a good idea to keep private information (like API keys and passwords) out of your git repository. How do you do that? You can create a .gitignore file that contains the name of all files that you   d like to ignore:

credentials.js


Now typing

$ git status

should show that the only file that hasn   t been added is twitter.js and the ntwitter module. The credentials.js file is ignored. So go ahead and add the file and make a commit:

$ git add .
$ git commit -m "initial commit"
