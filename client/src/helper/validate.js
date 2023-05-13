import toast from 'react-hot-toast'


/**validate login page username */
export async function usernameValidate(values){
    const errors = usernameVerify({}, values)
    return errors
}

/**validate password */
export async function passwordValidate(values){
    const errors = passwordVarify({}, values)
}

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
