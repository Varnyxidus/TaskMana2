import React from "react";
import ListOfTodo from "./ListOfTodo";
import Table from "@/components/ui/Table";

export default function TodoTable() {
	const tableHeader = ["Title", "Description", "Created at", "Status"];

	return (
		<Table headers={tableHeader}>
			<ListOfTodo />
		</Table>
	);
}
