"use server";

import { readUserSession } from "@/lib/actions";
import { createSupabaseAdmin, createSupbaseServerClient } from "@/lib/supabase";
import { revalidatePath, unstable_noStore } from "next/cache";

export async function createMember(data: {
	email: string;
	password: string;
	name: string;
	role: "user" | "admin";
	status: "active" | "resigned";
	confirm: string;
}) {
	const {data: userSession} = await readUserSession()
	if(userSession.session?.user.user_metadata.role !== "admin"){
		return JSON.stringify({error: {message: "You don't have the privilege"}})
	}
	

	const supabase = await createSupabaseAdmin();

	//create account
	const creationRes = await supabase.auth.admin.createUser({
		email: data.email, 
		password: data.password, 
		email_confirm: true, 
		user_metadata:{
			role: data.role
		}
	});

	if(creationRes.error?.message){
		return JSON.stringify(creationRes)
	}else{
		const memberResult = await supabase.from("member").insert({
			name: data.name, 
			id: creationRes.data.user?.id,
			email: data.email
		})
		if(memberResult.error?.message){
			return JSON.stringify(creationRes)
		}else{
			const permissionResult = await supabase.from("permission").insert({
				role: data.role, 
				member_id: creationRes.data.user?.id, 
				status: data.status
			})

			revalidatePath("/dashboard/member");
			return JSON.stringify(permissionResult);
		}
	}
	//create member
	//create permissions
}
export async function updateMemberById(id: string, data:{name: string}) {
	const supabase = await createSupbaseServerClient();
	const result = await supabase.from("member").update(data).eq("id", id);
	revalidatePath("/dashboard/member");

	return JSON.stringify(result);
}

export async function updateMemberAdvanceById(
	permission_id: string,
	user_id: string, 
	data:{
		role: "admin" | "user";
		status: "active" | "resigned";
	}
) {
	const {data: userSession} = await readUserSession()
	if(userSession.session?.user.user_metadata.role !== "admin"){
		return JSON.stringify({error: {message: "You don't have the privilege"}})
	}
	

	const supabaseAdmin = await createSupabaseAdmin();

	//update account
	const updateRes = await supabaseAdmin.auth.admin.updateUserById(
		user_id, {user_metadata: {role: data.role}}
	);

	if(updateRes?.error?.message){
		return JSON.stringify(updateRes)
	}else{
		const supabase = await createSupbaseServerClient();
		const result = await supabase.from("permission").update(data).eq("id", permission_id);
		revalidatePath("/dashboard/member");

		return JSON.stringify(result);
	}
}

export async function updateMemberAccountById(
	user_id: string, 
	data:{
		email: string;
		password?: string | undefined;
		confirm?: string | undefined;
	}
) {
	const {data: userSession} = await readUserSession()
	if(userSession.session?.user.user_metadata.role !== "admin"){
		return JSON.stringify({error: {message: "You don't have the privilege"}})
	}
	
	const updateObject:{
		email: string;
		password?: string | undefined
	} = {email: data.email};

	if(data.password){
		updateObject["password"] = data.password;
	}


	const supabaseAdmin = await createSupabaseAdmin();

	// update account
	const updateRes = await supabaseAdmin.auth.admin.updateUserById(
		user_id, updateObject
	);

	if(updateRes.error?.message){
		return JSON.stringify(updateRes)
	}else{
		const supabase = await createSupbaseServerClient();
		const result = await supabase.from("member").update({email: data.email}).eq("id", user_id);
		revalidatePath("/dashboard/member");
		return JSON.stringify(result);
	}
}


export async function deleteMemberById(user_id: string) {
	//admin only
	const {data: userSession} = await readUserSession()
	if(userSession.session?.user.user_metadata.role !== "admin"){
		return JSON.stringify({error: {message: "You don't have the privilege"}})
	}

	//delete account
	const supabaseAdmin = await createSupabaseAdmin();
	const deleteResult = await supabaseAdmin.auth.admin.deleteUser(user_id)

	if(deleteResult.error?.message){
		return JSON.stringify(deleteResult)
	}else{
		const supabase = await createSupbaseServerClient();
		const result = await supabase.from("member").delete().eq("id", user_id);
		revalidatePath("/dashboard/member");
		return JSON.stringify(result);
	}
}


export async function readMembers() {
	unstable_noStore();
	const supabase = await createSupbaseServerClient();
	return await supabase.from("permission").select("*, member(*)")
}
