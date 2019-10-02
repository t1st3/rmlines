'use strict';

const {StringDecoder} = require('string_decoder');
const through = require('through2');

function transform(chunk, enc, cb) {
	this._last += this._decoder.write(chunk);
	if (this._last.length > this.maxLength) {
		return cb(new Error('maximum buffer reached'));
	}

	const list = this._last.split('\n');

	this._last = list.pop();

	for (const line of list) {
		this.count += 1;
		if (this.lines.includes(this.count) === false) {
			this.push(line + '\n');
		}
	}

	cb();
}

function flush(cb) {
	// Forward any gibberish left in there
	this._last += this._decoder.end();

	if (this._last) {
		this.push(this._last);
	}

	cb();
}

function rmlines(lines, options) {
	options = options || {};

	const stream = through(options, transform, flush);

	// This stream is in objectMode only in the readable part
	stream._readableState.objectMode = true;

	stream._last = '';
	stream._decoder = new StringDecoder('utf8');
	stream.lines = (Number.isInteger(lines)) ? [lines] : lines;
	stream.count = 0;
	stream.maxLength = options.maxLength;

	return stream;
}

module.exports = rmlines;
