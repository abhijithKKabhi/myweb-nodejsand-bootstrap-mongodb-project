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
    }
}