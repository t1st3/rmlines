'use strict';

const StringDecoder = require('string_decoder').StringDecoder;
const through = require('through2');

function transform(chunk, enc, cb) {
	this._last += this._decoder.write(chunk);
	if (this._last.length > this.maxLength) {
		return cb(new Error('maximum buffer reached'));
	}

	const list = this._last.split('\n');

	this._last = list.pop();

	for (let i = 0; i < list.length; i++) {
		this.count += 1;
		if (this.lines.indexOf(this.count) === -1) {
			this.push(list[i] + '\n');
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
