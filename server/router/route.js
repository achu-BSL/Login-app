const router  = require("express").Router()

//import all controllers
const {
    register, 
    login, 
    getUser, 
    updateUser, 
    generateOTP, 
    verifyOTP, 
    createResetSession, 
    resetPassword
} = require('../controllers/appController')

/**POST Methods */
router.route("/register").post(register)  //register user
router.route("/registerMail").post()  //send the mail
router.route("/authenticate").post((req, res)=> res.end())  //authenticate user
router.route("/login").post()  //log in app

/**GET Methods */
router.route("/user/:username").get()  //user with username
router.route("/generateOTP").get()  //generate random OTP
router.route("/verifyOTP").get()  //verify genarated OTP
router.route("/createResetSession").get()  //reset all the variables

/**PUT Mehods */
router.route('/updateuser').put() // is use to update user profile
router.route('/resetPassword').put() //use to reset password



module.exports = router