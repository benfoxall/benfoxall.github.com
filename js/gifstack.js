define([
  'lib-gif', 'THREE',

  'THREE.DeviceOrientationControls',
  'THREE.OrbitControls',
  'THREE.StereoEffect'
], function(libgif, THREE){
  // todo: es6


  // threejs rendering
  var threeCanvas = document.getElementById('gs-three')
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 75, threeCanvas.width / threeCanvas.height, 0.1, 1000 );

  var renderer = new THREE.WebGLRenderer({
    canvas: threeCanvas,
    alpha: true,
  });
  renderer.setClearColor(0xffffff, 0)
  renderer.setPixelRatio( window.devicePixelRatio );
	renderer.devicePixelRatio = window.devicePixelRatio;


  controls = new THREE.OrbitControls( camera, renderer.domElement );
  //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
  controls.addEventListener( 'change', requestRenderStack )
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableKeys = false;

  renderer.setSize( threeCanvas.width, threeCanvas.height );

  var stack = new THREE.Object3D();
  scene.add(stack);

  // stack.rotation.x = 1.2
  // stack.rotation.y = 1
  // stack.rotation.z = 1.3

  camera.position.z = 1.5

  // hacky debug
  window.stack = stack
  window.camera = camera
  window.renderStack = renderStack

  function renderStack() {
    requested = false


    // set the render order based on the centre of the frame position
    // (might not actually be the position of the frame geom)
    for (var v = new THREE.Vector3(0,0,0),
             l = stack.children.length,
             i = 0; i < l; i++) {
      v.z = ((i/(l-1)) - 0.5) * 2
      stack.children[i].renderOrder = -camera.position.distanceToSquared(v)
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


  var prior

  function Handler (name) {
    this.name = name || 'gif'

    this.frame = 0

    if(prior) prior.aborted = true
    prior = this

    ctx.clearRect(0,0,500,500)
    while(stack.children.length) {stack.remove(stack.children[0])}

  }


  var palette = document.getElementById('gs-palette')
  var paletteLabel = document.getElementById('gs-palette-label')

  Handler.prototype.hdr = function(data) {
    if(this.aborted) return

    this.width = data.width
    this.height = data.height

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
    if(this.aborted) return

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

    var sw = _.width/this.width,
        sh = _.height/this.height,
        sx = (_.leftPos/this.width) - ((1 - sw)/2)
        sy = (_.topPos/this.height) - ((1 - sh)/2)

    var t = new THREE.Texture( image );
    t.minFilter = THREE.NearestFilter;
    t.needsUpdate = true;
    t.transparent = true;
    t.flipY = false

    var geometry = new THREE.PlaneBufferGeometry(sw, sh, 1, 1)

    var material = new THREE.MeshBasicMaterial( {
      side: THREE.DoubleSide,
      map: t,
      transparent: true,
      antialias: true
    });
    var slice = new THREE.Mesh( geometry, material );

    slice.position.x = sx
    slice.position.y = sy

    stack.add( slice );

    // space our the items in the stack
    var l = stack.children.length;
    for (var i = 0; i < l; i++) {
      stack.children[i].position.z = ((i/(l-1)) - 0.5) * 2
    }

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
