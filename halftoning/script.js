window.onload = function() {
    var img = document.getElementById('img');
    img.crossOrigin = "Anonymous";
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var imgData = ctx.getImageData(0, 0, img.width, img.height);

    var c2i = function(x, y) {
        return (y * img.width + x) * 4;
    }
    var sC = function(x, y, C) {
        imgData.data[c2i(x, y)] = imgData.data[c2i(x, y) + 1] = imgData.data[c2i(x, y) + 2] = C;
    }
    var gC = function(x, y) {
        return imgData.data[c2i(x, y)];
    }

    var threshold = 50;
    for (var y = 0; y < img.height - 1; y++) {
        var error = 0;
        for (var x = 1; x < img.width; x++) {
            var oldPixel = gC(x, y);
            var newPixel = oldPixel > threshold ? 255 : 0;
            sC(x, y, newPixel);
            error = (oldPixel - newPixel) >> 4;
            sC(x + 1, y, gC(x + 1, y) + error * 7);
            sC(x - 1, y + 1, gC(x - 1, y + 1) + error * 3);
            sC(x, y + 1, gC(x, y + 1) + error * 5);
            sC(x + 1, y + 1, gC(x + 1, y + 1) + error);
        }
    }
    ctx.putImageData(imgData, 0, 0);

}