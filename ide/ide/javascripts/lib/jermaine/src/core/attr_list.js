window.jermaine.util.namespace("window.jermaine", function (ns) {
    "use strict";

    function AttrList(name) {
        var that = this,
            listeners = {};

        //this is where the inheritance happens now
        ns.Attr.call(this, name);

        var delegate = function (obj, func) {
            return function () { return obj[func].apply(obj, arguments); };
        };

        //syntactic sugar to keep things grammatically correct
        this.validateWith = this.validatesWith;

        //disable defaultsTo and isImmutable until we figure out how to make it make sense
        this.defaultsTo = function () {
            //no op
        };

        this.isImmutable = function () {
            //no op
        };

        this.isMutable = function () {
            //no op
        };

        this.eachOfWhich = this;

        this.on = function (event, listener) {
            if (event !== "add") {
                throw new Error("AttrList: 'on' only responds to 'add' event");
            }

            if (typeof(listener) !== "function") {
                throw new Error("AttrList: 'on' requires a listener function as the second parameter");
            }

            listeners[event] = listener;
        };


        this.addTo = function (obj) {
            var prop,
            arr = [],
            actualList = {};
            if(!obj || typeof(obj) !== 'object') {
                throw new Error("AttrList: addTo method requires an object parameter");                
            } else {
                actualList.pop = delegate(arr, "pop");
                
                actualList.add = function (item) {
                    if ((that.validator())(item)) {
                        arr.push(item);
                        if (listeners.add !== undefined) {
                            //listeners.add.call();
                            listeners.add.call(obj, item, actualList.size());
                        }
                        return this;         
                    } else {
                        throw new Error(that.errorMessage());
                    }
                };

                actualList.replace = function (index, obj) {
                    if ((typeof(index) !== 'number') || (parseInt(index, 10) !== index)) {
                        throw new Error("AttrList: replace method requires index parameter to be an integer");
                    }

                    if (index < 0 || index >= this.size()) {
                        throw new Error("AttrList: replace method index parameter out of bounds");
                    }

                    if (!(that.validator())(obj)) {
                        throw new Error(that.errorMessage());
                    }

                    arr[index] = obj;
                    return this;
                };

                actualList.at = function (index) {
                    if (index < 0 || index >= this.size()) {
                        throw new Error("AttrList: Index out of bounds");
                    }
                    return arr[index];
                };

                //to keep things more java-y
                actualList.get = actualList.at;

                actualList.size = function () {
                    return arr.length;
                };

                actualList.toJSON = function (JSONreps) {
                    var result = [], 
                        i, j;

                    //check to make sure the current list is not in JSONreps
                    if (JSONreps !== undefined) {
                        for (i = 0;i < JSONreps.length; ++i) {
                            if (JSONreps[i].object === this) {
                                result = JSONreps[i].JSONrep;
                            }
                        }
                    }
                    
                    for (i = 0; i < arr.length; ++i) {
                        if (arr[i].toJSON) {
                            result.push(arr[i].toJSON(JSONreps));
                        } else {
                            result.push(arr[i]);
                        }
                    }
                    return result;
                };

                obj[name] = function () {
                    return actualList;
                };
            }
        };
    }

    //this needs to stay if we're going to use instanceof
    //but note we override all of the methods via delegation
    //so it's not doing anything except for making an AttrList
    //an instance of Attr
    AttrList.prototype = new window.jermaine.Attr(name);

    ns.AttrList = AttrList;
});
