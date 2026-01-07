/**
 * @param {AsyncFunc[]} funcs
 * @return {(callback: Callback) => void}
 */
function race(funcs) {
  return function (callbackfunc, data) {
    const promises = funcs.map((fun) => {
      return new Promise((resolve, reject) => {
        fun((error, data) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        }, data);
      });
    });

    Promise.race(promises)
      .then((data) => {
        callbackfunc(undefined, data);
      })
      .catch((err) => {
        callbackfunc(err, undefined);
      });
  };
}

### 📝 Note on callback handling in `race()` implementation

One important thing to understand in this solution is **why we do NOT pass the final callback directly to each async function**, and instead create an internal wrapper callback like:

```js
(error, data) => {
  if (error) reject(error)
  else resolve(data)
}
```

#### Why is this necessary?

Each async function follows this contract:

```ts
func(callback, data)
```

The async function **does not care** where the callback comes from — it only expects:

* a function
* that accepts `(error, data)`

So the callback we pass can be:

* the final callback provided by `race`
* **or** an internal wrapper callback created by us

#### What role does the wrapper callback play?

In the Promise-based approach, the wrapper callback acts as an **adapter**:

* It intercepts the async function’s result
* Translates callback-style results into `resolve / reject`
* Allows `Promise.race()` to decide which async function finishes first

Only **after** `Promise.race` settles do we call the final callback **once** with the winning result.

#### Why not pass the final callback directly?

If we passed the final callback directly to every async function:

* Multiple async functions could call it
* We would lose control over “first result wins”
* `Promise.race` would become meaningless

So instead, we:

1. Give each async function its own wrapper callback
2. Let Promises compete
3. Call the final callback exactly once with the winner

#### Key takeaway

> Async functions don’t need the “real” callback —
> they just need *a* callback with the correct `(error, data)` signature.

Which callback we pass depends on **who should receive the result** and **who controls execution flow**.

