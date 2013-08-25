var assert = require("assert");
var noise  = require("../");

describe("noise", function() {
    it("should contain all the noise functions", function() {
        assert.equal(typeof noise.noise1, "function");
        assert.equal(typeof noise.noise2, "function");
        assert.equal(typeof noise.noise3, "function");
        assert.equal(typeof noise.doubleNoise1, "function");
        assert.equal(typeof noise.doubleNoise2, "function");
        assert.equal(typeof noise.doubleNoise3, "function");
    });

    describe("#noise1()", function() {
        it("should return different values for different arguments", function() {
            assert.notEqual(noise.noise1(43645, 75857), noise.noise1(43646, 75857));
            assert.notEqual(noise.noise1(43645, 75857), noise.noise1(43645, 75858));
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

    describe("#doubleNoise1()", function() {
        it("should return value between 0.0 and 1.0", function() {
            var lastValue = null;

            for (var i = 0; i < 10000; i++) {
                var n = noise.doubleNoise1(12345, i);

                assert(n >= 0, "should be greater than zero");
                assert(n <= 1, "should be less than 1");
                assert.notEqual(n, lastValue);

                lastValue = n;
            }
        });

        it("should return interpolated value", function() {
            var n1 = noise.doubleNoise1(12345, 5);
            var n2 = noise.doubleNoise1(12345, 6);
            var nIntp = noise.doubleNoise1(12345, 5.5);

            assert.equal(nIntp, (n1 + n2) / 2);
        });

        it("should not be a linear interpolation", function() {
            var n1 = noise.doubleNoise1(12345, 5);
            var n2 = noise.doubleNoise1(12345, 6);
            var nIntp = noise.doubleNoise1(12345, 5.25);

            assert.notEqual(nIntp, n1 * 0.75 + n2 * 0.25);
        });
    });

    describe("#doubleNoise2()", function() {
        it("should return value between 0.0 and 1.0", function() {
            var lastValue = null;

            for (var x = 0; x < 100; x++) {
                for (var y = 0; y < 100; y++) {
                    var n = noise.doubleNoise2(12345, x, y);

                    assert(n >= 0, "should be greater than zero");
                    assert(n <= 1, "should be less than 1");
                    assert.notEqual(n, lastValue);

                    lastValue = n;
                }
            }
        });

        it("should return interpolated value", function() {
            var n1 = noise.doubleNoise2(12345, 5, 1);
            var n2 = noise.doubleNoise2(12345, 6, 1);
            var n3 = noise.doubleNoise2(12345, 5, 2);
            var nIntp1 = noise.doubleNoise2(12345, 5.5, 1);
            var nIntp2 = noise.doubleNoise2(12345, 5, 1.5);

            assert.equal(nIntp1, (n1 + n2) / 2);
            assert.equal(nIntp2, (n1 + n3) / 2);
        });

        it("should not be a linear interpolation", function() {
            var n1 = noise.doubleNoise2(12345, 5, 1);
            var n2 = noise.doubleNoise2(12345, 6, 1);
            var n3 = noise.doubleNoise2(12345, 5, 2);
            var nIntp1 = noise.doubleNoise2(12345, 5.25, 1);
            var nIntp2 = noise.doubleNoise2(12345, 5, 1.25);

            assert.notEqual(nIntp1, n1 * 0.75 + n2 * 0.25);
            assert.notEqual(nIntp2, n1 * 0.75 + n3 * 0.25);
        });
    });

    describe("#doubleNoise3()", function() {
        it("should return value between 0.0 and 1.0", function() {
            var lastValue = null;

            for (var x = 0; x < 30; x++) {
                for (var y = 0; y < 30; y++) {
                    for (var z = 0; z < 30; z++) {
                        var n = noise.doubleNoise3(12345, x, y, z);

                        assert(n >= 0, "should be greater than zero");
                        assert(n <= 1, "should be less than 1 " + n);
                        assert.notEqual(n, lastValue);

                        lastValue = n;
                    }
                }
            }
        });

        it("should return interpolated value", function() {
            var n1 = noise.doubleNoise3(12345, 5, 1, 8);
            var n2 = noise.doubleNoise3(12345, 6, 1, 8);
            var n3 = noise.doubleNoise3(12345, 5, 2, 8);
            var n4 = noise.doubleNoise3(12345, 5, 1, 9);
            var nIntp1 = noise.doubleNoise3(12345, 5.5, 1, 8);
            var nIntp2 = noise.doubleNoise3(12345, 5, 1.5, 8);
            var nIntp3 = noise.doubleNoise3(12345, 5, 1, 8.5);

            assert.equal(nIntp1, (n1 + n2) / 2);
            assert.equal(nIntp2, (n1 + n3) / 2);
            assert.equal(nIntp3, (n1 + n4) / 2);
        });

        it("should not be a linear interpolation", function() {
            var n1 = noise.doubleNoise3(12345, 5, 1, 8);
            var n2 = noise.doubleNoise3(12345, 6, 1, 8);
            var n3 = noise.doubleNoise3(12345, 5, 2, 8);
            var n4 = noise.doubleNoise3(12345, 5, 1, 9);
            var nIntp1 = noise.doubleNoise3(12345, 5.25, 1, 8);
            var nIntp2 = noise.doubleNoise3(12345, 5, 1.25, 8);
            var nIntp3 = noise.doubleNoise3(12345, 5, 1, 8.25);

            assert.notEqual(nIntp1, n1 * 0.75 + n2 * 0.25);
            assert.notEqual(nIntp2, n1 * 0.75 + n3 * 0.25);
            assert.notEqual(nIntp3, n1 * 0.75 + n4 * 0.25);
        });
    });
});
