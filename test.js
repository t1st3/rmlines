import test from 'ava';
import concatStream from 'concat-stream';
import fn from './';

test('removes 3rd line', async t => {
	const expected = 'abc\ndef\njkl\n';
	const rmlines = fn(3);
	rmlines.pipe(concatStream({encoding: 'string'}, data => {
		t.is(data, expected);
	}));
	let txt = [
		'abc', 'def', 'ghi', 'jkl'
	].join('\n');
	txt += '\n';
	await rmlines.end(txt);
});

test('removes 1st line of a 1-liner', async t => {
	const expected = '';
	const rmlines = fn(1);
	rmlines.pipe(concatStream({encoding: 'string'}, data => {
		t.is(data, expected);
	}));
	const txt = 'abc';
	await rmlines.write(txt);
});

test('removes 2nd line from a buffer', async t => {
	const expected = 'abc\nghi\njkl';
	const rmlines = fn(2);
	rmlines.pipe(concatStream({encoding: 'string'}, data => {
		t.is(data, expected);
	}));
	let txt = [
		'abc', 'def', 'ghi', 'jkl'
	].join('\n');
	await rmlines.end(new Buffer(txt));
});

test('removes lines 1, 3 and 5', async t => {
	const expected = 'def\njkl\npqr';
	const rmlines = fn([1, 3, 5]);
	rmlines.pipe(concatStream({encoding: 'string'}, data => {
		t.is(data, expected);
	}));
	const txt = [
		'abc', 'def', 'ghi', 'jkl', 'mno', 'pqr'
	].join('\n');
	rmlines.write(txt);
	await rmlines.end();
});

test('preserves empty lines', async t => {
	const expected = 'abc\n\ndef\nghi\n\njkl\n\n\n';
	const rmlines = fn([4]);
	rmlines.pipe(concatStream({encoding: 'string'}, data => {
		t.is(data, expected);
	}));
	const txt = [
		'abc', 'def', 'ghi', 'jkl'
	].join('\n\n');
	rmlines.write(txt + '\n\n\n');
	await rmlines.end();
});

test('handles multiple writes', async t => {
	const expected = 'abc\ndef\njkl';
	const rmlines = fn(3);
	rmlines.pipe(concatStream({encoding: 'string'}, data => {
		t.is(data, expected);
	}));
	let txt = 'abc\nde';
	rmlines.write(txt);
	txt = 'f\ng';
	rmlines.write(txt);
	txt = 'hi\njkl';
	await rmlines.end(txt);
});

test('errors on maximum buffer limit', t => {
	const rmlines = fn([3], {maxLength: 6});
	const txt = [
		'abc', 'def', 'ghi', 'jkl'
	].join('\n');
	t.throws(function () {
		rmlines.write(txt);
	});
});
