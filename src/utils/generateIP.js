/**
 * Generates a random IP address string
 * @returns {string} - Random IPv4 address
 */
function generateRandomIP() {
  return Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 256)
  ).join(".");
}

module.exports = { generateRandomIP };
