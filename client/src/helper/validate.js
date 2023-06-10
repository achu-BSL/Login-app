import toast from 'react-hot-toast'
import { authenticate } from './helper.js'


/**validate login page username */
export async function usernameValidate(values){
    const errors = usernameVerify({}, values)

    if(values.username){
        //check user exist or not
        const { status } = await authenticate(values.username)
        
        if(status !== 200){
            errors.exist = toast.error("User does not exist...")
        }
    }
    return errors
}

/**validate password */
export async function passwordValidate(values){
    const errors = passwordVerify({}, values)
}

/**validate reset password */
export async function resetPasswordValidation(values){
    const errors = passwordVerify({}, values)
    if(values.password != values.confirm_pwd){
        errors.exist = toast.error("Password Not Match...!")
    }
    return errors
}

/**validate register form */
export async function registerValidation(values){
    const errors = usernameVerify({}, values)
    passwordVerify(errors, values)
    emailVerify(errors, values)

    return errors
}

/**validate profile page */
export async function profileValidation(values){
    const errors = emailVerify({}, values)
    return errors
}

/********************************************************* */

/**validate password */
function passwordVerify(err = {}, values){

    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g

    if(!values.password){
        err.password = toast.error("Password Required....!")
    } else if (values.password.includes(" ")){
        err.password = toast.error("Passowrd Incorrect...!")
    } else if (values.password.length < 4){
        err.password = toast.error("Password must be more than 4 characters long")
    } else if (!specialChars.test(values.password)){
        err.password = toast.error("Password must have atleast one Special character")
    }

    return err
}

/** validate user name **/
function usernameVerify (err={}, values){
    if(!values.username){
        err.username = toast.error("Username Required....!")
    } else if (values.username.includes(" ")){
        err.username = toast.error("Invalid Username....!")
    }

    return err
}


/**validate email */
function emailVerify(err = {}, values){
    if(!values.email){
        err.email = toast.error("Email Required...!")
    } else if (values.email.includes(" ")){
        err.email = toast.error("Wrong Email...!")
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(values.email)){
        err.email = toast.error("Invalid Email Address...!")
    }

    return err
}

