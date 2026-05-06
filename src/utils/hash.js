const crypto = require('crypto');

/**
 * Generates an MD5 hash of the given string and returns a numerical representation
 * @param {string} str - The string to hash
 * @returns {number} - 32-bit integer representation of the hash
 */
function hashString(str) {
  const hash = crypto.createHash('md5').update(str).digest('hex');
  // Return the first 8 characters parsed as a 32-bit integer
  return parseInt(hash.substring(0, 8), 16);
}

module.exports = { hashString };
