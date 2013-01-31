# invoker

[![build status][1]][2] [![dependency status][3]][4]

[![browser support][5]][6]

invoke abstraction for reducible

## Example

Imagine your writing a reducible representation of some asynchronous
source. `invoke` gives you some sugar for how to write that reducible

```js
var invoker = require("invoker")
var reducible = require("reducible")
var end = require("reducible/end")

function dbReduce(query) {
    return reducible(function (next, initial) {
        var invoke = invoker(next, initial, cleanup)

        var cursor = someDb.query(query)
        cursor.forEach(function (err, value) {
            invoke(err || value)
        })

        cursor.onEnd(function (err) {
            invoke(err || end)
        })

        function cleanup(callback) {
            cursor.close(callback)
        }
    })
}
```

### Without `invoke`

```js
var reducible = require("reducible")
var end = require("reducible/end")

function dbReduce(query) {

    return reducible(function (next, initial) {
        var state = initial
        var ended = false

        var cursor = someDb.query(query)
        cursor.forEach(function (err, value) {
            if (!ended) {
                state = next(err || value, state)
            }

            if (isReduced(state)) {
                ended = true
                cleanup()
            }
        })

        cursor.onEnd(function (err) {
            if (!ended) {
                next(err || end, state)
            }
        })

        function cleanup() {
            cursor.close(function (err) {
                if (err) {
                    return next(err, state)
                }

                next(end, state)
            })
        }
    })
}
```

## Installation

`npm install invoker`

## Contributors

 - Raynos

## MIT Licenced

  [1]: https://secure.travis-ci.org/Colingo/invoker.png
  [2]: http://travis-ci.org/Colingo/invoker
  [3]: http://david-dm.org/Colingo/invoker/status.png
  [4]: http://david-dm.org/Colingo/invoker
  [5]: http://ci.testling.com/Colingo/invoker.png
  [6]: http://ci.testling.com/Colingo/invoker
