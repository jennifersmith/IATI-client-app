jQuery(function($){
    // hack
    if($("#test_summaries").length == 0){
        return;
    }
    var show_aggregated_test_results = function(report){

        var x_points = [];
        // hack as dont have 0, 1 , 2, to N
        for(i=0; i < report.data.length; i++){
            x_points.push(i);
        }
        var width = 960, height = 500;

        var x = d3.scale.linear().range([0, width]);

        var y = d3.scale.linear().range([0, height - 40]);

        var svg = d3.select("#chart").append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("padding-right", "30px")
            .append("g")
            .attr("transform", "translate(" + x(1) + "," + (height - 20) + ")scale(-1,-1)");
        var body = svg.append("g").attr("transform", "translate(0,0)");
        var rules = svg.append("g");
        var title = svg.append("text")
            .attr("class", "title")
            .attr("dy", ".71em")
            .attr("transform", "translate(" + x(1) + "," + y(1) + ")scale(-1,-1)")
            .text("Aggregated test results");
        console.log(report);
        y.domain([0, d3.max(report.data)]);

        x.domain([0, report.data.length]);
        var rules = rules.selectAll(".rule")
            .data(y.ticks(10))
            .enter().append("g")
            .attr("class", "rule")
            .attr("transform", function(d) { return "translate(0," + y(d) + ")"; });

        rules.append("line")
            .attr("x2", width);

     rules.append("text")
            .attr("x", 6)
            .attr("dy", ".35em")
            .attr("transform", "rotate(180)")
            .text(function(d) { return Math.round(d); });
        svg.append("g").selectAll("text")
      .data(x_points)
            .enter().append("text")
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
               return "translate("+
                    (x(report.data.length) - x(d) - x(0.5))
                     + ",-4)scale(-1,-1)"; })
            .attr("dy", ".71em")
            .text(function(x){return report.x_axis[x][0] +  "-" + report.x_axis[x][1] + "%";} );
     var results = body.selectAll("g")
      .data(x_points)
      .enter().append("g")
      .attr("transform", function(d) {
          return "translate(" + x(report.data.length-d) + ",0)"; });
    results.selectAll("rect")
      .data(d3.range(2))
    .enter().append("rect")
      .attr("x", 1)
      .attr("width", x(1))
      .attr("height", 0);

    results.selectAll("rect")
            .data(function(d) { return [report.data[d]]; })
      .transition()
        .duration(750)
        .attr("height", y);
       };
    jQuery.getJSON(window.endpoint_url +"?&callback=?", function(data){

        show_aggregated_test_results(data.aggregated_test_results);
    });
});
