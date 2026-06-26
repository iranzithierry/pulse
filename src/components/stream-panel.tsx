"use client";

import {
	ArrowLeft,
	ExternalLink,
	LoaderCircle,
	MonitorPlay,
	Server,
} from "lucide-react";
import type { StreamEvent, StreamServer } from "@/lib/types";

type StreamPanelProps = {
	event: StreamEvent | null;
	servers: StreamServer[];
	loading: boolean;
	error: string | null;
	onBack: () => void;
};

export function StreamPanel({
	event,
	servers,
	loading,
	error,
	onBack,
}: StreamPanelProps) {
	if (!event) {
		return (
			<section className="flex h-full flex-col items-center justify-center border border-zinc-200 bg-zinc-50 px-6 text-center">
				<MonitorPlay className="mb-3 size-10 text-zinc-300" />
				<h2 className="text-sm font-semibold text-zinc-900">Select a match</h2>
				<p className="mt-1 max-w-sm text-sm text-zinc-500">
					Choose an event from the list to load available stream servers.
				</p>
			</section>
		);
	}

	return (
		<section className="flex h-full flex-col border border-zinc-200 bg-white">
			<div className="border-b border-zinc-200 px-4 py-3">
				<button
					type="button"
					onClick={onBack}
					className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition hover:text-zinc-900"
				>
					<ArrowLeft className="size-3.5" />
					Back to events
				</button>
				<h2 className="text-base font-semibold text-zinc-900">{event.name}</h2>
				<p className="mt-0.5 text-xs text-zinc-500">{event.category}</p>
			</div>

			<div className="min-h-0 flex-1 overflow-y-auto p-4">
				{loading ? (
					<div className="flex items-center justify-center gap-2 py-16 text-sm text-zinc-500">
						<LoaderCircle className="size-4 animate-spin" />
						Loading servers...
					</div>
				) : error ? (
					<div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
						{error}
					</div>
				) : servers.length === 0 ? (
					<div className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
						No stream servers found for this event.
					</div>
				) : (
					<div className="space-y-2">
						<p className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
							Available servers
						</p>
						{servers.map((server) => (
							<a
								target="_blank"
								href={server.embedUrl}
								key={server.id}
								className="flex w-full items-center justify-between rounded-md border border-zinc-200 px-4 py-3 text-left transition hover:border-zinc-400 hover:bg-zinc-50"
							>
								<div className="flex items-center gap-3">
									<span className="flex size-8 items-center justify-center rounded-md bg-zinc-100 text-zinc-600">
										<Server className="size-4" />
									</span>
									<div>
										<p className="text-sm font-medium text-zinc-900">
											{server.label}
										</p>
										<p className="text-xs text-zinc-500">ID {server.id}</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									{server.isActive ? (
										<span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
											Active
										</span>
									) : null}
									<ExternalLink className="size-4 text-zinc-400" />
								</div>
							</a>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
