"use strict";
var Example = (function () {
    function Example() {
    }
    Example.prototype.helloWorld = function () {
        console.log("Helo World!");
    };
    return Example;
}());
exports.Example = Example;
