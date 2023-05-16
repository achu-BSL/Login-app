import UserModel from "../models/User.model"
import bcrypt from 'bcrypt'


/**POST : http://localhost:8080/api/register
  @param : {
    "username": 'admin',
    'email' : 'admin@gmail.com',
    'password' : 'admin123'
  }
*/
export async function register(req, res){
  try{
    const {username, email, password, profile} = req.body
    //check the existing user
    const existUsername = new Promise((resolve, reject)=>{
      UserModel.findOne({username}, function(err, user){
        if(err) reject(new Error(err))
        if(user) reject({error: "Username already taken.."})

        resolve()
      })
    })

    //check the existing email
    const existEmail = new Promise((resolve, reject)=>{
      UserModel.findOne({email}, function(err, user){
        if(err) reject(new Error(err))
        if(user) reject({error: "Email already used..!"})

        resolve()
      })
    })

    Promise.all([existUsername, existEmail])
       .then(()=>{
         if(password){
          bcrypt.hash(password, 10)
            .then(hashedPassword => {

              const user = new UserModel({
                username,
                password: hashedPassword,
                email,
                profile: profile || ''
              })

              //return save result as a responce
              user.save()
                 .then(result=> res.status(201).send({msg: "User Register successfully"}))
                 .catch(err=> res.status(500).send({err}))

            }).catch(err=>{
              res.status(500).send({error: "Unable to Hash Password"})
            })
         }
       }).catch(err =>{
        res.status(500).send({err})
       })

  }catch(err){
    res.status(500).send(err)
  }
}


/**POST : http://localhost:8080/api/login
  @param : {
    "username": 'admin',
    'password' : 'admin123'
  }
*/
export  async function login(req, res){
    res.json('login')
}

/**GET : http://localhost:8080/api/user/admin*/
export  async function getUser(req, res){
    res.json('getUser')
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
export  async function updateUser(req, res){
    res.json('authenticate')
}

// GET: http://localhost:8080/api/generateOTP
export  async function generateOTP(req, res){
    res.json('generateOTP')
}

// GET: http://localhost:8080/api/verifyOTP
export  async function verifyOTP(req, res){
    res.json('verifyOTP')
}


//successfully redirect user when OTP is valid
// GET : http://localhost:8080/api/createResetSession
export  async function createResetSession(req, res){
    res.json('create Reset session')
}

//update password when we have validate session
// PUT : http://localhost:8080/api/resetPassword
export  async function resetPassword(req, res){
    res.json('Reset password')
}