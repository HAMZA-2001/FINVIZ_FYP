import React, { useRef, useState } from 'react'
import * as d3 from "d3";
import { convertDateToUnixTimestamp, createDate } from '../components/date-helper';
import { useEffect } from 'react';
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
          .attr("y", -60)
          .attr("x", -290)
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .text("Closing Price")

          // scales
        const x = d3.scaleTime().range([0, WIDTH])
        const y = d3.scaleLinear().range([HEIGHT, 0])

        // axis generators
        const xAxisCall = d3.axisBottom() .ticks(6)
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
          console.log(xdomainData)
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
                  .transition(t)
                  .attr("fill", "none")
                  .attr("stroke", d => colorScale(colorValue(d)))
                  .attr("stroke-width", "2.5px")
                  .attr("d", d => line(d.values))

                  
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
    
  return (
    <div>
    
                <svg ref={Chart_Area} width="800" height="500">
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