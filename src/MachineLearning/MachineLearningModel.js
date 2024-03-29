import React, { useState, useEffect, useRef } from 'react';
import * as d3 from "d3";

/**
 * React component which fetchs the predicted data from flask and gereate SnP500 future prices
 * @component
 */
function MachineLearningModel() {
    const [input, setInput] = useState('');
    const [prediction, setPrediction] = useState([]);
    const [combinedData, setcombinedData] = useState([])

    const Chart_Area = useRef()
    const Group_Area = useRef()
    const x_Label = useRef()
    const y_Label = useRef()
    const x_axis = useRef()
    const y_axis = useRef()
    const legendRef = useRef();
    
    const colorValue = d=>d.key
    
    const MARGIN = { LEFT: 100, RIGHT: 100, TOP: 50, BOTTOM: 100 }
    const WIDTH = 1900 - MARGIN.LEFT - MARGIN.RIGHT
    const HEIGHT = 900 - MARGIN.TOP - MARGIN.BOTTOM
     
    const svg = d3.select(Chart_Area.current)
      .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
      .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
      .style("background", '#FCFBF4')
      .style("border-radius", '50px')
      .attr("overflow", "hidden")

    var clip = svg.append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)

    const g = d3.select(Group_Area.current)
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
    const xAxisCall = d3.axisBottom()
    const yAxisCall = d3.axisLeft()

    const legend = d3.select(legendRef.current);

    // Define the color scale
    const color = d3.scaleOrdinal()
      .domain(["actual", "predicted"])
      .range(["blue", "red"]);

    // Add the legend items
    legend.selectAll("rect")
      .data(["actual", "predicted"])
      .enter()
      .append("rect")
      .attr("x", 10)
      .attr("y", (d, i) => i * 20)
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", (d) => color(d));

    // Add the legend labels
    legend.selectAll("text")
      .data(["actual", "predicted"])
      .attr("fill", "white")
      .enter()
      .append("text")
      .attr("x", 25)
      .attr("y", (d, i) => i * 20 + 10)
      .text((d) => d);
        
    /**
     * fetches the data from the flask api which is made
     */
    const handlePrediction = async () => {
        const response = await fetch(`http://127.0.0.1:5000/predict2`);
        const data = await response.json();
        console.log(data)
        setPrediction(data);
      }

    let CloseData = []
    let predictedResults = []
    useEffect(() => {
        handlePrediction()
      }, []);

      /**
       * gets the next day value for whenever the stock market is opened
       * @param {string} currentDate current date 
       * @returns {string} next day's value
       */
    function getNextDay(currentDate) {
        const oneDay = 24 * 60 * 60 * 1000; // one day in milliseconds
        const nextDay = new Date(currentDate.getTime() + oneDay); // add one day to the current date
        const dayOfWeek = nextDay.getDay(); // get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
      
        // If the next day is a Saturday or Sunday, add one or two more days to skip the weekend
        if (dayOfWeek === 6) { // Saturday
          return new Date(nextDay.getTime() + (2 * oneDay));
        } else if (dayOfWeek === 0) { // Sunday
          return new Date(nextDay.getTime() + oneDay);
        } else { // weekday
          return nextDay;
        }
      }
     
    let nextDay = "" 
    let newVal = 0

    useEffect(()=>{
     
        const data = prediction.previousValues
        const predicted_Values = prediction.next6days
        const parseDate = d3.timeParse("%Y-%m-%d")
        if (data !== undefined){
                data.forEach(element => {
                let parsedate = parseDate(element.Date)
                CloseData.push({date: parsedate, y_val: Number(element.Close)})
                });

        }
 
        if(predicted_Values !== undefined){
            const lastElement = CloseData.slice(-1)[0]; 
           
            predicted_Values.forEach((prediction,i) => {
                if (i === 0){
                    nextDay = getNextDay(lastElement.date);
                    newVal = lastElement.y_val + (prediction-lastElement.y_val)*0.3 
                    predictedResults.push({"date": nextDay, "y_val": newVal})
                }else{
                    nextDay = getNextDay(nextDay);
                    console.log(newVal, prediction, newVal)
                    newVal = newVal + (prediction-predicted_Values[i-1])*0.3 
                    predictedResults.push({"date": nextDay, "y_val": newVal})           
                }

            })
        }
        
        const d = CloseData.slice(-20).concat(predictedResults)
        setcombinedData(d)

    },[prediction])

    useEffect(()=>{
        if(combinedData.length > 0){
          
            const t = d3.transition().duration(750)
            // update scales
            x.domain(d3.extent(d3.extent(combinedData, d => d.date)))
            y.domain([
                0, 
                d3.max(combinedData, d => d.y_val)
            ])
            
            xAxisCall.scale(x)
            xAxis.transition(t).call(xAxisCall)
            yAxisCall.scale(y)
            yAxis.transition(t).call(yAxisCall)

            // Create the line function
            const line = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.y_val));
            

           // Filter data for last 6 values
           const dataBlue = combinedData.slice(0, -6);
           const lastSixData = combinedData.slice(-6);
            
          // Create line generators
          const lineGeneratorBlue = d3
          .line()
          .x((d) => x(d.date))
          .y((d) => y(d.y_val));
    
          const lineGeneratorRed = d3
            .line()
            .x((d) => x(d.date))
            .y((d) => y(d.y_val))

          // Create blue line
          g
          .append("path")
          .datum(combinedData)
          .attr("fill", "none")
          .attr("stroke", "blue")
          .attr("stroke-width", 1.5)
          .attr("d", lineGeneratorBlue);

            // Create red line
          g
              .append("path")
              .datum(lastSixData)
              .attr("fill", "none")
              .attr("stroke", "red")
              .attr("stroke-width", 2)
              .attr("d", lineGeneratorRed);
        }
    },[combinedData])

  return (
        <div className = 'flex flex-col  mt-32'>
        <div className = 'flex flex-col  mb-10'>
        <h1 className='text-5xl text-white font-quicksand pt-5 pb-5'>Machine Learning For Pridicting Furture Values for S&P 500</h1>
        </div>

        <div className = 'flex justify-center'>
        <svg ref={Chart_Area} width="800" height="500">
                    <g ref={Group_Area}  >
                    <text class="y axisLabel" ref={y_Label}>Closing Price</text> 
                    <text class="x axisLabel" ref={x_Label}>Time Period</text>
                    <g class="x axis" ref={x_axis}></g>
                    <g class="x axis" ref={y_axis}></g>
                    <g class="y axis" fill="none" font-size="10" font-family="sans-serif" text-anchor="end"></g>
                    </g>           
                </svg>
                <svg ref={legendRef} className="legend" width={100} height={50} />
        </div>

        </div>
  );
}

export default MachineLearningModel