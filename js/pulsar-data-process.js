/*
  This generates the proccessed data, can be used instead of the 
  processed version

  usage (in console)

  require(['pulsar-data-process'],function(p){
    console.log("define(" + JSON.stringify(p) + ")");
  }), ''

*/


define(['pulsar-data'],function(pdata){
  var datas = [];

  // format the data into steps
  var offset = 200,
      fsize = 697.69, 
      fsizei = Math.floor(fsize),
      a,b;

  while(offset < pdata.data.length){
    a = parseInt(offset,10)
    b = parseInt(offset+fsizei,10)

    datas.push(pdata.data.slice(a,b))
    offset += fsize;
  }

  datas = datas.slice(0,80);


  // trim all leading and trailing zeros
  var starts = datas.map(function(d){
    for(i=0; i < d.length;i++){
      if(d[i] !== 0){
        return i-1;
      }
    }
    return d.length;
  })
  var ends = datas.map(function(d){
    for(i=d.length-3; i > 0;i--){
      if(d[i] !== 0){
        return i+1;
      }
    }
    return 0;
  })

  var first = Math.min.apply(Math,starts);
  var last = Math.max.apply(Math,ends)

  datas = datas.map(function(d){
    return d.slice(first, last);
  })



  var d = {
    cycles:datas,
    left:first,
    right:last
  }

  console.log(JSON.stringify(d));

  return d;

})