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
exports.linkingUser=(userId,done)=>{
    let sqlQuery="SELECT userExternalId FROM USER WHERE id = $id"
    db.get().get(sqlQuery,{$id:userId},(err, result)=>{
        if(err){
            return done(err)
        }else{
            // time to process the linking
            const userExternalId = result.userExternalId
            const tenantId = config.tenant; // replace with your tenantId
            const secret = config.token; // replace with your secret
            const hashStr = `${tenantId}${userExternalId}${secret}`;
            const signature = createHashSignature(hashStr);
            axios({
                method: 'post',
                headers: {
                  'Content-Type': 'application/json'
                },
                url: `${PSS_BASE_URL}/gateway/link`,
                data: {
                  tenantId,
                  userExternalId,
                  signature
                }
              })
              .then((response) => {
                return done(null,response.data)
              })
              .catch((error) => {
                return done(error)
              });
        }
    })
}