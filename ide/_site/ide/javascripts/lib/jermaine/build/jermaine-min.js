if(!Array.prototype.indexOf){Array.prototype.indexOf=function(c){if(this==null){throw new TypeError()}var d=Object(this);var a=d.length>>>0;if(a===0){return -1}var e=0;if(arguments.length>0){e=Number(arguments[1]);if(e!=e){e=0}else{if(e!=0&&e!=Infinity&&e!=-Infinity){e=(e>0||-1)*Math.floor(Math.abs(e))}}}if(e>=a){return -1}var b=e>=0?e:Math.max(a-Math.abs(e),0);for(;b<a;b++){if(b in d&&d[b]===c){return b}}return -1}}(function(b){var a=function(f,c,h){var j=/^([a-zA-Z]+)(\.[a-zA-Z]*)*$/,g,e,d;if(f.match(j)===null||f==="window"){throw new Error("namespace: "+f+" is a malformed namespace string")}if(c!==undefined&&h===undefined){if(typeof(c)==="function"){h=c;c=undefined}else{if(typeof(c)==="object"){throw new Error("namespace: if second argument exists, final function argument must exist")}else{if(typeof(c)!=="object"){throw new Error("namespace: second argument must be an object of aliased local namespaces")}}}}else{if(typeof(c)!=="object"&&typeof(h)==="function"){throw new Error("namespace: second argument must be an object of aliased local namespaces")}}g=f.split(".");if(g[0]==="window"){e=window}else{e=(window[g[0]]===undefined)?window[g[0]]={}:window[g[0]]}if(h!==undefined&&typeof(h)!=="function"){throw new Error("namespace: last parameter must be a function that accepts a namespace parameter")}for(d=1;d<g.length;d=d+1){if(e[g[d]]===undefined){e[g[d]]={}}e=e[g[d]]}if(c===undefined&&h){h(e)}else{if(h){for(d in c){if(c.hasOwnProperty(d)){c[d]=a(c[d])}}h.call(c,e)}}return e};return a(b,function(c){c.namespace=a})}("window.jermaine.util"));window.jermaine.util.namespace("window.jermaine.util",function(a){var b=function(){var d=this,c={};this.on=function(e,f){if(typeof(e)!=="string"){throw new Error("EventEmitter: first argument to 'on' should be a string")}if(typeof(f)!=="function"){throw new Error("EventEmitter: second argument to 'on' should be a function")}if(!c[e]){c[e]=[]}c[e].push(f);return d};this.addListener=this.on;this.once=function(e,h){var g=function(){h(arguments);d.removeListener(e,g)};d.on(e,g);return d};this.removeListener=function(f,g){var e;if(typeof(f)!=="string"){throw new Error("EventEmitter: first parameter to removeListener method must be a string representing an event")}if(typeof(g)!=="function"){throw new Error("EventEmitter: second parameter must be a function to remove as an event listener")}if(c[f]===undefined||c[f].length===0){throw new Error("EventEmitter: there are no listeners registered for the '"+f+"' event")}e=c[f].indexOf(g);if(e!==-1){c[f].splice(e,1)}return d};this.removeAllListeners=function(e){if(typeof(e)!=="string"){throw new Error("EventEmitter: parameter to removeAllListeners should be a string representing an event")}if(c[e]!==undefined){c[e]=[]}return d};this.setMaxListeners=function(e){return d};this.listeners=function(e){if(typeof(e)!=="string"){throw new Error("EventEmitter: listeners method must be called with the name of an event")}else{if(c[e]===undefined){return[]}}return c[e]};this.emit=function(f,g){var e,h;if(arguments.length>1){h=[]}for(e=1;e<arguments.length;++e){h.push(arguments[e])}if(c[f]!==undefined){for(e=0;e<c[f].length;e=e+1){c[f][e].apply(this,h)}}};return d};a.EventEmitter=b});window.jermaine.util.namespace("window.jermaine",function(c){var d=this,b,a={};b=function(e){var f=function(h){var g,j={},i;g=e.call(j,h);if(!g){i=j.message||"validator failed with parameter "+h;throw new Error(i)}return g};return f};b.addValidator=function(f,e){if(f===undefined||typeof(f)!=="string"){throw new Error("addValidator requires a name to be specified as the first parameter")}if(e===undefined||typeof(e)!=="function"){throw new Error("addValidator requires a function as the second parameter")}if(a[f]===undefined){a[f]=function(g){return new b(function(j){var i={actual:j,param:j},h=e.call(i,g);this.message=i.message;return h})}}else{throw new Error("Validator '"+f+"' already defined")}};b.getValidator=function(f){var e;if(f===undefined){throw new Error("Validator: getValidator method requires a string parameter")}else{if(typeof(f)!=="string"){throw new Error("Validator: parameter to getValidator method must be a string")}}e=a[f];if(e===undefined){throw new Error("Validator: '"+f+"' does not exist")}return e};b.validators=function(){var f,e=[];for(f in a){if(a.hasOwnProperty(f)){e.push(f)}}return e};b.addValidator("isGreaterThan",function(e){this.message=this.param+" should be greater than "+e;return this.param>e});b.addValidator("isLessThan",function(e){this.message=this.param+" should be less than "+e;return this.param<e});b.addValidator("isA",function(f){var e=["string","number","boolean","function","object"];if(typeof(f)==="string"&&e.indexOf(f)>-1){this.message=this.param+" should be a "+f;return typeof(this.param)===f}else{if(f==="integer"){if(this.param.toString!==undefined){this.message=this.param.toString()+" should be an integer"}else{this.message="parameter should be an integer"}return(typeof(this.param)==="number")&&(parseInt(this.param,10)===this.param)}else{if(typeof(f)==="string"){throw new Error("Validator: isA accepts a string which is one of "+e)}else{throw new Error("Validator: isA only accepts a string for a primitive types for the time being")}}}});a.isAn=a.isA;b.addValidator("isOneOf",function(e){this.message=this.param+" should be one of the set: "+e;return e.indexOf(this.param)>-1});c.Validator=b});
/*!
 *
 * Notes and ToDos:
 * + what about isNotGreaterThan()?, isNotLessThan()?  Or, better still: a
 *   general 'not' operator, as in jasmine?
 *
 * + Attr should be decoupled from AttrList, see the clone() method
 *
 * + See issue 24 on github
 */
window.jermaine.util.namespace("window.jermaine",function(a){var b=function(f){var h=[],l=this,m="invalid setter call for "+f,j,k,e,c,o=false,d,n={},p=window.jermaine.AttrList,g=window.jermaine.Validator;if(f===undefined||typeof(f)!=="string"){throw new Error("Attr: constructor requires a name parameter which must be a string")}d=function(i){for(k=0;k<h.length;++k){h[k](i)}return true};this.validatesWith=function(i){if(typeof(i)==="function"){h.push(new g(i));return this}else{throw new Error("Attr: validator must be a function")}};this.defaultsTo=function(i){j=i;return this};this.isReadOnly=function(){o=true;return this};this.isWritable=function(){o=false;return this};this.on=function(i,q){if(i!=="set"&&i!=="get"){throw new Error("Attr: first argument to the 'on' method should be 'set' or 'get'")}else{if(typeof(q)!=="function"){throw new Error("Attr: second argument to the 'on' method should be a function")}else{n[i]=q}}};this.name=function(){return f};this.validator=function(){return d};this.and=this;this.which=this;this.isImmutable=this.isReadOnly;this.isMutable=this.isWritable;this.clone=function(){var q,r;q=this instanceof p?new p(f):new b(f);for(r=0;r<h.length;++r){q.validatesWith(h[r])}q.defaultsTo(j);if(o){q.isImmutable()}return q};this.addTo=function(s){var q,r,i;if(!s||typeof(s)!=="object"){throw new Error("Attr: addAttr method requires an object parameter")}s[f]=function(u){var t;if(u!==undefined){if(o&&q!==undefined){throw new Error("cannot set the immutable property "+f+" after it has been set")}else{if(!d(u)){throw new Error(m)}else{t=q;q=u;if(n.set!==undefined){n.set.call(s,u,t)}}}return s}else{if(n.get!==undefined){n.get.call(s,q)}return q}};i=typeof(j)==="function"?j():j;if(i!==undefined&&d(i)){s[f](i)}else{if(i!==undefined&&!d(i)){throw new Error("Attr: Default value of "+i+" does not pass validation for "+f)}}};c=function(i){l[i]=function(q){h.push(g.getValidator(i)(q));return l}};for(k=0;k<g.validators().length;++k){c(g.validators()[k])}};a.Attr=b});window.jermaine.util.namespace("window.jermaine",function(a){function b(c){var f=this,e={};a.Attr.call(this,c);var d=function(h,g){return function(){return h[g].apply(h,arguments)}};this.validateWith=this.validatesWith;this.defaultsTo=function(){};this.isImmutable=function(){};this.isMutable=function(){};this.eachOfWhich=this;this.on=function(g,h){if(g!=="add"){throw new Error("AttrList: 'on' only responds to 'add' event")}if(typeof(h)!=="function"){throw new Error("AttrList: 'on' requires a listener function as the second parameter")}e[g]=h};this.addTo=function(i){var j,g=[],h={};if(!i||typeof(i)!=="object"){throw new Error("AttrList: addTo method requires an object parameter")}else{h.pop=d(g,"pop");h.add=function(k){if((f.validator())(k)){g.push(k);if(e.add!==undefined){e.add.call(i,k,h.size())}return this}else{throw new Error(f.errorMessage())}};h.replace=function(k,l){if((typeof(k)!=="number")||(parseInt(k,10)!==k)){throw new Error("AttrList: replace method requires index parameter to be an integer")}if(k<0||k>=this.size()){throw new Error("AttrList: replace method index parameter out of bounds")}if(!(f.validator())(l)){throw new Error(f.errorMessage())}g[k]=l;return this};h.at=function(k){if(k<0||k>=this.size()){throw new Error("AttrList: Index out of bounds")}return g[k]};h.get=h.at;h.size=function(){return g.length};h.toJSON=function(m){var k=[],n,l;if(m!==undefined){for(n=0;n<m.length;++n){if(m[n].object===this){k=m[n].JSONrep}}}for(n=0;n<g.length;++n){if(g[n].toJSON){k.push(g[n].toJSON(m))}else{k.push(g[n])}}return k};i[c]=function(){return h}}}}b.prototype=new window.jermaine.Attr(name);a.AttrList=b});window.jermaine.util.namespace("window.jermaine",function(a){var b=function(c,d){if(!c||typeof(c)!=="string"){throw new Error("Method: constructor requires a name parameter which must be a string")}else{if(!d||typeof(d)!=="function"){throw new Error("Method: second parameter must be a function")}}this.addTo=function(e){if(!e||typeof(e)!=="object"){throw new Error("Method: addTo method requires an object parameter")}e[c]=d}};a.Method=b});window.jermaine.util.namespace("window.jermaine",function(a){var b=function(u){var q={},i={},p,f=true,d=[],n=[],r=[],c=a.Method,s=a.Attr,l=a.AttrList,h=a.util.EventEmitter,g,v,k,j,t=function(){},o=function(){},e=function(){if(f){e.validate();k()}return o.apply(this,arguments)};if(arguments.length>1){u=arguments[arguments.length-1]}if(u&&typeof(u)==="function"){e=new b();u.call(e);return e}else{if(u){throw new Error("Model: specification parameter must be a function")}}var m=function(y,x){var A,w,z;A=y==="Attr"?s:l;w=y==="Attr"?"hasA":"hasMany";f=true;if(typeof(x)==="string"){z=new A(x);i[x]=z;return z}else{throw new Error("Model: "+w+" parameter must be a string")}};g=function(y,x){var w;if(typeof(x)!=="string"){throw new Error("Model: expected string argument to "+y+" method, but recieved "+x)}w=y==="attribute"?i[x]:q[x];if(w===undefined){throw new Error("Model: "+y+" "+x+" does not exist!")}return w};v=function(y){var x,z=[],w=y==="attributes"?i:q;for(x in w){if(w.hasOwnProperty(x)){z.push(x)}}return z};k=function(){o=function(){var C,B,z,x,y=e.attributes(),A=e.methods(),w=new h(),F,G={},E,H,D=this;if(!(this instanceof e)){if(arguments.length>0){return new e(arguments)}else{return new e()}}this.emitter=function(){return w};this.emitter().removeJermaineChangeListener=function(I,J){if(typeof(I)!=="string"){throw new Error("attrName must be a string")}else{if(typeof(J)!=="object"||J.toJSON===undefined||J.emitter===undefined){throw new Error("obj must be a jermaine object")}else{J.emitter().removeListener("change",G[I])}}};this.emitter().addJermaineChangeListener=function(I,J){if(typeof(I)!=="string"){throw new Error("attrName must be a string")}else{if(typeof(J)!=="object"||J.toJSON===undefined||J.emitter===undefined){throw new Error("obj must be a jermaine object")}else{if(G[I]===undefined){G[I]=function(M){var L=[],K=true;for(C=0;C<M.length&&K===true;++C){L.push(M[C]);if(M[C].origin===D){K=false}}if(K){L.push({key:I,origin:D});D.emit("change",L)}}}J.emitter().on("change",G[I])}}};this.on=this.emitter().on;this.emit=this.emitter().emit;this.toJSON=function(J){var M,K,I,L={},N;if(J===undefined){J=[];J.push({object:this,JSONrep:L})}else{if(typeof(J)!=="object"){throw new Error("Instance: toJSON should not take a parameter (unless called recursively)")}else{for(K=0;K<J.length;++K){if(J[K].object===this){L=J[K].JSONrep}}}}for(K=0;K<y.length;++K){N=null;M=this[y[K]]();for(I=0;I<J.length;++I){if(J[I].object===M){N=J[I].JSONrep}}if(M!==undefined&&M!==null&&M.toJSON!==undefined&&N===null){N=(i[y[K]] instanceof l)?[]:{};J.push({object:M,JSONrep:N});J[J.length-1].JSONrep=M.toJSON(J)}if(N===null){L[y[K]]=M}else{L[y[K]]=N}}return L};this.toString=(p!==undefined)?p:function(){return"Jermaine Model Instance"};E=function(I){if(!(I instanceof l)){I.on("set",function(K,J){if(J!==undefined&&J!==null&&J.on!==undefined&&J.toJSON!==undefined&&J.emitter!==undefined){if(J.emitter().listeners("change").length<1){throw new Error("preValue should always have a listener defined if it is a model")}this.emitter().removeJermaineChangeListener(I.name(),J)}if(K!==undefined&&K!==null&&K.on!==undefined&&K.toJSON!==undefined&&K.emitter!==undefined){this.emitter().addJermaineChangeListener(I.name(),K)}this.emit("change",[{key:I.name(),value:K,origin:this}])})}else{I.on("add",function(K,J){this.emit("change",[{action:"add",key:I.name(),value:K,origin:this}])})}};for(C=0;C<y.length;++C){F=e.attribute(y[C]);E.call(this,F)}for(C=0;C<y.length+A.length;++C){if(C<y.length){if(j){e.attribute(y[C]).isImmutable()}e.attribute(y[C]).addTo(this)}else{e.method(A[C-y.length]).addTo(this)}}if(arguments.length>0){if(arguments.length<d.length){z="Constructor requires ";for(C=0;C<d.length;++C){z+=d[C];z+=C===d.length-1?"":", "}z+=" to be specified";throw new Error(z)}if(arguments.length>d.length+n.length){throw new Error("Too many arguments to constructor. Expected "+d.length+" required arguments and "+n.length+" optional arguments")}else{for(C=0;C<arguments.length;++C){x=C<d.length?d[C]:n[C-d.length];if(e.attribute(x) instanceof l){if(Object.prototype.toString.call(arguments[C])!=="[object Array]"){throw new Error("Model: Constructor requires 'names' attribute to be set with an Array")}else{for(B=0;B<arguments[C].length;++B){this[x]().add(arguments[C][B])}}}else{this[x](arguments[C])}}}}t.call(this)}};e.hasA=function(w){return m("Attr",w)};e.hasAn=e.hasA;e.hasSome=e.hasA;e.hasMany=function(w){return m("AttrList",w)};e.isA=function(y){var x,w,A,z;f=true;z=function(C){var B,D=new b();for(B in D){if(D.hasOwnProperty(B)&&typeof(C[B])!==typeof(D[B])){return false}}return true};if(typeof(y)!=="function"||!z(y)){throw new Error("Model: parameter sent to isA function must be a Model")}if(r.length===0){r.push(y)}else{throw new Error("Model: Model only supports single inheritance at this time")}w=r[0].attributes();for(x=0;x<w.length;++x){if(i[w[x]]===undefined){i[w[x]]=r[0].attribute(w[x]).clone();i[w[x]].isMutable()}}A=r[0].methods();for(x=0;x<A.length;++x){if(q[A[x]]===undefined){q[A[x]]=r[0].method(A[x])}}for(x=0;x<r.length;x++){e.prototype=new r[x]()}};e.isAn=e.isA;e.parent=function(){return r[0].apply(this,arguments)};e.attribute=function(w){return g("attribute",w)};e.attributes=function(){return v("attributes")};e.method=function(w){return g("method",w)};e.methods=function(){return v("methods")};e.isBuiltWith=function(){var w=false,x;f=true;d=[];n=[];for(x=0;x<arguments.length;++x){if(typeof(arguments[x])==="string"&&arguments[x].charAt(0)!=="%"){if(w){throw new Error("Model: isBuiltWith requires parameters preceded with a % to be the final parameters before the optional function")}else{d.push(arguments[x])}}else{if(typeof(arguments[x])==="string"&&arguments[x].charAt(0)==="%"){w=true;n.push(arguments[x].slice(1))}else{if(typeof(arguments[x])==="function"&&x===arguments.length-1){t=arguments[x]}else{throw new Error("Model: isBuiltWith parameters must be strings except for a function as the optional final parameter")}}}}};e.isImmutable=function(){j=true};e.looksLike=function(w){f=true;p=w};e.respondsTo=function(x,y){var w=new c(x,y);f=true;q[x]=w};e.validate=function(){var y,x=this.attributes(),w=this.methods();for(y=0;y<d.length;++y){try{this.attribute(d[y])}catch(z){throw new Error(d[y]+", specified in the isBuiltWith method, is not an attribute")}}for(y=0;y<n.length;++y){try{this.attribute(n[y])}catch(z){throw new Error(n[y]+", specified in the isBuiltWith method, is not an attribute")}}for(y=0;y<x.length;y++){if(w.indexOf(x[y])>-1){throw new Error("Model: invalid model specification to "+x[y]+" being both an attribute and method")}}if(j){for(y=0;y<x.length;y++){if(d.indexOf(x[y])<0){throw new Error("immutable objects must have all attributes required in a call to isBuiltWith")}}}f=false};return e};a.Model=b});