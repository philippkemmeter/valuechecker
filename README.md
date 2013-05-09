# Simple example

    var philfw = require('philfw'),
        VC = philfw.ValueChecker; // shortening :-)

    /**
     * This method demonstrates the ValueChecker interface.
     *
     * @param {String} a_string  A string with length between 10 and 12.
     * @param {Integer} an_int   Just an int.
     * @param {CoolObj} cool_obj An object of type CoolObj.
     */
    function noop(a_string, an_int, cool_obj) {
        a_string = VC.string(a_string, "a_string", null, 12, 10);
        an_int = VC.int(an_int, "an_int");
        cool_obj = VC.instance_of(cool_obj, "cool_obj", CoolObj);
    };


The ValueChecker methods checks the given value for the type and additional
criteria you want to check. If it does not match, an exception is thrown telling
exactly what has happend (e.g. type mismatch or string is too short etc). If it
does match, the value to check is returned `casted to the type you wanted`.
Therefore if you pass for instance the string `"2"` to `VC.int`, then it will 
pass the test an the int value `2` will be returend. Because "2" is lossless
convertable to an int.
