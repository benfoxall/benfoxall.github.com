
function rgb_hsv(arr, i){
  var r, g, b, h, s, v, cmax, cmin, delta;

  r = arr[i];
  g = arr[i+1];
  b = arr[i+2];

  // Cmax = max(R', G', B')
  // Cmin = min(R', G', B')
  cmax = Math.max(r,g,b);
  cmin = Math.min(r,g,b);

  // console.log(cmax, cmin)

  // Î” = Cmax - Cmin
  delta = cmax - cmin;

  // Hue calculation:
  if(cmax == r){
    h = 60 * (((g - b) / delta) % 6)
  } else if(cmax == g){
    h = 60 * (((b - r) / delta) + 2)
  } else if(cmax == b){
    h = 60 * (((r - g) / delta) + 4)
  }

  // Saturation calculation:

  if(delta == 0){
    s = 0;
  } else {
    s = (delta*255)/cmax;
  }

  // Value calculation:
  // V = Cmax
  v = cmax;

  h = (((h || 0)+360) % 360 ) / 1.411764

  arr[i] = h;
  arr[i+1] = s;
  arr[i+2] = v;

}

// this finds out the peaks of a given region
// (perhaps compared to the background)
function calibrate(data){

  // make some things easier to access
  var image   = data.image,
      windows = data.windows,
      width   = image.width,
      height  = image.height;


  // buckets for the h,s,v values
  // todo - outside here and overwrite
  var buckets = new Uint16Array(255*6);

  var maxh, minh, maxs, mins, maxv, minv;


  // calibration window
  var cSize = Math.min(height,width) / 5,
      xmin = (width-cSize)/2,
      xmax = ((width-cSize)/2) + cSize,
      ymin = (height-cSize)/2,
      ymax = ((height-cSize)/2) + cSize;

  // console.time("computing hsv");

  // buckets for the h,s,v values
  var buckets = new Uint16Array(255*6);

  var x, y, i, r, g, b, h, s, v, cmax, cmin, delta, inbound;
  for (var x = image.width - 1; x >= 0; x--) {
    for (var y = image.height - 1; y >= 0; y--) {
        i = ((x) + (y * image.width))*4;

        rgb_hsv(image.data,i);

        bucketOffset = x > xmin && x < xmax && y > ymin && y < ymax ? 0 : 3 * 255;

        buckets[image.data[i] + bucketOffset]++
        buckets[image.data[i+1] + 255 + bucketOffset]++
        buckets[image.data[i+2] + 255 + 255 + bucketOffset]++

    }
  }


  // find the peaks of the bounded histograms
  var ah, as, av;

  // the index of the maximum value of an array
  function max_index(arr){
    var ind = -1, max = -1;
    for (var i = arr.length - 1; i >= 0; i--) {
      if(arr[i] > max) ind = i, max = arr[i];
    };
    return ind;
  }

  ah = max_index(buckets.subarray(0,255))
  as = max_index(buckets.subarray(256, 510))
  av = max_index(buckets.subarray(511, 765))

  maxh = ah + windows[0];
  minh = ah - windows[0];
  maxs = as + windows[1];
  mins = as - windows[1];
  maxv = av + windows[2];
  minv = av - windows[2];

  // rewrite the image data so that
  // matching items are thresholded
  // everything else is transparent

  var hx,sx,vx;
  for (var x = image.width - 1; x >= 0; x--) {
    for (var y = image.height - 1; y >= 0; y--) {
        i = ((x) + (y * image.width))*4;

        hx = image.data[i];
        sx = image.data[i+1];
        vx = image.data[i+2];

        if(hx > minh && hx < maxh
          && sx > mins && sx < maxs
          && vx > minv && vx < maxv){
          image.data[i] = 0;
          image.data[i+1] = 0;
          image.data[i+2] = 0;
          
        } else {
          image.data[i+3] = 0; 
        }
    }
  }


  postMessage({
    type:'calibrate',

    buckets:  buckets,
    capBox:  {left:xmin, right:xmax, top:ymin, bottom:ymax},
    peaks:   [ah,as,av],
    windows: [minh, maxh, mins, maxs, minv, maxv],
    image: image
    // score: 10,
  })
}

var bx;
function bucketX(length){
  if(bx && bx.length == length){
    return bx
  } else {
    return bx = new Uint16Array(length)
  }
}
var by;
function bucketY(length){
  if(by && by.length == length){
    return by
  } else {
    return by = new Uint16Array(length)
  }
}

function recognise(data){

  var image = data.image,
      minh = data.thresholds[0],
      maxh = data.thresholds[1],
      mins = data.thresholds[2],
      maxs = data.thresholds[3],
      minv = data.thresholds[4],
      maxv = data.thresholds[5];

  var xbucket = bucketX(image.width),
      ybucket = bucketY(image.height);

  for (var i = image.width - 1; i >= 0; i--) {
    xbucket[i] = 0;
  };
  for (var i = image.height - 1; i >= 0; i--) {
    ybucket[i] = 0;
  };

  var x, y, i, r, g, b, h, s, v, cmax, cmin, delta, inbound;
  for (var x = image.width - 1; x >= 0; x--) {
    for (var y = image.height - 1; y >= 0; y--) {
        i = ((x) + (y * image.width))*4;

        r = image.data[i];
        g = image.data[i+1];
        b = image.data[i+2];

        // Cmax = max(R', G', B')
        // Cmin = min(R', G', B')
        cmax = Math.max(r,g,b);
        cmin = Math.min(r,g,b);

        // console.log(cmax, cmin)

        // Î” = Cmax - Cmin
        delta = cmax - cmin;

        // Hue calculation:
        if(cmax == r){
          h = 60 * (((g - b) / delta) % 6)
        } else if(cmax == g){
          h = 60 * (((b - r) / delta) + 2)
        } else if(cmax == b){
          h = 60 * (((r - g) / delta) + 4)
        }

        // Saturation calculation:

        if(delta == 0){
          s = 0;
        } else {
          s = (delta*255)/cmax;
        }

        // Value calculation:
        // V = Cmax
        v = cmax;

        h = (((h || 0)+360) % 360 ) / 1.411764

        if(h > minh && h < maxh
          && s > mins && s < maxs
          && v > minv && v < maxv){
          xbucket[x] ++;
          ybucket[y] ++;
        }
    }
  }

  // ctx.putImageData(image,0,0);

  // get rough bounding box of area
  var xmatch = Math.max.apply(Math, xbucket) / 10; // 10% 
  var ymatch = Math.max.apply(Math, ybucket) / 10; // 10% 
  var i;

  var bb = {};
  for(i = 0; i < xbucket.length; i++){
    if(xbucket[i] > xmatch){
      bb.left = i;
      break;
    }
  }
  for(i = 0; i < ybucket.length; i++){
    if(ybucket[i] > ymatch){
      bb.top = i;
      break;
    }
  }

  for(i = xbucket.length - 1; i > 0; i--){
    if(xbucket[i] > xmatch){
      bb.right = i;
      break;
    }
  }
  for(i = ybucket.length - 1; i > 0; i--){
    if(ybucket[i] > ymatch){
      bb.bottom = i;
      break;
    }
  }


  var cx = (bb.left + bb.right)/2;
  var cy = (bb.top + bb.bottom)/2;


  // alter by bounds if defined
  var bounds = data.bounds;
  if(bounds){
    bb.left += bounds.left
    bb.right += bounds.left
    bb.top += bounds.top
    bb.bottom += bounds.top

    cx += bounds.left
    cy += bounds.top
  }

  postMessage({
    type:'recognise',
    box: bb,
    xy: [cx,cy]
  })
}

onmessage = function(oEvent){
  // console.log(oEvent.data.type);
  switch(oEvent.data.type){
    case 'calibrate': calibrate(oEvent.data); break;
    case 'recognise': recognise(oEvent.data)

  }

  
  // console.log("GOT MESSAGE", oEvent.data)
}