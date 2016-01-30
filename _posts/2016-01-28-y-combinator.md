---
layout: post
title: Y combinator from lambda to Javascript
---

The Y combinator (see a nice introduction [here](https://medium.com/@ayanonagon/the-y-combinator-no-not-that-one-7268d8d9c46#.cvw529qfv)), discovered by [Haskell B. Curry](https://en.wikipedia.org/wiki/Haskell_Curry), is defined as:

> Y = λf. (λx. f (x x))(λx. f (x x))

<div class="message">
    <a href="http://www.cs.yale.edu/homes/hudak/CS201S08/lambda.pdf">A Brief and Informal Introduction to the Lambda Calculus</a> is a good article to start with if you've never heard of lambda calculus.
</div>

This form is easy to remember and can be used to derive Y combinator in a functional programming language, like Javascript.

The lambda expression translates to JS as:

{% gist xgfd/b5d54c0e74b236042f9b YCom_1.js%}

However the function body leads to an infinite call loop: 

{% gist xgfd/b5d54c0e74b236042f9b YComLoop.js%}

Notice that the two inner functions are the same, so it's equivalent to:

{% gist xgfd/b5d54c0e74b236042f9b YCom_2.js%}

Now there's only one `x => f(x(x))` so let's focus on that.

Recall that `f` is a pseudo recursive function that expects another function as input, say `g`, which should do the recursion magic, e.g. `g = fact` that `fact(n)` calculates the factorial of `n`. We hope `x(x)` can return `g`. Therefore instead of calling `x(x)`, we wrap `x(x)` in a function that takes `n` as input and simulate `g`. It returns the same result as `x(x)(n)` but stops the infinite loop:

{% gist xgfd/b5d54c0e74b236042f9b YCom.js%}

An example of using Y combinator to construct a recursive function is shown below. Note that ALL functions in the example can be anonymous.

{% gist xgfd/b5d54c0e74b236042f9b Example.js%}
