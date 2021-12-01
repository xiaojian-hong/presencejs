'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var rxjs = require('rxjs');
var operators = require('rxjs/operators');
var webSocket = require('rxjs/webSocket');

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime_1 = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined$1; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined$1) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined$1;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined$1;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined$1;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined$1, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined$1;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined$1;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined$1;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   module.exports 
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}
});

// Copyright 2018 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
//
// This file has been modified for use by the TinyGo compiler.
// Map multiple JavaScript environments to a single common API,
// preferring web standards over Node.js API.
//
// Environments considered:
// - Browsers
// - Node.js
// - Electron
// - Parcel
// @ts-nocheck
if (typeof global !== 'undefined') ; else if (typeof window !== 'undefined') {
  window.global = window;
} else if (typeof self !== 'undefined') {
  self.global = self;
} else {
  throw new Error('cannot export Go (neither global, window nor self is defined)');
}

if (!global.require && typeof require !== 'undefined') {
  global.require = require;
}

if (!global.fs && global.require) {
  global.fs = /*#__PURE__*/require('fs');
}

var enosys = function enosys() {
  var err = new Error('not implemented');
  err.code = 'ENOSYS';
  return err;
};

if (!global.fs) {
  var outputBuf = '';
  global.fs = {
    constants: {
      O_WRONLY: -1,
      O_RDWR: -1,
      O_CREAT: -1,
      O_TRUNC: -1,
      O_APPEND: -1,
      O_EXCL: -1
    },
    writeSync: function writeSync(fd, buf) {
      outputBuf += decoder.decode(buf);
      var nl = outputBuf.lastIndexOf('\n');

      if (nl != -1) {
        console.log(outputBuf.substr(0, nl));
        outputBuf = outputBuf.substr(nl + 1);
      }

      return buf.length;
    },
    write: function write(fd, buf, offset, length, position, callback) {
      if (offset !== 0 || length !== buf.length || position !== null) {
        callback(enosys());
        return;
      }

      var n = this.writeSync(fd, buf);
      callback(null, n);
    },
    chmod: function chmod(path, mode, callback) {
      callback(enosys());
    },
    chown: function chown(path, uid, gid, callback) {
      callback(enosys());
    },
    close: function close(fd, callback) {
      callback(enosys());
    },
    fchmod: function fchmod(fd, mode, callback) {
      callback(enosys());
    },
    fchown: function fchown(fd, uid, gid, callback) {
      callback(enosys());
    },
    fstat: function fstat(fd, callback) {
      callback(enosys());
    },
    fsync: function fsync(fd, callback) {
      callback(null);
    },
    ftruncate: function ftruncate(fd, length, callback) {
      callback(enosys());
    },
    lchown: function lchown(path, uid, gid, callback) {
      callback(enosys());
    },
    link: function link(path, _link, callback) {
      callback(enosys());
    },
    lstat: function lstat(path, callback) {
      callback(enosys());
    },
    mkdir: function mkdir(path, perm, callback) {
      callback(enosys());
    },
    open: function open(path, flags, mode, callback) {
      callback(enosys());
    },
    read: function read(fd, buffer, offset, length, position, callback) {
      callback(enosys());
    },
    readdir: function readdir(path, callback) {
      callback(enosys());
    },
    readlink: function readlink(path, callback) {
      callback(enosys());
    },
    rename: function rename(from, to, callback) {
      callback(enosys());
    },
    rmdir: function rmdir(path, callback) {
      callback(enosys());
    },
    stat: function stat(path, callback) {
      callback(enosys());
    },
    symlink: function symlink(path, link, callback) {
      callback(enosys());
    },
    truncate: function truncate(path, length, callback) {
      callback(enosys());
    },
    unlink: function unlink(path, callback) {
      callback(enosys());
    },
    utimes: function utimes(path, atime, mtime, callback) {
      callback(enosys());
    }
  };
}

if (!global.process) {
  global.process = {
    getuid: function getuid() {
      return -1;
    },
    getgid: function getgid() {
      return -1;
    },
    geteuid: function geteuid() {
      return -1;
    },
    getegid: function getegid() {
      return -1;
    },
    getgroups: function getgroups() {
      throw enosys();
    },
    pid: -1,
    ppid: -1,
    umask: function umask() {
      throw enosys();
    },
    cwd: function cwd() {
      throw enosys();
    },
    chdir: function chdir() {
      throw enosys();
    }
  };
}

if (!global.crypto) {
  var nodeCrypto = /*#__PURE__*/require('crypto');

  global.crypto = {
    getRandomValues: function getRandomValues(b) {
      nodeCrypto.randomFillSync(b);
    }
  };
}

if (!global.performance) {
  global.performance = {
    now: function now() {
      var _process$hrtime = process.hrtime(),
          sec = _process$hrtime[0],
          nsec = _process$hrtime[1];

      return sec * 1000 + nsec / 1000000;
    }
  };
}

if (!global.TextEncoder) {
  global.TextEncoder = /*#__PURE__*/require('util').TextEncoder;
}

if (!global.TextDecoder) {
  global.TextDecoder = /*#__PURE__*/require('util').TextDecoder;
} // End of polyfills for common API.fglobal


var encoder = /*#__PURE__*/new TextEncoder('utf-8');
var decoder = /*#__PURE__*/new TextDecoder('utf-8');
var logLine = [];

global.Go = /*#__PURE__*/function () {
  function _class() {
    var _this = this;

    this._callbackTimeouts = new Map();
    this._nextCallbackTimeoutID = 1;

    var mem = function mem() {
      // The buffer may change when requesting more memory.
      return new DataView(_this._inst.exports.memory.buffer);
    };

    var setInt64 = function setInt64(addr, v) {
      mem().setUint32(addr + 0, v, true);
      mem().setUint32(addr + 4, Math.floor(v / 4294967296), true);
    };

    var loadValue = function loadValue(addr) {
      var f = mem().getFloat64(addr, true);

      if (f === 0) {
        return undefined;
      }

      if (!isNaN(f)) {
        return f;
      }

      var id = mem().getUint32(addr, true);
      return _this._values[id];
    };

    var storeValue = function storeValue(addr, v) {
      var nanHead = 0x7ff80000;

      if (typeof v === 'number') {
        if (isNaN(v)) {
          mem().setUint32(addr + 4, nanHead, true);
          mem().setUint32(addr, 0, true);
          return;
        }

        if (v === 0) {
          mem().setUint32(addr + 4, nanHead, true);
          mem().setUint32(addr, 1, true);
          return;
        }

        mem().setFloat64(addr, v, true);
        return;
      }

      switch (v) {
        case undefined:
          mem().setFloat64(addr, 0, true);
          return;

        case null:
          mem().setUint32(addr + 4, nanHead, true);
          mem().setUint32(addr, 2, true);
          return;

        case true:
          mem().setUint32(addr + 4, nanHead, true);
          mem().setUint32(addr, 3, true);
          return;

        case false:
          mem().setUint32(addr + 4, nanHead, true);
          mem().setUint32(addr, 4, true);
          return;
      }

      var id = _this._ids.get(v);

      if (id === undefined) {
        id = _this._idPool.pop();

        if (id === undefined) {
          id = _this._values.length;
        }

        _this._values[id] = v;
        _this._goRefCounts[id] = 0;

        _this._ids.set(v, id);
      }

      _this._goRefCounts[id]++;
      var typeFlag = 1;

      switch (typeof v) {
        case 'string':
          typeFlag = 2;
          break;

        case 'symbol':
          typeFlag = 3;
          break;

        case 'function':
          typeFlag = 4;
          break;
      }

      mem().setUint32(addr + 4, nanHead | typeFlag, true);
      mem().setUint32(addr, id, true);
    };

    var loadSlice = function loadSlice(array, len, cap) {
      return new Uint8Array(_this._inst.exports.memory.buffer, array, len);
    };

    var loadSliceOfValues = function loadSliceOfValues(array, len, cap) {
      var a = new Array(len);

      for (var i = 0; i < len; i++) {
        a[i] = loadValue(array + i * 8);
      }

      return a;
    };

    var loadString = function loadString(ptr, len) {
      return decoder.decode(new DataView(_this._inst.exports.memory.buffer, ptr, len));
    };

    var timeOrigin = Date.now() - performance.now();
    this.importObject = {
      wasi_snapshot_preview1: {
        // https://github.com/WebAssembly/WASI/blob/main/phases/snapshot/docs.md#fd_write
        fd_write: function fd_write(fd, iovs_ptr, iovs_len, nwritten_ptr) {
          var nwritten = 0;

          if (fd == 1) {
            for (var iovs_i = 0; iovs_i < iovs_len; iovs_i++) {
              var iov_ptr = iovs_ptr + iovs_i * 8; // assuming wasm32

              var ptr = mem().getUint32(iov_ptr + 0, true);
              var len = mem().getUint32(iov_ptr + 4, true);
              nwritten += len;

              for (var i = 0; i < len; i++) {
                var c = mem().getUint8(ptr + i);

                if (c == 13) ; else if (c == 10) {
                  // LF
                  // write line
                  var line = decoder.decode(new Uint8Array(logLine));
                  logLine = [];
                  console.log(line);
                } else {
                  logLine.push(c);
                }
              }
            }
          } else {
            console.error('invalid file descriptor:', fd);
          }

          mem().setUint32(nwritten_ptr, nwritten, true);
          return 0;
        },
        fd_close: function fd_close() {
          return 0;
        },
        fd_fdstat_get: function fd_fdstat_get() {
          return 0;
        },
        fd_seek: function fd_seek() {
          return 0;
        },
        proc_exit: function proc_exit(code) {
          if (global.process) {
            // Node.js
            process.exit(code);
          } else {
            // Can't exit in a browser.
            throw 'trying to exit with code ' + code;
          }
        },
        random_get: function random_get(bufPtr, bufLen) {
          crypto.getRandomValues(loadSlice(bufPtr, bufLen));
          return 0;
        }
      },
      env: {
        // func ticks() float64
        'runtime.ticks': function runtimeTicks() {
          return timeOrigin + performance.now();
        },
        // func sleepTicks(timeout float64)
        'runtime.sleepTicks': function runtimeSleepTicks(timeout) {
          // Do not sleep, only reactivate scheduler after the given timeout.
          setTimeout(_this._inst.exports.go_scheduler, timeout);
        },
        // func finalizeRef(v ref)
        'syscall/js.finalizeRef': function syscallJsFinalizeRef(sp) {
          // Note: TinyGo does not support finalizers so this should never be
          // called.
          console.error('syscall/js.finalizeRef not implemented');
        },
        // func stringVal(value string) ref
        'syscall/js.stringVal': function syscallJsStringVal(ret_ptr, value_ptr, value_len) {
          var s = loadString(value_ptr, value_len);
          storeValue(ret_ptr, s);
        },
        // func valueGet(v ref, p string) ref
        'syscall/js.valueGet': function syscallJsValueGet(retval, v_addr, p_ptr, p_len) {
          var prop = loadString(p_ptr, p_len);
          var value = loadValue(v_addr);
          var result = Reflect.get(value, prop);
          storeValue(retval, result);
        },
        // func valueSet(v ref, p string, x ref)
        'syscall/js.valueSet': function syscallJsValueSet(v_addr, p_ptr, p_len, x_addr) {
          var v = loadValue(v_addr);
          var p = loadString(p_ptr, p_len);
          var x = loadValue(x_addr);
          Reflect.set(v, p, x);
        },
        // func valueDelete(v ref, p string)
        'syscall/js.valueDelete': function syscallJsValueDelete(v_addr, p_ptr, p_len) {
          var v = loadValue(v_addr);
          var p = loadString(p_ptr, p_len);
          Reflect.deleteProperty(v, p);
        },
        // func valueIndex(v ref, i int) ref
        'syscall/js.valueIndex': function syscallJsValueIndex(ret_addr, v_addr, i) {
          storeValue(ret_addr, Reflect.get(loadValue(v_addr), i));
        },
        // valueSetIndex(v ref, i int, x ref)
        'syscall/js.valueSetIndex': function syscallJsValueSetIndex(v_addr, i, x_addr) {
          Reflect.set(loadValue(v_addr), i, loadValue(x_addr));
        },
        // func valueCall(v ref, m string, args []ref) (ref, bool)
        'syscall/js.valueCall': function syscallJsValueCall(ret_addr, v_addr, m_ptr, m_len, args_ptr, args_len, args_cap) {
          var v = loadValue(v_addr);
          var name = loadString(m_ptr, m_len);
          var args = loadSliceOfValues(args_ptr, args_len);

          try {
            var m = Reflect.get(v, name);
            storeValue(ret_addr, Reflect.apply(m, v, args));
            mem().setUint8(ret_addr + 8, 1);
          } catch (err) {
            storeValue(ret_addr, err);
            mem().setUint8(ret_addr + 8, 0);
          }
        },
        // func valueInvoke(v ref, args []ref) (ref, bool)
        'syscall/js.valueInvoke': function syscallJsValueInvoke(ret_addr, v_addr, args_ptr, args_len, args_cap) {
          try {
            var v = loadValue(v_addr);
            var args = loadSliceOfValues(args_ptr, args_len, args_cap);
            storeValue(ret_addr, Reflect.apply(v, undefined, args));
            mem().setUint8(ret_addr + 8, 1);
          } catch (err) {
            storeValue(ret_addr, err);
            mem().setUint8(ret_addr + 8, 0);
          }
        },
        // func valueNew(v ref, args []ref) (ref, bool)
        'syscall/js.valueNew': function syscallJsValueNew(ret_addr, v_addr, args_ptr, args_len, args_cap) {
          var v = loadValue(v_addr);
          var args = loadSliceOfValues(args_ptr, args_len);

          try {
            storeValue(ret_addr, Reflect.construct(v, args));
            mem().setUint8(ret_addr + 8, 1);
          } catch (err) {
            storeValue(ret_addr, err);
            mem().setUint8(ret_addr + 8, 0);
          }
        },
        // func valueLength(v ref) int
        'syscall/js.valueLength': function syscallJsValueLength(v_addr) {
          return loadValue(v_addr).length;
        },
        // valuePrepareString(v ref) (ref, int)
        'syscall/js.valuePrepareString': function syscallJsValuePrepareString(ret_addr, v_addr) {
          var s = String(loadValue(v_addr));
          var str = encoder.encode(s);
          storeValue(ret_addr, str);
          setInt64(ret_addr + 8, str.length);
        },
        // valueLoadString(v ref, b []byte)
        'syscall/js.valueLoadString': function syscallJsValueLoadString(v_addr, slice_ptr, slice_len, slice_cap) {
          var str = loadValue(v_addr);
          loadSlice(slice_ptr, slice_len).set(str);
        },
        // func valueInstanceOf(v ref, t ref) bool
        'syscall/js.valueInstanceOf': function syscallJsValueInstanceOf(v_addr, t_addr) {
          return loadValue(v_addr) instanceof loadValue(t_addr);
        },
        // func copyBytesToGo(dst []byte, src ref) (int, bool)
        'syscall/js.copyBytesToGo': function syscallJsCopyBytesToGo(ret_addr, dest_addr, dest_len, dest_cap, source_addr) {
          var num_bytes_copied_addr = ret_addr;
          var returned_status_addr = ret_addr + 4; // Address of returned boolean status variable

          var dst = loadSlice(dest_addr, dest_len);
          var src = loadValue(source_addr);

          if (!(src instanceof Uint8Array)) {
            mem().setUint8(returned_status_addr, 0); // Return "not ok" status

            return;
          }

          var toCopy = src.subarray(0, dst.length);
          dst.set(toCopy);
          setInt64(num_bytes_copied_addr, toCopy.length);
          mem().setUint8(returned_status_addr, 1); // Return "ok" status
        },
        // copyBytesToJS(dst ref, src []byte) (int, bool)
        // Originally copied from upstream Go project, then modified:
        //   https://github.com/golang/go/blob/3f995c3f3b43033013013e6c7ccc93a9b1411ca9/misc/wasm/wasm_exec.js#L404-L416
        'syscall/js.copyBytesToJS': function syscallJsCopyBytesToJS(ret_addr, dest_addr, source_addr, source_len, source_cap) {
          var num_bytes_copied_addr = ret_addr;
          var returned_status_addr = ret_addr + 4; // Address of returned boolean status variable

          var dst = loadValue(dest_addr);
          var src = loadSlice(source_addr, source_len);

          if (!(dst instanceof Uint8Array)) {
            mem().setUint8(returned_status_addr, 0); // Return "not ok" status

            return;
          }

          var toCopy = src.subarray(0, dst.length);
          dst.set(toCopy);
          setInt64(num_bytes_copied_addr, toCopy.length);
          mem().setUint8(returned_status_addr, 1); // Return "ok" status
        }
      }
    };
  }

  var _proto = _class.prototype;

  _proto.run = /*#__PURE__*/function () {
    var _run = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(instance) {
      var _this2 = this;

      var callbackPromise;
      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this._inst = instance;
              this._values = [// JS values that Go currently has references to, indexed by reference id
              NaN, 0, null, true, false, global, this];
              this._goRefCounts = []; // number of references that Go has to a JS value, indexed by reference id

              this._ids = new Map(); // mapping from JS values to reference ids

              this._idPool = []; // unused ids that have been garbage collected

              this.exited = false; // whether the Go program has exited

            case 7:

              callbackPromise = new Promise(function (resolve) {
                _this2._resolveCallbackPromise = function () {
                  if (_this2.exited) {
                    throw new Error('bad callback: Go program has already exited');
                  }

                  setTimeout(resolve, 0); // make sure it is asynchronous
                };
              });

              this._inst.exports._start();

              if (!this.exited) {
                _context.next = 12;
                break;
              }

              return _context.abrupt("break", 16);

            case 12:
              _context.next = 14;
              return callbackPromise;

            case 14:
              _context.next = 7;
              break;

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function run(_x) {
      return _run.apply(this, arguments);
    }

    return run;
  }();

  _proto._resume = function _resume() {
    if (this.exited) {
      throw new Error('Go program has already exited');
    }

    this._inst.exports.resume();

    if (this.exited) {
      this._resolveExitPromise();
    }
  };

  _proto._makeFuncWrapper = function _makeFuncWrapper(id) {
    var go = this;
    return function () {
      var event = {
        id: id,
        "this": this,
        args: arguments
      };
      go._pendingEvent = event;

      go._resume();

      return event.result;
    };
  };

  return _class;
}();

if (global.require && global.require.main === module && global.process && global.process.versions && !global.process.versions.electron) {
  if (process.argv.length != 3) {
    console.error('usage: go_js_wasm_exec [wasm binary] [arguments]');
    process.exit(1);
  }

  var go = /*#__PURE__*/new Go();
  WebAssembly.instantiate(fs.readFileSync(process.argv[2]), go.importObject).then(function (result) {
    return go.run(result.instance);
  })["catch"](function (err) {
    console.error(err);
    process.exit(1);
  });
}

var Go$1 = global.Go;

var YoMoClient = /*#__PURE__*/function (_Subject) {
  _inheritsLoose(YoMoClient, _Subject);

  function YoMoClient(url, option) {
    var _this;

    if (!isWSProtocol(getProtocol(url))) {
      throw new Error(url + " -> The URL's scheme must be either 'ws' or 'wss'");
    }

    _this = _Subject.call(this) || this;
    _this.reconnectInterval = option.reconnectInterval || 5000;
    _this.reconnectAttempts = option.reconnectAttempts || 5;
    _this.connectionStatus$ = new rxjs.Subject();

    _this.connectionStatus$.subscribe({
      next: function next(isConnected) {
        if (!_this.reconnectionObservable && typeof isConnected === 'boolean' && !isConnected) {
          _this.reconnect(url, option);
        }
      }
    });

    _this.wasmLoaded = false;

    _this.connect(url, option);

    return _this;
  }
  /**
   * return connection status observable
   *
   * @return {YoMoClientConnectionStatusObserver}
   */


  var _proto = YoMoClient.prototype;

  _proto.connectionStatus = function connectionStatus() {
    return this.connectionStatus$.pipe(operators.distinctUntilChanged());
  }
  /**
   * function that handle events given from the server
   *
   * @param event name of the event
   * @param cb is the function executed if event matches the response from the server
   */
  ;

  _proto.on = function on(event, cb) {
    this.pipe(operators.filter(function (message) {
      return message.event && message.event !== 'close' && message.event === event && message.data;
    })).subscribe({
      next: function next(message) {
        return cb(message.data);
      },
      error: function error() {
        return undefined;
      },
      complete: function complete() {
        event === 'close' && cb();
      }
    });
  }
  /**
   * function for sending data to the server
   *
   * @param event name of the event
   * @param data request data
   */
  ;

  _proto.emit = function emit(event, data) {
    this.socket$ && this.socket$.next({
      event: event,
      data: data
    });
  }
  /**
   * Close subscriptions, clean up.
   */
  ;

  _proto.close = function close() {
    this.clearSocket();
  }
  /**
   * connect.
   *
   * @param url - the url of the socket server to connect to
   * @param {YoMoClientOption} option - connect-related configuration
   *
   * @private
   */
  ;

  _proto.connect =
  /*#__PURE__*/
  function () {
    var _connect = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(url, option) {
      var _this2 = this;

      var tag, serializer, deserializer;
      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (this.wasmLoaded) {
                _context.next = 10;
                break;
              }

              _context.prev = 1;
              _context.next = 4;
              return loadWasm('https://d1lxb757x1h2rw.cloudfront.net/y3.wasm');

            case 4:
              this.wasmLoaded = true;
              _context.next = 10;
              break;

            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](1);
              throw _context.t0;

            case 10:
              tag = 0x11;

              serializer = function serializer(data) {
                return window.encode(tag, data).buffer;
              };

              deserializer = function deserializer(event) {
                var uint8buf = new Uint8Array(event.data);
                return window.decode(tag, uint8buf);
              };

              this.socket$ = new webSocket.WebSocketSubject({
                url: url,
                serializer: serializer,
                deserializer: deserializer,
                binaryType: 'arraybuffer',
                openObserver: {
                  next: function next() {
                    _this2.connectionStatus$.next(true);
                  }
                },
                closeObserver: {
                  next: function next() {
                    _this2.clearSocket();

                    _this2.connectionStatus$.next(false);
                  }
                }
              });
              this.socketSubscription = this.socket$.subscribe({
                next: function next(msg) {
                  _this2.next(msg);
                },
                error: function error() {
                  if (!_this2.socket$) {
                    _this2.clearReconnection();

                    _this2.reconnect(url, option);
                  }
                }
              });

            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[1, 7]]);
    }));

    function connect(_x, _x2) {
      return _connect.apply(this, arguments);
    }

    return connect;
  }()
  /**
   * reconnect.
   *
   * @param url - the url of the socket server to connect to
   * @param {YoMoClientOption} option - reconnection-related configuration
   *
   * @private
   */
  ;

  _proto.reconnect = function reconnect(url, option) {
    var _this3 = this;

    this.reconnectionObservable = rxjs.interval(this.reconnectInterval).pipe(operators.takeWhile(function (_, index) {
      return index < _this3.reconnectAttempts && !_this3.socket$;
    }));
    this.reconnectionSubscription = this.reconnectionObservable.subscribe({
      next: function next() {
        return _this3.connect(url, option);
      },
      error: function error() {
        return undefined;
      },
      complete: function complete() {
        _this3.clearReconnection();

        if (!_this3.socket$) {
          _this3.complete();

          _this3.connectionStatus$.complete();
        }
      }
    });
  }
  /**
   * clear socket.
   *
   * @private
   */
  ;

  _proto.clearSocket = function clearSocket() {
    this.socketSubscription && this.socketSubscription.unsubscribe();
    this.socket$ = undefined;
  }
  /**
   * clear reconnect.
   *
   * @private
   */
  ;

  _proto.clearReconnection = function clearReconnection() {
    this.reconnectionSubscription && this.reconnectionSubscription.unsubscribe();
    this.reconnectionObservable = undefined;
  };

  return YoMoClient;
}(rxjs.Subject);

function isWSProtocol(protocol) {
  return protocol === 'ws' || protocol === 'wss';
}
/**
 * get URL's scheme
 *
 * @param url - the url of the socket server to connect to
 */


function getProtocol(url) {
  if (!url) {
    return '';
  }

  return url.split(':')[0];
}
/**
 * @param {RequestInfo} path wasm file path
 */


function loadWasm(_x3) {
  return _loadWasm.apply(this, arguments);
}

function _loadWasm() {
  _loadWasm = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3(path) {
    var go, result;
    return runtime_1.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // This is a polyfill for FireFox and Safari
            if (!WebAssembly.instantiateStreaming) {
              WebAssembly.instantiateStreaming = /*#__PURE__*/function () {
                var _ref = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(resp, importObject) {
                  var source;
                  return runtime_1.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _context2.next = 2;
                          return resp;

                        case 2:
                          _context2.next = 4;
                          return _context2.sent.arrayBuffer();

                        case 4:
                          source = _context2.sent;
                          _context2.next = 7;
                          return WebAssembly.instantiate(source, importObject);

                        case 7:
                          return _context2.abrupt("return", _context2.sent);

                        case 8:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2);
                }));

                return function (_x4, _x5) {
                  return _ref.apply(this, arguments);
                };
              }();
            }

            go = new Go$1();

            go.importObject.env['syscall/js.finalizeRef'] = function () {};

            _context3.prev = 3;
            _context3.next = 6;
            return WebAssembly.instantiateStreaming(fetch(path), go.importObject);

          case 6:
            result = _context3.sent;
            go.run(result.instance);
            _context3.next = 13;
            break;

          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3["catch"](3);
            return _context3.abrupt("return", Promise.reject(_context3.t0));

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[3, 10]]);
  }));
  return _loadWasm.apply(this, arguments);
}

exports.YoMoClient = YoMoClient;
//# sourceMappingURL=yomo-js.cjs.development.js.map
