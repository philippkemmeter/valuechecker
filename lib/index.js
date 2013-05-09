/**
 * This is a pure static class grouping value checking functions.
 *
 * Whenever a check fails, an Error will be thrown.
 * The idea of this class is having live catchable  assertions for primary type
 * and range checks.
 *
 * The methods "string", "int" and "float"  are very loose, so you can pass any
 * scalar to "string" and  also "int" values to  "float" checks - they will not
 * throw but return the passed value casted to String, int, float respectively.
 *
 * @author Philipp Kemmeter <phil.kemmeter@gmail.com>
 * @module lib/ValueChecker
 */

/**
 * Checks, if the given value may be casted to a string.
 *
 * Using  the defined  arguments,  the expected  String may  be described  more
 * precisely.
 *
 * @param {mixed} value                   The value to check
 * @param {String} varname                Name of the variable (for output).
 * @param {Boolean} [empty_allowed=false] If an empty string is allowed.
 * @param {Integer} [min]                 Min amount of characters.
 * @param {Integer} [max]                 Max amount of characters.
 * @param {String} [char_blacklist]       String   containing   all  disallowed
 *                                        chars.
 * @param {String} [char_whitelist]       String must not contain any other but
 *                                        some of those charaters.
 * @throws {Error}                        If the check fails.
 * @returns {String}                      The value casted to String.
 */
exports.string = function(value, varname, empty_allowed, min, max,
    char_blacklist, char_whitelist)
{
    if (typeof(value) != 'string' && typeof(value) != 'number') {
        throw new Error(
            varname + ' is not scalar; type is "' + typeof(value) + '"'
        );
    }

    var v_string = String(value);

    if (!empty_allowed && (v_string.length == 0)) {
        throw new Error(
            varname + ' must not be empty; "' + value + '" given'
        );
    }

    if (char_blacklist && char_blacklist.length
        && char_blacklist.length > 0)
    {
        for (var i = 0; i < char_blacklist.length; ++i) {
            if (v_string.indexOf(char_blacklist.charAt(i)) != -1) {
                throw new Error(
                    varname + ' must not contain ' +
                        char_blacklist.charAt(i) + '; "'
                        + value + '" given - backlist: ' + char_blacklist
                );
            }
        }
    }

    if (char_whitelist && char_whitelist.length
        && char_whitelist.length > 0)
    {
        for (var i = 0; i < v_string.length; ++i) {
            if (char_whitelist.indexOf(v_string.charAt(i)) == -1) {
                throw new Error(
                    varname + ' must not contain any character but one of "'
                        + char_whitelist + '"; "' + value + '" given'
                );
            }
        }
    }

    if ((typeof(min) != 'undefined') && min != null && (value.length < min)) {
        throw new Error(
            varname + ' must be at least ' + min + ' characters long; ' +
                '"' + value + '" given'
        );
    }
    if ((typeof(max) != 'undefined') && max != null && (value.length > max)) {
        throw new Error(
            varname + ' must be at most ' + max + ' characters long; ' +
                '"' + value + '" given'
        );
    }

    if ((typeof(min) != 'undefined') && min != null
        && (typeof(max) != 'undefined') && max != null
        && (min > max))
    {
        throw new Error(
            'max mustn\'t be lower than min: (' + min + ', ' + max + ')'
        );
    }

    return v_string;
};

/**
 * Checks, if the given value is a float value or if it's possible to cast it
 * to a float without loosing its value.
 *
 * Therefore integer are allowed as well as float representing strings.
 *
 * @param {mixed} value    The value to check
 * @param {String} varname Name of the variable (for output).
 * @param {Integer} [min]  Minimum of the value, if set.
 * @param {Integer} [max]  Maximum of the value, if set.
 * @throws {Error}         If the check fails.
 * @returns {Number}       The value casted to float.
 */
exports.float = function(value, varname, min, max) {
    var is_float = function(v) {
        return !isNaN(v) && isFinite(v) &&
            (typeof(v) == 'number' || v.replace(/^\s+|\s+$/g, '').length > 0);
    }
    if (typeof(min) == 'undefined' || min == null) {
        if (typeof(max) == 'undefined' || max == null) {
            if (!is_float(value)) {
                throw new Error(
                    varname + '=="' + value + '" ∉ ℝ'
                );
            }
        }
        else if (max == 0) {
            if (!is_float(value) || (value > max)) {
                throw new Error(
                    varname + '=="' + value + '" ∉ ℝ₀⁻'
                );
            }
        }
        else if (max == 1) {
            if (!is_float(value) || (value > max)) {
                throw new Error(
                    varname + '=="' + value + "' ∉ ℝ⁻\{0}"
                );
            }
        }
        else {
            if (!is_float(value) || (value > max)) {
                throw new Error(
                    varname + '=="' + value + '" ∉ ]-∞; ' + max + ']'
                );
            }
        }
    }
    else {
        if (typeof(max) == 'undefined' || max == null) {
            if (min == 0) {
                if (!is_float(value) || (value < min)) {
                    throw new Error(
                        varname + '=="' + value + '" ∉ ℝ₀⁺'
                    );
                }
            }
            else if (min == 1) {
                if (!is_float(value) || (value < min)) {
                    throw new Error(
                        varname + '=="' + value + '" ∉ ℝ⁺\{0}'
                    );
                }
            }
            else {
                if (!is_float(value) || (value < min)) {
                    throw new Error(
                        varname + '=="' + value + '" ∉ [' + min + '; ∞]'
                    );
                }
            }
        }
        else {
            if (min > max) {
                throw new Error(
                    'max has to be greater than min'
                );;
            }
            if (!is_float(value) || (value < min) || (value > max)) {
                throw new Error(
                    varname + '=="' + value + '" ∉ [' + min + '; ' + max + ']'
                );
            }
        }
    }

    return parseFloat(value);
};

/**
 * Shortcut for an int check >= 0 or > 0..
 *
 * @param {mixed} value                  The value to check
 * @param {String} varname               Name of the variable (for output).
 * @param {Boolean} [zero_allowed=false] If 0 is valid.
 * @throws {Error}                       If the check fails.
 * @returns {Number}                     The value casted to integer.
 */
exports.id = function(value, varname, zero_allowed) {
    if (zero_allowed)
        return exports.int(value, varname, 0);
    else
        return exports.int(value, varname, 1);
};

/**
 * Checks for a valid unix timestamp.
 *
 * @param {mixed} value    The value to check
 * @param {String} varname Name of the variable (for output).
 * @throws {Error}         If the check fails.
 * @returns {Number}       The value casted to integer.
 */
exports.t_stamp = function(value, varname) {
    return exports.int(value, varname, 0);
};

/**
 * Checks, if the given value is lossfree castable to integer.
 *
 * More precisely, int values are accepted as well as floats of shape X.0 (e.g.
 * 1.0 or 10028123.0)  as well as strings  containing integers or  the accepted
 * floats.
 *
 * @param {mixed} value    The value to check
 * @param {String} varname Name of the variable (for output).
 * @param {Integer} [min]  Minimum of the value, if set.
 * @param {Integer} [max]  Maximum of the value, if set.
 * @throws {Error}         If the check fails.
 * @returns {Number}       The value casted to float.
 */
exports.int = function(value, varname, min, max) {
    var is_int = function(v) {
        return v == parseInt(v);
    };
    if (typeof(min) == 'undefined' || min == null) {
        if (typeof(max) == 'undefined' || max == null) {
            if (!is_int(value)) {
                throw new Error(
                    varname + '=="' + value + '" ∉ ℤ'
                );
            }
        }
        else if (!is_int(value) || (value > max)) {
            throw new Error(
                varname + '=="' + value
                    + '" ∉ {-∞, ..., ' + (max-1) + ',' + max + '}'
            );
        }
    }
    else {
        if (typeof(max) == 'undefined' || max == null) {
            if (min == 0) {
                if (!is_int(value) || (value < min)) {
                    throw new Error(
                        varname + '=="' + value + '" ∉ ℕ₀'
                    );
                }
            }
            else if (min == 1) {
                if (!is_int(value) || (value < min)) {
                    throw new Error(
                        varname + '=="' + value + '" ∉ ℕ₁'
                    );
                }
            }
            else {
                if (!is_int(value) || (value < min)) {
                    throw new Error(
                        varname + '=="' + value + '" ∉ [' + min + '; ∞]'
                    );
                }
            }
        }
        else {
            if (min > max) {
                throw new Error(
                    'max has to be greater than min'
                );;
            }
            if (!is_int(value) || (value < min) || (value > max)) {
                throw new Error(
                    varname + '=="' + value
                        + '" ∉ {' + min + ', ' + (min+1) + ', ...∞}'
                );
            }
        }
    }

    return parseInt(value);
};

/**
 * Checks, if the given value is in the passed values array.
 *
 * @param {mixed} value                The value to check
 * @param {String} varname             Name of the variable (for output).
 * @param {Array} values               Array of values to check against.
 * @throws {Error}                     If the check fails.
 * @returns {mixed}                    The value (uncasted).
 */
exports.values = function(value, varname, values) {
    if (values.indexOf(value) == -1) {
        throw new Error(
            varname + '=="' + value + '" ∉ {' + values.join('}, {') + '}'
        );
    }

    return value;
};

/**
 * Checks, if the given value is a bool.
 *
 * Accepts TRUE, FALSE and numeric 1 and 0 (so '1' and '0' is not accepted, but
 * 1.0 and 0.0 as well as 0x00 and 0x01 are accepted).
 *
 * @param {mixed} value    The value to check
 * @param {String} varname Name of the variable (for output).
 * @throws {Error}         If the check fails.
 * @returns {Boolean}      The value casted to Boolean.
 */
exports.bool = function(value, varname) {
    if ((value !== !!value) && (value !== 1) && (value !== 0))
        throw new Error(
            varname + ' should be boolean, ' + value + 'given'
        );

    return !!value;
};

/**
 * Checks, if the given value is an instance of the given object.
 *
 * @param {mixed} value    The value to check
 * @param {String} varname Name of the variable (for output).
 * @param {Object} object  The value should be an instance of this object..
 * @throws {Error}         If the check fails.
 * @returns {mixed}        The value (uncasted).
 */
exports.instance_of = function(value, varname, object) {
    if (!(value instanceof object)) {
        var constr = (typeof(value) == 'undefined')
            ? 'undefined'
            : value.constructor;
        throw new Error(
            varname + " has to be an instance of "
            + object + '; ' + constr + ' given'
        );
    }
    return value;
};

/**
 * Checks, if the given value matchen the given regexp.
 *
 * @param {String} value   The value to check.
 * @param {String} varname Name olf the variable (for output).
 * @param {RegExp} regexp  Regex object to test against.
 * @throws {Error}         If the check fails.
 * @returns {String}       The value casted to string.
 */
exports.regexp = function(value, varname, regexp) {
    exports.instance_of(regexp, 'regexp', RegExp);
    if (!regexp.test(value)) {
        throw new Error(
            varname + " has to match the pattern '" + regexp + '"; '
            + value + "' given"
        );
    }

    return String(value);
};

/**
 * Checks, if the given value is a valid email address.
 *
 * This accepts patterns as specified in RFC 2822.
 * So $#@domain.tld or !@123.423.23.21 are valid email addresses,  although they
 * might get blocked by some mail clients or servers.
 * IPv6 as host is not yes supported.
 *
 * @param {String} value   The value to check.
 * @param {String} varname Name olf the variable (for output).
 * @throws {Error}         If the check fails.
 * @returns {String}       The value casted to string.
 */
exports.email = function(value, varname) {
    try {
        return exports.regexp(
            value, varname,
            /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+\/=?`{|}~^-]+)*@((?:[A-Z0-9-]+.)+[A-Z]{2,6})|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/i
        );
    } catch (e) {
        throw new Error(
            varname + " has to be a valid email address; '"
            + value + "' given"
        );
    }
};
