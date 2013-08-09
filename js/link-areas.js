define(['jquery','d3'],function($,d3){

	return function(el){

		var $form   = $('form', el),
		    $url    = $('[name=url]', el),
		    $submit = $('[type=submit]', el),
		    $clear  = $('button', el),
		    $vis    = $('.vis', el),
		    $tip    = $('.tip', el);

		// create the d3 layout

		var height = 400,
			width = $form.width();

		var color = d3.scale.linear()
			.domain([0, 1])
			.range(["#ddd", "#08f"]);

		var force = d3.layout.force()
			.charge(-120)
			.linkDistance(50)
			.size([width, height]);

		var svg = d3.select($vis.get(0)).append("svg")
			.attr("width", width)
			.attr("height", height);
		var svg2 = d3.select($vis.get(0)).append("svg")
			.attr("width", width)
			.attr("height", height);

		var graph = {
			nodes:[],
			links:[]
		}


		var link, node;

		force.on("tick", function() {
			link.attr("x1", function(d) { return d.source.x; })
				.attr("y1", function(d) { return d.source.y; })
				.attr("x2", function(d) { return d.target.x; })
				.attr("y2", function(d) { return d.target.y; });

			node.attr("cx", function(d) { return d.x; })
				.attr("cy", function(d) { return d.y; });
		});


		function nodeOrNew(name){
			var matches = graph.nodes.filter(function(node){
				return name == node.name
			})

			if(matches[0]){
				matches[0].score++;
				return graph.nodes.indexOf(matches[0]);
			} else {
				return graph.nodes.push({name:name, score:1, area:0}) - 1;
			}
		}

		function populate(from, links){

			var index = nodeOrNew(from);

			var min = Infinity,max = -Infinity;
			for(var prop in links){
				if(links.hasOwnProperty(prop)){
					min = Math.min(min,links[prop])
					max = Math.max(max,links[prop])
				}
			}

			for(var prop in links){
				if(links.hasOwnProperty(prop) && prop !== from){
					var v = (links[prop] - min)/(max-min);
					var i2 = nodeOrNew(prop);
					graph.nodes[i2].area += links[prop];
					graph.links.push({"source":index,"target":i2,"value":v})
				}
			}


			force
				.nodes(graph.nodes)
				.links(graph.links)
				.start();

			link = svg.selectAll(".link")
				.data(graph.links, function(l){return l.source.index + '-' + l.target.index});

			link
				.enter().append("line")
				.attr("class", "link")
				.style("stroke", function(d){return color(d.value)});

			link
				.exit().remove();


			node = svg2.selectAll(".node")
				.data(graph.nodes, function(n){return n.name});

			node
			  .enter().append("circle")
				.attr("class", "node")
				.attr("r", function(d){return 2 + (Math.sqrt(d.area/Math.PI)/10)})
				.call(force.drag)
				.on("mouseover", function(d){
					$tip.html($('<a>',{
						href:d.name,
						text:d.name
					}))
				})
				.on("click", function(d){
					var url = d.name;
					$.getJSON($form.prop('action'), {url:url})
					.then(function(data){
						populate(url, data);
					})

				})

			node
				.transition()
				.attr("r", function(d){return 2 + (Math.sqrt(d.area/Math.PI)/10)})
				.attr("fill", function(n){return n.score > 1 ? 'red' : 'black'});

			node
				.exit().remove();

		}





		$form.on('submit', function(e){
			e.preventDefault();

			var url = $url.val();

			$url.val('');
			$submit.val('...adding')

			$.getJSON($form.prop('action'), {url:url})
			.then(function(data){
				populate(url, data);

				$submit.val('add')
			})
		})

		$clear.on('click', function(){
			graph = {
				"nodes":[],
				"links":[]
			}

			link.remove();
			node.remove();
		})

		$(el).on('click', '.examples a', function(e){
			e.preventDefault();

			var url = this.href;
			$.getJSON($form.prop('action'), {url:url})
			.then(function(data){
				populate(url, data);
			});

		})

	}
})