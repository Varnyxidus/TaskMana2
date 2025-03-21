'use client';

import React, { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { TrashIcon } from '@radix-ui/react-icons';
import { deleteMemberById } from '../actions';
import { toast } from '@/components/ui/use-toast';

export default function DeleteMember({user_id}: {user_id: string}) {
    const [isPending, startTransition] = useTransition();

    const onSubmit = () =>{
        startTransition(async () => {
            const result = JSON.parse(await deleteMemberById(user_id));
            if(result?.error?.message) {
                toast({
                    title: 'Fail to delete'
                })
            }else{
                toast({
                    title: 'Successfully deleted'
                })
            }
        })
    }
  
    return (
    <div>
        <form action={onSubmit}>
            <Button variant="outline">
                <TrashIcon />
                    Delete
            </Button>
        </form>
    </div>
  )
}
