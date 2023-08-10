const { db } = require('../db');
const faker = require("faker")
const vehicleCollection = db.collection('sold_vehicles');
const carCollection =  db.collection('cars');

const createSoldVehical = async function (req, res) {
    try {
        let data = req.params.car_id
        if (!data) {
            res.ststus(400).send({ status: "false", message: "please provide car_id in params" })
        }
        let getCarbyid = await carCollection.findOne({car_id:data})
        if(!getCarbyid){
            return  res.status(400).json({ msg :"car_id is invalid"})
        }

       

        let vehicleData = {
            vehicle_id: faker.datatype.uuid(),
            carId: data,
            vehicle_info: getCarbyid,
    }
        let vehicle = await vehicleCollection.insertOne(vehicleData)
        res.status(201).send({ data:vehicle })
    } catch (err) {
       return  res.status(400).json({ error: err.message })
    }

}

module.exports = { createSoldVehical }




