
const width = 1000,
  height = 1000,
  radius = Math.min(width, height) / 2;

const color = d3.scaleOrdinal()
  .domain(d3.range(13))
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
    "#073690",
    "#05299F",
    "#021BAF",
    "#000EBF"
  ]);

const arc = d3.arc()
  .outerRadius(radius - 10)
  .innerRadius(radius - 200);

const pie = d3.pie()
  .value((d) => {
    return d.numbers;
  });

let svg = d3.select("#target").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", `translate(${width / 2},${height / 2})`);

svg.append("text")
  .text("Distribution of comic book titles in top 50 sales of all time.")
  .attr("class","legend");

d3.csv("data/top-fifty-comics-data.csv").then((data) => {
  let g = svg.selectAll(".arc")
    .data(pie(data))
    .enter()
    .append("g");

  g.append("path")
    .attr("d", arc)
    .style("fill", (d) => {
      return color(d.index);
    })

  svg.selectAll(".label")
    .data(pie(data))
    .enter()
    .append("text")
    .attr("class", "text")
    .attr("transform", (d) => {
      return `translate(${arc.centroid(d)})`;
    })
    .attr("dy", (d) => {
      if (d.startAngle > 6.0 && d.startAngle < 6.125) {
        return "-.6em";
      } else if (d.startAngle > 6.125) {
        return "-1.5em";
      }
    })
    .text((d) => {
      return d.data.title;
    });

});