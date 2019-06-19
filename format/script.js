function clamp(x,min, max){
	     return Math.max(min, Math.min(x, max))
	 }
	 
	 function rgbToYCbCr(r, g, b) {
	     //r /= 255, g /= 255, b /= 255;


	     y = clamp(0.299    * r + 0.587    * g + 0.114    * b, 0, 255);
	     cb = clamp(-0.14713 * r + -0.28886 * g + 0.436    * b + 128, 0, 255);
	     cr = clamp(0.615    * r + -0.51499 * g + -0.10001 * b + 128, 0, 255);
	     
	     return [ y, cb, cr];
	 }
	 
	 function yCbCrToRgb(y, cb, cr) {

	     r = clamp(1 * y +        0 * (cb - 128) + 1.13983 * (cr - 128), 0, 255);
	     g = clamp(1 * y + -0.39465 * (cb - 128) + -0.5806 * (cr - 128), 0, 255);
	     b = clamp(1 * y + 2.03211 * (cb - 128) +       0 * (cr - 128), 0, 255);
	     
	     return [ Math.floor(r), Math.floor(g), Math.floor(b) ];
	 }
	 
	 function quant(YCbCr){
	     var quanted = [Math.ceil(YCbCr[0]*50/256),
			    Math.ceil(YCbCr[1]*50/256),
			    Math.ceil(YCbCr[2]*50/256)]
	     return quanted
	 }
	 
	 function unquant(YCbCr){
	     
	     //console.log('unquant-inside', YCbCr[1]/256)
	     var unquanted = [YCbCr[0]*256/50,
			      YCbCr[1]*256/50,
			      YCbCr[2]*256/50]
	     return unquanted
	 }
	 
	 window.onload = function() {
	     
	     var img = document.getElementById('img');
	     img.crossOrigin = 'anonymous'

	     var canvas = document.getElementById('canvas');
	     canvas.width = img.width*2;
	     canvas.height = img.height;
	     var ctx = canvas.getContext('2d');

	     var res = [img.width, img.height]

	     
	     ctx.drawImage(img, 0, 0, img.width, img.height);
	     var imgData = ctx.getImageData(0, 0, img.width, img.height)
	     for (var i = 0; i < imgData.data.length; i += 4) {//imgData.data.length
		 var YCbCr = rgbToYCbCr(imgData.data[i], imgData.data[i+1], imgData.data[i+2])
		 res.push(quant(YCbCr))
	     }

	     document.getElementById('ta').value = res;

	     
	     ctx.putImageData(imgData, img.width, 0)
	     ctx.drawImage(img, img.width, 0, 0, 0);
	 }