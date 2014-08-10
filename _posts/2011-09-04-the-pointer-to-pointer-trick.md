---
layout: post
title: The Pointer-to-Pointer Trick
date: '2011-09-04T19:12:00-07:00'
tags:
- C
- C++
- pointers
tumblr_url: http://blog.semmy.me/post/9809052196/the-pointer-to-pointer-trick
---
I learned this trick from Aaron Windsor when I was the TA for his data structures class in 2002.  We were using the Lewis and Deninburg textbook Data Structures and their Algorithms.  In this book, the authors use a special data structure called a locative to achieve a similar effect at simplifying some of their linked-structure traversal code.

Here   s a simplified version of a more general scenario: suppose you   re trying to insert at the end of a linked list of integers, and the list only has a front pointer.  You   re using the C programming language (although this can be done in C++ as well).

The problem is that the obvious solution has to treat an empty list as a special case.  Consider the following code that inserts an integer into a linked list of integers.

void insert(List *the_list, int num_to_insert)  {
  if(the_list->front == NULL)
    the_list->front = create_node(num_to_insert);
  else  {
    LLNode *curr = the_list->front;
    while(curr->next != NULL)
      curr = curr->next;
    curr->next = node_to_insert;
  }
}

Why treat the empty list as a special case?  After all, you can picture the front pointer as being a next pointer that is not associated with any node.  So if we avoid using pointers to nodes, and instead use pointers to the next pointers, we can avoid the special case altogether since this allows us to treat the front node in exactly the same way.  Here   s the modified code.

void insert(List *the_list, int num_to_insert)  {
  LLNode **curr = &(the_list->front);
  while(*curr != NULL)
    curr = &((*curr)->next);
  *curr = create_node(num_to_insert);
}

As far as I can tell, this doesn   t increase the efficiency of the generated code but it (arguably) simplifies the code by removing a special case.

The trick can handle more complicated inserts as well.  Try modifying the code above so that it inserts into an ordered list.  If you   re able to do that, try implementing a binary search tree data structure using the same trick for insertion and search.

Note that this code may not be production ready.  You probably want to make sure that your node was actually created since you   re calling malloc in the create_node function.  You can do that in the create_node function itself by checking the return value of the malloc function and calling an error function if it is NULL.
