import React, { useEffect, useRef, useState } from 'react'
import * as d3 from "d3";
import { scaleOrdinal, select, zoomTransform } from 'd3';
import { type } from '@testing-library/user-event/dist/type';
// import data from "./dataie/donut1.csv"

function PieChartVis({Summary}) {
    const svgRef = useRef()
    const groupRef = useRef()

    var width = 600
    var height = 400
    var radius = Math.min(width, height) / 2
    var color = d3.scaleOrdinal(d3.schemeCategory10)
    var arc = d3.arc()
        .outerRadius(radius - 20)
        .innerRadius(radius - 80)

    var pie = d3.pie()
        .sort(null)
        .value(function(d){return d.Total_Shares})

    var svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width/2 + "," + height/2 + ")")

    function type(d){
        d.population = +d.population
        return d
    }

    if (Summary.length > 0 ){
        let d = Summary
        console.log(Summary)
        console.log(pie(d))

        var g = svg.selectAll(".arc")
            .data(pie(d))
            .enter().append("g")
            .attr("class", "arc")

        g.append("path")
            .attr("d", arc)
            .style("fill", function(d){return color(d.data.Symbol)})

          // Create the legend
          var legend = d3.select(groupRef.current)
          .attr("class", "legend")
          .attr("transform", "translate(" + (width - 100) + "," + 20 + ")")
          .selectAll("g")
          .data(Summary)
          .enter().append("g")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
  
          legend.append("rect")
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", function(d, i) { return color(i); });
  
          legend.append("text")
          .attr("x", 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .text(function(d) { return d.Symbol; });
    }
    
    const [data, setdata] = useState([])
    useEffect(()=>{
       
        if (Summary.length > 0 ){
            // let d = Summary
            // setdata(d)
            // console.log(Summary)
            // console.log(pie(d))

            // var g = svg.selectAll(".arc")
            //     .data(pie(Summary))
            //     .enter().append("g")
            //     .attr("class", "arc")

            // g.append("path")
            //     .attr("d", arc)
            //     .style("fill", function(d){return color(d.data.Symbol)})

            //   // Create the legend
            //   var legend = d3.select(groupRef.current)
            //   .attr("class", "legend")
            //   .attr("transform", "translate(" + (width - 100) + "," + 20 + ")")
            //   .selectAll("g")
            //   .data(Summary)
            //   .enter().append("g")
            //   .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
      
            //   legend.append("rect")
            //   .attr("width", 18)
            //   .attr("height", 18)
            //   .style("fill", function(d, i) { return color(i); });
      
            //   legend.append("text")
            //   .attr("x", 24)
            //   .attr("y", 9)
            //   .attr("dy", ".35em")
            //   .text(function(d) { return d.Symbol; });
        }

        // d3.csv("./donut1.csv").then(data=>{
        //     console.log(data)
        //     console.log(pie(data))

        //     var g = svg.selectAll(".arc")
        //         .data(pie(data))
        //         .enter().append("g")
        //         .attr("class", "arc")

        //     g.append("path")
        //         .attr("d", arc)
        //         .style("fill", function(d){return color(d.data.age)})

        //       // Create the legend
        //       var legend = d3.select(groupRef.current)
        //       .attr("class", "legend")
        //       .attr("transform", "translate(" + (width - 100) + "," + 20 + ")")
        //       .selectAll("g")
        //       .data(data)
        //       .enter().append("g")
        //       .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
      
        //       legend.append("rect")
        //       .attr("width", 18)
        //       .attr("height", 18)
        //       .style("fill", function(d, i) { return color(i); });
      
        //       legend.append("text")
        //       .attr("x", 24)
        //       .attr("y", 9)
        //       .attr("dy", ".35em")
        //       .text(function(d) { return d.age; });
        // })
    },[Symbol])

    useEffect(()=>{
        console.log(pie(data))

        // var g = svg.selectAll(".arc")
        //     .data(pie(Summary))
        //     .enter().append("g")
        //     .attr("class", "arc")

        // g.append("path")
        //     .attr("d", arc)
        //     .style("fill", function(d){return color(d.data.Symbol)})

        //   // Create the legend
        //   var legend = d3.select(groupRef.current)
        //   .attr("class", "legend")
        //   .attr("transform", "translate(" + (width - 100) + "," + 20 + ")")
        //   .selectAll("g")
        //   .data(Summary)
        //   .enter().append("g")
        //   .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
  
        //   legend.append("rect")
        //   .attr("width", 18)
        //   .attr("height", 18)
        //   .style("fill", function(d, i) { return color(i); });
  
        //   legend.append("text")
        //   .attr("x", 24)
        //   .attr("y", 9)
        //   .attr("dy", ".35em")
        //   .text(function(d) { return d.Symbol; });
    },[data])
  return (
    <div>
        <svg ref={svgRef} width="800" height="500">
                    <g ref={groupRef}>

                    </g>
        </svg>
    </div>
  )
}

export default PieChartVis