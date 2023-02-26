import { getDatabase, onValue, ref } from 'firebase/database'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../Authentication/context/AuthContext'

function BarChartVis() {
    const [dbItems, setdbItems] = useState([])
    const {currentUser} = useAuth()


  function reteriveData(){
        let dbcontents = []
        onValue(ref(getDatabase(), 'users/' + currentUser.uid + '/tickers'), (snapshot) => {
            Object.values(snapshot.val()).map((project, item) => {  
                    dbcontents.push(project)

                })     
            }
            )
        // setdbItems(dbcontents)
        return dbcontents
    }


    useEffect(() => {
        const data = reteriveData()
        setTimeout(()=>{
            setdbItems(data)
        },1000)
    }, []);

    useEffect(() => {
        if(dbItems.length > 0){
            dbItems.forEach((item, index)=>{
                if (item.details !== ''){
                    console.log(item.details)
                }
            })

        }
       console.log(dbItems)
    }, [dbItems]);
  return (
    <div>BarChartVis</div>
  )
}

export default BarChartVis