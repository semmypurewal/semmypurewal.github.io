---
layout: post
title: hashlib on a Joyent SmartMachine revisited
date: '2011-06-22T13:32:00-07:00'
tags:
- hashlib
- joyent
- nodejs
- smartmachine
- paas
tumblr_url: http://blog.semmy.me/post/6795245062/hashlib-on-a-joyent-smartmachine-revisited
---
It turns out my original solution did not work     since it couldn   t find hashlib after the push it reverted to the last working version that did not include hashlib.

Today I managed to get it working by manually copying hashlib to the ~/.node_libraries directory.  That doesn   t seem like a good solution since I think npm is using that as an installation location.

After reading this excellent blog post on node module name resolution, I tried the following:

[node@host ~]$ echo $NODE_PATH
/home/node/.node_libraries:/opt/nodejs/node_modules:/home/node/local/lib/node


Based on this, it seems like placing the module in /home/node/local/lib/node should work.  Unfortunately it doesn   t.  I posted a question on Joyent   s discussion board, so we   ll see if anyone responds.
