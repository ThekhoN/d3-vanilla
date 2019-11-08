import "../styles/basic.css";

export default function basic() {
  const data = [100, 250, 175, 200, 120];
  const rectWidth = 100;
  const height = 300;

  var rect = d3
    .selectAll("rect")
    .data(data)
    .attr("x", (d, i) => i * rectWidth)
    .attr("y", d => height - d)
    .attr("width", rectWidth)
    .attr("height", d => d)
    .attr("fill", "blue")
    .attr("stroke", "#fff");
}
