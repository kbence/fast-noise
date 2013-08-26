var noise = require("../build/Release/noise.node");

module.exports = PerlinNoise;

function PerlinNoise(seed, iterations)
{
    iterations = iterations || 3;
    var divider = (1 << (iterations)) - 1;

    this.get = function get(x, y, z) {
        var value = 0, multiplier;

        for (var i = 0; i < iterations; i++) {
            multiplier = 1 << i;

            value += noise.doubleNoise3(seed, x * multiplier, y * multiplier, z * multiplier) * (multiplier / divider);
        }

        return value;
    };
}
