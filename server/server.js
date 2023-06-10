import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import connect from './database/conn.js'
import router from './router/route.js'
const app = express()

/**middlewares */
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(morgan('tiny'))
app.disable('x-powered-by')//less hackers know about our stack

const port = 8080

/**HTTP GET Request */
app.get("/", (req, res)=>{
    res.status(201).json('Home Get Request')
})


 //api routes
 app.use("/api", router)



/** start server only when we have valid connection */
connect().then(()=>{
    try{
        app.listen(port, ()=>{
            console.log("server is running on port 8080")
        })
    }catch(err){
        console.log("Cannot connect the server")
    }
}).catch(err=>{
    console.log("Invalid Database connection....!")
})


// app.listen(port, ()=>{
//     console.log("server is running on port 8080")
// })