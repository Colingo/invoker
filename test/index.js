var test = require("tape")
var reducible = require("reducible")
var reduce = require("reducible/reduce")
var reduced = require("reducible/reduced")
var end = require("reducible/end")

var invoker = require("../index")

test("invoker returns function", function (assert) {
    var invoke = invoker()

    assert.equal(typeof invoke, "function")
    assert.end()
})

test("invoke sends result", function (assert) {
    var result = reducible(function (next, state) {
        var invoke = invoker(next, state)

        invoke(42)
    })

    assert.deepEqual(into(result), [42])
    assert.end()
})

test("invoke can send multiple results", function (assert) {
    var result = reducible(function (next, state) {
        var invoke = invoker(next, state)

        invoke(1)
        invoke(2)
        invoke(3)
    })

    assert.deepEqual(into(result), [1, 2, 3])
    assert.end()
})

test("invoke respects state", function (assert) {
    var result = reducible(function (next, state) {
        var invoke = invoker(next, state)

        invoke(1)
        invoke(2)
        invoke(3)
    })

    assert.deepEqual(intoState(result), [
        [1, 0], [2, 1], [3, 2]
    ])
    assert.end()
})

test("invoke handles isReduced", function (assert) {
    var result = reducible(function (next, state) {
        var invoke = invoker(next, state)

        invoke(1)
        invoke(2)
    })

    assert.deepEqual(intoReduced(result), [
        [1, undefined]
    ])
    assert.end()
})

function intoReduced(r) {
    var list = []

    reduce(r, function (res, state) {
        list.push([res, state])

        return reduced(null)
    })

    return list
}

function intoState(r) {
    var list = []

    reduce(r, function (res, state) {
        list.push([res, state])

        return ++state
    }, 0)

    return list
}

function into(r) {
    var list = []

    reduce(r, function (res) {
        list.push(res)
    })

    return list
}
