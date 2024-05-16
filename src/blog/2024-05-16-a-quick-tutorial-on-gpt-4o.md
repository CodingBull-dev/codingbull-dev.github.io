---
title:  "GPT-4o in under 3 minutes"
date:   2024-05-16
description: |
    Quick introduction into how to use the newly released model GPT-4o.
tags:
    - openai
    - ai
---
Now that [GPT-4o](https://openai.com/index/hello-gpt-4o/) has been released, let’s look into how we can implement our custom GPT-4o assistant.

To start, go to an empty directory and create a `npm` project and install the dependencies:
- `npm init -y`
- `npm install openai`

Because I’m running the code directly, I’m adding the `type: "module"` to my package.json:
```json
{
  "name": "tutorial-gpt-4o",
  "type": "module",
  "version": "1.0.0",
  ...
}
```

Now that we have all of our preparation, it is time to create our script.

```js
// We import the OpenAI library
import { OpenAI } from "openai";

// We set our key in a variable
// Pssss.. you should use an environment variable
const key = "YOUR-API-KEY";

async function main() {
	// The OpenAI constructor accepts an `apiKey` string parameter
    const openai = new OpenAI({ apiKey: key });

    console.log("Writing message");

	// We need to call a chained function
    const chat = await openai.chat.completions.create({
		// This is where we assign GPT-4o
        model: "gpt-4o",
        messages: [{
			// Every message has a `role` and `content`
            role: "user", content: "What color is the sky?"
        }]
    });

	// Finally we log our response
    console.log("Response:", chat.choices[0].message.content);
}

// Don't forget to call your function!
main();

```

If you run `node index.js`, you’ll have an output similar to:
> Writing message
> Response: Hello! I'm just a computer program, so I don't have feelings, but thanks for asking. How can I assist you today?

## Deep diving into the types
Now let’s analyze the code in detail, as some parts may be a little confusing:
```js
messages: [{
	role: "user", content: "What color is the sky?"
}]
```

Every `message` object in the array has two values, the first one is `role`, which represents _who_ is sending the message.
We are using `user`, which indicates the model that it has to reply. We can also use `system`, which will be the core instructions for the model, but it will still be waiting for a second message coming from `user`.

A working example would be the following:
```js
messages: [
	{ role: "system", content: "You are a meteorologist"}
	{ role: "user", content: "Why does it rain?"}
]
```

By setting the `system` instructions, the model now will know that, to every query it receives, it needs to remember that it _is a meterologist_.

The other confusing element could be the value that we receive:
```js
chat.choices[0].message.content
```

Every time we call the completion endpoint it will return an array of choices, by default, **we will always receive a single choice**, so, unless that you manually change this (because you want to compare results), you _should always obtain the element 0 in the array_.

`message` is a wrapper with 3 values, `content`, which is the answer, `role`, which we just saw before. In this case, it would be `assistant`, and finally `tool_calls`, but we won’t see that here (you can see it in [the documentation](https://platform.openai.com/docs/guides/function-calling)).

And that’s it! You can now start experimenting with your model.
