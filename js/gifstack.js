define(['lib-gif', 'THREE'], function(libgif, THREE){
  // todo: es6


  // threejs rendering
  var threeCanvas = document.getElementById('gs-three')
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  var renderer = new THREE.WebGLRenderer({
    canvas: threeCanvas,
    alpha: true,
  });
  renderer.setClearColor(0xffffff, 0)
  renderer.setSize( threeCanvas.width, threeCanvas.height );

  var stack = new THREE.Object3D();
  scene.add(stack);

  camera.position.z = 2.5;

  var mx = 0, my = 0, zoom = 0;


  renderer.domElement.addEventListener('mousemove', function(e){
    mx = e.x - (threeCanvas.width/1.5);
    my = e.y - (threeCanvas.height/1.5);
    zoom = Math.sqrt((my*my) + (mx*mx))

    requestRenderStack();

  }, false)




  function renderStack() {
    requested = false

    stack.rotation.x = my/200;
    stack.rotation.y = mx/200;

    var l = stack.children.length;

    for (var i = 0; i < l; i++) {
      stack.children[i].position.z = ((i/l) - 0.5) * 4
    }

    renderer.render( scene, camera );

  }

  var requested = false;
  function requestRenderStack() {
    if(!requested) {
      requested = true
      requestAnimationFrame( renderStack )
    }
  }





  function Handler (name) {
    this.name = name || 'gif'

    this.frame = 0
  }


  var palette = document.getElementById('gs-palette')
  var paletteLabel = document.getElementById('gs-palette-label')

  Handler.prototype.hdr = function(data) {
    console.log(data)
    this.gct = data.gct || []
    paletteLabel.innerText = 'Global colour table for ' + this.name

    // draw palette
    var pw = palette.width
    var ph = palette.height
    var ctx = palette.getContext('2d')

    ctx.clearRect(0,0,pw,ph)

    // 16 across
    var a = 16
    var w = pw / a
    var h = Math.ceil(ph / (this.gct.length / a))


    this.gct.forEach(function(c, i) {
      var x = i % a
      var y = Math.floor(i / a)

      ctx.fillStyle = rgb(c)
      ctx.fillRect(
        ~~(x * w),
        ~~(y * h),
        ~~w-3,
        ~~h-3
      )
    })

    function rgb(arr) {
      return arr ? 'rgb(' + arr.join(', ') + ')' : 'rgba(255,255,255,2)'
    }
  }



  Handler.prototype.gce = function(_) {
    this.transparent = _.transparencyGiven && _.transparencyIndex || null
  }


  var canvas = document.getElementById('gs-canvas')
  canvas.width = 500; canvas.height = 500
  var ctx = canvas.getContext('2d')

  var offscreen = document.createElement('canvas')
  offscreen.width = 500; offscreen.height = 500
  var offctx = offscreen.getContext('2d')


  Handler.prototype.img = function(_) {

    var image = new ImageData(_.width, _.height)
    var ct = _.lctFlag ? _.lct : this.gct
    var pixels = _.pixels

    for( var p = 0; p < pixels.length; p ++ ) {
      image.data.set( ct[pixels[p]], p*4 )
      image.data[p * 4 + 3] = pixels[p] === this.transparent ? 0 : 255
    }



    // thumbnail

    offctx.clearRect(0,0,offscreen.width, offscreen.height)
    offctx.putImageData(image, 0, 0 )

    var x = this.frame % 8
    var y = Math.floor(this.frame / 8)
    var w = 500/8, h = 500/8

    ctx.drawImage(offscreen, x*w, y*h, 50, 50)

    this.frame++



    // stack

    var t = new THREE.Texture( image );
    t.minFilter = THREE.NearestFilter;
    t.needsUpdate = true;
    t.transparent = true;

    var geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1)

    var material = new THREE.MeshBasicMaterial( {
      side: THREE.DoubleSide,
      map: t,
      transparent: true,
      antialias: true
    });
    var slice = new THREE.Mesh( geometry, material );

    stack.add( slice );

    renderStack()


  }




  // populate the example gif

  var xhr = new XMLHttpRequest();
  xhr.overrideMimeType('text/plain; charset=x-user-defined');
  xhr.onload = function(e) {
    var stream = new libgif.Stream(xhr.responseText);

    libgif.parseGIF(stream, new Handler('example.gif'))
  };
  xhr.open('GET', '/img/example.gif', true);
  xhr.send();




  // handle uploads from user

  var preview = document.getElementById('gs-file-preview')
  var fileInput = document.getElementById('gs-choose-file')
  fileInput.addEventListener('change', function(){

    var file = fileInput.files[0]

    // populate the image
    var previewReader = new FileReader();
    previewReader.onloadend = function () {
      preview.src = previewReader.result;
    }

    if (file) {
      previewReader.readAsDataURL(file);
    } else {
      preview.src = "";
    }


    // other stuff

    var gifReader = new FileReader();
    gifReader.onloadend = function () {
      var stream = new libgif.Stream(gifReader.result);
      libgif.parseGIF(stream, new Handler(file.name))
    }

    if (file) {
      gifReader.readAsBinaryString(file);
    } else {
    }

  })



  return function(el) {
    // whatever
  }
})
