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
        .text("Month")
    
        // Y label
        const yLabel = g.append("text")
        .attr("class", "y axis-label")
        .attr("x", - (HEIGHT / 2))
        .attr("y", -60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        
        const x = d3.scaleBand()
        .range([0, WIDTH])
        .paddingInner(0.3)
        .paddingOuter(0.2)
    
        const y = d3.scaleLinear()
        .range([HEIGHT, 0])
    
        const xAxisGroup = g.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${HEIGHT})`)
    
        const yAxisGroup = g.append("g")
        .attr("class", "y axis")
    // if (Summary.length > 0 ){
        
    //     const newData = Summary
    //     update(newData, "marketcap")


    //       function update(data, yValue) {
    //         const value = "marketcap"
    //         const t = d3.transition().duration(750)
          
    //         x.domain(data.map(d => d.Symbol))
    //         y.domain([0, d3.max(data, d => d[yValue])])
          
    //         const xAxisCall = d3.axisBottom(x)
    //         xAxisGroup.transition(t).call(xAxisCall)
    //           .selectAll("text")
    //             .attr("y", "10")
    //             .attr("x", "-5")
    //             .attr("text-anchor", "end")
    //             .attr("transform", "rotate(-40)")
          
    //         const yAxisCall = d3.axisLeft(y)
    //           .ticks(3)
    //           .tickFormat(d => d + "m")
    //         yAxisGroup.transition(t).call(yAxisCall)
          
    //         // JOIN new data with old elements.
    //         const rects = g.selectAll("rect")
    //           .data(data, d => d.Symbol)
          
    //         // // EXIT old elements not present in new data.
    //         // rects.exit()
    //         //   .attr("fill", "red")
    //         //   .transition(t)
    //         //     .attr("height", 0)
    //         //     .attr("y", y(0))
    //         //     .remove()
          
    //         // ENTER new elements present in new data...
    //         rects.enter().append("rect")
    //           .attr("fill", "grey")
    //           .attr("class", "rect")
    //           .attr("y", y(0))
    //           .attr("height", 0)
    //           // AND UPDATE old elements present in new data.
    //           .merge(rects)
    //           .transition(t)
    //             .attr("x", (d) => x(d.Symbol))
    //             .attr("width", x.bandwidth)
    //             .attr("y", d => y(d[yValue]))
    //             .attr("height", d => HEIGHT - y(d[yValue]))
          
    //         const text = "Revenue ($)"
    //         yLabel.text(text)
    //       }
    

    // }

    const [selectedValues , setSelectedValues] = useState("")

    function handleInputChange (event){
        const val = event.target.value
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

            update(Summary, selectedValues)
            function update(data, yValue) {
                const value = "marketcap"
                const t = d3.transition().duration(750)
              
                x.domain(data.map(d => d.Symbol))
                y.domain([d3.min(data, d => d[yValue]), d3.max(data, d => d[yValue])])
              
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
              
                // JOIN new data with old elements.
                const rects = g.selectAll("rect")
                  .data(data, d => d.Symbol)
              
                // ENTER new elements present in new data...
                rects.enter().append("rect")
                  .attr("fill", "grey")
                  .attr("class", "rect")
                  .attr("y", y(0))
                  .attr("height", 0)
                  // AND UPDATE old elements present in new data.
                  .merge(rects)
                  .transition(t)
                    .attr("x", (d) => x(d.Symbol))
                    .attr("width", x.bandwidth)
                    .attr("y", d => y(d[yValue]))
                    .attr("height", d => HEIGHT - y(d[yValue]))
              
                const text = "Revenue ($)"
                yLabel.text(text)
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
        // setdbItems(dbcontents)
        return dbcontents
    }


    // useEffect(() => {
    //     const data = reteriveData()
    //     setTimeout(()=>{
    //         setdbItems(data)
    //     },1000)
    // }, []);

    // useEffect(() => {
    //     if(dbItems.length > 0){
    //         dbItems.forEach((item, index)=>{
    //             if (item.details !== ''){
    //                 console.log(item.details)
    //             }
    //         })

    //     }
    //    console.log(dbItems)
    // }, [dbItems]);
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

            </g>
        </svg>
    </div>
  )
}

export default BarChartVis