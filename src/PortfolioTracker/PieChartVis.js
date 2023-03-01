import React, { useEffect, useRef, useState } from 'react'
import * as d3 from "d3";
import { scaleOrdinal, select, zoomTransform } from 'd3';
import { type } from '@testing-library/user-event/dist/type';
import { Group } from '@material-ui/icons';
import { FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select } from '@material-ui/core';
import { click } from '@testing-library/user-event/dist/click';
import slider from './slider.svg'
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

        // g.append("text")
        // .attr("transform", function(d){
        //     d.innerRadius = radius - 80;
        //     d.outerRadius = radius - 20;
        //     return "translate(" + arc.centroid(d) + ")";
        //     })
        //     .attr("text-anchor", "middle")
        //     .text( function(d, i) {
        //     return (d.data.Symbol)}
        //     );

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

     const contentRef = useRef()
     let clicked = false
     let clickedIdx = 0

    useEffect(()=>{

        // var arcOver = d3.arc()
        // .outerRadius(radius + 29);

        var arcOver = d3.arc()
            .outerRadius(radius)
            .innerRadius(radius - 80)

        var arcOut = d3.arc()
        .outerRadius(radius - 20)
        .innerRadius(radius - 80)
        
       
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
                .style("opacity", 1)
                .style("position", "absolute")
                .style('width', "50px")
                .style('height', "50px")
                .attr("color", "blue")

            var form = d3.select(contentRef.current)

            
     


        g.append("path")
            .attr("d", arc)
            .style("fill", function(d,i){return color(i)})
            .on('mouseover', function (event, d) {
                d3.select(this).transition()
                .duration('50')
                .attr("d", arcOver)             
                .attr("stroke-width",16);
        
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
            
                let rb = `  <label for="html">HTML</label>
                                <input type="radio" id="html" name="fav_language" value="HTML">
                                <label for="html">HTML</label>
                                <input type="radio" id="html" name="fav_language" value="HTML">
                                <label for="html">HTML</label>
                                <input type="radio" id="html" name="fav_language" value="HTML">`

                let hoverIMG = `<img class="rounded-full h-12 w-12  object-cover" src= ${d.data.logo} alt=""/>`
                let fill = "<h1>"+ num +"</h1>" + hoverIMG
                
                div.html(fill)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 15) + "px");
                })
            .on('mouseout', function (d, i) {
                console.log(i.index, clickedIdx)
                //makes arc smaller
                if(!clicked){
                    d3.select(this).transition()
                    .duration('50')
                    .attr("d", arcOut)             
                    .attr("stroke-width",6)
                    .attr('opacity', '1');
                    div.transition()
                    .duration('50')
                    .style("opacity", 0);

                // makes arc bigger
                }else if(clicked && i.index === clickedIdx){
                    clicked = false
                    d3.select(this).transition()
                    .duration('50')
                    .attr("d", arcOver)             
                    .attr("stroke-width",6)
                    .attr('opacity', '1');
                    div.transition()
                    .duration('50')
                    .style("opacity", 1);

                    // want to make a div to stay when the user click on the pie chart
                    // svg.append("div")

                }


                
                })
            .on('click', function(d, i){
                // user clicks this then 
                if(!clicked){
                    clicked = !clicked
                    clickedIdx = i.index
                }

                // console.log(i)
                // setclicked(false)
                // target the index

                
               
                console.log(clicked)
                console.log(clickedIdx)
                // if (!click) {
                //     d3.select(this).transition()
                //     .duration('50')
                //     .attr("d", arcOver)             
                //     .attr("stroke-width",6)
                //     .attr('opacity', '1');
                //     div.transition()
                //     .duration('50')
                //     .style("opacity", 1);
                //     setclick(true)
                // }else{
                //     d3.select(this).transition()
                //     .duration('50')
                //     .attr("d", arcOver)             
                //     .attr("stroke-width",6)
                //     .attr('opacity', '1');
                //      div.transition()
                //     .duration('50')
                //     .style("opacity", 0);
                //     setclick(false)
                // }
            })
        ;

        g.append("text")
        .attr("transform", function(d){
            d.innerRadius = radius - 80;
            d.outerRadius = radius - 20;
            return "translate(" + arc.centroid(d) + ")";
            })
            .attr("text-anchor", "middle")
            .text( function(d, i) {
            return (d.data.Symbol)}
            );

        // g.append(slider)
        // const innerGroup = g.append("g").attr("stroke", "lightgrey")
        //         .attr("width", "50px")
        //         .attr("height", "5px")
        //         .attr("transform", function(d){
        //             d.innerRadius = radius - 80;
        //             d.outerRadius = radius - 20;
        //             return "translate(" + arc.centroid(d) + ")";
        //             })
        //         .attr("text-anchor", "middle")
        //         .attr("fill", "white")



        // innerGroup.append("svg")
        //     .attr("class", "slider")
        //     .attr("d", "M 50 50 A 125 125 0 0 0 300 50")
        //     .attr("fill", "white")

        // var slider = d3
        // .sliderBottom()
        // .min(0)
        // .max(255)
        // .step(1)
        // .width(300)
        // .ticks(0)
        // .default(rgb[i])
        // .displayValue(false)

        g.append('rect')
            .attr('width', 20)
            .attr('height', 30)
            .attr('stroke', 'black')
            .attr('fill', '#69a3b2')
            .attr("width", "30px")
                .attr("height", "5px")
              //  .attr("transform", "rotate(90)")
                .attr("transform", function(d){
                    console.log(d)
                    d.innerRadius = radius - 80;
                    d.outerRadius = radius - 20;
                    console.log(arc.centroid(d))
                    console.log(((arc.centroid(d)[1]/arc.centroid(d)[0])))
                    return "translate(" + [arc.centroid(d)] + ") rotate( " + ((180 - (arc.centroid(d)[1]/arc.centroid(d)[0]))) + ")";
                    })
                .attr("text-anchor", "middle")
             
                // .attr("fill", "white");

        // slider
        // const innerGroup = g.append("g")
        //             .attr("transform", function(d){
        //                 console.log(d)
        //             d.innerRadius = radius - 80;
        //             d.outerRadius = radius - 20;
        //             return "translate(" + arc.centroid(d) + ")";
        //             })
        //             .attr("text-anchor", "middle")

        // const innerSVG = innerGroup.append('svg')
        // innerSVG.append("path").attr("d", "M21,11H17.81573a2.98208,2.98208,0,0,0-5.63146,0H3a1,1,0,0,0,0,2h9.18433a2.982,2.982,0,0,0,5.6314,0H21a1,1,0,0,0,0-2Zm-6,2a1,1,0,1,1,1-1A1.0013,1.0013,0,0,1,15,13Z")

    },[selectedData])

    function handleInputChange(event){
        console.log("hi")
    }
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

        <div className='flex'>
    	    <div>
            <FormControl>
            <RadioGroup
                column
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
            >
                <FormControlLabel value="marketcap" control={<Radio />} label="Target Allocation" onChange={handleInputChange.bind(this)} />
                <FormControlLabel value="AverageCostPerShare" control={<Radio />} label="P/E" onChange={handleInputChange.bind(this)} />
                <FormControlLabel value="Total_Return" control={<Radio />} label="52 eeek range" onChange={handleInputChange.bind(this)}/>
                <FormControlLabel value="Current_Price" control={<Radio />} label="Beta" onChange={handleInputChange.bind(this)}/>
                <FormControlLabel value="Highest_price" control={<Radio />} label="EPS" onChange={handleInputChange.bind(this)}/>


                <FormControlLabel
                value="disabled"
                disabled
                control={<Radio />}
                label="other"
                />
                </RadioGroup>
            </FormControl>
            </div>
            <div ref={divRef} className='bg-white'>
                {/* <button ref={contentRef} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                    Button
                    </button> */}
            </div>
            <svg ref={svgRef} width="800" height="500">
                <g ref={groupRef}>
                </g>
            </svg>
        </div>


    </div>
  )
}

export default PieChartVis