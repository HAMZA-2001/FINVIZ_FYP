import ChartCard from './ChartCard'
import React, { useContext, useState, useEffect } from 'react'
import {
    Area,
    XAxis,
    YAxis,
    ResponsiveContainer,
    AreaChart,
    Tooltip,
  } from "recharts";
import { chartConfig } from '../constants/config';
import ChartFilter from './ChartFilter';
import {convertUnixTimestampToDate, convertDateToUnixTimestamp, createDate} from "./date-helper"
import {fetchHistoricalData} from "../api/stock-api"
import StockContext from "./StockContext";

function DashboardChart() {
    const [data, setData] = useState();
    const [filter, setFilter] = useState("1W");
    const {stockSymbol} = useContext(StockContext)

    const formatData = (data) => {
        return data.c.map((item, index) => {
          return {
            value: item.toFixed(2),
            date: convertUnixTimestampToDate(data.t[index]),
          };
        });
      };

    useEffect(() => {
        // Find start and End timestamp
        function getDataRange(){
            const {days, weeks, months, years} = chartConfig[filter]
            const endDate = new Date();
            const startDate = createDate(endDate,-days,-weeks,-months,-years)
            const startTimestampUnix = convertDateToUnixTimestamp(startDate)
            const endTimestampUnix = convertDateToUnixTimestamp(endDate)

            return {startTimestampUnix, endTimestampUnix}
        }

        async function updateChartData(){
            try {
                const {startTimestampUnix, endTimestampUnix} = getDataRange()
                const resolution = chartConfig[filter].resolution
                const result = await fetchHistoricalData(stockSymbol, resolution, startTimestampUnix, endTimestampUnix)
                console.log(result)
                setData(formatData(result))
            } catch (error) {
                setData([])
                console.log(error)
            }
        }
        updateChartData()
    }, [stockSymbol, filter])
    
  return (
<ChartCard>
        <ul className="flex absolute top-2 right-2 z-40">
        {Object.keys(chartConfig).map((item) => (
          <li key={item}>
            <ChartFilter
              text={item}
              active={filter === item}
              onClick={() => {
                setFilter(item);
              }}
            />
          </li>
        ))}
      </ul>
        <ResponsiveContainer>

            <AreaChart data={data}>
            <defs>
            <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="rgb(199 210 254)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={"rgb(199 210 254)"}
                stopOpacity={0.3}
              />
            </linearGradient>
          </defs>
            <Area
            type="monotone"
            dataKey="value"
            stroke="#312e81"
            fill='url(#chartColor)'
            fillOpacity={1}
            strokeWidth={0.5}
          />
          <Tooltip/>
          <XAxis dataKey={"date"} />
          <YAxis domain={["dataMin", "dataMax"]} />

            </AreaChart>
            
        </ResponsiveContainer>
</ChartCard>        

  )
}

export default DashboardChart;