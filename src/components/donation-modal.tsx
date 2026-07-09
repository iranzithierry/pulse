"use client";

import { Bitcoin, Check, Copy, Heart, ShieldCheck, X, Zap } from "lucide-react";
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
	accent: string;
	glow: string;
	logo: React.ReactNode;
	qrColor: string;
};

const ASSETS: CryptoAsset[] = [
	{
		id: "btc",
		name: "Bitcoin",
		ticker: "BTC",
		network: "Bitcoin Network",
		address: "bc1qcx056sfht77gmp6uzvcx34e3ewqka04kyjrl2m",
		accent: "from-amber-400 to-orange-500",
		glow: "shadow-[0_0_40px_-8px_rgba(251,146,60,0.55)]",
		logo: <Bitcoin className="size-5" />,
		qrColor: "#f59e0b",
	},
	{
		id: "usdt",
		name: "Tether USD",
		ticker: "USDT",
		network: "Ethereum (ERC-20)",
		address: "0x460eBF24894C2Afb592984b0bBCF0482f04e96cA",
		accent: "from-emerald-400 to-teal-500",
		glow: "shadow-[0_0_40px_-8px_rgba(16,185,129,0.55)]",
		logo: <UsdtGlyph />,
		qrColor: "#10b981",
	},
];

function UsdtGlyph() {
	return (
		<svg
			viewBox="0 0 24 24"
			className="size-5"
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
		closeTimerRef.current = setTimeout(() => setIsVisible(false), 220);
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
		>
			<button
				type="button"
				aria-label="Close donation dialog"
				onClick={onClose}
				className={`absolute inset-0 cursor-default bg-black/70 backdrop-blur-md transition-opacity duration-200 ease-out ${
					isEntering ? "opacity-100" : "opacity-0"
				}`}
			/>

			<div
				className={`relative flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col transition-all duration-300 ease-out sm:max-h-[calc(100dvh-3rem)] ${
					isEntering
						? "translate-y-0 scale-100 opacity-100"
						: "translate-y-4 scale-95 opacity-0"
				}`}
			>
				<div
					aria-hidden
					className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-amber-400 via-fuchsia-500 to-emerald-400 opacity-70 blur-[6px]"
				/>
				<div
					aria-hidden
					className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-amber-400 via-fuchsia-500 to-emerald-400 opacity-90"
				/>

				<div className="relative flex min-h-0 flex-col overflow-hidden rounded-2xl bg-zinc-950 text-zinc-100">
					<div
						aria-hidden
						className="pointer-events-none absolute inset-0 opacity-[0.12]"
						style={{
							backgroundImage:
								"radial-gradient(circle at 20% 0%, #f59e0b 0%, transparent 40%), radial-gradient(circle at 80% 100%, #10b981 0%, transparent 45%), radial-gradient(circle at 100% 0%, #a855f7 0%, transparent 50%)",
						}}
					/>
					<div
						aria-hidden
						className="pointer-events-none absolute inset-0 opacity-[0.06]"
						style={{
							backgroundImage:
								"linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
							backgroundSize: "28px 28px",
						}}
					/>

					<button
						type="button"
						onClick={onClose}
						aria-label="Close"
						className="absolute right-3 top-3 z-10 inline-flex size-8 items-center justify-center rounded-full bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
					>
						<X className="size-4" />
					</button>

					<div className="relative min-h-0 flex-1 overflow-y-auto">
						<div className="px-6 pt-7 sm:px-7">
						<div className="mb-5 flex items-center gap-3">
							<div className="relative">
								<span
									aria-hidden
									className="absolute inset-0 -m-2 animate-ping rounded-full bg-rose-500/25"
								/>
								<span className="relative inline-flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-fuchsia-600 shadow-[0_0_28px_-6px_rgba(244,63,94,0.7)]">
									<Heart className="size-5 fill-white text-white" />
								</span>
							</div>
							<div>
								<h2
									id="donation-modal-title"
									className="text-lg font-semibold tracking-tight text-white"
								>
									Keep the streams alive
								</h2>
								<p className="text-xs text-zinc-400">
									Zero ads. 24/7 servers. Powered by you.
								</p>
							</div>
						</div>

						<p className="text-sm leading-relaxed text-zinc-300">
							We work hard to bring you smooth, ad-free live matches. Our
							servers stream around the clock so you never miss a moment — that
							costs real money to keep online.
						</p>
						<p className="mt-2 text-sm leading-relaxed text-zinc-300">
							If Pulse helped you today, chip in a{" "}
							<span className="font-semibold text-white">dollar</span> — even a
							few <span className="font-semibold text-white">cents</span> in
							crypto keeps us going.
						</p>

						<div className="mt-5 flex flex-wrap gap-2">
							<Pill icon={<ShieldCheck className="size-3" />} label="No ads" />
							<Pill icon={<Zap className="size-3" />} label="Always on" />
							<Pill icon={<Heart className="size-3" />} label="Community funded" />
						</div>
						</div>

						<div className="space-y-3 px-6 pb-6 pt-5 sm:px-7">
							{ASSETS.map((asset) => (
								<CryptoCard key={asset.id} asset={asset} />
							))}
						</div>
					</div>

					<div className="relative flex items-center justify-between border-t border-white/5 bg-white/[0.02] px-6 py-3 sm:px-7">
						<p className="text-[11px] text-zinc-500">
							Send only {ASSETS.map((a) => a.ticker).join(" or ")} to the
							matching address.
						</p>
						<button
							type="button"
							onClick={onClose}
							className="text-xs font-medium text-zinc-400 transition hover:text-white"
						>
							Maybe later
						</button>
					</div>
				</div>
			</div>
		</div>,
		document.body,
	);
}

function Pill({
	icon,
	label,
}: {
	icon: React.ReactNode;
	label: string;
}) {
	return (
		<span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-zinc-300">
			<span className="text-zinc-400">{icon}</span>
			{label}
		</span>
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
		<div
			className={`group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-4 transition-all duration-300 hover:border-white/20 hover:from-white/[0.06] ${asset.glow}`}
		>
			<div
				aria-hidden
				className={`pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-gradient-to-br ${asset.accent} opacity-10 blur-2xl transition-opacity duration-500 group-hover:opacity-20`}
			/>

			<div className="flex items-start gap-3">
				<span
					className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${asset.accent} text-white shadow-inner`}
				>
					{asset.logo}
				</span>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<h3 className="text-sm font-semibold text-white">{asset.name}</h3>
						<span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-300">
							{asset.ticker}
						</span>
					</div>
					<p className="text-[11px] text-zinc-500">{asset.network}</p>
				</div>

				<div className="hidden shrink-0 rounded-md border border-white/10 bg-white p-1.5 sm:block">
					<QRCodeSVG
						value={asset.address}
						size={64}
						bgColor="#ffffff"
						fgColor="#0a0a0a"
						level="M"
						marginSize={0}
					/>
				</div>
			</div>

			<div className="mt-3 flex items-center gap-2">
				<code className="min-w-0 flex-1 truncate rounded-md border border-white/5 bg-black/40 px-2.5 py-2 font-mono text-[11px] text-zinc-300">
					{asset.address}
				</code>
				<button
					type="button"
					onClick={handleCopy}
					aria-label={`Copy ${asset.ticker} address`}
					className={`relative inline-flex shrink-0 items-center gap-1.5 overflow-hidden rounded-md border px-2.5 py-2 text-xs font-medium transition-all duration-200 ${
						copied
							? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
							: "border-white/10 bg-white/5 text-zinc-200 hover:border-white/20 hover:bg-white/10"
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

			<div className="mt-2 flex items-center justify-center sm:hidden">
				<div className="rounded-md border border-white/10 bg-white p-2">
					<QRCodeSVG
						value={asset.address}
						size={112}
						bgColor="#ffffff"
						fgColor="#0a0a0a"
						level="M"
						marginSize={0}
					/>
				</div>
			</div>
		</div>
	);
}
