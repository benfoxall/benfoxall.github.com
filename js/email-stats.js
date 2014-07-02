define(['d3'], function(d3){


	return function(element){
		console.log("..", element)
		var key = 'inbox-work';
		var root = 'http://email-stats.herokuapp.com/'



		var margin = {top: 20, right: 20, bottom: 20, left: 0},
		    width = 500 - margin.left - margin.right,
		    height = 100 - margin.top - margin.bottom;

		var x = d3.time.scale()
			// .utc()
		    .range([0, width]);

		var y = d3.scale.linear()
		    .range([height, 0]);

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .ticks(3)
		    .orient("bottom");

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .ticks(3)
		    .orient("right");

		var area = d3.svg.area()
		    .x(function(d) { return x(d.time); })
		    .y0(height)
		    .y1(function(d) { return y(d.count); })
		    .interpolate('basis');

		   var w = width + margin.left + margin.right,
		   		h = height + margin.top + margin.bottom;

		var svg = d3.select(element).append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		    .attr("width", '100%')
			.attr("height", height + margin.top + margin.bottom)
			.attr("viewBox","0 0 "+w+" "+h)
			.attr('preserveAspectRatio', 'xMinYMin')
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


			d3.json(root + '/data/' + key, function(error, data) {
				if (error) return console.warn(error);


				
				data.forEach(function(d) {
					d.time = new Date(d[0]);
					d.count = d[1];
				});

			  x.domain(d3.extent(data, function(d) { return d.time; }));
			  y.domain([0,d3.max(data, function(d) { return d.count; })]);

			  svg.append("g")
			      .attr("class", "x axis")
			      .attr("transform", "translate(0," + height + ")")
			      .call(xAxis);

			  svg.append("g")
			      .attr("class", "y axis")
			      .attr("transform", "translate(" + width + ", 0)")
			      .call(yAxis)

			  svg.append("path")
			      .datum(data)
			      .attr("class", "area")
			      .attr("d", area);



			});



	}
})