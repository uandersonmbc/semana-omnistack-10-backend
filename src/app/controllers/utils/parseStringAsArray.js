module.exports = function parseStrinAsArray(string) {
    return string.length ? string.split(',').map(tech => tech.trim()) : [];
}
