export default function basic() {
  const data = [100, 250, 175, 200, 120];
  const rectWidth = 100;
  const height = 300;
  const svg = d3.select("svg");

  // default
  // const enter = svg
  //   .selectAll("rect")
  //   .data(data)
  //   .enter()
  //   .append("rect")
  //   .attr("x", (d, i) => i * rectWidth)
  //   .attr("y", d => height - d)
  //   .attr("width", rectWidth)
  //   .attr("height", d => d)
  //   .attr("fill", "blue")
  //   .attr("stroke", "#fff");

  /************************************/
  // logs
  /************************************/
  // empty
  // const enter = svg.selectAll("rect");
  // console.log(enter);

  // data bound
  // const enter = svg.selectAll("rect").data(data);
  // console.log(enter);

  // data bound to each placeholder
  // const enter = svg
  //   .selectAll("rect")
  //   .data(data)
  //   .enter();
  // console.log(enter);

  // data bound to each rect
  // const enter = svg
  //   .selectAll("rect")
  //   .data(data)
  //   .enter()
  //   .append("rect");
  // console.log(enter);

  const enter = svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * rectWidth)
    .attr("y", d => height - d)
    .attr("width", rectWidth)
    .attr("height", d => d)
    .attr("fill", "blue")
    .attr("stroke", "#fff");
  console.log(enter);
}
