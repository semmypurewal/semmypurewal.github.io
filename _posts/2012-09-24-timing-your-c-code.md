---
layout: post
title: Timing your C++ code
date: '2012-09-24T16:42:00-07:00'
tags: []
tumblr_url: http://blog.semmy.me/post/32214795383/timing-your-c-code
---
For our first project in our Data Structures class, we have to time some code to compare various implementations of a data structure. In C++, we can do this by using the ctime library.

Here   s a skeleton example to get you started.

#include <iostream>
#include <ctime>

int main() {
  int start, end, elapsed;
  double seconds;

  start = clock(); //get starting ticks

  //insert code you want to time here                                                                                                                                                                                 

  end = clock(); //get ending ticks
  elapsed = end - start; //calculate total elapsed ticks

  seconds = (double) elapsed/CLOCKS_PER_SEC; //convert to seconds

  std::cout << "elapsed time: " << seconds << " seconds " << std::endl;
}
