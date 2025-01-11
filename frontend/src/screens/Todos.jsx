import React from "react";
import toast from "react-hot-toast";
import DeleteIcon from "../components/icons/DeleteIcon";
import EditTodo from "../components/EditTodo";
import TickIcon from "../components/icons/TickIcon";
import Loader from "../components/Loader";
import useSWR from "swr";
import { useSelector } from "react-redux";
import { Plus } from "lucide-react";


const fetcher = (url, options = {}) =>
    fetch(url, {
        method: options.method || "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: options.body ? JSON.stringify(options.body) : undefined,
    }).then(async (res) => {
        if (!res.ok) {
            const error = await res.json();
            // toast.error(error.message || "An error occurred. Please try again later.");
            // console.log("Fetch Error: ", error);
            
        }
        return res.json();
    });

    const handleError = (error) => {
        toast.error(error)
        throw new Error(error);
    };


const Todos = () => {

    const { userInfo } = useSelector((state) => state.auth)

    const { data, error, isValidating, mutate } = useSWR(
        "http://localhost:8000/api/tasks",
        fetcher
    );

    // console.log("Your data is: ", data);

    if (!data && isValidating) {
        return <Loader />;
    }

  

    async function handleAddTodo (e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const description = formData.get("description");

        if(!description.trim()){
            toast.error("Please enter a ToDo description");
            return;
    }

    const newTodo = {
        description: `${description} adding...`,
        _id: Date.now().toString(),
        isCompleted: false,
    };

    async function addToDo() {
        const response = await fetcher("http://localhost:8000/api/tasks", {
            method: "POST",
            body: { description },
        });

        console.log("Response: ", response);
        if(!response){
            handleError(response.error);
        }
        toast.success("Task added successfully");
        return [...data, response];
    }
    await mutate(addToDo, {
        optimisticData: [newTodo],
        revalidate: true,
        rollbackOnError: true,
    })
    e.target.reset();
}
    async function deleteTodo(id){
        toast.success("Task deleted successfully");
        await mutate(async ()=>{
            const response = await fetcher(`http://localhost:8000/api/tasks/${id}`, {
                method: "DELETE",
            })
            if(response.error){
                handleError(response.error);

            }
            return data.filter((task) => task._id !== id);
        }, {
            optimisticData: data.filter((task) => task._id !== id),
            rollbackOnError: true,
            revalidate: false,
        })
    }

    async function completeTodo (id) {
        toast.success("Status updated successfully");
        await mutate(async () => {
            const response = await fetcher(`http://localhost:8000/api/tasks/${id}`, {
                method: "PUT",
            });
            if(response.error){
                handleError(response.error);
            }
            return data.map((task) => task._id === id ? { ...task, completed: true } : task);
            }, {
                optimisticData: data.map((task) => task._id === id ? { ...task, completed: true } : task),
                revalidate: true,
                rollbackOnError: true,
            });
    }

    // async function updateTodo(id){
    //     toast.success("Task updated successfully")

    //     await mutate(async ()=>{
    //         const response = await fetcher(`http://localhost:8000/api/tasks/${id}`, {
    //             method: "PUT",
    //         })
    //         if(response.error){
    //             handleError(response.error);
    //         }
    //         return [...data, response]
    //     },{
            
    //     })
    // }

    async function handleUpdate(id, newDescription) {
        toast.success("Task Updated Successfully!")
        await mutate(async () => {
            const response = await fetcher(`http://localhost:8000/api/tasks/${id}`, {
                method: "PATCH",
                body: { description: newDescription },
            });
    
            if (response.error) {
                handleError(response.error);
            }
    
            return data.map((task) => {
                if (task._id === id) {
                    return { ...task, description: newDescription };
                }
                return task;
            });
        }, {
            optimisticData: data.map((task) => {
                if (task._id === id) {
                    return { ...task, description: newDescription };
                }
                return task;
            }),
            rollbackOnError: true,
            revalidate: false
        });
    }



    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold text-center mb-4">{userInfo.name.split(" ")[0]}'s Todos</h1>
            <form onSubmit={handleAddTodo} className="flex gap-4 items-center">
                <input
                type="text"
                placeholder="Enter your task"
                name="description"
                id="description"
                required
                className="shadow-md"
                />
                <button className="h-9 rounded-md border border-input bg-transparent px-4 text-base shadow-md flex items-center hover:bg-primary transition ease-linear group">
                    <Plus
                    size={20}
                    className="transition ease-linear group-hover:stroke-white"/>
                </button>
            </form>
            {data && data.length > 0 ? (
                            <ul>
                            {data.map((task) => (
                                <li key={task._id} className="flex items-center justify-between py-2 mt-4 bg-gray-100 hover:bg-gray-200 transition-colors">
                                    <span
                                    className={`flex-1 px-3 ${task.status && "line-through text-[#636$7b]"}`}
                                    >{task.description}</span>
                                    <div className="px-3 flex gap-2">
                                         <TickIcon onClick={() => completeTodo(task._id)} className={`transition ease-in-out hover:cursor-pointer ${
                                            task.status ? "text-green-500" : "text-gray-400"
                                         }`}/>
                                       <EditTodo handleUpdate={handleUpdate} id={task._id} description={task.description}
                                       disabled={task.status}
                                       />
                                        <DeleteIcon className="transition-transform transform hover:scale-110 hover:text-blue-500" onClick={() => deleteTodo(task._id)}/>
                                    </div>
                                </li>
                            ))}
                        </ul>
            ) : (
                <h2 className="text-center text-xl py-4">No tasks available</h2>
            )}
        </div>
    );
};

export default Todos;
