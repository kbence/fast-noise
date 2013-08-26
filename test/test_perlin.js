var assert = require("assert");
var noise  = require("../");

describe("PerlinNoise", function() {
    it("should have a default iterations parameter", function() {
        var perlin = new noise.PerlinNoise(12345);

        assert.notEqual(perlin.get(1, 2, 3), 0);
    });

    describe("#get()", function() {
        it("should return numeric value", function() {
            var perlin = new noise.PerlinNoise(12345, 1);
            assert.equal(typeof perlin.get(1, 2, 3), "number");
        });

        it("should use seed parameter", function() {
            var perlin1 = new noise.PerlinNoise(12345, 1);
            var perlin2 = new noise.PerlinNoise(12346, 1);

            assert.notEqual(perlin1.get(1, 2, 3), perlin2.get(1, 2, 3))
        });

        it("should use iterations parameter", function() {
            var perlin1 = new noise.PerlinNoise(12345, 1);
            var perlin2 = new noise.PerlinNoise(12345, 2);

            assert.notEqual(perlin1.get(1, 2, 3), perlin2.get(1, 2, 3))
        });

        it("should return values between 0.0 and 1.0", function() {
            var perlin = new noise.PerlinNoise(12345, 5);
            var value;

            for (var x = 0; x < 30; x++) {
                for (var y = 0; y < 30; y++) {
                    for (var z = 0; z < 30; z++) {
                        value = perlin.get(x/5, y/5, z/5);

                        assert(value >= 0.0, value + " >= 0.0");
                        assert(value <= 1.0, value + " <= 1.0");
                    }
                }
            }
        });
    });
});
