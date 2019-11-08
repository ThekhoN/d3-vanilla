export default function lineChart() {
  const data = [
    {
      date: new Date(2007, 3, 24),
      value: 9
    },
    {
      date: new Date(2007, 3, 25),
      value: 9
    },
    {
      date: new Date(2007, 3, 26),
      value: 9
    },
    {
      date: new Date(2007, 3, 27),
      value: 9
    },
    {
      date: new Date(2007, 3, 30),
      value: 9
    },
    {
      date: new Date(2007, 4, 1),
      value: 9
    }
  ];

  const height = 480;
  const width = 640;

  // set the ranges
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  const line = d3
    .line()
    .x(d => {
      return x(d.date);
    })
    .y(d => {
      return y(d.value);
    });

  d3.select("svg")
    .append("path")
    .attr("d", line(data));
}
