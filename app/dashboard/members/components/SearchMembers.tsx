'use client';

import { Input } from "@/components/ui/input";
import React, { useState } from "react";

interface searchProps{
	onSearch: (query: string) => void;
}

export default function SearchMembers() {
	const [seach, setSearch] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearch(value);
		// onSearch(value); // Call the parent function to filter members
	};

	return (
		<Input
			placeholder="search by role, name"
			className=" ring-zinc-300 bg-white dark:bg-inherit focus:dark:ring-zinc-700  focus:ring-zinc-300"
			value={seach}
			onChange={handleChange}
		/>
	);
}
