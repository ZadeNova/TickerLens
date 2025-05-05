import { Button } from "./button";
import Link from "next/link";

export function NavBar() {
	return (
		<nav className="w-full px-6 py-4 bg-white text-gray-900 border-b border-gray-200 shadow-sm">
			<div className="flex items-center h-16">
				{/* Left: Logo */}
				<div className="flex items-center space-x-4">
					<span className="text-2xl font-bold">
						<span className="text-blue-600 text-2xl font-bold">Ticker</span>
						<span className="text-black">Lens</span>
					</span>
				</div>

				{/* Center: Search */}
				<div className="flex-1 flex justify-center w-full">
					<div className="relative w-100">
						<form>
							<input
								type="text"
								className="w-full px-4 py-2 rounded-2xl focus: outline-1"
								placeholder="Search..."
							/>
						</form>
					</div>
				</div>

				<div className="flex items-center space-x-4">
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
				</div>
			</div>
		</nav>
	);
}
