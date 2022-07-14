var express = require('express');
//const { response } = require('../app');
var router = express.Router();
var dbExport=require('../HELPER/user-helper')
var dbadmin = require('../HELPER/admin-helper')

//user login checker
var loginChecker=((req,res,next)=>{
  if(req.session.user){
    req.session.status
    
    next()

  }else{
    res.redirect('/')
  }
})

//user logout session check
let sessionKeep=((req,res,next)=>{
  if(req.session.user){
    next()
  }else{
    res.redirect('/user-home')
  }
})
  



/* GET login page. */
router.get('/', function (req, res, next) {
  
  
  
  res.render('index', { user: true, });
});
//user home page show
router.get('/user-home',loginChecker,sessionKeep, (req, res) => {
  let datas=req.session.user
  res.render('user/user-home', { user: true,datas, style: 'style.css' })
});
//app page show
router.get('/show-apps',loginChecker,sessionKeep, (req, res) => {
  dbadmin.findAllProducts().then((pro)=>{
    const proApp=pro.filter((value,index,arr)=> value.type==='app')
    
   
        let datas=req.session.user
         res.render('user/show-apps', { user: true,datas, style: 'app.css',proApp })
    
      
  })
  
});
//click page showw
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

//user loginpage data get and posting
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
// create user account
router.get('/create-account',(req,res)=>{
  res.render('user/create-account')
  
});
router.post('/create-account',(req,res)=>{
  
  if(req.body.email==''){
    res.redirect('create-account')
  }else{
    dbExport.getAllData(req.body).then((response)=>{
    
      res.redirect('/')
  
    })
  } 
})



module.exports = router;
