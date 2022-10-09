var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  let css={
    style:('stylesheets/style')
  }
  res.render('admin/admin-login', {admin:true,style});
});

module.exports = router;
