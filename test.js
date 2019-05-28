import test from 'ava';
import concatStream from 'concat-stream';
import fn from '.';

test.cb('removes 3rd line', t => {
	const expected = 'abc\ndef\njkl\n';
	const rmlines = fn(3);
	rmlines.pipe(concatStream({encoding: 'string'}, data => {
		t.is(data, expected);
		t.end();
	}));
	let txt = [
		'abc', 'def', 'ghi', 'jkl'
	].join('\n');
	txt += '\n';
	rmlines.end(txt);
});

test.cb('removes 1st line of a 1-liner', t => {
	const expected = '';
	const rmlines = fn(1);
	rmlines.pipe(concatStream({encoding: 'string'}, data => {
		t.is(data, expected);
		t.end();
	}));
	const txt = 'abc\n';
	rmlines.end(txt);
});

test.cb('removes 2nd line from a buffer', t => {
	const expected = 'abc\nghi\njkl';
	const rmlines = fn(2);
	rmlines.pipe(concatStream({encoding: 'string'}, data => {
		t.is(data, expected);
		t.end();
	}));
	const txt = [
		'abc', 'def', 'ghi', 'jkl'
	].join('\n');
	rmlines.end(Buffer.from(txt));
});

test.cb('removes lines 1, 3 and 5', t => {
	const expected = 'def\njkl\npqr';
	const rmlines = fn([1, 3, 5]);
	rmlines.pipe(concatStream({encoding: 'string'}, data => {
		t.is(data, expected);
		t.end();
	}));
	const txt = [
		'abc', 'def', 'ghi', 'jkl', 'mno', 'pqr'
	].join('\n');
	rmlines.write(txt);
	rmlines.end();
});

test.cb('preserves empty lines', t => {
	const expected = 'abc\n\ndef\nghi\n\njkl\n\n\n';
	const rmlines = fn([4]);
	rmlines.pipe(concatStream({encoding: 'string'}, data => {
		t.is(data, expected);
		t.end();
	}));
	const txt = [
		'abc', 'def', 'ghi', 'jkl'
	].join('\n\n');
	rmlines.write(txt + '\n\n\n');
	rmlines.end();
});

test.cb('handles multiple writes', t => {
	const expected = 'abc\ndef\njkl';
	const rmlines = fn(3);
	rmlines.pipe(concatStream({encoding: 'string'}, data => {
		t.is(data, expected);
		t.end();
	}));
	let txt = 'abc\nde';
	rmlines.write(txt);
	txt = 'f\ng';
	rmlines.write(txt);
	txt = 'hi\njkl';
	rmlines.end(txt);
});

test('errors on maximum buffer limit', t => {
	const rmlines = fn([3], {maxLength: 6});
	const txt = [
		'abc', 'def', 'ghi', 'jkl'
	].join('\n');
	t.throws(() => {
		rmlines.write(txt);
	});
});
