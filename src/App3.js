import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as d3 from "d3";
import { dsvFormat, scaleOrdinal, select, zoomTransform } from 'd3';
import { dark } from '@material-ui/core/styles/createPalette';


function App3() {
    //volume
    const Volume_Area = useRef()
    const volume_Svg = useRef()
    const [volumeData, setvolumeData] = useState([])

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
    const groupRef = useRef()
    const x_Label = useRef()
    const y_Label = useRef()
    const x_axis = useRef()
    const y_axis = useRef()
    const [data, setData] = useState([]);
    const [voldata, setvolData] = useState([]);
    
    const [tickerData, setTickerData] = useState("aapl")

    //filter chart
    const svgRef = useRef()

    const colorValue = d=>d.key

    //Zoom State Variables
    const [currentZoomState, setCurrentZoomState] = useState()

    const wrapperRef = useRef();

    // Setting up the canvas for visualization purposes
     const MARGIN = { LEFT: 100, RIGHT: 100, TOP: 50, BOTTOM: 100 }
     const WIDTH = 2400 - MARGIN.LEFT - MARGIN.RIGHT
     const HEIGHT = 1100 - MARGIN.TOP - MARGIN.BOTTOM
     
     const svg = d3.select(Chart_Area.current)
       .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
       .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
    //    .style("background", '#FCFBF4')
       .style("border-radius", '50px')
       .attr("overflow", "hidden")


    var clip = svg.append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)



    const g = d3.select(Group_Area.current)
       .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)


    const volg = d3.select(Volume_Area.current)
        .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

    // axis groups
    const xAxis = d3.select(x_axis.current)
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${HEIGHT})`)
        .attr("fill", "white")
        .style("stroke-width", "1px")


    const yAxis = d3.select(y_axis.current)
        .attr("class", "y-axis")  // set axis tick labels to white

    const xLabel = d3.select(x_Label.current)
            .attr("class", "x axisLabel")
            .attr("y", HEIGHT + 50)
            .attr("x", WIDTH / 2)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")

            // .attr("fill","white")

    const yLabel = d3.select(y_Label.current)
            .attr("class", "y axisLabel")
            .attr("transform", "rotate(-90)")
            .attr("y", -70)
            .attr("x", -400)
            .attr("font-size", "40px")
            .attr("text-anchor", "middle")
            .text("Price ($)")
            .attr("fill", "white")
                
        // scales
        const x = d3.scaleTime().range([0, WIDTH])
        const y = d3.scaleLinear().range([HEIGHT, 0])

        

        
            // .ticks(6)

    /**
     * get the value from the drop down list
     * @param {*} val -  the value of the event
     */
    function getTickerData(val){
        setTickerData(val.target.value)
      }

    /**
     * When user clicks the search button for search bar
     * @param {*} e - event 
     */
    function clickTickerData(e){
        const search_ticker = tickerData
        //volume section
        setvolumeData([])
        // remove the previous path element so it doesnt show other lines on the graph  
        g.selectAll("path").remove()
        setData([])
     
        d3.json("https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol="+search_ticker+"&apikey=R6DXIM881UZRQGUU").then(data => {
            // prepare and clean data
            const filteredData = []
            const parseDate = d3.timeParse("%Y-%m-%d")
    
        
            for (var key in data["Weekly Adjusted Time Series"]){
                let test = parseDate(key)
                filteredData.push({date: test, y_val: Number(data['Weekly Adjusted Time Series'][key]['5. adjusted close'])})
                HighData.push({date: test, y_val: Number(data['Weekly Adjusted Time Series'][key]['5. adjusted close'])})
                LowData.push({date: test, y_val: Number(data['Weekly Adjusted Time Series'][key]['5. adjusted close'])})
                VolumeData.push({date: test, y_val: Number(data['Weekly Adjusted Time Series'][key]['6. volume'])})
                CloseData.push({date: test, y_val: Number(data['Weekly Adjusted Time Series'][key]['5. adjusted close'])})
                OpenData.push({date: test, y_val: Number(data['Weekly Adjusted Time Series'][key]['5. adjusted close'])})
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
   

            // OsetDataArray(OTA)
            HsetData(HighData)
            LsetData(LowData)
            VsetData(VolumeData)
            CsetData(CloseData)
            OsetData(OpenData)
            setvolumeData([{key:search_ticker, values:VolumeData}])
            setData(OTA)
            setvolData(VTA)



        })
       
     }

     const [selectedValue, setselectedValue] = useState("")

     /**
      * get the value for the drop down list
      * @param {*} val - value to be selected
      */
     function getSelectedValues(val){
        const yValue = val.target.value
        setselectedValue(yValue)
        g.selectAll("path").remove()
        if (yValue == 'high') {
            setData(Hdata)
            setvolData(Vdata)
        }else if (yValue === 'volume') {
            setData(Vdata)
            setvolData(Vdata)
        } else if (yValue === 'open'){
            setData(Odata)
            setvolData(Vdata)
        }else if (yValue === 'close'){
            setData(Cdata)
            setvolData(Vdata)
        }else if(yValue === 'low'){
            setData(Ldata)
            setvolData(Vdata)
        }else{
            setData(OTA)
        }


     }
     
    // Volume barchart refs
    const volx_axis = useRef()
    const voly_axis = useRef()
    const yvol_Label = useRef()
    const xvol_Label = useRef()

    // Setting up canvas for volume bar chart visualization purposes
    const VOL_MARGIN = { LEFT: 100, RIGHT: 100, TOP: 50, BOTTOM: 100 }
    const VOL_WIDTH = 2400 - MARGIN.LEFT - MARGIN.RIGHT
    const VOL_HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

    const xvolLabel = d3.select(xvol_Label.current)
    .attr("class", "x axisLabel")
    .attr("y", HEIGHT + 50)
    .attr("x", WIDTH / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Time Period")
    .attr("fill", "white")

    const yvolLabel = d3.select(yvol_Label.current)
    .attr("class", "y axisLabel")
    .attr("transform", "rotate(-90)")
    .attr("y", -80)
    .attr("x", -110)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Volume (Weekly)")
    .attr("fill", "white")

    const volumeSvg = d3.select(volume_Svg.current).attr("width", VOL_WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", VOL_HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
    .style("border-radius", '50px')
    .attr("overflow", "hidden")
    .attr("overflow", "hidden")
    var volclip = volumeSvg.append("clipPath")
    .attr("id", "clip2")
    .append("rect")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
    const volumegroup = d3.select(Volume_Area.current);

    
    const legendg = d3.select(groupRef.current)
    const volxAxisCall = d3.axisBottom();
    const volyAxisCall = d3.axisLeft();

    // axis groups for volumes
    const volxAxis = d3.select(volx_axis.current)
        .attr("class", "volx axis")
        .attr("transform", `translate(0, ${VOL_HEIGHT})`)

    const volyAxis = d3.select(voly_axis.current)
        .attr("class", "voly axis")  // set axis tick labels to white


    useEffect(() => {
       const dataTimeFiltered = data

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
        
        //algorithms for fitering out the domain for comparison
        .domain(dataTimeFiltered.map(d => d.key))
            if(dataTimeFiltered.length>0){
               
                const t = d3.transition().duration(1000)
                // Compare with of the graphs have the greater scale bands to the domain could be adjusted accordingly
                const xdomainData = []
                const ydomainData = []
                const volxdomainData = []
                const volydomainData = []
                const Extracteddata = data[0]
                for (let arrays = 0; arrays < data.length; arrays++){
                    for (let i = 0; i < (data[arrays].values.length); i++)
                        xdomainData.push(data[arrays].values[i].date)
                }

                for (let arrays = 0; arrays < data.length; arrays++){
                    for (let i = 0; i < (data[arrays].values.length); i++)
                        ydomainData.push(data[arrays].values[i].y_val)         
                        // volydomainData.push(volumeData[0].values.y_val)
                }

                // update scales
                x.domain(d3.extent(xdomainData))
                y.domain([
                    d3.min(ydomainData) / 1.005, 
                    d3.max(ydomainData) * 1.005
                ])

                        // axis generators
        const xAxisCall = d3.axisBottom().tickSizeOuter(2).tickPadding(10).tickSizeInner(10).ticks(10)
        const yAxisCall = d3.axisLeft()
        // .tickSize(-WIDTH)

                xAxisCall.scale(x)
                xAxis.call(xAxisCall)
                yAxisCall.scale(y)

     

                const volx = d3.scaleTime().range([0, VOL_WIDTH])
                const voly = d3.scaleLinear().range([VOL_HEIGHT, 0])

                if(selectedValue !== "volume"){
              
                    for (let arrays = 0; arrays < volumeData[0].values.length; arrays++){
                        volxdomainData.push(volumeData[0].values[arrays].y_val.date)
                        volydomainData.push(volumeData[0].values[arrays].y_val)
                    }
    
                        // volume
                        volx.domain(d3.extent(xdomainData))
                        voly.domain([
                            d3.min(volydomainData) / 1.005, 
                            d3.max(volydomainData) * 1.005
                        ])
    
                        volxAxisCall.scale(volx)
                        volxAxis.call(volxAxisCall)
                        volyAxisCall.scale(voly)
                        volyAxis.transition(t).call(volyAxisCall)
                      
                }else{
                        // volume
                        volx.domain(d3.extent(xdomainData))
                        voly.domain([
                            d3.min(ydomainData) / 1.005, 
                            d3.max(ydomainData) * 1.005
                        ])
    
                        volxAxisCall.scale(volx)
                        volxAxis.transition(t).call(volxAxisCall)
                        volyAxisCall.scale(voly)
                        volyAxis.transition(t).call(volyAxisCall)
                      

                }

                

                    //Alter the scales on zooming
                    if (currentZoomState){
                        g.selectAll("path").remove()
                        const newXscale = currentZoomState.rescaleX(x)
                        
                        // setting the domains
                        x.domain(newXscale.domain())
                        volx.domain(newXscale.domain())

                        // calling the scales for linechart
                        xAxisCall.scale(x)
                        xAxis.transition(t).call(xAxisCall)
                        yAxisCall.scale(y)

                        // calling the scales for barchart
                        volxAxisCall.scale(volx)
                        volxAxis.transition(t).call(volxAxisCall)
                        volyAxisCall.scale(voly)
                       
                    }
     

                    yAxis.transition(t).call(yAxisCall)

                    g.selectAll(".tick line")
                    .style("stroke", "white");
                    g.selectAll(".tick text")
                    .style("fill", "white");

                    // Add horizontal grid lines to y-axis
                    g.selectAll(".grid-line").remove()
                    g
                    .selectAll(".y-axis .tick")
                    .append("line")
                    .attr("class", "grid-line")
                    .attr("x1", 0)
                    .attr("x2", WIDTH)
                    .attr("y1", 0)
                    .attr("y2", 0)
                    .attr("stroke", "#ccc")
                    .attr("stroke-opacity", 0.5);
                    // .selectAll(".tick line")
                    // .style("stroke", "#ccc")
                    // .style("stroke-opacity", 0.5);

             
                    legendg.selectAll(".legend").remove()
                    var color = d3.scaleOrdinal(d3.schemeCategory10)
                    console.log(dataTimeFiltered)
                    var legend = legendg.append("g")
                    .attr("class", "legend")
                    .attr("transform", "translate(" + (WIDTH + 120) + "," + 20 + ")")
                    .selectAll("g")
                    .data(dataTimeFiltered)
                    .enter().append("g")
                    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
            
                    legend.append("rect")
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", function(d, i) { return colorScale(colorValue(d)) });
            
                    legend.append("text")
                    .attr("x", 24)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .attr("fill", "white" )
                    .text(function(d) { return d.key});
                
                    // Path generator
                    const line = d3.line()
                        .x(d => x(d.date))
                        .y(d => y(d.y_val))
                
                    // Update our line path
                    g.selectAll(".line").data(dataTimeFiltered).enter().append('path')
                        .transition(t)
                        .attr("fill", "none")
                        .attr("stroke", d => colorScale(colorValue(d)))
                        .attr("stroke-width", "2px")
                        .attr("d", d => line(d.values))
                        .attr("clip-path", "url(#clip)")

                    volg.selectAll(".tick line")
                    .style("stroke", "white");
                    volg.selectAll(".tick text")
                    .style("fill", "white");

                    // Remove existing bars
                        volg.selectAll('.rectbars').remove();
                        volg.selectAll('rect')
                        .data(volumeData)
                        .join('g')
                        .selectAll('rect')
                        .data(d => d.values)
                        .join('rect')
                        .attr("class", "rectbars")
                        .attr('x', d => volx(d.date))
                        .attr('y', d => voly(d.y_val))
                        .attr('height', d => voly(0) - voly(d.y_val))
                        .attr('width', 10)
                        .attr('fill', (d, i) => {
        
                            if (i+1 < volumeData[0].values.length) {
                              const diff = d.y_val - volumeData[0].values[i+1].y_val
                              
                              if (diff > 20000000) {
                                return 'darkgreen';
                              } 
                              else if(diff < 20000000 & diff>=0){
                                return 'lightgreen'
                              }
                              else if (diff < 0 & diff >= -20000000){
                                return '#FF4F4B';
                              }
                              else{
                                return 'darkred'
                              }
                            } 

                           
                          }).attr("clip-path", "url(#clip2)")
                          .on('mouseover', function() {
                            d3.select(this)
                              .transition()
                              .duration(300)
                              .attr('height', d =>  voly(0) + voly(d.y_val));
                          })
                          .on('mouseout', function() {
                            d3.select(this)
                              .transition()
                              .duration(300)
                              .attr('height', d => voly(0) - voly(d.y_val));
                          });
                        
            }
            
        // }
        // effectRan.current = true
        
        const zoomBehaviour = d3.zoom()
            .scaleExtent([0.5, 100])
            .translateExtent([[0,0], [WIDTH + 100, HEIGHT]])
            .on("zoom", () => {
                const zoomState = zoomTransform(svg.node())
                setCurrentZoomState(zoomState)                
            })
            
        svg.call(zoomBehaviour)

        d3.select("path").attr("clip-path", "url(#clip)");
        d3.select("rect").attr("clip-path", "url(#clip2)");
       
    }, [data, currentZoomState])

    const [compareData, setCompareData] = useState("")
    let CompareHighData = []
    let CompareLowData = []
    let CompareCloseData = []
    /**
     * compares the value from the data search feild
     * @param {string} val - value from the compare data search field
     */
      function getCompareData(val){
        setCompareData(val.target.value)
      }

    /**
     * fetch the data to be compared and stores it in a formatted way for visualization purposes
     * @param {*} e - event 
     */
    function clickCompareData(e){
        g.selectAll("path").remove()
        const search_ticker = compareData

        d3.json("https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol="+search_ticker+"&apikey=R6DXIM881UZRQGUU").then(data => {
            
        // prepare and clean data
            const filteredData = []
            const parseDate = d3.timeParse("%Y-%m-%d")   
        
            for (var key in data["Weekly Adjusted Time Series"]){
                let test = parseDate(key)
                filteredData.push({date: test, y_val: Number(data["Weekly Adjusted Time Series"][key]['5. adjusted close'])})
                HighData.push({date: test, y_val: Number(data["Weekly Adjusted Time Series"][key]['5. adjusted close'])})
                LowData.push({date: test, y_val: Number(data["Weekly Adjusted Time Series"][key]['5. adjusted close'])})
                VolumeData.push({date: test, y_val: Number(data["Weekly Adjusted Time Series"][key]['6. volume'])})
                CloseData.push({date: test, y_val: Number(data["Weekly Adjusted Time Series"][key]['5. adjusted close'])})
                OpenData.push({date: test, y_val: Number(data["Weekly Adjusted Time Series"][key]['5. adjusted close'])})
            }

            HTA.push({key:search_ticker, values:HighData})
            HsetDataArray((HTA))
            OTA.push({key:search_ticker, values:OpenData})
            OsetDataArray([...Odata,{key:search_ticker, values:OpenData}])
            LTA.push({key:search_ticker, values:LowData})
            LsetDataArray(LTA)
            CTA.push({key:search_ticker, values:CloseData})
            CsetDataArray(CTA)
            VTA.push({key:search_ticker, values:VolumeData})
            VsetDataArray([...Vdata,{key:search_ticker, values:VolumeData}])

            //Set the correspoding data to its counterparts
            HsetData(HighData)
            LsetData(LowData)
            VsetData(VolumeData)
            CsetData(CloseData)
            OsetData(OpenData)

            setvolumeData([{key:search_ticker, values:VolumeData}])

            if(selectedValue === "volume"){
                setData([...Vdata,{key:search_ticker, values:VolumeData}])
                
            }else{
                setData([...Odata,{key:search_ticker, values:OpenData}])
            }
        })
       
     }

    
    
  return (
    <div className="App">
        <div className='flex justify-center'>
            <div class="flex flex-col mb-4 center justify-center pt-4 bg-gray-900 rounded-lg">
                <div className="input-group flex flex-row m-4 h-10 gap-2">
                    <input onChange={getTickerData.bind(this)} id = "input_ticker" type="search" className="form-control w-60  inline shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-96" placeholder="Search" aria-label="Search" aria-describedby="search-addon" />
                    <button onClick={clickTickerData.bind(this)} id = "button_ticker" type="button"  className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded w-24" >search</button>
                </div>

                <div className="input-group flex flex-row h-10 m-4 mt-4 gap-2 ">
                    <input onChange={getCompareData.bind(this)} id = "input_compare" type="search" className="form-control rounded shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-96" placeholder="Compare" aria-label="Search" aria-describedby="search-addon" />
                    <button onClick={clickCompareData.bind(this)} id = "button_compare" type="button" className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded  w-24" >compare</button>
                </div>

                <div className='mb-4 mt-4'>
                    <select id="var-select" className="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 inline text-center" defaultValue={'open'} onChange = {getSelectedValues.bind(this)}>
                        <option value="open">Open</option>
                        <option value="high">High</option>
                        <option value="low">Low</option>
                        <option value="close">Close</option>
                        <option value="volume">Volume</option>
                    </select>
                </div>
            
            </div>
        </div>

        <div className='flex justify-center'>
        <div>
        <div>
        </div>

        <div className='flex justify-center mt-10'>
            <div>
                <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
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

                     
                    </svg>
                    <svg ref={volume_Svg}>
                      <g className="volume-chart" ref={Volume_Area}>
                        <text class="y axisLabel" ref={yvol_Label}>Volume</text> 
                        <text class="x axisLabel" ref={xvol_Label}>Years</text>
                        <g class="x axis" ref={volx_axis}></g>
                        <g class="x axis" ref={voly_axis}></g>
                      </g>
                    </svg>
                </div>
            </div>
        </div>
        </div>
    </div>
    </div>
  )
}

export default App3