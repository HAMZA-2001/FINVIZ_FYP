// function calculatePortfolioValue(transactions, apiKey) {
//     const [portfolioValue, setPortfolioValue] = useState(null);
  
//     useEffect(() => {
//       const symbols = [...new Set(transactions.map(t => t.ticker))];
//       const url = `https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=${symbols.join()}&apikey=${apiKey}`;
  
//       fetch(url)
//         .then(res => res.json())
//         .then(data => {
//           const quotes = data['Stock Quotes'];
//           const value = transactions.reduce((acc, t) => {
//             const quote = quotes.find(q => q['1. symbol'] === t.ticker);
//             const price = quote ? parseFloat(quote['2. price']) : 0;
//             return acc + (price * t.shares);
//           }, 0);
//           setPortfolioValue(value);
//         })
//         .catch(error => {
//           console.error(error);
//           setPortfolioValue(null);
//         });
//     }, [transactions, apiKey]);
  
//     return(    
//     <div>
//         {portfolioValue}
//         </div>)
//     ;
//   }