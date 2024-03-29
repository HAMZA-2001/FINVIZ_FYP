import { getDatabase, onValue, ref } from 'firebase/database'
import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../Authentication/context/AuthContext'
import * as d3 from "d3";
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';

/**
 * React component which generates a dynamic purchase scatterplot
 * @returns a scatterplot visualization for the user buy/sell trend along with different option for further visualizations
 */
function PurchaseScatterPlot() {
    const {currentUser} = useAuth()
    const [data, setData] = useState([]);
    const [buyData, setbuyData] = useState([])
    const [sellData, setsellData] = useState([])

    
  const Chart_Area = useRef()
  const Group_Area = useRef()
  const x_Label = useRef()
  const y_Label = useRef()
  const x_axis = useRef()
  const y_axis = useRef()
  const groupRef = useRef()

  const divRef = useRef()

  var div = d3.select(divRef.current)
    .attr("class", "tooltip-donut")
    .style("opacity", 0)
    .style("position", "absolute")
    .style('width', "auto")
    .style('height', "auto")
    .style("border-radius", "8%")
    .style("background-color", "#373434")
    .style("display", "flex")
    .style("flex-direction", "column")
    .style("justify-content", "center")


    useEffect(() => {
        let extractData = []
        const parseDate = d3.timeParse("%Y-%m-%d")
        onValue(ref(getDatabase(), 'users/' + currentUser.uid + '/tickers'), (snapshot) => {
            Object.values(snapshot.val()).map((project, i) => {
                console.log(project.details)
                if (project.details.date !== undefined){
                    const d = new Date(project.details.date)
                    const day = d.getDate().toString().padStart(2, "0");
                    const month = (d.getMonth() + 1).toString().padStart(2, "0");
                    const year = d.getFullYear().toString();

                    const formattedDate = `${year}-${month}-${day}`;
                    extractData.push({"date":formattedDate, "action": project.details.Action, "amount": Number(project.details.AverageCostPerShare)})
                }
                
                })
             })
        setTimeout(()=>{
            setData(extractData)
        },2000)
      }, []);
      
      const buyList = [];
      const t = d3.transition().duration(750)

      const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 100, BOTTOM: 100 }
      const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
      const HEIGHT = 600 - MARGIN.TOP - MARGIN.BOTTOM
      
      
      const svg = d3.select(Chart_Area.current)
      .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
      .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)


      const g = d3.select(Group_Area.current)
      .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

      
      const xAxisGroup = d3.select(x_axis.current)
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${HEIGHT})`)

      const yAxisGroup = d3.select(y_axis.current)
      .attr("class", "y axis")

      const xLabel = d3.select(x_Label.current)
      .attr("class", "x axisLabel")
      .attr("y", HEIGHT + 50)
      .attr("x", WIDTH / 2)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .attr("fill","white")
      .text("Date")

    const yLabel = d3.select(y_Label.current)
      .attr("class", "y axisLabel")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x", -200)
      .attr("fill","white")
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")

      useEffect((()=>{
        console.log(data)
    
        // const buyList = [];
        const sellList = [];

        data.forEach(({ date, action, amount }) => {
        if (action === 'buy') {
            const index = buyList.findIndex(item => item.date === date);
            if (index !== -1) {
            buyList[index].amount += amount;
            } else {
            buyList.push({ date, amount });
            }
        } else if (action === 'sell') {
            const index = sellList.findIndex(item => item.date === date);
            if (index !== -1) {
            sellList[index].amount += amount;
            } else {
            sellList.push({ date, amount });
            }
        }
        });

        setTimeout(()=>{
            setbuyData(buyList)
            setsellData(sellList)
        },1000)
        
        
      }), [data])



      // first transition when the program starts
      useEffect(()=>{

        const dates = buyData.map(d => new Date(d.date));
        const amounts = buyData.map(d => d.amount);
        const dateExtent = d3.extent(dates);
        const amountExtent = d3.extent(amounts);
        console.log(dateExtent)
        console.log(amountExtent)
        yLabel.text("Total Activity ($)")

        const x = d3.scaleTime()
        .domain(d3.extent(buyData.concat(sellData), d => new Date(d.date)))
        .range([0, WIDTH])

        const y = d3.scaleLinear()
            .domain([0, d3.max(buyData.concat(sellData), d => d.amount)])
            .range([HEIGHT, 0])

            console.log(buyData.concat(sellData))
        
        const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat('%d-%b-%Y')).ticks(4);
        xAxisGroup.transition(t).call(xAxis)
        const yAxis = d3.axisLeft(y)
        yAxisGroup.transition(t).call(yAxis)

        svg.selectAll('circle')
        .data([])
        .exit()
        .remove();

        svg.selectAll('rect')
        .data([])
        .exit()
        .remove();

        // Append circles for 'buy' actions
        g.selectAll('circle')
        .data(buyData)
        .enter()
        .append('circle')
        .attr('cx', d => x(new Date(d.date)))
        .attr('cy', d => y(d.amount))
        .attr('r', 5)
        .attr('fill', 'green').on('mouseover', function (event, d) {
          console.log(d)
          console.log("hio")
          d3.select(this)
            .transition()
            .duration(200)
            .attr('fill', "#90ee90")
            .attr('r', 30);
          
            let showDate = d.date
            let showAmount = d.amount
            console.log(showDate, showAmount)
          div.style("opacity", "1");
              let fill = "<h1> Date : " + showDate +"</h1>" + "<h1> Spent : " + showAmount +"</h1>"
              console.log(event.pageX)
              div.html(fill)
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 15) + "px");
          
        })
        .on('mouseout', function () {
          d3.select(this)
            .attr('r', 5)
            .attr('fill', "green")
            
          div.style("opacity", 0);
    
          })

        // Append squares for 'sell' actions
        g.selectAll('rect')
        .data(sellData)
        .enter()
        .append('rect')
        .attr('x', d => x(new Date(d.date)) - 5)
        .attr('y', d => y(d.amount) - 5)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', 'red').on('mouseover', function (event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('fill', "#FFCCCB")
            .attr('width', 24)
            .attr('height', 24)
          
            let showDate = d.date
            let showAmount = d.amount
            console.log(showDate, showAmount)
          div.style("opacity", "1");
              let fill = "<h1> Date : " + showDate +"</h1>" + "<h1> Spent : " + showAmount +"</h1>"
              div.html(fill)
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 15) + "px");
          
        })
        .on('mouseout', function () {
          d3.select(this)
          .attr('width', 10)
          .attr('height', 10)
            .attr('fill', "red")
            
          div.style("opacity", 0);
    
          });

      },[buyData])
      
      /**
       * plot the scatterplot based on different use options
       * @param {string} type type of option chosen
       */
    function plotData(type){
       yLabel.text("Bought ($)")
        const t = d3.transition().duration(750)
        if(type === "Buy"){
        yLabel.text("Bought ($)")
        const dates = buyData.map(d => new Date(d.date));
        const amounts = buyData.map(d => d.amount);
        const dateExtent = d3.extent(dates);
        const amountExtent = d3.extent(amounts);

        const x = d3.scaleTime()
            .domain(dateExtent) // <-- convert date string to Date object
            .range([0, WIDTH])

        const y = d3.scaleLinear()
            .domain(amountExtent)
            .range([HEIGHT, 0])

        
        const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat('%d-%b-%Y')).ticks(4);
        xAxisGroup.transition(t).call(xAxis)
        const yAxis = d3.axisLeft(y)
        yAxisGroup.transition(t).call(yAxis)

        svg.selectAll('circle')
        .data([])
        .exit()
        .remove();
        
        svg.selectAll('rect')
        .data([])
        .exit()
        .remove();

        g.selectAll('circle')
        .data(buyData)
        .enter()
        .append('circle')
        .attr("class", "circles")
        .attr('cx', d => x(new Date(d.date)))
        .attr('cy', function(d){
            return y(d.amount)
        })
        .attr('r', 5)
        .attr('fill', "green")
        .on('mouseover', function (event, d) {
            d3.select(this)
              .transition()
              .duration(200)
              .attr('fill', "#90ee90")
              .attr('r', 30);
            
              let showDate = d.date
              let showAmount = d.amount

              console.log(showDate, showAmount)
            div.style("opacity", "1");
                let fill = "<h1> Date : " + showDate +"</h1>" + "<h1> Spent : " + showAmount +"</h1>"
                console.log(event.pageX)
                div.html(fill)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 15) + "px");
            
          })
          .on('mouseout', function () {
            d3.select(this)
              .attr('r', 5)
              .attr('fill', "green")
              
            div.style("opacity", 0);
      
            })


        }else if(type === "Sell"){
            yLabel.text("Sold ($)")
            const dates = sellData.map(d => new Date(d.date));
        const amounts = sellData.map(d => d.amount);
        console.log(dates)
        const dateExtent = d3.extent(dates);
        const amountExtent = d3.extent(amounts);
        console.log(dateExtent)
        console.log(amountExtent)

        const x = d3.scaleTime()
            .domain(dateExtent) // <-- convert date string to Date object
            .range([0, WIDTH])

        const y = d3.scaleLinear()
            .domain(amountExtent)
            .range([HEIGHT, 0])

        
        const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat('%d-%b-%Y')).ticks(4);
        xAxisGroup.transition(t).call(xAxis)
        const yAxis = d3.axisLeft(y)
        yAxisGroup.transition(t).call(yAxis)

        svg.selectAll('circle')
        .data([])
        .exit()
        .remove();

        svg.selectAll('rect')
        .data([])
        .exit()
        .remove();

        g.selectAll('rect')
        .data(sellData)
        .enter()
        .append('rect')
        .attr("class", "rect")
        .attr('x', d => x(new Date(d.date)))
        .attr('y', function(d){
            return y(d.amount)
        })
        .attr('width', 14)
        .attr('height', 14)
        .attr('fill', 'red')
        .on('mouseover', function (event, d) {
            d3.select(this)
              .transition()
              .duration(200)
              .attr('fill', "#FFCCCB")
              .attr('width', 24)
              .attr('height', 24)
            
              let showDate = d.date
              let showAmount = d.amount
              console.log(showDate, showAmount)
            div.style("opacity", "1");
                let fill = "<h1> Date : " + showDate +"</h1>" + "<h1> Spent : " + showAmount +"</h1>"
                div.html(fill)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 15) + "px");
            
          })
          .on('mouseout', function () {
            d3.select(this)
            .attr('width', 14)
            .attr('height', 14)
              .attr('fill', "red")
              
            div.style("opacity", 0);
      
            })

        }else if(type === "Overall"){
          yLabel.text("Total Activity ($)")

          // Filter data to only include 'buy' and 'sell' actions
          const buyD = buyData.filter(d => d.action === 'buy');
          const sellD = sellData.filter(d => d.action === 'sell');

          const x = d3.scaleTime()
          .domain(d3.extent(buyData.concat(sellData), d => new Date(d.date)))
          .range([0, WIDTH])

          const y = d3.scaleLinear()
              .domain([0, d3.max(buyData.concat(sellData), d => d.amount)])
              .range([HEIGHT, 0])
          
          const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat('%d-%b-%Y')).ticks(4);
          xAxisGroup.transition(t).call(xAxis)
          const yAxis = d3.axisLeft(y)
          yAxisGroup.transition(t).call(yAxis)

          svg.selectAll('circle')
          .data([])
          .exit()
          .remove();

          svg.selectAll('rect')
          .data([])
          .exit()
          .remove();

          // Append circles for 'buy' actions
          g.selectAll('circle')
          .data(buyData)
          .enter()
          .append('circle')
          .attr('cx', d => x(new Date(d.date)))
          .attr('cy', d => y(d.amount))
          .attr('r', 5)
          .attr('fill', 'green').on('mouseover', function (event, d) {

            d3.select(this)
              .transition()
              .duration(200)
              .attr('fill', "#90ee90")
              .attr('r', 30);
            
              let showDate = d.date
              let showAmount = d.amount
              console.log(showDate, showAmount)
            div.style("opacity", "1");
                let fill = "<h1> Date : " + showDate +"</h1>" + "<h1> Spent : " + showAmount +"</h1>"
                console.log(event.pageX)
                div.html(fill)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 15) + "px");
            
          })
          .on('mouseout', function () {
            d3.select(this)
              .attr('r', 5)
              .attr('fill', "green")
              
            div.style("opacity", 0);
      
            })

          ;

          // Append squares for 'sell' actions
          g.selectAll('rect')
          .data(sellData)
          .enter()
          .append('rect')
          .attr('x', d => x(new Date(d.date)) - 5)
          .attr('y', d => y(d.amount) - 5)
          .attr('width', 10)
          .attr('height', 10)
          .attr('fill', 'red').on('mouseover', function (event, d) {
            d3.select(this)
              .transition()
              .duration(200)
              .attr('fill', "#FFCCCB")
              .attr('width', 24)
              .attr('height', 24)
            
              let showDate = d.date
              let showAmount = d.amount

            div.style("opacity", "1");
                let fill = "<h1> Date : " + showDate +"</h1>" + "<h1> Spent : " + showAmount +"</h1>"
                console.log(event.pageX)
                div.html(fill)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 15) + "px");
            
          })
          .on('mouseout', function () {
            d3.select(this)
            .attr('width', 10)
            .attr('height', 10)
              .attr('fill', "red")
              
            div.style("opacity", 0);
      
            });
            }
        
    
    }

      const [action, setaction] = useState("buy")

      /**
       * prompt the program about the type of action chosen
       * @param {object} event event type
       */
      function actionbutton(event){
        const t = d3.transition().duration(750)
        const val = event.target.value
        div.style("opacity", 0);
        if (val === "sell"){
            plotData("Sell")
        }else if(val === "buy"){
            plotData("Buy")
        }else{
           plotData("Overall")
        }


        setaction(event.target.value)
      }



  return (
    <div>
          <div ref={divRef}>
          </div>
          <svg ref={Chart_Area} width="800" height="500">
            <g ref={groupRef}>
              </g>
              <g ref={Group_Area}  >
                <text class="y axisLabel" ref={y_Label}></text> 
                <text class="x axisLabel" ref={x_Label}></text>
                <g class="x axis" ref={x_axis}></g>
                <g class="x axis" ref={y_axis}></g>
                <g class="y axis" fill="none" font-size="10" font-family="sans-serif" text-anchor="end"></g>
              </g>
            </svg>
            <div>
            <FormControl>
            <RadioGroup
                column
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                defaultValue="overall"
            >
                <FormControlLabel value="overall" control={<Radio />} label="Overall History" onChange={actionbutton.bind(this)} />
                <FormControlLabel value="buy" control={<Radio />} label="Purchase History" onChange={actionbutton.bind(this)} />
                <FormControlLabel value="sell" control={<Radio />} label="Sold History" onChange={actionbutton.bind(this)} />
                </RadioGroup>
            </FormControl>
            </div>
    </div>
  )
}

export default PurchaseScatterPlot