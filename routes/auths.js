const router  = require("express").Router();
const auth    = require("../controllers/auth")

router.route("/").post((req,res)=>{
    auth.authUser(req.body.id,(err,results)=>{
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
})

router.route("/check/:session").get((req,res)=>{
    auth.check(req.params.session,(err,results)=>{
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
})


router.route("/getAll").get((req,res)=>{
    auth.getAll((err,results)=>{
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
    auth.pending((err,results)=>{
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
    auth.getAll((err,results)=>{
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