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
			className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-transparent hover:text-white hover:shadow-md sm:gap-2 sm:px-3.5 sm:py-2 sm:text-sm"
		>
			<span
				aria-hidden
				className="absolute inset-0 -z-10 bg-gradient-to-r from-amber-400 via-rose-500 to-fuchsia-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
			/>
			<span
				aria-hidden
				className="absolute inset-0 -z-10 bg-gradient-to-r from-amber-400 via-rose-500 to-fuchsia-500 opacity-20 blur-md transition-opacity duration-300 group-hover:opacity-60"
			/>
			<Heart className="size-3.5 shrink-0 fill-rose-500 text-rose-500 transition-transform duration-300 group-hover:scale-110 group-hover:fill-white group-hover:text-white sm:size-4" />
			<span>Donate</span>
		</button>
	);
}
