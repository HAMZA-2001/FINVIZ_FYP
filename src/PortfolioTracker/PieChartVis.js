import React, { useEffect, useRef, useState } from 'react'
import * as d3 from "d3";
import { scaleOrdinal, select, zoomTransform } from 'd3';
import { type } from '@testing-library/user-event/dist/type';
import { Group } from '@material-ui/icons';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
// import data from "./dataie/donut1.csv"

function PieChartVis({Summary, PMS}) {
    const svgRef = useRef()
    const groupRef = useRef()
    const divRef = useRef()
    
    const [selectedData, setSelectedData] = useState("mc")

    var width = 600
    var height = 400
    var radius = Math.min(width, height) / 2
    var color = d3.scaleOrdinal(d3.schemeCategory10)
    var arc = d3.arc()
        .outerRadius(radius - 20)
        .innerRadius(radius - 80)
        

    var pie = d3.pie()
        .sort(null)
        .value(function(d){
            if(selectedData === "mc"){
                 return d.marketcap
            }if(selectedData === "shares"){
                return d.Total_Shares
            }if(selectedData === "pv"){
                return d.Position_Value
            }if(selectedData === "ap"){
                return d.Amount_Paid
            }if(selectedData === "costbasis"){
                let total = 0
                Summary.forEach(element => {
                    total = total + element.Amount_Paid
                });
                return (d.Amount_Paid/total)
            }
           
        })


    var svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
        .attr("class", "group")
        

    


    if (Summary.length > 0 ){
        let d = Summary

        var g = svg.selectAll(".arc")
            .data(pie(d))
            .enter().append("g")
            .attr("class", "arc")

            var div = d3.select(divRef.current)
            .attr("class", "tooltip-donut")
            .style("opacity", 0)
            .style("position", "absolute")
            .style('width', "10px")
            .style('height', "10px")


        g.append("path")
            .attr("d", arc)
            .style("fill", function(d,i){return color(i)})
            .on('mouseover', function (event, d) {
                d3.select(this).transition()
                .duration('50')
        
                div.transition()
                    .duration(50)
                    .style("opacity", "1");
                let num =  (d.data.marketcap).toFixed(2);
                div.html(num)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 15) + "px");
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

    function getSelectedValues(val){
        const yValue = val.target.value
        if (yValue === 'mc') {
            setSelectedData(yValue)
        }else if (yValue == 'shares') {
            setSelectedData(yValue)
        } else if (yValue === 'pv'){
            setSelectedData(yValue)
        }else if (yValue == 'ap'){
            setSelectedData(yValue)
        }else if(yValue == 'costbasis'){
            setSelectedData(yValue)
        }
     }

    useEffect(()=>{
        var svg = d3.select(svgRef.current)
        svg.selectAll(".group").remove()


        var svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
        .attr("class", "group")


        let d = Summary

        var g = svg.selectAll(".arc")
            .data(pie(d))
            .enter().append("g")
            .attr("class", "arc")

            var div = d3.select(divRef.current)
            .attr("class", "tooltip-donut")
            .style("opacity", 0)
            .style("position", "absolute")
            .style('width', "10px")
            .style('height', "10px")


        g.append("path")
            .attr("d", arc)
            .style("fill", function(d,i){return color(i)})
            .on('mouseover', function (event, d) {
                d3.select(this).transition()
                .duration('50')
        
                div.transition()
                    .duration(50)
                    .style("opacity", "1");
                    let num = 0
                    if(selectedData === "mc"){
                        num = (d.data.marketcap).toFixed(2);
                   }if(selectedData === "shares"){
                        num =  (d.data.Total_Shares)
                   }if(selectedData === "pv"){
                        num =  (d.data.Position_Value)
                    }if(selectedData === "ap"){
                        let total = 0
                        Summary.forEach(element => {
                            total = total + element.Amount_Paid
                        })
                        let cb = ((d.data.Amount_Paid/total)*100).toFixed(2)
                        num =  (d.data.Amount_Paid) + "  " + cb + "%" 
                    if(selectedData === "costbasis"){
                        num = ((d.data.Amount_Paid/total)*100) + "%"
                        }
                    }
            
                
                div.html(num)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 15) + "px");
                })
            .on('mouseout', function (d, i) {
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '1');
                div.transition()
                    .duration('50')
                    .style("opacity", 0);
        });

    },[selectedData])
  return (
    <div>

        <div>
        <select id="var-select" className="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 inline text-center" defaultValue={'M'} onChange = {getSelectedValues.bind(this)}>
                <option value="mc">Market Capitalization</option>
                <option value="shares">Shares</option>
                <option value="pv">Position Value</option>
                <option value="ap">Amount Paid</option>
                {/* <option value="costbasis">Cost Basis</option> */}
            </select>
        </div>
        <div ref={divRef}>
                
            </div>
        <svg ref={svgRef} width="800" height="500">

            <g ref={groupRef}>

            </g>
        </svg>
    </div>
  )
}

export default PieChartVis