'use client'

import { Button } from '@/components/ui/button'
import { TrashIcon } from '@radix-ui/react-icons'
import React from 'react'
import { deleteTodoById } from '../actions';
import { toast } from '@/components/ui/use-toast';

export default function DeleteTodo({todo_id} : {todo_id: string}) {
    
    const onSubmit = async () => {
        const result = JSON.parse(await deleteTodoById(todo_id));
            if(result?.error?.message) {
                toast({
                    title: 'Fail to delete'
                })
            }else{
                toast({
                    title: 'Successfully deleted'
                })
            }
    }


  return (
    <div>
        <form action={onSubmit}>
            <Button
                variant="outline"
                className="bg-dark dark:bg-inherit"
            >
                <TrashIcon />
                Delete
            </Button>
        </form>
    </div>
  )
}
