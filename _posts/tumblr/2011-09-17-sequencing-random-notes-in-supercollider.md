---
layout: post
title: Sequencing Random Notes in SuperCollider
date: '2011-09-17T17:58:00-07:00'
tags:
- supercollider
tumblr_url: http://blog.semmy.me/post/10331875210/sequencing-random-notes-in-supercollider
---
For the last few days I   ve been playing around with SuperCollider, a wonderful framework for algorithmic music composition. Today I figured out how to sequence random notes. Here   s an example that plays randomly chosen notes for 0.2 seconds each.

(
var time=0.2;

var notes = [262, 278, 294, 311, 330, 349, 370, 392, 415, 440, 466, 494];

var synth = { 
	var note = notes.choose;
	{ Saw.ar(note, 0.5) };
};

var x = synth.play;

TempoClock.default.sched(time,  { 
	x.free;
	x = synth.play;
	time;
});
)

I used the table on this page to populate the notes array.
