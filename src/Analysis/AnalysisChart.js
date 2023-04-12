import React, { useEffect, useRef } from 'react'
import * as d3 from "d3";
function AnalysisChart({d}) {

    const Chart_Area = useRef()
    const Group_Area = useRef()
    const x_Label = useRef()
    const y_Label = useRef()
    const x_axis = useRef()
    const y_axis = useRef()
    const groupRef = useRef()
    const tooltipRef = useRef();
    useEffect(()=>{     
        if(d.length > 0){
            const MARGIN = { LEFT: 100, RIGHT: 100, TOP: 50, BOTTOM: 100 }
        const WIDTH = 1600 - MARGIN.LEFT - MARGIN.RIGHT
        const HEIGHT = 600 - MARGIN.TOP - MARGIN.BOTTOM
        
          const svg = d3.select(Chart_Area.current)
          .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
          .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

          // Create a linear gradient
            const gradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", "gradient")
            .attr("x1", "10%")
            .attr("y1", "50%")
            .attr("x2", "200%")
            .attr("y2", "100%")
            .attr("stroke-opacity", "1");

            gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "blue")
            .attr("stop-opacity", 0.3);

            gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#fff")
            .attr("stop-opacity", 0);
          // .style("background", 'white')
   
          const g = d3.select(Group_Area.current)
          .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

          const xAxis = d3.select(x_axis.current)
          .attr("class", "x axis")
          .attr("transform", `translate(0, ${HEIGHT})`)

          const yAxis = d3.select(y_axis.current)
          .attr("class", "y axis")

          const xLabel = d3.select(x_Label.current)
          .attr("class", "x axisLabel")
          .attr("y", HEIGHT + 70)
          .attr("x", WIDTH / 2)
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .text("Dates")

        const yLabel = d3.select(y_Label.current)
          .attr("class", "y axisLabel")
          .attr("transform", "rotate(-90)")
          .attr("y", -60)
          .attr("x", -250)
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .text("Portfolio's Investment Activity ($)")


            
        
        console.log(d)

        const sellList = [];
        const buyList = []

        d.forEach(({ date, action, amount }) => {
        if (action === 'buy') {
            const index = buyList.findIndex(item => item.date === date);
            if (index !== -1) {
            buyList[index].amount += amount;
            } else {
            buyList.push({ date, amount });
            }
        } else if (action === 'sell') {
            const index = sellList.findIndex(item => item.date === date);
            if (index !== -1) {
            sellList[index].amount += amount;
            } else {
            sellList.push({ date, amount });
            }
        }
        });

        console.log(buyList)
        console.log(sellList)

for (let i = 0; i < sellList.length; i++) {
    const sellDate = sellList[i].date;
    const buyIndex = buyList.findIndex(buyItem => buyItem.date === sellDate);
    if (buyIndex === -1) {
      buyList.push({date: sellDate, amount: - sellList[i].amount});
      sellList.splice(i, 1);
    }
  }
  
  buyList.sort((a, b) => new Date(a.date) - new Date(b.date));
  console.log(buyList)
  console.log(sellList)

// initialize a new list to store the accumulated amounts
let accumulated = [];

// iterate over buy and accumulate amounts
for (let i = 0; i < buyList.length; i++) {
  let current = buyList[i];
  let prevAccumulated = accumulated.length ? accumulated[accumulated.length - 1].amount : 0;
  let total = prevAccumulated + current.amount;

  // check if current date is in sell
  let sellAmount = 0;
  for (let j = 0; j < sellList.length; j++) {
    if (sellList[j].date === current.date) {
      sellAmount = sellList[j].amount;
      
      break;
    }
  }

  // subtract sell amount if current date is in sell
  accumulated.push({ date: current.date, amount: total - sellAmount });


}

console.log(accumulated);

  // Create the x and y scales
  const xScale = d3.scaleTime()
    .domain(d3.extent(accumulated, d => new Date(d.date)))
    .range([0, WIDTH]);

  const yScale = d3.scaleLinear()
    .domain([d3.min(accumulated, d => d.amount), d3.max(accumulated, d => d.amount)])
    .range([HEIGHT, 0]);

         // axis generators
         const xAxisCall = d3.axisBottom().ticks(10)
         const yAxisCall = d3.axisLeft()
                     .ticks(10)

    xAxisCall.scale(xScale)
    xAxis.call(xAxisCall)
    yAxisCall.scale(yScale)
    yAxis.call(yAxisCall)

      // Create a line function
  const lineGenerator = d3.line()
        .x(d => xScale(new Date(d.date)))
        .y(d => yScale(d.amount));

        
  g
  .append('path')
  .datum(accumulated)
  .attr('fill', 'none')
  .attr('stroke-width', 4)
  .attr('d', lineGenerator)
  .style("stroke", "url(#gradient)")

  // Add data points
  g
  .selectAll(".data-point")
  .data(accumulated)
  .enter()
  .append("circle")
  .attr("class", "data-point")
  .attr("cx", (d) => xScale(new Date(d.date)))
  .attr("cy", (d) => yScale(d.amount))
  .attr("r", 5)
  .attr("fill", "grey")
  .on("mouseover", (event, d) => {
    const tooltip = d3.select(tooltipRef.current);
    tooltip.html(`Value: ${d.amount}`);
    tooltip.style("display", "inline-block");
  })
  .on("mousemove", (event) => {
    const tooltip = d3.select(tooltipRef.current);
    tooltip.style("left", event.pageX + 10 + "px");
    tooltip.style("top", event.pageY - 10 + "px");
  })
  .on("mouseout", () => {
    const tooltip = d3.select(tooltipRef.current);
    tooltip.style("display", "none");
  });

  if(accumulated.length>0){
    


  }

}

    },[d])
  return (
    <div>
      <div ref={tooltipRef} style={{ display: "none", position: "absolute" }} />
                <svg ref={Chart_Area} width="800" height="500">
                  <g ref={groupRef}>
                  </g>
                    <g ref={Group_Area}  >
                    <text className="y axisLabel" ref={y_Label}></text> 
                    <text className="x axisLabel" ref={x_Label}></text>
                    <g className="x axis" ref={x_axis}></g>
                    <g className="x axis" ref={y_axis}></g>
                    <g className="y axis" fill="none" font-size="10" font-family="sans-serif" text-anchor="end"></g>
                    </g>
                </svg>
    </div>
  )
}

export default AnalysisChart