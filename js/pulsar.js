define(['pulsar-data-processed','d3'],function(processed,d3){
  var datas = processed.cycles,
      left = processed.left,
      right = processed.right;

  // points in each cycle
  var dwidth = right - left - 1;

  var width = 550,
      height = 600,
      margin = {v: 40, h: 40},
      spikeHeight = 50;

  var x = d3.scale.linear()
      .range([margin.h, width - margin.h]);

  var y = d3.scale.linear()
      .range([margin.v,height - margin.v - spikeHeight]);

  var line = d3.svg.line()
    .x(function(d,i) { return x(i/dwidth)})
    .y(function(d,i) { return (Math.abs(d)*-spikeHeight)+spikeHeight; });

  var flatline = d3.svg.line()
    .x(function(d,i) { return x(i/dwidth)})
    .y(function(d,i) { return 0});

  var realline = d3.svg.line()
    .x(function(d,i) {  
      // HHAA
      if(i === 0) return x(0)

      // AAAA
      if(i === dwidth) return x(1)

      // CCKK
      return x((right+i)/(dwidth+right+left))
    })
    .y(function(d,i) { return (Math.abs(d)*-spikeHeight)+spikeHeight; });

  return function(el){
    var container = d3.select(el),
        graph = container.select('#pulsar-graph');

    container.style('visibility','visible');
    graph
      .style('background', '#fff')
      .transition()
      .style('background', '#000')

    var svg = graph.append("svg")
      .attr("width", '100%')
      .attr("height", height)
      .attr("viewBox","0 0 "+width+" "+height)
      .attr('preserveAspectRatio', 'none')

    var cycles = svg.selectAll(".cycle")
      .data(datas)
      .enter().append("g")
      .attr("transform", function(d,i){
        return "translate(0," + y(i/datas.length) + ")"
      })
      .attr("class", "cycle")

    cycles
      .append("path")
      .attr("stroke", "#fff")
      .attr("fill", "rgba(0,0,0,1)")
      .attr("stroke-width", "1.5")
      .attr("d", flatline)
      /* trendy */ .transition() /* to show it's live */
      .duration(500)
      .delay(function(d,i){return i*10})
      .attr("d", line);

    // hook up actions
    var dark = true,
        transparent = false;

    function colour(){
      // doesn't transition well sometimes
      var f = transparent ?
        (dark ? "rgba(0,0,0,0)" : 'rgba(255,255,255,0)') :
        (dark ? "rgba(0,0,0,1)" : 'rgba(255,255,255,1)');

      svg.selectAll('path')
        .transition()
        .attr("stroke", dark ? "#fff" : '#000')
        .attr("fill",   f)
      graph
        .transition()
        .duration(500)
        .style('background', dark ? "#000" : '#fff')

    }
    container.select('#pulsar-colouring')
      .on("change", function(){
        dark = !this.checked;
        colour();
      });

    container.select('#pulsar-transparent')
      .on("change", function(){
        transparent = this.checked;
        colour();
      });

    container.select('#pulsar-scale')
      .on("change", function(){
        var real = this.checked;

        spikeHeight = real ? 10 : 50;

        cycles
          .data(datas)
          .selectAll('path')
          .transition()
          .attr("d", real ? realline : line);
        
      });


  }

});