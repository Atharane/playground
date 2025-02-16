"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Playfair_Display, Cormorant } from "next/font/google";
import "./globals.css";
import styles from "./styles.module.css";

const playfair = Playfair_Display({
	subsets: ["latin"],
	variable: "--font-playfair",
});

const cormorant = Cormorant({
	subsets: ["latin"],
	variable: "--font-cormorant",
});

const Sunlit = () => {
	useEffect(() => {
		const toggle = () => {
			document.body.classList.add("animation-ready");
			document.body.classList.toggle("dark");
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.keyCode === 32) {
				toggle();
			}
		};

		const handleClick = () => {
			toggle();
		};

		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("click", handleClick);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("click", handleClick);
		};
	}, []);

	return (
		<div>
			<div className={styles.dappledLight}>
				<div className={styles.glow} />
				<div className={styles.glowBounce} />
				<div className={styles.perspective}>
					<div className={styles.leaves}>
						<svg style={{ width: 0, height: 0, position: "absolute" }}>
							<title>wind</title>
							<defs>
								<filter id="wind" x="-20%" y="-20%" width="140%" height="140%">
									<feTurbulence type="fractalNoise" numOctaves="2" seed="1">
										<animate
											attributeName="baseFrequency"
											dur="16s"
											keyTimes="0;0.33;0.66;1"
											values="0.005 0.003;0.01 0.009;0.008 0.004;0.005 0.003"
											repeatCount="indefinite"
										/>
									</feTurbulence>
									<feDisplacementMap in="SourceGraphic">
										<animate
											attributeName="scale"
											dur="20s"
											keyTimes="0;0.25;0.5;0.75;1"
											values="45;55;75;55;45"
											repeatCount="indefinite"
										/>
									</feDisplacementMap>
								</filter>
							</defs>
						</svg>
					</div>
					<div className={styles.blinds}>
						<div className={styles.shutters}>
							<div className={styles.shutter} />
							<div className={styles.shutter} />
							<div className={styles.shutter} />
							<div className={styles.shutter} />
							<div className={styles.shutter} />
							<div className={styles.shutter} />
							<div className={styles.shutter} />
							<div className={styles.shutter} />
							<div className={styles.shutter} />
							<div className={styles.shutter} />
							<div className={styles.shutter} />
							<div className={styles.shutter} />
							<div className={styles.shutter} />
							<div className={styles.shutter} />
							<div className={styles.shutter} />
							<div className={styles.shutter} />
							<div className={styles.shutter} />
							<div className={styles.shutter} />
							<div className={styles.shutter} />
							<div className={styles.shutter} />
							<div className={styles.shutter} />
							<div className={styles.shutter} />
							<div className={styles.shutter} />
						</div>
						<div className={styles.vertical}>
							<div className={styles.bar} />
							<div className={styles.bar} />
						</div>
					</div>
				</div>
				<div className={styles.progressiveBlur}>
					<div />
					<div />
					<div />
					<div />
				</div>
			</div>

			<motion.article
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1, ease: "easeOut" }}
				className={`${styles.article} ${playfair.className} ${cormorant.className}`}
			>
				<motion.h2
					className="font-playfair text-6xl mb-6 font-normal tracking-tight"
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
				>
					Sunlit
				</motion.h2>
				<motion.p
					className="font-cormorant text-2xl font-normal tracking-wide leading-relaxed"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.8, delay: 0.4 }}
				>
					inspired by the beautiful works of
					<br />
					<motion.a
						href="https://daylightcomputer.com/"
						className="border-b hover:opacity-75 transition-all duration-300 ease-in-out text-base"
						whileHover={{ y: -1 }}
					>
						daylight computer
					</motion.a>
					,{" "}
					<motion.a
						href="https://www.chloeyan.me/"
						className="border-b hover:opacity-75 transition-all duration-300 ease-in-out text-base"
						whileHover={{ y: -1 }}
					>
						chloe yan
					</motion.a>
					{", "}
					<motion.a
						href="https://www.sunlit.place/"
						className="border-b hover:opacity-75 transition-all duration-300 ease-in-out text-base"
						whileHover={{ y: -1 }}
					>
						sunlit place
					</motion.a>
				</motion.p>
			</motion.article>
		</div>
	);
};

export default Sunlit;
