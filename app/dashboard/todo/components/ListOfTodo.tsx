import React from "react";
import { TrashIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import EditTodo from "./EditTodo";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { readTodos } from "../actions";
import { ITodo } from "@/lib/types";
import DeleteTodo from "./DeleteTodo";
import { useUserStore } from "@/lib/store/user";

export default async function ListOfTodo() {
	const {data: todos} = await readTodos();
	
	const user = useUserStore.getState().user;
	const isAdmin = user?.user_metadata.role === "admin";

	return (
		<div className="dark:bg-inherit bg-white mx-2 rounded-sm">
			{(todos as ITodo[])?.map((todo, index) => {
				return (
					<div
						className=" grid grid-cols-5  rounded-sm  p-3 align-middle font-normal "
						key={index}
					>
						<h1>{todo.title}</h1>
						<h1>{todo.description}</h1>
						<h1>{new Date(todo.created_at).toDateString()}</h1>
						<div>
							<span
								className={cn(
									" dark:bg-zinc-800 px-2 py-1 rounded-full  capitalize text-sm border-zinc-300  border",
									{
										"text-green-600 px-4 dark:border-green-400 bg-green-200":
											todo.status === "Done",
										"text-red-500 bg-red-100 dark:text-red-300 dark:border-red-400":
											todo.status === "Pending",
									}
								)}
							>
								{todo.status}
							</span>
						</div>

						<div className="flex gap-2 items-center">
							{isAdmin && (
								<DeleteTodo todo_id={todo.id}/>
							)}
							<EditTodo todo={todo} />
						</div>
					</div>
				);
			})}
		</div>
	);
}
