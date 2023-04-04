// // import React, { useState, useEffect } from "react";
// // import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

// // const API_KEY = "ce56182ad3ifdvthsqtgce56182ad3ifdvthsqu0";
// // const SYMBOLS = ["AAPL", "GOOG", "MSFT"];
// // const INTERVALS = ["weekly", "monthly", "yearly"];
// // // https://www.alphavantage.co/query?function=TIME_SERIES_weekly&symbol=AAPL&apikey=ce56182ad3ifdvthsqtgce56182ad3ifdvthsqu0

// // const PortfolioChart = () => {
// //   const [data, setData] = useState([]);

// //   // Fetch data from API
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       const urls = SYMBOLS.map(symbol =>
// //         `https://www.alphavantage.co/query?function=TIME_SERIES_weekly&symbol=${symbol}&apikey=${API_KEY}`
// //       );
// //       const responses = await Promise.all(urls.map(url => fetch(url)));
// //       const jsons = await Promise.all(responses.map(response => response.json()));
// //       const stockData = jsons.map(json => json["Time Series (Daily)"]);
// //       const dates = Object.keys(stockData[0]).reverse();
// //       const stockPrices = dates.reduce((prices, date) => {
// //         const pricesOnDate = stockData.map(data => parseFloat(data[date]["4. close"]));
// //         const totalValue = pricesOnDate.reduce((total, price, index) => {
// //           const shares = portfolio[index].shares;
// //           return total + shares * price;
// //         }, 0);
// //         return { ...prices, [date]: totalValue };
// //       }, {});
// //       const data = INTERVALS.reduce((aggData, interval) => {
// //         const dates = Object.keys(stockPrices);
// //         const intervalDates = dates.filter((_, index) => {
// //           const date = new Date(dates[index]);
// //           const prevDate = index > 0 ? new Date(dates[index - 1]) : null;
// //           switch (interval) {
// //             case "weekly":
// //               return !prevDate || date.getDay() < prevDate.getDay();
// //             case "monthly":
// //               return !prevDate || date.getMonth() !== prevDate.getMonth();
// //             case "yearly":
// //               return !prevDate || date.getFullYear() !== prevDate.getFullYear();
// //             default:
// //               return true;
// //           }
// //         });
// //         const intervalData = intervalDates.map(date => ({
// //           date,
// //           value: stockPrices[date],
// //         }));
// //         return [...aggData, ...intervalData];
// //       }, []);
// //       setData(data);
// //     };
// //     fetchData();
// //   }, []);

// //   return (
// //     <LineChart width={800} height={400} data={data}>
// //       <XAxis dataKey="date" />
// //       <YAxis />
// //       <Tooltip />
// //       <Legend />
// //       <Line type="monotone" dataKey="value" name="Total Invested Value" stroke="#8884d8" />
// //     </LineChart>
// //   );
// // };

// // export default PortfolioChart;

// import React, { useState, useEffect } from "react";
// import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

// const API_KEY = "ce56182ad3ifdvthsqtgce56182ad3ifdvthsqu0";
// const SYMBOLS = ["AAPL", "GOOG", "MSFT"];
// const INTERVALS = ["weekly", "monthly", "yearly"];

// const portfolio = [
//   { symbol: "AAPL", shares: 10 },
//   { symbol: "GOOG", shares: 5 },
//   { symbol: "MSFT", shares: 20 },
// ];

// const PortfolioChart = () => {
//   const [data, setData] = useState([]);

//   // Fetch data from API
//   useEffect(() => {
//     const fetchData = async () => {
//       const urls = SYMBOLS.map(symbol =>
//         `https://www.alphavantage.co/query?function=TIME_SERIES_weekly&symbol=${symbol}&apikey=${API_KEY}`
//       );
//       const responses = await Promise.all(urls.map(url => fetch(url)));
//       const jsons = await Promise.all(responses.map(response => response.json()));
//       console.log("jsons:", jsons);
//       const stockData = jsons.map(json => json[`Weekly Time Series`]);
//       const dates = Object.keys(stockData[0]).reverse();
  
//       const stockPrices = dates.reduce((prices, date) => {
//         console.log(date)
        
//         const pricesOnDate = stockData.map(data => {
//             //parseFloat(data[date]["4. close"])
//             console.log(date)
          
//         });
//         const totalValue = pricesOnDate.reduce((total, price, index) => {
//           const shares = portfolio[index].shares;
//           return total + shares * price;
//         }, 0);
//         console.log("data[date]:", data[date]);
//         return { ...prices, [date]: totalValue };
//       }, {});
 
//       const data = INTERVALS.reduce((aggData, interval) => {
//         const dates = Object.keys(stockPrices);
//         const intervalDates = dates.filter((_, index) => {
//           const date = new Date(dates[index]);
//           const prevDate = index > 0 ? new Date(dates[index - 1]) : null;
//           switch (interval) {
//             case "weekly":
//               return !prevDate || date.getDay() < prevDate.getDay();
//             case "monthly":
//               return !prevDate || date.getMonth() !== prevDate.getMonth();
//             case "yearly":
//               return !prevDate || date.getFullYear() !== prevDate.getFullYear();
//             default:
//               return true;
//           }
//         });
//         const intervalData = intervalDates.map(date => ({
//           date,
//           value: stockPrices[date],
//         }));
//         return [...aggData, ...intervalData];
//       }, []);
//       setData(data);
//     };
//     fetchData();
    
//   }, []);

//   return (
//     <LineChart width={800} height={400} data={data}>
//       <XAxis dataKey="date" />
//       <YAxis />
//       <Tooltip />
//       <Legend />
//       <Line type="monotone" dataKey="value" name="Total Invested Value" stroke="#8884d8" />
//     </LineChart>
//   );
// };

// export default PortfolioChart;