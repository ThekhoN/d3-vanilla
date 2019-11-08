export default function axesScales() {
  const rawTemperatureDataExpected = [
    {
      "New York": 0,
      "San Francisco": 0,
      Austin: 0,
      date: 20110101
    },
    {
      "New York": 63.4,
      "San Francisco": 32.77,
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
      "San Francisco": 97.2,
      Austin: 27.4,
      date: 20111201
    },
    {
      "New York": 0,
      "San Francisco": 0,
      Austin: 0,
      date: 20120101
    }
  ];

  function getCityTemperatureData(data, cityName) {
    return data.map(tempItem => {
      let item = {};
      item["date"] = d3.timeParse("%Y%m%d")(tempItem["date"]);
      item["temperature"] = tempItem[cityName];
      item["city"] = cityName;
      return item;
    });
  }

  const newYorkTemperatureData = getCityTemperatureData(
    rawTemperatureDataExpected,
    "New York"
  );
  const sanFranciscoTemperatureData = getCityTemperatureData(
    rawTemperatureDataExpected,
    "San Francisco"
  );
  const austinTemperatureData = getCityTemperatureData(
    rawTemperatureDataExpected,
    "Austin"
  );

  const rectWidth = 50;
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

  // get min and max temp
  let arrOfTemperatureValues = [];
  rawTemperatureDataExpected.forEach(tempObj => {
    Object.keys(tempObj).forEach(key => {
      if (key !== "date") {
        arrOfTemperatureValues.push(Number(tempObj[key]));
      }
    });
  });
  const minTemp = Math.min(...arrOfTemperatureValues);
  const maxTemp = Math.max(...arrOfTemperatureValues);

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
    // .domain([0, yExtent[1]])
    // custom
    .domain([0, maxTemp])
    .range([height - margin.bottom, margin.top]);
  const heightScale = d3
    .scaleLinear()
    .domain(yExtent)
    .range([0, height - margin.top - margin.bottom]);

  const svg = d3.select("svg");

  // function getCityKey(cities, d) {
  //   let cityKey = "";
  //   for (let key in d) {
  //     if (cities.indexOf(key) > -1) {
  //       cityKey = key;
  //       break;
  //     }
  //   }
  //   return cityKey;
  // }

  function render(svg, data, cities, fillColors) {
    const result = svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("width", rectWidth)
      .attr("data-temperature", d => {
        return d["temperature"];
      })
      .attr("height", function(d) {
        // return height - yScale(d["temperature"]);
        return height - yScale(d["temperature"]) - margin.bottom;
      })
      .attr("x", function(d) {
        return xScale(d.date);
      })
      .attr("y", function(d) {
        return yScale(d["temperature"]) + margin.top;
      })
      .attr("fill", function(d) {
        const posOfCity = cities.indexOf(d.city);
        return fillColors[posOfCity];
      })
      .attr("stroke", "white");

    console.log("result: ", result);
  }

  const combinedData = [
    ...newYorkTemperatureData,
    ...sanFranciscoTemperatureData,
    ...austinTemperatureData
  ]
    .sort((a, b) => {
      if (a.temperature > b.temperature) {
        return 1;
      } else {
        return -1;
      }
    })
    .reverse();
  const cities = ["New York", "San Francisco", "Austin"];
  // const colors = ["rgba(255, 0, 0, 0.5)", "rgba(0, 0, 255, 0.5)"];
  const colors = ["red", "orange", "green"];
  render(svg, combinedData, cities, colors);

  const xAxis = d3.axisBottom().scale(xScale);
  xAxis.tickFormat(d => {
    // console.log("d: ", d);
    // return monthNames[d.getMonth()];
    return d3.timeFormat("%b")(d);
  });

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
