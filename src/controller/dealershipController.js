const { db } = require('../db');
const faker = require("faker")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const dealCollection = db.collection('deal');
const carCollection = db.collection('cars');
const vehicleCollection = db.collection('sold_vehicles');
const dealerShipCollection = db.collection('dealership');

async function generateAndHashPassword() {
    let password = faker.internet.password();
    console.log(password)
    let hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword
};

async function main() {
    let hashPasswords = await generateAndHashPassword();
    return hashPasswords
}
const createDealership  = async function (req, res) {
    let password = await main()
    console.log(password)
    try {
        let getCarIds = await carCollection.find({}).toArray()
        getCarIds = getCarIds.map(item => item.car_id);
        let getsold_vehicalIds = await vehicleCollection.find({}).toArray()
        getsold_vehicalIds = getsold_vehicalIds.map(item => item.vehicle_id);
        let getdealsIds = await dealCollection.find({}).toArray()
        getdealsIds = getdealsIds.map(item => item.deal_id);
        let dealData = {
            dealership_email: faker.internet.email(),
            dealership_id: faker.datatype.uuid(),
            dealership_name: faker.company.companyName(),
            dealership_location: faker.address.streetAddress(),
            password:password,
            dealership_info: {
                city: faker.address.city(),
                state: faker.address.stateAbbr(),
                zipCode: faker.address.zipCode(),
                phoneNumber: faker.phone.phoneNumber(),
                website: faker.internet.url(),
            },
            cars: getCarIds,
            deals: getdealsIds,
            sold_vehicles: getsold_vehicalIds,
        }
        
        let dealerShipData = await dealerShipCollection.insertOne(dealData)
        return res.status(201).send({ data: dealerShipData })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}






const logInDealerShip = async function (req, res) {
    try {
        let data = req.body
        const { dealership_email,password } = data
        let getDealerShip = await dealerShipCollection.find({ dealership_email:dealership_email}).toArray()
        console.log(getDealerShip)
        if (!getDealerShip) {

            return res.status(401).send({
                status: false,
                msg: " email and password does not match, Invalid login Credentials",
            })

        }
        await bcrypt.compare(password, getDealerShip.password, (err, result) => {
            if (err) {
                console.error('Error comparing passwords:', err);
            } else if (result) {
                console.log('Password is correct');
            } else {
                console.log('Password is incorrect');
            }
        });


        //generate Token
        let token = jwt.sign(
            {
                dealearShipId: getDealerShip
            },
            "Nervesparks",
            { expiresIn: "10h" }
        );

        // send response to  user that Author is successfully logged in
        res.status(201).send({
            status: true,
            message: "Admin login successfull",
            data: {dealearShipId : getDealerShip._id, token: token },
        });
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}
module.exports = { createDealership,logInDealerShip }
