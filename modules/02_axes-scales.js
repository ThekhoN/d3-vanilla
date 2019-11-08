export default function axesScales() {
  const rawTemperatureDataExpected = [
    {
      "New York": 63.4,
      "San Francisco": 62.77,
      Austin: 72.2,
      date: 20110110
    },
    {
      "New York": 71.2,
      "San Francisco": 60.1,
      Austin: 68.7,
      date: 20110315
    },
    {
      "New York": 65.1,
      "San Francisco": 57.2,
      Austin: 57.4,
      date: 20110620
    },
    {
      "New York": 69.1,
      "San Francisco": 77.2,
      Austin: 27.4,
      date: 20110925
    },
    {
      "New York": 94.1,
      "San Francisco": 77.2,
      Austin: 27.4,
      date: 20111201
    }
  ];

  const rectWidth = 100;
  const height = 500;
  const width = 800;
  const margin = { top: 20, bottom: 20, left: 20, right: 20 };
  const city = "New York";

  // sanitizing data
  let data = [];
  rawTemperatureDataExpected.forEach(temperatureItem => {
    let item = {};
    item["date"] = d3.timeParse("%Y%m%d")(temperatureItem.date);
    item["New York"] = parseInt(temperatureItem["New York"]);
    item["San Francisco"] = parseInt(temperatureItem["San Francisco"]);
    item["Austin"] = parseInt(temperatureItem["Austin"]);
    data.push(item);
  });

  // scales
  // x
  // native d3.extent
  const xExtent = d3.extent(data.map(item => item.date));
  const xScale = d3
    .scaleTime()
    .domain(xExtent)
    .range([margin.left, width - margin.right]);

  // y
  const yExtent = d3.extent(data.map(item => item[city]));
  const yScale = d3
    .scaleLinear()
    // .domain(yExtent)
    // custom
    .domain([0, yExtent[1]])
    .range([height - margin.bottom, margin.top]);
  const heightScale = d3
    .scaleLinear()
    .domain(yExtent)
    .range([0, height - margin.top - margin.bottom]);

  const svg = d3.select("svg");
  const rect = svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("width", 5)
    .attr("data-temperature", d => d[city])
    .attr("height", function(d) {
      // problem
      // const height = heightScale(d[city]);
      // return height;
      // works fine
      return height - yScale(d[city]);
      //   return height - d[city];
    })
    .attr("x", function(d) {
      return xScale(d.date);
    })
    .attr("y", function(d) {
      return yScale(d[city]);
    })
    .attr("fill", "blue")
    .attr("stroke", "white");

  //  const xAxisScale = const xExtent = d3.extent(data.map(item => item.date));
  //  const xAxisScale = d3
  //    .scaleTime()
  //    .domain(xExtent)
  //    .range([margin.left, width - margin.right]);
  const xAxis = d3.axisBottom().scale(xScale);
  // format ticks
  //  xAxis.ticks(d3.timeMonth.every(1));

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  // formatting ticks
  //   xAxis.tickFormat(d => {
  //     console.log("d: ", d);
  //     // return monthNames[d.getMonth()];
  //     return d3.timeFormat("%b %Y")(d);
  //   });

  const yAxis = d3.axisLeft().scale(yScale);
  yAxis.ticks(30);

  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);
  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.bottom})`)
    .call(yAxis);
}
