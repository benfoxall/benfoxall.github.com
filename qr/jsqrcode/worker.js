// mock up the console so we don't throw errors
var console = {
    log:function(){}
};

importScripts(
    'grid.js',
    'version.js',
    'detector.js',
    'formatinf.js',
    'errorlevel.js',
    'bitmat.js',
    'datablock.js',
    'bmparser.js',
    'datamask.js',
    'rsdecoder.js',
    'gf256poly.js',
    'gf256.js',
    'decoder.js',
    'QRCode.js',
    'findpat.js',
    'alignpat.js',
    'databr.js'
);



self.onmessage = function(event) {

    var imagedata = event.data;
    qrcode.imagedata = imagedata;
    qrcode.width = imagedata.width;
    qrcode.height = imagedata.height;


    var resp;
    try{
        resp = qrcode.process();
    } catch(e){
        resp = '';
    }
    postMessage(resp);
};
