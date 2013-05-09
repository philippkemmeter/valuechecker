/**
 * Checks the ValueChecker class.
 *
 * @author Philipp Kemmeter <phil.kemmeter@gmail.com>
 */

var should = require('should');
    ValueChecker = require('../../');

describe('ValueChecker', function() {

    //
    // Tests ValueChecker.string
    //
    describe('#string', function() {
        var t,k;

        it('should accept empty string, if empty is allowed', function() {
            ValueChecker.string('', 'x', true).should.equal('');
        });
        it('should throw on empty string, if empty is not allowed', function() {
            (function() {
                ValueChecker.string('', 'x')
            }).should.throw();
        });

        t = {
            '1':     1,
            '1.4':   1.4,
            'hallo': 'hallo',
            "\n":    "\n",
            "\t":    "\t",
            ' ':     ' '
        };
        for (k in t) {
            it(
                'should accept scalar types; cast to String ['+t[k]+','+k+']',
                (function(v, w) {
                    return function() {
                        ValueChecker.string(v, 'x').should.equal(w);
                        ValueChecker.string(v, 'x', true).should.equal(w);
                        ValueChecker.string(
                            v, 'x', true, 0, 10
                        ).should.equal(w);
                        ValueChecker.string(
                            v, 'x', true, 0, 10, '!'
                        ).should.equal(w);
                        ValueChecker.string(
                            v, 'x', true, 0, 10, null, "1.4hallo\n\t "
                        ).should.equal(w);
                    }
                })(t[k], k)
            );
        }

        t = [ [], {} ];
        for (k = 0; k < t.length; ++k) {
            it(
                'should throw for non scalar types ['+t[k]+']',
                (function(v) {
                    return function() {
                        (function() {
                            ValueChecker.string(v, 'x');
                        }).should.throw();
                        (function() {
                            ValueChecker.string(v, 'x', true);
                        }).should.throw();
                        (function() {
                            ValueChecker.string(v, 'x', true, 0, 10);
                        }).should.throw();
                        (function() {
                            ValueChecker.string(v, 'x', true, 0, 10, '!');
                        }).should.throw();
                        (function() {
                            ValueChecker.string(v, 'x', true, 0, 10, null, '.');
                        }).should.throw();
                    }
                })(t[k])
            );
        }

        t = [
            [null, null],
            [1,    4],
            [0,    5],
            [4,    4],
            [null, 4],
            [4,    null],
            [0,    null]
        ];
        for (k = 0; k < t.length; ++k) {
            it(
                'should accept several range checks ['+t[k]+']',
                (function(v) {
                    return function() {
                        var str = 'lala';
                        ValueChecker.string(str, 'x', false, v[0], v[1]);
                    }
                })(t[k])
            );
        }

        it('should throw, if max smaller than min', function() {
            (function() {
                ValueChecker.string('lala', 'x', false, 5, 0);
            }).should.throw();
        });

        t = [
            [null, 3],
            [5,    null]
            [5,    6],
            [2,    3]
        ];
        for (k = 0; k < t.length; ++k) {
            it(
                'should throw, if string length out of range ['+t[k]+']',
                (function(v) {
                    return function() {
                        var str = 'lala';
                        (function() {
                            ValueChecker.string(str, 'x', false, v[0], v[1]);
                        }).should.throw();
                    }
                })(t[k])
            );
        }

        t = [
            'qwertzuiopsdfghjkyxcvbnm,.1234567890ß*+~öäü'
        ];
        for (k = 0; k < t.length; ++k) {
            it(
                'should accept for correct blacklist ['+t[k]+']',
                (function(v) {
                    return function() {
                        var str = 'lala';
                        ValueChecker.string(str, 'x', null, null, null, v);
                    }
                })(t[k])
            );
        }

        t = [
            'l',
            'la',
            'a'
        ];
        for (k = 0; k < t.length; ++k) {
            it(
                'should throw on blacklist violation ['+t[k]+']',
                (function(v) {
                    return function() {
                        var str = 'lala';
                        (function() {
                            ValueChecker.string(
                                str, 'x', null, null, null, v
                            );
                        }).should.throw();
                    }
                })(t[k])
            );
        }

        t = [
            'la',
            'uzu38l9wu2786234uiha34j'
        ];
        for (k = 0; k < t.length; ++k) {
            it(
                'should accept for correct whitelist ['+t[k]+']',
                (function(v) {
                    return function() {
                        var str = 'lala';
                        ValueChecker.string(
                            str, 'x', null, null, null, null, v
                        );
                    }
                })(t[k])
            );
        }

        t = [
            'l',
            'uzusdl',
            'io'
        ];
        for (k = 0; k < t.length; ++k) {
            it(
                'should throw on whitelist violation ['+t[k]+']',
                (function(v) {
                    return function() {
                        var str = 'lala';
                        (function() {
                            ValueChecker.string(
                                str, 'x', null, null, null, null, v
                            );
                        }).should.throw();
                    }
                })(t[k])
            );
        }
    }),

    //
    // Tests ValueChecker.float
    //
    describe('#float', function() {
        var t,k;

        t = [
            0,
            1.2123,
            '0',
            '2123.4',
            -1,
            '-1',
            -123.423,
            '-123.432',
            07,
            0xad,
            '07',
            '0xad'
        ];
        for (k = 0; k < t.length; ++k) {
            it(
                'should accept floats and cast to float [value='+t[k]+']',
                (function(v) {
                    return function() {
                        ValueChecker.float(v, 'x').should.equal(parseFloat(v));
                        ValueChecker.float(v, 'x', null, 50000)
                            .should.equal(parseFloat(v));
                        ValueChecker.float(v, 'x', -50000, 50000)
                            .should.equal(parseFloat(v));
                        ValueChecker.float(v, 'x', -50000)
                            .should.equal(parseFloat(v));
                    }
                })(t[k])
            );
        }

        t = [
            'hallo',
            [],
            {},
            'jklsd0',
            '',
            "\t",
            "\n",
            ' '
        ];
        for (k = 0; k < t.length; ++k) {
            it(
                'should throw for non float values [value='+t[k]+']',
                (function(v) {
                    return function() {
                        (function() {
                            ValueChecker.float(v, 'x');
                        }).should.throw();
                    }
                })(t[k])
            );
        }

        t = [
            [5,    null, null],
            [5,    0,    5],
            [5,    5,    5],
            [5,    null, 5],
            [5,    5,    null],
            [5,    null, 5.1],
            [5,    4.9,  null],

            [5.01, null, null],
            [5.01, 0,    5.01],
            [5.01, 5.01, 5.01],
            [5.01, null, 5.01],
            [5.01, 5.01, null],
            [5.01, null, 5.1],
            [5.01, 4.9,  null],

            ['5',  null, null],
            ['5',  0,    5],
            ['5',  5,    5],
            ['5',  null, 5],
            ['5',  5,    null],
            ['5',  null, 5.1],
            ['5',  4.9,  null],
        ];
        for (k = 0; k < t.length; ++k) {
            it(
                'should pass range test ['+t[k]+']',
                (function(v) {
                    return function() {
                        ValueChecker.float(v[0], 'x', v[1], v[2]);
                    }
                })(t[k])
            );
        }

        t = [
            [5,    6,    null],
            [5,    5.1,  null],
            [5,    null, 4],
            [5,    null, 4.9],

            [5.01, 6,    null],
            [5.01, 5.1,  null],
            [5.01, null, 4],
            [5.01, null, 4.9],

            ['5',  6,    null],
            ['5',  5.1,  null],
            ['5',  null, 4],
            ['5',  null, 4.9]
        ];
        for (k = 0; k < t.length; ++k) {
            it(
                'should throw on range test ['+t[k]+']',
                (function(v) {
                    return function() {
                        (function() {
                            ValueChecker.float(v[0], 'x', v[1], v[2]);
                        }).should.throw();
                    }
                })(t[k])
            );
        }
    });

    //
    // Tests ValueChecker.id
    //
    describe('#id', function() {
        var t,k;

        t = {
            1:            1.0,
            828978781298: 828978781298,
            8:            '8'
        };
        for (k = 0; k < t.length; ++k) {
            it(
                'should accept int types > 0 and cast to int ['+t[k]+']',
                (function(v,w) {
                    return function() {
                        ValueChecker.id(v, 'x', true).should.equal(w);
                        ValueChecker.id(v, 'x', false).should.equal(w);
                        ValueChecker.id(v, 'x').should.equal(w);
                    }
                })(t[k],k)
            )
        }

        t = [
            -1,
            -89178781278323,
            'hallo',
            1.5,
            -1.94
        ];
        for (k = 0; k < t.length; ++k) {
            it(
                'should throw for int types < 0 or no int value ['+t[k]+']',
                (function(v) {
                    return function() {
                        (function() {
                            ValueChecker.id(v, 'x', true);
                        }).should.throw();
                        (function() {
                            ValueChecker.id(v, 'x', false);
                        }).should.throw();
                        (function() {
                            ValueChecker.id(v, 'x');
                        }).should.throw();
                    }
                })(t[k])
            );
        }

        t = [
            0,
            0.0,
            -0
        ];
        for (k = 0; k < t.length; ++k) {
            it(
                'should throw if 0 passed, but zero is not allowed ['+t[k]+']',
                (function(v) {
                    return function() {
                        (function() {
                            ValueChecker.id(v, 'x', false);
                        }).should.throw();

                        (function() {
                            ValueChecker.id(v, 'x');
                        }).should.throw();
                    }
                })(t[k])
            );
        }
    });

    //
    // Tests ValueChecker.t_stamp
    //
    describe('#t_stamp', function() {
        var t,k;

        t = {
            0:            0,
            1:            1.0,
            828978781298: 828978781298,
            8:            '8',
            9:            '9.0'
        };
        for (k in t) {
            it(
                'should accept int types >= 0 and cast to int ['+t[k]+']',
                (function(v,w) {
                    return function() {
                        ValueChecker.t_stamp(v, 'x', true).should.equal(w);
                        ValueChecker.t_stamp(v, 'x', false).should.equal(w);
                        ValueChecker.t_stamp(v, 'x').should.equal(w);
                    }
                })(t[k],Number(k))
            );
        }

        t = [
            -1,
            -89178781278323,
            'hallo',
            1.5,
            -1.94
        ];
        for (k = 0; k < t.length; ++k) {
            it(
                'should throw for int types < 0 or no int value ['+t[k]+']',
                (function(v) {
                    return function() {
                        (function() {
                            ValueChecker.t_stamp(v, 'x', true);
                        }).should.throw();
                        (function() {
                            ValueChecker.t_stamp(v, 'x', false);
                        }).should.throw();
                        (function() {
                            ValueChecker.t_stamp(v, 'x');
                        }).should.throw();
                    }
                })(t[k])
            );
        }
    });

    //
    // Tests ValueChecker.int
    //
    describe('#int', function() {
        var t,k;

        t = [
            0,
            '0',
            '0.0',
            0.0,
            07,
            0xad,
            '07',
            '0xad',
            -238.0,
            '-238.0',
            -238,
            '-238'
        ];
        for (k = 0; k < t.length; ++k) {
            it(
                'should accept ints and cast to int [value='+t[k]+']',
                (function(v,w) {
                    return function(){
                        ValueChecker.int(v, 'x').should.equal(w);
                        ValueChecker.int(v, 'x', null, 50000).should.equal(w);
                        ValueChecker.int(v, 'x', -50000, 50000)
                            .should.equal(w);
                        ValueChecker.int(v, 'x', -50000).should.equal(w);
                    }
                })(t[k], Number(t[k]))
            );
        }

        t = [
            'hallo',
            [],
            {},
            'jklsd0',
            '',
            "\t",
            "\n",
            ' ',
            2.3,
            '2.3',
            -2.3,
            '-2.3'
        ];
        for (k = 0; k < t.length; ++k) {
            it(
                'should throw for non int values [value='+t[k]+']',
                (function(v) {
                    return function() {
                        (function() {
                            ValueChecker.int(v, 'x');
                        }).should.throw();
                    }
                })(t[k])
            );
        }

        t = [
            [5,    null, null],
            [5,    0,    5],
            [5,    5,    5],
            [5,    null, 5],
            [5,    5,    null],
            [5,    null, 5.1],
            [5,    4.9,  null],

            ['5',  null, null],
            ['5',  0,    5],
            ['5',  5,    5],
            ['5',  null, 5],
            ['5',  5,    null],
            ['5',  null, 5.1],
            ['5',  4.9,  null],
        ];
        for (k = 0; k < t.length; ++k) {
            it(
                'should pass range test ['+t[k]+']',
                (function(v) {
                    return function() {
                        ValueChecker.int(v[0], 'x', v[1], v[2]);
                    }
                })(t[k])
            );
        }

        t = [
            [5,    6,    null],
            [5,    5.1,  null],
            [5,    null, 4],
            [5,    null, 4.9],

            ['5',  6,    null],
            ['5',  5.1,  null],
            ['5',  null, 4],
            ['5',  null, 4.9]
        ];
        for (k = 0; k < t.length; ++k) {
            it(
                'should throw on range test ['+t[k]+']',
                (function(v) {
                    return function() {
                        (function() {
                            ValueChecker.int(v[0], 'x', v[1], v[2]);
                        }).should.throw();
                    }
                })(t[k])
            );
        }
    });

    //
    // Tests ValueChecker.values
    //
    describe('#values', function() {
        var t,k;

        t = [
            ['5', [2, 5, 3]],
            [5,   [2, 5, 3]],
            [5.0, [2, 5, 3]],
            [5,   [2, '5', 3]],
            ['5', [2, '5', 3]],
            [5.0, [2, '5', 3]],
            [5,   [2, 5.0, 3]],
            ['5', [2, 5.0, 3]],
            [5.0, [2, 5.0, 3]],
            ['a', ['a', 12]],
            ['',  ['', 'as']]
        ];
        for (k = 0; k < t.length; ++k) {
            it(
                'should pass without type safeness ['+t[k]+']',
                (function(v) {
                    return function() {
                        ValueChecker.values(v[0], 'x', v, false)
                            .should.equal(v[0]);
                    }
                })(t[k])
            );
        }
    });

    //
    // Tests ValueChecker.bool
    //
    describe('#bool', function() {
        var t,k;

        t = [
            true,
            false,
            0,
            1,
            0x01,
            0x00,
            1.0,
            0.0
        ];
        for (k = 0; k < t.length; ++k) {
            it(
                'should accept value and cast to bool ['+t[k]+']',
                (function(v,w) {
                    return function() {
                        ValueChecker.bool(v, 'x').should.equal(w);
                    }
                })(t[k], Boolean(t[k]))
            );
        }

        t = [
            '1',
            '0',
            2,
            -1
        ];
        for (k = 0; k < t.length; ++k) {
            it(
                'should throw for non bools ['+t[k]+']',
                (function(v) {
                    return function() {
                        (function() {
                            ValueChecker.bool(v, 'x');
                        }).should.throw();
                    }
                })(t[k])
            );
        }
    });

    //
    // Tests ValueChecker.instance_of
    //
    describe('#instance_of', function() {
        var t, k, obj, inst, obj2;

        obj = function() {
            this.x = 'u';
        };

        inst = new obj();

        t = [
            [ [], Array ],
            [ {}, Object ],
            [ function(){}, Object ],
            [ function(){}, Function ],
            [ inst, obj ],
            [ inst, Object ]
        ];
        for (k = 0; k < t.length; ++k) {
            it(
                'should accept corrent instance checks ['+t[k]+']',
                (function(v) {
                    return function() {
                        ValueChecker.instance_of(v[0], 'x', v[1])
                            .should.equal(v[0])
                    }
                })(t[k])
            );
        }

        obj2 = function() {}

        t = [
            [ inst, obj2 ],
            [ inst, Array ],
            [ 1, Object ],
            [ 'sta', Object ],
            [undefined, Object ]
        ];
        for (k = 0; k < t.length; ++k) {
            it(
                'should throw on wrong instance checks ['+t[k]+']',
                (function(v) {
                    return function() {
                        (function() {
                            ValueChecker.instance_of(v[0], 'x', v[1]);
                        }).should.throw();
                    }
                })(t[k])
            );
        }
    });

    //
    // Tests ValueChecker.regexp
    //
    describe('#regexp', function() {
        var t,k;

        t = [
            [ 'a', /a/ ],
            [ 'aasdlasjl', /^a/ ]
        ];
        for (k = 0; k < t.length; ++k) {
            it(
                'should accept correct regex matches ['+t[k]+']',
                (function(v) {
                    return function() {
                        ValueChecker.regexp(v[0], 'x', v[1]).should.equal(v[0]);
                    }
                })(t[k])
            );
        }

        t = [
            [ 'a', /b/ ]
        ];
        for (k = 0; k < t.length; ++k) {
            it(
                'should throw on regexp not matching ['+t[k]+']',
                (function(v) {
                    return function() {
                        (function() {
                            ValueChecker.regexp(v[0], 'x', v[1]);
                        }).should.throw()
                    }
                })(t[k])
            );
        }
    });

    //
    // Tests ValueChecker.email
    //
    describe('#email', function() {
        var t,k;

        t = [
            'phil.kemmeter@gmail.com',
            'localhost@127.0.0.1'
        ];
        for (k = 0; k < t.length; ++k) {
            it(
                'should accept correct email addresses ['+t[k]+']',
                (function(v) {
                    return function() {
                        ValueChecker.email(v, 'x');
                    }
                })(t[k])
            );
        }
    });
});
