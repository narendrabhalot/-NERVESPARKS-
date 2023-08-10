const express = require("express")
const router = express.Router()



const {createAdmin,logInAdmin} = require("../controller/adminController")
const createCars = require("../controller/carController")
const createSoldVehical = require("../controller/sold_vehiclesController")
const {createUser,userLogin,logedOutUser} = require("../controller/userController")
const createDealer = require("../controller/dealController")
const {createDealership,logInDealerShip} = require("../controller/dealershipController")


// admin api
router.post("/admin",createAdmin)
router.post("/adminLogin",logInAdmin)

//car api
router.post("/cars", createCars.createCars)

//sold_vehical

router.post("/soldVehical/:car_id",createSoldVehical.createSoldVehical)

//User api
router.post("/user",createUser)
router.post("/userLogin",userLogin)
router.post("/logOutUser",logedOutUser)

// dealer api
router.post("/deal/:car_id",createDealer.createDealer)


//dealership api
router.post("/dealership",createDealership)
router.post("/dealershipLogIn",logInDealerShip)



module.exports=router


