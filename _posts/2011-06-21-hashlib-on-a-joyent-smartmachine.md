---
layout: post
title: hashlib on a Joyent SmartMachine
date: '2011-06-21T14:04:00-07:00'
tags:
- hashlib
- joyent
- nodejs
- smartmachine
- paas
tumblr_url: http://blog.semmy.me/post/6761325004/hashlib-on-a-joyent-smartmachine
---
I had a problem installing hashlib on a joyent smartmachine via npm.   This may be related to  the patch Ryan Dahl submitted last month.   So perhaps the npm installation will work soon.

In the meantime, I managed to get hashlib working by creating an empty hashlib directory in the root directory of my repository and pushing my repo.   Next I ssh   d into my smartmachine,  cloned the hashlib git repository into the home directory of my smartmachine,  entered the hashlib directory and did something like

node-waf configure build
cp ~/hashlib/build/default/hashlib.node ~/node-service/current/hashlib/hashlib.node
node-service-restart

It seems to work, but if you   re following along at home make sure that when requiring the module in server.js (or whatever) you specify the path full path to the file:
var hashlib = require(   ./hashlib/hashlib.node   );

Happy hashing!
