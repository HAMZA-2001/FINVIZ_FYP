import React, { useEffect, useRef, useState } from 'react'
import * as d3 from "d3";
import { scaleOrdinal, select, zoomTransform } from 'd3';
import { type } from '@testing-library/user-event/dist/type';
import { Group } from '@material-ui/icons';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
// import data from "./dataie/donut1.csv"

function PieChartVis({Summary}) {
    const svgRef = useRef()
    const groupRef = useRef()
    
    const [selectedData, setSelectedData] = useState("mc")

    var width = 600
    var height = 400
    var radius = Math.min(width, height) / 2
    var color = d3.scaleOrdinal(d3.schemeCategory10)
    var arc = d3.arc()
        .outerRadius(radius - 20)
        .innerRadius(radius - 80)
        
    // function arcTween(d) {
    //         var i = d3.interpolate(groupRef.current, d);
    //         groupRef.current = i(1)
    //         return function(t) { return arc(i(t)); };
    //     }

    var pie = d3.pie()
        .sort(null)
        .value(function(d){
            if(selectedData === "mc"){
                 return d.marketcap
            }if(selectedData === "shares"){
                return d.Total_Shares
            }
           
        })


    var svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
        .attr("class", "group")
        
    var div = d3.select(svgRef.current).append("div")
        .attr("class", "tooltip-donut")
        .style("opacity", 0);

    


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
            .style("fill", function(d,i){return color(i)})
            .on('mouseover', function (d, i) {
                console.log("hey")
                d3.select(this).transition()
                .duration('50')
                .attr('opacity', '.85');
           div.transition()
                .duration(50)
                .style("opacity", 100);
          // let num = (Math.round((d.value / d.data.all) * 100)).toString() + '%';
        //    div.html(num)
        //         .style("left", (d3.event.pageX + 10) + "px")
        //         .style("top", (d3.event.pageY - 15) + "px");
      })
           .on('mouseout', function (d, i) {
                d3.select(this).transition()
                     .duration('50')
                     .attr('opacity', '1');
                div.transition()
                     .duration('50')
                     .style("opacity", 0);
           });

        // var path = svg.selectAll('path')

            // .transition()
            // .duration(750)
            // .attrTween("d", arcTween)

          // Create the legend
          var legend = d3.select(groupRef.current)
          .attr("class", "legend")
          .attr("transform", "translate(" + (width - 80) + "," + 20 + ")")
          .selectAll("g")
          .data(Summary)
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


    function getSelectedValues(val){
        const yValue = val.target.value
        if (yValue == 'mc') {
            setSelectedData(yValue)
        }else if (yValue == 'sector') {
            setSelectedData(yValue)
        } else if (yValue == 'shares'){
            setSelectedData(yValue)
        }else if (yValue == 'allocation'){
            setSelectedData(yValue)
        }else if(yValue == 'costbasis'){
            setSelectedData(yValue)
        }
     }

    useEffect(()=>{
        var svg = d3.select(svgRef.current)
        svg.selectAll(".group").remove()
        // var path = svg.selectAll("path");
        // path.exit().remove()
        console.log(pie(data))

        var svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
        .attr("class", "group")


        let d = Summary
        console.log(Summary)
        console.log(pie(d))

        var g = svg.selectAll(".arc")
            .data(pie(d))
            .enter().append("g")
            .attr("class", "arc")

        g.append("path")
            .attr("d", arc)
            .style("fill", function(d,i){return color(i)})
        

    },[selectedData])
  return (
    <div>

        <div>
        <select id="var-select" className="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 inline text-center" defaultValue={'M'} onChange = {getSelectedValues.bind(this)}>
                <option value="mc">Market Capitalization</option>
                <option value="shares">Shares</option>
                <option value="sector">Sector</option>
                <option value="allocation">Allocation</option>
                <option value="costbasis">Cost Basis</option>
            </select>
        </div>

        <svg ref={svgRef} width="800" height="500">
            <g ref={groupRef}>

            </g>
        </svg>
    </div>
  )
}

export default PieChartVis