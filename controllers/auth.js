const db=     require("../db")
const config= require("../config.json")
const crypto = require('crypto')
const axios = require('axios')
const callback = require("./callback")

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
                callback.register(session,(err,result)=>{
                  if(err){
                    return done(err)
                  }else{
                    return done(null,{result:result,sessionExternalId:response.data.sessionExternalId})
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