"use client";

import { data } from "./data";
import { Geist_Mono } from "next/font/google";
import Fuzzy from "@/components/headless/fuzzy";

const geistMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-geist-mono",
});

const NikeProductCard = ({ details }: { details: (typeof data)[0] }) => {
	return (
		<div className="group bg-muted border border-muted-foreground/40 rounded-none border-zinc-300 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-white transition-all duration-300 flex flex-col overflow-hidden">
			<div className="relative h-72 group-hover:scale-105 transition-transform duration-300">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={`/nike/${details.id}.jpg`}
					alt={details.id}
					className="object-contain w-full h-full transform group-hover:rotate-2 transition-transform duration-300"
				/>
				{details.sustainable && (
					<div className="absolute top-4 left-4">
						<div className="inline-block px-3 py-1 font-mono border border-green-500 text-green-500 text-xs font-bold uppercase tracking-widest">
							Sustainable
						</div>
					</div>
				)}
			</div>

			<div className="p-6 space-y-4">
				<h2 className="text-lg font-bold text-zinc-900 dark:text-white tracking-wide leading-tight">
					{details.id}
				</h2>
				<div className="text-sm text-zinc-600 dark:text-zinc-400 tracking-wide">
					{details.type} {details.description}
				</div>
				<div className="text-xs text-zinc-500 tracking-wide">
					{details.colors} {details.colors === 1 ? "Colour" : "Colours"}
				</div>
				<div className="pt-4 flex items-center justify-between">
					<div className="text-xl font-bold text-zinc-900 dark:text-white font-mono">
						₹{details.price.toLocaleString("en-IN")}.00
					</div>
					<button
						type="button"
						className={`${geistMono.className} px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-bold uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]`}
					>
						Buy Now
					</button>
				</div>
			</div>
		</div>
	);
};

export default function NikePage() {
	return (
		<div className="container mx-auto px-4 py-16 bg-white dark:bg-zinc-900 min-h-screen">
			<h1 className="font-serif text-[7vw] md:text-4xl italic text-center mb-16 text-zinc-900 dark:text-white lowercase">
				NikeFootball
			</h1>
			<Fuzzy
				data={data}
				// @ts-expect-error/idfk
				render={(details: (typeof data)[0]) => (
					<NikeProductCard details={details} />
				)}
				options={{
					keys: ["id", "type", "description"],
					threshold: 0.3,
					ignoreLocation: true,
					minMatchCharLength: 2,
					shouldSort: true,
					findAllMatches: true,
				}}
			/>
		</div>
	);
}

/* 
			<div className="w-full h-[40vh] mb-6 relative overflow-hidden">
				<img
					src="https://static.nike.com/a/images/f_auto/dpr_2.0,cs_srgb/h_1659,c_limit/2f8b228a-5141-4e2c-b846-d6e028faaed3/nike-just-do-it.jpg"
					alt="Nike Banner"
					className="w-full h-full object-cover opacity-80"
				/>
			</div>
*/
