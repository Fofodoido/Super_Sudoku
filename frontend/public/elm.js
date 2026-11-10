(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.ar.aa === region.aE.aa)
	{
		return 'on line ' + region.ar.aa;
	}
	return 'on lines ' + region.ar.aa + ' through ' + region.aE.aa;
}



// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.bj,
		impl.bC,
		impl.bS,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		bE: func(record.bE),
		aA: record.aA,
		az: record.az
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.bE;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.aA;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.az) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.a_.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.a_.b, xhr)); });
		$elm$core$Maybe$isJust(request.x) && _Http_track(router, xhr, request.x.a);

		try {
			xhr.open(request.p, request.aG, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.aG));
		}

		_Http_configureRequest(xhr, request);

		request.aH.a && xhr.setRequestHeader('Content-Type', request.aH.a);
		xhr.send(request.aH.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.l; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.q.a || 0;
	xhr.responseType = request.a_.d;
	xhr.withCredentials = request.Z;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		aG: xhr.responseURL,
		bJ: xhr.status,
		bK: xhr.statusText,
		l: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return $elm$core$Dict$empty;
	}

	var headers = $elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}
	return headers;
}


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
			bm: event.loaded,
			ap: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			bF: event.loaded,
			ap: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
		}))));
	});
}



// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.bj,
		impl.bC,
		impl.bS,
		function(sendToApp, initialModel) {
			var view = impl.bo;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.bj,
		impl.bC,
		impl.bS,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.g && impl.g(sendToApp)
			var view = impl.bo;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.aH);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.bw) && (_VirtualDom_doc.title = title = doc.bw);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.bN;
	var onUrlRequest = impl.bP;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		g: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.ba === next.ba
							&& curr.aI === next.aI
							&& curr.aU.a === next.aU.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		bj: function(flags)
		{
			return A3(impl.bj, flags, _Browser_getUrl(), key);
		},
		bo: impl.bo,
		bC: impl.bC,
		bS: impl.bS
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { bz: 'hidden', bx: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { bz: 'mozHidden', bx: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { bz: 'msHidden', bx: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { bz: 'webkitHidden', bx: 'webkitvisibilitychange' }
		: { bz: 'hidden', bx: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		aX: _Browser_getScene(),
		bd: {
			aB: _Browser_window.pageXOffset,
			aC: _Browser_window.pageYOffset,
			aY: _Browser_doc.documentElement.clientWidth,
			a0: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		aY: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		a0: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			aX: {
				aY: node.scrollWidth,
				a0: node.scrollHeight
			},
			bd: {
				aB: node.scrollLeft,
				aC: node.scrollTop,
				aY: node.clientWidth,
				a0: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			aX: _Browser_getScene(),
			bd: {
				aB: x,
				aC: y,
				aY: _Browser_doc.documentElement.clientWidth,
				a0: _Browser_doc.documentElement.clientHeight
			},
			bD: {
				aB: x + rect.left,
				aC: y + rect.top,
				aY: rect.width,
				a0: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$True = 0;
var $elm$core$Basics$False = 1;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.e) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.f),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.f);
		} else {
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.h) : builder.h;
			var treeLen = builder.e * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.e);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.f) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.f);
		}
	});
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{f: tail, h: nodeList, e: (len / $elm$core$Array$branchFactor) | 0});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\u000A    ',
		A2($elm$core$String$split, '\u000A', str));
};
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\u000A\u000A(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\u0027' + (f + '\u0027]'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\u000A\u000A',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\u000A\u000A';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\u000A\u000A    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\u000A\u000A' + msg));
			}
		}
	});
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Api$Medio = 1;
var $author$project$Main$NoHint = {$: 0};
var $author$project$Main$Welcome = {$: 0};
var $author$project$Variant$Diagonal = 0;
var $author$project$Game$Survival = 1;
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $author$project$Main$emptyStats = {T: 0, U: $elm$core$Dict$empty, F: 0, O: 0, R: 0};
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$core$Result$withDefault = F2(
	function (def, result) {
		if (!result.$) {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$json$Json$Decode$keyValuePairs = _Json_decodeKeyValuePairs;
var $elm$json$Json$Decode$dict = function (decoder) {
	return A2(
		$elm$json$Json$Decode$map,
		$elm$core$Dict$fromList,
		$elm$json$Json$Decode$keyValuePairs(decoder));
};
var $elm$json$Json$Decode$map5 = _Json_map5;
var $author$project$Main$Stats = F5(
	function (played, won, best, streak, lastDaily) {
		return {T: won, U: best, F: played, O: streak, R: lastDaily};
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $author$project$Main$statsDecoder = A6(
	$elm$json$Json$Decode$map5,
	$author$project$Main$Stats,
	A2($elm$json$Json$Decode$field, 'played', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'won', $elm$json$Json$Decode$int),
	A2(
		$elm$json$Json$Decode$field,
		'best',
		$elm$json$Json$Decode$dict($elm$json$Json$Decode$int)),
	A2($elm$json$Json$Decode$field, 'streak', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'lastDaily', $elm$json$Json$Decode$int));
var $author$project$Main$init = function (flags) {
	return _Utils_Tuple2(
		{
			a: $author$project$Main$NoHint,
			ad: false,
			g: {
				C: 1,
				aW: _List_fromArray(
					[0]),
				aj: '',
				bI: 1
			},
			u: A2(
				$elm$core$Result$withDefault,
				$author$project$Main$emptyStats,
				A2($elm$json$Json$Decode$decodeValue, $author$project$Main$statsDecoder, flags.u)),
			W: flags.W,
			c: $author$project$Main$Welcome,
			H: false,
			ai: false,
			j: $elm$core$Maybe$Nothing,
			r: flags.r
		},
		$elm$core$Platform$Cmd$none);
};
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$main_ = _VirtualDom_node('main');
var $elm$html$Html$footer = _VirtualDom_node('footer');
var $elm$html$Html$header = _VirtualDom_node('header');
var $elm$html$Html$section = _VirtualDom_node('section');
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $elm$html$Html$li = _VirtualDom_node('li');
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $elm$html$Html$aside = _VirtualDom_node('aside');
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$html$Html$strong = _VirtualDom_node('strong');
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $elm$core$List$sortBy = _List_sortBy;
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$core$List$sort = function (xs) {
	return A2($elm$core$List$sortBy, $elm$core$Basics$identity, xs);
};
var $author$project$Game$modeId = function (mode) {
	switch (mode) {
		case 0:
			return 'relax';
		case 1:
			return 'survival';
		default:
			return 'timeattack';
	}
};
var $author$project$Variant$ruleId = function (rule) {
	switch (rule) {
		case 0:
			return 'diagonal';
		case 1:
			return 'hyper';
		case 2:
			return 'antiknight';
		case 3:
			return 'killer';
		case 4:
			return 'parity';
		case 5:
			return 'antiking';
		case 6:
			return 'disjoint';
		case 7:
			return 'nonconsecutive';
		case 8:
			return 'thermo';
		case 9:
			return 'arrow';
		case 10:
			return 'kropki';
		case 11:
			return 'xv';
		case 12:
			return 'whisper';
		case 13:
			return 'renban';
		case 14:
			return 'palindrome';
		default:
			return 'between';
	}
};
var $author$project$Main$recordKey = function (game) {
	return A2(
		$elm$core$String$join,
		'|',
		_List_fromArray(
			[
				A2(
				$elm$core$String$join,
				'+',
				$elm$core$List$sort(
					A2($elm$core$List$map, $author$project$Variant$ruleId, game.v.aW))),
				game.v.bI,
				$author$project$Game$modeId(game.C)
			]));
};
var $author$project$Game$TimeAttack = 2;
var $elm$core$Basics$modBy = _Basics_modBy;
var $elm$core$String$length = _String_length;
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$String$padLeft = F3(
	function (n, _char, string) {
		return _Utils_ap(
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)),
			string);
	});
var $author$project$Main$formatTime = function (secs) {
	var s = A2($elm$core$Basics$modBy, 60, secs);
	var m = (secs / 60) | 0;
	return $elm$core$String$fromInt(m) + (':' + A3(
		$elm$core$String$padLeft,
		2,
		'0',
		$elm$core$String$fromInt(s)));
};
var $author$project$Main$viewHud = F2(
	function (model, game) {
		var best = A2(
			$elm$core$Dict$get,
			$author$project$Main$recordKey(game),
			model.u.U);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('hud')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('hud-item')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('pill-label')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									(game.C === 2) ? 'Restante' : 'Tempo')
								])),
							A2(
							$elm$html$Html$strong,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$classList(
									_List_fromArray(
										[
											_Utils_Tuple2('danger', (game.C === 2) && (game.n < 30))
										]))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									$author$project$Main$formatTime(
										(game.C === 2) ? game.n : game.P))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('hud-item')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('pill-label')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Pontos')
								])),
							A2(
							$elm$html$Html$strong,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(
									$elm$core$String$fromInt(game.E))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('hud-item')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('pill-label')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Combo')
								])),
							A2(
							$elm$html$Html$strong,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$classList(
									_List_fromArray(
										[
											_Utils_Tuple2('hot', game.V >= 3)
										]))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									'×' + $elm$core$String$fromInt(
										A2($elm$core$Basics$max, 1, game.V)))
								]))
						])),
					(game.C === 1) ? A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('hud-item')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('pill-label')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Vidas')
								])),
							A2(
							$elm$html$Html$strong,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('lives')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									_Utils_ap(
										A2($elm$core$String$repeat, game.K, '♥'),
										A2($elm$core$String$repeat, 3 - game.K, '♡')))
								]))
						])) : $elm$html$Html$text(''),
					function () {
					if (!best.$) {
						var b = best.a;
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('hud-item')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('pill-label')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Recorde')
										])),
									A2(
									$elm$html$Html$strong,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(
											$elm$core$String$fromInt(b))
										]))
								]));
					} else {
						return $elm$html$Html$text('');
					}
				}()
				]));
	});
var $author$project$Main$Input = function (a) {
	return {$: 9, a: a};
};
var $elm$html$Html$small = _VirtualDom_node('small');
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$core$Elm$JsArray$foldl = _JsArray_foldl;
var $elm$core$Array$foldl = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldl, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldl,
			func,
			A3($elm$core$Elm$JsArray$foldl, helper, baseCase, tree),
			tail);
	});
var $author$project$Board$digitCount = F2(
	function (board, digit) {
		return A3(
			$elm$core$Array$foldl,
			F2(
				function (c, n) {
					return _Utils_eq(c.as, digit) ? (n + 1) : n;
				}),
			0,
			board);
	});
var $author$project$Main$viewPad = F2(
	function (model, game) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('pad', true),
							_Utils_Tuple2('notes-on', model.H)
						]))
				]),
			A2(
				$elm$core$List$map,
				function (d) {
					var left = 9 - A2($author$project$Board$digitCount, game.b, d);
					return A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$classList(
								_List_fromArray(
									[
										_Utils_Tuple2('key', true),
										_Utils_Tuple2('done', left <= 0)
									])),
								$elm$html$Html$Events$onClick(
								$author$project$Main$Input(d))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$elm$core$String$fromInt(d)),
								A2(
								$elm$html$Html$small,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										$elm$core$String$fromInt(
											A2($elm$core$Basics$max, 0, left)))
									]))
							]));
				},
				A2($elm$core$List$range, 1, 9)));
	});
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Main$HintGo = function (a) {
	return {$: 17, a: a};
};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $author$project$Main$ApplyHint = {$: 18};
var $author$project$Main$CloseHint = {$: 19};
var $author$project$Main$viewHint = function (model) {
	var _v0 = model.a;
	switch (_v0.$) {
		case 0:
			return $elm$html$Html$text('');
		case 1:
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('hint-card')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('spinner small')
							]),
						_List_Nil),
						$elm$html$Html$text(' Raciocinando…')
					]));
		case 3:
			var note = _v0.a;
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('hint-card')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(note)
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('link'),
								$elm$html$Html$Events$onClick($author$project$Main$CloseHint)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Fechar')
							]))
					]));
		default:
			var steps = _v0.a;
			var k = _v0.b;
			var total = $elm$core$List$length(steps);
			var _v1 = $elm$core$List$head(
				A2($elm$core$List$drop, k, steps));
			if (_v1.$ === 1) {
				return $elm$html$Html$text('');
			} else {
				var step = _v1.a;
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('hint-card')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('hint-head')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class(
											'lvl lvl' + $elm$core$String$fromInt(step.aq))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$elm$core$String$fromInt(step.aq))
										])),
									A2(
									$elm$html$Html$strong,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(step.aJ)
										])),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('hint-count')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$elm$core$String$fromInt(k + 1) + ('/' + $elm$core$String$fromInt(total)))
										]))
								])),
							A2(
							$elm$html$Html$p,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(step.bE)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('hint-actions')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('link'),
											$elm$html$Html$Events$onClick(
											$author$project$Main$HintGo(k - 1)),
											$elm$html$Html$Attributes$disabled(!k)
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('← Anterior')
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('link'),
											$elm$html$Html$Events$onClick(
											$author$project$Main$HintGo(k + 1)),
											$elm$html$Html$Attributes$disabled(
											_Utils_cmp(k, total - 1) > -1)
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Próximo →')
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('primary small'),
											$elm$html$Html$Events$onClick($author$project$Main$ApplyHint)
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Aplicar')
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('link'),
											$elm$html$Html$Events$onClick($author$project$Main$CloseHint)
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Fechar')
										]))
								]))
						]));
			}
	}
};
var $elm$html$Html$code = _VirtualDom_node('code');
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Game$modeName = function (mode) {
	switch (mode) {
		case 0:
			return 'Relaxado';
		case 1:
			return 'Sobrevivência';
		default:
			return 'Contra o relógio';
	}
};
var $author$project$Variant$ruleName = function (rule) {
	switch (rule) {
		case 0:
			return 'Diagonal (X)';
		case 1:
			return 'Hyper (janelas)';
		case 2:
			return 'Anti-cavalo';
		case 3:
			return 'Killer (gaiolas)';
		case 4:
			return 'Par / Ímpar';
		case 5:
			return 'Anti-rei';
		case 6:
			return 'Disjunto';
		case 7:
			return 'Não-consecutivo';
		case 8:
			return 'Termômetros';
		case 9:
			return 'Setas';
		case 10:
			return 'Kropki (pontos)';
		case 11:
			return 'X e V';
		case 12:
			return 'Sussurro';
		case 13:
			return 'Renban';
		case 14:
			return 'Palíndromo';
		default:
			return 'Entre-pontas';
	}
};
var $author$project$Main$viewInfo = function (game) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('info')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$strong,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Regras: ')
							])),
						$elm$html$Html$text(
						$elm$core$List$isEmpty(game.v.aW) ? 'clássico' : A2(
							$elm$core$String$join,
							', ',
							A2($elm$core$List$map, $author$project$Variant$ruleName, game.v.aW)))
					])),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$strong,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Nível lógico: ')
							])),
						$elm$html$Html$text(
						game.v.bA.bt + (' (' + ($elm$core$String$fromInt(game.v.bA.aq) + '/5)')))
					])),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$strong,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Modo: ')
							])),
						$elm$html$Html$text(
						$author$project$Game$modeName(game.C))
					])),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$strong,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Modelo CLP(FD): ')
							])),
						$elm$html$Html$text(
						$elm$core$String$fromInt(game.v.bM) + ' restrições')
					])),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$strong,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Semente: ')
							])),
						A2(
						$elm$html$Html$code,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								$elm$core$String$fromInt(game.v.bl))
							]))
					]))
			]));
};
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Main$Redo = {$: 14};
var $author$project$Main$Undo = {$: 13};
var $author$project$Main$Erase = {$: 10};
var $author$project$Main$AskHint = {$: 15};
var $author$project$Game$Playing = {$: 0};
var $author$project$Main$AutoNotes = {$: 12};
var $author$project$Main$ToggleNotes = {$: 11};
var $author$project$Game$hintPenalty = function (game) {
	return 40 + (20 * game.v.bA.aq);
};
var $author$project$Main$viewTools = F2(
	function (model, game) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('tools')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$classList(
							_List_fromArray(
								[
									_Utils_Tuple2('tool', true),
									_Utils_Tuple2('on', model.H)
								])),
							$elm$html$Html$Events$onClick($author$project$Main$ToggleNotes)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('✎ Notas')
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('tool'),
							$elm$html$Html$Events$onClick($author$project$Main$AutoNotes)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('⚡ Auto-notas')
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('tool'),
							$elm$html$Html$Events$onClick($author$project$Main$Erase)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('⌫ Apagar')
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('tool'),
							$elm$html$Html$Events$onClick($author$project$Main$Undo),
							$elm$html$Html$Attributes$disabled(
							$elm$core$List$isEmpty(game.D))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('↶ Desfazer')
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('tool'),
							$elm$html$Html$Events$onClick($author$project$Main$Redo),
							$elm$html$Html$Attributes$disabled(
							$elm$core$List$isEmpty(game.L))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('↷ Refazer')
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('tool hint-btn'),
							$elm$html$Html$Events$onClick($author$project$Main$AskHint),
							$elm$html$Html$Attributes$disabled(
							!_Utils_eq(game.k, $author$project$Game$Playing))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'💡 Dica (−' + ($elm$core$String$fromInt(
								$author$project$Game$hintPenalty(game)) + ')'))
						]))
				]));
	});
var $author$project$Main$viewSide = function (model) {
	var _v0 = model.c;
	if (_v0.$ === 3) {
		var game = _v0.a;
		return A2(
			$elm$html$Html$aside,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('panel side')
				]),
			_List_fromArray(
				[
					A2($author$project$Main$viewHud, model, game),
					A2($author$project$Main$viewPad, model, game),
					A2($author$project$Main$viewTools, model, game),
					$author$project$Main$viewHint(model),
					$author$project$Main$viewInfo(game)
				]));
	} else {
		return A2(
			$elm$html$Html$aside,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('panel side muted')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h2,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Como funciona')
						])),
					A2(
					$elm$html$Html$ul,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('howto')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$li,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Cada regra extra é um conjunto de restrições CLP(FD) no Prolog.')
								])),
							A2(
							$elm$html$Html$li,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('A dificuldade é medida pela técnica humana mais difícil necessária, não pelo número de pistas.')
								])),
							A2(
							$elm$html$Html$li,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Combos: acertos seguidos em até 15 s multiplicam os pontos (até ×8).')
								])),
							A2(
							$elm$html$Html$li,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('O desafio diário é igual para todos e conta a sua sequência de dias.')
								]))
						]))
				]));
	}
};
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$core$Basics$not = _Basics_not;
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Main$Loading = {$: 1};
var $author$project$Main$NewGame = {$: 4};
var $author$project$Main$SetMode = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$SetSeed = function (a) {
	return {$: 3, a: a};
};
var $author$project$Variant$XV = 11;
var $author$project$Variant$Arrow = 9;
var $author$project$Variant$Killer = 3;
var $author$project$Variant$Kropki = 10;
var $author$project$Variant$Parity = 4;
var $author$project$Variant$Renban = 13;
var $author$project$Variant$Thermo = 8;
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $author$project$Variant$Between = 15;
var $author$project$Variant$Whisper = 12;
var $author$project$Variant$Palindrome = 14;
var $author$project$Variant$isLocal = function (rule) {
	return A2(
		$elm$core$List$member,
		rule,
		_List_fromArray(
			[3, 4, 8, 9, 10, 11, 12, 13, 14, 15]));
};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $author$project$Game$Relax = 0;
var $author$project$Game$allModes = _List_fromArray(
	[0, 1, 2]);
var $author$project$Variant$Hyper = 1;
var $author$project$Variant$AntiKing = 5;
var $author$project$Variant$Disjoint = 6;
var $author$project$Variant$AntiKnight = 2;
var $author$project$Variant$NonConsecutive = 7;
var $author$project$Variant$allRules = _List_fromArray(
	[0, 1, 2, 5, 6, 7, 3, 4, 8, 9, 10, 11, 12, 13, 14, 15]);
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $author$project$Main$DailyGame = {$: 5};
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Main$dailyRules = function (dayNumber) {
	var rotation = _List_fromArray(
		[
			_List_fromArray(
			[3]),
			_List_fromArray(
			[0, 4]),
			_List_fromArray(
			[1]),
			_List_fromArray(
			[2]),
			_List_fromArray(
			[3, 0]),
			_List_fromArray(
			[1, 4]),
			_List_fromArray(
			[2, 0]),
			_List_fromArray(
			[8, 9]),
			_List_fromArray(
			[7]),
			_List_fromArray(
			[10, 11]),
			_List_fromArray(
			[5, 12]),
			_List_fromArray(
			[13, 14, 15]),
			_List_fromArray(
			[3, 8]),
			_List_fromArray(
			[6, 10])
		]);
	return A2(
		$elm$core$Maybe$withDefault,
		_List_Nil,
		$elm$core$List$head(
			A2(
				$elm$core$List$drop,
				A2(
					$elm$core$Basics$modBy,
					$elm$core$List$length(rotation),
					dayNumber),
				rotation)));
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$html$Html$Attributes$title = $elm$html$Html$Attributes$stringProperty('title');
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $author$project$Main$ToggleRule = function (a) {
	return {$: 0, a: a};
};
var $author$project$Variant$ruleDescription = function (rule) {
	switch (rule) {
		case 0:
			return 'As duas diagonais principais também contêm 1 a 9 sem repetição.';
		case 1:
			return 'Quatro janelas 3×3 extras (sombreadas) também contêm 1 a 9.';
		case 2:
			return 'Células a um salto de cavalo de xadrez nunca têm o mesmo dígito.';
		case 3:
			return 'Gaiolas tracejadas: dígitos distintos cuja soma é o número no canto.';
		case 4:
			return 'Círculo = dígito ímpar, quadrado = dígito par.';
		case 5:
			return 'Células vizinhas na diagonal nunca têm o mesmo dígito.';
		case 6:
			return 'Células na mesma posição de cada bloco 3×3 não se repetem.';
		case 7:
			return 'Células lado a lado nunca têm números seguidos.';
		case 8:
			return 'Os números sobem a partir do bulbo do termômetro.';
		case 9:
			return 'O número do círculo é a soma das células da haste.';
		case 10:
			return 'Ponto branco: números seguidos. Ponto preto: um é o dobro do outro.';
		case 11:
			return 'X: as duas células somam 10. V: somam 5.';
		case 12:
			return 'Vizinhos na linha verde diferem de pelo menos 5.';
		case 13:
			return 'A linha roxa tem números seguidos, em qualquer ordem.';
		case 14:
			return 'A linha cinza-azulada se lê igual nos dois sentidos.';
		default:
			return 'As células do meio ficam entre os números dos dois círculos.';
	}
};
var $author$project$Main$viewRuleList = F2(
	function (setup, rules) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('rules')
				]),
			A2(
				$elm$core$List$map,
				function (rule) {
					return A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$classList(
								_List_fromArray(
									[
										_Utils_Tuple2('rule', true),
										_Utils_Tuple2(
										'on',
										A2($elm$core$List$member, rule, setup.aW))
									])),
								$elm$html$Html$Attributes$title(
								$author$project$Variant$ruleDescription(rule))
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('checkbox'),
										$elm$html$Html$Attributes$checked(
										A2($elm$core$List$member, rule, setup.aW)),
										$elm$html$Html$Events$onClick(
										$author$project$Main$ToggleRule(rule))
									]),
								_List_Nil),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('rule-name')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										$author$project$Variant$ruleName(rule))
									])),
								A2(
								$elm$html$Html$small,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										$author$project$Variant$ruleDescription(rule))
									]))
							]));
				},
				rules));
	});
var $author$project$Main$SetDifficulty = function (a) {
	return {$: 1, a: a};
};
var $author$project$Api$difficultyName = function (d) {
	switch (d) {
		case 0:
			return 'Fácil';
		case 1:
			return 'Médio';
		case 2:
			return 'Difícil';
		default:
			return 'Extremo';
	}
};
var $author$project$Api$Facil = 0;
var $author$project$Api$Dificil = 2;
var $author$project$Api$Extremo = 3;
var $author$project$Api$allDifficulties = _List_fromArray(
	[0, 1, 2, 3]);
var $author$project$Game$modeDescription = function (mode) {
	switch (mode) {
		case 0:
			return 'Sem limites. Erros só aparecem quando quebram uma regra visível.';
		case 1:
			return '3 vidas. Cada dígito errado custa uma vida e zera o combo.';
		default:
			return 'Relógio regressivo. Acertos dão tempo extra, erros tiram 20 s.';
	}
};
var $author$project$Main$viewSetup = function (model) {
	var setup = model.g;
	return A2(
		$elm$html$Html$aside,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('panel setup')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Nova partida')
					])),
				A2(
				$elm$html$Html$h3,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Regras globais')
					])),
				A2(
				$author$project$Main$viewRuleList,
				setup,
				A2(
					$elm$core$List$filter,
					A2($elm$core$Basics$composeL, $elm$core$Basics$not, $author$project$Variant$isLocal),
					$author$project$Variant$allRules)),
				A2(
				$elm$html$Html$h3,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Regras locais (desenhadas)')
					])),
				A2(
				$author$project$Main$viewRuleList,
				setup,
				A2($elm$core$List$filter, $author$project$Variant$isLocal, $author$project$Variant$allRules)),
				A2(
				$elm$html$Html$h3,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Dificuldade')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('segmented')
					]),
				A2(
					$elm$core$List$map,
					function (d) {
						return A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$classList(
									_List_fromArray(
										[
											_Utils_Tuple2('seg', true),
											_Utils_Tuple2(
											'on',
											_Utils_eq(d, setup.bI))
										])),
									$elm$html$Html$Events$onClick(
									$author$project$Main$SetDifficulty(d))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									$author$project$Api$difficultyName(d))
								]));
					},
					$author$project$Api$allDifficulties)),
				A2(
				$elm$html$Html$h3,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Modo')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('modes')
					]),
				A2(
					$elm$core$List$map,
					function (m) {
						return A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$classList(
									_List_fromArray(
										[
											_Utils_Tuple2('mode', true),
											_Utils_Tuple2(
											'on',
											_Utils_eq(m, setup.C))
										])),
									$elm$html$Html$Events$onClick(
									$author$project$Main$SetMode(m))
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$strong,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Game$modeName(m))
										])),
									A2(
									$elm$html$Html$small,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Game$modeDescription(m))
										]))
								]));
					},
					$author$project$Game$allModes)),
				A2(
				$elm$html$Html$h3,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Semente (opcional)')
					])),
				A2(
				$elm$html$Html$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('seed'),
						$elm$html$Html$Attributes$placeholder('aleatória'),
						$elm$html$Html$Attributes$value(setup.aj),
						$elm$html$Html$Events$onInput($author$project$Main$SetSeed),
						A2($elm$html$Html$Attributes$attribute, 'inputmode', 'numeric')
					]),
				_List_Nil),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('primary'),
						$elm$html$Html$Events$onClick($author$project$Main$NewGame),
						$elm$html$Html$Attributes$disabled(
						_Utils_eq(model.c, $author$project$Main$Loading))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Gerar puzzle')
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('secondary'),
						$elm$html$Html$Events$onClick($author$project$Main$DailyGame),
						$elm$html$Html$Attributes$disabled(
						_Utils_eq(model.c, $author$project$Main$Loading))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Desafio diário'),
						A2(
						$elm$html$Html$small,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								function () {
									var _v0 = $author$project$Main$dailyRules(model.r);
									if (!_v0.b) {
										return 'clássico';
									} else {
										var rs = _v0;
										return A2(
											$elm$core$String$join,
											' + ',
											A2($elm$core$List$map, $author$project$Variant$ruleName, rs));
									}
								}())
							]))
					]))
			]));
};
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Set$Set_elm_builtin = $elm$core$Basics$identity;
var $elm$core$Set$empty = $elm$core$Dict$empty;
var $author$project$Board$emptyCell = {aS: false, bu: $elm$core$Set$empty, as: 0};
var $author$project$Board$cell = F2(
	function (i, board) {
		return A2(
			$elm$core$Maybe$withDefault,
			$author$project$Board$emptyCell,
			A2($elm$core$Array$get, i, board));
	});
var $elm$virtual_dom$VirtualDom$lazy = _VirtualDom_lazy;
var $elm$svg$Svg$Lazy$lazy = $elm$virtual_dom$VirtualDom$lazy;
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var $author$project$Overlay$order = function (extra) {
	var _v0 = extra.ak;
	switch (_v0) {
		case 0:
			return 0;
		case 7:
			return 1;
		case 2:
			return 5;
		case 3:
			return 5;
		case 4:
			return 5;
		case 5:
			return 5;
		default:
			return 2;
	}
};
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$core$String$fromFloat = _String_fromNumber;
var $author$project$Overlay$f = $elm$core$String$fromFloat;
var $elm$svg$Svg$Attributes$r = _VirtualDom_attribute('r');
var $elm$svg$Svg$Attributes$cx = _VirtualDom_attribute('cx');
var $elm$svg$Svg$Attributes$cy = _VirtualDom_attribute('cy');
var $elm$svg$Svg$circle = $elm$svg$Svg$trustedNode('circle');
var $author$project$Variant$col = function (i) {
	return A2($elm$core$Basics$modBy, 9, i);
};
var $author$project$Variant$row = function (i) {
	return (i / 9) | 0;
};
var $author$project$Overlay$size = 100;
var $author$project$Overlay$center = function (i) {
	return _Utils_Tuple2(
		($author$project$Variant$col(i) + 0.5) * $author$project$Overlay$size,
		($author$project$Variant$row(i) + 0.5) * $author$project$Overlay$size);
};
var $author$project$Overlay$midpoint = function (cells) {
	if ((cells.b && cells.b.b) && (!cells.b.b.b)) {
		var a = cells.a;
		var _v1 = cells.b;
		var b = _v1.a;
		var _v2 = $author$project$Overlay$center(b);
		var x2 = _v2.a;
		var y2 = _v2.b;
		var _v3 = $author$project$Overlay$center(a);
		var x1 = _v3.a;
		var y1 = _v3.b;
		return $elm$core$Maybe$Just(
			_Utils_Tuple2((x1 + x2) / 2, (y1 + y2) / 2));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Overlay$dot = F2(
	function (cls, cells) {
		var _v0 = $author$project$Overlay$midpoint(cells);
		if (!_v0.$) {
			var _v1 = _v0.a;
			var x = _v1.a;
			var y = _v1.b;
			return _List_fromArray(
				[
					A2(
					$elm$svg$Svg$circle,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$cx(
							$author$project$Overlay$f(x)),
							$elm$svg$Svg$Attributes$cy(
							$author$project$Overlay$f(y)),
							$elm$svg$Svg$Attributes$r('11'),
							$elm$svg$Svg$Attributes$class(cls)
						]),
					_List_Nil)
				]);
		} else {
			return _List_Nil;
		}
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $elm$svg$Svg$text = $elm$virtual_dom$VirtualDom$text;
var $elm$svg$Svg$text_ = $elm$svg$Svg$trustedNode('text');
var $author$project$Overlay$letter = F2(
	function (t, cells) {
		var _v0 = $author$project$Overlay$midpoint(cells);
		if (!_v0.$) {
			var _v1 = _v0.a;
			var x = _v1.a;
			var y = _v1.b;
			return _List_fromArray(
				[
					A2(
					$elm$svg$Svg$circle,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$cx(
							$author$project$Overlay$f(x)),
							$elm$svg$Svg$Attributes$cy(
							$author$project$Overlay$f(y)),
							$elm$svg$Svg$Attributes$r('15'),
							$elm$svg$Svg$Attributes$class('ex-xv-bg')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$text_,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$author$project$Overlay$f(x)),
							$elm$svg$Svg$Attributes$y(
							$author$project$Overlay$f(y + 9)),
							$elm$svg$Svg$Attributes$class('ex-xv')
						]),
					_List_fromArray(
						[
							$elm$svg$Svg$text(t)
						]))
				]);
		} else {
			return _List_Nil;
		}
	});
var $elm$svg$Svg$Attributes$points = _VirtualDom_attribute('points');
var $elm$svg$Svg$polyline = $elm$svg$Svg$trustedNode('polyline');
var $author$project$Overlay$polyline = F2(
	function (cls, cells) {
		return A2(
			$elm$svg$Svg$polyline,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$points(
					A2(
						$elm$core$String$join,
						' ',
						A2(
							$elm$core$List$map,
							function (i) {
								return function (_v0) {
									var x = _v0.a;
									var y = _v0.b;
									return $author$project$Overlay$f(x) + (',' + $author$project$Overlay$f(y));
								}(
									$author$project$Overlay$center(i));
							},
							cells))),
					$elm$svg$Svg$Attributes$class(cls)
				]),
			_List_Nil);
	});
var $elm$svg$Svg$Attributes$x1 = _VirtualDom_attribute('x1');
var $elm$svg$Svg$Attributes$x2 = _VirtualDom_attribute('x2');
var $elm$svg$Svg$Attributes$y1 = _VirtualDom_attribute('y1');
var $elm$svg$Svg$Attributes$y2 = _VirtualDom_attribute('y2');
var $elm$core$Basics$pow = _Basics_pow;
var $elm$svg$Svg$line = $elm$svg$Svg$trustedNode('line');
var $elm$core$Basics$sqrt = _Basics_sqrt;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $author$project$Overlay$arrowHead = function (cells) {
	var _v0 = $elm$core$List$reverse(cells);
	if (_v0.b && _v0.b.b) {
		var last = _v0.a;
		var _v1 = _v0.b;
		var before = _v1.a;
		var _v2 = $author$project$Overlay$center(last);
		var x2 = _v2.a;
		var y2 = _v2.b;
		var _v3 = $author$project$Overlay$center(before);
		var x1 = _v3.a;
		var y1 = _v3.b;
		var len = $elm$core$Basics$sqrt(
			A2($elm$core$Basics$pow, x2 - x1, 2) + A2($elm$core$Basics$pow, y2 - y1, 2));
		var _v4 = _Utils_Tuple2((x2 - x1) / len, (y2 - y1) / len);
		var dx = _v4.a;
		var dy = _v4.b;
		var wing = function (sign) {
			return A2(
				$elm$svg$Svg$line,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$x1(
						$author$project$Overlay$f(x2 + (dx * 16))),
						$elm$svg$Svg$Attributes$y1(
						$author$project$Overlay$f(y2 + (dy * 16))),
						$elm$svg$Svg$Attributes$x2(
						$author$project$Overlay$f(((x2 + (dx * 16)) - (dx * 24)) + ((sign * dy) * 16))),
						$elm$svg$Svg$Attributes$y2(
						$author$project$Overlay$f(((y2 + (dy * 16)) - (dy * 24)) - ((sign * dx) * 16))),
						$elm$svg$Svg$Attributes$class('ex-arrow')
					]),
				_List_Nil);
		};
		return _List_fromArray(
			[
				wing(1),
				wing(-1)
			]);
	} else {
		return _List_Nil;
	}
};
var $author$project$Overlay$viewExtra = function (extra) {
	var _v0 = extra.ak;
	switch (_v0) {
		case 0:
			var _v1 = extra.bq;
			if (_v1.b) {
				var bulb = _v1.a;
				var _v2 = $author$project$Overlay$center(bulb);
				var x = _v2.a;
				var y = _v2.b;
				return _List_fromArray(
					[
						A2($author$project$Overlay$polyline, 'ex-thermo', extra.bq),
						A2(
						$elm$svg$Svg$circle,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$cx(
								$author$project$Overlay$f(x)),
								$elm$svg$Svg$Attributes$cy(
								$author$project$Overlay$f(y)),
								$elm$svg$Svg$Attributes$r('34'),
								$elm$svg$Svg$Attributes$class('ex-thermo-bulb')
							]),
						_List_Nil)
					]);
			} else {
				return _List_Nil;
			}
		case 1:
			var _v3 = extra.bq;
			if (_v3.b) {
				var circle = _v3.a;
				var _v4 = $author$project$Overlay$center(circle);
				var x = _v4.a;
				var y = _v4.b;
				return A2(
					$elm$core$List$cons,
					A2($author$project$Overlay$polyline, 'ex-arrow', extra.bq),
					_Utils_ap(
						$author$project$Overlay$arrowHead(extra.bq),
						_List_fromArray(
							[
								A2(
								$elm$svg$Svg$circle,
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$cx(
										$author$project$Overlay$f(x)),
										$elm$svg$Svg$Attributes$cy(
										$author$project$Overlay$f(y)),
										$elm$svg$Svg$Attributes$r('40'),
										$elm$svg$Svg$Attributes$class('ex-arrow-circle')
									]),
								_List_Nil)
							])));
			} else {
				return _List_Nil;
			}
		case 6:
			return _List_fromArray(
				[
					A2($author$project$Overlay$polyline, 'ex-whisper', extra.bq)
				]);
		case 7:
			return _List_fromArray(
				[
					A2($author$project$Overlay$polyline, 'ex-renban', extra.bq)
				]);
		case 8:
			return _List_fromArray(
				[
					A2($author$project$Overlay$polyline, 'ex-palindrome', extra.bq)
				]);
		case 9:
			var end = function (i) {
				var _v5 = $author$project$Overlay$center(i);
				var x = _v5.a;
				var y = _v5.b;
				return A2(
					$elm$svg$Svg$circle,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$cx(
							$author$project$Overlay$f(x)),
							$elm$svg$Svg$Attributes$cy(
							$author$project$Overlay$f(y)),
							$elm$svg$Svg$Attributes$r('38'),
							$elm$svg$Svg$Attributes$class('ex-between-end')
						]),
					_List_Nil);
			};
			return A2(
				$elm$core$List$cons,
				A2($author$project$Overlay$polyline, 'ex-between', extra.bq),
				A2(
					$elm$core$List$map,
					end,
					_Utils_ap(
						A2($elm$core$List$take, 1, extra.bq),
						A2(
							$elm$core$List$take,
							1,
							$elm$core$List$reverse(extra.bq)))));
		case 2:
			return A2($author$project$Overlay$dot, 'ex-dot ex-dot-white', extra.bq);
		case 3:
			return A2($author$project$Overlay$dot, 'ex-dot ex-dot-black', extra.bq);
		case 4:
			return A2($author$project$Overlay$letter, 'X', extra.bq);
		default:
			return A2($author$project$Overlay$letter, 'V', extra.bq);
	}
};
var $elm$svg$Svg$Attributes$preserveAspectRatio = _VirtualDom_attribute('preserveAspectRatio');
var $author$project$Overlay$view = function (extras) {
	return A2(
		$elm$svg$Svg$svg,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$viewBox('0 0 900 900'),
				$elm$svg$Svg$Attributes$preserveAspectRatio('none'),
				$elm$svg$Svg$Attributes$class('extras-layer')
			]),
		A2(
			$elm$core$List$concatMap,
			$author$project$Overlay$viewExtra,
			A2($elm$core$List$sortBy, $author$project$Overlay$order, extras)));
};
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Main$Select = function (a) {
	return {$: 7, a: a};
};
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$member, key, dict);
	});
var $author$project$Variant$isWindow = function (i) {
	var inBand = function (x) {
		return ((x >= 1) && (x <= 3)) || ((x >= 5) && (x <= 7));
	};
	return inBand(
		$author$project$Variant$row(i)) && inBand(
		$author$project$Variant$col(i));
};
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $elm$core$List$minimum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$min, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $author$project$Main$viewCage = F2(
	function (game, i) {
		var _v0 = A2($elm$core$Dict$get, i, game._.aZ);
		if (_v0.$ === 1) {
			return _List_Nil;
		} else {
			var k = _v0.a;
			var same = function (j) {
				return _Utils_eq(
					A2($elm$core$Dict$get, j, game._.aZ),
					$elm$core$Maybe$Just(k));
			};
			var cage = A2($elm$core$Array$get, k, game._.aQ);
			var isAnchor = A2(
				$elm$core$Maybe$withDefault,
				false,
				A2(
					$elm$core$Maybe$map,
					function (cg) {
						return _Utils_eq(
							$elm$core$List$minimum(cg.bq),
							$elm$core$Maybe$Just(i));
					},
					cage));
			var co = $author$project$Variant$col(i);
			var r = $author$project$Variant$row(i);
			var sides = _List_fromArray(
				[
					_Utils_Tuple2(
					't',
					(!r) || (!same(i - 9))),
					_Utils_Tuple2(
					'b',
					(r === 8) || (!same(i + 9))),
					_Utils_Tuple2(
					'l',
					(!co) || (!same(i - 1))),
					_Utils_Tuple2(
					'r',
					(co === 8) || (!same(i + 1)))
				]);
			return A2(
				$elm$core$List$cons,
				A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$classList(
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2('cage', true),
								sides))
						]),
					_List_Nil),
				isAnchor ? _List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('cage-sum')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								A2(
									$elm$core$Maybe$withDefault,
									'',
									A2(
										$elm$core$Maybe$map,
										A2(
											$elm$core$Basics$composeR,
											function ($) {
												return $.bh;
											},
											$elm$core$String$fromInt),
										cage)))
							]))
					]) : _List_Nil);
		}
	});
var $author$project$Variant$isDiagonal = function (i) {
	return _Utils_eq(
		$author$project$Variant$row(i),
		$author$project$Variant$col(i)) || (($author$project$Variant$row(i) + $author$project$Variant$col(i)) === 8);
};
var $author$project$Main$viewParity = F2(
	function (game, i) {
		var _v0 = A2($elm$core$Array$get, i, game.v.a3);
		_v0$2:
		while (true) {
			if (!_v0.$) {
				switch (_v0.a) {
					case 1:
						return _List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('parity odd'),
										$elm$html$Html$Attributes$title('ímpar')
									]),
								_List_Nil)
							]);
					case 2:
						return _List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('parity even'),
										$elm$html$Html$Attributes$title('par')
									]),
								_List_Nil)
							]);
					default:
						break _v0$2;
				}
			} else {
				break _v0$2;
			}
		}
		return _List_Nil;
	});
var $author$project$Main$viewContent = F3(
	function (c, elims, hintPlace) {
		if (!(!c.as)) {
			return A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('value')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$elm$core$String$fromInt(c.as))
					]));
		} else {
			if (!hintPlace.$) {
				var d = hintPlace.a;
				return A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('value ghost')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$String$fromInt(d))
						]));
			} else {
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('notes')
						]),
					A2(
						$elm$core$List$map,
						function (d) {
							return A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$classList(
										_List_fromArray(
											[
												_Utils_Tuple2(
												'elim',
												A2($elm$core$List$member, d, elims))
											]))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										(A2($elm$core$Set$member, d, c.bu) || A2($elm$core$List$member, d, elims)) ? $elm$core$String$fromInt(d) : '')
									]));
						},
						A2($elm$core$List$range, 1, 9)));
			}
		}
	});
var $author$project$Main$viewCell = F2(
	function (ctx, i) {
		var hintPlace = A2(
			$elm$core$Maybe$andThen,
			function (_v1) {
				var j = _v1.a;
				var d = _v1.b;
				return _Utils_eq(j, i) ? $elm$core$Maybe$Just(d) : $elm$core$Maybe$Nothing;
			},
			A2(
				$elm$core$Maybe$andThen,
				function ($) {
					return $.bG;
				},
				ctx.a));
		var hintFocus = A2(
			$elm$core$Maybe$withDefault,
			false,
			A2(
				$elm$core$Maybe$map,
				function (h) {
					return A2($elm$core$List$member, i, h.bs);
				},
				ctx.a));
		var hintElims = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Maybe$map,
				function (h) {
					return A2(
						$elm$core$List$map,
						$elm$core$Tuple$second,
						A2(
							$elm$core$List$filter,
							function (_v0) {
								var j = _v0.a;
								return _Utils_eq(j, i);
							},
							h.bO));
				},
				ctx.a));
		var hintUnit = A2(
			$elm$core$Maybe$withDefault,
			false,
			A2(
				$elm$core$Maybe$map,
				function (h) {
					return A2($elm$core$List$member, i, h.bn);
				},
				ctx.a));
		var game = ctx.ao;
		var rules = game.v.aW;
		var co = $author$project$Variant$col(i);
		var r = $author$project$Variant$row(i);
		var c = A2($author$project$Board$cell, i, game.b);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('cell', true),
							_Utils_Tuple2('br', (co === 2) || (co === 5)),
							_Utils_Tuple2('bb', (r === 2) || (r === 5)),
							_Utils_Tuple2('given', c.aS),
							_Utils_Tuple2('user', (!c.aS) && (!(!c.as))),
							_Utils_Tuple2(
							'selected',
							_Utils_eq(
								ctx.j,
								$elm$core$Maybe$Just(i))),
							_Utils_Tuple2(
							'peer',
							A2($elm$core$Set$member, i, ctx.ay)),
							_Utils_Tuple2(
							'same',
							(!(!ctx.an)) && _Utils_eq(c.as, ctx.an)),
							_Utils_Tuple2(
							'conflict',
							A2($elm$core$Set$member, i, ctx.av)),
							_Utils_Tuple2(
							'wrong',
							A2($elm$core$Set$member, i, game.o)),
							_Utils_Tuple2(
							'diag',
							A2($elm$core$List$member, 0, rules) && $author$project$Variant$isDiagonal(i)),
							_Utils_Tuple2(
							'window',
							A2($elm$core$List$member, 1, rules) && $author$project$Variant$isWindow(i)),
							_Utils_Tuple2('hint-unit', hintUnit),
							_Utils_Tuple2('hint-focus', hintFocus),
							_Utils_Tuple2(
							'hint-elim',
							!$elm$core$List$isEmpty(hintElims)),
							_Utils_Tuple2(
							'hint-place',
							!_Utils_eq(hintPlace, $elm$core$Maybe$Nothing))
						])),
					$elm$html$Html$Events$onClick(
					$author$project$Main$Select(i))
				]),
			_Utils_ap(
				A2($author$project$Main$viewCage, game, i),
				_Utils_ap(
					A2($author$project$Main$viewParity, game, i),
					_List_fromArray(
						[
							A3($author$project$Main$viewContent, c, hintElims, hintPlace)
						]))));
	});
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Set$foldl = F3(
	function (func, initialState, _v0) {
		var dict = _v0;
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (key, _v1, state) {
					return A2(func, key, state);
				}),
			initialState,
			dict);
	});
var $author$project$Board$valueAt = F2(
	function (board, i) {
		return A2($author$project$Board$cell, i, board).as;
	});
var $author$project$Board$lookup = F2(
	function (board, i) {
		var _v0 = A2($author$project$Board$valueAt, board, i);
		if (!_v0) {
			return $elm$core$Maybe$Nothing;
		} else {
			var v = _v0;
			return $elm$core$Maybe$Just(v);
		}
	});
var $author$project$Board$peersOf = F2(
	function (geo, i) {
		return A2(
			$elm$core$Maybe$withDefault,
			$elm$core$Set$empty,
			A2($elm$core$Array$get, i, geo.bv));
	});
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0;
		return A3($elm$core$Dict$insert, key, 0, dict);
	});
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $author$project$Local$arrow = F2(
	function (look, cells) {
		if (cells.b) {
			var circle = cells.a;
			var shaft = cells.b;
			var values = A2($elm$core$List$filterMap, look, shaft);
			var empties = $elm$core$List$length(shaft) - $elm$core$List$length(values);
			var s = $elm$core$List$sum(values);
			var wrong = function () {
				var _v1 = look(circle);
				if (!_v1.$) {
					var c = _v1.a;
					return (!empties) ? (!_Utils_eq(s, c)) : (_Utils_cmp(s + empties, c) > 0);
				} else {
					return (s + empties) > 9;
				}
			}();
			return wrong ? cells : _List_Nil;
		} else {
			return _List_Nil;
		}
	});
var $author$project$Local$unique = A2(
	$elm$core$List$foldl,
	F2(
		function (x, acc) {
			return A2($elm$core$List$member, x, acc) ? acc : A2($elm$core$List$cons, x, acc);
		}),
	_List_Nil);
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Local$renban = F2(
	function (look, cells) {
		var values = A2($elm$core$List$filterMap, look, cells);
		var repeated = !_Utils_eq(
			$elm$core$List$length(values),
			$elm$core$List$length(
				$author$project$Local$unique(values)));
		var _v0 = _Utils_Tuple2(
			$elm$core$List$maximum(values),
			$elm$core$List$minimum(values));
		if ((!_v0.a.$) && (!_v0.b.$)) {
			var hi = _v0.a.a;
			var lo = _v0.b.a;
			return (repeated || (_Utils_cmp(
				hi - lo,
				$elm$core$List$length(cells) - 1) > 0)) ? cells : _List_Nil;
		} else {
			return _List_Nil;
		}
	});
var $author$project$Local$thermo = F2(
	function (look, cells) {
		var badPair = F2(
			function (_v1, _v2) {
				var k = _v1.a;
				var v = _v1.c;
				var j = _v2.a;
				var w = _v2.c;
				return (_Utils_cmp(k, j) < 0) && (_Utils_cmp(w - v, j - k) < 0);
			});
		var filled = A2(
			$elm$core$List$filterMap,
			function (_v0) {
				var k = _v0.a;
				var i = _v0.b;
				return A2(
					$elm$core$Maybe$map,
					function (v) {
						return _Utils_Tuple3(k, i, v);
					},
					look(i));
			},
			A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, cells));
		var n = $elm$core$List$length(cells);
		var bad = function (x) {
			var k = x.a;
			var i = x.b;
			var v = x.c;
			return ((_Utils_cmp(v, k + 1) < 0) || ((_Utils_cmp(v, 9 - ((n - 1) - k)) > 0) || A2(
				$elm$core$List$any,
				function (y) {
					return A2(badPair, x, y) || A2(badPair, y, x);
				},
				filled))) ? $elm$core$Maybe$Just(i) : $elm$core$Maybe$Nothing;
		};
		return A2($elm$core$List$filterMap, bad, filled);
	});
var $author$project$Local$between = F2(
	function (look, cells) {
		var _v0 = _Utils_Tuple2(
			cells,
			$elm$core$List$reverse(cells));
		if (_v0.a.b && _v0.b.b) {
			var _v1 = _v0.a;
			var first = _v1.a;
			var _v2 = _v0.b;
			var last = _v2.a;
			var middle = A2(
				$elm$core$List$drop,
				1,
				$elm$core$List$reverse(
					A2($elm$core$List$drop, 1, cells)));
			var _v3 = _Utils_Tuple2(
				look(first),
				look(last));
			if ((!_v3.a.$) && (!_v3.b.$)) {
				var x = _v3.a.a;
				var y = _v3.b.a;
				var lo = A2($elm$core$Basics$min, x, y);
				var hi = A2($elm$core$Basics$max, x, y);
				var outside = function (i) {
					var _v4 = look(i);
					if (!_v4.$) {
						var v = _v4.a;
						return (_Utils_cmp(v, lo) < 1) || (_Utils_cmp(v, hi) > -1);
					} else {
						return _Utils_cmp(lo + 1, hi) > -1;
					}
				};
				return A2($elm$core$List$any, outside, middle) ? cells : _List_Nil;
			} else {
				return _List_Nil;
			}
		} else {
			return _List_Nil;
		}
	});
var $author$project$Local$violations = F2(
	function (look, extra) {
		var cells = extra.bq;
		var pairOk = function (ok) {
			if ((cells.b && cells.b.b) && (!cells.b.b.b)) {
				var a = cells.a;
				var _v6 = cells.b;
				var b = _v6.a;
				var _v7 = _Utils_Tuple2(
					look(a),
					look(b));
				if ((!_v7.a.$) && (!_v7.b.$)) {
					var x = _v7.a.a;
					var y = _v7.b.a;
					return A2(ok, x, y) ? _List_Nil : cells;
				} else {
					return _List_Nil;
				}
			} else {
				return _List_Nil;
			}
		};
		var neighbours = function (ok) {
			return A2(
				$elm$core$List$concatMap,
				function (_v3) {
					var a = _v3.a;
					var b = _v3.b;
					var _v4 = _Utils_Tuple2(
						look(a),
						look(b));
					if ((!_v4.a.$) && (!_v4.b.$)) {
						var x = _v4.a.a;
						var y = _v4.b.a;
						return A2(ok, x, y) ? _List_Nil : _List_fromArray(
							[a, b]);
					} else {
						return _List_Nil;
					}
				},
				A3(
					$elm$core$List$map2,
					$elm$core$Tuple$pair,
					cells,
					A2($elm$core$List$drop, 1, cells)));
		};
		var _v0 = extra.ak;
		switch (_v0) {
			case 0:
				return A2($author$project$Local$thermo, look, cells);
			case 1:
				return A2($author$project$Local$arrow, look, cells);
			case 2:
				return pairOk(
					F2(
						function (x, y) {
							return $elm$core$Basics$abs(x - y) === 1;
						}));
			case 3:
				return pairOk(
					F2(
						function (x, y) {
							return _Utils_eq(x, 2 * y) || _Utils_eq(y, 2 * x);
						}));
			case 4:
				return pairOk(
					F2(
						function (x, y) {
							return (x + y) === 10;
						}));
			case 5:
				return pairOk(
					F2(
						function (x, y) {
							return (x + y) === 5;
						}));
			case 6:
				return _Utils_ap(
					neighbours(
						F2(
							function (x, y) {
								return $elm$core$Basics$abs(x - y) >= 5;
							})),
					A2(
						$elm$core$List$filter,
						function (i) {
							return _Utils_eq(
								look(i),
								$elm$core$Maybe$Just(5));
						},
						cells));
			case 7:
				return A2($author$project$Local$renban, look, cells);
			case 8:
				return A2(
					$elm$core$List$concatMap,
					function (_v1) {
						var a = _v1.a;
						var b = _v1.b;
						var _v2 = _Utils_Tuple2(
							look(a),
							look(b));
						if ((!_v2.a.$) && (!_v2.b.$)) {
							var x = _v2.a.a;
							var y = _v2.b.a;
							return _Utils_eq(x, y) ? _List_Nil : _List_fromArray(
								[a, b]);
						} else {
							return _List_Nil;
						}
					},
					A3(
						$elm$core$List$map2,
						$elm$core$Tuple$pair,
						cells,
						$elm$core$List$reverse(cells)));
			default:
				return A2($author$project$Local$between, look, cells);
		}
	});
var $author$project$Board$parityAllows = F2(
	function (mark, digit) {
		switch (mark) {
			case 1:
				return A2($elm$core$Basics$modBy, 2, digit) === 1;
			case 2:
				return !A2($elm$core$Basics$modBy, 2, digit);
			default:
				return true;
		}
	});
var $author$project$Local$nonConsecutiveViolations = function (look) {
	return A2(
		$elm$core$List$concatMap,
		function (i) {
			var right = (A2($elm$core$Basics$modBy, 9, i) < 8) ? _List_fromArray(
				[i + 1]) : _List_Nil;
			var down = (i < 72) ? _List_fromArray(
				[i + 9]) : _List_Nil;
			return A2(
				$elm$core$List$concatMap,
				function (j) {
					var _v0 = _Utils_Tuple2(
						look(i),
						look(j));
					if ((!_v0.a.$) && (!_v0.b.$)) {
						var x = _v0.a.a;
						var y = _v0.b.a;
						return ($elm$core$Basics$abs(x - y) === 1) ? _List_fromArray(
							[i, j]) : _List_Nil;
					} else {
						return _List_Nil;
					}
				},
				_Utils_ap(right, down));
		},
		A2($elm$core$List$range, 0, 80));
};
var $author$project$Board$conflicts = F3(
	function (geo, parity, board) {
		var nonConsecutive = A2($elm$core$List$member, 7, geo.aW) ? $author$project$Local$nonConsecutiveViolations(
			$author$project$Board$lookup(board)) : _List_Nil;
		var parityErrors = A2(
			$elm$core$List$filter,
			function (i) {
				var v = A2($author$project$Board$valueAt, board, i);
				return (!(!v)) && (!A2(
					$author$project$Board$parityAllows,
					A2(
						$elm$core$Maybe$withDefault,
						0,
						A2($elm$core$Array$get, i, parity)),
					v));
			},
			A2($elm$core$List$range, 0, 80));
		var localErrors = A2(
			$elm$core$List$concatMap,
			$author$project$Local$violations(
				$author$project$Board$lookup(board)),
			geo.a$);
		var duplicates = A2(
			$elm$core$List$filter,
			function (i) {
				var v = A2($author$project$Board$valueAt, board, i);
				return (!(!v)) && A3(
					$elm$core$Set$foldl,
					F2(
						function (j, acc) {
							return acc || _Utils_eq(
								A2($author$project$Board$valueAt, board, j),
								v);
						}),
					false,
					A2($author$project$Board$peersOf, geo, i));
			},
			A2($elm$core$List$range, 0, 80));
		var cageErrors = A2(
			$elm$core$List$concatMap,
			function (cage) {
				var vs = A2(
					$elm$core$List$map,
					$author$project$Board$valueAt(board),
					cage.bq);
				var full = A2(
					$elm$core$List$all,
					function (v) {
						return !(!v);
					},
					vs);
				var total = $elm$core$List$sum(vs);
				return ((_Utils_cmp(total, cage.bh) > 0) || (full && (!_Utils_eq(total, cage.bh)))) ? cage.bq : _List_Nil;
			},
			$elm$core$Array$toList(geo.aQ));
		return $elm$core$Set$fromList(
			_Utils_ap(
				duplicates,
				_Utils_ap(
					parityErrors,
					_Utils_ap(
						cageErrors,
						_Utils_ap(localErrors, nonConsecutive)))));
	});
var $author$project$Main$viewTechniques = function (game) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('techniques')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Análise lógica: ' + game.v.bA.bt)
					])),
				A2(
				$elm$html$Html$ul,
				_List_Nil,
				A2(
					$elm$core$List$map,
					function (t) {
						return A2(
							$elm$html$Html$li,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class(
											'lvl lvl' + $elm$core$String$fromInt(t.aq))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$elm$core$String$fromInt(t.aq))
										])),
									$elm$html$Html$text(
									t.aJ + (' ×' + $elm$core$String$fromInt(t.br)))
								]));
					},
					game.v.bA.bL))
			]));
};
var $author$project$Main$viewOverlay = function (game) {
	var _v0 = game.k;
	switch (_v0.$) {
		case 0:
			return $elm$html$Html$text('');
		case 1:
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('overlay')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('overlay-card')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h2,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Resolvido!')
									])),
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('big')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										$elm$core$String$fromInt(game.E)),
										A2(
										$elm$html$Html$small,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(' pontos')
											]))
									])),
								A2(
								$elm$html$Html$ul,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('breakdown')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$li,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(
												'Tempo: ' + $author$project$Main$formatTime(game.P))
											])),
										A2(
										$elm$html$Html$li,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(
												'Bônus de conclusão: ' + $elm$core$String$fromInt(game.ax))
											])),
										A2(
										$elm$html$Html$li,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(
												'Maior combo: ×' + $elm$core$String$fromInt(game.al))
											])),
										A2(
										$elm$html$Html$li,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(
												'Erros: ' + ($elm$core$String$fromInt(game.ah) + (' · Dicas: ' + $elm$core$String$fromInt(game.aw))))
											]))
									])),
								$author$project$Main$viewTechniques(game),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('primary'),
										$elm$html$Html$Events$onClick($author$project$Main$NewGame)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Jogar de novo')
									]))
							]))
					]));
		default:
			var reason = _v0.a;
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('overlay')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('overlay-card lost')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h2,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Fim de jogo')
									])),
								A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(reason)
									])),
								$author$project$Main$viewTechniques(game),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('primary'),
										$elm$html$Html$Events$onClick($author$project$Main$NewGame)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Tentar outro')
									]))
							]))
					]));
	}
};
var $author$project$Main$viewBoard = F2(
	function (model, game) {
		var selectedValue = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2(
				$elm$core$Maybe$map,
				function (i) {
					return A2($author$project$Board$cell, i, game.b).as;
				},
				model.j));
		var selectedPeers = A2(
			$elm$core$Maybe$withDefault,
			$elm$core$Set$empty,
			A2(
				$elm$core$Maybe$andThen,
				function (i) {
					return A2($elm$core$Array$get, i, game._.bv);
				},
				model.j));
		var conflicts = A3($author$project$Board$conflicts, game._, game.v.a3, game.b);
		var hintStep = function () {
			var _v0 = model.a;
			if (_v0.$ === 2) {
				var steps = _v0.a;
				var k = _v0.b;
				return $elm$core$List$head(
					A2($elm$core$List$drop, k, steps));
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}();
		var ctx = {ao: game, a: hintStep, j: model.j, av: conflicts, ay: selectedPeers, an: selectedValue};
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('board-wrap')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$classList(
							_List_fromArray(
								[
									_Utils_Tuple2('board', true),
									_Utils_Tuple2(
									'has-diag',
									A2($elm$core$List$member, 0, game.v.aW)),
									_Utils_Tuple2(
									'has-hyper',
									A2($elm$core$List$member, 1, game.v.aW))
								]))
						]),
					A2(
						$elm$core$List$map,
						$author$project$Main$viewCell(ctx),
						A2($elm$core$List$range, 0, 80))),
					A2($elm$svg$Svg$Lazy$lazy, $author$project$Overlay$view, game.v.a$),
					$author$project$Main$viewOverlay(game)
				]));
	});
var $author$project$Main$viewStage = function (model) {
	var _v0 = model.c;
	switch (_v0.$) {
		case 0:
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('message')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h2,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Bem-vindo ao Super Sudoku')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Combine regras extras, escolha a dificuldade e um modo de jogo. O servidor em Prolog gera um puzzle com solução única e classifica a dificuldade pelas técnicas lógicas necessárias.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Empacou? Peça uma dica: o motor lógico explica o próximo passo, como um professor faria.')
							]))
					]));
		case 1:
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('message')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('spinner')
							]),
						_List_Nil),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('O Prolog está gerando e avaliando o puzzle…')
							]))
					]));
		case 2:
			var err = _v0.a;
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('message error')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h2,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Não foi possível gerar o puzzle')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(err)
							]))
					]));
		default:
			var game = _v0.a;
			return A2($author$project$Main$viewBoard, model, game);
	}
};
var $author$project$Main$statPill = F2(
	function (label, value) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('pill')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('pill-label')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(label)
						])),
					A2(
					$elm$html$Html$strong,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(value)
						]))
				]));
	});
var $author$project$Main$viewStats = function (stats) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('stats')
			]),
		_List_fromArray(
			[
				A2(
				$author$project$Main$statPill,
				'Jogos',
				$elm$core$String$fromInt(stats.F)),
				A2(
				$author$project$Main$statPill,
				'Vitórias',
				$elm$core$String$fromInt(stats.T)),
				A2(
				$author$project$Main$statPill,
				'Sequência diária',
				$elm$core$String$fromInt(stats.O))
			]));
};
var $author$project$Main$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('app')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$header,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('topbar')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h1,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Super '),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('accent')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Sudoku')
									]))
							])),
						$author$project$Main$viewStats(model.u)
					])),
				A2(
				$elm$html$Html$main_,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('layout')
					]),
				_List_fromArray(
					[
						$author$project$Main$viewSetup(model),
						A2(
						$elm$html$Html$section,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('stage')
							]),
						_List_fromArray(
							[
								$author$project$Main$viewStage(model)
							])),
						$author$project$Main$viewSide(model)
					])),
				A2(
				$elm$html$Html$footer,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('footer')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Lógica em Elm + Prolog (CLP(FD)). Atalhos: 1–9, setas, Backspace, N (notas), A (auto-notas), Z/Y (desfazer/refazer), H (dica).')
					]))
			]));
};
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Variant$range = F2(
	function (a, b) {
		return A2($elm$core$List$range, a, b);
	});
var $author$project$Variant$cols = A2(
	$elm$core$List$map,
	function (c) {
		return A2(
			$elm$core$List$map,
			function (r) {
				return (r * 9) + c;
			},
			A2($author$project$Variant$range, 0, 8));
	},
	A2($author$project$Variant$range, 0, 8));
var $author$project$Variant$rows = A2(
	$elm$core$List$map,
	function (r) {
		return A2(
			$elm$core$List$map,
			function (c) {
				return (r * 9) + c;
			},
			A2($author$project$Variant$range, 0, 8));
	},
	A2($author$project$Variant$range, 0, 8));
var $author$project$Variant$square = F2(
	function (r0, c0) {
		return A2(
			$elm$core$List$concatMap,
			function (dr) {
				return A2(
					$elm$core$List$map,
					function (dc) {
						return (((r0 + dr) * 9) + c0) + dc;
					},
					A2($author$project$Variant$range, 0, 2));
			},
			A2($author$project$Variant$range, 0, 2));
	});
var $author$project$Variant$boxes = A2(
	$elm$core$List$map,
	function (b) {
		return A2(
			$author$project$Variant$square,
			((b / 3) | 0) * 3,
			A2($elm$core$Basics$modBy, 3, b) * 3);
	},
	A2($author$project$Variant$range, 0, 8));
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Set$remove = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$remove, key, dict);
	});
var $author$project$Variant$windows = A2(
	$elm$core$List$map,
	function (_v0) {
		var r = _v0.a;
		var c = _v0.b;
		return A2($author$project$Variant$square, r, c);
	},
	_List_fromArray(
		[
			_Utils_Tuple2(1, 1),
			_Utils_Tuple2(1, 5),
			_Utils_Tuple2(5, 1),
			_Utils_Tuple2(5, 5)
		]));
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{f: jsArray, h: nodeList, e: nodeListSize});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $author$project$Variant$diagonals = _List_fromArray(
	[
		A2(
		$elm$core$List$map,
		function (k) {
			return k * 10;
		},
		A2($author$project$Variant$range, 0, 8)),
		A2(
		$elm$core$List$map,
		function (k) {
			return k * 8;
		},
		A2($author$project$Variant$range, 1, 9))
	]);
var $author$project$Variant$offsets = F2(
	function (moves, i) {
		return A2(
			$elm$core$List$filterMap,
			function (_v0) {
				var dr = _v0.a;
				var dc = _v0.b;
				var r = $author$project$Variant$row(i) + dr;
				var c = $author$project$Variant$col(i) + dc;
				return ((r >= 0) && ((r <= 8) && ((c >= 0) && (c <= 8)))) ? $elm$core$Maybe$Just((r * 9) + c) : $elm$core$Maybe$Nothing;
			},
			moves);
	});
var $author$project$Variant$kingNeighbors = $author$project$Variant$offsets(
	_List_fromArray(
		[
			_Utils_Tuple2(1, 1),
			_Utils_Tuple2(1, -1),
			_Utils_Tuple2(-1, 1),
			_Utils_Tuple2(-1, -1)
		]));
var $author$project$Variant$disjointGroups = A2(
	$elm$core$List$map,
	function (k) {
		return A2(
			$elm$core$List$concatMap,
			function (br) {
				return A2(
					$elm$core$List$map,
					function (bc) {
						return ((((br * 3) + ((k / 3) | 0)) * 9) + (bc * 3)) + A2($elm$core$Basics$modBy, 3, k);
					},
					A2($author$project$Variant$range, 0, 2));
			},
			A2($author$project$Variant$range, 0, 2));
	},
	A2($author$project$Variant$range, 0, 8));
var $author$project$Variant$knightNeighbors = $author$project$Variant$offsets(
	_List_fromArray(
		[
			_Utils_Tuple2(1, 2),
			_Utils_Tuple2(2, 1),
			_Utils_Tuple2(-1, 2),
			_Utils_Tuple2(-2, 1),
			_Utils_Tuple2(1, -2),
			_Utils_Tuple2(2, -1),
			_Utils_Tuple2(-1, -2),
			_Utils_Tuple2(-2, -1)
		]));
var $author$project$Variant$geometry = F3(
	function (rules, cages, extras) {
		var cageOf = $elm$core$Dict$fromList(
			$elm$core$List$concat(
				A2(
					$elm$core$List$indexedMap,
					F2(
						function (k, cage) {
							return A2(
								$elm$core$List$map,
								function (c) {
									return _Utils_Tuple2(c, k);
								},
								cage.bq);
						}),
					cages)));
		var has = function (r) {
			return A2($elm$core$List$member, r, rules);
		};
		var king = function (i) {
			return has(5) ? $author$project$Variant$kingNeighbors(i) : _List_Nil;
		};
		var houses = _Utils_ap(
			$author$project$Variant$rows,
			_Utils_ap(
				$author$project$Variant$cols,
				_Utils_ap(
					$author$project$Variant$boxes,
					_Utils_ap(
						has(0) ? $author$project$Variant$diagonals : _List_Nil,
						_Utils_ap(
							has(1) ? $author$project$Variant$windows : _List_Nil,
							has(6) ? $author$project$Variant$disjointGroups : _List_Nil)))));
		var groups = _Utils_ap(
			houses,
			A2(
				$elm$core$List$map,
				function ($) {
					return $.bq;
				},
				cages));
		var groupPeers = function (i) {
			return $elm$core$List$concat(
				A2(
					$elm$core$List$filter,
					$elm$core$List$member(i),
					groups));
		};
		var knight = function (i) {
			return has(2) ? $author$project$Variant$knightNeighbors(i) : _List_Nil;
		};
		var peerSet = function (i) {
			return A2(
				$elm$core$Set$remove,
				i,
				$elm$core$Set$fromList(
					_Utils_ap(
						groupPeers(i),
						_Utils_ap(
							knight(i),
							king(i)))));
		};
		return {
			aQ: $elm$core$Array$fromList(cages),
			bv: A2($elm$core$Array$initialize, 81, peerSet),
			aW: rules,
			aZ: cageOf,
			a$: extras,
			a1: houses
		};
	});
var $author$project$Board$fromPuzzle = function (puzzle) {
	return $elm$core$Array$fromList(
		A2(
			$elm$core$List$map,
			function (v) {
				return {aS: v > 0, bu: $elm$core$Set$empty, as: v};
			},
			puzzle));
};
var $author$project$Game$startingTime = function (puzzle) {
	var empties = $elm$core$List$length(
		A2(
			$elm$core$List$filter,
			$elm$core$Basics$eq(0),
			puzzle.by));
	return 60 + (empties * (4 + (3 * puzzle.bA.aq)));
};
var $author$project$Game$new = F2(
	function (mode, puzzle) {
		return {
			_: A3($author$project$Variant$geometry, puzzle.aW, puzzle.aQ, puzzle.a$),
			C: mode,
			D: _List_Nil,
			b: $author$project$Board$fromPuzzle(puzzle.by),
			V: 0,
			K: 3,
			E: 0,
			o: $elm$core$Set$empty,
			L: _List_Nil,
			v: puzzle,
			k: $author$project$Game$Playing,
			P: 0,
			ah: 0,
			n: $author$project$Game$startingTime(puzzle),
			al: 0,
			aw: 0,
			ax: 0,
			am: -100
		};
	});
var $author$project$Game$redo = function (game) {
	var _v0 = game.L;
	if (_v0.b) {
		var next = _v0.a;
		var rest = _v0.b;
		return _Utils_eq(game.k, $author$project$Game$Playing) ? _Utils_update(
			game,
			{
				D: A2($elm$core$List$cons, game.b, game.D),
				b: next,
				L: rest
			}) : game;
	} else {
		return game;
	}
};
var $author$project$Game$Lost = function (a) {
	return {$: 2, a: a};
};
var $author$project$Game$tick = function (game) {
	var _v0 = game.k;
	if (!_v0.$) {
		var g = _Utils_update(
			game,
			{P: game.P + 1});
		var _v1 = game.C;
		if (_v1 === 2) {
			return (g.n <= 1) ? _Utils_update(
				g,
				{
					k: $author$project$Game$Lost('O tempo acabou!'),
					n: 0
				}) : _Utils_update(
				g,
				{n: g.n - 1});
		} else {
			return g;
		}
	} else {
		return game;
	}
};
var $elm$core$String$trim = _String_trim;
var $author$project$Game$undo = function (game) {
	var _v0 = game.D;
	if (_v0.b) {
		var prev = _v0.a;
		var rest = _v0.b;
		return _Utils_eq(game.k, $author$project$Game$Playing) ? _Utils_update(
			game,
			{
				D: rest,
				b: prev,
				L: A2($elm$core$List$cons, game.b, game.L)
			}) : game;
	} else {
		return game;
	}
};
var $elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var $elm$core$Dict$isEmpty = function (dict) {
	if (dict.$ === -2) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Set$isEmpty = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$isEmpty(dict);
};
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$setHelp = F4(
	function (shift, index, value, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
		if (!_v0.$) {
			var subTree = _v0.a;
			var newSub = A4($elm$core$Array$setHelp, shift - $elm$core$Array$shiftStep, index, value, subTree);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$SubTree(newSub),
				tree);
		} else {
			var values = _v0.a;
			var newLeaf = A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, values);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$Leaf(newLeaf),
				tree);
		}
	});
var $elm$core$Array$set = F3(
	function (index, value, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? array : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			tree,
			A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, tail)) : A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A4($elm$core$Array$setHelp, startShift, index, value, tree),
			tail));
	});
var $author$project$Board$clearCell = F2(
	function (i, board) {
		var c = A2($author$project$Board$cell, i, board);
		return c.aS ? board : A3(
			$elm$core$Array$set,
			i,
			_Utils_update(
				c,
				{bu: $elm$core$Set$empty, as: 0}),
			board);
	});
var $author$project$Game$pushHistory = function (game) {
	return _Utils_update(
		game,
		{
			D: A2(
				$elm$core$List$take,
				200,
				A2($elm$core$List$cons, game.b, game.D)),
			L: _List_Nil
		});
};
var $author$project$Game$clear = F2(
	function (i, game) {
		var c = A2($author$project$Board$cell, i, game.b);
		if ((!_Utils_eq(game.k, $author$project$Game$Playing)) || (c.aS || ((!c.as) && $elm$core$Set$isEmpty(c.bu)))) {
			return game;
		} else {
			var g = $author$project$Game$pushHistory(game);
			return _Utils_update(
				g,
				{
					b: A2($author$project$Board$clearCell, i, game.b),
					o: A2($elm$core$Set$remove, i, game.o)
				});
		}
	});
var $author$project$Game$basePoints = function (game) {
	return (10 * game.v.bA.aq) + (5 * $elm$core$List$length(game.v.aW));
};
var $author$project$Game$mistake = F2(
	function (i, game) {
		var g = _Utils_update(
			game,
			{
				V: 0,
				E: A2(
					$elm$core$Basics$max,
					0,
					game.E - $author$project$Game$basePoints(game)),
				o: A2($elm$core$Set$insert, i, game.o),
				ah: game.ah + 1
			});
		var _v0 = game.C;
		switch (_v0) {
			case 1:
				return (g.K <= 1) ? _Utils_update(
					g,
					{
						K: 0,
						k: $author$project$Game$Lost('Suas vidas acabaram!')
					}) : _Utils_update(
					g,
					{K: g.K - 1});
			case 2:
				return (g.n <= 20) ? _Utils_update(
					g,
					{
						k: $author$project$Game$Lost('O tempo acabou!'),
						n: 0
					}) : _Utils_update(
					g,
					{n: g.n - 20});
			default:
				return g;
		}
	});
var $author$project$Game$Won = {$: 1};
var $author$project$Board$isFull = function (board) {
	return A2(
		$elm$core$List$all,
		function (c) {
			return !(!c.as);
		},
		$elm$core$Array$toList(board));
};
var $author$project$Game$finalBonus = function (game) {
	var timePenalty = (game.P / 2) | 0;
	var livesBonus = (game.C === 1) ? (game.K * 150) : 0;
	var clockBonus = (game.C === 2) ? (game.n * 3) : 0;
	var variety = 1 + $elm$core$List$length(game.v.aW);
	var level = game.v.bA.aq;
	var base = (300 * level) * variety;
	return A2(
		$elm$core$Basics$max,
		0,
		((((base - timePenalty) - (50 * game.ah)) - ($author$project$Game$hintPenalty(game) * game.aw)) + livesBonus) + clockBonus);
};
var $author$project$Board$values = function (board) {
	return A2(
		$elm$core$List$map,
		function ($) {
			return $.as;
		},
		$elm$core$Array$toList(board));
};
var $author$project$Board$matchesSolution = F2(
	function (solution, board) {
		return _Utils_eq(
			$author$project$Board$values(board),
			$elm$core$Array$toList(solution));
	});
var $author$project$Game$checkWin = function (game) {
	if ($author$project$Board$isFull(game.b) && A2($author$project$Board$matchesSolution, game.v.bc, game.b)) {
		var bonus = $author$project$Game$finalBonus(game);
		return _Utils_update(
			game,
			{E: game.E + bonus, k: $author$project$Game$Won, ax: bonus});
	} else {
		return game;
	}
};
var $author$project$Board$setValue = F4(
	function (geo, i, digit, board) {
		var c = A2($author$project$Board$cell, i, board);
		var placed = A3(
			$elm$core$Array$set,
			i,
			_Utils_update(
				c,
				{bu: $elm$core$Set$empty, as: digit}),
			board);
		return c.aS ? board : A3(
			$elm$core$Set$foldl,
			F2(
				function (j, b) {
					var pc = A2($author$project$Board$cell, j, b);
					return A3(
						$elm$core$Array$set,
						j,
						_Utils_update(
							pc,
							{
								bu: A2($elm$core$Set$remove, digit, pc.bu)
							}),
						b);
				}),
			placed,
			A2($author$project$Board$peersOf, geo, i));
	});
var $author$project$Game$solutionAt = F2(
	function (game, i) {
		return A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Array$get, i, game.v.bc));
	});
var $author$project$Game$comboWindow = 15;
var $author$project$Game$place = F3(
	function (i, digit, game) {
		var correct = _Utils_eq(
			A2($author$project$Game$solutionAt, game, i),
			digit);
		var board = A4($author$project$Board$setValue, game._, i, digit, game.b);
		var _v0 = game.C;
		if (!_v0) {
			return $author$project$Game$checkWin(
				_Utils_update(
					game,
					{
						b: board,
						o: A2($elm$core$Set$remove, i, game.o)
					}));
		} else {
			if (correct) {
				var bonusTime = (game.C === 2) ? (5 + (2 * game.v.bA.aq)) : 0;
				var combo = (_Utils_cmp(game.P - game.am, $author$project$Game$comboWindow) < 1) ? (game.V + 1) : 1;
				var points = $author$project$Game$basePoints(game) * A2($elm$core$Basics$min, combo, 8);
				return $author$project$Game$checkWin(
					_Utils_update(
						game,
						{
							b: board,
							V: combo,
							E: game.E + points,
							o: A2($elm$core$Set$remove, i, game.o),
							n: game.n + bonusTime,
							al: A2($elm$core$Basics$max, combo, game.al),
							am: game.P
						}));
			} else {
				return A2(
					$author$project$Game$mistake,
					i,
					_Utils_update(
						game,
						{b: board}));
			}
		}
	});
var $author$project$Board$toggleNote = F3(
	function (i, digit, board) {
		var c = A2($author$project$Board$cell, i, board);
		return (c.aS || (!(!c.as))) ? board : (A2($elm$core$Set$member, digit, c.bu) ? A3(
			$elm$core$Array$set,
			i,
			_Utils_update(
				c,
				{
					bu: A2($elm$core$Set$remove, digit, c.bu)
				}),
			board) : A3(
			$elm$core$Array$set,
			i,
			_Utils_update(
				c,
				{
					bu: A2($elm$core$Set$insert, digit, c.bu)
				}),
			board));
	});
var $author$project$Game$input = F4(
	function (noteMode, i, digit, game) {
		var c = A2($author$project$Board$cell, i, game.b);
		if ((!_Utils_eq(game.k, $author$project$Game$Playing)) || c.aS) {
			return game;
		} else {
			if (noteMode) {
				if (!(!c.as)) {
					return game;
				} else {
					var g = $author$project$Game$pushHistory(game);
					return _Utils_update(
						g,
						{
							b: A3($author$project$Board$toggleNote, i, digit, game.b)
						});
				}
			} else {
				if (_Utils_eq(c.as, digit)) {
					return A2($author$project$Game$clear, i, game);
				} else {
					return A3(
						$author$project$Game$place,
						i,
						digit,
						$author$project$Game$pushHistory(game));
				}
			}
		}
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$core$Set$union = F2(
	function (_v0, _v1) {
		var dict1 = _v0;
		var dict2 = _v1;
		return A2($elm$core$Dict$union, dict1, dict2);
	});
var $author$project$Main$Failed = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$GotHint = function (a) {
	return {$: 16, a: a};
};
var $author$project$Main$Playing = function (a) {
	return {$: 3, a: a};
};
var $author$project$Main$saveStats = _Platform_outgoingPort('saveStats', $elm$core$Basics$identity);
var $elm$json$Json$Encode$int = _Json_wrap;
var $elm$json$Json$Encode$dict = F3(
	function (toKey, toValue, dictionary) {
		return _Json_wrap(
			A3(
				$elm$core$Dict$foldl,
				F3(
					function (key, value, obj) {
						return A3(
							_Json_addField,
							toKey(key),
							toValue(value),
							obj);
					}),
				_Json_emptyObject(0),
				dictionary));
	});
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $author$project$Main$encodeStats = function (s) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'played',
				$elm$json$Json$Encode$int(s.F)),
				_Utils_Tuple2(
				'won',
				$elm$json$Json$Encode$int(s.T)),
				_Utils_Tuple2(
				'best',
				A3($elm$json$Json$Encode$dict, $elm$core$Basics$identity, $elm$json$Json$Encode$int, s.U)),
				_Utils_Tuple2(
				'streak',
				$elm$json$Json$Encode$int(s.O)),
				_Utils_Tuple2(
				'lastDaily',
				$elm$json$Json$Encode$int(s.R))
			]));
};
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $author$project$Main$recordResult = F3(
	function (model, game, stats) {
		var _v0 = game.k;
		if (_v0.$ === 1) {
			var _v1 = (model.ad && (!_Utils_eq(stats.R, model.r))) ? (_Utils_eq(stats.R, model.r - 1) ? _Utils_Tuple2(stats.O + 1, model.r) : _Utils_Tuple2(1, model.r)) : _Utils_Tuple2(stats.O, stats.R);
			var streak = _v1.a;
			var lastDaily = _v1.b;
			var key = $author$project$Main$recordKey(game);
			var best = A3(
				$elm$core$Dict$update,
				key,
				function (old) {
					return $elm$core$Maybe$Just(
						A2(
							$elm$core$Basics$max,
							game.E,
							A2($elm$core$Maybe$withDefault, 0, old)));
				},
				stats.U);
			return _Utils_update(
				stats,
				{T: stats.T + 1, U: best, O: streak, R: lastDaily});
		} else {
			return stats;
		}
	});
var $author$project$Main$afterMove = F2(
	function (model, screen) {
		if (screen.$ === 3) {
			var game = screen.a;
			if ((!_Utils_eq(game.k, $author$project$Game$Playing)) && (!model.ai)) {
				var stats = A3($author$project$Main$recordResult, model, game, model.u);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: $author$project$Main$NoHint, u: stats, c: screen, ai: true}),
					$author$project$Main$saveStats(
						$author$project$Main$encodeStats(stats)));
			} else {
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{c: screen}),
					$elm$core$Platform$Cmd$none);
			}
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{c: screen}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Main$mapScreen = F2(
	function (f, screen) {
		if (screen.$ === 3) {
			var g = screen.a;
			return $author$project$Main$Playing(
				f(g));
		} else {
			var other = screen;
			return other;
		}
	});
var $author$project$Main$mapGame = F2(
	function (model, f) {
		return A2(
			$author$project$Main$afterMove,
			model,
			A2($author$project$Main$mapScreen, f, model.c));
	});
var $author$project$Main$HintNote = function (a) {
	return {$: 3, a: a};
};
var $author$project$Main$HintLoading = {$: 1};
var $author$project$Main$clearStaleHint = function (hint) {
	if (hint.$ === 1) {
		return $author$project$Main$HintLoading;
	} else {
		return $author$project$Main$NoHint;
	}
};
var $author$project$Main$withGame = F2(
	function (model, f) {
		var _v0 = model.j;
		if (!_v0.$) {
			var i = _v0.a;
			return A2(
				$author$project$Main$afterMove,
				_Utils_update(
					model,
					{
						a: $author$project$Main$clearStaleHint(model.a)
					}),
				A2(
					$author$project$Main$mapScreen,
					f(i),
					model.c));
		} else {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Main$GotPuzzle = function (a) {
	return {$: 6, a: a};
};
var $author$project$Main$HintShown = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $author$project$Board$applyEliminations = F2(
	function (elims, board) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, b) {
					var i = _v0.a;
					var d = _v0.b;
					var c = A2($author$project$Board$cell, i, b);
					return A3(
						$elm$core$Array$set,
						i,
						_Utils_update(
							c,
							{
								bu: A2($elm$core$Set$remove, d, c.bu)
							}),
						b);
				}),
			board,
			elims);
	});
var $author$project$Game$applyHint = F2(
	function (steps, game) {
		if (!_Utils_eq(game.k, $author$project$Game$Playing)) {
			return game;
		} else {
			var placement = $elm$core$List$head(
				A2(
					$elm$core$List$filterMap,
					function ($) {
						return $.bG;
					},
					steps));
			var elims = A2(
				$elm$core$List$concatMap,
				function ($) {
					return $.bO;
				},
				steps);
			var g = $author$project$Game$pushHistory(game);
			var board1 = A2($author$project$Board$applyEliminations, elims, g.b);
			if (!placement.$) {
				var _v1 = placement.a;
				var i = _v1.a;
				var d = _v1.b;
				return $author$project$Game$checkWin(
					_Utils_update(
						g,
						{
							b: A4($author$project$Board$setValue, g._, i, d, board1),
							V: 0,
							o: A2($elm$core$Set$remove, i, g.o)
						}));
			} else {
				return _Utils_update(
					g,
					{b: board1});
			}
		}
	});
var $author$project$Board$orthogonal = function (i) {
	return A2(
		$elm$core$List$filterMap,
		function (_v0) {
			var dr = _v0.a;
			var dc = _v0.b;
			var r = $author$project$Variant$row(i) + dr;
			var c = $author$project$Variant$col(i) + dc;
			return ((r >= 0) && ((r <= 8) && ((c >= 0) && (c <= 8)))) ? $elm$core$Maybe$Just((r * 9) + c) : $elm$core$Maybe$Nothing;
		},
		_List_fromArray(
			[
				_Utils_Tuple2(-1, 0),
				_Utils_Tuple2(1, 0),
				_Utils_Tuple2(0, -1),
				_Utils_Tuple2(0, 1)
			]));
};
var $author$project$Board$candidates = F4(
	function (geo, parity, board, i) {
		if (!(!A2($author$project$Board$valueAt, board, i))) {
			return $elm$core$Set$empty;
		} else {
			var localOk = function (d) {
				var look = function (j) {
					return _Utils_eq(j, i) ? $elm$core$Maybe$Just(d) : A2($author$project$Board$lookup, board, j);
				};
				return A2(
					$elm$core$List$all,
					function (e) {
						return (!A2($elm$core$List$member, i, e.bq)) || $elm$core$List$isEmpty(
							A2($author$project$Local$violations, look, e));
					},
					geo.a$) && ((!A2($elm$core$List$member, 7, geo.aW)) || A2(
					$elm$core$List$all,
					function (j) {
						return (!_Utils_eq(
							A2($author$project$Board$lookup, board, j),
							$elm$core$Maybe$Just(d - 1))) && (!_Utils_eq(
							A2($author$project$Board$lookup, board, j),
							$elm$core$Maybe$Just(d + 1)));
					},
					$author$project$Board$orthogonal(i)));
			};
			var cageOk = function (d) {
				var _v0 = A2(
					$elm$core$Maybe$andThen,
					function (k) {
						return A2($elm$core$Array$get, k, geo.aQ);
					},
					A2($elm$core$Dict$get, i, geo.aZ));
				if (_v0.$ === 1) {
					return true;
				} else {
					var cage = _v0.a;
					var emptyOthers = $elm$core$List$length(
						A2(
							$elm$core$List$filter,
							function (j) {
								return (!_Utils_eq(j, i)) && (!A2($author$project$Board$valueAt, board, j));
							},
							cage.bq));
					var filled = $elm$core$List$sum(
						A2(
							$elm$core$List$map,
							$author$project$Board$valueAt(board),
							cage.bq));
					return _Utils_cmp((filled + d) + emptyOthers, cage.bh) < 1;
				}
			};
			var used = $elm$core$Set$fromList(
				A2(
					$elm$core$List$map,
					$author$project$Board$valueAt(board),
					$elm$core$Set$toList(
						A2($author$project$Board$peersOf, geo, i))));
			var mark = A2(
				$elm$core$Maybe$withDefault,
				0,
				A2($elm$core$Array$get, i, parity));
			return $elm$core$Set$fromList(
				A2(
					$elm$core$List$filter,
					function (d) {
						return (!A2($elm$core$Set$member, d, used)) && (A2($author$project$Board$parityAllows, mark, d) && (cageOk(d) && localOk(d)));
					},
					A2($elm$core$List$range, 1, 9)));
		}
	});
var $elm$core$Elm$JsArray$indexedMap = _JsArray_indexedMap;
var $elm$core$Array$indexedMap = F2(
	function (func, _v0) {
		var len = _v0.a;
		var tree = _v0.c;
		var tail = _v0.d;
		var initialBuilder = {
			f: A3(
				$elm$core$Elm$JsArray$indexedMap,
				func,
				$elm$core$Array$tailIndex(len),
				tail),
			h: _List_Nil,
			e: 0
		};
		var helper = F2(
			function (node, builder) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldl, helper, builder, subTree);
				} else {
					var leaf = node.a;
					var offset = builder.e * $elm$core$Array$branchFactor;
					var mappedLeaf = $elm$core$Array$Leaf(
						A3($elm$core$Elm$JsArray$indexedMap, func, offset, leaf));
					return {
						f: builder.f,
						h: A2($elm$core$List$cons, mappedLeaf, builder.h),
						e: builder.e + 1
					};
				}
			});
		return A2(
			$elm$core$Array$builderToArray,
			true,
			A3($elm$core$Elm$JsArray$foldl, helper, initialBuilder, tree));
	});
var $author$project$Board$autoNotes = F3(
	function (geo, parity, board) {
		return A2(
			$elm$core$Array$indexedMap,
			F2(
				function (i, c) {
					return (!c.as) ? _Utils_update(
						c,
						{
							bu: A4($author$project$Board$candidates, geo, parity, board, i)
						}) : c;
				}),
			board);
	});
var $author$project$Game$fillNotes = function (game) {
	if (!_Utils_eq(game.k, $author$project$Game$Playing)) {
		return game;
	} else {
		var g = $author$project$Game$pushHistory(game);
		return _Utils_update(
			g,
			{
				b: A3($author$project$Board$autoNotes, game._, game.v.a3, game.b)
			});
	}
};
var $author$project$Main$chargeHint = function (model) {
	return _Utils_update(
		model,
		{
			c: A2(
				$author$project$Main$mapScreen,
				function (g) {
					return _Utils_update(
						g,
						{
							E: A2(
								$elm$core$Basics$max,
								0,
								g.E - $author$project$Game$hintPenalty(g)),
							aw: g.aw + 1
						});
				},
				model.c)
		});
};
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $elm$http$Http$Request = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$State = F2(
	function (reqs, subs) {
		return {aM: reqs, aN: subs};
	});
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$http$Http$init = $elm$core$Task$succeed(
	A2($elm$http$Http$State, $elm$core$Dict$empty, _List_Nil));
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Maybe$isJust = function (maybe) {
	if (!maybe.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$http$Http$BadUrl_ = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$Sending = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$Timeout_ = {$: 1};
var $elm$http$Http$Receiving = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $elm$http$Http$NetworkError_ = {$: 2};
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$http$Http$updateReqs = F3(
	function (router, cmds, reqs) {
		updateReqs:
		while (true) {
			if (!cmds.b) {
				return $elm$core$Task$succeed(reqs);
			} else {
				var cmd = cmds.a;
				var otherCmds = cmds.b;
				if (!cmd.$) {
					var tracker = cmd.a;
					var _v2 = A2($elm$core$Dict$get, tracker, reqs);
					if (_v2.$ === 1) {
						var $temp$router = router,
							$temp$cmds = otherCmds,
							$temp$reqs = reqs;
						router = $temp$router;
						cmds = $temp$cmds;
						reqs = $temp$reqs;
						continue updateReqs;
					} else {
						var pid = _v2.a;
						return A2(
							$elm$core$Task$andThen,
							function (_v3) {
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A2($elm$core$Dict$remove, tracker, reqs));
							},
							$elm$core$Process$kill(pid));
					}
				} else {
					var req = cmd.a;
					return A2(
						$elm$core$Task$andThen,
						function (pid) {
							var _v4 = req.x;
							if (_v4.$ === 1) {
								return A3($elm$http$Http$updateReqs, router, otherCmds, reqs);
							} else {
								var tracker = _v4.a;
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A3($elm$core$Dict$insert, tracker, pid, reqs));
							}
						},
						$elm$core$Process$spawn(
							A3(
								_Http_toTask,
								router,
								$elm$core$Platform$sendToApp(router),
								req)));
				}
			}
		}
	});
var $elm$http$Http$onEffects = F4(
	function (router, cmds, subs, state) {
		return A2(
			$elm$core$Task$andThen,
			function (reqs) {
				return $elm$core$Task$succeed(
					A2($elm$http$Http$State, reqs, subs));
			},
			A3($elm$http$Http$updateReqs, router, cmds, state.aM));
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$http$Http$maybeSend = F4(
	function (router, desiredTracker, progress, _v0) {
		var actualTracker = _v0.a;
		var toMsg = _v0.b;
		return _Utils_eq(desiredTracker, actualTracker) ? $elm$core$Maybe$Just(
			A2(
				$elm$core$Platform$sendToApp,
				router,
				toMsg(progress))) : $elm$core$Maybe$Nothing;
	});
var $elm$http$Http$onSelfMsg = F3(
	function (router, _v0, state) {
		var tracker = _v0.a;
		var progress = _v0.b;
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$filterMap,
					A3($elm$http$Http$maybeSend, router, tracker, progress),
					state.aN)));
	});
var $elm$http$Http$Cancel = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$cmdMap = F2(
	function (func, cmd) {
		if (!cmd.$) {
			var tracker = cmd.a;
			return $elm$http$Http$Cancel(tracker);
		} else {
			var r = cmd.a;
			return $elm$http$Http$Request(
				{
					aG: r.aG,
					aH: r.aH,
					a_: A2(_Http_mapExpect, func, r.a_),
					p: r.p,
					l: r.l,
					q: r.q,
					x: r.x,
					Z: r.Z
				});
		}
	});
var $elm$http$Http$MySub = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$http$Http$subMap = F2(
	function (func, _v0) {
		var tracker = _v0.a;
		var toMsg = _v0.b;
		return A2(
			$elm$http$Http$MySub,
			tracker,
			A2($elm$core$Basics$composeR, toMsg, func));
	});
_Platform_effectManagers['Http'] = _Platform_createManager($elm$http$Http$init, $elm$http$Http$onEffects, $elm$http$Http$onSelfMsg, $elm$http$Http$cmdMap, $elm$http$Http$subMap);
var $elm$http$Http$command = _Platform_leaf('Http');
var $elm$http$Http$subscription = _Platform_leaf('Http');
var $elm$http$Http$request = function (r) {
	return $elm$http$Http$command(
		$elm$http$Http$Request(
			{aG: r.aG, aH: r.aH, a_: r.a_, p: r.p, l: r.l, q: r.q, x: r.x, Z: false}));
};
var $elm$http$Http$post = function (r) {
	return $elm$http$Http$request(
		{aG: r.aG, aH: r.aH, a_: r.a_, p: 'POST', l: _List_Nil, q: $elm$core$Maybe$Nothing, x: $elm$core$Maybe$Nothing});
};
var $elm$json$Json$Encode$array = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$Array$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Local$encode = function (extra) {
	var _v0 = function () {
		var _v1 = extra.ak;
		switch (_v1) {
			case 0:
				return _Utils_Tuple2('thermo', $elm$json$Json$Encode$null);
			case 1:
				return _Utils_Tuple2('arrow', $elm$json$Json$Encode$null);
			case 2:
				return _Utils_Tuple2(
					'kropki',
					$elm$json$Json$Encode$string('white'));
			case 3:
				return _Utils_Tuple2(
					'kropki',
					$elm$json$Json$Encode$string('black'));
			case 4:
				return _Utils_Tuple2(
					'xv',
					$elm$json$Json$Encode$int(10));
			case 5:
				return _Utils_Tuple2(
					'xv',
					$elm$json$Json$Encode$int(5));
			case 6:
				return _Utils_Tuple2('whisper', $elm$json$Json$Encode$null);
			case 7:
				return _Utils_Tuple2('renban', $elm$json$Json$Encode$null);
			case 8:
				return _Utils_Tuple2('palindrome', $elm$json$Json$Encode$null);
			default:
				return _Utils_Tuple2('between', $elm$json$Json$Encode$null);
		}
	}();
	var t = _v0.a;
	var param = _v0.b;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'type',
				$elm$json$Json$Encode$string(t)),
				_Utils_Tuple2(
				'cells',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$int, extra.bq)),
				_Utils_Tuple2('param', param)
			]));
};
var $elm$http$Http$jsonBody = function (value) {
	return A2(
		_Http_pair,
		'application/json',
		A2($elm$json$Json$Encode$encode, 0, value));
};
var $author$project$Api$encodeCage = function (cage) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'sum',
				$elm$json$Json$Encode$int(cage.bh)),
				_Utils_Tuple2(
				'cells',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$int, cage.bq))
			]));
};
var $elm$http$Http$BadUrl = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$BadBody = function (a) {
	return {$: 4, a: a};
};
var $elm$http$Http$Timeout = {$: 1};
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (!result.$) {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $elm$http$Http$BadStatus = function (a) {
	return {$: 3, a: a};
};
var $author$project$Api$HttpError = function (a) {
	return {$: 0, a: a};
};
var $author$project$Api$ServerError = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$NetworkError = {$: 2};
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$http$Http$expectStringResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'',
			$elm$core$Basics$identity,
			A2($elm$core$Basics$composeR, toResult, toMsg));
	});
var $author$project$Api$expectJson = F2(
	function (toMsg, decoder) {
		return A2(
			$elm$http$Http$expectStringResponse,
			toMsg,
			function (response) {
				switch (response.$) {
					case 4:
						var body = response.b;
						return A2(
							$elm$core$Result$mapError,
							A2(
								$elm$core$Basics$composeL,
								A2($elm$core$Basics$composeL, $author$project$Api$HttpError, $elm$http$Http$BadBody),
								$elm$json$Json$Decode$errorToString),
							A2($elm$json$Json$Decode$decodeString, decoder, body));
					case 3:
						var meta = response.a;
						var body = response.b;
						var _v1 = A2(
							$elm$json$Json$Decode$decodeString,
							A2($elm$json$Json$Decode$field, 'error', $elm$json$Json$Decode$string),
							body);
						if (!_v1.$) {
							var msg = _v1.a;
							return $elm$core$Result$Err(
								$author$project$Api$ServerError(msg));
						} else {
							return $elm$core$Result$Err(
								$author$project$Api$HttpError(
									$elm$http$Http$BadStatus(meta.bJ)));
						}
					case 0:
						var u = response.a;
						return $elm$core$Result$Err(
							$author$project$Api$HttpError(
								$elm$http$Http$BadUrl(u)));
					case 1:
						return $elm$core$Result$Err(
							$author$project$Api$HttpError($elm$http$Http$Timeout));
					default:
						return $elm$core$Result$Err(
							$author$project$Api$HttpError($elm$http$Http$NetworkError));
				}
			});
	});
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $author$project$Api$HintSteps = function (a) {
	return {$: 2, a: a};
};
var $author$project$Api$HintErrors = function (a) {
	return {$: 1, a: a};
};
var $author$project$Api$HintSolved = {$: 0};
var $elm$json$Json$Decode$map8 = _Json_map8;
var $author$project$Api$HintStep = F8(
	function (technique, name, level, message, focus, unit, eliminations, placement) {
		return {aJ: name, bn: unit, bs: focus, aq: level, bE: message, bG: placement, bH: technique, bO: eliminations};
	});
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$nullable = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				$elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder)
			]));
};
var $author$project$Api$cellDigit = A3(
	$elm$json$Json$Decode$map2,
	$elm$core$Tuple$pair,
	A2($elm$json$Json$Decode$field, 'cell', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'digit', $elm$json$Json$Decode$int));
var $author$project$Api$stepDecoder = A9(
	$elm$json$Json$Decode$map8,
	$author$project$Api$HintStep,
	A2($elm$json$Json$Decode$field, 'technique', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'level', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'message', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$field,
		'focus',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$int)),
	A2(
		$elm$json$Json$Decode$field,
		'unit',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$int)),
	A2(
		$elm$json$Json$Decode$field,
		'eliminations',
		$elm$json$Json$Decode$list($author$project$Api$cellDigit)),
	A2(
		$elm$json$Json$Decode$field,
		'placement',
		$elm$json$Json$Decode$nullable($author$project$Api$cellDigit)));
var $author$project$Api$hintDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (status) {
		switch (status) {
			case 'solved':
				return $elm$json$Json$Decode$succeed($author$project$Api$HintSolved);
			case 'errors':
				return A2(
					$elm$json$Json$Decode$map,
					$author$project$Api$HintErrors,
					A2(
						$elm$json$Json$Decode$field,
						'cells',
						$elm$json$Json$Decode$list($elm$json$Json$Decode$int)));
			case 'steps':
				return A2(
					$elm$json$Json$Decode$map,
					$author$project$Api$HintSteps,
					A2(
						$elm$json$Json$Decode$field,
						'steps',
						$elm$json$Json$Decode$list($author$project$Api$stepDecoder)));
			default:
				var other = status;
				return $elm$json$Json$Decode$fail('status desconhecido: ' + other);
		}
	},
	A2($elm$json$Json$Decode$field, 'status', $elm$json$Json$Decode$string));
var $author$project$Api$requestHint = F3(
	function (puzzle, board, toMsg) {
		return $elm$http$Http$post(
			{
				aG: '/api/hint',
				aH: $elm$http$Http$jsonBody(
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'rules',
								A2(
									$elm$json$Json$Encode$list,
									A2($elm$core$Basics$composeL, $elm$json$Json$Encode$string, $author$project$Variant$ruleId),
									puzzle.aW)),
								_Utils_Tuple2(
								'cages',
								A2($elm$json$Json$Encode$list, $author$project$Api$encodeCage, puzzle.aQ)),
								_Utils_Tuple2(
								'parity',
								A2($elm$json$Json$Encode$array, $elm$json$Json$Encode$int, puzzle.a3)),
								_Utils_Tuple2(
								'extras',
								A2($elm$json$Json$Encode$list, $author$project$Local$encode, puzzle.a$)),
								_Utils_Tuple2(
								'board',
								A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$int, board)),
								_Utils_Tuple2(
								'solution',
								A2($elm$json$Json$Encode$array, $elm$json$Json$Encode$int, puzzle.bc))
							]))),
				a_: A2($author$project$Api$expectJson, toMsg, $author$project$Api$hintDecoder)
			});
	});
var $author$project$Api$httpErrorToString = function (err) {
	switch (err.$) {
		case 0:
			var u = err.a;
			return 'URL inválida: ' + u;
		case 1:
			return 'O servidor demorou demais para responder.';
		case 2:
			return 'Sem conexão com o servidor Prolog. Ele está rodando?';
		case 3:
			var code = err.a;
			return 'O servidor respondeu com erro ' + ($elm$core$String$fromInt(code) + '.');
		default:
			var msg = err.a;
			return 'Resposta inesperada do servidor: ' + msg;
	}
};
var $author$project$Api$errorToString = function (error) {
	if (error.$ === 1) {
		var msg = error.a;
		return msg;
	} else {
		var err = error.a;
		return $author$project$Api$httpErrorToString(err);
	}
};
var $author$project$Api$difficultyId = function (d) {
	switch (d) {
		case 0:
			return 'facil';
		case 1:
			return 'medio';
		case 2:
			return 'dificil';
		default:
			return 'extremo';
	}
};
var $elm$json$Json$Decode$array = _Json_decodeArray;
var $author$project$Api$Puzzle = function (rules) {
	return function (difficulty) {
		return function (seed) {
			return function (givens) {
				return function (solution) {
					return function (cages) {
						return function (parity) {
							return function (extras) {
								return function (constraints) {
									return function (rating) {
										return {bl: seed, aQ: cages, aW: rules, a$: extras, by: givens, a3: parity, bA: rating, bc: solution, bI: difficulty, bM: constraints};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Api$andMap = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
var $elm$json$Json$Decode$map3 = _Json_map3;
var $author$project$Local$VSum = 5;
var $author$project$Local$XSum = 4;
var $author$project$Local$BlackDot = 3;
var $author$project$Local$WhiteDot = 2;
var $author$project$Local$ArrowLine = 1;
var $author$project$Local$RenbanLine = 7;
var $author$project$Local$ThermoLine = 0;
var $author$project$Local$BetweenLine = 9;
var $author$project$Local$WhisperLine = 6;
var $author$project$Local$PalindromeLine = 8;
var $author$project$Local$kindOf = F2(
	function (t, p) {
		var _v0 = _Utils_Tuple2(t, p);
		_v0$10:
		while (true) {
			switch (_v0.a) {
				case 'thermo':
					return $elm$core$Maybe$Just(0);
				case 'arrow':
					return $elm$core$Maybe$Just(1);
				case 'kropki':
					if (_v0.b.$ === 1) {
						switch (_v0.b.a) {
							case 'white':
								return $elm$core$Maybe$Just(2);
							case 'black':
								return $elm$core$Maybe$Just(3);
							default:
								break _v0$10;
						}
					} else {
						break _v0$10;
					}
				case 'xv':
					if (_v0.b.$ === 2) {
						switch (_v0.b.a) {
							case 10:
								return $elm$core$Maybe$Just(4);
							case 5:
								return $elm$core$Maybe$Just(5);
							default:
								break _v0$10;
						}
					} else {
						break _v0$10;
					}
				case 'whisper':
					return $elm$core$Maybe$Just(6);
				case 'renban':
					return $elm$core$Maybe$Just(7);
				case 'palindrome':
					return $elm$core$Maybe$Just(8);
				case 'between':
					return $elm$core$Maybe$Just(9);
				default:
					break _v0$10;
			}
		}
		return $elm$core$Maybe$Nothing;
	});
var $author$project$Local$NoParam = {$: 0};
var $author$project$Local$Text = function (a) {
	return {$: 1, a: a};
};
var $author$project$Local$Number = function (a) {
	return {$: 2, a: a};
};
var $author$project$Local$paramDecoder = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A2($elm$json$Json$Decode$map, $author$project$Local$Text, $elm$json$Json$Decode$string),
			A2($elm$json$Json$Decode$map, $author$project$Local$Number, $elm$json$Json$Decode$int),
			$elm$json$Json$Decode$null($author$project$Local$NoParam)
		]));
var $author$project$Local$decoder = A2(
	$elm$json$Json$Decode$andThen,
	function (_v0) {
		var t = _v0.a;
		var p = _v0.b;
		var cells = _v0.c;
		var _v1 = A2($author$project$Local$kindOf, t, p);
		if (!_v1.$) {
			var kind = _v1.a;
			return $elm$core$List$isEmpty(cells) ? $elm$json$Json$Decode$fail('regra local sem células') : $elm$json$Json$Decode$succeed(
				{ak: kind, bq: cells});
		} else {
			return $elm$json$Json$Decode$fail('regra local desconhecida: ' + t);
		}
	},
	A4(
		$elm$json$Json$Decode$map3,
		F3(
			function (t, p, cells) {
				return _Utils_Tuple3(t, p, cells);
			}),
		A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string),
		$elm$json$Json$Decode$oneOf(
			_List_fromArray(
				[
					A2($elm$json$Json$Decode$field, 'param', $author$project$Local$paramDecoder),
					$elm$json$Json$Decode$succeed($author$project$Local$NoParam)
				])),
		A2(
			$elm$json$Json$Decode$field,
			'cells',
			$elm$json$Json$Decode$list($elm$json$Json$Decode$int))));
var $author$project$Variant$ruleFromId = function (id) {
	switch (id) {
		case 'diagonal':
			return $elm$core$Maybe$Just(0);
		case 'hyper':
			return $elm$core$Maybe$Just(1);
		case 'antiknight':
			return $elm$core$Maybe$Just(2);
		case 'killer':
			return $elm$core$Maybe$Just(3);
		case 'parity':
			return $elm$core$Maybe$Just(4);
		default:
			return $elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (r) {
						return _Utils_eq(
							$author$project$Variant$ruleId(r),
							id);
					},
					$author$project$Variant$allRules));
	}
};
var $author$project$Variant$Cage = F2(
	function (sum, cells) {
		return {bh: sum, bq: cells};
	});
var $author$project$Api$cageDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Variant$Cage,
	A2($elm$json$Json$Decode$field, 'sum', $elm$json$Json$Decode$int),
	A2(
		$elm$json$Json$Decode$field,
		'cells',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$int)));
var $elm$json$Json$Decode$map4 = _Json_map4;
var $author$project$Api$Rating = F3(
	function (level, label, techniques) {
		return {bt: label, aq: level, bL: techniques};
	});
var $author$project$Api$TechniqueUse = F4(
	function (id, name, level, count) {
		return {bg: id, aJ: name, br: count, aq: level};
	});
var $author$project$Api$ratingDecoder = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Api$Rating,
	A2($elm$json$Json$Decode$field, 'level', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'label', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$field,
		'techniques',
		$elm$json$Json$Decode$list(
			A5(
				$elm$json$Json$Decode$map4,
				$author$project$Api$TechniqueUse,
				A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$string),
				A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
				A2($elm$json$Json$Decode$field, 'level', $elm$json$Json$Decode$int),
				A2($elm$json$Json$Decode$field, 'count', $elm$json$Json$Decode$int)))));
var $author$project$Api$puzzleDecoder = A2(
	$author$project$Api$andMap,
	A2($elm$json$Json$Decode$field, 'rating', $author$project$Api$ratingDecoder),
	A2(
		$author$project$Api$andMap,
		$elm$json$Json$Decode$oneOf(
			_List_fromArray(
				[
					A2($elm$json$Json$Decode$field, 'constraints', $elm$json$Json$Decode$int),
					$elm$json$Json$Decode$succeed(0)
				])),
		A2(
			$author$project$Api$andMap,
			$elm$json$Json$Decode$oneOf(
				_List_fromArray(
					[
						A2(
						$elm$json$Json$Decode$field,
						'extras',
						$elm$json$Json$Decode$list($author$project$Local$decoder)),
						$elm$json$Json$Decode$succeed(_List_Nil)
					])),
			A2(
				$author$project$Api$andMap,
				A2(
					$elm$json$Json$Decode$field,
					'parity',
					$elm$json$Json$Decode$array($elm$json$Json$Decode$int)),
				A2(
					$author$project$Api$andMap,
					A2(
						$elm$json$Json$Decode$field,
						'cages',
						$elm$json$Json$Decode$list($author$project$Api$cageDecoder)),
					A2(
						$author$project$Api$andMap,
						A2(
							$elm$json$Json$Decode$field,
							'solution',
							$elm$json$Json$Decode$array($elm$json$Json$Decode$int)),
						A2(
							$author$project$Api$andMap,
							A2(
								$elm$json$Json$Decode$field,
								'puzzle',
								$elm$json$Json$Decode$list($elm$json$Json$Decode$int)),
							A2(
								$author$project$Api$andMap,
								A2($elm$json$Json$Decode$field, 'seed', $elm$json$Json$Decode$int),
								A2(
									$author$project$Api$andMap,
									A2($elm$json$Json$Decode$field, 'difficulty', $elm$json$Json$Decode$string),
									A2(
										$author$project$Api$andMap,
										A2(
											$elm$json$Json$Decode$map,
											$elm$core$List$filterMap($author$project$Variant$ruleFromId),
											A2(
												$elm$json$Json$Decode$field,
												'rules',
												$elm$json$Json$Decode$list($elm$json$Json$Decode$string))),
										$elm$json$Json$Decode$succeed($author$project$Api$Puzzle)))))))))));
var $author$project$Api$requestPuzzle = F4(
	function (rules, difficulty, seed, toMsg) {
		return $elm$http$Http$post(
			{
				aG: '/api/new',
				aH: $elm$http$Http$jsonBody(
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'rules',
								A2(
									$elm$json$Json$Encode$list,
									A2($elm$core$Basics$composeL, $elm$json$Json$Encode$string, $author$project$Variant$ruleId),
									rules)),
								_Utils_Tuple2(
								'difficulty',
								$elm$json$Json$Encode$string(
									$author$project$Api$difficultyId(difficulty))),
								_Utils_Tuple2(
								'seed',
								A2(
									$elm$core$Maybe$withDefault,
									$elm$json$Json$Encode$null,
									A2($elm$core$Maybe$map, $elm$json$Json$Encode$int, seed)))
							]))),
				a_: A2($author$project$Api$expectJson, toMsg, $author$project$Api$puzzleDecoder)
			});
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var rule = msg.a;
				var setup = model.g;
				var rules = A2($elm$core$List$member, rule, setup.aW) ? A2(
					$elm$core$List$filter,
					$elm$core$Basics$neq(rule),
					setup.aW) : A2($elm$core$List$cons, rule, setup.aW);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							g: _Utils_update(
								setup,
								{aW: rules})
						}),
					$elm$core$Platform$Cmd$none);
			case 1:
				var d = msg.a;
				var setup = model.g;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							g: _Utils_update(
								setup,
								{bI: d})
						}),
					$elm$core$Platform$Cmd$none);
			case 2:
				var m = msg.a;
				var setup = model.g;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							g: _Utils_update(
								setup,
								{C: m})
						}),
					$elm$core$Platform$Cmd$none);
			case 3:
				var s = msg.a;
				var setup = model.g;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							g: _Utils_update(
								setup,
								{aj: s})
						}),
					$elm$core$Platform$Cmd$none);
			case 4:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: $author$project$Main$NoHint, ad: false, c: $author$project$Main$Loading, j: $elm$core$Maybe$Nothing}),
					A4(
						$author$project$Api$requestPuzzle,
						model.g.aW,
						model.g.bI,
						$elm$core$String$toInt(
							$elm$core$String$trim(model.g.aj)),
						$author$project$Main$GotPuzzle));
			case 5:
				var setup = model.g;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							a: $author$project$Main$NoHint,
							ad: true,
							g: _Utils_update(
								setup,
								{
									C: 1,
									aW: $author$project$Main$dailyRules(model.r),
									bI: 2
								}),
							c: $author$project$Main$Loading,
							j: $elm$core$Maybe$Nothing
						}),
					A4(
						$author$project$Api$requestPuzzle,
						$author$project$Main$dailyRules(model.r),
						2,
						$elm$core$Maybe$Just(model.W),
						$author$project$Main$GotPuzzle));
			case 6:
				if (!msg.a.$) {
					var puzzle = msg.a.a;
					var stats = model.u;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								u: _Utils_update(
									stats,
									{F: stats.F + 1}),
								c: $author$project$Main$Playing(
									A2($author$project$Game$new, model.g.C, puzzle)),
								H: false,
								ai: false,
								j: $elm$core$Maybe$Just(40)
							}),
						$author$project$Main$saveStats(
							$author$project$Main$encodeStats(
								_Utils_update(
									stats,
									{F: stats.F + 1}))));
				} else {
					var err = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								c: $author$project$Main$Failed(
									$author$project$Api$errorToString(err))
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 7:
				var i = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							j: $elm$core$Maybe$Just(i)
						}),
					$elm$core$Platform$Cmd$none);
			case 8:
				var dr = msg.a;
				var dc = msg.b;
				var cur = A2($elm$core$Maybe$withDefault, 40, model.j);
				var r = A2($elm$core$Basics$modBy, 9, ((cur / 9) | 0) + dr);
				var c = A2(
					$elm$core$Basics$modBy,
					9,
					A2($elm$core$Basics$modBy, 9, cur) + dc);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							j: $elm$core$Maybe$Just((r * 9) + c)
						}),
					$elm$core$Platform$Cmd$none);
			case 9:
				var d = msg.a;
				return A2(
					$author$project$Main$withGame,
					model,
					F2(
						function (i, g) {
							return A4($author$project$Game$input, model.H, i, d, g);
						}));
			case 10:
				return A2($author$project$Main$withGame, model, $author$project$Game$clear);
			case 11:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{H: !model.H}),
					$elm$core$Platform$Cmd$none);
			case 12:
				return A2($author$project$Main$mapGame, model, $author$project$Game$fillNotes);
			case 13:
				return A2($author$project$Main$mapGame, model, $author$project$Game$undo);
			case 14:
				return A2($author$project$Main$mapGame, model, $author$project$Game$redo);
			case 15:
				var _v1 = model.c;
				if (_v1.$ === 3) {
					var game = _v1.a;
					return _Utils_eq(game.k, $author$project$Game$Playing) ? _Utils_Tuple2(
						_Utils_update(
							model,
							{a: $author$project$Main$HintLoading}),
						A3(
							$author$project$Api$requestHint,
							game.v,
							$author$project$Board$values(game.b),
							$author$project$Main$GotHint)) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 16:
				if (!msg.a.$) {
					switch (msg.a.a.$) {
						case 0:
							var _v2 = msg.a.a;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										a: $author$project$Main$HintNote('O tabuleiro já está resolvido!')
									}),
								$elm$core$Platform$Cmd$none);
						case 1:
							var cells = msg.a.a.a;
							var m = $author$project$Main$chargeHint(model);
							return _Utils_Tuple2(
								_Utils_update(
									m,
									{
										a: $author$project$Main$HintNote(
											'Antes de avançar, corrija ' + ($elm$core$String$fromInt(
												$elm$core$List$length(cells)) + ' célula(s) errada(s) marcada(s) em vermelho.')),
										c: function () {
											var _v3 = m.c;
											if (_v3.$ === 3) {
												var g = _v3.a;
												return $author$project$Main$Playing(
													_Utils_update(
														g,
														{
															o: A2(
																$elm$core$Set$union,
																g.o,
																$elm$core$Set$fromList(cells))
														}));
											} else {
												var other = _v3;
												return other;
											}
										}()
									}),
								$elm$core$Platform$Cmd$none);
						default:
							var steps = msg.a.a.a;
							var m = $author$project$Main$chargeHint(model);
							return _Utils_Tuple2(
								_Utils_update(
									m,
									{
										a: A2($author$project$Main$HintShown, steps, 0)
									}),
								$elm$core$Platform$Cmd$none);
					}
				} else {
					var err = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								a: $author$project$Main$HintNote(
									$author$project$Api$errorToString(err))
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 17:
				var k = msg.a;
				var _v4 = model.a;
				if (_v4.$ === 2) {
					var steps = _v4.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								a: A2(
									$author$project$Main$HintShown,
									steps,
									A3(
										$elm$core$Basics$clamp,
										0,
										$elm$core$List$length(steps) - 1,
										k))
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 18:
				var _v5 = model.a;
				if (_v5.$ === 2) {
					var steps = _v5.a;
					return A2(
						$author$project$Main$afterMove,
						_Utils_update(
							model,
							{a: $author$project$Main$NoHint}),
						A2(
							$author$project$Main$mapScreen,
							$author$project$Game$applyHint(steps),
							model.c));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 19:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: $author$project$Main$NoHint}),
					$elm$core$Platform$Cmd$none);
			case 20:
				return A2(
					$author$project$Main$afterMove,
					model,
					A2($author$project$Main$mapScreen, $author$project$Game$tick, model.c));
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {aI: host, aK: path, aU: port_, aV: query, a8: fragment, ba: protocol};
	});
var $elm$core$String$contains = _String_contains;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$browser$Browser$element = _Browser_element;
var $author$project$Main$Tick = {$: 20};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {a7: taggers, bf: processes};
	});
var $elm$time$Time$init = $elm$core$Task$succeed(
	A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$time$Time$addMySub = F2(
	function (_v0, state) {
		var interval = _v0.a;
		var tagger = _v0.b;
		var _v1 = A2($elm$core$Dict$get, interval, state);
		if (_v1.$ === 1) {
			return A3(
				$elm$core$Dict$insert,
				interval,
				_List_fromArray(
					[tagger]),
				state);
		} else {
			var taggers = _v1.a;
			return A3(
				$elm$core$Dict$insert,
				interval,
				A2($elm$core$List$cons, tagger, taggers),
				state);
		}
	});
var $elm$time$Time$Name = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$setInterval = _Time_setInterval;
var $elm$time$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		if (!intervals.b) {
			return $elm$core$Task$succeed(processes);
		} else {
			var interval = intervals.a;
			var rest = intervals.b;
			var spawnTimer = $elm$core$Process$spawn(
				A2(
					$elm$time$Time$setInterval,
					interval,
					A2($elm$core$Platform$sendToSelf, router, interval)));
			var spawnRest = function (id) {
				return A3(
					$elm$time$Time$spawnHelp,
					router,
					rest,
					A3($elm$core$Dict$insert, interval, id, processes));
			};
			return A2($elm$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var $elm$time$Time$onEffects = F3(
	function (router, subs, _v0) {
		var processes = _v0.bf;
		var newTaggers = A3($elm$core$List$foldl, $elm$time$Time$addMySub, $elm$core$Dict$empty, subs);
		var rightStep = F3(
			function (_v6, id, _v7) {
				var spawns = _v7.a;
				var existing = _v7.b;
				var kills = _v7.c;
				return _Utils_Tuple3(
					spawns,
					existing,
					A2(
						$elm$core$Task$andThen,
						function (_v5) {
							return kills;
						},
						$elm$core$Process$kill(id)));
			});
		var leftStep = F3(
			function (interval, taggers, _v4) {
				var spawns = _v4.a;
				var existing = _v4.b;
				var kills = _v4.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, interval, spawns),
					existing,
					kills);
			});
		var bothStep = F4(
			function (interval, taggers, id, _v3) {
				var spawns = _v3.a;
				var existing = _v3.b;
				var kills = _v3.c;
				return _Utils_Tuple3(
					spawns,
					A3($elm$core$Dict$insert, interval, id, existing),
					kills);
			});
		var _v1 = A6(
			$elm$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			processes,
			_Utils_Tuple3(
				_List_Nil,
				$elm$core$Dict$empty,
				$elm$core$Task$succeed(0)));
		var spawnList = _v1.a;
		var existingDict = _v1.b;
		var killTask = _v1.c;
		return A2(
			$elm$core$Task$andThen,
			function (newProcesses) {
				return $elm$core$Task$succeed(
					A2($elm$time$Time$State, newTaggers, newProcesses));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$time$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _v0 = A2($elm$core$Dict$get, interval, state.a7);
		if (_v0.$ === 1) {
			return $elm$core$Task$succeed(state);
		} else {
			var taggers = _v0.a;
			var tellTaggers = function (time) {
				return $elm$core$Task$sequence(
					A2(
						$elm$core$List$map,
						function (tagger) {
							return A2(
								$elm$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						taggers));
			};
			return A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$succeed(state);
				},
				A2($elm$core$Task$andThen, tellTaggers, $elm$time$Time$now));
		}
	});
var $elm$time$Time$subMap = F2(
	function (f, _v0) {
		var interval = _v0.a;
		var tagger = _v0.b;
		return A2(
			$elm$time$Time$Every,
			interval,
			A2($elm$core$Basics$composeL, f, tagger));
	});
_Platform_effectManagers['Time'] = _Platform_createManager($elm$time$Time$init, $elm$time$Time$onEffects, $elm$time$Time$onSelfMsg, 0, $elm$time$Time$subMap);
var $elm$time$Time$subscription = _Platform_leaf('Time');
var $elm$time$Time$every = F2(
	function (interval, tagger) {
		return $elm$time$Time$subscription(
			A2($elm$time$Time$Every, interval, tagger));
	});
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {aL: pids, aN: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {aF: key, aR: event};
	});
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (!node) {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (!node) {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.aL,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var event = _v0.aR;
		var key = _v0.aF;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.aN);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$Document = 0;
var $elm$browser$Browser$Events$onKeyDown = A2($elm$browser$Browser$Events$on, 0, 'keydown');
var $author$project$Main$Move = F2(
	function (a, b) {
		return {$: 8, a: a, b: b};
	});
var $author$project$Main$keyDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (key) {
		var _v0 = $elm$core$String$toInt(key);
		if (!_v0.$) {
			var d = _v0.a;
			return ((d >= 1) && (d <= 9)) ? $elm$json$Json$Decode$succeed(
				$author$project$Main$Input(d)) : $elm$json$Json$Decode$succeed($author$project$Main$Erase);
		} else {
			switch (key) {
				case 'Backspace':
					return $elm$json$Json$Decode$succeed($author$project$Main$Erase);
				case 'Delete':
					return $elm$json$Json$Decode$succeed($author$project$Main$Erase);
				case 'ArrowUp':
					return $elm$json$Json$Decode$succeed(
						A2($author$project$Main$Move, -1, 0));
				case 'ArrowDown':
					return $elm$json$Json$Decode$succeed(
						A2($author$project$Main$Move, 1, 0));
				case 'ArrowLeft':
					return $elm$json$Json$Decode$succeed(
						A2($author$project$Main$Move, 0, -1));
				case 'ArrowRight':
					return $elm$json$Json$Decode$succeed(
						A2($author$project$Main$Move, 0, 1));
				case 'n':
					return $elm$json$Json$Decode$succeed($author$project$Main$ToggleNotes);
				case 'N':
					return $elm$json$Json$Decode$succeed($author$project$Main$ToggleNotes);
				case 'z':
					return $elm$json$Json$Decode$succeed($author$project$Main$Undo);
				case 'y':
					return $elm$json$Json$Decode$succeed($author$project$Main$Redo);
				case 'h':
					return $elm$json$Json$Decode$succeed($author$project$Main$AskHint);
				case 'a':
					return $elm$json$Json$Decode$succeed($author$project$Main$AutoNotes);
				default:
					return $elm$json$Json$Decode$fail('tecla ignorada');
			}
		}
	},
	A2(
		$elm$json$Json$Decode$andThen,
		function (tag) {
			return (tag === 'INPUT') ? $elm$json$Json$Decode$fail('digitando em um campo') : A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string);
		},
		$elm$json$Json$Decode$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$json$Json$Decode$at,
					_List_fromArray(
						['target', 'tagName']),
					$elm$json$Json$Decode$string),
					$elm$json$Json$Decode$succeed('')
				]))));
var $author$project$Main$subscriptions = function (model) {
	var _v0 = model.c;
	if (_v0.$ === 3) {
		var game = _v0.a;
		return $elm$core$Platform$Sub$batch(
			_List_fromArray(
				[
					_Utils_eq(game.k, $author$project$Game$Playing) ? A2(
					$elm$time$Time$every,
					1000,
					function (_v1) {
						return $author$project$Main$Tick;
					}) : $elm$core$Platform$Sub$none,
					$elm$browser$Browser$Events$onKeyDown($author$project$Main$keyDecoder)
				]));
	} else {
		return $elm$core$Platform$Sub$none;
	}
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{bj: $author$project$Main$init, bo: $author$project$Main$view, bC: $author$project$Main$update, bS: $author$project$Main$subscriptions});
_Platform_export({'Main':{'init':$author$project$Main$main(
	A2(
		$elm$json$Json$Decode$andThen,
		function (dayNumber) {
			return A2(
				$elm$json$Json$Decode$andThen,
				function (today) {
					return A2(
						$elm$json$Json$Decode$andThen,
						function (stats) {
							return $elm$json$Json$Decode$succeed(
								{u: stats, W: today, r: dayNumber});
						},
						A2($elm$json$Json$Decode$field, 'stats', $elm$json$Json$Decode$value));
				},
				A2($elm$json$Json$Decode$field, 'today', $elm$json$Json$Decode$int));
		},
		A2($elm$json$Json$Decode$field, 'dayNumber', $elm$json$Json$Decode$int)))(0)}});}(this));