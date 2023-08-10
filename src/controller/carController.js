const { db } = require('../db');
const faker = require("faker")
const carCollection = db.collection('cars');

const createCars = async function (req, res) {
try{
    let carData = {
        car_id: faker.datatype.uuid(),
        type: faker.vehicle.type(),
        name: faker.vehicle.vehicle(),
        model: faker.vehicle.model(),
        car_info: {
            fuel: faker.vehicle.fuel(),
            vin: faker.vehicle.vin(),
            color: faker.vehicle.color(),
            make: faker.vehicle.manufacturer(),
        }
    }
    let cars = await carCollection.insertOne(carData)
    res.status(201).json({cars:cars})
}catch(err){
    res.status(400).json({error:err})
}

}

module.exports={createCars}




