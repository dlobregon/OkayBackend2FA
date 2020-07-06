const router  = require("express").Router();
const auth = require("../controllers/auth");
const config= require("../config.json");
const crypto = require('crypto')
const user = require("../controllers/user");


function createHashSignature(hashStr) {
    return crypto
      .createHash('sha256')
      .update(hashStr)
      .digest('base64')
}

router.route("/").post((req,res)=>{
    let body = req.body
    if(body.type===101){
        //checking link callback
        let status=body.status.code===0?"SUCCESS":body.status.code===101?"ERROR":"INCOMPLETE"
        const hashStr = `${body.userExternalId}${status}${body.type}${config.token}`;
        let checkHash = createHashSignature(hashStr)
        if(checkHash===body.signature && body.status.code===0){
            console.log("link")
            user.update({status:1,userExternalId:body.userExternalId},(err, results)=>{
                if(err){
                    res.send({
                        success:0,
                        err:err})
                }else{
                    res.json({
                        success:1, 
                        message:results
                    })
                }
            })
        }
    }else if(body.type===102){
        // checking auth callback
        let status=body.status.code===0?"SUCCESS":body.status.code===101?"ERROR":"INCOMPLETE"
        const hashStr = `${body.userExternalId}${body.sessionExternalId}${status}${body.type}${body.authResult?body.authResult.data:""}${body.authResult.dataType}${config.token}`;
        let checkHash = createHashSignature(hashStr)
        if(checkHash===body.signature&& body.status.code===0){
            console.log("auth")
            auth.update(body,(err,results)=>{
                if(err){
                    res.send({
                        success:0,
                        err:err})
                }else{
                    res.json({
                        success:1, 
                        message:results
                    })
                }
            })
        }
    }else if(body.type===103){
        //  checking unlink callback
        let status=body.status.code===0?"SUCCESS":body.status.code===101?"ERROR":"INCOMPLETE"
        const hashStr = `${body.userExternalId}${status}${body.type}${config.token}`;
        let checkHash = createHashSignature(hashStr)
        if(checkHash===body.signature && body.status.code===0){
            console.log("unlink")
            user.update({status:0,userExternalId:body.userExternalId},(err, results)=>{
                if(err){
                    res.send({
                        success:0,
                        err:err})
                }else{
                    res.json({
                        success:1, 
                        message:results
                    })
                }
            })
        }
    }else{
        res.json({
            success:0, 
            message:results
        })
    }
})


module.exports = router;