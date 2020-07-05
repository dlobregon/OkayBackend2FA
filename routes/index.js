const router    = require("express").Router();
router.route("/").get(
  function (req, res){
    res.json({
      "Running":"ok"
    });
  }
);
module.exports = router;
