/**
 * Removes the file extension from a string
 * @param {string} string a string
 * @returns {string} cleaned up string
 */
function nameWithoutExtension(string) {
    const dotIndex = string.lastIndexOf('.');
    if (dotIndex === -1) {
        return string;
    }
    return string.slice(0, dotIndex);
}

// Get allowd characters for cleanUpForFileName()
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => d.toString());
const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const other = [' ', '-', '.', '_', ',', '(', ')'];
const allowedCharacters = new Set([...numbers, ...letters, ...letters.map(d => d.toUpperCase()), ...other]);

/**
 * Allowed are only a-zA-z0-9, all other characters will be replaced by '_'
 * @param {string} string a string
 * @returns {string} cleaned up string
 */
function cleanUpForFileName(string) {
    if (!string || !string.length) { return ''; }
    return string.split('')
        .map(d => allowedCharacters.has(d) ? d : '_')
        .join('');
}

module.exports = {
    nameWithoutExtension,
    cleanUpForFileName,
};
