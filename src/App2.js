import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as d3 from "d3";
import { scaleOrdinal, select, zoomTransform } from 'd3';
import './css/App2.css'

function App2() {
    //variables
    let HighData = []
    let LowData = []
    let OpenData = []
    let CloseData = []
    let VolumeData = []
    let filteredData = []

    let HTA= []
    let LTA = []
    let OTA = []
    let CTA = []
    let VTA = []

    const effectRan = useRef(false)

    // const [HTA, setHTA]=  useState([])
    // const [LTA, setLTA] = useState([])
    // const [OTA, setOTA] = useState([])
    // const [CTA, setCTA] = useState([])
    // const [VTA, setVTA] = useState([])

    const [H_data, HsetData] = useState([]);
    const [L_data, LsetData] = useState([]);
    const [O_data, OsetData] = useState([]);
    const [V_data, VsetData] = useState([]);
    const [C_data, CsetData] = useState([]);

    const [Hdata, HsetDataArray] = useState([]);
    const [Ldata, LsetDataArray] = useState([]);
    const [Odata, OsetDataArray] = useState([]);
    const [Vdata, VsetDataArray] = useState([]);
    const [Cdata, CsetDataArray] = useState([]);

    const Chart_Area = useRef()
    const Group_Area = useRef()
    const x_Label = useRef()
    const y_Label = useRef()
    const x_axis = useRef()
    const y_axis = useRef()
    const [data, setData] = useState([]);
    const [tickerData, setTickerData] = useState("aapl")

    //filter chart
    const svgRef = useRef()

    const colorValue = d=>d.key

    //Zoom State Variables
    const [currentZoomState, setCurrentZoomState] = useState()

    function getTickerData(val){
        setTickerData(val.target.value)
      }

    function clickTickerData(e){
        console.log(e)
        const search_ticker = tickerData

        // remove the previous path element so it doesnt show other lines on the graph  
        g.selectAll("path").remove()
        setData([])
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

            HTA.push({key:search_ticker, values:HighData})
            HsetDataArray(HTA)
            OTA.push({key:search_ticker, values:OpenData})
            OsetDataArray(OTA)
            LTA.push({key:search_ticker, values:LowData})
            LsetDataArray(LTA)
            CTA.push({key:search_ticker, values:CloseData})
            CsetDataArray(CTA)
            VTA.push({key:search_ticker, values:VolumeData})
            VsetDataArray(VTA)
            
            console.log(Odata)
            // OsetDataArray(OTA)
            HsetData(HighData)
            LsetData(LowData)
            VsetData(VolumeData)
            CsetData(CloseData)
            OsetData(OpenData)
            setData(OTA)


        })
       
     }

     function getSelectedValues(val){
        console.log(val.target.value)
        const yValue = val.target.value
        g.selectAll("path").remove()
        if (yValue == 'high') {
            setData(Hdata)
        }else if (yValue == 'volume') {
            setData(Vdata)
        } else if (yValue == 'open'){
            setData(Odata)
        }else if (yValue == 'close'){
            setData(Cdata)
        }else if(yValue == 'low'){
            setData(Ldata)
        }else{
            setData(OTA)
        }


     }
     const wrapperRef = useRef();
    
     const MARGIN = { LEFT: 100, RIGHT: 100, TOP: 50, BOTTOM: 100 }
     const WIDTH = 1600 - MARGIN.LEFT - MARGIN.RIGHT
     const HEIGHT = 800 - MARGIN.TOP - MARGIN.BOTTOM
     
     const svg = d3.select(Chart_Area.current)
       .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
       .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
       .style("background", 'white')
    //    .attr("overflow", "hidden")

    var clip = svg.append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
    // .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)


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
            .attr("y", -60)
            .attr("x", -290)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text("Open")
                
        // scales
        const x = d3.scaleTime().range([0, WIDTH])
        const y = d3.scaleLinear().range([HEIGHT, 0])

        
        // axis generators
        const xAxisCall = d3.axisBottom().tickSizeOuter(0); 
        const yAxisCall = d3.axisLeft().tickSizeOuter(0); 
            // .ticks(6)

        const svg2 = select(svgRef.current)
        


    useEffect(() => {
        // const { width, height } =
        // dimensions || wrapperRef.current.getBoundingClientRect();
  
            const dataTimeFiltered = data
            console.log(dataTimeFiltered)
            

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(dataTimeFiltered.map(d => d.key))
            if(dataTimeFiltered.length>0){
                const t = d3.transition().duration(1000)
                // Compare with of the graphs have the greater scale bands to the domain could be adjusted accordingly
                const xdomainData = []
                const ydomainData = []
                const Extracteddata = data[0]
                for (let arrays = 0; arrays < data.length; arrays++){
                    for (let i = 0; i < (data[arrays].values.length); i++)
                        xdomainData.push(data[arrays].values[i].date)
                }

                for (let arrays = 0; arrays < data.length; arrays++){
                    for (let i = 0; i < (data[arrays].values.length); i++)
                        ydomainData.push(data[arrays].values[i].y_val)
                }
                console.log(xdomainData)
                console.log(Extracteddata.values)
                
                    // update scales
                    x.domain(d3.extent(xdomainData))
                    y.domain([
                        d3.min(ydomainData) / 1.005, 
                        d3.max(ydomainData) * 1.005
                    ])
                    console.log(d3.min(O_data, d => d.y_val))
                    console.log(d3.max(O_data, d => d.y_val))
                    console.log(O_data)

                    xAxisCall.scale(x)
                    xAxis.transition(t).call(xAxisCall)
                    yAxisCall.scale(y)


                    //Alter the scales on zooming
                    if (currentZoomState){
                        g.selectAll("path").remove()
                        const newXscale = currentZoomState.rescaleX(x)
                        console.log(x.domain())
                        console.log(newXscale.domain())
                        
                        x.domain(newXscale.domain())
                        // x.range([0, WIDTH])
                        // xAxisCall.scale(newXscale.domain())
                        xAxisCall.scale(x)
                        xAxis.transition(t).call(xAxisCall)
                        yAxisCall.scale(y)
                       

                        // const newYscale = currentZoomState.rescaleY(y)
                        // console.log(y.domain())
                        // console.log(newYscale.domain())
                        // y.range([HEIGHT,0])
                        // y.domain(newYscale.domain())
                        // // xAxisCall.scale(newXscale.domain())
                        // yAxisCall.scale(y)
                        // yAxis.transition(t).call(yAxisCall)
                    }
                   

                    // Generating Grids
                    const yGrid = yAxisCall
                        // .tickFormat('')
                        // .ticks(5)
                        // .tickSizeOuter(10) 
                        .tickSizeInner(-WIDTH - MARGIN.LEFT + MARGIN.RIGHT ) 
                    // svg.append('g')
                    //     .attr('class', 'y-grid')
                    //     .attr('transform', 'translate(' + MARGIN.LEFT + ', 0)')
                    //     .call(yGrid)

                    yAxis.transition(t).call(yAxisCall)
                
                    // Path generator
                    const line = d3.line()
                        .x(d => x(d.date))
                        .y(d => y(d.y_val))
                
                    // Update our line path
                    console.log(dataTimeFiltered)
                    g.selectAll(".line").data(dataTimeFiltered).enter().append('path')
                        .transition(t)
                        .attr("fill", "none")
                        .attr("stroke", d => colorScale(colorValue(d)))
                        .attr("stroke-width", "2.5px")
                        .attr("d", d => line(d.values))
                        .attr("clip-path", "url(#clip)")

                        
            }
            
        // }
        // effectRan.current = true
        
        const zoomBehaviour = d3.zoom()
            .scaleExtent([0.5, 5])
            .translateExtent([[0,0], [WIDTH, HEIGHT]])
            .on("zoom", () => {
                console.log("zooom")
                const zoomState = zoomTransform(svg.node())
                setCurrentZoomState(zoomState)                
                console.log(zoomState)
            })
            
        svg.call(zoomBehaviour)

        d3.select("path").attr("clip-path", "url(#clip)");

         
    }, [data, currentZoomState])

    const [compareData, setCompareData] = useState("")
    let CompareHighData = []
    let CompareLowData = []
    let CompareCloseData = []
      function getCompareData(val){
        setCompareData(val.target.value)
      }

    function clickCompareData(e){
        console.log(e)
        g.selectAll("path").remove()
        const search_ticker = compareData

        // remove the previous path element so it doesnt show other lines on the graph  
        // g.selectAll("path").remove()

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
            console.log(OpenData)
            HTA.push({key:search_ticker, values:HighData})
            HsetDataArray((HTA))
            OTA.push({key:search_ticker, values:OpenData})
            OsetDataArray([...Odata,{key:search_ticker, values:OpenData}])
            // OsetDataArray( [...Odata,{key:search_ticker, values:OpenData}])
            //Odata => [{key:search_ticker, values:OpenData}, ...Odata]
            LTA.push({key:search_ticker, values:LowData})
            LsetDataArray(LTA)
            CTA.push({key:search_ticker, values:CloseData})
            CsetDataArray(CTA)
            VTA.push({key:search_ticker, values:VolumeData})
            VsetDataArray(VTA)
            console.log(OTA)

            // OsetDataArray(OTA)
            HsetData(HighData)
            LsetData(LowData)
            VsetData(VolumeData)
            CsetData(CloseData)
            OsetData(OpenData)
            console.log(Odata)
            console.log(OTA)
            setData([...Odata,{key:search_ticker, values:OpenData}])


        })
       
     }

    
    
  return (
    <div className="App">

        <div class="flex mb-4 center justify-center">
        <div className="input-group pr-20">
            <input onChange={getTickerData.bind(this)} id = "input_ticker" type="search" className="form-control w-60  inline shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Search" aria-label="Search" aria-describedby="search-addon" />
            <button onClick={clickTickerData.bind(this)} id = "button_ticker" type="button"  className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded " >search</button>
        </div>

        <div className="input-group">
            <input onChange={getCompareData.bind(this)} id = "input_compare" type="search" className="form-control rounded shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Compare" aria-label="Search" aria-describedby="search-addon" />
            <button onClick={clickCompareData.bind(this)} id = "button_compare" type="button" className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded " >compare</button>
        </div>
        </div>

        {/* <div className='flex justify-center'> */}
        <div>LineChartD3
            <div>
            <select id="var-select" className="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 inline text-center" defaultValue={'open'} onChange = {getSelectedValues.bind(this)}>
                <option value="open">Open</option>
                <option value="high">High</option>
                <option value="low">Low</option>
                <option value="close">Close</option>
                <option value="volume">Volume</option>
            </select>
            </div>
        <div>
        {/* </div> */}

        <div className='flex justify-center mt-10'>
            <div>
            <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
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

            <div>
                <svg ref={svgRef} width="1400" height="200">
                    <g className="x_axis_svg2" ></g>
                    <g className="y_axis_svg2"></g>
                </svg>
            </div>
            </div>
        </div>

        
        </div>
    </div>
    </div>
  )
}

export default App2