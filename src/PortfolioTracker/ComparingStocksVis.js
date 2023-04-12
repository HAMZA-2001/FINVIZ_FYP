import React, { useRef, useState } from 'react'
import * as d3 from "d3";
import { convertDateToUnixTimestamp, createDate } from '../components/date-helper';
import { useEffect } from 'react';
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';


// import {convertUnixTimestampToDate, convertDateToUnixTimestamp, createDate} from "..components/date-helper"

const chartConfig = {
    "1D": { resolution: "1", days: 1, weeks: 0, months: 0, years: 0 },
    "1W": { resolution: "15", days: 0, weeks: 1, months: 0, years: 0 },
    "1M": { resolution: "60", days: 0, weeks: 0, months: 1, years: 0 },
    "1Y": { resolution: "D", days: 0, weeks: 0, months: 0, years: 1 },
  };


function ComparingStocksVis({Summary}) {

  const Chart_Area = useRef()
  const Group_Area = useRef()
  const x_Label = useRef()
  const y_Label = useRef()
  const x_axis = useRef()
  const y_axis = useRef()
  const groupRef = useRef()

    const [filter, setFilter] = useState("1W");
 

    function getDataRange(){
        const {days, weeks, months, years} = chartConfig[filter]
        const endDate = new Date();
        const startDate = createDate(endDate,-days,-weeks,-months,-years)
        const startTimestampUnix = convertDateToUnixTimestamp(startDate)
        const endTimestampUnix = convertDateToUnixTimestamp(endDate)
    
        return {startTimestampUnix, endTimestampUnix}
        
    }

    const {startTimestampUnix, endTimestampUnix} = getDataRange()
    const resolution = chartConfig[filter].resolution
    console.log(startTimestampUnix)
    console.log(endTimestampUnix)
    console.log(resolution)
    const parseDate = d3.timeParse("%Y-%m-%d")
    const [tickers, settickers] = useState([])
    const [datavals, setdatavals] = useState(0)

    let Datalist = []
    let Overview_URL_List = []
    const [filteredData, setFilteredData] = useState([])

    useEffect(()=>{
      if (Summary.length > 0){
        settickers(Summary)

        Summary.forEach((item, index)=>{
          let datatobefetched = fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${item.Symbol}&apikey=R6DXIM881UZRQGUU`)
          Overview_URL_List.push(datatobefetched)
      })
      }

      if(Overview_URL_List.length === Summary.length){
        console.log(Overview_URL_List)
        Promise.all(Overview_URL_List).then(function (responses){
            console.log(responses)
            responses.forEach((item, i)=>{
                process2(item.json(), Summary[i].Symbol)
            })
        }).catch(function (error) {
            // if there's an error, log it
            console.log(error);
        });
    }

    let process2 = (prom, ticker) => {
        
        prom.then(data=>{
              const parseDate = d3.timeParse("%Y-%m-%d")
              let closeData = []  
              
              let CTA = []
              for (var key in data["Weekly Adjusted Time Series"]){
                let pd = parseDate(key)
                closeData.push({date: pd, y_val: Number(data['Weekly Adjusted Time Series'][key]['5. adjusted close'])})
              }
              console.log(closeData)
               //CTA.push({key:element.Symbol, values:closeData})
    
            Datalist.push({"key": ticker, "values": closeData})
            console.log(data)
        })


        setTimeout(()=>{
          setFilteredData(Datalist)

          }
      ,1000)
     
    }
    },[Summary])

    
    useEffect(()=>{
      console.log(filteredData)
      if(filteredData.length>0){
        const MARGIN = { LEFT: 100, RIGHT: 100, TOP: 50, BOTTOM: 100 }
        const WIDTH = 1600 - MARGIN.LEFT - MARGIN.RIGHT
        const HEIGHT = 600 - MARGIN.TOP - MARGIN.BOTTOM
        
          const svg = d3.select(Chart_Area.current)
          .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
          .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
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
          .attr("y", HEIGHT + 50)
          .attr("x", WIDTH / 2)
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .text("Years")

        const yLabel = d3.select(y_Label.current)
          .attr("class", "y axisLabel")
          .attr("transform", "rotate(-90)")
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .attr("y", -50)
          .attr("x", -270)
          .text("Closing Price ($)")

          // scales
        const x = d3.scaleTime().range([0, WIDTH])
        const y = d3.scaleLinear().range([HEIGHT, 0])

        // axis generators
        const xAxisCall = d3.axisBottom().ticks(6)
        const yAxisCall = d3.axisLeft()
                    .ticks(6)
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
        if(filteredData.length>0){
          const t = d3.transition().duration(1000)
          // Compare with of the graphs have the greater scale bands to the domain could be adjusted accordingly
          const xdomainData = []
          const ydomainData = []
          const Extracteddata = filteredData[0]

      
          for (let arrays = 0; arrays < filteredData.length; arrays++){
              for (let i = 0; i < (filteredData[arrays].values.length); i++)
                  xdomainData.push(filteredData[arrays].values[i].date)
          }

          for (let arrays = 0; arrays < filteredData.length; arrays++){
              for (let i = 0; i < (filteredData[arrays].values.length); i++)
                  ydomainData.push(filteredData[arrays].values[i].y_val)
          }
          console.log(xdomainData.slice(100))
          console.log(Extracteddata.values)
          
         

          
              // update scales
              x.domain(d3.extent(xdomainData))
              y.domain([
                  d3.min(ydomainData) / 1.005, 
                  d3.max(ydomainData) * 1.005
              ])

              xAxisCall.scale(x)
              xAxis.call(xAxisCall)
              yAxisCall.scale(y)
              yAxis.call(yAxisCall)

             

              // Generating Grids
              const yGrid = yAxisCall
                  .tickSizeInner(-WIDTH - MARGIN.LEFT + MARGIN.RIGHT ) 


              yAxis.transition(t).call(yAxisCall)
          
              // Path generator
              const line = d3.line()
                  .x(d => x(d.date))
                  .y(d => y(d.y_val))

                  const colorValue = d=>d.key
          
              // Update our line path
              g.selectAll(".line").data(filteredData).enter().append('path')
                  .transition()
                  .duration(1000)
                  .attr("fill", "none")
                  .attr("class", "path")
                  .attr("stroke", d => colorScale(colorValue(d)))
                  .attr("stroke-width", "2.5px")
                  .attr("d", d => line(d.values))


                   var color = d3.scaleOrdinal(d3.schemeCategory10)

                  var legend = d3.select(groupRef.current)
                  .attr("class", "legend")
                  .attr("transform", "translate(" + (WIDTH + 120) + "," + 20 + ")")
                  .selectAll("g")
                  .data(filteredData)
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
                  .text(function(d) { return d.key});
            
                  
      }
      
      }
    },[filteredData])


    
    // useEffect(() => {
    //   console.log(tickers)

    //       //https://finnhub.io/api/v1/stock/candle?symbol=AAPL&resolution=${resolution}&from=${startTimestampUnix}&to=${endTimestampUnix}&token=ce56182ad3ifdvthsqtgce56182ad3ifdvthsqu0
       
    //     tickers.forEach(function(element){
    //       setTimeout(()=>{
    //         d3.json(`https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${element.Symbol}&apikey=R6DXIM881UZRQGUU"`).then(data => {
    //           const parseDate = d3.timeParse("%Y-%m-%d")
    //           let closeData = []  
              
    //           let CTA = []
    //           for (var key in data["Weekly Adjusted Time Series"]){
    //             let pd = parseDate(key)
    //             closeData.push({date: pd, y_val: Number(data['Weekly Adjusted Time Series'][key]['5. adjusted close'])})
    //           }
    //           console.log(closeData)
    //            CTA.push({key:element.Symbol, values:closeData})
    //           })  
    //       },500)

    //     })      

    //     // setTimeout(()=>{
    //     //   console.log(CTA)
    //     //   setdatavals(CTA)
          
    //     // },3000)
        
    // }, [tickers])

    useEffect(()=>{
      if(datavals.length>0){
        console.log(datavals)
      }
    },[datavals])


    const [select, setselect] = useState()

    function handleInputChange(event){
      const t = d3.transition().duration(1000)
      g.selectAll(".path").remove()
      setselect(event.target.value)
    }
    

    const MARGIN = { LEFT: 100, RIGHT: 100, TOP: 50, BOTTOM: 100 }
        const WIDTH = 1600 - MARGIN.LEFT - MARGIN.RIGHT
        const HEIGHT = 600 - MARGIN.TOP - MARGIN.BOTTOM
        
          const svg = d3.select(Chart_Area.current)
          .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
          .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
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
          .attr("y", HEIGHT + 50)
          .attr("x", WIDTH / 2)
          .attr("fill","white")
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .text("Time Period")

        const yLabel = d3.select(y_Label.current)
          .attr("class", "y axisLabel")
          .attr("transform", "rotate(-90)")
          .attr("y", -60)
          .attr("x", -230)
          .attr("fill","white")
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .text("Closing Price ($)")

    // let dataSet = filteredData
    
    function showrangeGraphs(range){
      console.log(filteredData)
      let storefilteredData = filteredData
      let dataSet = filteredData
      let newarr = []
      if(range === 0){
        dataSet.forEach((item, idx)=>{
          newarr.push(
            {
              "key" : item.key,
              "values" : item.values
            }
          )
          
        })
      }else{
        dataSet.forEach((item, idx)=>{
          newarr.push(
            {
              "key" : item.key,
              "values" : item.values.slice(0,range)
            }
          )
          
        })
      }

      console.log(newarr)


      g.selectAll(".path").transition().remove()
      if(filteredData.length>0){
          // scales
        const x = d3.scaleTime().range([0, WIDTH])
        const y = d3.scaleLinear().range([HEIGHT, 0])

        // axis generators
        const xAxisCall = d3.axisBottom().ticks(10)
        const yAxisCall = d3.axisLeft()
                    .ticks(6)
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
        if(filteredData.length>0){
          const t = d3.transition().duration(1000)
          // Compare with of the graphs have the greater scale bands to the domain could be adjusted accordingly
          const xdomainData = []
          const ydomainData = []
          const filteredxdomaindata = []
          const Extracteddata = newarr[0]
          for (let arrays = 0; arrays < newarr.length; arrays++){
              for (let i = 0; i < (newarr[arrays].values.length); i++)
                  xdomainData.push(newarr[arrays].values[i].date)
          }

          for (let arrays = 0; arrays < newarr.length; arrays++){
              for (let i = 0; i < (newarr[arrays].values.length); i++)
                  ydomainData.push(newarr[arrays].values[i].y_val)
          }
          console.log(xdomainData)
          console.log(Extracteddata.values)

          for (let i = 0; i < (range); i++){
            filteredxdomaindata.push(xdomainData[i])
          }

          
              // update scales
              x.domain(d3.extent(filteredxdomaindata))
              console.log(d3.extent(filteredxdomaindata))
              y.domain([
                  d3.min(ydomainData) / 1.005, 
                  d3.max(ydomainData) * 1.005
              ])

              xAxisCall.scale(x)
              xAxis.call(xAxisCall)
              yAxisCall.scale(y)
              yAxis.call(yAxisCall)

             

              // Generating Grids
              const yGrid = yAxisCall
                  .tickSizeInner(-WIDTH - MARGIN.LEFT + MARGIN.RIGHT ) 


              yAxis.transition(t).call(yAxisCall)
          
              // Path generator
              const line = d3.line()
                  .x(d => x(d.date))
                  .y(d => y(d.y_val))

                  const colorValue = d=>d.key
          
              // Update our line path

              const path = g.selectAll(".line").data(newarr).enter().append('path')
                  .transition(t)
                  .attr("fill", "none")
                  .attr("class", "path")
                  .attr("stroke", d => colorScale(colorValue(d)))
                  .attr("stroke-width", "2.5px")
                  .attr("d", d => line(d.values))

                  // Define clip path
              const clip = svg.append('clipPath')
              .attr('id', 'clip')
              .append('rect')
              // .attr('x', MARGIN.LEFT)
              // .attr('y', MARGIN.TOP)
              .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
              .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

              // Apply clip path to path element
            path.attr('clip-path', 'url(#clip)');


                   var color = d3.scaleOrdinal(d3.schemeCategory10)

                  var legend = d3.select(groupRef.current)
                  .attr("class", "legend")
                  .attr("transform", "translate(" + (WIDTH + 120) + "," + 20 + ")")
                  .selectAll("g")
                  .data(dataSet)
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
                  .text(function(d) { return d.key}); 
            
                  
      }
      

    
      
      }
    }

    // function showrangeGraphs(range){
    //   console.log(filteredData)
    //   let storefilteredData = filteredData
    //   let dataSet = filteredData
    //   let newarr = []
    //   dataSet.forEach((item, idx)=>{
    //     newarr.push(
    //       {
    //         "key" : item.key,
    //         "values" : item.values.slice(0,range)
    //       }
    //     )
        
    //   })

    //   console.log(newarr)


    //   g.selectAll(".path").transition().remove()
    //   if(filteredData.length>0){
    //       // scales
    //     const x = d3.scaleTime().range([0, WIDTH])
    //     const y = d3.scaleLinear().range([HEIGHT, 0])

    //     // axis generators
    //     const xAxisCall = d3.axisBottom().ticks(10)
    //     const yAxisCall = d3.axisLeft()
    //                 .ticks(6)
    //     const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
    //     if(filteredData.length>0){
          
    //       // Compare with of the graphs have the greater scale bands to the domain could be adjusted accordingly
    //       const xdomainData = []
    //       const ydomainData = []
    //       const filteredxdomaindata = []
    //       const Extracteddata = newarr[0]
    //       for (let arrays = 0; arrays < newarr.length; arrays++){
    //           for (let i = 0; i < (newarr[arrays].values.length); i++)
    //               xdomainData.push(newarr[arrays].values[i].date)
    //       }

    //       for (let arrays = 0; arrays < newarr.length; arrays++){
    //           for (let i = 0; i < (newarr[arrays].values.length); i++)
    //               ydomainData.push(newarr[arrays].values[i].y_val)
    //       }
    //       console.log(xdomainData)
    //       console.log(Extracteddata.values)

    //       for (let i = 0; i < (range); i++){
    //         filteredxdomaindata.push(xdomainData[i])
    //       }

    //       setTimeout(()=>{
    //         const t = d3.transition().duration(1000)
    //            // update scales
    //            x.domain(d3.extent(filteredxdomaindata))
    //            console.log(d3.extent(filteredxdomaindata))
    //            y.domain([
    //                d3.min(ydomainData) / 1.005, 
    //                d3.max(ydomainData) * 1.005
    //            ])
 
    //            xAxisCall.scale(x)
    //            xAxis.call(xAxisCall)
    //            yAxisCall.scale(y)
    //            yAxis.call(yAxisCall)
 
              
 
    //            // Generating Grids
    //            const yGrid = yAxisCall
    //                .tickSizeInner(-WIDTH - MARGIN.LEFT + MARGIN.RIGHT ) 
 
 
    //            yAxis.transition(t).call(yAxisCall)
           
    //            // Path generator
    //            const line = d3.line()
    //                .x(d => x(d.date))
    //                .y(d => y(d.y_val))
 
    //                const colorValue = d=>d.key
           
    //            // Update our line path
 
    //            g.selectAll(".line").data(newarr).enter().append('path')
    //                .transition(t)
    //                .attr("fill", "none")
    //                .attr("class", "path")
    //                .attr("stroke", d => colorScale(colorValue(d)))
    //                .attr("stroke-width", "2.5px")
    //                .attr("d", d => line(d.values))
    //       }, 1000)
             


    //                var color = d3.scaleOrdinal(d3.schemeCategory10)

    //               var legend = d3.select(groupRef.current)
    //               .attr("class", "legend")
    //               .attr("transform", "translate(" + (WIDTH + 120) + "," + 20 + ")")
    //               .selectAll("g")
    //               .data(dataSet)
    //               .enter().append("g")
    //               .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
          
    //               legend.append("rect")
    //               .attr("width", 18)
    //               .attr("height", 18)
    //               .style("fill", function(d, i) { return color(i) });
          
    //               legend.append("text")
    //               .attr("x", 24)
    //               .attr("y", 9)
    //               .attr("dy", ".35em")
    //               .attr("fill", "white" )
    //               .text(function(d) { return d.key}); 
            
                  
    //   }
      

    
      
    //   }
    // }

    useEffect(()=>{
      console.log(filteredData)
     
    // if(select==="Overall"){
    //       // showrangeGraphs(0)
    //   }
      if(select==="Yearly"){
         showrangeGraphs(52) // 52 weeks
      }if(select==="5Years"){
         showrangeGraphs(240)
      }if(select==="Monthly"){
        showrangeGraphs(8)
     }if(select==="Overall"){
        showrangeGraphs(1040)
     }
    //  if(select==="oa"){
    //     let nv = filteredData
    //     showrangeGraphs(0)
    //  }
     

    },[select])
  return (
    <div>
    	    <div>
            <FormControl>
            <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
            >
                <FormControlLabel value="Overall" control={<Radio />} label="Overall" onChange={handleInputChange.bind(this)} />
                <FormControlLabel value="5Years" control={<Radio />} label="5 Years" onChange={handleInputChange.bind(this)}/>
                <FormControlLabel value="Yearly" control={<Radio />} label="1 Year" onChange={handleInputChange.bind(this)} />
                <FormControlLabel value="Monthly" control={<Radio />} label="Monthly" onChange={handleInputChange.bind(this)}/>

                </RadioGroup>
            </FormControl>
            </div>
    
                <svg ref={Chart_Area} width="800" height="500">
                  <g ref={groupRef}>
                  </g>
                    <g ref={Group_Area}  >
                    <text class="y axisLabel" ref={y_Label}>Open</text> 
                    <text class="x axisLabel" ref={x_Label}>Years</text>
                    <g class="x axis" ref={x_axis}></g>
                    <g class="x axis" ref={y_axis}></g>
                    <g class="y axis" fill="none" font-size="10" font-family="sans-serif" text-anchor="end"></g>
                    </g>
                {/* <g class="line path"></g> */}
                </svg>
    
    </div>
  )
}

export default ComparingStocksVis