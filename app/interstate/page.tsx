import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import { popConfetti } from "./client";
import ConfettiClient from "./confetti.client";

const Interstate = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen font-mono">
			<ConfettiClient />
			<Button
				type="button"
				className="group bg-[#03FF92] hover:bg-[#03FF92]/90 rounded-full pr-1 py-4 h-12 text-2xl font-serif italic flex items-center border border-muted-foreground/40 shadow-none transition-all duration-200 text-black"
				onClick={popConfetti}
			>
				confetti me bad!
				<span className="bg-[#03FF92] hover:bg-[#03FF92]/90 border border-slate-500/20 rounded-full p-2.5 transition-all duration-200">
					<ArrowUpRight className="size-5 group-hover:rotate-12 transition-all duration-200" />
				</span>
			</Button>
		</div>
	);
};

export default Interstate;
