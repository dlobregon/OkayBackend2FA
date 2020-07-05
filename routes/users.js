const router  = require("express").Router(),
      user    = require("../controllers/user")

router.route("/").get((req,res)=>{
    user.getAll((err,results)=>{
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


router.route("/create").post((req,res)=>{
  if(req.body.user!==undefined){
      user.createUser(req.body.user,(err,result)=>{
          if(err){
              res.send({
                  success:0,
                  error:err
              })
          }else{
              res.json({
                  success:1,
                  message:result
              })
          }
      })
  }
});


module.exports= router;