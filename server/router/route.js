import {Router} from 'express'
const router = Router()

//import all controllers
import * as controller from '../controllers/appController.js'
import { registerMail } from '../controllers/mailer.js'
import Auth, {localVariables} from '../middleware/auth.js'

/**POST Methods */
router.route("/register").post(controller.register)  //register user
router.route("/registerMail").post(registerMail)  //send the mail
router.route("/authenticate").post(controller.verifyUser, (req, res)=> res.end())  //authenticate user
router.route("/login").post(controller.verifyUser, controller.login)  //log in app

/**GET Methods */
router.route("/user/:username").get(controller.getUser)  //user with username
router.route("/generateOTP").get(controller.verifyUser,localVariables,controller.generateOTP)  //generate random OTP
router.route("/verifyOTP").get(controller.verifyUser, controller.verifyOTP)  //verify genarated OTP
router.route("/createResetSession").get(controller.createResetSession)  //reset all the variables

/**PUT Mehods */
router.route('/updateuser').put(Auth, controller.updateUser) // is use to update user profile
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword) //use to reset password
 
export default router