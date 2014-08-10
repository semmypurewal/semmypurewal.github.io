---
layout: post
title: Vagrant 1.1.0 and node-dev-bootstrap
date: '2013-03-17T15:21:00-07:00'
tags: []
tumblr_url: http://blog.semmy.me/post/45607300220/vagrant-1-1-0-and-node-dev-bootstrap
---
Vagrant is a tool that helps build a development environment using a virtual machine provider (like VMWare or VirtualBox). In our class, we   ll use Vagrant with VirtualBox to build a node.js development stack that includes some modern data storage tools (mongodb and redis).

Obviously, part of this process is about convenience: even though installing a node.js development environment on your local machine is pretty easy (and I encourage you to do it!), adding a full server-stack including mongodb and redis is non-trivial and takes a bit of time and patience.

Another reason we   re doing this is consistency. Since I   m controlling the VagrantFile, I   m able to control the versions of node, mongodb and redis that you have installed. Furthermore, using Vagrant allows us to all have the same development environment running whether you   re using Windows or MacOS. This will (hopefully) minimize any issues arising because of version inconsistencies.

Last, but not least, using vagrant to provision our server is useful from a pedagogical perspective; it more clearly separates the client-side portion of our course from the server-side. Since most of what you   ll be doing for the rest of this course involves server-side programming, it makes sense to    separate out    the server in a very explicit way.

So how do we set this up?

First, you   ll need to install the latest version of VirtualBox. At the time of this writing, that is version 4.2.10. You can go to virtualbox.org, click on the    Downloads    link on the left side of the page, and download the appropriate version for your platform. Once downloaded, the installation process will depend on your platform, but you should be able to figure it out at this point.

Second, you   ll need to install the latest version of Vagrant. It turns out that version 1.1 was just released last week, and offers some nice new features. You can go to vagrantup.com, click on the    Downloads     link in the upper right hand corner, click on v1.1.0 (or the latest available 1.1.x version), and grab the latest installer for your platform (hint: if you   re installing it in MacOS it   s Vagrant.dmg, and if you   re installing it in Windows it   s Vagrant.msi). After downloading it, double click on the package and install it in the same way you installed VirtualBox.

If you   re running Windows, you may have to reboot your machine after the installation to make sure your file path is set up correctly. You can test this out by opening a command window (click on your Start menu, and type    cmd    into the search box) and typing    vagrant    version    at the prompt:

C:\Users\semmy>vagrant --version
Vagrant version 1.1.0

If that works, you   re ready to go. If it doesn   t, reboot your machine and try typing the vagrant command again.

If all is well, then you   re ready to get the git repository called node-dev-bootstrap from my github page. If you   re using Windows this will require you opening your git-bash prompt. In either case, go into the directory you   d like to use (most likely your Projects directory) and clone it using the following command:

$ git clone https://github.com/semmypurewal/node-dev-bootstrap

Now if you   re using Windows, the next part may or may not work. There   s an issue with the Windows installer for Vagrant that may cause an error with the following commands. The error will say something along the lines of    a program called    uname.exe    has thrown an exception.    Mitchell Hashimoto has said that there will be a fix for this in the next couple of days, so hopefully it will no longer be an issue by the time you read this.

If this is an issue for you, then you   ll need to open up a Windows command prompt (as described above), enter your directory and run the following commands from there instead of in your git bash prompt.

All that being said, go ahead and enter the project directory and type    vagrant up   :

$ cd node-dev-bootstrap
$ vagrant up

If everything worked correctly, vagrant will build your Virtual Machine. This will take a few minutes. Be patient.

Once it   s finished, your server should be running. How do you check? You   ll need to use a network technology called SSH (which stands for    Secure SHell   ) to connect to the server.

If you   re using MacOS, it   s pretty easy since your platform comes with a built-in ssh client. If you   re running windows, however, it   s a little more complicated because you   ll need to manually install an SSH client.

Either way, go ahead and type:

$ vagrant ssh

If you   re running MacOS, it will connect you to your virtual machine. If you   re running Windows, it will give you the login credentials (most likely the host will be 127.0.0.1 and the port will be 2222). So now you   ll need to download an SSH client to connect     I recommend putty which is available here. When you open up putty, you   ll type in the  Host and the Port that vagrant specified into the appropriate input boxes, and then click    Open.    Putty will connect to your virtual server and ask you for a username and password. Both of these should be pre-set to    vagrant.   

Once you   re logged in, go into the    app    directory of your server and type node server.js:

$ node server.js

Finally, go to your web browser on your host machine and type localhost:3000 in your address bar. If everything worked correctly, you should see a    Hello World    message. You can stop the program by hitting CTRL-C.

Once you   re done working, you can exit out of your virtual server by typing in    exit.    Then you can kill your vagrant box in one of two ways. You can either type

$ vagrant halt

to just stop the box from running or you can type

$ vagrant destroy

to completely get rid of the box. That will cause it to be rebuilt next time you type    vagrant up    from that directory.

You   ll want to do one of these every time you finish working, because having a virtual machine running in the background will definitely be a drain on your computer   s resources.
