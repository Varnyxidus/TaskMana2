"use server";
import { readUserSession } from "@/lib/actions";
import { createSupbaseServerClient } from "@/lib/supabase";
import { revalidatePath, unstable_noStore } from "next/cache";

export async function createTodo(data:{
	title: string;
	description: string;
	status: "Done" | "Pending";
}) {
	// const { data: userSession } = await readUserSession();

	// if (userSession.session?.user.user_metadata.role !== "admin") {
    //     return JSON.stringify({ error: { message: "You don't have the privilege" } });
    // }

	const supabase = await createSupbaseServerClient();
	const result = await supabase.from("todo").insert(data);
	revalidatePath("/dashboard/todo")
	return JSON.stringify(result);
}

export async function updateTodoById(
	id: string,
	data:{
		title?: string;
		description?: string;
		status?: "Done" | "Pending";
	}
) {
	const { data: userSession } = await readUserSession();

    // if (userSession.session?.user.user_metadata.role !== "admin") {
    //     return JSON.stringify({ error: { message: "You do not have the privilege" } });
    // }

    const supabase = await createSupbaseServerClient();
    const result = await supabase.from("todo").update(data).eq("id", id);
    revalidatePath("/dashboard/todo");
    return JSON.stringify(result);
}

export async function deleteTodoById(id: string) {
	const { data: userSession } = await readUserSession();

    if (userSession.session?.user.user_metadata.role !== "admin") {
        return JSON.stringify({ error: { message: "You do not have the privilege!" } });
    }

    const supabase = await createSupbaseServerClient();
    const result = await supabase.from("todo").delete().eq("id", id);
    revalidatePath("/dashboard/todo");
    return JSON.stringify(result);
}


export async function readTodos() {
	unstable_noStore();
    const supabase = await createSupbaseServerClient();
    return await supabase.from("todo").select("*");
}
