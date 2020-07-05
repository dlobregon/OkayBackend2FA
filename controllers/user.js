const db= require("../db")

exports.createUser=(user,done)=>{
    let sqlQuery=`
        INSERT INTO USER (name,email) values ($name,$email);
    `
    db.get().run(sqlQuery,{$name:user.name, $email:user.email},(err,results)=>{
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