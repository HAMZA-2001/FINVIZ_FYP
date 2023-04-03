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

    const effectRan = useRef(false)


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
    const [voldata, setvolData] = useState([]);
    
    const [tickerData, setTickerData] = useState("aapl")

    //filter chart
    const svgRef = useRef()

    const colorValue = d=>d.key

    //Zoom State Variables
    const [currentZoomState, setCurrentZoomState] = useState()

    const wrapperRef = useRef();
    
     const MARGIN = { LEFT: 100, RIGHT: 100, TOP: 50, BOTTOM: 100 }
     const WIDTH = 1900 - MARGIN.LEFT - MARGIN.RIGHT
     const HEIGHT = 900 - MARGIN.TOP - MARGIN.BOTTOM
     
     const svg = d3.select(Chart_Area.current)
       .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
       .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
       .style("background", '#FCFBF4')
       .style("border-radius", '50px')
       .attr("overflow", "hidden")
    //    .attr("op", "hidden")

    var clip = svg.append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
    // .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)


    const g = d3.select(Group_Area.current)
       .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)
    //    .style("background","white")

    const volg = d3.select(Volume_Area.current)
        .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

    // axis groups
    const xAxis = d3.select(x_axis.current).style("background","white")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${HEIGHT})`)


    const yAxis = d3.select(y_axis.current).style("background","white")
        .attr("class", "y axis")  // set axis tick labels to white

    const xLabel = d3.select(x_Label.current)
            .attr("class", "x axisLabel")
            .attr("y", HEIGHT + 50)
            .attr("x", WIDTH / 2)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text("Time Period")
            // .attr("fill","white")

    const yLabel = d3.select(y_Label.current)
            .attr("class", "y axisLabel")
            .attr("transform", "rotate(-90)")
            .attr("y", -60)
            .attr("x", -290)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text("Price")
                
        // scales
        const x = d3.scaleTime().range([0, WIDTH])
        const y = d3.scaleLinear().range([HEIGHT, 0])

        
        // axis generators
        const xAxisCall = d3.axisBottom().tickSizeOuter(5)
        const yAxisCall = d3.axisLeft().tickSizeOuter(0)
        
            // .ticks(6)


    function getTickerData(val){
        setTickerData(val.target.value)
      }

    function clickTickerData(e){
        console.log(e)
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
            console.log(data)
    
        
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
            console.log(VTA)

            console.log(Odata)
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

     function getSelectedValues(val){
        console.log(val.target.value)
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
     
    //Volume barchart
    const volx_axis = useRef()
    const voly_axis = useRef()
    const VOL_MARGIN = { LEFT: 100, RIGHT: 100, TOP: 50, BOTTOM: 100 }
    const VOL_WIDTH = 1900 - MARGIN.LEFT - MARGIN.RIGHT
    const VOL_HEIGHT = 900 - MARGIN.TOP - MARGIN.BOTTOM
    const volumeSvg = d3.select(volume_Svg.current).attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
    .style("border-radius", '50px')
    .attr("overflow", "hidden")
    .attr("overflow", "hidden")
    var volclip = volumeSvg.append("clipPath")
    .attr("id", "clip2")
    .append("rect")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
    const volumegroup = d3.select(Volume_Area.current);

    

    const volxAxisCall = d3.axisBottom();
    const volyAxisCall = d3.axisLeft();

        // axis groups
    const volxAxis = d3.select(volx_axis.current)
        .attr("class", "volx axis")
        .attr("transform", `translate(0, ${HEIGHT})`)



    const volyAxis = d3.select(voly_axis.current)
        .attr("class", "voly axis")  // set axis tick labels to white

      
        

 
  let prevVal = 0

    useEffect(() => {
        const dataTimeFiltered = data
        console.log(volumeData)
        
       console.log(volumeData[0])
        console.log(data)
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
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

                xAxisCall.scale(x)
                xAxis.transition(t).call(xAxisCall)
                yAxisCall.scale(y)

                const volx = d3.scaleTime().range([0, VOL_WIDTH])
                const voly = d3.scaleLinear().range([VOL_HEIGHT, 0])
                console.log(selectedValue)
                if(selectedValue !== "volume"){
                    console.log(selectedValue)
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
                        volxAxis.transition(t).call(volxAxisCall)
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
                        console.log(x.domain())
                        console.log(newXscale.domain())
                        
                        x.domain(newXscale.domain())
                        volx.domain(newXscale.domain())
                        // x.range([0, WIDTH])
                        // xAxisCall.scale(newXscale.domain())
                        xAxisCall.scale(x)
                        xAxis.transition(t).call(xAxisCall)
                        yAxisCall.scale(y)

                        volxAxisCall.scale(volx)
                        volxAxis.transition(t).call(volxAxisCall)
                        volyAxisCall.scale(voly)
                       
                    }
     

                    yAxis.attr("fill","white").transition(t).call(yAxisCall)
                
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
                        .attr("stroke-width", "2px")
                        .attr("d", d => line(d.values))
                        .attr("clip-path", "url(#clip)")
                        
                        // console.log(data[0].values)
                        // console.log(volumeData[0].values)

                    // const rects = volg.selectAll("rect")
                    //     .data(data[0].values, d => d.date)

                    let vt = d3.transition().duration(750)
                    // Assuming your data is stored in a variable called `data`
                    // x
                    volg.selectAll(".tick line")
                    .style("stroke", "white");
                    volg.selectAll(".tick text")
                    .style("fill", "white");
                    // rects.enter().append("rect")
                    //         .attr("fill", "red")
                    //         .attr("class", "rect")
                
                    //         .attr("height", 0)
                    //         // AND UPDATE old elements present in new data.
                    //         .merge(rects)
                    //         .transition(vt)
                    //         .attr("x", (d) => volx(d.date))
                    //         .attr("width", 8)
                    //         .attr("y", d => {
                    //             console.log(d)
                    //             voly(d.y_val)})
                            
                    //         .attr("height", d => HEIGHT-d.y_val)
                    // Remove existing bars
                    console.log(volumeData[0].values[0].y_val)
                        volg.selectAll('.rectbars').remove();
                        volg.selectAll('rect')
                        .data(volumeData)
                        .join('g')
                        // .attr('fill', (d, i) => {
                        //     console.log(d)
                        //     if (i > 0) {
                        //       const diff = d.y_val - data[i - 1].y_val;
                        //       console.log(diff)
                        //       if (diff > 200000) {
                        //         return 'darkgreen';
                        //       } else if (diff >= 0) {
                        //         return 'lightgreen';
                        //       } else if (diff < 0){
                        //         return 'darkred';
                        //       }
                        //     } else {
                        //       return 'lightgreen';
                        //     }
                        //   })
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
                                console.log(volumeData[0].values[i+1].y_val)
                                console.log(d.y_val)
                              const diff = d.y_val - volumeData[0].values[i+1].y_val
                            //   prevVal = d.y_val
                              
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
                        // .attr('fill', (d, i) => {
        
                        //     if (i > 0 & i < volumeData[0].values.length) {
                        //         const l = volumeData[0].values.length
                        //         console.log(volumeData[0].values[i-1].y_val)
                        //         console.log(d.y_val)
                        //       const diff = d.y_val - volumeData[0].values[i-1].y_val
                        //       prevVal = d.y_val
                              
                        //       if (diff > 0) {
                        //         return 'darkgreen';
                        //       } 
                        //     //   else if(diff < 20000000 & diff>=0){
                        //     //     return 'lightgreen'
                        //     //   }
                        //       else if (diff < 0){
                        //         return 'darkred';
                        //       }
                        //     } 

                           
                        //   })

                        
            }
            
        // }
        // effectRan.current = true
        
        const zoomBehaviour = d3.zoom()
            .scaleExtent([0.5, 100])
            .translateExtent([[0,0], [WIDTH + 100, HEIGHT]])
            .on("zoom", () => {
                console.log("zooom")
                const zoomState = zoomTransform(svg.node())
                setCurrentZoomState(zoomState)                
                console.log(zoomState)
            })
            
        svg.call(zoomBehaviour)

        d3.select("path").attr("clip-path", "url(#clip)");
        d3.select("rect").attr("clip-path", "url(#clip2)");

        console.log(volumeData)





        // const volxAxis = d3.axisBottom(xScale);
        // const volyAxis = d3.axisLeft(yScale);
        // volumeBars.selectAll("rect")
        // .data(data)
        // .enter()
        // .append("rect")
        // .attr("x", d => x(d.date))
        // .attr("y", d => volumeScale(d.volume))
        // .attr("width", xScale.bandwidth())
        // .attr("height", d => volumeHeight - volumeMargin.bottom - volumeScale(d.volume))
        // .attr("fill", d => volumeColorScale(d.open > d.close ? 'up' : 'down'));


         
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

        d3.json("https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol="+search_ticker+"&apikey=R6DXIM881UZRQGUU").then(data => {
            // prepare and clean data
            const filteredData = []
            const parseDate = d3.timeParse("%Y-%m-%d")
            console.log(data)
    
        
            for (var key in data["Weekly Adjusted Time Series"]){
                let test = parseDate(key)
                filteredData.push({date: test, y_val: Number(data["Weekly Adjusted Time Series"][key]['5. adjusted close'])})
                HighData.push({date: test, y_val: Number(data["Weekly Adjusted Time Series"][key]['5. adjusted close'])})
                LowData.push({date: test, y_val: Number(data["Weekly Adjusted Time Series"][key]['5. adjusted close'])})
                VolumeData.push({date: test, y_val: Number(data["Weekly Adjusted Time Series"][key]['6. volume'])})
                CloseData.push({date: test, y_val: Number(data["Weekly Adjusted Time Series"][key]['5. adjusted close'])})
                OpenData.push({date: test, y_val: Number(data["Weekly Adjusted Time Series"][key]['5. adjusted close'])})
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
            VsetDataArray([...Vdata,{key:search_ticker, values:VolumeData}])
            console.log(OTA)

           

            // OsetDataArray(OTA)
            HsetData(HighData)
            LsetData(LowData)
            VsetData(VolumeData)
            CsetData(CloseData)
            OsetData(OpenData)
            console.log(Odata)
            console.log(OTA)
            console.log(selectedValue)
            

            setvolumeData([{key:search_ticker, values:VolumeData}])
            console.log([[...Vdata]])
        
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
            {/* <div>
                <select id="var-select" className="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 inline text-center" defaultValue={'open'} onChange = {getSelectedValues.bind(this)}>
                    <option value="open">Open</option>
                    <option value="high">High</option>
                    <option value="low">Low</option>
                    <option value="close">Close</option>
                    <option value="volume">Volume</option>
                </select>
            </div> */}
        <div>
        </div>

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

                     
                    </svg>
                    <svg ref={volume_Svg}>
                    {/* <g class="x axis" ref={volx_axis}></g>
                        <g class="x axis" ref={voly_axis}></g> */}
                      <g className="volume-chart" ref={Volume_Area}>
                        <g class="x axis" ref={volx_axis}></g>
                        <g class="x axis" ref={voly_axis}></g>
                      </g>
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

export default App3