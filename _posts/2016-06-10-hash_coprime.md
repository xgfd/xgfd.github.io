---
layout: post
title: Some notes about using a prime modulus in a hash function
categories: [algorithm]
tags: [hash function, co-prime, gcd]
---

Modular hashing is a common technique to convert a numeric key into an array index in hash tables. Given a hash function in the form

> H(n) = n mod m

it's stated in many textbooks and articles that using a prime modulus *m* tends to disperse hash values evenly. One explanation is that "If *m* is not prime, it may be the case that not all of the bits of the key play a role, which amounts to missing an opportunity to disperse the values evenly" [(Sedgewick and Wayne, p. 460)][algs4e]. It's not obvious why this statement holds, since *n* can be represented as a *m*-base number (*n=&sum;a<sub>i</sub> · m<sup>i</sup>*) and only the last digit plays a role. 

Others say that (any) *n* and *m* should be co-prime (and a prime *m* has a better chance). This condition gives evenly distributed hash values, but it's too strong. For example, if all possible *n* are evenly distributed, hash values follow an even distribution no matter what *m* is.

It turns out that the distribution of hash values is related to the greatest common divisor (GCD) of all possible *n* and *m*. To demonstrate this, we rewrite the above hash function into 

> n = a · m + H(n)

where *a* is a none negative integer. Assuming the GCD of all possible *n* and *m* is *d*, then we have 

> n = i · d = a · j · d + H(n)

and therefore

> H(n) = d · (i - a · j) 

Since *H(n)* has *d* as a factor, hash values are evenly distributed in range *[0, m-1]* iff *d = 1*.

* If all possible *n* and *m* are co-prime, then *d = 1*.
* If *n* follows a even distribution, then *d = 1*.
* If the distribution of *n* is unknown, a prime *m* increase the probability to minimize *d*, and thus hash values disperse more evenly.



[algs4e]: http://algs4.cs.princeton.edu/home/ "Algorithms 4th Edition, Robert Sedgewick and Kevin Wayne"