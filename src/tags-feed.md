---
layout: "feed.html"
eleventyImport:
  collections: ["tags"]
pagination:
  data: collections
  size: 1
  alias: tag
permalink: /tags/{{ tag }}/
eleventyComputed:
  title: Tagged with "{{ tag }}"
  description: Find all the posts with the tag "{{ tag }}"
---

# Posts using <span class="tag bg-base-300 hover:bg-primary rounded-xl py-1 px-3">#{{ tag }}</span>
