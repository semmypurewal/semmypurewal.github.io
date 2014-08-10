---
layout: post
title: Vagrant + Chef
date: '2011-08-01T15:34:00-07:00'
tags:
- vagrant
- chef
- opscode
- nodejs
- virtualization
- virtualbox
tumblr_url: http://blog.semmy.me/post/8349918517/vagrant-chef
---
A few weeks ago I attended a fantastic CHUGALUG talk by John Maxwell on two incredible technologies: Vagrant and Chef.

Chef is a provisioning tool that essentially allows you to use    cookbooks    to provision development or deployment machines.  For example, you can easily script the installation and configuration of a LAMP stack so that it is a repeatable process.

Vagrant is a set of ruby scripts that allows Chef to easily set up and provision VirtualBox images.  In addition, it provides a wonderfully simple front-end for VirtualBox   s VBoxManage command-line interface.

John uses it at work to help get new devs up to speed quickly.  This seems like a killer use-case: Vagrant+Chef is likely helpful for any collaborative coding project.

On the other hand, I do a lot of coding by myself, so I   ve been using it for the last few months to create separate working environments for all of my projects.  This way I can get my dev environment as close as possible to my deployment environment without modifying my host machine.  I   ve successfully built several node.js environments as well as a CloudFoundry MicroCloud using Vagrant.

Vagrant uses a VagrantFile to set up a new virtual machine.  Here   s an example from a project that I   ve been working on:

Vagrant::Config.run do |config|

  # start with a base Ubuntu Lucid32 box (available on vagrantup.com)
  config.vm.box =    lucid32   

  # forward port 3000 on the guest to port 3000 on the host
  config.vm.forward_port    express   , 3000, 3000

  # set up a shared folder
  config.vm.share_folder    project   ,    /home/vagrant/project   ,    ./project   
end

Note that I don   t do any provisioning with Chef in this example;  I simply manage an Ubuntu Virtual Machine for development purposes.  If you   ve ever had the displeasure of manually setting up shared folders or port forwarding in VirtualBox, you   ll see why this can come in handy.

If you   re setting up run-of-the-mill environments, you can use any of OpsCode   s cookbooks to provision your machine.  For example, creating a cookbooks folder and expanding the VagrantFile as follows sets up a virtual machine with MySQL installed and ready to go.

  config.vm.provision :chef_solo do |chef|
    chef.cookbooks_path =    cookbooks   
    chef.add_recipe    mysql   
  end

Pretty easy, eh?
