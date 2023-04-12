import { getDatabase, onValue, ref } from 'firebase/database'
import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../Authentication/context/AuthContext'
import * as d3 from "d3";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@material-ui/core';

function BarChartVis({Summary, PMS}) {
    const [dbItems, setdbItems] = useState([])
    const {currentUser} = useAuth()

    const svgRef = useRef()
    const groupRef = useRef()
    const y_Label = useRef()

    const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 80, BOTTOM: 100 }
    const WIDTH = 700 - MARGIN.LEFT - MARGIN.RIGHT
    const HEIGHT = 450 - MARGIN.TOP - MARGIN.BOTTOM

    // let flag = true
    const [flag, setflag] = useState(true)

    const svg = d3.select(svgRef.current)
        .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
        .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

    const g = d3.select(groupRef.current)
            .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

        
        // X label
        g.append("text")
        .attr("class", "x axis-label")
        .attr("x", WIDTH / 2)
        .attr("y", HEIGHT + 60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .text("Stocks")
    
        // Y label
        const yLabel = d3.select(y_Label.current)
        .attr("class", "y-axis-label")
        .attr("x", - (HEIGHT / 2))
        .attr("y", -60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("fill", "white")
        
        
        const x = d3.scaleBand()
        .range([0, WIDTH])
        .paddingInner(0.3)
        .paddingOuter(0.2)
    
        const y = d3.scaleLinear()
        .range([HEIGHT, 0])
    
        const xAxisGroup = g.append("g")
        .attr("class", "x_axis")

    
        const yAxisGroup = g.append("g")
        .attr("class", "y axis")

    const [selectedValues , setSelectedValues] = useState("")

    function handleInputChange (event){

    //  d3.selectAll(".y-axis-label").remove()
        const val = event.target.value
        console.log(val)
        if(val === "marketcap"){
            yLabel.text("Market Cap")
        }else if(val === "AverageCostPerShare"){
            yLabel.text("Avg Cost Per Share")
        }else if(val === "Total_Return"){
            yLabel.text("Total Return")
        }else if(val === "Current_Price"){
            yLabel.text("Current Price")
        }else if(val === "Highest_price"){
            yLabel.text("Highest Price")
        }
        setSelectedValues(val)

    }

        useEffect(() => {
            

            const t = d3.transition().duration(750)
            var g = d3.select(groupRef.current)
            g.selectAll(".rect").transition(t)
            .attr("height", 0)
            .attr("y", 0)
            .remove()

            g.selectAll(".tick")
            .attr("height", 0)
            .attr("y", 0)
            .remove()

            d3.selectAll(".x_axis").transition().duration(3).remove()

            update(Summary, selectedValues)
            function update(data, yValue) {
                console.log(yValue)
                console.log(data)
                const value = "marketcap"
                const t = d3.transition().duration(750)

                
              
                x.domain(data.map(d => d.Symbol))

                // Set the minimum value of the y domain to 0
            
                if (d3.min(data, d => d[yValue]) >= 0) {
                    y.domain([0, d3.max(data, d => d[yValue])])
                    xAxisGroup.attr("transform", `translate(0, ${HEIGHT})`)
                } else {
                    y.domain([d3.min(data, d => d[yValue]) - 100, d3.max(data, d => d[yValue])])
                    const axispos = y(0)
                    xAxisGroup.attr("transform", `translate(0, ${axispos})`)
                    
                }


                console.log(d3.min(data, d => d[yValue]))
                console.log( d3.max(data, d => d[yValue]))

                const xAxisCall = d3.axisBottom(x)
                xAxisGroup.transition(t).call(xAxisCall)
                  .selectAll("text")
                    .attr("y", "10")
                    .attr("x", "-5")
                    .attr("text-anchor", "end")
                    .attr("transform", "rotate(-40)")
              
                const yAxisCall = d3.axisLeft(y)
                  .ticks(8)
                  .tickFormat(d => d + "")
                yAxisGroup.transition(t).call(yAxisCall)
              
                //JOIN new data with old elements.
                const rects = g.selectAll("rect")
                  .data(data, d => d.Symbol)
              
                // ENTER new elements present in new data...
                rects.enter().append("rect")
                  .attr("fill", d => d[yValue] < 0 ? "red" : "green")
                  .attr("class", "rect")
                  .attr("y", y(0))
                  .attr("height", 0)
                  // AND UPDATE old elements present in new data.
                  .merge(rects)
                  .transition(t)
                    .attr("x", (d) => x(d.Symbol))
                    .attr("width", x.bandwidth)
                    .attr("y", d => d[yValue] < 0 ? y(0) : y(d[yValue]))
                    .attr("fill", d => d[yValue] < 0 ? "red" : "green")
                    .attr("height", d => {
                        console.log(d[yValue])
                        if (d[yValue]>=0){
                                return (Math.abs(y(d[yValue])-y(0)))
                            }else{
                                return (Math.abs(y(d[yValue])-y(0)))
                            }
                        }   
                        
                        )
              }
            
        }, [selectedValues]);



  function reteriveData(){
        let dbcontents = []
        onValue(ref(getDatabase(), 'users/' + currentUser.uid + '/tickers'), (snapshot) => {
            Object.values(snapshot.val()).map((project, item) => {  
                    dbcontents.push(project)

                })     
            }
            )

        return dbcontents
    }

  return (
    <div>
        <FormControl>
            <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
            >
                <FormControlLabel value="marketcap" control={<Radio />} label="Market Capitalization" onChange={handleInputChange.bind(this)} />
                <FormControlLabel value="AverageCostPerShare" control={<Radio />} label="Unit Basis" onChange={handleInputChange.bind(this)} />
                <FormControlLabel value="Total_Return" control={<Radio />} label="Total Return" onChange={handleInputChange.bind(this)}/>
                <FormControlLabel value="Current_Price" control={<Radio />} label="Current Price" onChange={handleInputChange.bind(this)}/>
                <FormControlLabel value="Highest_price" control={<Radio />} label="Highest Price" onChange={handleInputChange.bind(this)}/>


                <FormControlLabel
                value="disabled"
                disabled
                control={<Radio />}
                label="other"
                />
            </RadioGroup>
        </FormControl>
        <svg ref={svgRef} width="800" height="500">
            <g ref={groupRef}>
               <text class="y axisLabel" ref={y_Label}></text> 
            </g>
        </svg>
    </div>
  )
}

export default BarChartVis