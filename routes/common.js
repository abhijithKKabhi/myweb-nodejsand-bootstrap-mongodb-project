var express = require('express');
var router = express.Router();
var dbExport = require('../HELPER/user-helper')
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { common: true, 'loginError': req.session.logInError });
  req.session.logInError = false
});
router.post('/', (req, res) => {
  dbExport.userLoginData(req.body).then((responsee) => {
    
    if (responsee.status) {
      req.session.user = responsee.user
      req.session.loggedInn = true
      console.log(req.session.user);

      res.redirect('user/user-home')

    } else {
      req.session.logInError = "loginError"
      res.redirect('/')
    }

  })
});
router.get('/logout', (req, res) => {

  req.session.destroy()
  res.redirect('/')
})


module.exports = router;
