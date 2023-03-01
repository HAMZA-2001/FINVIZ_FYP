import React, { useState } from 'react'
import * as d3 from "d3";
import { convertDateToUnixTimestamp, createDate } from '../components/date-helper';
// import {convertUnixTimestampToDate, convertDateToUnixTimestamp, createDate} from "..components/date-helper"

const chartConfig = {
    "1D": { resolution: "1", days: 1, weeks: 0, months: 0, years: 0 },
    "1W": { resolution: "15", days: 0, weeks: 1, months: 0, years: 0 },
    "1M": { resolution: "60", days: 0, weeks: 0, months: 1, years: 0 },
    "1Y": { resolution: "D", days: 0, weeks: 0, months: 0, years: 1 },
  };


function ComparingStocksVis() {
    const [filter, setFilter] = useState("1W");
    const parseDate = d3.timeParse("%Y-%m-%d")

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

    d3.json(`https://finnhub.io/api/v1/stock/candle?symbol=AAPL&resolution=${resolution}&from=${startTimestampUnix}&to=${endTimestampUnix}&token=ce56182ad3ifdvthsqtgce56182ad3ifdvthsqu0`).then(data => {

        // const d = []
        // data.c.forEach(element => {
            
        // });
        console.log(data)
    })
            // prepare and clean data}
  return (
    <div>ComparingStocksVis</div>
  )
}

export default ComparingStocksVis