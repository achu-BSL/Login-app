import UserModel from "../models/User.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import ENV from '../config.js'
import otpGenerator from 'otp-generator'
import mongoose, { ObjectId } from "mongoose"

/**Midleware for varify user */
export async function verifyUser(req, res, next){
  try{
    const {username} = req.method == 'GET' ? req.query : req.body
    console.log(req.body)
    //check the user existance
    console.log("%c prev", "color: blue; font-size: 24px;")
    const exist = await UserModel.findOne({username})
    if(!exist) return res.status(404).send({err: 'User Not Found..:('})
    next()
  }catch(err){
    return res.status(401).send({err: 'Authentication error'})
  }
}


/**POST : http://localhost:8080/api/register
  @param : {
    "username": 'admin',
    'email' : 'admin@gmail.com',
    'password' : 'admin123'
  }
*/
// export async function register(req, res){
//   try{
//     const {username, email, password, profile} = req.body
//     //check the existing user
//     const existUsername = new Promise((resolve, reject)=>{
//       UserModel.findOne({username}, function(err, user){
//         if(err) reject(new Error(err))
//         if(user) reject({error: "Username already taken.."})

//         resolve()
//       })
//     })


//     // check the existing email
//     const existEmail = new Promise((resolve, reject)=>{
//       UserModel.findOne({email}, function(err, user){
//         if(err) reject(new Error(err));
//         if(user) reject({error: "Email already used..!"});

//         resolve();
//       });
//     });


//     Promise.all([existUsername, existEmail])
//        .then(()=>{
//          if(password){
//           bcrypt.hash(password, 10)
//           console.log(5)
//             .then(hashedPassword => {

//               const user = new UserModel({
//                 username,
//                 password: hashedPassword,
//                 email,
//                 profile: profile || ''
//               })

//               //return save result as a responce
//               user.save()
//                  .then(result=> res.status(201).send({msg: "User Register successfully"}))
//                  .catch(err=> res.status(500).send({err}))

//             }).catch(err=>{
//               res.status(500).send({error: "Unable to Hash Password"})
//             })
//          }
//        }).catch(err =>{
//         res.status(500).send({err})
//        })

//   }catch(err){
//     res.status(500).send(err)
//   }
// }

export async function register(req, res){

  try{
    const {username, email, password, profile} = req.body

    const existEmail = await UserModel.findOne({email})
    if(existEmail){
      return res.status(400).send({error: 'User Exist...'})
    }

    const existUsername = await UserModel.findOne({username})
    if(existUsername){
      return res.status(400).send({error: 'User Exist...'})
    }
    
    const hashedPassword = await bcrypt.hash(password, 10)
  
    const user = new UserModel({
      username,
      email,
      password: hashedPassword,
      profile: profile || ''
    })

    await user.save()
    res.status(201).send({msg: "user registered successfully..."})
    } catch(err){
      return res.status(500).send({err})
    }
}


/**POST : http://localhost:8080/api/login
  @param : {
    "username": 'admin',
    'password' : 'admin123'
  }
*/
// export  async function login(req, res){
//    const {username, password} = req.body
   
//    try{
//     UserModel.findOne({username})
//        .then( user=>{
//         console.log(password)
//         bcrypt.compare(user.password, password)
//           .then(passwordCheck => {

//             if(!passwordCheck) res.status(400).send("Don't have password")

//             //create jwt token
//             const token = Jwt.sign({
//               userId: user._id,
//               userName: user.username
//             }, ENV.JWT_SECRET, {expiresIn: '24h'})

//             return res.status(200).send({
//               msg: "Login Succesfull..",
//               username: user.username,
//               token
//             })

//           })
//           .catch(err => res.status(400).send("Incorrect Password"))
//        })
//        .catch(err => res.status(404).send("User Not Found"))
//    }catch(err){
//     return res.status(500).send(err)
//    }
// }
export async function login(req, res){
  const {username, password} = req.body
  console.log(username, password)
  try {
    const user = await UserModel.findOne({username})
  
    await bcrypt.compare(password, user.password)
      .then(passwordCheck=>{
        if(!passwordCheck) return res.status(400).send("Password Incorrect...:(")
    
    // console.log("before return 200")
    // const passwordCheck = await bcrypt.compare(password, user.password)
    // if(!passwordCheck) return res.status(400).send("Password Incorrect...")

    const token = jwt.sign({
      userId: user._id,
      userName: user.username
    }, ENV.JWT_SECRET, {expiresIn: '24h'})
  
    console.log("before return 200")
    return res.status(200).send({
      token,
      msg: "Login successfully."
    })
      })
      .catch(err => res.status(400).send("OOPS something wrong..."))
  } catch (err) {
    return res.status(500).send(err.message)
  }

}

/**GET : http://localhost:8080/api/user/admin*/
// export  async function getUser(req, res){
//     const {username} = req.params
//     console.log(username)
//     try {

//       if(!username) return res.status(501).send({err: 'Invalid username'})

//       await UserModel.findOne({username}, function(err, user){
//         if(err) return res.status(500).send({err})
//         if(!user) return res.status(501).send({error: "Couldn't Find the User"})

//         //Remove password from user
//         // mongoos return unnecassory data with object so convert it into json
//         const {password, ...rest} = Object.assign({}, user.toJSON())
//         return res.status(200).send({rest})
//       })

//     } catch (err) {
//       return res.status(404).send({err: "Cannot find user data!"})
//     }
// }
export async function getUser(req, res){
  const {username} = req.params

  try {

    if(!username) return res.status(400).send("Invalid username...:(")

    const user = await UserModel.findOne({username})
    // if(!user) return res.status(400).send("Cannot find the user..")


    //remove password from user
    //mongoose return unecessary data with object so convert it into json
    const {password, ...rest} = Object.assign({}, user.toJSON())//this is shallow copy
    res.status(200).send(rest)

   .catch(err => {
    return res.status(500).send(err.message)
   })


  } catch (err) {
    res.status(500).send("Couldn't find the user data!")
  }
}


/**PUT : http://localhost:8080/api/updateuser
  @param : {
    'id' : <user id>
  },
  body: {
    firstName: '',
    lastName: '',
    address: ''
  }
*/
// export  async function updateUser(req, res){
//     try {

//       const id = req.query.id

//       if(id){

//         const body = req.body

//         //update the data
//         UserModel.updateOne({_id: id}, body, function(err, data){
//           if(err) throw err

//           res.status(200).send({msg: "Record Updated...!"})
//         })

//       }else{
//         return res.status(401).send({err: "User not Found...!"})
//       }

//     } catch (err) {
//       return res.status(401).send({err})
//     }
// }

// GET: http://localhost:8080/api/generateOTP
export async function updateUser(req, res){

  // const {id} = req.query
  const {userId} = req.user

  if(!userId) return res.status(400).send('Ivalid userid')

  const body = req.body

  await UserModel.findByIdAndUpdate(
    userId,
    body,
    {new: true}
  )
  .then(()=>{
    res.status(200).send("User updateded success")
  })
  .catch(err =>{
    res.status(500).send("Couldn't fetch user data..")
  })
}


export  async function generateOTP(req, res){
    req.app.locals.OTP = await otpGenerator.generate(6, {
      lowerCaseAlphabets: false, 
      upperCaseAlphabets: false, 
      specialChars: false   
    })
    res.status(201).send({code: req.app.locals.OTP})
}

// GET: http://localhost:8080/api/verifyOTP
export  async function verifyOTP(req, res){
    const {code} = req.query
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
      req.app.locals.OTP = null //reset the OTP value
      req.app.locals.resetSession = true //start the session for reset password
      return res.status(201).send({msg: 'Verify Successfully.'})
    }
    return res.status(400).send({error: 'Invalid OTP'})
}


//successfully redirect user when OTP is valid
// GET : http://localhost:8080/api/createResetSession
export  async function createResetSession(req, res){
    if(req.app.locals.resetSession){
      req.app.locals.resetSession = false
      return res.status(201).send({msg: 'access granted!'})
    }
    return res.status(440).send({error: 'Session Expired'})
}

//update password when we have validate session
// PUT : http://localhost:8080/api/resetPassword

// export  async function resetPassword(req, res){ 
//     try {
//       console.log(req.app.locals.resetSession)
//       if(!req.app.locals.resetSession) return res.status(440).send({error: 'Session Expired'})
//       const {username, password} = req.body

//       try {

//         UserModel.findOne({username})
//           .then(user=>{
//             bcrypt.hash(password, 10)
//               .then(hashedPassword => {
//                 UserModel.updateOne({
//                   username: user.username
//                 }, {
//                   password: hashedPassword
//                 }, (err, data)=>{
//                   if(err)throw err
//                   req.app.locals.resetSession = false
//                   return res.status(201).send({msg: 'Record Updated...'})
//                 })
//               })
//               .catch(err => {
//                 return res.status(500).send({
//                   error: "Unable to hash password!"
//                 })
//               })
//           })
//           .catch(err => {
//             res.status(404).send({error: 'User Not Found'})
//           })

//       } catch (err) {
//         return res.status(500).send({err})
//       }

//     } catch (err) {
//       return res.status(401).send({err})
//     }
// }

export async function resetPassword(req, res){
  
  try{
    console.log(req.app.locals.resetSession)
    if(!req.app.locals.resetSession) return res.status(440).send({error: "Session Expired"})

    const {username, password} = req.body

    const hashedPassword = await bcrypt.hash(password, 10)
    const responce = await UserModel.updateOne({
      username
    },
    {
      password: hashedPassword
    })
    if(!responce) return res.status(500).send("Internal error")
    req.app.locals.resetSession = false
    res.status(200).send('Record Updated..')
  }catch (err) {
    return res.status(401).send(err.message)
  }
}