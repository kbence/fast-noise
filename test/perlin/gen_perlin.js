var noise = require("../.")
  , gd    = require("node-gd")
  , fs    = require("fs");

for (var i = 1; i <= 8; i++) {
    generatePerlinImage(256, i).png(__dirname + "/256x256_" + i + ".png");
}

function generatePerlinImage(size, iterations)
{
    var image = gd.createTrueColor(size, size);
    var perlin = new noise.PerlinNoise(12345, iterations);
    var colors = [];

    for (var col = 0; col < 256; col++) {
        colors.push(image.colorAllocate(col, col, col));
    }

    for (var y = 0; y < size; y++) {
        for (var x = 0; x < size; x++) {
            var color = Math.floor(perlin.get(100 + x/size, 50 + y/size, 0) * 255);
            image.setPixel(x, y, colors[color]);
        }
    }

    return image;
}
