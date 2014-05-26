Jermaine is a JavaScript data modeling tool. Drawing inspiration from 
Jasmine, Mongoose, and ActiveRecord, it's designed to help create robust and
readable JavaScript data models.

Thanks to the folks at NEMAC (nemac.unca.edu) for allowing me to release
this really early version under an MIT license.

It's still under heavy development, but feedback or contributions are
welcome.

Models are created like this:

    var Person = new Model();

Then you can add properties and methods to the model like this:

    Person.hasA("firstName");
    Person.hasA("lastName");
    Person.hasAn("id");

    Person.hasMany("friends").which.validateWith(function (friend) {
        return friend instanceof Person;
    });

    Person.attribute("id").validatesWith(function (id) { 
        return typeof(id) === "Number";
    });

    Person.respondsTo("isFriendsWith", function (friend) {
        this.friends().add(friend);
    });


If you're comfortable with anonymous functions, you can send a specification
function to the constructor:

    var Person = new Model(function () {
        //'this' is pointing to the model
        this.hasA("firstName");
        this.hasA("lastName");
        this.hasAn("id");
        this.hasMany("friends");

        this.attribute("friends").validatesWith(function (friend) {
            return friend instanceof Person;
        });

        this.respondsTo("isFriendsWith", function (friend) {
            //in a method specification, 'this' points to
            //the calling object, NOT the model
            this.friends().add(friend);
            friend.friends().add(this);
        });
    });



Finally, you can create a person by calling the model as a constructor:

    var p = new Person(),
        s = new Person(),
        j = new Perons();

And manipulate the objects:

    p.firstName("Mark").lastName("Phillips");
    s.firstName("Semmy").lastName("Purewal");
    j.firstName("John").lastName("Frimmel");

    p.isFriendsWith(s);
    s.isFriendsWith(j);
    j.isFriendsWith(p);

If you later change the model, all new objects will be created with the updated
model spec, but old objects will not enjoy the new features:

    Person.hasAn("id");

    var a = new Person();
    a.firstName("John").lastName("Maxwell").id(500);  //fine

    p.id(501); //throws an error


Some basic validation is built in as well, so you can define more robust models:

    var Card,
        Deck,
        suits = ["clubs", "diamonds", "hearts", "spades"],
        ranks = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
        
    Card = new Model(function () {
        this.isImmutable();
        this.hasA("suit").which.isOneOf(suits);
        this.hasA("rank").which.isOneOf(ranks);

        this.isBuiltWith("rank","suit");
    });

    Deck = new Model(function () {
        this.hasMany("cards").which.validateWith(function (card) {
            return card instanceof Card;
        });

        this.isBuiltWith(function () {
            for (suit = 0; suit < suits.length; suit++) {
                for (rank = 0; rank < ranks.length; rank++) {
                    this.cards().add(new Card(ranks[rank], suits[suit]));
                }
            }
        });
    });

Right now, you can do the following with a Model object:

##attribute related

* hasA -- creates an encapsulated attribute
* hasAn -- syntactic sugar for hasA
* hasMany -- creates an encapsulated list of encapsulated attributes
* attributes -- returns an array of attribute names as strings
* attribute -- returns the specified Attr or AttrList object
* parent -- returns the constructor of the parent, if one exists

## method related

* respondsTo -- creates a method
* methods -- returns an array of method names as string
* method -- returns the specified Method object

## constructor related

* isBuiltWith -- accepts a series of strings that should be attributes, those prepended with '%' are optional in the constructor
            -- also accepts an initializer as the final argument

## modifier

* isImmutable -- makes the object immutable and forces all attributes to be required in an isBuiltWith call

## inheritance

* isA -- inherits from the specified model
* isAn -- syntactic sugar for isA

Attr and AttrList objects respond to the following methods:

* validatesWith -- accepts a function that returns true if the parameter is valid for the attribute
* defaultsTo -- accepts a default value for the attribute (not currently available for AttrList)
* isImmutable -- makes it so the attribute cannot be changed once it is set
* addTo -- accepts an object to attach this attribute to
* and -- syntactic sugar, a pointer to the Attr object
* which -- syntactic sugar, a pointer to the Attr object
* eachOfWhich -- syntactic sugar, a pointer to the Attr object

Attr and AttrList objects also have the following built-in validators

* isGreaterThan
* isLessThan
* isA
* isOneOf

You can set up your own validators by using the validatesWith or validateWith methods.
Here, you set the error message with 'this.message'

    this.hasA("twoLetterWord").which.isA("string").and.validatesWith(function (word) {
        this.message = word + "is not a two-letter string!"
        return word.length() === 2;
    });

You can also add custom reusable validators to Attr objects. In addition to getting
this.message, you also can use this.param to access the setter's actual parameter.

    Attr.addValidator("isNoLongerThan", function (val) {
        this.message = this.param + " should be less than " + val;
        return this.param.length() <= val;
    });

AttrList also aliases 'validateWith' for 'validatesWith' to maintain grammatical consistency

We hope to add the following self-explanatory functionality to Attr and AttrList:

* isNotNull
* isNotUndefined
