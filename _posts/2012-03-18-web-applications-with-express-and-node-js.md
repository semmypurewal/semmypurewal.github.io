---
layout: post
title: Web Applications with Express and Node.js
date: '2012-03-18T17:56:00-07:00'
tags:
- nodejs
- express
tumblr_url: http://blog.semmy.me/post/19536526990/web-applications-with-express-and-node-js
---
If you worked through the previous tutorials, I hope that you managed to create a basic node.js application, stream data from twitter, and, finally, store aggregate information about that data in a redis data store. To serve up this data in an application, we used the http library to serve up web pages. So if you also completed the suggested exercise in the previous tutorial, your code might look something like this:

var server = http.createServer(function (req, res) {
    client.mget([''awesome'',''cool''], function(err, results) {
	var response = ''<b>Hello from my http server!!</b>'';
	response += ''<p>Total awesome: '' + results[0] + ''</p>'';
	response += ''<p>Total cool: '' + results[1] + ''</p>'';
	res.writeHead(200, {''Content-Type'': ''text/html''});
	res.end(response);
    });
}).listen(3000);

Note that we used redis   s mget command to send in an array of keys and get back an array of values. This isn   t something that I described in my previous blog posts, but it is described in the redis command documentation. If you continue to use redis, it would be helpful to become familiar with some of the commands that redis offers.

Now suppose we wanted to actually style this code and include some javascript. Notice how quickly this can add complexity to our callback function:

 var server = http.createServer(function (req, res) {
    client.mget([''awesome'',''cool''], function(err, results) {
        var response += ''<script>''
        response += ''//script stuff here''
        response += ''</script>'';
        response += ''<style>''
        response += ''//style stuff here''
        response += ''</style>'';
        response += ''<b>Hello from my http server!!</b> <br/>'';
	response += ''<p>Total awesome: '' + results[0] + ''</p>'';
	response += ''<p>Total cool: '' + results[1] + ''</p>'';
        res.writeHead(200, {''Content-Type'': ''text/html''});
        res.end(response);
    });
}).listen(3000); 

This is definitely an unsustainable approach. In fact, if you   re coming from an apache or rails background, this likely seems a little ridiculous. Does this mean we need to hard-code static html files?

Well, the answer is yes and no. If you stick with the core node.js API, there is no built-in method for serving up static html files (at least not to my knowledge). There   s also no built-in method for serving up html templates and partial views like in rails.

That   s where the Express web framework comes in. Express is a web application framework that is inspired by the Sinatra framework for Ruby. It provides a layer on top of the http library that provides these features among others. In this post, I   ll describe how to install express and create an Express application. Then I   ll talk a little bit about how to edit and create routes in your application.

If you   re using vagrant, start by firing up your vagrant virtual machine and ssh   ing into it. Next, you   ll want to install the express binary globally using npm. We haven   t done this type of npm install before; the difference is that we have to use sudo (since this will install express into a system directory) and add the -g flag. Since this is a global operation, it doesn   t matter which directory you are in.

$ sudo npm install -g express

Now we can easily bootstrap an express application. Make sure you   re in the app directory of your virtual machine. You can verify this by typing pwd (print working directory) at the command line. Your output should look something like this:

$ pwd
/home/vagrant/app

If you   re not in /home/vagrant/app, go ahead and use cd to get there. Now we   ll create a new application using the express binary.

$ express
destination is not empty, continue? Y

   create : .
   create : ./package.json
   create : ./app.js
   create : ./public
   create : ./public/javascripts
   create : ./public/images
   create : ./public/stylesheets
   create : ./public/stylesheets/style.css
   create : ./routes
   create : ./routes/index.js
   create : ./views
   create : ./views/layout.jade
   create : ./views/index.jade

   dont forget to install dependencies:
   $ cd . && npm install

Note that express created a series of files, including a file of required dependencies file called package.json. Thanks to that file, we can install all of the new required dependencies by making sure we   re in the directory with package.json and using

npm install

Now you   ll have the Express file structure in your app directory, and your default express application should be in the file called app.js. You can run your express application by running the following command:

node app.js

Now pointing your browser to localhost:3000, you should see the    Welcome to Express    message. Kill your server by typing CTRL-C, and let   s take a look at the directory structure that express created. Type ls at the command prompt and, in addition to server.js, twitter.js and credentials.js, you should see all of the following files/directories:

app.js: the auto-generated express application
  node_modules: your application   s module dependencies
  package.json: a file that specifies your application   s dependencies
  public: your static client-side files (usually stylesheets and client-side JavaScript files, but it sometimes includes html files)
  routes: callbacks for the various routes in your application
  views: your html templates
For this blog post, we   re primarily interested in the app.js file and the routes directory. Open up the app.js file and take a look at the section that looks like

// Routes                                                                                                                                                                          

app.get(''/'', routes.index);

Routes are the URL paths in your application. For example, let   s suppose you had a web application located at mygreatwebapp.com. If your application allowed for multiple users, you might want the URL for their user profile to appear at mygreatwebapp.com/[user]. Both github and twitter do this: visit github.com/semmypurewal or twitter.com/semmypurewal. In this code, we have a single route that is just the index of the page. The callback is defined in a file in the routes directory, but we   ll take a look at that in a moment.

Start up your application and visit localhost:3000. You should get the same    Welcome to Express    message as before, because that   s the    /    route that is defined above. Now try to visit localhost:3000/semmypurewal. You should get an error that says something like    Cannot GET /semmypurewal.    So how do we add a new route to handle that type of request? Modify the code above to add a route like this one:

// Routes                                                                                                                                                                          
app.get(''/'', routes.index);

app.get(''/semmypurewal'', function(req, res) {
    res.send(''Welcome to the profile of Semmy Purewal'');
});

Now restart your app, and point your browser to localhost:3000. You   ll see the same    Welcome to Express    screen as before. But if you point your browser to localhost:3000/semmypurewal, you   ll now see the application handles the request as you describe in your callback function.

This is great, but obviously, if our application has over a million users it would be tedious to create a separate callback for each one. But we can easily generate an infinite number of routes by using variables. For example, try adding a route like this:

// Routes                                                                                                                                                                          
app.get(''/'', routes.index);

app.get(''/semmypurewal'', function(req, res) {
    res.send(''Welcome to the profile of Semmy Purewal'');
});

app.get(''/users/:user'', function(req, res) {
    res.send(''Welcome to the profile of '' + req.params.user + ''!'');
});

Now you can point your browser to localhost:3000/users/semmypurewal or localhost:3000/users/helloworld. In fact, it will respond to any user name. Typically, in the callback for something like this, we would check to see if the username exists and if it does, we would render the page, otherwise we would send a message like    that user was not found!    For now, we   ll keep things simple, though.

But because the code in our callback has the propensity to callback become complicated it   s a good idea to move it into a different file. It   s best to leave express   s app.js file for specifying the configuration of the application along with its routes. Open up the routes/index.js and you   ll see something that looks like this:

exports.index = function(req, res){
  res.render(''index'', { title: ''Express'' })
};

The index is rendering a view, which we   ll learn about in the next blog post. For now, let   s modify this file to include the user route like this:

exports.index = function(req, res){
  res.render(''index'', { title: ''Express'' })
};

exports.user = function(req, res) {
    res.send(''Welcome to the profile of '' + req.params.user + ''!'');
}

and also change the route specification in app.js to look like this:

app.get(''/'', routes.index);
app.get(''/users/:user'', routes.user);

Now starting up your app should allow for both routes with the callbacks specified in a separate file!

Obviously, we   re more interested in having routes for all of the words we   re tracking on twitter, so go ahead and create a route called    words    that takes in a parameter. Specifically, we   d like the route    localhost:3000/words/awesome    to show us the number of times awesome has appeared, while in the callback for a word we   re not tracking it should show us    word not found   . Remember that, in order to get this working, you   ll need to require(   redis   ) at the top of your express file, and create a client. If you can do this you   re doing great!

In the next blog post, we   ll learn how how to render views using embedded JavaScript (ejs). We   ll also learn a slightly better way of organizing route callbacks which will be more in-line with the Model-View-Controller architecture.
