export function insertUser(data){
    let tickers = getAllUsers() // gets the content of the form
    data['id'] = generateTickerID() // increment id by one 
    console.log(tickers)
    console.log(data)
    console.log(data)
    tickers.push(data)
    localStorage.setItem('users', JSON.stringify(tickers))
}

export function getAllUsers(){
    console.log("here")
    if (localStorage.getItem('users') == null){
        console.log("here")
        localStorage.setItem('users', JSON.stringify([]))
    }
    return JSON.parse(localStorage.getItem('users'))
}

export function generateTickerID(){
    if (localStorage.getItem('usersID') == null){
         localStorage.setItem('usersID', '0')
    }
    var id = parseInt(localStorage.getItem('usersID'))
    localStorage.setItem('usersID', (++id).toString())
    return id
}