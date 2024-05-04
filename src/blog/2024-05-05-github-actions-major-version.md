---
title:  "You can use GitHub actions major version by itself"
permalink: "/blog/github-actions-major-version.html"
date:   2024-05-05
tags:
    - github-action
---
Did you know that the official GitHub actions provide a shortcut for the latest major version?

Any action that [starts with `actions/`](https://github.com/actions) usually has two versions that you can use.

For example, when importing [`actions/checkout`](https://github.com/actions/checkout) you can import it as `actions/checkout@v4.1.1`, but when the version `v4.1.2` you’ll have to manually updated it (if you want to be safe).

What we can do instead is use `v4`. Most of GitHub’s *official* actions use a simple major version (`vX`) to point to the latest minor/patch version using that major version.

```mermaid
stateDiagram
    direction LR
    state Versions {
    v400: v4.0.0
    v401: v4.0.1
    v400 --> v401
    v410: v4.1.0
    v401 --> v410
    v411: v4.1.1
    v410 --> v411
    }
    v411 --> v4
```

So `v4` points to `v4.1.1`, and once `v4.1.2` gets release, `v4` will point to that version.

```mermaid
stateDiagram
    direction LR
    state Versions {
    v400: v4.0.0
    v401: v4.0.1
    v400 --> v401
    v410: v4.1.0
    v401 --> v410
    v411: v4.1.1
    v410 --> v411
    v412: v4.1.2
    v411 --> v412
    }
    v412 --> v4
```
