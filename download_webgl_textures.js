downloadWebGLTextures = function(gl, array) {
    $.getScript('https://rawgit.com/eligrey/FileSaver.js/master/FileSaver.min.js', function() {
        $.getScript('https://rawgit.com/Stuk/jszip/master/dist/jszip.js', function()
        {
            var zip = new JSZip();
            for(var i = 0; i < array.length; ++i) {
                var texture = array[i];
                var imgData = createImageFromTexture(gl, texture);
                zip.file("" + i + ".png", imgData, {base64:true});
            }
            zip.generateAsync({type:"blob"}).then(function(content) {
                saveAs(content, "webglTextures.zip");
            })

        });
    });
}

function createImageFromTexture(gl,texture) {
    //var gl = openfl_Lib.current.stage.__renderer.renderSession;
    var width = 512;
    var height = 512;
    // Create a framebuffer backed by the texture
    var framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    // Read the contents of the framebuffer
    var data = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);

    gl.deleteFramebuffer(framebuffer);

    // Create a 2D canvas to store the result
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext('2d');

    // Copy the pixels to a 2D canvas
    var imageData = context.createImageData(width, height);
    imageData.data.set(data);
    context.putImageData(imageData, 0, 0);
    return canvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/, "");

}
