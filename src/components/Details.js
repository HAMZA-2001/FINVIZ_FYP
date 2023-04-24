import React from 'react';
import Card from "./Card";

/**
 * creates a stock details card component
 * @param {object} details data for the details 
 * @returns stock details
 */
function Details({details}) {
    const detailsList = {
        name: "Name",
        country: "Country",
        currency: "Currency",
        exchange: "Exchange",
        ipo: "IPO Date",
        marketCapitalization: "Market Capitalization",
        finnhubIndustry: "Industry",
    }

    /**
     * convert for millio to billion
     * @param {*} number number to be converted
     * @returns converted number
     */
    const convertMillionToBillion = (number) => {
        return (number/1000).toFixed(2)
    }
  return (
    
    <Card>
        <ul className='w-full h-full flex flex-col justify-between divide-y-1'>
            {Object.keys(detailsList).map((item) => {
                return (
                    <li key={item} className="flex-1 flex justify-between items-center">
                    <span>{detailsList[item]}</span>
                    <span>
                        {
                            item === "marketCapitalization"
                            ? `${convertMillionToBillion(details[item])}B`: details[item] 
                        }
                    </span>
                    </li>
                )
            })}

        </ul>
    </Card>
  )
}

export default Details