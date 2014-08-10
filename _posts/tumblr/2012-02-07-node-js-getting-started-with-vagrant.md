---
layout: post
title: 'Node.js: Getting Started with Vagrant'
date: '2012-02-07T15:34:00-08:00'
tags:
- nodejs
- vagrant
- chef
- webdev
tumblr_url: http://blog.semmy.me/post/17222183802/node-js-getting-started-with-vagrant
---
(UPDATE: Vagrant 1.0 has been released. It is recommended that you no longer install it via rubygems. Instead you can install it by downloading the appropriate package for your system here. This process is much easier, particularly in Windows.)

When I was asked to teach a course in web development in the CS Department at UNC Asheville, I decided to use Node.js as the server side framework. This was not an easy decision: my initial inclination was to go with Ruby on Rails. One advantage that tipped the scale in Node   s favor, however, is that it is allowing me to teach a single language (JavaScript) on both the client and server-side. Since some of my students are still relatively new to programming, the opportunity to focus on a single language throughout the semester is a major plus. Obviously, there are a few disadvantages to using Node.js, but overall I think I made a good choice. I plan to share more about my experiences once the semester is over.

In the meantime, I have managed to overcome a major hurdle that had me a little worried before we even started: I have a plan to easily get all of the students set up with a working development environment!  As anyone who has taught a web-programming class to undergraduates can attest, setting up a web framework and a DB can be an difficult obstacle to overcome. Due to the diversity of working environments (i.e. students often have their own computers), any workable solution has to be cross-platform (Linux, OS X, and Windows) and should require minimal headaches for the students. After all, our goal is to get them up to speed as developers, and while it   s useful for them to know how to navigate a *nix system, we don   t want to overwhelm them with too much in a single semester.

Fortunately, VirtualBox and Vagrant help solve this problem by allowing Chef to provision virtual machines. (I   ve previously written about Vagrant and Chef here and here.) We   ll be starting the server-side part of the course in a few weeks, so I   ve created a Vagrantfile and compiled a set of Chef cookbooks to get the students started with Node.js, MongoDB and Redis. The Node cookbook was slightly modified from the cookbooks found in the Opscode community site, the mongo cookbooks are the ones officially distributed by 10gen, and the Redis cookbook was built by following Reid Draper   s tutorial.

The result is the node-dev-bootstrap project which I   ve posted on github. To get it to work, I   ll assume you have working copies of git, RubyGems and VirtualBox installed. If you don   t, you can find more information about how to install git here and more information about how to install RubyGems here. You can download VirtualBox here.

Once you have that, you   re ready to go. Fire up a terminal window and run the following commands:


$ gem install vagrant
$ vagrant box add base http://files.vagrantup.com/lucid32.box


If you get a permissions-related error when you type the first command, try running it with sudo, i.e.


$ sudo gem install vagrant


After vagrant is installed, you can check out the git repo:


$ git clone https://github.com/semmypurewal/node-dev-bootstrap.git


Now run


$ cd node-dev-bootstrap
$ vagrant up


and after a few minutes you should have a working Node.js/MongoDB/Redis environment.

Finally, give your environment a try:


$ vagrant ssh
$ cd app
$ node server.js


If all goes well, you should be able to point your browser to localhost:3000 where you   ll see    hello world!   

You can halt your virtual machine by typing the following from your host machine (in the node-dev-bootstrap directory):


$ vagrant halt


and you can completely destroy it with


$ vagrant destroy
