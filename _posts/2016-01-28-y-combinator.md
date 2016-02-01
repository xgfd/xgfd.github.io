---
layout: post
title: Y combinator from λ to Javascript
categories: [λ calculus, programming]
tags: [λ calculus, programming, javascript]
---

The Y combinator, discovered by [Haskell B. Curry](https://en.wikipedia.org/wiki/Haskell_Curry), is defined as:

> Y = λf. (λx. f (x x))(λx. f (x x))

<div class="message">
Y combinator enables recursion without a function explicitly referring to itself. For a pseudo-recursive function <em>f</em> in the form <em>f = λg. ...g...</em>, we have <em>f (Y f) = Y f</em>. Let <em>g = Y f</em> then we have <em>g = f g = ...g...</em> which is recursive. Thus we achieve recursion without self-reference. <a href="http://www.cs.yale.edu/homes/hudak/CS201S08/lambda.pdf">A Brief and Informal Introduction to the Lambda Calculus</a> is a good article to give a bit more background on lambda calculus and Y combinator.
</div>

This form is easy to remember and can be used to derive Y combinator in a functional programming language, like Javascript.

The lambda expression translates to JS as:

{% gist xgfd/b5d54c0e74b236042f9b YCom_1.js%}

However the function body leads to an infinite call loop: 

{% gist xgfd/b5d54c0e74b236042f9b YComLoop.js%}

<div class="message">
Y(f) is a fixed-point of f, or Y gives a fixed-point of f. 
</div>

Notice that the two inner functions are the same, so it's equivalent to:

{% gist xgfd/b5d54c0e74b236042f9b YCom_2.js%}

Now there's only one `x => f(x(x))` so let's focus on that.

Recall that `f` expects a (recursive) function. To prevent immediately evaluating `x(x)` (and thus to prevent the infinite loop), we wrap `x(x)` in a function that returns the same result for an input `n`, only when needed.

{% gist xgfd/b5d54c0e74b236042f9b YCom.js%}

An example of using Y combinator to construct a recursive function is shown below. Note that ALL functions in the example can be anonymous.

{% gist xgfd/b5d54c0e74b236042f9b Example.js%}
