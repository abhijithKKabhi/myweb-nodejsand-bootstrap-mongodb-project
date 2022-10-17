var express = require('express');
//const { response } = require('../app');
var router = express.Router();
var dbExport=require('../HELPER/user-helper')
var dbadmin = require('../HELPER/admin-helper')
var loginChecker=((req,res,next)=>{
  if(req.session.user){
    req.session.status
    
    next()

  }else{
    res.redirect('/')
  }

})
let sessionKeep=((req,res,next)=>{
  if(req.session.user){
    next()
  }else{
    res.redirect('/user-home')
  }
})
  



/* GET home page. */
router.get('/', function (req, res, next) {
  
  
  
  res.render('index', { user: true, });
});
router.get('/user-home',loginChecker,sessionKeep, (req, res) => {
  let datas=req.session.user
  res.render('user/user-home', { user: true,datas, style: 'style.css' })
});
router.get('/show-apps',loginChecker,sessionKeep, (req, res) => {
  dbadmin.findAllProducts().then((pro)=>{
    const proApp=pro.filter((value,index,arr)=> value.type==='app')
    console.log(proApp);
   
        let datas=req.session.user
         res.render('user/show-apps', { user: true,datas, style: 'app.css',proApp })
    
      
  })
  
});
router.get('/show-clicks',loginChecker,sessionKeep, (req, res) => {
  dbadmin.findAllProducts().then((data)=>{
    let proClick=data.filter((value,index,arr)=>{
     return value.type==='image'
      
    })
      console.log(proClick);
      let datas=req.session.user
  res.render('user/show-clicks', { user: true,datas, style: 'app.css',proClick })

    
  })
  
});


router.post('/',(req,res)=>{
  dbExport.userLoginData(req.body).then((responsee)=>{
    console.log(req.body);
    req.session.user=responsee.user
    req.session.logedInn=true
    if(responsee.status){
      res.redirect('user/user-home')
  
    }else{
      res.redirect('/')
    }

  })
  
  

});
router.get('/create-account',(req,res)=>{
  res.render('user/create-account')
  
});
router.post('/create-account',(req,res)=>{
  console.log('bodyyy',req.body);
  if(req.body.email==''){
    res.redirect('create-account')
  }else{
    dbExport.getAllData(req.body).then((response)=>{
    
      res.redirect('/')
  
    })
  

  }
  
  //console.log(req.body);
  
})
module.exports = router;
