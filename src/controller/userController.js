const { db } = require('../db');
const faker = require("faker")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const expressJwtBlacklist = require("express-jwt-blacklist")
const vehicleCollection = db.collection('sold_vehicles');
const userCollection = db.collection('user');
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

////////////////////////  create user //////////////
const createUser = async function (req, res) {
    try {

        let password = await main()
        console.log(password)
        let getVehicalIds = await vehicleCollection.find({}).toArray()
        getVehicalIds = getVehicalIds.map(item => item.vehicle_id);
        console.log("getVehicalIds is   :-", getVehicalIds)
        let userData = {
            user_email: faker.internet.email(),
            user_id: faker.datatype.uuid(),
            user_location: faker.address.city(),
            user_info: {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                username: faker.internet.userName(),
                Number: faker.phone.phoneNumber(),
                street: faker.address.streetName(),
                city: faker.address.city(),
                country: faker.address.country()
            },
            password: password,
            vehicle_info: getVehicalIds,
        }
        let cars = await userCollection.insertOne(userData)
        res.status(201).json({ cars: cars })
    } catch (err) {
        return res.status(400).send({ error: err.message })
    }

}

//////////////////     user login .///////////

const userLogin = async function (req, res) {
    try {
        let data = req.body
        const { user_email, password } = data
        let getUser = await userCollection.find({ user_email: user_email }).toArray()
        console.log(getUser)
        if (!getUser) {

            return res.status(401).send({
                status: false,
                msg: "Email or password does not match, Invalid login Credentials",
            })

        }
        await bcrypt.compare(password, getUser.password, (err, result) => {
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
                userId: getUser,

            },
            "Nervesparks",
            { expiresIn: "10h" }
        );

        // send response to  user that Author is successfully logged in
        res.status(201).send({
            status: true,
            message: "User login successfull",
            data: { userId: getUser._id, token: token },
        });
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}



const logedOutUser = function (req, res) {

    expressJwtBlacklist.revoke(req.user);
    res.json({ message: 'Logged out successfully' });
}
module.exports = { createUser, userLogin, logedOutUser }




