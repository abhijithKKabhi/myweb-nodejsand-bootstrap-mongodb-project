var db=require('../config/db-config')
var collection=require('../config/collection')
var bcryp=require('bcrypt')

module.exports={
    getAllData:(allData)=>{
        return new Promise(async(resolve,reject)=>{
            allData.password=await bcryp.hash(allData.password,10)
            db.get().collection(collection.USER).insertOne(allData).then((data)=>{
                //console.log(data);
                resolve(data.insetedId)
            })
        })

    },
    userLoginData:(logindata)=>{
        let loginStatus=false
        let response={}
        return new Promise(async(resolve,reject)=>{
           let user=await db.get().collection(collection.USER).findOne({email:logindata.email})
                if(user){
                    bcryp.compare(logindata.password,user.password).then((status)=>{
                        
                        if(status){
                            console.log('log in success');
                            response.user=user
                            response.status=true
                            resolve(response)

                        }else{
                            console.log('login err');
                            resolve({status:false})
                        }

                    })
                }else{
                    console.log('email faild');
                    resolve({status:false})
                }

            
        })
    },
    updatePassword:(pass)=>{
       return new Promise(async(resolve,reject)=>{
          let user=await db.get().collection(collection.USER).findOne({email:pass.email})
          if(user){
           pass.newPassword=await bcryp.hash(pass.newPassword,10)
          await db.get().collection(collection.USER).updateOne({email:pass.email},{
            $set:{
                   password:pass.newPassword
            }
           }).then((resp)=>{
            
                      resolve(resp)
                   })
          }
       })

    }

}

