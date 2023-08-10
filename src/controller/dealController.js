const { db } = require('../db');
const faker = require("faker")
const dealCollection = db.collection('deal');
const carCollection = db.collection('cars');
const createDealer = async function (req,res) {
try{
    let data = req.params.car_id
    if (!data) {
        return  res.status(400).send({ status: "false", message: "please provide car_id in params" })
    }
    let getCarbyid = await carCollection.findOne({car_id:data})
    if(!getCarbyid){
        return  res.status(400).json({ msg :"car_id is invalid"})
    }
    let dealData = {
            deal_id: faker.datatype.uuid(),
            car_id:data, 
            deal_info :{
                 dealerName : faker.company.companyName(),
                 dealAmount :faker.finance.amount(),
                 dealDate :faker.date.past()
            }, 
    }
    let dealerData = await dealCollection.insertOne(dealData)
     return res.status(201).send({data:dealerData})
}catch(err){
   return  res.status(400).json({error:err.message})
}
}
module.exports={createDealer}



