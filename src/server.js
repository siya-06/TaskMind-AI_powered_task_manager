import express from 'express'
import path from 'path'
import {dirname} from 'path'
import { fileURLToPath } from 'url'
import authroutes from './routes/authroutes.js'
import todoroutes from './routes/todoroutes.js'
import authmiddleware from './middleware/authmiddleware.js'




const app= express() //invoke express
const PORT = process.env.PORT || 5003

//get file path fronm url of current module
const __filename = fileURLToPath(import.meta.url)
//get the directory name from the file path
const __dirname =dirname(__filename)


//middleware
app.use(express.json())
//serves the html file from /public directory 
//tells express to serve all files from the public folder as static assets /file.
//any requests for the css files will be resolved to the public directory
app.use(express.static(path.join(__dirname, '../public')))

//serving up the html file from the /public directory
app.get('/', ( req,res)=>{
    res.sendFile(path.join(__dirname,'../public','index.html'))
})

//img 
app.use(express.static("public"))
// routes
app.use('/auth',authroutes)
app.use('/todos',authmiddleware,todoroutes)


app.listen(PORT,() => {
    console.log(`server has started on ${PORT}`)
})