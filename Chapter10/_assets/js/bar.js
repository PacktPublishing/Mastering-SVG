function bar() {
  const width = 960,
    height = 800,
    chartHeight = 600,
    margin = 30;

  let svg = d3.select("#target").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin},${margin})`);
  let x = d3.scaleBand()
    .range([10, (width - (margin * 2))])
    .paddingInner(0.1);
  let y = d3.scaleLinear()
    .range([chartHeight, 0]);
  let xAxis = d3.axisBottom()
    .scale(x);
  let yAxis = d3.axisLeft()
    .scale(y)
  let color = d3.scaleOrdinal()
    .range([
      "#1fb003",
      "#1CA212",
      "#199522",
      "#178732",
      "#147A41",
      "#126C51",
      "#0F5F61",
      "#0C5170",
      "#0A4480",
      "#073690"
    ]);
  d3.json("data/top-ten.json").then((data) => {
    x.domain(data.map((d) => {
      return d.title;
    }));
    y.domain([0, d3.max(data,(d) => {
      return d.price;
    })]);
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("dx", -10)
      .attr("dy", -5);
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    svg.selectAll("rect")
      .data(data)
      .enter().append("rect")
      .style("fill", (d) => {
        return color(d.price);
      })
      .attr("x", (d) => {
        return x(d.title); })
      .attr("width", () => {
        return x.bandwidth();
      })
      .attr("y", (d) => {
        return y(d.price);
      })
      .attr("height", (d) => {
        return chartHeight - y(d.price);
      });
  });
}
bar();