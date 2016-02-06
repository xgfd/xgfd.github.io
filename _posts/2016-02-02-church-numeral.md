---
layout: post
title: Rational for Church encoding
categories: [λ calculus]
tags: [λ calculus, numeral representation]
---

In λ calculus natural numbers are represented in the following form (following normal order reduction):

> 0 = λf. λx. x

> 1 = λf. λx. f x

> 2 = λf. λx. f (f x)

> n = λf. λx. f <sup>n</sup> x

<div class="message">
{% raw %}
In set theory, 0 is represented as ∅, the empty set, and every natural number n is the set of
all previous natural numbers. So 1 = {0} = {∅}, 2 = {1, 0} = {{0}, 0}.
{% endraw %}
</div>

Under Church encoding some arithmetic operations are defined as:

> [m + n] → λf. λx. (m f) (n f x) = λf. λx. ((m f) · (n f)) x)

> [m × n] → λf. m n = m · n

> m <sup>n</sup> → n m

Note that multiplication is implemented by function composition and exponentiation by reverse function application.

Although Church encoding works fine to represent natural number system, it's not intuitive where the form *λf.λx.f <sup>n</sup> x* comes from.

Hinze provides [a great explanation](http://www.cs.ox.ac.uk/ralf.hinze/publications/Church.pdf) (twice!). However, for those who finds the above article too long, here's my clumsy attempt to partially explain the rational behind Church encoding.

In the Peano numeral system, natural numbers are defined using a constant symbol *0* and a unary function symbol *S*, known as the successor function. *0* is a natural number, and for every natural number *n*, *S(n)* is a natural number too. So we can define *1* as *S(0)*, *2* as *S(1) = S(S(0))* and so on. This from is the same as the body of *λf.λx.f <sup>n</sup> x*, if we let *f = S, x = 0*. Now it may become clearer that Church encoding enables a quite straightforward mapping between λ calculus and Peano numerals, that is, given a Church numeral *n = λf.λx.f <sup>n</sup> x*, *n S 0* gives you the corresponding Peano numeral.
