const router  = require("express").Router();
const callback = require("../controllers/callback")

router.route("/").post((req,res)=>{
    if(req.body.sessionExternalId!==undefined && req.body.authResult!==undefined){
        callback.update(req.body,(err,results)=>{
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
})



router.route("/getAll").get((req,res)=>{
    callback.getAll((err,results)=>{
        if(err){
            res.send({
                success:0,
                error:err
            })
        }else{
            res.json({
                success:1,
                users:results
            })
        }
    })
})


router.route("/pending").get((req,res)=>{
    callback.pending((err,results)=>{
        if(err){
            res.send({
                success:0,
                error:err
            })
        }else{
            res.json({
                success:1,
                users:results
            })
        }
    })
})

router.route("/completed").get((req,res)=>{
    callback.getAll((err,results)=>{
        if(err){
            res.send({
                success:0,
                error:err
            })
        }else{
            res.json({
                success:1,
                users:results
            })
        }
    })
})
module.exports = router;