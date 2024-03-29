import React, { useEffect, useRef, useState } from 'react'
import * as d3 from "d3";
import { FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select } from '@material-ui/core';

/**
 * Plots a doughnut chart based which changes shape of its arc based on various indicators and onverlay 52week range sliders for 52week range
 * @param {object} param0 data required to produce visulization 
 * @returns dynamic doughnut chart
 */
function PieChartVis({Summary, PMS}) {
    const svgRef = useRef()
    const groupRef = useRef()
    const divRef = useRef()
    const divRef2 = useRef()
    const tooltipRef = useRef();
    
    const [selectValue, setselectValue] = useState("")
    const [selectedData, setSelectedData] = useState("mc")

    
    var width = 700
    var height = 590
    var radius = Math.min(width, 400) / 2
    var color = d3.scaleOrdinal(d3.schemeCategory10)
    var arc = d3.arc()
        .outerRadius(radius - 20)
        .innerRadius(radius - 80)
        

    var pie = d3.pie()
        .sort(null)
        .value(function(d){
            if(selectedData === "mc"){
                 return d.marketcap
            }if(selectedData === "shares"){
                return d.Total_Shares
            }if(selectedData === "pv"){
                return d.Position_Value
            }if(selectedData === "ap"){
                return d.Amount_Paid
            }if(selectedData === "costbasis"){
                let total = 0
                Summary.forEach(element => {
                    total = total + element.Amount_Paid
                });
                return (d.Amount_Paid/total)
            }
           
        })


    var svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + (width-100)/2 + "," + height/2 + ")")
        .attr("class", "group")
        

    if (Summary.length > 0 ){
        let d = Summary

        var g = svg.selectAll(".arc")
            .data(pie(d))
            .enter().append("g")
            .attr("class", "arc")

            var div = d3.select(divRef.current)
            .attr("class", "tooltip-donut")
            .style("opacity", 1)
            .style("position", "absolute")
            .style('width', "auto")
            .style('height', "auto")
            .style("border-radius", "8%")
            .style("background-color", "#05445E")
            .style("display", "flex")
            .style("flex-direction", "column")
            .style("justify-content", "center")
            

        g.append("path")
            .attr("d", arc)
            .attr("class", "pathelm")
            .style("fill", function(d,i){return color(i)})
            .on('mouseover', function (event, d) {
                d3.select(this).transition()
                .duration('50')
        
                div.transition()
                    .duration(50)
                    .style("opacity", "1");
                let num =  (d.data.marketcap).toFixed(2);
                let hoverIMG = `<img class="rounded-full object-cover" src= ${d.data.logo} alt=""/>`
                let fill = "<h1>" + selectedData.toUpperCase() + ": " + num +"</h1>" + hoverIMG
                div.html(fill)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 15) + "px");
                })
            .on('mouseout', function (d, i) {
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '1');
                div.transition()
                    .duration('50')
                    .style("opacity", 0);
        });

          // Create the legend
          var legend = d3.select(groupRef.current)
          .attr("class", "legend")
          .attr("transform", "translate(" + (width - 80) + "," + 20 + ")")
          .selectAll("g")
          .data(Summary)
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
          .text(function(d) { return d.Symbol; });
    }
    
    /**
     * changes the doughnut chart based on different portfolio attrubutes
     * @param {object} val event tyoe  
     */
    function getSelectedValues(val){
        const yValue = val.target.value
        if (yValue === 'mc') {
            setSelectedData(yValue)
        }else if (yValue == 'shares') {
            setSelectedData(yValue)
        } else if (yValue === 'pv'){
            setSelectedData(yValue)
        }else if (yValue == 'ap'){
            setSelectedData(yValue)
        }else if(yValue == 'costbasis'){
            setSelectedData(yValue)
        }
     }

     const contentRef = useRef()

    useEffect(()=>{

        var svg = d3.select(svgRef.current)
        svg.selectAll(".group").remove()


        var svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + (width-100)/2 + "," + height/2 + ")")
        // .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
        .attr("class", "group")


        let d = Summary
        console.log(d)
        console.log(Summary)
        console.log(overview)

        var g = svg.selectAll(".arc")
            .data(pie(d))
            .enter().append("g")
            .attr("class", "arc")

        var div = d3.select(divRef.current)
            .attr("class", "tooltip-donut")
            .style("opacity", 0)
            .style("position", "absolute")
            .style('width', "auto")
            .style('height', "auto")
            .style("border-radius", "8%")
            .style("box-shadow", "inset 0 0 12px #189AB4")
            .style("background-color", "#05445E")
            .style("display", "flex")
            .style("flex-direction", "column")
            .style("justify-content", "center")

        var form = d3.select(contentRef.current)

         g.append("path")
            .attr("d", arc)
            .attr("class", "pathClass")
            .style("fill", function(d,i){return color(i)})
            .on('mouseover', function (event, d) {
                d3.select(this).transition()
                .duration('50')        
                .attr("stroke-width",16);
        
                div.transition()
                    .duration(50)
                    .style("opacity", "1");
                    let num = 0
                    if(selectedData === "mc"){
                        num = (d.data.marketcap).toFixed(2);
                   }if(selectedData === "shares"){
                        num =  (d.data.Total_Shares)
                   }if(selectedData === "pv"){
                        num =  (d.data.Position_Value)
                    }if(selectedData === "ap"){
                        let total = 0
                        Summary.forEach(element => {
                            total = total + element.Amount_Paid
                        })
                        let cb = ((d.data.Amount_Paid/total)*100).toFixed(2)
                        num =  (d.data.Amount_Paid) + "  " + cb + "%" 
                    if(selectedData === "costbasis"){
                        num = ((d.data.Amount_Paid/total)*100) + "%"
                        }
                    }
            

                let hoverIMG = `<img class="rounded-full object-cover" src= ${d.data.logo} alt=""/>`
                let indicatortext = "<h1>" + selectValue.toUpperCase() + ": " + d.data[selectValue] +"</h1>"
                if(selectValue==="PERatio" & d.data[selectValue]==="None"){
                    indicatortext = "<h1>" + selectValue.toUpperCase() + ": " + parseInt(d.data.Current_Price/d.data.EPS) +"</h1>"
                }
                
                let fill = "<h1>" + selectedData.toUpperCase() + ": " + num +"</h1>" + indicatortext + hoverIMG
                div.html(fill)
                .style("left", (event.pageX - 10) + "px")
                .style("top", (event.pageY + 15) + "px");


                })
            .on('mouseout', function (d, i) {
                    d3.select(this)      
                    .attr("stroke-width",6)
                    .attr('opacity', '1');
                    div.transition()
                    .style("opacity", 0);           
                });

            g.append("text")
            .attr("transform", function(d){
                d.innerRadius = radius ;
                d.outerRadius = radius ;
                return "translate(" + arc.centroid(d) + ")";
                })
                .attr("text-anchor", "middle")
                .text( function(d, i) {
                    let sv = ""
                    if(d.endAngle-d.startAngle>0.2){
                        sv = d.data[selectValue]
                        if (selectValue === "PERatio" & d.data[selectValue]==="None"){
                            sv = parseInt(d.data.Current_Price/d.data.EPS)
                        }
                    }
                return (sv)}
                )
            .style("fill", "white")

            if(selectValue === "PERatio"){
                var modifyArc = d3.arc()
                    .outerRadius(function(d,i){
                        if(d.data.PERatio === "None"){
                            return radius -20 + parseInt(d.data.Current_Price/d.data.EPS)/10
                        }else{
                            return radius -20 + parseInt(d.data.PERatio)
                        }
                    
                    })
                    .innerRadius(radius - 80)
                        const t = d3.transition().duration(750)
                        g.selectAll(".pathClass").transition(t).attr("d", modifyArc)
            }if(selectValue === "PEGRatio"){
                var modifyArc = d3.arc()
                    .outerRadius(function(d){
                        if(d.data.PEGRatio === "None"){
                            return radius -20
                        }else{
                            return radius -20 + parseInt(d.data.PEGRatio*5)
                        }
                    
                    })
                    .innerRadius(radius - 80)
                        const t = d3.transition().duration(750)
                        g.selectAll(".pathClass").transition(t).attr("d", modifyArc)
            }if(selectValue === "Beta"){
                var modifyArc = d3.arc()
                    .outerRadius(function(d){
                        if(d.data.Beta === "None"){
                            return radius -20
                        }else{
                            return radius -20 + parseInt(d.data.Beta*15)
                        }
                    
                    })
                    .innerRadius(radius - 80)
                        const t = d3.transition().duration(750)
                        g.selectAll(".pathClass").transition(t).attr("d", modifyArc)
            }if(selectValue === "EPS"){
                var modifyArc = d3.arc()
                    .outerRadius(function(d){
                        if(d.data.EPS === "None"){
                            return radius -20
                        }else{
                            return radius -20 + parseInt(d.data.EPS*5)
                        }
                    
                    })
                    .innerRadius(radius - 80)
                        const t = d3.transition().duration(750)
                        g.selectAll(".pathClass").transition(t).attr("d", modifyArc)

            }if(selectValue === "slider"){
                var modifyArc = d3.arc()
                .outerRadius(function(d){
                    if(d.data["52WeekHigh"] === "None"){
                        return radius -20
                    }else{
                        return radius -20 + parseInt(d.data["52WeekHigh"]/8)
                    }
                
                })
                .innerRadius(function(d){
                    if(d.data["52WeekLow"] === "None"){
                        return radius -20
                    }else{
                        return radius - 80 - parseInt(d.data["52WeekLow"]/8)
                    }
                
                })
                    const t = d3.transition().duration(750)
                    g.selectAll(".pathClass").transition(t).attr("d", modifyArc)
            }


        // slider
        const innerGroup = g.append("g")
        .attr("transform", function(d){
            console.log(d)
        if(d.endAngle - d.startAngle >= 0.2){
            d.innerRadius = radius - 50;
            d.outerRadius = radius - 20;
            console.log(arc.centroid(d))
            var midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            var degrees = midAngle * 180 / Math.PI - 90;
            if (degrees > 90) {
              degrees -= 180;
              return "translate(" + arc.centroid(d) + ")" + " " + "rotate(" + degrees + ")";
            }else{
                console.log(degrees+90)
                degrees+=180
                return "translate(" + arc.centroid(d) + ")" + "rotate(" +  degrees + ")" ;
            }
            // return "rotate(" + degrees + ")";

            
        }else{
         
            return "translate(" +1000+ ")" + " " + "rotate(30)";
        }
       
        })
            .attr("text-anchor", "middle")
 
                    


        const innerSVG = innerGroup.append('div');
        let cont = `<h1>he</h1>`
            innerSVG.html(cont)
            innerSVG.append('input').attr("type", "number")
            if(selectValue === "slider"){

               
                // Add sliders to each segment
                var sliders = g.selectAll(".slider")
                .data(pie(d))
                .enter()
                .append("g")
                .attr("class", "slider")
                .attr("transform", function(d){
                    console.log(d)
                if(d.endAngle - d.startAngle >= 0.2){
                    d.innerRadius = radius - 50;
                    d.outerRadius = radius - 20;
                    var midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                    var degrees = midAngle * 180 / Math.PI - 90;
                    if (degrees > 90) {
                      degrees -= 180;
                      return "translate(" + arc.centroid(d) + ")" + " " + "rotate(" + degrees + ")";
                    }else{
                        degrees+=180
                        return "translate(" + arc.centroid(d) + ")" + "rotate(" +  degrees + ")" ;
                    }


                    
                }else{
                 
                    return "translate(" +1000+ ")" + " " + "rotate(30)";
                }
               
                })


                // Add a line to each slider
                sliders.append("line")
                .attr("x1", -100)
                .attr("y1", 0)
                .attr("x2", 10)
                .attr("y2", 0)
                .style("stroke", "#000")
                .style("stroke-width", 4);

                // Add two circles to each slider
                sliders.append("circle")
                .attr("class", "circle1")
                .attr("cx", function(d){
                    const high = (d.data["52WeekHigh"]*-100)/450
                    return high

                })
                .attr("cy", 0)
                .attr("r", 6)
                .style("fill", "#fff")
                .style("stroke", "#000")
                .on("mouseover", (event, d) => {
                    const tooltip = d3.select(tooltipRef.current);
                    tooltip.html(`High: ${d.data["52WeekHigh"]}`);
                    tooltip.style("display", "inline-block");
                })
                .on("mousemove", (event) => {
                    const tooltip = d3.select(tooltipRef.current);
                    tooltip.style("left", event.pageX + 10 + "px");
                    tooltip.style("top", event.pageY - 10 + "px");
                })
                .on("mouseout", () => {
                    const tooltip = d3.select(tooltipRef.current);
                    tooltip.style("display", "none");
                });

                sliders.append("circle")
                .attr("class", "circle2")
                .attr("cx", function(d){
                    const high = (d.data["52WeekLow"]*-100)/450
                    return high

                })

                .attr("cy", 0)
                .attr("r", 6)
                .style("fill", "#aaa")
                .style("stroke", "#555")
                .on("mouseover", (event, d) => {
                    const tooltip = d3.select(tooltipRef.current);
                    tooltip.html(`Low: ${d.data["52WeekLow"]}`);
                    tooltip.style("display", "inline-block");
                })
                .on("mousemove", (event) => {
                    const tooltip = d3.select(tooltipRef.current);
                    tooltip.style("left", event.pageX + 10 + "px");
                    tooltip.style("top", event.pageY - 10 + "px");
                })
                .on("mouseout", () => {
                    const tooltip = d3.select(tooltipRef.current);
                    tooltip.style("display", "none");
                });

        
                innerGroup.append("text")
                .attr("x", -110)
                .attr("y", 10)
                .attr("dy", ".35em")
                .attr("fill", "white" ).text( function(d, i) {
                return (d.data["52WeekHigh"])})

                innerGroup.append("text")
                .attr("x", 30)
                .attr("y", 10)
                .attr("dy", ".35em")
                .attr("fill", "white" ).text( function(d, i) {
                    return (d.data["52WeekLow"])})
            }

             

    },[selectedData, selectValue])

    let Overview_URL_List = []
    let OWlist = []
    const [overview, setOverview] = useState([]) 

    useEffect(()=>{
        if(Summary.length > 0){
            Summary.forEach((item, index)=>{
                let datatobefetched = fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${item.Symbol}&apikey=R6DXIM881UZRQGUU`)
                Overview_URL_List.push(datatobefetched)
            })

            if(Overview_URL_List.length === Summary.length){
                Promise.all(Overview_URL_List).then(function (responses){
                    responses.forEach((item, i)=>{
                        process2(item.json(), Summary[i].Symbol)
                    })
                }).catch(function (error) {
                    // if there's an error, log it
                    console.log(error);
                });
            }
            
            /**
             * Generates indicator values from the API
             * @param {*} prom promise value from the api 
             * @param {*} ticker ticker's data to be fetched
             */
            let process2 = (prom, ticker) => {
                prom.then(data=>{
                    OWlist.push({"ticker": ticker, "quote_data": data})
                })
             
            }

            setTimeout(()=>{
                setOverview(OWlist)
                console.log(OWlist)
                if (OWlist.length>0){
                    Summary.forEach((element,i)=>{
                        OWlist.forEach((overview_elm)=>{
                            if(element.Symbol === overview_elm.ticker){
                                console.log(overview_elm)
                                Summary[i]["PERatio"] = overview_elm.quote_data.PERatio
                                Summary[i]["PEGRatio"] = overview_elm.quote_data.PEGRatio
                                Summary[i]["Beta"] = overview_elm.quote_data.Beta
                                Summary[i]["EPS"] = overview_elm.quote_data.EPS
                                Summary[i]["52WeekHigh"] = overview_elm.quote_data["52WeekHigh"]
                                Summary[i]["52WeekLow"] = overview_elm.quote_data["52WeekLow"]

                            }
                        })
                    })
                }
            },1000)
        }
    },[Summary])

    /**
     * set the value chosen to be viewd 
     * @param {*} event event type
     */
    function handleInputChange(event){
        setselectValue(event.target.value)
    }
  return (
    <div className='justify-center'>

        <div>
        <select id="var-select" className="form-control bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 inline text-center" defaultValue={'M'} onChange = {getSelectedValues.bind(this)}>
                <option value="mc">Market Capitalization</option>
                <option value="shares">Shares</option>
                <option value="pv">Position Value</option>
                <option value="ap">Amount Paid</option>
                {/* <option value="costbasis">Cost Basis</option> */}
            </select>
        </div>
        

        <div className='flex'>
    	    <div>
            <FormControl>
            <RadioGroup
                column
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
            >
                <FormControlLabel value="" control={<Radio />} label="RESET" onChange={handleInputChange.bind(this)} />
                <FormControlLabel value="PERatio" control={<Radio />} label="P/E" onChange={handleInputChange.bind(this)} />
                <FormControlLabel value="PEGRatio" control={<Radio />} label="PEG Ratio" onChange={handleInputChange.bind(this)}/>
                <FormControlLabel value="Beta" control={<Radio />} label="Beta" onChange={handleInputChange.bind(this)}/>
                <FormControlLabel value="EPS" control={<Radio />} label="EPS" onChange={handleInputChange.bind(this)}/>
                <FormControlLabel value="slider" control={<Radio />} label="52 Week Range" onChange={handleInputChange.bind(this)}/>

                </RadioGroup>
            </FormControl>
            </div>
            <div ref={divRef}>

            </div>
            

             <div ref={divRef2}>

            </div>            


            <div  className='h-full mb-5'>
            <div ref={tooltipRef} style={{ display: "none", position: "absolute" }} />
                <svg className= "pt-6 " ref={svgRef} width="800" height="500">
                    <g ref={groupRef}>
                    </g>
                </svg>
            </div>

        </div>
    </div>
  )
}

export default PieChartVis