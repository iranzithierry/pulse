"use client";

import { Heart } from "lucide-react";

type DonationButtonProps = {
	onClick: () => void;
};

export function DonationButton({ onClick }: DonationButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label="Support Pulse with a crypto donation"
			className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50 sm:text-sm"
		>
			<Heart className="size-3.5 text-zinc-700 sm:size-4" />
			<span>Donate</span>
		</button>
	);
}
