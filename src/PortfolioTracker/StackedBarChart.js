import React, { useEffect, useRef, useState } from 'react'
import * as d3 from "d3";


function StackedBarChart({Summary}) {

const svgRef = useRef()
const wrapperRef =  useRef()
const groupRef =  useRef()

let keys = ["buy", "hold", "sell", "strongBuy", "strongSell"]
let colors = {
   "buy": "white",
   "hold": "blue",
   "sell": "purple",
   "strongBuy": "pink",
   "strongSell": "red"
}

const divRef = useRef()

var div = d3.select(divRef.current)
  .attr("class", "tooltip-donut")
  .style("opacity", 0)
  .style("position", "absolute")
  .style('width', "100px")
  .style('height', "100px")
  .style("background-color", "#373434")
  .style("border-radius", "50%")
  .style("display", "flex")
  .style("flex-direction", "column")
  .style("justify-content", "center")
  .style("font-size", "20px")


const svg = d3.select(svgRef.current)
    .attr("transform", `translate(0, ${60})`);
const WIDTH = 700 
const HEIGHT = 450 

//         // Y label
// const yLabel = d3.select(yLabel.current)
//         .attr("class", "y axis-label")
//         .attr("x", - (HEIGHT / 2))
//         .attr("y", -60)
//         .attr("font-size", "20px")
//         .attr("text-anchor", "middle")
//         .attr("transform", "rotate(-90)")

var color = d3.scaleOrdinal(d3.schemeCategory10)

const [getSummary, setSummary] = useState([])

const t = d3.transition().duration(750)



function plotStackedBarChart(symbol){
 // const t = d3.transition().duration(750)
  d3.selectAll(".layer")
  .remove()
  d3.json(`https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=ce56182ad3ifdvthsqtgce56182ad3ifdvthsqu0`).then(data=>{

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

  const yAxis = d3.axisLeft(yScale)
  svg.select(".y-axis")
  .attr("transform", `translate(${20}, 0)`).transition().call(yAxis)
  
svg
  .selectAll(".layer")
  .data(layers)
  .join("g")
  .attr("class", "layer")
  .attr("fill", layer => color(layer.index))
  .selectAll("rect")
  .data(layer => layer)
  .join("rect")
  .attr("x", sequence => xScale(sequence.data.period))
  .attr("width", xScale.bandwidth)
  .on("mouseover", function (event, d) {
    console.log(d)
    d3.select(this)
      .transition()
      .duration(200)
      .attr('height', d => (HEIGHT - yScale(d[1])) )

    let displayText = d[1]-d[0]
    div.style("opacity", "1");
    let fill = "<h1>"+ displayText + "</h1>"
    div.html(fill)
    .style("z-index", 2)
    .style("left", (event.pageX + 10) + "px")
    .style("top", (event.pageY - 15) + "px");

  })
  .on('mouseout', function (d) {
    d3.select(this)
      .transition()
      .duration(200)
      .attr('height', d => yScale(d[0]) - yScale(d[1]))
    
    div.style("opacity", 0);
  })

  .transition()
  .attr("y", sequence => yScale(sequence[1]))
  .attr("height", sequence => yScale(sequence[0]) - yScale(sequence[1]))
  
  d3.selectAll(".layer").transition().duration(500)




  // Create the legend
  var legend = d3.select(groupRef.current)
  .attr("class", "legend")
  .attr("transform", "translate(" + (WIDTH ) + "," + 20 + ")")
  .selectAll("g")
  .data(keys)
  .enter().append("g")
  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", function(d, i) { return color(i) });

  legend.append("text")
  .attr("x", 24)
  .attr("y", 9)
  .attr("dy", ".35em")
  .attr("fill", "white" )
  .text(function(d) { return d });

  })
}


if (Summary.length > 0){
    plotStackedBarChart(Summary[0].Symbol)
    // d3.json("https://finnhub.io/api/v1/stock/recommendation?symbol=AAPL&token=ce56182ad3ifdvthsqtgce56182ad3ifdvthsqu0").then(data=>{

    //         // stacks / layers
    // const stackGenerator = d3.stack()
    // .keys(keys)

    // const layers = stackGenerator(data);
    // const extent = [0,
    //     d3.max(layers, layer => d3.max(layer, sequence => sequence[1]))
    // ];

    

    //     const xScale = d3.scaleBand()
    //     .domain(data.map(d=>d.period))
    //     .range([0, WIDTH])
    //     .paddingInner(0.3)
    //     .paddingOuter(0.2)

    //     const xAxis = d3.axisBottom(xScale);
    //     svg
    //       .select(".x-axis")
    //       .attr("transform", `translate(0, ${HEIGHT})`)
    //       .call(xAxis);


    //     const yScale = d3.scaleLinear()
    //       .domain(extent)
    //       .range([HEIGHT, 0]);

    //     const yAxis = d3.axisLeft(yScale);
    //       svg.select(".y-axis").call(yAxis);

    //       svg
    //         .selectAll(".layer")
    //         .data(layers)
    //         .join("g")
    //         .attr("class", "layer")
    //         .attr("fill", layer => color(layer.index))
    //         .selectAll("rect")
    //         .data(layer => layer)
    //         .join("rect")
    //         .attr("x", sequence => xScale(sequence.data.period))
    //         .attr("width", xScale.bandwidth)
    //         .attr("y", sequence => yScale(sequence[1]))
    //         .attr("height", sequence => yScale(sequence[0]) - yScale(sequence[1]));


    //       // Create the legend
    //       var legend = d3.select(groupRef.current)
    //       .attr("class", "legend")
    //       .attr("transform", "translate(" + (WIDTH ) + "," + 20 + ")")
    //       .selectAll("g")
    //       .data(keys)
    //       .enter().append("g")
    //       .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
  
    //       legend.append("rect")
    //       .attr("width", 18)
    //       .attr("height", 18)
    //       .style("fill", function(d, i) { return color(i) });
  
    //       legend.append("text")
    //       .attr("x", 24)
    //       .attr("y", 9)
    //       .attr("dy", ".35em")
    //       .attr("fill", "white" )
    //       .text(function(d) { return d });

    // })
  
}


useEffect(()=>{
  if(Summary.length>0){
    setSummary(Summary)
  }
},[Summary])

function getSelectedValues(event){
    console.log(event.target.value)
    plotStackedBarChart(event.target.value)
}


  return (
    <div  className="pb-32" ref={wrapperRef} style={{ marginBottom: "2rem" }}>
            <div>
              {console.log(getSummary)}
                <select id="var-select" className="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 inline text-center" defaultValue={'M'} onChange = {getSelectedValues.bind(this)}>
                  {getSummary.length>0 && getSummary.map((item) => {
                    return <option value= {"" + item.Symbol + ""}>{item.Symbol}</option>
                  })}
        
              </select>
        </div>
        <div ref={divRef}></div>
        <svg   ref={svgRef} width="800" height="500">
                <g ref={groupRef}>

                </g>
            <g className="x-axis" />
            <g className="y-axis" />
        </svg>
    </div>
  )
}

export default StackedBarChart