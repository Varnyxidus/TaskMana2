import { useUserStore } from "@/lib/store/user";
import React from "react";

export default function Dashboard() {
	const user = useUserStore.getState().user;
	const isAdmin = user?.user_metadata.role === "admin";

	return (
		<div>
			<h2>Welcome, {isAdmin ? "Admin!" : "Member!"}</h2>
		</div>
	);
}
