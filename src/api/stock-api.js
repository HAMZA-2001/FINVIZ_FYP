
const basePath = "https://finnhub.io/api/v1";

export const searchSymbols = async (query) => {
    const URL = `${basePath}/search?q=${query}&token=ce56182ad3ifdvthsqtgce56182ad3ifdvthsqu0`;
    const response = await fetch(URL);

    if(!response.ok){
        const message = `An error has occured: ${response.status}`
        throw new Error(message);
    }

    return await response.json();
}

export const fetchStockDetails = async (stockSymbol) => {
    const URL = `${basePath}/stock/profile2?symbol=${stockSymbol}&token=ce56182ad3ifdvthsqtgce56182ad3ifdvthsqu0`;
    const response = await fetch(URL);

    if(!response.ok){
        const message = `An error has occured: ${response.status}`
        throw new Error(message);
    }

    return await response.json();
}


export const fetchQuote = async (stockSymbol) => {
    const URL = `${basePath}/quote?symbol=${stockSymbol}&token=ce56182ad3ifdvthsqtgce56182ad3ifdvthsqu0`;
    const response = await fetch(URL);

    if(!response.ok){
        const message = `An error has occured: ${response.status}`
        throw new Error(message);
    }

    return await response.json();
}

export const fetchHistoricalData = async (stockSymbol, resolution, from, to) => {
    const URL = `${basePath}/stock/candle?symbol=${stockSymbol}&resolution=${resolution}&from=${from}&to=${to}&token=ce56182ad3ifdvthsqtgce56182ad3ifdvthsqu0`
    const response = await fetch(URL);

    if(!response.ok){
        const message = `An error has occured: ${response.status}`
        throw new Error(message);
    }

    return await response.json();
}