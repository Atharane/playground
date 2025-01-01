"use client";

import confetti from "canvas-confetti";

export const popConfetti = () => {
	confetti({
		particleCount: 100,
		spread: 100,
	});
};
