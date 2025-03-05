'use client'
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { createTodo, updateTodoById } from "../actions";
import { useEffect } from "react";
import { ITodo } from "@/lib/types";

const FormSchema = z.object({
	title: z.string().min(10, {
		message: "Title must be at least 10 characters.",
	}),
	description: z.string().min(10, {
		message: "Title must be at least 10 characters.",
	}),
	status: z.enum(["Done", "Pending"]),
});

export default function TodoForm({ isEdit, todo }: { isEdit: boolean; todo?: ITodo }) {
	const status = ["Done", "Pending"];
	
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			title: "",
			description: "",
			status: "Pending"
		},
	});

	useEffect(() => {
		if (todo) {
			form.reset({
				title: todo.title,
				description: todo.description,
				status: todo.status,
			});
		}
	}, [todo, form]);


	const handleCreateTodo = async (data: z.infer<typeof FormSchema>) => {
		const result = await createTodo(data);
		const {error} = JSON.parse(result);

		if(error?.message){
			toast({
				title: "Failed to create task:",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
						<code className="text-white">
							{error.message}
						</code>
					</pre>
				),
			});
		}else{
			document.getElementById("create-trigger")?.click();
			
			toast({
				title: "Successfully created task:",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
						<code className="text-white">
						{JSON.stringify(data, null, 2)}
						</code>
					</pre>
				),
			});
		}
	};

	const handleUpdateTodo = async (data: z.infer<typeof FormSchema>) => {
		if (!todo?.id) {
			toast({
				title: "Error",
				description: "task id not found",
				variant: "destructive",
			});
			return;
		}

		await updateTodoById(todo.id, {
			title: data.title,
			description: data.description,
			status: data.status,
		});
		toast({ title: "Task Updated!" });

	};

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		if (isEdit) {
			await handleUpdateTodo(data);
		} else {
			await handleCreateTodo(data);
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-full space-y-6"
			>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input
									placeholder="Task title"
									type="text"
									{...field}
									onChange={field.onChange}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Input
									placeholder="Task desc"
									type="text"
									{...field}
									onChange={field.onChange}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="status"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Status</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select Task status" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{status.map((status, index) => {
										return (
											<SelectItem
												value={status}
												key={index}
											>
												{status}
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" className="w-full" variant="outline">
					Submit
				</Button>
			</form>
		</Form>
	);
}
