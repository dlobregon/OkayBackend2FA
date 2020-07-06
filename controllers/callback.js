const db=     require("../db")



exports.register=(session,done)=>{
    let sqlQuery=`
        INSERT INTO SESSION (userExternalId,sessionExternalId,status) values ($userExternalId,$sessionExternalId,$status);
    `
    db.get().run(sqlQuery,{$userExternalId:session.userExternalId, $sessionExternalId:session.sessionExternalId,$status:0},(err,results)=>{
        if(err){
            return done(err)
        }else{
            return done(null, results)
        }
    })
}
exports.update=(session,done)=>{
    let sqlQuery=`
        UPDATE SESSION set status = $status where sessionExternalId= $sessionExternalId;
    `
    db.get().run(sqlQuery,{$status:session.authResult.dataType,$sessionExternalId:session.sessionExternalId},(err,results)=>{
        if(err){
            return done(err)
        }else{
            return done(null, results)
        }
    })
}

exports.getAll=(done)=>{
    let sqlQuery=`
        SELECT * FROM SESSION where userExternalId is not null;
    `
    db.get().all(sqlQuery,(err,rows)=>{
        if(err){
            return done(err)
        }else{
            return done(null, rows)
        }
    });
}

exports.pending=(done)=>{
    let sqlQuery=`
        SELECT * FROM SESSION where userExternalId is not null and status="0";
    `
    db.get().all(sqlQuery,(err,rows)=>{
        if(err){
            return done(err)
        }else{
            return done(null, rows)
        }
    });
}

exports.completed=(done)=>{
    let sqlQuery=`
        SELECT * FROM SESSION where userExternalId is not null  and status !="0" ;
    `
    db.get().all(sqlQuery,(err,rows)=>{
        if(err){
            return done(err)
        }else{
            return done(null, rows)
        }
    });
}