var noise = require("../build/Release/noise.node");

Object.keys(noise).forEach(function(func) {
    module.exports[func] = noise[func];
});

module.exports.PerlinNoise = require('./perlin');
