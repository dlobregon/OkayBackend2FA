const router  = require("express").Router();
const auth    = require("../controllers/auth")

router.route("/:id").get((req,res)=>{
    auth.authUser(req.params.id,(err,results)=>{
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

module.exports = router;