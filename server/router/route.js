import {Router} from 'express'
const router = Router()

//import all controllers
import * as controller from '../controllers/appController'

/**POST Methods */
router.route("/register").post(controller.register)  //register user
router.route("/registerMail").post()  //send the mail
router.route("/authenticate").post((req, res)=> res.end())  //authenticate user
router.route("/login").post(controller.login)  //log in app

/**GET Methods */
router.route("/user/:username").get(controller.getUser)  //user with username
router.route("/generateOTP").get(controller.generateOTP)  //generate random OTP
router.route("/verifyOTP").get(controller.verifyOTP)  //verify genarated OTP
router.route("/createResetSession").get(controller.createResetSession)  //reset all the variables

/**PUT Mehods */
router.route('/updateuser').put(controller.updateUser) // is use to update user profile
router.route('/resetPassword').put(controller.resetPassword) //use to reset password

export default router