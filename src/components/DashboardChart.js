import { Card } from '@material-ui/core';
import React, { useState } from 'react'
import { mockHistoricalData } from '../constants/mock'
// import ChartFilter from "./ChartFilter";
import { convertUnixTimestampToDate } from './date-helper';
import {
    Area,
    XAxis,
    YAxis,
    ResponsiveContainer,
    AreaChart,
    Tooltip,
  } from "recharts";
//   import ThemeContext from "../context/ThemeContext";
//   import StockContext from "../context/StockContext";

function DashboardChart() {
    const [data, setData] = useState(mockHistoricalData);
    const [filter, setFilter] = useState("1W");
    const formatData = (data) => {
        return data.c.map((item, index) => {
          return {
            value: item.toFixed(2),
            date: convertUnixTimestampToDate(data.t[index]),
          };
        });
      };
  return (
 
        <ResponsiveContainer>
            <AreaChart data={formatData(data)}>
            <Area
            type="monotone"
            dataKey="value"
            stroke="#312e81"

            fillOpacity={1}
            strokeWidth={0.5}
          />
          <Tooltip/>
          <XAxis dataKey={"date"} />
          <YAxis domain={["dataMin", "dataMax"]} />

            </AreaChart>
        </ResponsiveContainer>

  )
}

export default DashboardChart;