var assert = require("assert");
var noise  = require("../");

describe("noise", function() {
    it("should contain all the noise functions", function() {
        assert.equal(typeof noise.noise1, "function");
        assert.equal(typeof noise.noise2, "function");
        assert.equal(typeof noise.noise3, "function");
    });

    describe("#noise1()", function() {
        it("should return different values for different arguments", function() {
            assert.notEqual(noise.noise1(43645, 75857), noise.noise1(43646, 75857));
            assert.notEqual(noise.noise1(43645, 75857), noise.noise1(43645, 75858));
        });

        it("should have a uniform distribution of bits", function() {
            var result;
            var dist = [];
            var i, b;

            for (b = 0; b < 32; b++) {
                dist.push(0);
            }

            for (i = 0; i < 1000000; i++) {
                result = noise.noise1(i, 0);

                for (b = 0; b < 32; b++, result >>= 1) {
                    (result & 1) && dist[b]++;
                }
            }

            console.log(dist)
        });
    });

    describe("#noise2()", function() {
        it("should return different values for different arguments", function() {
            assert.notEqual(noise.noise2(43645, 75857, 69748), noise.noise1(43646, 75857, 69748));
            assert.notEqual(noise.noise2(43645, 75857, 69748), noise.noise1(43645, 75858, 69748));
            assert.notEqual(noise.noise2(43645, 75857, 69748), noise.noise1(43645, 75857, 69749));
        });
    });

    describe("#noise3()", function() {
        it("should return different values for different arguments", function() {
            assert.notEqual(noise.noise2(43645, 75857, 69748, 23846), noise.noise1(43646, 75857, 69748, 23846));
            assert.notEqual(noise.noise2(43645, 75857, 69748, 23846), noise.noise1(43645, 75858, 69748, 23846));
            assert.notEqual(noise.noise2(43645, 75857, 69748, 23846), noise.noise1(43645, 75857, 69749, 23846));
            assert.notEqual(noise.noise2(43645, 75857, 69748, 23846), noise.noise1(43645, 75857, 69748, 23847));
        });
    });
});
