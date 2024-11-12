const express= require('express')
const app = express();
const mongoose = require("mongoose");
const cors=require("cors")
// const { title } = require("process");

//Connect MongoDB
mongoose.connect('mongodb://localhost:27017/mern-app').then(()=>{
    console.log("DB has been successfully connected");
}).catch((err)=>{
    console.log(err);
})

//Create Schema
const todoSchema = new mongoose.Schema({
    title:{
        required:true,
        type:String
    },
    description:{
        required:true,
        type:String
    }
});

//Create model
const todoModel = mongoose.model('Todo',todoSchema);
app.use(cors())
app.use(express.json()) //Express usage in App

//Data Creation
app.post('/todo',async(req,res)=>{
    const {title,description} = req.body;

    try{
        const newtodo =new todoModel({      //Create New Model
            title,description
        });
        await newtodo.save();
        res.status(201).json(newtodo);
    }
    catch(error){
            res.status(500).json({message:error.message})
        }
    
       
    // const MyList={
    //     id:todo.length+1,
    //     title,
    //     description
    // }
    // todo.push(MyList);
    // console.log(MyList);
    // res.status(201).json(MyList);
})

//Read the Data
app.get('/todo',async(req,res)=>{
    try{
        const getData= await todoModel.find();
        res.json(getData);
    }
    catch(error){
        res.status(500,{message:error.message});
    }
   
})

//Data Updation
app.put('/todo/:id',async(req,res)=>{
    try{
        const {title,description} = req.body;
        const  id=req.params.id;
        const updatedTodo= await todoModel.findByIdAndUpdate(

            id,
            {title,description},
            {new:true}
        ) 
        if(!updatedTodo){
            res.status(404).json("Todo Data Not found in Application")
        }
    
        res.status(200).json(updatedTodo);

    }
    catch(error){
        res.status(500,{message:error.message});
    }
})

//Deletion of data
app.delete('/todo/:id',async(req,res)=>{
    try{
    const id=req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
    
    }
    catch(error){
        res.status(500,{error:message.error});
    }
})

app.listen(8080,()=>{

    console.log("Node JS server")
});
