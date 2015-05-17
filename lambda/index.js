'use strict'

function Command() {

}

/**
 * Resize an image using imagemagick.
 */

Command.prototype.convert = function () {

}

/**
 * Convert a gif to video using ffmpeg.
 */

Command.prototype.convertToVideo = function () {

}

/**
 * Get the signature of an image.
 */

Command.protoype.getSignature = function (filename) {

}

/**
 * Get the sha256 sum of an image.
 */

Command.prototype.getHash = function (filename) {

}

/**
 * Identify an image.
 * Note that this may fail if AWS Lambda
 * does not support the specified format.
 */

Command.prototype.identify = function (filename) {

}

/**
 * Get the file from the specified S3 bucket.
 */

Command.prototype.get = function () {

}

/**
 * Save the file to a specified S3 bucket.
 */

Command.prototype.set = function (filename, client, key) {

}
