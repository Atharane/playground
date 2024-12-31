"use server";

import { after } from "next/server";
import { nanoid } from "nanoid";

import { sleep } from "@/lib/utils";

export async function unstableAfter() {
	await sleep(2000); // simulate operational delay

	after(async () => {
		await sleep(2000);
		console.log("post processing completed");
	});

	const data = nanoid();
	console.log({ data });
	return data;
}
