"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "pulse:donation-open-count";
export const DONATION_PROMPT_EVERY = 4;

function readCount(): number {
	if (typeof window === "undefined") return 0;
	const raw = window.localStorage.getItem(STORAGE_KEY);
	if (raw === null) return 0;
	const parsed = Number.parseInt(raw, 10);
	return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function writeCount(next: number) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(STORAGE_KEY, String(next));
}

export type DonationPrompt = {
	open: boolean;
	openManually: () => void;
	close: () => void;
	registerServerOpen: () => void;
};

export function useDonationPrompt(): DonationPrompt {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined") return;
		if (window.localStorage.getItem(STORAGE_KEY) === null) {
			// Seed so the very first server open triggers the popup;
			// after that it resets and reappears every DONATION_PROMPT_EVERY opens.
			writeCount(DONATION_PROMPT_EVERY - 1);
		}
	}, []);

	const openManually = useCallback(() => {
		setOpen(true);
	}, []);

	const close = useCallback(() => {
		setOpen(false);
	}, []);

	const registerServerOpen = useCallback(() => {
		const next = readCount() + 1;
		if (next >= DONATION_PROMPT_EVERY) {
			writeCount(0);
			setOpen(true);
		} else {
			writeCount(next);
		}
	}, []);

	return { open, openManually, close, registerServerOpen };
}
