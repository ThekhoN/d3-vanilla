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
  }
];

const data2 = [
  {
    date: "1-May-12",
    value: 68.13
  },
  {
    date: "30-Apr-12",
    value: 93.98
  },
  {
    date: "27-Apr-12",
    value: 47.0
  },
  {
    date: "26-Apr-12",
    value: 29.7
  }
];

const data3 = [
  {
    date: "1-May-12",
    value: 88.13
  },
  {
    date: "30-Apr-12",
    value: 13.98
  },
  {
    date: "27-Apr-12",
    value: 57.0
  },
  {
    date: "26-Apr-12",
    value: 409.7
  }
];

export default function lineChart() {
  // merge all data
  const allData = [...data, ...data2, ...data3];
  const allDataSortedByValue = allData.sort((a, b) => {
    if (a.value > b.value) {
      return 1;
    } else {
      return -1;
    }
  });

  // determine min and max
  // const minValue = allDataSortedByValue[0].value;
  const maxValue = allDataSortedByValue[allDataSortedByValue.length - 1].value;

  // withTooltip
  // Set the dimensions of the canvas / graph
  const margin = { top: 30, right: 20, bottom: 30, left: 50 };
  const width = 800 - margin.left - margin.right;
  const height = 640 - margin.top - margin.bottom;

  const updatedData = getUpdatedData(data);
  const updatedData2 = getUpdatedData(data2);
  const updatedData3 = getUpdatedData(data3);

  const xExtent = d3.extent(updatedData.map(item => item.date));
  const xScale = d3
    .scaleTime()
    .domain(xExtent)
    .range([margin.left, width - margin.right]);

  // const yExtent = d3.extent(updatedData.map(item => item.value));
  const yScale = d3
    .scaleLinear()
    .domain([0, maxValue])
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

  // tooltipWrapper
  var tooltipWrapper = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // first lineGraph path
  addLineGraphPath(svg, updatedData, valueline, "blue");
  addTooltip(svg, updatedData, xScale, yScale, tooltipWrapper);
  // second lineGraph path
  addLineGraphPath(svg, updatedData2, valueline, "red");
  addTooltip(svg, updatedData2, xScale, yScale, tooltipWrapper);
  // third lineGraph path
  addLineGraphPath(svg, updatedData3, valueline, "orange");
  addTooltip(svg, updatedData3, xScale, yScale, tooltipWrapper);

  // create axes and append them
  const xAxis = d3.axisBottom().scale(xScale);
  xAxis.tickFormat(d => {
    return d.getDate() + " " + monthNames[d.getMonth()];
  });
  xAxis.ticks(4);

  const yAxis = d3.axisLeft().scale(yScale);
  yAxis.ticks(20);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis);
  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis);
}

// reusable modules
function getUpdatedData(data) {
  let updatedData = [];
  data.forEach(dataItem => {
    let item = {};
    item["value"] = dataItem["value"];
    item["date"] = d3.timeParse("%d-%b-%y")(dataItem["date"]);
    updatedData.push(item);
  });
  return updatedData;
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

// Add line graph path
function addLineGraphPath(svg, data, valueline, strokeColor) {
  svg
    .append("path")
    .attr("d", valueline(data))
    .attr("fill", "none")
    .attr("stroke", strokeColor);
}

// Add the addTooltip
function addTooltip(svg, data, xScale, yScale, tooltipWrapper) {
  svg
    .selectAll("dot")
    .data(data)
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
      tooltipWrapper
        .transition()
        .duration(200)
        .style("opacity", 0.9);
      tooltipWrapper
        .html(getRenderContent(d))
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function(d) {
      tooltipWrapper
        .transition()
        .duration(500)
        .style("opacity", 0);
    });
}
