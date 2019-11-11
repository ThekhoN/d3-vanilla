import "../styles/04_line-chart_tooltip.css";

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

export default function lineChart() {
  const data = [
    {
      date: "1-May-12",
      value: 58.13
    },
    {
      date: "30-Apr-12",
      value: 53.98
    },
    {
      date: "27-Apr-12",
      value: 67.0
    },
    {
      date: "26-Apr-12",
      value: 89.7
    },
    {
      date: "25-Apr-12",
      value: 99.0
    },
    {
      date: "24-Apr-12",
      value: 130.28
    },
    {
      date: "23-Apr-12",
      value: 166.7
    },
    {
      date: "20-Apr-12",
      value: 234.98
    },
    {
      date: "19-Apr-12",
      value: 345.44
    },
    {
      date: "18-Apr-12",
      value: 443.34
    }
  ];

  // withTooltip
  // Set the dimensions of the canvas / graph
  const margin = { top: 30, right: 20, bottom: 30, left: 50 };
  const width = 800 - margin.left - margin.right;
  const height = 640 - margin.top - margin.bottom;

  let updatedData = [];
  data.forEach(dataItem => {
    let item = {};
    item["value"] = dataItem["value"];
    item["date"] = d3.timeParse("%d-%b-%y")(dataItem["date"]);
    updatedData.push(item);
  });

  const xExtent = d3.extent(updatedData.map(item => item.date));
  const xScale = d3
    .scaleTime()
    .domain(xExtent)
    .range([margin.left, width - margin.right]);

  const yExtent = d3.extent(updatedData.map(item => item.value));
  console.log("yExtent: ", yExtent);

  const yScale = d3
    .scaleLinear()
    .domain([0, yExtent[1]])
    .range([height - margin.top, margin.bottom]);

  const valueline = d3
    .line()
    .x(d => {
      return xScale(d["date"]);
    })
    .y(d => {
      return yScale(d["value"]);
    })
    .curve(d3.curveCatmullRom);

  const svg = d3.select("svg");

  // tooltip
  var div = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  svg
    .append("path")
    .attr("d", valueline(updatedData))
    .attr("fill", "none")
    .attr("stroke", "blue");

  // Add the scatterplot
  svg
    .selectAll("dot")
    .data(updatedData)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("cx", function(d) {
      return xScale(d.date);
    })
    .attr("cy", function(d) {
      return yScale(d.value);
    })
    .on("mouseover", function(d) {
      div
        .transition()
        .duration(200)
        .style("opacity", 0.9);
      div
        .html(getRenderContent(d))
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function(d) {
      div
        .transition()
        .duration(500)
        .style("opacity", 0);
    });

  const xAxis = d3.axisBottom().scale(xScale);
  xAxis.tickFormat(d => {
    return d.getDate() + " " + monthNames[d.getMonth()];
  });
  const yAxis = d3.axisLeft().scale(yScale);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis);
  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis);
}

function getRenderContent(dataItem) {
  return (
    dataItem.date.getDate() +
    " " +
    monthNames[dataItem.date.getMonth()] +
    " " +
    dataItem.date.getFullYear() +
    "<br/>" +
    "value: " +
    dataItem.value
  );
}
