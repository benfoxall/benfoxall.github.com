define(['sound-audio-ctx'], function(audioCtx){

  return function(canvas){
    var ctx = canvas.getContext('2d')
    ctx.fillRect(0,0,30,30)

  }
})
