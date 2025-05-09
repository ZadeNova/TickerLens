"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
export function NavBar() {

	const router = useRouter();
	const [query, setQuery] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!query.trim()) return;

		

		setQuery(""); // Clear search bar before navigating to new page.
		router.push(`/ticker/${query.toUpperCase()}`); // Redirect to new page to display Ticker Data.
	}

	return (
		<nav className="w-full px-6 py-4 bg-gray-100 hover:text-indigo-700 text-gray-900 border-b border-gray-200 shadow-sm">
			<div className="flex items-center h-12">
				{/* Left: Logo */}
				<div className="flex items-center">
					<Link href="/">
					<span className="text-2xl font-bold font-mono">
						<span className="text-indigo-500 text-2xl font-bold">Ticker</span>
						<span className="text-black font-mono">Lens</span>
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
					<button className="rounded-full p-2 cursor-pointer">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						className="size-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
						/>
					</svg>
					</button>
				</div>
			</div>
		</nav>
	);
}
