const db=     require("../db")
const config= require("../config.json")
const crypto = require('crypto')
const axios = require('axios')

const PSS_BASE_URL = 'https://demostand.okaythis.com';

function createHashSignature(hashStr) {
    return crypto
      .createHash('sha256')
      .update(hashStr)
      .digest('base64')
}

exports.authUser=(userId,done)=>{
    let sqlQuery="SELECT userExternalId FROM USER WHERE id = $id"
    db.get().get(sqlQuery,{$id:userId},(err, result)=>{
        if(err){
            return done(err)
        }else if(result!=undefined &&result.userExternalId!==undefined){
            // time to process the linking
            const userExternalId = result.userExternalId
            const tenantId = config.tenant;
            const secret = config.token; 
            const authParams = {
                guiText: 'Do you okay this transaction',
                guiHeader: 'Authorization requested'
              };
            const AUTH_TYPES = {
                OK: 101,
                PIN: 102,
                PIN_TAN: 103,
                BIOMETRIC_OK: 105,
                GET_PAYMENT_CARD: 111,
            }
            const type = AUTH_TYPES.OK
            const hashStr = `${tenantId}${userExternalId}${authParams.guiHeader}${authParams.guiText}${type}${secret}`;
            const signature = createHashSignature(hashStr);
            axios({
                method: 'post',
                headers: {
                  'Content-Type': 'application/json'
                },
                url: `${PSS_BASE_URL}/gateway/auth`,
                data: {
                  tenantId,
                  userExternalId,
                  type,
                  authParams,
                  signature
                }
              })
              .then((response) => {
                // storing the "sessionExternalId"
                let session={
                  userExternalId:userExternalId,
                  sessionExternalId:response.data.sessionExternalId
                }
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
              })
              .catch((error) => {
                return done(error.response.data)
              });
        }else{
            return done({message:"User not found."})
        }
    })
}

exports.check=(session,done)=>{
  const sessionExternalId  = session; 
  const tenantId = config.tenant; 
  const secret = config.token; 
  const hashStr = `${tenantId}${sessionExternalId}${secret}`;
  const signature = createHashSignature(hashStr);

  axios({
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: `${PSS_BASE_URL}/gateway/check`,
    data: {
      tenantId,
      sessionExternalId,
      signature
    }
  })
  .then((response) => {
    return done(null, response.data)
  })
  .catch((error) => {
    return done(error.response.data)
  });

}

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
      SELECT * FROM SESSION ;
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
      SELECT * FROM SESSION where status="0";
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
      SELECT * FROM SESSION where status !="0" ;
  `
  db.get().all(sqlQuery,(err,rows)=>{
      if(err){
          return done(err)
      }else{
          return done(null, rows)
      }
  });
}