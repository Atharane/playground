import { Button } from "@/components/ui/button";
import { popConfetti } from "./client";

const Interstate = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen  bg-white font-mono">
			<Button type="button" variant="outline" size="lg" onClick={popConfetti}>
				🎉 confetti me!
			</Button>
		</div>
	);
};

export default Interstate;
