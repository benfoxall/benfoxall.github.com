define(['sound-audio-ctx'], function(audioCtx){

  var oscillator = audioCtx.createOscillator()
  oscillator.type = 'sine'
  oscillator.frequency.value = 15000

  oscillator.start()
  oscillator.stop(audioCtx.currentTime + 5)

  var analyser = audioCtx.createAnalyser()
  var bufferLength = analyser.frequencyBinCount
  var data = new Uint8Array(bufferLength)
  // analyser.getByteTimeDomainData(data)

  oscillator.connect(analyser)

  return function(canvas){
    var ctx = canvas.getContext('2d')

    var w = canvas.width,
        h = canvas.height

    var c = 100
    var interval = setInterval(function(){
        analyser.getByteFrequencyData(data)

        var s = w/data.length
        var s2 = h/255

        ctx.clearRect(0,0, w, h)
        ctx.beginPath()
        for (var i = 0; i < data.length; i++) {
          ctx.lineTo(i * s, data[i] * s2)
        }
        ctx.stroke()

        if(c-- < 0) {
          clearInterval(interval)
        }
    },10)





  }
})
