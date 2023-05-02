---
title:  "How to access data between Matrix outputs"
date:   2023-05-02
tags:
    - github-action
---
Let’s say you have a GitHub Action with a matrix that runs 3 jobs:
```yaml
jobs:
  job1:
    strategy:
      matrix:
        names: ["abc", "def", "ghi"]
    runs-on: ubuntu-latest
    steps:
      - name: Do action with ${{ matrix.repo }}
        id: result
        uses: my-org/my-action@main
        with:
          GITHUB_TOKEN: ${{ github.token }}
          data: ${{ matrix.names }}
      - name: Print data
        run: echo "The data is $RESULT"
        env:
          RESULT: ${{ steps.result.outputs.data }}
```
And all of this information needs to be aggregated and handle in the next job. How can we access all of it?
## The expected (and wrong) way
You have two ways of accessing the data in the matrix. The first, and most obvious, way is to have a second job that needs the first job and then access the output variable:
```yaml
jobs:
  job1:
    strategy:
      matrix:
        names: ["abc", "def", "ghi"]
    outputs:
      data: ${{ steps.result.outputs.data }}
    runs-on: ubuntu-latest
    steps:
      - name: Do action with ${{ matrix.repo }}
        id: result
        uses: my-org/my-action@main
        with:
          GITHUB_TOKEN: ${{ github.token }}
          data: ${{ matrix.names }}
  job2:
    runs-on: ubuntu-latest
    # waits for job1 to be finished
    needs: job1
    steps:
      - name: Print data
        run: echo "The data is $RESULT"
        env:
          # access the output of job1
          RESULT: ${{needs.job1.outputs.data}}
```
This **will not work**.

Well, technically speaking, it will work, but only for the last element of the matrix.

You see, every time an _output_ is set for an _id_, it is **rewriting** the old _output_, so, every time the matrix pushes the results, it overwrites the one from the previous run. 

If you are running the matrix in parallel, then this is even more unpredictable, as every run can have a different matrix being the last one.

But don’t worry, there is a leaner way to access these variables, though it will add a bit of boilerplate.
## The solution: Uploading an artifact
If you write your data to a file with a unique name in a common folder, and upload that artifact, it will let you access all the data in one step.

It’s important to **use the same folder name and a unique file name per run**. From [GitHub’s documentation.](https://github.com/actions/upload-artifact#uploading-to-the-same-artifact)
> Each artifact behaves as a file share. Uploading to the same artifact multiple times in the same workflow can overwrite and append already uploaded files.
So, you can do something like this instead:
```yaml
jobs:
  job1:
    strategy:
      matrix:
        names: ["abc", "def", "ghi"]
    outputs:
      data: ${{ steps.result.outputs.data }}
    runs-on: ubuntu-latest
    steps:
      - name: Do action with ${{ matrix.repo }}
        id: result
        uses: my-org/my-action@main
        with:
          GITHUB_TOKEN: ${{ github.token }}
          data: ${{ matrix.names }}
      - name: Write data to file
        run: echo "$DATA" > "$FILE"
        env:
          DATA: ${{ steps.result.outputs.data }}
          # has a custom file name based on the matrix name
          FILE: outputs/${{ matrix.names }}.txt
      - uses: actions/upload-artifact@v3
        with:
          # name of the artifact
          name: outputs
          # uploads all the files in this directory with the .txt ending
          path: outputs/*.txt
```
## Accessing the data
Once you have the data uploaded to an artifact, you can download it with a second job:
```yaml
  job2:
    runs-on: ubuntu-latest
    needs: job1
    steps:
      - name: Load outputs
        uses: actions/download-artifact@v3
        with:
          # fetches all the files inside that artifact
          name: outputs
          path: outputs
        # all the files will be available inside
      - run: ls -la ./outputs
```
If you have a collection of JSON files, you can merge them with `jq` by running:

`jq -s 'reduce .[] as $x ([]; . + $x)' outputs/*.json`

This will print all the json objects merged into one array.

Now you can handle your collection of data.

If you want to unite all your data into a new json file, you can do something like this, for example:

`jq -s 'reduce .[] as $x ([]; . + $x)' outputs/*.json > all.json`

Or, you can assign it to a variable using the following:

`MY_JSON=$(jq -s 'reduce .[] as $x ([]; . + $x)' outputs/*.json)`
