import React, { useEffect, useRef } from 'react'
import * as d3 from "d3";


function StackedBarChart({Summary}) {

const svgRef = useRef()
const wrapperRef =  useRef()

let keys = ["buy", "hold", "sell", "strongBuy", "strongSell"]
let colors = {
   "buy": "white",
   "hold": "blue",
   "sell": "purple",
   "strongBuy": "pink",
   "strongSell": "red"
}


const svg = d3.select(svgRef.current)
    .attr("transform", `translate(0, ${30})`);
const WIDTH = 700 
const HEIGHT = 450 






if (Summary.length > 0){

    d3.json("https://finnhub.io/api/v1/stock/recommendation?symbol=AAPL&token=ce56182ad3ifdvthsqtgce56182ad3ifdvthsqu0").then(data=>{

            // stacks / layers
    const stackGenerator = d3.stack()
    .keys(keys)

    const layers = stackGenerator(data);
    const extent = [0,
        d3.max(layers, layer => d3.max(layer, sequence => sequence[1]))
    ];

    

        const xScale = d3.scaleBand()
        .domain(data.map(d=>d.period))
        .range([0, WIDTH])
        .paddingInner(0.3)
        .paddingOuter(0.2)

        const xAxis = d3.axisBottom(xScale);
        svg
          .select(".x-axis")
          .attr("transform", `translate(0, ${HEIGHT})`)
          .call(xAxis);


        const yScale = d3.scaleLinear()
          .domain(extent)
          .range([HEIGHT, 0]);

        const yAxis = d3.axisLeft(yScale);
          svg.select(".y-axis").call(yAxis);

          svg
            .selectAll(".layer")
            .data(layers)
            .join("g")
            .attr("class", "layer")
            .attr("fill", layer => colors[layer.key])
            .selectAll("rect")
            .data(layer => layer)
            .join("rect")
            .attr("x", sequence => xScale(sequence.data.period))
            .attr("width", xScale.bandwidth)
            .attr("y", sequence => yScale(sequence[1]))
            .attr("height", sequence => yScale(sequence[0]) - yScale(sequence[1]));
    })
}


  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
        <svg ref={svgRef} width="800" height="500">
            <g className="x-axis" />
            <g className="y-axis" />
            {/* <g ref={groupRef}>

            </g> */}
        </svg>
    </div>
  )
}

export default StackedBarChart