---
title:  "Cache your actions"
permalink: "/blog/cache-your-actions.html"
date:   2024-05-06
description: |
    If your actions have a long installation step (or very big node_modules) you can cache the installation step using the GitHub action actions/cache
tags:
    - github-action
---
If your actions have a long installation step (or very big `node_modules`) you can cache the installation step using the GitHub action [`actions/cache`](https://github.com/actions/cache).

This is very useful for cases where you use a [matrix to run multiple tests](./run-all-your-tests-concurrently).

![](https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTBqbThwcnI5a3R3NHJ3ZzdwZ3ZjNXc0ZnM1bHBqM3JoeHhqanN6byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WSy0SI6qipEDJogaGD/giphy.gif)

They have a lot of [implementation examples](https://github.com/actions/cache/blob/main/examples.md), but they all follow the same logic.

### Find out where your package manager downloads the artifacts
There are step by step instructions for most popular package manager. For example, you can obtain `npm`’s cache by having the following step:

{% raw %}
```yaml
- name: Get npm cache directory
  id: npm-cache-dir
  shell: bash
  run: echo "dir=$(npm config get cache)" >> ${GITHUB_OUTPUT}
```

In the case of this action, the cache gets store into the `steps.npm-cache-dir.outputs.dir` variable.

### Restoring the cache
After you know where your cache is located, you can restore it by using the `actions/cache` action:

```yaml
- uses: actions/cache@v4
  with:
    path: ${{ steps.npm-cache-dir.outputs.dir }} # Cache variable
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```
{% endraw %}

We only want to restore the cache when the packages changed, so we set the `key` variable to use the hashed `package-lock.json`.

We also don’t want to cache the dependencies for a different OS, so we add to the `key` variable the name of the OS.

![](https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXY1bG82eW8zMTU4YTE1OWFrNzdxZWZmY242c2xkOHh1ZTc3eTFsayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MD0ZifiS7yQXCOwDGM/giphy.gif)

And that’s all! Now you can cache all your actions.

Remember to [checkout the examples for your specific package manager](https://github.com/actions/cache/blob/main/examples.md).
