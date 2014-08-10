---
layout: post
title: 'Twitter API: id vs. id_str'
date: '2011-06-23T14:56:00-07:00'
tags:
- twitterapi
tumblr_url: http://blog.semmy.me/post/6834759070/twitter-api-id-vs-id-str
---
Today I happened upon this curiosity     occasionally a tweet returned by the Twitter API will have different values for id and id_str!  Here   s an example from my timeline:


       in_reply_to_screen_name   :    OReillyMedia   ,
       in_reply_to_user_id_str   :    11069462   ,
       id_str   :    79278346831273984   ,
       contributors   : null,
       retweeted   : false,
       text   :    @OReillyMedia has JavaScript ebooks at 50% off!       ,
       retweet_count   : 0,
       coordinates   : null,
       truncated   : false,
       id   : 79278346831273980,
       source   :    web   ,
       in_reply_to_user_id   : 11069462,
       in_reply_to_status_id   : null,
       favorited   : false


This can cause problems if you   re polling a user   s timeline and using the since_id parameter.  My requests had since_id equal to the id 79278346831273980, and so it continuously returned this tweet as a new result.

This post from Taylor Singletary clarified the problem.  Apparently some JSON implementations can   t handle integers as large as twitter   s tweet IDs, and that   s why the id_str field was introduced.

The take-away is that you should always prefer id_str over id.
