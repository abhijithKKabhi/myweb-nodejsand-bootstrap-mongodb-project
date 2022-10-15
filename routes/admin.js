var express = require('express');
//const { route } = require('./common');
var router = express.Router();
var dbExport = require('../HELPER/admin-helper')



/* GET users listing. */
router.get('/', function (req, res, next) {
  let css = {
    style: ('stylesheets/style')
  }
  res.render('admin/admin-login', { admin: true });
});
router.get('/edit-items', (req, res) => {
  res.render('admin/edit-items', { admin: true, style: 'all.css' })
})
router.get('/add-items', (req, res) => {
  res.render('admin/add-items', { admin: true, style: 'all.css' })
})

router.post('/add-items', (req, res) => {
  //console.log('fmffr', req.body);
  dbExport.addProducts(req.body).then((id) => {

    //console.log('fffff', id);
    let image = req.files.Image
    //console.log(req.files.Image);
    image.mv('./public/product-images/' + id + '.jpg', (err, done) => {
      if (!err) {

        res.render('admin/add-items', { admin: true, style: 'all.css' })
      } else {
        console.log(err);
      }
    })
  })
})

router.get('/view-items', (req, res) => {
  dbExport.findAllProducts().then((products) => {
    //console.log(products);
    res.render('admin/view-items', { products, admin: true, style: 'all.css' })
  })

})



var express = require('express');
//const { route } = require('./common');
var router = express.Router();
var dbExport = require('../HELPER/admin-helper')



/* GET users listing. */
router.get('/', function (req, res, next) {
  let css = {
    style: ('stylesheets/style')
  }
  res.render('admin/admin-login', { admin: true });
});
router.get('/edit-items', (req, res) => {
  res.render('admin/edit-items', { admin: true, style: 'all.css' })
})
router.get('/add-items', (req, res) => {
  res.render('admin/add-items', { admin: true, style: 'all.css' })
})

router.post('/add-items', (req, res) => {
  //console.log('fmffr', req.body);
  dbExport.addProducts(req.body).then((id) => {

    //console.log('fffff', id);
    let image = req.files.Image
    //console.log(req.files.Image);
    image.mv('./public/product-images/' + id + '.jpg', (err, done) => {
      if (!err) {

        res.render('admin/add-items', { admin: true, style: 'all.css' })
      } else {
        console.log(err);
      }
    })
  })
})

router.get('/view-items', (req, res) => {
  dbExport.findAllProducts().then((products)=>{
    //console.log(products);
    res.render('admin/view-items', { products,admin: true, style: 'all.css' })
  }) 
})
router.get('/edit-items/:id',async(req,res)=>{
  await dbExport.findProduct(req.params.id).then((data)=>{
   // console.log(data);
    res.render('admin/edit-items',{admin:true,data,style: 'all.css'})
  })
})

router.post('/edit-items/:id',(req,res)=>{
  dbExport.updateProducts(req.params.id,req.body).then((response)=>{
    res.redirect('/admin/view-items')
    if(req.files.Image){
      let img=req.files.Image
      img.mv('./public/product-images/'+req.params.id+'.jpg')
    }
  })
})

router.get('/delete-items/:id',(req,res)=>{
  console.log(req.params.id);
  dbExport.deletProduct(req.params.id).then((response)=>{
    res.redirect('/admin/view-items')

  })
  
})




module.exports = router;
