"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggleBtn";
export function NavBar() {

	const router = useRouter();
	const [query, setQuery] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!query.trim()) return;

		

		
		router.push(`/ticker/${query.toUpperCase()}`); // Redirect to new page to display Ticker Data.
		setQuery(""); // Clear search bar before navigating to new page.
	}

	return (
		<nav className="w-full px-6 py-4 bg-slate-50 border-b-3 border-indigo-300 dark:bg-slate-900 dark:border-indigo-500">
			<div className="flex items-center h-12">
				{/* Left: Logo */}
				<div className="flex items-center">
					<Link href="/">
					<span className="text-2xl font-bold font-mono">
						<span className="text-indigo-500 text-2xl font-bold dark:text-indigo-300 dark:drop-shadow-[0_0_10px_rgba(99,102,241,0.9)]">Ticker</span>
						<span className="text-slate-800 font-mono dark:text-slate-100">Lens</span>
					</span>
					</Link>
					
					
				</div>

				{/* Center: Search */}
				<div className="flex-1 flex justify-center w-full">
					<div className="w-1/2">
						<form onSubmit={handleSubmit}>
							<input
							type="text"
							className="w-full px-4 py-2 rounded-2xl focus: outline-1"
							placeholder="Search Ticker..."
							value = {query}
							onChange={(e) => setQuery(e.target.value)}
							/>
						</form>
					</div>
				</div>

				<div className="flex items-center space-x-4">
					<ThemeToggle/>
				</div>
			</div>
		</nav>
	);
}
