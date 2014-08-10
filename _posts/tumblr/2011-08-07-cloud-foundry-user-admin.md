---
layout: post
title: Cloud Foundry User Admin
date: '2011-08-07T14:54:00-07:00'
tags:
- cloudfoundry
- sysadmin
- paas
tumblr_url: http://blog.semmy.me/post/8608660840/cloud-foundry-user-admin
---
Cloud Foundry doesn   t make user administration tasks easy (although it   s such a new platform that I forgive them for that).  If you have a micro cloud set up, you   ll need to be an administrator to make changes to users.  In order to become an administrator, ssh into your micro cloud and open the following file in a text editor:

emacs ~/cloudfoundry/vcap/cloud_controller/config/cloud_controller.yml


Find the line that says:

admins: [derek@gmail.com, foobar@vmware.com]


and add the e-mail address that you initially used to create an account to the list (or replace the other two e-mail addresses with yours).

Now, restart the vcap cloud_controller component:

~/cloudfoundry/vcap/bin/vcap restart cloud_controller


At this point, you should have administrator privileges, but you   re going to need to make sure you   re running vmc v. 0.3.12 or later.  You can update the gem with

sudo gem update vmc

Move over to your client machine and connect with vmc using the user account that you added as an admin.  Now you can use undocumented vmc commands like

vmc users

to list users, or execute proxy commands like

vmc -u example_user@example.com passwd

which will change the example user   s password.  You should also be able to delete and add users using the documented delete-user and add-user commands.

This is helpful if one of your users forgets their password.  If you   ve forgotten the password for the original account you created, you should be able to register a new user, add that user as an admin (as described above), and then reset the password using the proxy method above.  I haven   t tried it yet, but I suspect that   s your best bet.
