const db= require("../db");
const shortid = require("shortid")
exports.createUser=(user,done)=>{
    let sqlQuery=`
        INSERT INTO USER (name,email, userExternalId) values ($name,$email,$userExternalId);
    `
    let userExternalId= shortid.generate()
    db.get().run(sqlQuery,{$name:user.name, $email:user.email, $userExternalId:userExternalId},(err,results)=>{
        if(err){
            return done(err)
        }else{
            return done(null, results)
        }
    })
}

exports.getAll=(done)=>{
    let sqlQuery=`
        SELECT * FROM USER;
    `
    db.get().all(sqlQuery,(err,rows)=>{
        if(err){
            return done(err)
        }else{
            return done(null, rows)
        }
    });
}