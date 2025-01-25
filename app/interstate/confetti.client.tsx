"use client";

import Confetti from "react-confetti";

export const ConfettiClient = () => {
	return (
		<Confetti
			width={window.innerWidth}
			height={window.innerHeight}
			recycle={false}
			drawShape={(ctx) => {
				ctx.beginPath();
				ctx.arc(0, 0, 10, 0, 2 * Math.PI);
				ctx.fillStyle = "#8338ec";
				ctx.fill();
				ctx.closePath();
			}}
		/>
	);
};

export default ConfettiClient;
