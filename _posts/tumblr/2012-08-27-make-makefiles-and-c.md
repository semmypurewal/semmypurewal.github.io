---
layout: post
title: Make, Makefiles and C++
date: '2012-08-27T16:30:00-07:00'
tags: []
tumblr_url: http://blog.semmy.me/post/30334566329/make-makefiles-and-c
---
In our Data Structures class this semester, we   re using C++ in a command-line environment. This means we   ll have the opportunity to use a very powerful build automation tool called make.

Open up your text editor (emacs or vim) and enter the following simple C++ program. Save it as hello.cpp.

#include <iostream>

using std::cout;
using std::endl;

int main() {
  cout << "hello world!" << endl;
}

As we all know by now, we can go to the command line and compile it with something like:

$ g++ -Wall hello.cpp -o hello

We   re actually going to be using a lot of warning flags this semester; they will encourage us to write higher quality (in this case, more portable) code. So, for instance, we might want to do something like this:

$ g++ -Wall -Wextra -Werror hello.cpp -o hello

Obviously, this is a lot to type in anytime we want to compile. Make is a tool that allows us to use a declarative configuration file to specify complex dependencies and build actions for our computer programs. Open your text editor, type the following file and save it as Makefile in the same directory as the above C++ code.

hello: hello.cpp
        g++ -Wall -Wextra -Werror hello.cpp -o hello

The first line is the name of the target (in this case, hello) and the part following the colon is a list of dependencies. In other words, before the hello action is fired, make will ensure that hello.cpp exists, and if it doesn   t it will look for a target to build it. The second line is the action that will build the target.

Note that the second line requires a tab since make relies on tabs to separate the dependencies from the action.

To get this to run, simply drop to the command line and type the make command:

$ make

Make is relatively sophisticated; as an example, it allows for the use of variables. Why would we need variables? Consider a situation where we have numerous compile actions that all use the same warning flags. If we later decide we want to add or remove flags, we have to change every line that has an action. If, on the other hand, we have those stored as a variable, we only have to change them in one place:

CC = g++
CFLAGS = -Wall -Wextra -Werror -pedantic

hello: hello.cpp
        $(CC) $(CFLAGS) -o hello hello.cpp

In this case, we   ve used variables for both the compiler (CC) and the flags (CFLAGS). Now if we later want to change the compiler, we simply have to update the CC variable!

I usually also build two other targets, one of which builds everything (all) and another that cleans up the current directory by removing the binary and any additional temporary files (clean). My final Makefile looks like this:

CC = g++
CFLAGS = -Wall -Wextra -Werror -Weffc++ -pedantic

all: clean hello

hello: hello.cpp
        $(CC) $(CFLAGS) -o hello hello.cpp

clean:
        rm -f *~
        rm -f hello
