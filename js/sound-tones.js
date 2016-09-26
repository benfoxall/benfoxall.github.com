define(['sound-audio-ctx'], function(audioCtx){

  function ping(frequency) {

    var oscillator = audioCtx.createOscillator()

    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    oscillator.start()
    oscillator.stop(audioCtx.currentTime + 0.5)


    var gain = audioCtx.createGain()
    gain.gain.value = 0
    gain.gain.exponentialRampToValueAtTime(1, audioCtx.currentTime+ 0.1)
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime+0.5)
    oscillator.connect(gain)

    gain.connect(audioCtx.destination)

  }

  return function(element){
    ;[].forEach.call(element.querySelectorAll('a[href="#tone"]'),
      function(link){
        var hz = parseInt(link.innerText)
        link.addEventListener('click', function(e){
          e.preventDefault()
          ping(hz)
        }, false)
      })
  }
})
