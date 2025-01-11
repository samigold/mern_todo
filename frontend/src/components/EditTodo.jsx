import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import EditIcon from "./icons/EditIcon";

const EditTodo = ({description, id, handleUpdate, disabled}) => {
    const [newDescription, setNewDescription] = useState(description);


  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className={`transition-transform transform hover:scale-110 hover:text-blue-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <EditIcon className="transition-transform transform hover:scale-110 hover:text-blue-500" />
        </div>
      </DialogTrigger>
      {!disabled && (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
          <DialogDescription>
            Make changes to your Todo here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-2" onSubmit={(e)=>{
            e.preventDefault();
            handleUpdate(id, newDescription);
        }}>
            <input type="hidden" value={id} name="id"/>
            <Label htmlFor="description">Description</Label>
            <Input
            id="description"
            name="description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="col-span-3"/>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
        </form>
      </DialogContent>
      )}
    </Dialog>
  )
}

export default EditTodo;