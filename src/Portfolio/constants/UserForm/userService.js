/**
 * insert the user into local storage
 * @param {string} data data from the form to be set 
 * @param {*} key an id of the given data
 */
export function insertUser(data, key){
    let tickers = getAllUsers() // gets the content of the form
    data['id'] = key // increment id by one 
    tickers.push(data)
    localStorage.setItem('users', JSON.stringify(tickers))
}


/**
 * generates a unique ticker ID once called
 * @returns ticker ID
 */
export function generateTickerID(){
    if (localStorage.getItem('usersID') == null){
         localStorage.setItem('usersID', '0')
    }
    var id = parseInt(localStorage.getItem('usersID'))
    localStorage.setItem('usersID', (++id).toString())
    return id
}

/**
 * update the content stored in the local storage of the user
 * @param {string} data the data to be updated
 */
export function updateUser(data){
    if (users === []){
        
    }
    let users = getAllUsers()
    let recordIndex = users.findIndex(x => x.id == data.id)
    users[recordIndex] = {...data}
    localStorage.setItem('users', JSON.stringify(users))
}

/**
 * Get the data for all users
 * @returns {object} json object of the user details
 */
export function getAllUsers(){
    if (localStorage.getItem('users') == null){
        localStorage.setItem('users', JSON.stringify([]))
    }
    return JSON.parse(localStorage.getItem('users'))
}