var db=require('../config/db-config')
var collection=require('../config/collection')
var bcryp=require('bcrypt')
const { response } = require('../../expr/app')
//const { response } = require('../app')
var objectId=require('mongodb').ObjectId
module.exports={
    addProducts:(productData)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ADMIN).insertOne(productData).then((data)=>{
                resolve(data.insertedId)
            })
        })

    },
    findProduct:(pid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ADMIN).findOne({_id:objectId(pid)}).then((data)=>{
                resolve(data)
            })
        })
    },
    updateProducts:(ids,updatedData)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ADMIN).updateOne({_id:objectId(ids)},{
                $set:{
                    itemName:updatedData.itemName,
                    description:updatedData.description,
                    type:updatedData.type
                }
            }).then((response)=>{
                resolve(response)
            })
        })
    },
    findAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let alldatas=await db.get().collection(collection.ADMIN).find().toArray()
                resolve(alldatas)
            
        })
    },
    deletProduct:(deletid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ADMIN).deleteOne({_id:objectId(deletid)}).then((response)=>{
                resolve(response)
            })
        })
    },
    adminAccount:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            adminData.password=await bcryp.hash(adminData.password,10)
            await db.get().collection(collection.ADMINLOGIN).insertOne(adminData).then(()=>{
                
                resolve()
            })

        })
    },
    adminLoginData:(nameAndPassword)=>{
        return new Promise(async(resolve,reject)=>{
          let  responsee={}
           let admin=await db.get().collection(collection.ADMINLOGIN).findOne({userName:nameAndPassword.userName})
                if(admin){
                    bcryp.compare(nameAndPassword.password,admin.password).then((status)=>{
                        if(status){
                            responsee.admin=admin
                            responsee.status=true
                            //console.log('login admin',responsee);
                            resolve(responsee)
                            
                        }else{
                            resolve(responsee.status=false)
                            console.log('pass not crcr');
                        }

                    })
                    
                }else{
                    resolve({status:false})
                    
                    console.log('username incorrect ');
                }
            
        })
    },
    deletAdminLogginSession:(data)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ADMINLOGIN).drop(data).then((responsee)=>{
                resolve()
            })
        })
    }
}