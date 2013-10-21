define(['pulsar-data','d3'],function(pdata,d3){

  data = pdata.data.slice(520,575);

  var width = 500,
      height = 500;

  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var line = d3.svg.line()
    .x(function(d,i) { return x(i/data.length); })
    .y(function(d,i) { return (Math.abs(d)*-50)+50; });



  return function(el){
    g = el;
    

    var svg = d3.select(el).append("svg")
      .attr("width", width)
      .attr("height", height)

    svg.append("path")
      .datum(data)
      .attr("stroke", "#000")
      .attr("fill", "#fff")
      .attr("d", line);
  }

});