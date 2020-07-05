const router  = require("express").Router();
const link    = require("../controllers/link")

router.route("/:id").get((req,res)=>{
    link.linkingUser(req.params.id,(err,results)=>{
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