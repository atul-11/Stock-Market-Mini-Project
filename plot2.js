const api = "https://stocks3.onrender.com/api/stocks/getstocksdata";

function extractData(companyName, scaleRange) {
  return fetch(api)
    .then((response) => response.json())
    .then((response) => {
      const stocksData = response.stocksData[0];
      const value = stocksData[companyName];
      const timeStamp1month = value[scaleRange].timeStamp;
      const value1month = value[scaleRange].value;

      let arr = [];

      for (let time in timeStamp1month) {
        const new_timeStamp = new Date(timeStamp1month[time] * 1000);
        const valueStamp = value1month[time];
        arr.push({
          date: new_timeStamp,
          value: valueStamp,
        });
      }

      return arr;
    });
}

function drawChart(dataset) {
  console.log(dataset);
  d3.select("#chart-container").selectAll("*").remove();
  //Set Dimensions and margins for the chart
  const margin = { top: 50, right: 50, bottom: 50, left: 50 };
  const width = 1200 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  //Set up the x and y scales
  const x = d3.scaleTime().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);

  //Create SVG element and append it to the chart container
  const svg = d3
    .select("#chart-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  //Define x and y domains
  x.domain(d3.extent(dataset, (d) => d.date));
  y.domain(d3.extent(dataset, (d) => d.value));

  //Add the x-axis
  // svg
  //   .append("g")
  //   .attr("transform", `translate(0, ${height})`)
  //   .call(d3.axisBottom(x))
  //   .select(".domain")
  //   .attr("x", 6)
  //   .attr("dx", "0.71em")
  //   .attr("text-anchor", "middle")
  //   .text("Date")
  //   .style("font-size", "16px");

  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .style("font-size", "10px")
    .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %Y")))
    .call((g) => g.select(".domain").remove())
    .selectAll(".tick line");
  svg.selectAll(".tick text").attr("fill", "#777");

  //Add the y-axis
  //svg.append("g").call(d3.axisLeft(y));
  svg
    .append("g")
    .style("font-size", "10px")
    .call(d3.axisLeft(y))
    .call((g) => g.select(".domain").remove())
    .selectAll(".tick text")
    .style("fill", "#777");

  //Add vertical grid lines
  svg
    .selectAll("xGrid")
    .data(x.ticks().slice(1))
    .join("line")
    .attr("x1", (d) => x(d))
    .attr("x2", (d) => x(d))
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke", "#D0D3D4")
    .attr("stroke-width", 0.5);

  //Add horizontal grid lines
  svg
    .selectAll("yGrid")
    .data(y.ticks().slice(1))
    .join("line")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", (d) => y(d))
    .attr("y2", (d) => y(d))
    .attr("stroke", "#D0D3D4")
    .attr("stroke-width", 0.5);

  //Create the line generator
  const line = d3
    .line()
    .x((d) => x(d.date))
    .y((d) => y(d.value));

  //Add the line path to the SVG element
  svg
    .append("path")
    .datum(dataset)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 3)
    .attr("d", line);

  //Add chart title
  // svg
  //   .append("text")
  //   .attr("class", "chart-title")
  //   .attr("x", margin.left - 115)
  //   .attr("y", margin.top - 100)
  //   .style("font-size", "24px")
  //   .style("font-weight", "bold")
  //   .style("font-family", "san-serif")
  //   .text("asdfa asdfaf asdf");

  //Add Y-axis label
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .style("fill", "#777")
    .text("Value in $");

  //Create tooltip
  const tooltip = d3.select("body").append("div").attr("class", "tooltip");

  //Add a circle element
  const circle = svg
    .append("circle")
    .attr("r", 0)
    .attr("fill", "steelblue")
    .style("stroke", "white")
    .attr("opacity", 0.7)
    .style("pointer-events", "none");

  //Create the SVG element and append it to the chart container
  const listeningRect = svg
    .append("rect")
    .attr("width", width)
    .attr("height", height);

  //Create a listening rectangle
  listeningRect.on("mousemove", function (event) {
    const [xCoord] = d3.pointer(event, this);
    const bisectDate = d3.bisector((d) => d.date).left;
    const x0 = x.invert(xCoord);
    const i = bisectDate(dataset, x0, 1);
    const d0 = dataset[i - 1];
    const d1 = dataset[i];
    const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    const xPos = x(d.date);
    const yPos = y(d.value);

    //Update the circle position
    circle.attr("cx", xPos).attr("cy", yPos);
    console.log(xPos);

    //Add transition for the circle radius
    circle.transition().duration(50).attr("r", 5);

    //Add in our tooltip
    tooltip
      .style("display", "block")
      .style("left", `${xPos + 100}px`)
      .style("top", `${yPos + 50}px`)
      .html(
        `<strong>Date: </strong> ${d.date.toLocaleDateString()}<br><strong>Value: </strong> ${
          d.value !== undefined ? d.value.toFixed(2) : "N/A"
        }`
      );
  });

  // listening rectangle mouse leave function
  listeningRect.on("mouseleave", function () {
    circle.transition().duration(50).attr("r", 0);
    tooltip.style("display", "none");
  });
}
