---
layout: post
title: MongoDB authentication work flow at TCP level
categories: [noSQL, programming]
tags: [mongodb, programming]
---

In a personal project I'm looking at ways to manipulate authentication to a MongoDB at communication protocol level. MongoDB clients communicate with the database server using commands that are sent via a TCP/IP socket. Encoding of basic operations including *UPDATE*, *INSERT*, *QUERY*, *GET_MORE* and *KILL_CURSORS* are covered in [MongoDB Wire Protocol](https://docs.mongodb.org/v3.0/reference/mongodb-wire-protocol/). Authentication, on the other hand, is only described in the [official manual](https://docs.mongodb.org/manual/core/authentication/) at a rather high level. More details of authentication mechanisms are given in [MongoDB authentication specifications](https://github.com/mongodb/specifications/blob/master/source/auth/auth.rst), but again it's not clear how authentication messages and commands are encoded at TCP level. After digging around [MongoDB core driver](https://github.com/christkv/mongodb-core) with help of its author [Christian Kvalheim](https://github.com/christkv), I got the flowchart below showing how authentication is done at a low level. Process in the flowchart are linked to source code of MongoDB core driver. 

<div style="width: 640px; height: 480px; margin: 10px; position: relative;"><iframe allowfullscreen frameborder="0" style="width:640px; height:480px" src="https://www.lucidchart.com/documents/embeddedchart/b2fb15f1-47bf-49e5-b0dc-09662b159ba6" id="GXCTp2f65YkA"></iframe></div>

