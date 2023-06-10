import nodemailer from 'nodemailer'
import Mailgen from 'mailgen'

import EVN from '../config.js'

//https://ethereal.email/create
let nodeConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: EVN.EMAIL, // generated ethereal user
      pass: EVN.PASSWORD, // generated ethereal password
    }
} 

let transpoter = nodemailer.createTransport(nodeConfig)

let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: "https://mailgen.js/"
    }
})

/**POST : http://localhost:8080/api/registerMail
  @param : {
    "username": 'admin',
    'password' : 'admin123'
    'text' : ''
    'subject' : ''
}
*/

export const registerMail = async (req, res)=>{
    const {username, userEmail, text, subject} = req.body

    //body of the Email
    let email = {
        body: {
            name: username,
            intro: text || "Welcom to the world of the AchuBSL",
            outro: "Need Help? send Mail."
        }
    }

    let emailBody = MailGenerator.generate(email)

    let message = {
        from: EVN.EMAIL,
        to: userEmail,
        subject: subject || "Signup Successfully",
        html: emailBody
    }

    transpoter.sendMail(message)
      .then(()=>{
        return res.status(200).send("You should receive an email form us.")
      })
      .catch(err => res.status(500).send(err))
}