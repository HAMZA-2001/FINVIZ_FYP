import { transition } from 'd3'
import { getDatabase, onValue, push, ref, set } from 'firebase/database'
import React, { useContext, useState } from 'react'
import { useMemo } from 'react'
import { useEffect } from 'react'
import { fetchQuote, fetchStockDetails } from '../api/stock-api'
import { useAuth } from '../Authentication/context/AuthContext'
import PortfolioTracker from './PortfolioTracker'

/**
 * 
 * @returns body where the portfolio tracker resides
 */
function PortfolioSummary() {
  return (
      <PortfolioTracker/>
  )
}

export default PortfolioSummary