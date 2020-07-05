const sqlite3   =   require("sqlite3");

let db= null
let started=false
exports.connect = (done)=>{
    db = new sqlite3.Database('./user.db',(err)=>{
        if(err){
            console.log(err)
        }else{
            started=true
            console.log("Connected to sqlite database")
        }
    });
    /**
     * creating the user table
     */
    let sqlQuery=`
        CREATE TABLE IF NOT EXISTS USER (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            userExternalId TEXT)
    `
    db.run(sqlQuery)
    /**
     * defining the session table
     */
    sqlQuery=`
        CREATE TABLE IF NOT EXISTS SESSION (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userExternalId TEXT, 
            sessionExternalId TEXT,
            status TEXT) 
    `
    db.run(sqlQuery)
}

exports.get=function(){
    return db;
}

exports.end=function(){
    console.log("closing the database connection")
    if(started){
        db.end()
        started=false
    }
}