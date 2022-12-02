import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as d3 from "d3";
// import Slider from '@mui/material/Slider';

function App2() {
    //variables
    let HighData = []
    let LowData = []
    let OpenData = []
    let CloseData = []
    let VolumeData = []
    let filteredData = []
    const [H_data, HsetData] = useState([]);
    const [L_data, LsetData] = useState([]);
    const [O_data, OsetData] = useState([]);
    const [V_data, VsetData] = useState([]);
    const [C_data, CsetData] = useState([]);


    const Chart_Area = useRef()
    const Group_Area = useRef()
    const x_Label = useRef()
    const y_Label = useRef()
    const x_axis = useRef()
    const y_axis = useRef()
    const [data, setData] = useState([]);
    const [tickerData, setTickerData] = useState("aapl")

    function getTickerData(val){
        setTickerData(val.target.value)
      }

    function clickTickerData(e){
        console.log(e)
        const search_ticker = tickerData


        d3.json("https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol="+search_ticker+"&apikey=R6DXIM881UZRQGUU").then(data => {
            // prepare and clean data
            const filteredData = []
            const parseDate = d3.timeParse("%Y-%m-%d")
            console.log(data)
    
        
            for (var key in data["Weekly Time Series"]){
                let test = parseDate(key)
                filteredData.push({date: test, y_val: Number(data['Weekly Time Series'][key]['1. open'])})
                HighData.push({date: test, y_val: Number(data['Weekly Time Series'][key]['2. high'])})
                LowData.push({date: test, y_val: Number(data['Weekly Time Series'][key]['3. low'])})
                VolumeData.push({date: test, y_val: Number(data['Weekly Time Series'][key]['5. volume'])})
                CloseData.push({date: test, y_val: Number(data['Weekly Time Series'][key]['4. close'])})
                OpenData.push({date: test, y_val: Number(data['Weekly Time Series'][key]['1. open'])})
            }
            HsetData(HighData)
            LsetData(LowData)
            VsetData(VolumeData)
            CsetData(CloseData)
            OsetData(OpenData)
            setData(OpenData)
        })
       
     }

     function getSelectedValues(val){
        console.log(val.target.value)
        const yValue = val.target.value
        if (yValue == 'high') {
            setData(H_data)
        }else if (yValue == 'volume') {
            setData(V_data)
        } else if (yValue == 'open'){
            setData(O_data)
        }else if (yValue == 'close'){
            setData(C_data)
        }else if(yValue == 'low'){
            setData(L_data)
        }else{
            setData(O_data)
        }


     }

    
     const MARGIN = { LEFT: 100, RIGHT: 100, TOP: 50, BOTTOM: 100 }
     const WIDTH = 1600 - MARGIN.LEFT - MARGIN.RIGHT
     const HEIGHT = 800 - MARGIN.TOP - MARGIN.BOTTOM
     
     const svg = d3.select(Chart_Area.current)
       .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
       .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
       .style("background", '#d3d3d3')
    const g = d3.select(Group_Area.current)
       .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

     // // time parsers/formatters
     const parseDate = d3.timeParse("%Y-%m-%d")
     const formatTime = d3.timeFormat("%Y-%m-%d")

     const bisectDate = d3.bisector(d => d.date).left

    // axis groups
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
            .attr("y", -80)
            .attr("x", -180)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text("Open")
                
        // scales
        const x = d3.scaleTime().range([0, WIDTH])
        const y = d3.scaleLinear().range([HEIGHT, 0])
        
        // axis generators
        const xAxisCall = d3.axisBottom()
        const yAxisCall = d3.axisLeft()
            .ticks(6)
        

    useEffect(() => {

        
        // add the line for the first time
        g.append("path")
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "grey")
            .attr("stroke-width", "3px")

        const t = d3.transition().duration(1000)
            
        const dataTimeFiltered = data
                    // update scales
                    x.domain(d3.extent(dataTimeFiltered, d => d.date))
                    y.domain([
                        d3.min(dataTimeFiltered, d => d.y_val) / 1.005, 
                        d3.max(dataTimeFiltered, d => d.y_val) * 1.005
                    ])
                    console.log(d3.min(dataTimeFiltered, d => d.y_val))
                    console.log(d3.max(dataTimeFiltered, d => d.y_val))
                    console.log(dataTimeFiltered)

                    xAxisCall.scale(x)
                    xAxis.transition(t).call(xAxisCall)
                    yAxisCall.scale(y)
                    yAxis.transition(t).call(yAxisCall)
                
                    // Path generator
                    const line = d3.line()
                        .x(d => x(d.date))
                        .y(d => y(d.y_val))
                
                    // // Update our line path
                    g.select(".line")
                        .transition(t)
                        .attr("d", line(data))
                
         
    }, [data])

    
    
  return (
    <div className="App">
        <div className="input-group">
            <input onChange={getTickerData.bind(this)} id = "input_ticker" type="search" className="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" />
            <button onClick={clickTickerData.bind(this)} id = "button_ticker" type="button" className="btn btn-outline-primary" >search</button>
        </div>

        <div>LineChartD3
            <div>
            <select id="var-select" className="form-control" defaultValue={'open'} onChange = {getSelectedValues.bind(this)}>
                <option value="open">Open</option>
                <option value="high">High</option>
                <option value="low">Low</option>
                <option value="close">Close</option>
                <option value="volume">Volume</option>
            </select>
            </div>
            {/* <Slider
            getAriaLabel={() => 'Temperature range'}
            // value={}
            // onChange={}
            // valueLabelDisplay="auto"
            // getAriaValueText={valuetext}
            /> */}
        <div>
            <h1>----------</h1>
            <div>
            <svg ref={Chart_Area} width="800" height="500">
                <g ref={Group_Area} >
                <text class="y axisLabel" ref={y_Label}>Open</text> 
                <text class="x axisLabel" ref={x_Label}>Years</text>
                <g class="x axis" ref={x_axis}></g>
                <g class="x axis" ref={y_axis}></g>
                </g>
               

            </svg>
            </div>

        
        </div>
        </div>
    </div>
  )
}

export default App2