---
layout: post
title: Vagrant, Chef, and Node.js
date: '2011-09-16T16:50:00-07:00'
tags:
- chef
- devops
- nodejs
- vagrant
tumblr_url: http://blog.semmy.me/post/10287019340/vagrant-chef-and-node-js
---
I recently wrote about Vagrant and Chef. I   ve been using Vagrant as a front-end for VBoxManage for several months now, and I have nothing but awesome things to say about it in that capacity. I   ve also used Chef to provision virtual machines using some of Opscode   s frequently used cookbooks.

In addition to that I had previously set up several node.js environments by ssh   ing into my running virtual machine and manually installing it, but I had never actually provisioned my virtual machine using a node.js recipe for Chef. Today I decided to try doing that.

It turned out to be a bit trickier than I was expecting and so I wrote up some instructions in case you   re also having trouble getting it to work.

As usual, create a project directory, and then use

vagrant init

to create a default vagrant file. We   ll be using chef-solo in this example, so you   ll need to create a local directory to store your cookbooks:

mkdir cookbooks

By default, Vagrant will look there for cookbooks; you can call it something else, but if you do you   ll need to modify your vagrant file. Next you   ll need the opscode build-essential cookbook. You can clone their github repository and copy the build-essential cookbook to your cookbooks directory. 

Next, you   ll need to find and download a Chef recipe for node.js. Here is one that was posted in the opscode community. You can download it from the link in the upper-right corner, or you can follow the link to the github page for the repository that holds the recipe and clone it. Either way, you   ll need to get that directory into your cookbooks directory.

Now you   ll need to edit your Vagrantfile to include the recipe for node.js. To do so edit the commented out lines that look like

  # Enable provisioning with chef solo, specifying a cookbooks path (relative
  # to this Vagrantfile), and adding some recipes and/or roles.
  #
  # config.vm.provision :chef_solo do |chef|
  #   chef.cookbooks_path = "cookbooks"
  #   chef.add_recipe "mysql"
  #   chef.add_role "web"
  #
  #   # You may also specify custom JSON attributes:
  #   chef.json = { :mysql_password => "foo" }
  # end

and make them look something like this:

  config.vm.provision :chef_solo do |chef|
    chef.add_recipe "nodejs"
  end

After that, 

vagrant up

should create a new virtual machine and install node.js from source. There   s only one problem:

$ vagrant ssh
Welcome to Ubuntu!
Last login: Thu Jul 21 13:07:53 2011 from 10.0.2.2
vagrant@lucid32:~$ node --version
v0.4.8

This isn   t the latest version of node.js. It   s at v0.5.5 at the time of this writing. Fortunately, the authors of this cookbook were kind enough to include an optional parameter for the node.js recipe that allows you to select the version. If, for example, we wanted to install version 0.5.0 instead of version 0.4.8, we would modify the provisioning section of our Vagrant file so it looks like:

config.vm.provision :chef_solo do |chef|
    chef.add_recipe "nodejs"
    chef.json =	{
      "nodejs" => {
	"version" => "0.5.0"
      } 
    }
  end

Now running

vagrant provision

will rerun the provisioning scripts giving you a working version of node 0.5.0. You can modify the default.rb file in the attributes directory of the nodejs cookbook if you   d like to install a later version by default.

But what happens when we try to install version 0.5.5?

$vagrant provision
[misc deleted]
---- Begin output of "bash"  "/tmp/chef-script20110914-3732-r572nn-0" ----
STDOUT: 
STDERR: --2011-09-14 14:21:24--  http://nodejs.org/dist/node-v0.5.5.tar.gz
Resolving nodejs.org... 8.12.44.238
Connecting to nodejs.org|8.12.44.238|:80... connected.
HTTP request sent, awaiting response... 404 Not Found
2011-09-14 14:21:25 ERROR 404: Not Found.
---- End output of "bash"  "/tmp/chef-script20110914-3732-r572nn-0" ----
Ran "bash"  "/tmp/chef-script20110914-3732-r572nn-0" returned 8
: stdout
The following SSH command responded with a non-zero exit status.
Vagrant assumes that this means the command failed!

chef-solo -c /tmp/vagrant-chef-1/solo.rb -j /tmp/vagrant-chef-1/dna.json

The output of the command prior to failing is outputted below:

[no output]

Sadly, we got a 404 at some stage of the recipe. After a bit of investigating, I discovered that it was due to the fact that the node.js distribution directory structure changed after the 0.5.0 release. Take a look for yourself.

So to solve this problem, I had to hack the recipe a bit. Here   s the original version (from the recipes/default.rb file in the nodejs cookbook directory):

bash "install nodejs from source" do
  cwd "/usr/local/src"
  user "root"
  code <<-EOH
    wget http://nodejs.org/dist/node-v#{node[:nodejs][:version]}.tar.gz && \
    tar zxf node-v#{node[:nodejs][:version]}.tar.gz && \
    cd node-v#{node[:nodejs][:version]} && \
    ./configure --prefix=#{node[:nodejs][:dir]} && \
    make && \
    make install
  EOH
  not_if "#{node[:nodejs][:dir]}/bin/node -v 2>&1 \
            | grep ''v#{node[:nodejs][:version]}''"
end

I changed it so that the path is dependent on the version of node:

path = node[:nodejs][:version]>"0.5.0"?
            "http://nodejs.org/dist/v#{node[:nodejs][:version]}/":
            "http://nodejs.org/dist/"

bash "install nodejs from source" do
  cwd "/usr/local/src"
  user "root"
  code <<-EOH
    wget #{path}node-v#{node[:nodejs][:version]}.tar.gz && \
    tar zxf node-v#{node[:nodejs][:version]}.tar.gz && \
    cd node-v#{node[:nodejs][:version]} && \
    ./configure --prefix=#{node[:nodejs][:dir]} && \
    make && \
    make install
  EOH
  not_if "#{node[:nodejs][:dir]}/bin/node -v 2>&1 \
             | grep ''v#{node[:nodejs][:version]}''"
end

I   m not that familiar with writing chef recipes, so I hope that I haven   t done anything wrong here. In the end, however, this worked perfectly for me.
