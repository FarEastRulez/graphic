function rgbToHsv(r, g, b) {
    r /= 255, g /= 255, b /= 255;

    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
        h = 0; 
    } else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }

        h /= 6;
    }

    return [h, s, v];
}

function hsvToRgb(h, s, v) {
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0:
            r = v, g = t, b = p;
            break;
        case 1:
            r = q, g = v, b = p;
            break;
        case 2:
            r = p, g = v, b = t;
            break;
        case 3:
            r = p, g = q, b = v;
            break;
        case 4:
            r = t, g = p, b = v;
            break;
        case 5:
            r = v, g = p, b = q;
            break;
    }

    return [r * 255, g * 255, b * 255];
}

function process() {
    var img = document.getElementById('img');
    img.crossOrigin = 'anonymous';

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    ctx.drawImage(img, 0, 0, img.width, img.height);

    var gain = document.getElementById('gain').value / 100;
    var gamma = document.getElementById('gamma').value / 100.0;
    var offset = document.getElementById('offset').value / 100;
    var gainR = document.getElementById('rgain').value / 100;
    var gainG = document.getElementById('ggain').value / 100;
    var gainB = document.getElementById('bgain').value / 100;

    var hsvgain = document.getElementById('hsvgain').value / 100;
    var hgain = document.getElementById('hgain').value / 100;
    var sgain = document.getElementById('sgain').value / 100;
    var vgain = document.getElementById('vgain').value / 100;


    var imgData = ctx.getImageData(0, 0, img.width, img.height)
    for (var i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] *= gainR * gain;
        imgData.data[i + 1] *= gainG * gain;
        imgData.data[i + 2] *= gainB * gain;

        imgData.data[i] = 255 * Math.pow(imgData.data[i] / 255, 1 / gamma);
        imgData.data[i + 1] = 255 * Math.pow(imgData.data[i + 1] / 255, 1 / gamma);
        imgData.data[i + 2] = 255 * Math.pow(imgData.data[i + 2] / 255, 1 / gamma);

        imgData.data[i] = 255 * (imgData.data[i] / 255 + offset);
        imgData.data[i + 1] = 255 * (imgData.data[i + 1] / 255 + offset);
        imgData.data[i + 2] = 255 * (imgData.data[i + 2] / 255 + offset);

        var hsv = rgbToHsv(imgData.data[i], imgData.data[i + 1], imgData.data[i + 2])

        pixelHue = hsv[0] * hsvgain * hgain;
        pixelSaturation = hsv[1] * hsvgain * sgain;
        pixelValue = hsv[2] * hsvgain * vgain;

        var rgb = hsvToRgb(pixelHue, pixelSaturation, pixelValue);

        imgData.data[i] = rgb[0];
        imgData.data[i + 1] = rgb[1];
        imgData.data[i + 2] = rgb[2];

    }

    ctx.putImageData(imgData, 0, 0);

}


window.onload = function() {
    var img = document.getElementById('img');
    img.crossOrigin = 'anonymous';

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    ctx.drawImage(img, 0, 0, img.width, img.height);

    var result = document.getElementById('result');
    result.onclick = process;



    document.getElementById("gain").addEventListener("change", process);
    document.getElementById("gamma").addEventListener("change", process);
    document.getElementById("offset").addEventListener("change", process);
    document.getElementById("rgain").addEventListener("change", process);
    document.getElementById("ggain").addEventListener("change", process);
    document.getElementById("bgain").addEventListener("change", process);

    document.getElementById("hsvgain").addEventListener("change", process);
    document.getElementById("hgain").addEventListener("change", process);
    document.getElementById("sgain").addEventListener("change", process);
    document.getElementById("vgain").addEventListener("change", process);

    document.getElementById("result").addEventListener("click", function() {
        document.getElementById('gain').value = 100;
        document.getElementById('gamma').value = 100.0;
        document.getElementById('offset').value = 0;
        document.getElementById('rgain').value = 100;
        document.getElementById('ggain').value = 100;
        document.getElementById('bgain').value = 100;

        document.getElementById('hsvgain').value = 100;
        document.getElementById('hgain').value = 100;

        document.getElementById('sgain').value = 100;

        document.getElementById('vgain').value = 100;

        process();
    });

}