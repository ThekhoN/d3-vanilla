export default function lineChart() {
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

  const svg = d3.select("svg");

  // create the line
  const line = d3
    .line()
    .x(d => xScale(d["date"]))
    .y(d => yScale(d[city]))
    .curve(d3.curveCatmullRom); // adds smooth curves to the path

  svg
    .append("path")
    .attr("d", line(data))
    .attr("fill", "none")
    .attr("stroke", "blue");

  const xAxis = d3.axisBottom().scale(xScale);
  const yAxis = d3.axisLeft().scale(yScale);

  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);
  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.bottom})`)
    .call(yAxis);
}
