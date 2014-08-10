---
layout: post
title: Jonathan's Card JSONP-Wrapper
date: '2011-08-10T14:16:00-07:00'
tags:
- jonathanscard
- spotterjs
- ruby
- sinatra
- jsonp
- json
tumblr_url: http://blog.semmy.me/post/8740830519/jonathans-card-jsonp-wrapper
---
I hope you   ve been keeping up with Jonathan Stark   s social hack/experiment.  In short, he   s given the public access to his Starbucks card and allowing them to use it to make purchases with it or add money to it.  It   s kind of like a modern day    leave a penny/take a penny    jar.

One of the most interesting (and exciting) aspects of it is that he had the forethought to create an API which offers access to the current value of the card, along with past values.  This creates an opportunity for creative programmers to mashup or just display the data in interesting ways.

One shortcoming of his API is that it doesn   t support JSONP.  This means that in order to effectively use it, you   d have to muck about in server-side programming.  I   m a big fan of JSONP, so much so that I   m writing a pretty simple JSONP polling library for client side apps to make it easy for beginning web devs and UI designers to build pseudo-realtime mashups without learning server side programming.

So I decided to write a wrapper for Jonathan   s API that allows for JSONP requests.  I deployed it, along with an example, on Cloud Foundry here.

It was pretty easy to write.  I used Sinatra, which is a simple, stripped down Ruby framework.  Here   s the entire code:

require    rubygems   
require    sinatra   
require    net/http   
require    uri   

default_msg =    hi there!   

base_url =    http://jonathanstark.com/card/api   
methods = [   balances   ,   latest   ,   changes   ,   summary   ]

get    /api/:method    do
  if(methods.include?(params[:method]))
    url = base_url+   /   +params[:method]
    resp = Net::HTTP.get_response(URI.parse(url));
    params[   callback   ]?params[   callback   ]+   (   +resp.body+   )   :resp.body
  else
       {   error   :   sorry, that method is not currently supported   }   
  end
end

get    /    do
  default_msg
end

get    /api    do
  default_msg
end

The code is also available on github if you want to fork it and make it better.  Now I just need to write a module for Spotter to make it easy to use the data without having to manually poll the feed.
