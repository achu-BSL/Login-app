import axios from 'axios'
axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN

/**Make API Request */


/*Authenticate Function*/
export async function authenticate(username){
    try {
        return await axios.post('http://localhost:8080/api/authenticate', {username})
    } catch (err){
        return {error: "Username doesn't exist...!"}
    }
}


/**Get User details */
export async function getUser({username}){
    try {
        const {data} = await axios.get(`/api/user/${username}`)
        return data
    } catch (err){
     return {error: "Password doesn't match..!"}   
    }
}


/**Register User Function */
export async function registerUser(credentials){
    try {
        // console.log(credentials.username, credentials.email, credentials.password)
        const {data: {msg}, status} = await axios.post("http://localhost:8080/api/register", credentials)

        const {username, email} = credentials

        // const response = await fetch("http://localhost:8080/api/register", {
        //     method: 'post',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(credentials)
        // })

        // console.log(response.status)
        // if(response.status == 201){
        //     const data = await response.json()

        //     console.log(data)
        // }
        // const {username, email} = credentials
        // console.log(JSON.parse(data))

        console.log(msg, status)
        /**send mail */
        if(status === 201){
            await axios.post("http://localhost:8080/api/registerMail", {username, userEmail : email, text: msg})
        }
        return Promise.resolve({msg})
    } catch (err){
        console.log("problem inside helper")
        return Promise.reject({err})
    }
}    


/**login function */
export async function verifyPassword(username, password){
    try{
        if(username){
            console.log("verifyPassword", username, password)
            const {data} = await axios.post('http://localhost:8080/api/login', {username, password})
            console.log("Data from axios", data)
            return Promise.resolve({data})
        }
    } catch (err){
        console.log("inside err")
        return Promise.reject({err})
    }
}


/**update userProfile function */
export async function updateUser(response){
    try{
        const token = localStorage.getItem('token')
        const data = await axios.put(
            'http://localhost:8080/api/updateuser', 
            response,
            {
                headers: {
                    'Authorization' : `Bearer ${token}`
                }
            }
            )
        Promise.resolve(data)
    }catch(err){
        Promise.reject({err})
    }
}


/**generate OTP */
export async function generateOTP(username){
    try{
        const { data: { code }, status } = await axios
          .get('/api/generateOTP', { params: { username }})

        //send mail with the OTP
        if(status === 201){
            const { data: {email} } = await getUser({username});
            const text = `Your password recovery OTP is ${code}, Verify and recover your password`
            await axios.post('api/registerMail', {
                username,
                userEmail: email,
                text,
                subject: 'Password Recovery OTP'
            })
        }  
        return Promise.resolve(code)
    }catch (err) {
        return Promise.reject({err})
    }
}


/**verify OTP */
export async function verifyOTP({username, code}){
    try {
        const { data, status } = await axios.get('/api/verifyOTP', {params: {
            username,
            code
        }})
        return { data, status }
    } catch (err) {
        return Promise.reject(err)
    }
}


/**reset password */
export async function resetPassword({ username, password }){
    try {
        const { data, status } = await axios.post('/api/resetPassword', {
            username,
            password
        })
        return Promise.resolve({data, status})
    } catch(err) {
        return Promise.reject(err)
    }
}