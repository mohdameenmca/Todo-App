import React, { useEffect } from "react";
import { useState } from "react";
import "./Todo.css"
const Todo = () =>{
    const [title,setTitle]=useState("");
    const [description,setDescription]=useState("");
    const [editTitle,setEditTitle]=useState("");
    const [editId,seteditId]=useState(-1);
    const [editDescription,setEditDescription]=useState("");
    const [todo,setTodo]=useState([]);
    const [message,setMessage]=useState("");
    const [error,setError]=useState("");

    //URL from Backend server
    const apiurl='http://localhost:8080'


//Create the Data
    const handleSubmit=(event)=>{
        setError("");
        if(title.trim() !== '' && description.trim() !== ''){
            fetch(apiurl+'/todo',{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({title,description})
            }).then((res)=>{
                if(res.ok){
                    setTodo([...todo,{title,description}]);
                    setTitle("");
                    setDescription("");
                    setMessage("Item has been successfully Added")
                    setTimeout(()=>{
                        setMessage("")
                    },3000)
                    
                }
                else{
                    setError("Unable to create Todo item")
                   
                }
            }).catch(() =>{
                setError("Unable to create Todo item");
                
            })
            
        }
    }

//Get the Data
useEffect(()=>{
    getData();
},[])

const getData=()=>{
    fetch(apiurl+"/todo")
    .then((res)=>res.json())
    .then((res)=>{
        setTodo(res)
    })
    
}

// Update Data
const handleUpdate=()=>{
    setError("");
    if(editTitle.trim() !== '' && editDescription.trim() !== ''){
        fetch(apiurl+'/todo/'+editId,{
            method:"PUT",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({title:editTitle,description:editDescription})
        }).then((res)=>{
            if(res.ok){
                const updatedTodoList =todo.map((item)=>{
                    if(item._id===editId){
                        item.title=editTitle;
                        item.description=editDescription;
                    }
                    return item;
                })
                setTodo(updatedTodoList);
                setEditTitle("");
                setEditDescription("");
                setMessage("Item has been successfully Updated")
                setTimeout(()=>{
                    setMessage("")
                },3000)
                seteditId(-1)
                
            }
            else{
                setError("Unable to Update Todo Updation")
               
            }
        }).catch((error) =>{
            setError(error,"Unable to Update Todo item");
            
        })
        
    }
}

// Delete data subject
const handledelete=(id)=>{
    if(window.confirm("Are you sure want to delete the list")){
    fetch(apiurl+'/todo'+id,{
        method:"DELETE"
    })
    .then(()=>{
        const updatedTodo = todo.filter((item)=>item._id !== id)
        setTodo(updatedTodo);
        }
    ) }
}

const handleEditCancel=()=>{
    seteditId(-1);
}

const handleEdit=(item)=>{
    seteditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
}

    return(
        <div className="app">
        <div className="row p-3 bg-success text-light">
            Todo Application
        </div>
        <div className="row">
        {message && <p className="text-success">{message}</p>}
        
        <div className="form-group d-flex gap-2">
           
            <input type="text" value={title} placeholder="Title" className="form-control" onChange={(e)=>setTitle(e.target.value)}/>
            <input type="text" value={description} placeholder="Description" className="form-control" onChange={(e)=>setDescription(e.target.value)}/>
            <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
             
            
        </div>
        {error && <p className="text-danger">{error}</p>}
        </div>
        {
            todo.map((item)=>
        <div className="list">
            <ul>
                {
                    editId === -1 || editId !== item._id ?
                    <>
                <li>{item.title}</li>
                <li>{item.description}</li>
                </>
                :
                <>
                 <input type="text" value={editTitle} placeholder="Title" className="form-control" onChange={(e)=>setEditTitle(e.target.value)}/>
                 <input type="text" value={editDescription} placeholder="Description" className="form-control" onChange={(e)=>setEditDescription(e.target.value)}/> 
           
                </>
            }
                <div className="btn d-flex ">
               { editId === -1 || editId !== item._id ? <button className="bg-warning" onClick={()=>handleEdit(item)}>Edit</button>:<button className="bg-warning" onClick={handleUpdate}>Update</button>}
               { editId === -1 || editId !== item._id ?    <button className="btn btn-bg-danger" onClick={()=>handledelete(item._id)}>Delete</button> :
                    <button className="btn btn-bg-danger" onClick={handleEditCancel}>Cancel</button>}
                    
                </div>
            </ul>
        </div>
            )
        }
        </div>
    )
}

export default Todo;