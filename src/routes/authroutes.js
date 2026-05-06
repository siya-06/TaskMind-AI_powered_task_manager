import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import prisma from '../prismaClient.js'

const router = express.Router()

//register a new user endpoint /auth/register
router.post('/register',async(req,res) =>{
 const {username,password} = req.body
 const hashpassword =bcrypt.hashSync(password, 8)

 //save the new user and hashed password to the db
 //prepare method allows to inject values in sql query 
 // whereas exec is to run queries
 try{
   const user= await prisma.user.create({
     data:{
      username,
      password: hashpassword
     }
   })

   //we have one user now , to add their first todo 
   const defaulttodo= `hello add ur 1st todo`
   await prisma.todo.create({
    data:{
      task: defaulttodo,
      userid: user.id
    }
   })
    

    //create a token 
    const token=jwt.sign({id: user.id}, process.env.JWT_SECRET,
    {expiresIn:'24h'})
    res.json({ token})


  }
  catch(err){
    console.log(err.message)
    if (err.code === "P2002") {  // Prisma duplicate key error
        return res.status(400).json({ error: "User already exists. Please log in." })
    }
    res.status(400).json({ error: "Failed to register." })
}


 
})

router.post('/login',async (req,res) =>{
 const {username, password} = req.body
 try{
  const user=await prisma.user.findUnique({

   where:{
   username: username
   }

  })


   if(!user ){
    return res.status(404).send({message:"user not found"})
   }

   const passwordisvalid =bcrypt.compareSync(password,user.password)//returns in boolean
   if(!passwordisvalid) { return res.status(401).send({message:
    "invalid password"}) }
    console.log(user)
    // succesfull auth 

    const token = jwt.sign({id: user.id},process.env.JWT_SECRET , 
    {expiresIn: '24h'})
    res.json({token})
}catch(err){
    console.log(err.message)
    res.sendStatus(503)
}
})



export default router