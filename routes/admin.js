
var express = require('express');
//const { route } = require('./common');
var router = express.Router();
var dbExport = require('../HELPER/admin-helper')

//admin login check
let doAdminLoggin=(req,res,next)=>{
  if(req.session.admin){
    req.session.doAdminLoggin=true
    next()
  }else{
    res.redirect('/admin/')
  }
}

/* GET admin login page and default username and password */
router.get('/', function (req, res, next) {
  let css = {
    style: ('stylesheets/style')
  }
  createAccount = {
    userName: 'abc@gmail.com',
    password: '123'
  }
  dbExport.adminAccount(createAccount)
  var logerr=req.session.logout
  res.render('admin/admin-login', { admin: true, logerr});
  req.session.logout=false
});

//edit session page
router.get('/edit-items',doAdminLoggin, (req, res) => {
  let logIn=req.session.admin
  res.render('admin/edit-items', { admin: true, style: 'all.css' ,logIn})
})

//product add page
router.get('/add-items',doAdminLoggin, (req, res) => {
  let logIn=req.session.admin
  res.render('admin/add-items', { admin: true, style: 'all.css',logIn})
})

//product post to db
router.post('/add-items',doAdminLoggin, (req, res) => {
  dbExport.addProducts(req.body).then((id) => {
    let image = req.files.Image
      image.mv('./public/product-images/' + id + '.jpg', (err, done) => {
       if (!err) {
         res.render('admin/add-items', { admin: true, style: 'all.css' ,logIn:true})
       } else {
        console.log(err);
      }
    })
  })
})

//admin home page
router.get('/view-items',doAdminLoggin, (req, res) => {
  dbExport.findAllProducts().then((products) => {
    let logIn=req.session.admin
      res.render('admin/view-items', { products, admin: true, style: 'all.css',logIn })
  })
})

//edit items page use with db id
router.get('/edit-items/:id',doAdminLoggin, async (req, res) => {
  await dbExport.findProduct(req.params.id).then((data) => {
    let logIn=req.session.admin
    res.render('admin/edit-items', { admin: true, data, style: 'all.css',logIn})
  })
})

//update redit items
router.post('/edit-items/:id',doAdminLoggin, (req, res) => {
  dbExport.updateProducts(req.params.id, req.body).then((response) => {
    res.redirect('/admin/view-items')
     if (req.files.Image) {
         let img = req.files.Image
         img.mv('./public/product-images/' + req.params.id + '.jpg')
     } else {
          res.redirect('admin/view-items')
    }
  })
})

//delet added  product items
router.get('/delete-items/:id',doAdminLoggin, (req, res) => {
     console.log(req.params.id);
     dbExport.deletProduct(req.params.id).then((response) => {
     res.redirect('/admin/view-items')
  })
})

//admin login data posting
router.post('/admin-login', (req, res) => {
  dbExport.adminLoginData(req.body).then((confirmation) => {
    
    
    
    if (confirmation.status) {
      req.session.admin = confirmation.admin
      req.session.loggedin=true
      res.redirect('/admin/view-items')
    } else {
      req.session.logout="admin login error"
      res.redirect('/admin/')
    }
  })
})

//delete session and delet db stored username and password
router.get('/admin-logout',(req,res)=>{
  req.session.destroy()
  dbExport.deletAdminLogginSession(req.session)
  res.redirect('/admin/')
})


module.exports = router;
