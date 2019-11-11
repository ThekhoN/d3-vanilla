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
    adamId: 34123455,
    trackName: "Cowboys from Hell",
    artist: "Pantera",
    period: "201812",
    streamCount: 16000
  },
  {
    adamId: 34123455,
    trackName: "Cowboys from Hell",
    artist: "Pantera",
    period: "201903",
    streamCount: 20000
  }
];
const data2 = [
  {
    adamId: 34123666,
    trackName: "Ace of Spades",
    artist: "Motorhead",
    period: "201812",
    streamCount: 16880
  },
  {
    adamId: 34123666,
    trackName: "Ace of Spades",
    artist: "Motorhead",
    period: "201903",
    streamCount: 22000
  }
];
const data3 = [
  {
    adamId: 34129696,
    trackName: "Seasons in the Abyss",
    artist: "Slayer",
    period: "201812",
    streamCount: 13000
  },
  {
    adamId: 34129696,
    trackName: "Seasons in the Abyss",
    artist: "Slayer",
    period: "201903",
    streamCount: 19000
  }
];

const KEY_Y_AXIS = "streamCount";
const KEY_X_AXIS = "period";

export default function lineChart() {
  // merge all data
  const allData = [...data, ...data2, ...data3];
  const allDataSortedByValue = allData.sort((a, b) => {
    if (a[KEY_Y_AXIS] > b[KEY_Y_AXIS]) {
      return 1;
    } else {
      return -1;
    }
  });

  // determine min and max
  const maxValue =
    allDataSortedByValue[allDataSortedByValue.length - 1][KEY_Y_AXIS];

  // withTooltip
  // Set the dimensions of the canvas / graph
  const margin = { top: 30, right: 20, bottom: 30, left: 50 };
  const width = 800 - margin.left - margin.right;
  const height = 640 - margin.top - margin.bottom;

  const updatedData = getUpdatedData(data);
  const updatedData2 = getUpdatedData(data2);
  const updatedData3 = getUpdatedData(data3);

  const xExtent = d3.extent(updatedData.map(item => item[KEY_X_AXIS]));
  const xScale = d3
    .scaleTime()
    .domain(xExtent)
    .range([margin.left, width - margin.right]);

  const yScale = d3
    .scaleLinear()
    .domain([0, maxValue])
    .range([height - margin.top, margin.bottom]);

  const valueline = d3
    .line()
    .x(d => {
      return xScale(d[KEY_X_AXIS]);
    })
    .y(d => {
      return yScale(d[KEY_Y_AXIS]);
    })
    .curve(d3.curveCatmullRom);

  const svg = d3.select("svg");

  // tooltipWrapper
  var tooltipWrapper = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  d3.select("div.tooltip")
    .append("span")
    .attr("class", "tooltip-arrow");
  d3.select("div.tooltip")
    .append("div")
    .attr("class", "tooltip-content");

  // create axes and append them
  const xAxis = d3.axisBottom().scale(xScale);
  xAxis.ticks(2);
  xAxis.tickFormat((d, index, arr) => {
    const month = Number(d.getMonth()) + 1;
    if (index === 0 || index === arr.length - 1) {
      return getQuarterValue(month) + " " + d.getFullYear();
    }
  });

  const yAxis = d3.axisLeft().scale(yScale);
  yAxis.tickFormat(d => {
    return d3.format("~s")(Number(d));
  });
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis);
  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis);

  // render lineGraph paths - LAST
  // first lineGraph path
  addLineGraphPath(svg, updatedData, valueline, "blue");
  addTooltip(svg, updatedData, xScale, yScale, tooltipWrapper);
  // second lineGraph path
  addLineGraphPath(svg, updatedData2, valueline, "red");
  addTooltip(svg, updatedData2, xScale, yScale, tooltipWrapper);
  // // third lineGraph path
  addLineGraphPath(svg, updatedData3, valueline, "orange");
  addTooltip(svg, updatedData3, xScale, yScale, tooltipWrapper);
}

/********************************************************************/
// Reusable Modules
/********************************************************************/
function getUpdatedData(data) {
  let updatedData = [];
  data.forEach(dataItem => {
    let item = { ...dataItem };
    item[KEY_Y_AXIS] = dataItem[KEY_Y_AXIS];
    const formattedPeriod =
      dataItem[KEY_X_AXIS].slice(0, 4) + "-" + dataItem[KEY_X_AXIS].slice(4);
    item[KEY_X_AXIS] = d3.timeParse("%Y-%m")(formattedPeriod);
    updatedData.push(item);
  });
  return updatedData;
}

function getRenderContent(dataItem) {
  return `${dataItem.trackName}: &nbsp; <b>${dataItem.streamCount}</b>`;
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
      return xScale(d[KEY_X_AXIS]);
    })
    .attr("cy", function(d) {
      return yScale(d[KEY_Y_AXIS]);
    })
    .on("mouseover", function(d) {
      tooltipWrapper
        .transition()
        .duration(200)
        .style("opacity", 0.9);

      // debugger;
      // tooltipWrapper
      // .select(this)
      d3.select("div.tooltip-content").html(getRenderContent(d));
      tooltipWrapper
        .style("left", d3.event.pageX + 3 + "px")
        .style("top", d3.event.pageY - 28 + 3 + "px");
    })
    .on("mouseout", function(d) {
      tooltipWrapper
        .transition()
        .duration(500)
        .style("opacity", 0);
    });
}

// getQuarterValue
function getQuarterValue(month) {
  const parsedMonth = Number(month);
  if (parsedMonth < 1 || parsedMonth > 12) {
    throw new Error("Invalid month");
  }
  if (parsedMonth > 0 && parsedMonth < 4) {
    return "Q1";
  } else if (parsedMonth > 3 && parsedMonth < 7) {
    return "Q2";
  } else if (parsedMonth > 6 && parsedMonth < 10) {
    return "Q3";
  } else {
    return "Q4";
  }
}
