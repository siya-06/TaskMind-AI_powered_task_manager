import express from 'express'
import { categorizeTask, suggestTasks } from "../aiService.js"

import prisma from '../prismaClient.js'

const router = express.Router()

//get all todos for logged-in user
router.get('/',async(req,res) => {
  console.log("GET /todos for userid =", req.userid)
  const todos = await prisma.todo.findMany({
    where:{
      userid:req.userid
    }
  }) 
  
  res.json(todos) 
})

//create a new todo
router.post('/', async (req,res) => {
  const {task} =req.body
  console.log("POST /todos task =", task, "userid =", req.userid)
  
  const todo = await prisma.todo.create({
    data:{
      task,
      userid: req.userid
    }
  })

  res.json(todo)
})

//update a todo
router.put('/:id',async(req,res) => {
  const { completed } = req.body
  const { id } = req.params
  console.log("PUT /todos id =", id, "userid =", req.userid, "completed =", completed) 
  const updatedTodo= await prisma.todo.updateMany({
    where:{
      id:parseInt(id),
      userid: req.userid
    },
    data:{
      completed: !!completed //convert to boolean
    }
  })
   
  res.json(updatedTodo)

})

//delete a todo
router.delete('/:id',async(req,res) =>{
  const { id } = req.params
    console.log("DELETE /todos id =", id, "userid =", req.userid)   
  const userid = req.userid
  await prisma.todo.deleteMany ({
     where:{
      id: parseInt(id),
      userid
    }
  })
   
  res.send({ message: "Todo deleted" })
})
// AI Categorization
router.post("/ai/categorize", async (req, res) => {
  try {
    const { task } = req.body;
    console.log("Categorize request:", task)
    const tag = await categorizeTask(task);
    res.json({ tag });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI categorization failed" });
  }
});

// AI Suggestions
router.get("/ai/suggest", async (req, res) => {
  try {
    console.log("Suggest request for userid =", req.userid)
    const tasks = await suggestTasks();
    res.json({ tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI suggestions failed" });
  }
})

export default router