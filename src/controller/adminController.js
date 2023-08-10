const { db } = require('../db'); 
const faker = require("faker")
const bcrypt= require("bcrypt")
const jwt = require("jsonwebtoken")
const adminCollection = db.collection('admin'); 

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
let createAdmin = async function (req, res) {
     let password= await main()
     console.log(password)
    let data = {
          admin_id :faker.random.uuid(),
          password :password
        }
    
   let admins = await adminCollection.insertOne(data)

   return res.status(200).send({data:admins})
}




const logInAdmin = async function (req, res) {
    try {
        let data = req.body
        const { admin_id,password } = data
        let getAdmin = await adminCollection.find({ admin_id:admin_id}).toArray()
        console.log(getAdmin)
        if (!getAdmin) {

            return res.status(401).send({
                status: false,
                msg: " admin_id does not match, Invalid login Credentials",
            })

        }
        await bcrypt.compare(password, getAdmin.password, (err, result) => {
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
                adminId: getAdmin
            },
            "Nervesparks",
            { expiresIn: "10h" }
        );

        // send response to  user that Author is successfully logged in
        res.status(201).send({
            status: true,
            message: "Admin login successfull",
            data: { adminId: getAdmin._id, token: token },
        });
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}


module.exports = { createAdmin,logInAdmin }