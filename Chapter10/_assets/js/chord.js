function drawChord() {
  const matrix = [
    [2689, 508, 1170, 189, 1007, 187, 745, 248, 263, 2311],
    [1064, 121, 830, 323, 2473, 393, 453, 312, 533, 599],
    [506, 296, 813, 530, 988, 540, 1936, 578, 747, 268],
    [706, 311, 1568, 526, 1273, 371, 618, 694, 481, 227],
    [178, 701, 277, 176, 663, 227, 379, 284, 330, 111],
    [550, 270, 548, 445, 196, 769, 868, 317, 1477, 195],
    [344, 141, 468, 955, 172, 346, 502, 388, 415, 97],
    [333, 207, 455, 545, 196, 1322, 618, 254, 659, 62],
    [655, 120, 301, 90, 2368, 108, 226, 99, 229, 875],
    [270, 221, 625, 436, 239, 278, 548, 1158, 320, 90]
  ];
  const names = [
    "South Station",
    "TD Garden",
    "Boston Public Library",
    "Boylston St. at Arlington St",
    "Back Bay / South End Station",
    "Charles Circle",
    "Kenmore Sq / Comm Av",
    "Beacon St / Mass Av",
    "Lewis Wharf",
    "Newbury St / Hereford S"
  ];

  const width = 1200,
    height = 1200,
    radius = Math.min(width, height) / 2,
    padding = 200,
    outerRadius = radius - padding,
    innerRadius = outerRadius - 25;

  const chord = d3.chord()
    .padAngle(0.025)
    .sortSubgroups(d3.descending);

  const arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  const ribbon = d3.ribbon()
    .radius(innerRadius);

  const color = d3.scaleOrdinal()
    .domain(d3.range(9))
    .range([
      "#e6194b",
      "#ffe119",
      "#0082c8",
      "#f58231",
      "#911eb4",
      "#46f0f0",
      "#f032e6",
      "#d2f53c",
      "#808000",
      "#008080"
    ]);


  const svg = d3.select("#target")
    .append("svg")
    .attr("height", height)
    .attr("width", width);

  const g = svg.append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`)
    .datum(chord(matrix));

  const group = g.append("g")
    .attr("class", "groups")
    .selectAll("g")
    .data((chords) => chords.groups)
    .enter()
    .append("g");

  group.append("path")
    .style("fill", (d) => color(d.index))
    .style("stroke", (d) => d3.color(color(d.index)).darker())
    .attr("d", arc)
    .on("mouseover", fade(.1))
    .on("mouseout", fade(1));
  
  g.append("g")
    .attr("class", "ribbons")
    .selectAll("path")
    .data((chords) => chords)
    .enter()
    .append("path")
    .attr("d", ribbon)
    .style("fill", (d)=> color(d.source.index))
    .style("stroke", (d) => d3.color(color(d.source.index)).darker());
  
  group.append("text")
    .each((d) => d.angle = (d.startAngle + d.endAngle) / 2)
    .attr("text-anchor", (d) => {
      if (d.angle > Math.PI) {
        return "end";
      }
    })
    .attr("transform", (d) => {
      const y = Math.sin(d.angle) * (outerRadius + 10),
        x = Math.cos(d.angle) * (outerRadius + 20);
      return `translate(${y},${(-x)})`;
    })
    .text((d)=> {
      return names[d.index];
    });

  const groupTick = group.selectAll(".group-tick")
    .data((d) => groupTicks(d, 1000))
    .enter()
    .append("g")
    .attr("class", "group-tick")
    .attr("transform", (d) => {
      return `rotate(${(d.angle * 180 / Math.PI - 90)}) translate(${outerRadius},0)`;
    });

  groupTick.append("line")
    .attr("x2", 6);

  groupTick
    .filter((d) => d.value && !(d.value % 5000))
    .append("text")
    .attr("x", 8)
    .attr("dy", ".35em")
    .attr("transform", (d) => {
      if (d.angle > Math.PI) {
        return "rotate(180) translate(-16)";
      }
    })
    .style("text-anchor", (d) => {
      if (d.angle > Math.PI) {
        return "end";
      }
    })
    .attr("class", "tick")
    .text((d) => d3.formatPrefix(",.0", 1000)(d.value));

  function groupTicks(d, step) {
    let increment = (d.endAngle - d.startAngle) / d.value;
    return d3.range(0, d.value, step).map((value) => {
      return {
        value: value,
        angle: value * increment + d.startAngle
      };
    });
  }
  function fade(opacity) {
    return function(g, i) {
      svg.selectAll(".ribbons path")
        .filter((d)=> {
          return d.source.index !== i && d.target.index !== i;
        })
        .transition()
        .style("opacity", opacity);
    };
  }
}

drawChord();