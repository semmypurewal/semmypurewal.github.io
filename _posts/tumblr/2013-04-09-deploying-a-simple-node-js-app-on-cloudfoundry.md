---
layout: post
title: Deploying a Simple Node.js app on CloudFoundry
date: '2013-04-09T14:53:54-07:00'
tags: []
tumblr_url: http://blog.semmy.me/post/47553962398/deploying-a-simple-node-js-app-on-cloudfoundry
---
Now we have an application that is made up of a twitter worker and an express application that serves up data. The next piece of the puzzle is deploying our application on the web. That used to require a lot of work, since we'd have to purchase server space, set up the server with required software, point a domain name to our application, etc. Times have changed a lot since then, and there are now services called "platforms-as-a-service" that take care of the hard work for you.

We'll use CloudFoundry, the open-source platform as a service, but there are many other options including Heroku and Nodejitsu. For CloudFoundry, you'll start by signing up for an account here.

Next, we'll set up the command-line client for CloudFoundry. To do so, we'll need to start by installing Ruby. This video walks you through installing Ruby (and the RedCar text editor)in both MacOS and Windows.

Once you have Ruby installed, open your ruby command prompt (which will just be your normal terminal window in MacOS, and in Windows you'll have an application called "Open Command Prompt with Ruby"). Once there, install the vmc client using RubyGems:

$ sudo gem install vmc

Now, let's create a very simple Node.js program and deploy it. Let's use the following program:

var http = require("http");

var server = http.createServer(function (req, res) {
    res.writeHeader({
        "Content-Type":"text/html"
    });
    res.end("Hello from CloudFoundry!");
}).listen(3000);

Once we're sure that our programming is correctly running locally, we're ready to deploy it. To do this, we'll open up our ruby command prompt and navigate to the directory storing the program. Once there, we'll type a series of commands:

$ vmc target api.cloudfoundry.com
Setting target to https://api.cloudfoundry.com... OK
$ vmc login
target: https://api.cloudfoundry.com

Email> youremail@example.com

Password> *********

Authenticating... OK

Now we'll deploy using the push command. This will enter us into a dialogue with vmc.

$ vmc push
Name> cloudfoundrytutorial

Instances> 1

1: node
2: other
Framework> node

1: node
2: node06
3: node08
4: other
Runtime> 1

1: 64M
2: 128M
3: 256M
4: 512M
5: 1G
Memory Limit> 64M

Creating cloudfoundrytutorial... OK

1: cloudfoundrytutorial.cloudfoundry.com
2: none
Domain> cloudfoundrytutorial.cloudfoundry.com

Updating cloudfoundrytutorial... OK

Create services for application?> n

Bind other services to application?> n

Save configuration?> n

Uploading cloudfoundrytutorial... OK
Starting cloudfoundrytutorial... OK
Checking cloudfoundrytutorial...
  0/1 instances: 1 starting
  1/1 instances: 1 running
OK

Your answers will be the same, with the exception of the name. There can only be one application with any given name and URL on CloudFoundry, so if there's a collision you will be notified.

Once you're successful, you can point your browser to http://[the name you entered above].cloudfoundry.com and you should see your app running.

It's probably helpful to check out the vmc help by simply typing vmc in your ruby command prompt. You should get a list of all CloudFoundry commands. One command you'll probably use pretty often is the apps command. This shows a list of all of your deployed apps and their current statuses.

Next, we'll see how to connect to CloudFoundry's Redis instance. once our app is deployed.
