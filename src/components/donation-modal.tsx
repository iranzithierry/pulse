"use client";

import { Bitcoin, Check, Copy, Heart, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type DonationModalProps = {
	open: boolean;
	onClose: () => void;
};

type CryptoAsset = {
	id: "btc" | "usdt";
	name: string;
	ticker: string;
	network: string;
	address: string;
	iconBg: string;
	iconColor: string;
	logo: React.ReactNode;
};

const ASSETS: CryptoAsset[] = [
	{
		id: "btc",
		name: "Bitcoin",
		ticker: "BTC",
		network: "Bitcoin Network",
		address: "bc1qcx056sfht77gmp6uzvcx34e3ewqka04kyjrl2m",
		iconBg: "bg-amber-50",
		iconColor: "text-amber-600",
		logo: <Bitcoin className="size-4" />,
	},
	{
		id: "usdt",
		name: "Tether USD",
		ticker: "USDT",
		network: "Ethereum (ERC-20)",
		address: "0x460eBF24894C2Afb592984b0bBCF0482f04e96cA",
		iconBg: "bg-emerald-50",
		iconColor: "text-emerald-600",
		logo: <UsdtGlyph />,
	},
];

function UsdtGlyph() {
	return (
		<svg
			viewBox="0 0 24 24"
			className="size-4"
			fill="currentColor"
			aria-hidden
		>
			<path d="M13.5 10.6V8.6h4.6V5.5H5.9v3.1h4.6v2.0c-3.6.2-6.4.9-6.4 1.8s2.7 1.6 6.4 1.8v6.3h3v-6.3c3.6-.2 6.4-.9 6.4-1.8s-2.7-1.6-6.4-1.8zm0 3.1v0c-.1 0-.6.1-1.6.1-.8 0-1.4 0-1.5-.1v0c-3.1-.1-5.4-.7-5.4-1.3s2.3-1.2 5.4-1.3v2.1c.2 0 .8.1 1.5.1 1 0 1.5 0 1.6-.1v-2.1c3.1.1 5.4.7 5.4 1.3s-2.3 1.2-5.4 1.3z" />
		</svg>
	);
}

export function DonationModal({ open, onClose }: DonationModalProps) {
	const [mounted, setMounted] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [isEntering, setIsEntering] = useState(false);
	const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (open) {
			if (closeTimerRef.current) {
				clearTimeout(closeTimerRef.current);
				closeTimerRef.current = null;
			}
			setIsVisible(true);
			const raf = requestAnimationFrame(() => setIsEntering(true));
			return () => cancelAnimationFrame(raf);
		}
		setIsEntering(false);
		closeTimerRef.current = setTimeout(() => setIsVisible(false), 180);
		return () => {
			if (closeTimerRef.current) {
				clearTimeout(closeTimerRef.current);
				closeTimerRef.current = null;
			}
		};
	}, [open]);

	useEffect(() => {
		if (!open) return;
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handleKeyDown);
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = previousOverflow;
		};
	}, [open, onClose]);

	if (!mounted || !isVisible) return null;

	return createPortal(
		<div
			className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
			role="dialog"
			aria-modal="true"
			aria-labelledby="donation-modal-title"
			aria-describedby="donation-modal-description"
		>
			<button
				type="button"
				aria-label="Close donation dialog"
				onClick={onClose}
				className={`absolute inset-0 cursor-default bg-black/50 transition-opacity duration-150 ease-out ${
					isEntering ? "opacity-100" : "opacity-0"
				}`}
			/>

			<div
				className={`relative flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white text-zinc-900 shadow-lg transition-all duration-200 ease-out sm:max-h-[calc(100dvh-3rem)] ${
					isEntering
						? "translate-y-0 scale-100 opacity-100"
						: "translate-y-2 scale-[0.98] opacity-0"
				}`}
			>
				<button
					type="button"
					onClick={onClose}
					aria-label="Close"
					className="absolute right-3 top-3 z-10 inline-flex size-7 items-center justify-center rounded-md text-zinc-500 opacity-70 transition-opacity hover:bg-zinc-100 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
				>
					<X className="size-4" />
				</button>

				<div className="min-h-0 flex-1 overflow-y-auto">
					<div className="flex flex-col gap-1.5 px-6 pb-4 pt-6 text-left">
						<div className="flex items-center gap-2">
							<span className="inline-flex size-8 items-center justify-center rounded-full bg-rose-50 text-rose-600">
								<Heart className="size-4" />
							</span>
							<h2
								id="donation-modal-title"
								className="text-lg font-semibold leading-none tracking-tight"
							>
								Support Pulse
							</h2>
						</div>
						<p
							id="donation-modal-description"
							className="text-sm text-zinc-500"
						>
							Zero ads. 24/7 servers. Powered by you.
						</p>
					</div>

					<div className="space-y-4 px-6 pb-6">
						<div className="space-y-2 text-sm leading-relaxed text-zinc-600">
							<p>
								We work hard to bring you smooth, ad-free live matches. Our
								servers stream around the clock so you never miss a moment —
								that costs real money to keep online.
							</p>
							<p>
								If Pulse helped you today, chip in a{" "}
								<span className="font-medium text-zinc-900">dollar</span> — even
								a few <span className="font-medium text-zinc-900">cents</span>{" "}
								in crypto keeps us going.
							</p>
						</div>

						<div className="space-y-3">
							{ASSETS.map((asset) => (
								<CryptoCard key={asset.id} asset={asset} />
							))}
						</div>
					</div>
				</div>

				<div className="flex items-center justify-between gap-3 border-t border-zinc-200 bg-zinc-50 px-6 py-3">
					<p className="text-xs text-zinc-500">
						Send only {ASSETS.map((a) => a.ticker).join(" or ")} to the matching
						address.
					</p>
					<button
						type="button"
						onClick={onClose}
						className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-zinc-600 transition-colors hover:text-zinc-900"
					>
						Close
					</button>
				</div>
			</div>
		</div>,
		document.body,
	);
}

function CryptoCard({ asset }: { asset: CryptoAsset }) {
	const [copied, setCopied] = useState(false);
	const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
		};
	}, []);

	const handleCopy = useCallback(async () => {
		let ok = false;
		try {
			if (navigator?.clipboard?.writeText) {
				await navigator.clipboard.writeText(asset.address);
				ok = true;
			}
		} catch {
			ok = false;
		}
		if (!ok) {
			try {
				const textarea = document.createElement("textarea");
				textarea.value = asset.address;
				textarea.setAttribute("readonly", "");
				textarea.style.position = "absolute";
				textarea.style.left = "-9999px";
				document.body.appendChild(textarea);
				textarea.select();
				ok = document.execCommand("copy");
				document.body.removeChild(textarea);
			} catch {
				ok = false;
			}
		}
		if (!ok) return;
		setCopied(true);
		if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
		copyTimerRef.current = setTimeout(() => setCopied(false), 1800);
	}, [asset.address]);

	return (
		<div className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:bg-zinc-50">
			<div className="flex items-start gap-3">
				<span
					className={`inline-flex size-9 shrink-0 items-center justify-center rounded-md ${asset.iconBg} ${asset.iconColor}`}
				>
					{asset.logo}
				</span>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<h3 className="text-sm font-semibold text-zinc-900">
							{asset.name}
						</h3>
						<span className="rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
							{asset.ticker}
						</span>
					</div>
					<p className="text-xs text-zinc-500">{asset.network}</p>
				</div>
				<div className="hidden shrink-0 rounded-md border border-zinc-200 bg-white p-1.5 sm:block">
					<QRCodeSVG
						value={asset.address}
						size={56}
						bgColor="#ffffff"
						fgColor="#18181b"
						level="M"
						marginSize={0}
					/>
				</div>
			</div>

			<div className="mt-3 flex items-center gap-2">
				<code className="min-w-0 flex-1 truncate rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-2 font-mono text-[11px] text-zinc-700">
					{asset.address}
				</code>
				<button
					type="button"
					onClick={handleCopy}
					aria-label={`Copy ${asset.ticker} address`}
					className={`relative inline-flex shrink-0 items-center gap-1.5 overflow-hidden rounded-md border px-2.5 py-2 text-xs font-medium transition-colors ${
						copied
							? "border-emerald-200 bg-emerald-50 text-emerald-700"
							: "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
					}`}
				>
					<span
						className={`inline-flex items-center gap-1.5 transition-all duration-200 ${
							copied ? "-translate-y-5 opacity-0" : "translate-y-0 opacity-100"
						}`}
					>
						<Copy className="size-3.5" />
						Copy
					</span>
					<span
						aria-hidden
						className={`absolute inset-0 inline-flex items-center justify-center gap-1.5 transition-all duration-200 ${
							copied ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
						}`}
					>
						<Check className="size-3.5" />
						Copied
					</span>
				</button>
			</div>

			<div className="mt-3 flex items-center justify-center sm:hidden">
				<div className="rounded-md border border-zinc-200 bg-white p-2">
					<QRCodeSVG
						value={asset.address}
						size={112}
						bgColor="#ffffff"
						fgColor="#18181b"
						level="M"
						marginSize={0}
					/>
				</div>
			</div>
		</div>
	);
}
