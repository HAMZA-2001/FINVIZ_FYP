export function insertUser(data, key){
    let tickers = getAllUsers() // gets the content of the form
    data['id'] = key // increment id by one 
    console.log(tickers)
    console.log(data)
    console.log(data)
    tickers.push(data)
    localStorage.setItem('users', JSON.stringify(tickers))
}



export function generateTickerID(){
    if (localStorage.getItem('usersID') == null){
         localStorage.setItem('usersID', '0')
    }
    var id = parseInt(localStorage.getItem('usersID'))
    localStorage.setItem('usersID', (++id).toString())
    return id
}


export function updateUser(data){
    console.log("............................")
    if (users === []){
        
    }
    let users = getAllUsers()
    console.log(data)
    console.log(users)
    let recordIndex = users.findIndex(x => x.id == data.id)
    console.log(recordIndex)
    users[recordIndex] = {...data}
    localStorage.setItem('users', JSON.stringify(users))
}

export function getAllUsers(){
    console.log("here")
    if (localStorage.getItem('users') == null){
        console.log("here")
        localStorage.setItem('users', JSON.stringify([]))
    }
    return JSON.parse(localStorage.getItem('users'))
}