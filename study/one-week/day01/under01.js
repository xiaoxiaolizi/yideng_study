//     Underscore.js 1.9.1
//     http://underscorejs.org
//     (c) 2009-2018 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

    // Baseline setup
    // --------------
  
    // Establish the root object, `window` (`self`) in the browser, `global`
    // on the server, or `this` in some virtual machines. We use `self`
    // instead of `window` for `WebWorker` support.
    var root = typeof self == 'object' && self.self === self && self ||
              typeof global == 'object' && global.global === global && global ||
              this ||
              {};

    // 1----------------------    start     
    // 定义underscore对象
    // Create a safe reference to the Underscore object for use below.
    var _ = function(obj) {
      if (obj instanceof _) return obj;
      if (!(this instanceof _)) return new _(obj);
      this._wrapped = obj;
    };
    // 1.1-1 当执行这句代码时，函数中的this指向window
    // obj instanceof _ === false, this instanceof _ === false
    // 所以执行 return new _(obj)
    // 在new的时候，this指向了构造函数_的实例，所以 this instanceof _ === true
    // this._wrapped = obj; 表示构造实例有一个属性_wrapped，值为obj（供后面_.mixin方法调用）

    // 1.1-2 当obj已经是一个实例的时候，_(obj)直接返回这个实例： _(_([1,2])) == _([1,2])
    // 自此，构造过程就结束了
    // 这也就是所谓的 无new调用的构造函数
    
    // 把underscore对象暴露到全局作用域
    // Export the Underscore object for **Node.js**, with
    // backwards-compatibility for their old module API. If we're in
    // the browser, add `_` as a global object.
    // (`nodeType` is checked to ensure that `module`
    // and `exports` are not HTML elements.)
    if (typeof exports != 'undefined' && !exports.nodeType) {
      if (typeof module != 'undefined' && !module.nodeType && module.exports) {
        exports = module.exports = _;
      }
      exports._ = _;
    } else {
      root._ = _;
    }

    // 1----------------------    end  
    // 可以看到代码中的_被定义成了一个函数（暂时先不管函数里面的代码是什么意思），函数也是对象，所以可以在_对象上添加一些方法和属性

    // Current version.
    _.VERSION = '1.9.1';
    

   
    

    // 2----------------------    start
    // _的构造实例怎么调用_.func这些方法呢？构造实例本身没有这些方法，那么这些方法应该存在原型链上，也就是_.prototype上。_又是如何把自身的方法挂载到_.prototype上面呢？
    // 思路：遍历_的属性，如果某个属性的类型是function，就把该函数挂载到_.prototype上
    // Add your own custom functions to the Underscore object.
    // 可向 underscore 函数库扩展自己的方法
    // obj 参数必须是一个对象（JavaScript 中一切皆对象）
    // 且自己的方法定义在 obj 的属性上
    // 如 obj.myFunc = function() {...}
    // 形如 {myFunc: function(){}}
    // 之后便可使用如下: _.myFunc(..) 或者 OOP _(..).myFunc(..)
    _.mixin = function(obj) {
    // _.functions(obj) 返回obj中所有的方法
    // 遍历 obj 的 key，将方法挂载到 Underscore 上
    // 其实是将方法浅拷贝到 _.prototype 上
      _.each(_.functions(obj), function(name) {
        // 当obj是自定义对象时，
        // obj的方法被扩充到underscore的方法集合中以及_.prototype上
        // 直接把方法挂载到 _[name] 上
        // 调用类似 _.myFunc([1, 2, 3], ..)
        var func = _[name] = obj[name];
        // 浅拷贝
        // 将 name 方法挂载到 _ 对象的原型链上，使之能 OOP 调用
        _.prototype[name] = function() {
          // _(args1).func(args2)  == _.func(args1, args2)
          // 右侧func的参数比左侧func的参数多一个，也就是this._wrapped
          // 第一个参数
          var args = [this._wrapped];
          // arguments 为 name 方法需要的其他参数
          push.apply(args, arguments);
          // 执行 func 方法
          // 支持链式操作
          return chainResult(this, func.apply(_, args));  // // this指向underscore实例
        };
      });
      return _;
    };
    
    // 把 _ 对象上的方法都挂载到其原型上
    // Add all of the Underscore functions to the wrapper object.
    // 将前面定义的 underscore 方法添加给包装过的对象
    // 即添加到 _.prototype 中
    // 使 underscore 支持面向对象形式的调用
    _.mixin(_);
    // 2----------------------    end
    // _.mixin 方法可以向 Underscore 库增加自己定义的方法：
  
    // Add all mutator Array functions to the wrapper.
    _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
      var method = ArrayProto[name];
      _.prototype[name] = function() {
        var obj = this._wrapped;
        method.apply(obj, arguments);
        if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
        return chainResult(this, obj);
      };
    });
  
    // Add all accessor Array functions to the wrapper.
    _.each(['concat', 'join', 'slice'], function(name) {
      var method = ArrayProto[name];
      _.prototype[name] = function() {
        return chainResult(this, method.apply(this._wrapped, arguments));
      };
    });


    // 3----------------------    start
    // 开启一个链式调用
    // Add a "chain" function. Start chaining a wrapped Underscore object.
    _.chain = function(obj) {
        // 获得一个underscore实例
        // 无论是否 OOP 调用，都会转为 OOP 形式
        // 并且给新的构造对象添加了一个 _chain 属性
      var instance = _(obj);
      // 标识当前实例支持链式调用
      instance._chain = true;
      // 返回 OOP 对象
      // 可以看到该 instance 对象除了多了个 _chain 属性
      // 其他的和直接 _(obj) 的结果一样
      return instance;
    };
  
    // OOP
    // ---------------
    // If Underscore is called as a function, it returns a wrapped object that
    // can be used OO-style. This wrapper holds altered versions of all the
    // underscore functions. Wrapped objects may be chained.

    // Helper函数，用来判断 实例调用某一方法之后的返回结果是否支持继续链式调用
    // Helper function to continue chaining intermediate results.
    // 一个帮助方法（Helper function）
    var chainResult = function(instance, obj) {
        // 如果需要链式操作，则对 obj 运行 chain 方法，使得可以继续后续的链式操作
        // 如果不需要，直接返回 obj
      return instance._chain ? _(obj).chain() : obj;
    };

    // 由于链式调用的结果被转化为一个带有_chain属性的underscore实例对象，
    // {_wrapped: obj, _chain: true}
    // 所以想要获取链式调用的结果时，需要有个取值过程
    // Extracts the result from a wrapped and chained object.
    _.prototype.value = function() {
      return this._wrapped;  // 返回被包裹的对象
    };
    // 3----------------------    end
  
    // AMD registration happens at the end for compatibility with AMD loaders
    // that may not enforce next-turn semantics on modules. Even though general
    // practice for AMD registration is to be anonymous, underscore registers
    // as a named module because, like jQuery, it is a base library that is
    // popular enough to be bundled in a third party lib, but not be part of
    // an AMD load request. Those cases could generate an error when an
    // anonymous define() is called outside of a loader request.
    if (typeof define == 'function' && define.amd) {
      define('underscore', [], function() {
        return _;
      });
    }
  }());
  //通过传入this（浏览器环境中其实就是window对象）来改变函数的作用域。
  // (function(){}.call(this))等同于(function(){}())，就变成熟知的IIFE的写法了 IIFE（立即执行函数）。