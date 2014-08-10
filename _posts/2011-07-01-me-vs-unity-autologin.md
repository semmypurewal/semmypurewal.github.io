---
layout: post
title: Me vs. Unity + Autologin
date: '2011-07-01T11:39:00-07:00'
tags:
- athica
- freeitathens
- ubuntu
- unity
- autologin
tumblr_url: http://blog.semmy.me/post/7121784247/me-vs-unity-autologin
---
Yesterday I helped out the nice folks at ATHICA on behalf of Free IT Athens.  Most of their problems admitted easy solutions, e.g. aligning the printer and swapping out a DVI cable on a monitor.

The one that I had trouble with, however, involved the controversial Unity display manager in Ubuntu 11.04.  The folks at ATHICA had an older machine running Ubuntu that did not meet the graphics hardware requirements for Unity.  Unfortunately they had upgraded from 10.10 to 11.04 so Unity was automagically installed.  To make matters worse, they had the machine set to autologin so Unity was wreaking havoc before we could select gnome as the environment.

There may be a way to temporarily disable autologin to fix this problem, but I couldn   t figure out how to do it.  So my solution was to drop to a command line prompt (ctrl+alt+f1) and login.  Next, I manually changed the Gnome Display Manager (gdm) configuration file to disable autologin, and restarted gdm:

cd /etc/gdm
sudo cp custom.conf custom.conf.BACKUP
sudo nano custom.conf

With nano (a text editor) opened, I changed the line of the file that said

AutomaticLoginEnable=true

to the following (I   ll bet you can guess):

AutomaticLoginEnable=false

Finally, I restarted gdm using its associated init script:

sudo /etc/init.d/gdm restart

And the login screen came up!  After that it was easy to follow one of the numerous articles on disabling Unity and enabling gnome.
