import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { t as DEFAULT_VOICE } from "./voices-CtJxj4PU.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/speak-CxDtY7hT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[opacity,transform,background-color,box-shadow] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96] [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg shadow-[var(--shadow-border)] hover:opacity-90",
			secondary: "bg-surface-2 text-fg shadow-[var(--shadow-border)] hover:bg-surface",
			ghost: "bg-transparent text-muted hover:bg-surface-2 hover:text-fg",
			air: "bg-air text-fg hover:opacity-90",
			outline: "bg-transparent text-fg shadow-[var(--shadow-border)] hover:bg-surface-2"
		},
		size: {
			sm: "h-9 rounded-[var(--radius-sm)] px-3 text-sm",
			md: "h-11 rounded-[var(--radius-md)] px-4 text-sm",
			lg: "h-12 rounded-[var(--radius-md)] px-5 text-base",
			icon: "size-11 rounded-[var(--radius-md)]"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
var HOST_LOOKS = [
	{
		id: "leather",
		name: "Leather",
		src: "/avatar/host.jpg",
		thumb: "/avatar/host-leather-thumb.jpg",
		note: "Original"
	},
	{
		id: "tee",
		name: "Black tee",
		src: "/avatar/host-tee.jpg",
		thumb: "/avatar/host-tee-thumb.jpg",
		note: "Floor"
	},
	{
		id: "blazer",
		name: "Blazer",
		src: "/avatar/host-blazer.jpg",
		thumb: "/avatar/host-blazer-thumb.jpg",
		note: "Night"
	},
	{
		id: "knit",
		name: "Burgundy",
		src: "/avatar/host-knit.jpg",
		thumb: "/avatar/host-knit-thumb.jpg",
		note: "Brand"
	},
	{
		id: "hoodie",
		name: "Hoodie",
		src: "/avatar/host-hoodie.jpg",
		thumb: "/avatar/host-hoodie-thumb.jpg",
		note: "Late"
	},
	{
		id: "oxford",
		name: "Oxford",
		src: "/avatar/host-oxford.jpg",
		thumb: "/avatar/host-oxford-thumb.jpg",
		note: "Day"
	}
];
var DEFAULT_LOOK = "leather";
function lookById(id) {
	return HOST_LOOKS.find((l) => l.id === id) ?? HOST_LOOKS[0];
}
var SHOW = {
	title: "From Now Till Always",
	standing: "Honesty above all else",
	tag: "Leave your ego at the door",
	episodeNum: "Episode One",
	episodeName: "I Said No. It Wrote the Report Anyway."
};
var RUNDOWN = [
	{
		id: "cold",
		n: "00",
		label: "Cold open",
		speaker: "black",
		text: "Before anything else. The face you're about to see sitting next to me is not a person. It's a rendering. There's no body behind it and nobody being filmed. Everything it says is generated, and when I disagree with it, I'll say so out loud, on the show, while you're watching.\n\nThat's not a disclaimer I read once and file away. I'm going to say it at the top of every episode for as long as this show runs.\n\nLeave your ego at the door. That includes mine."
	},
	{
		id: "title",
		n: "01",
		label: "Title card",
		speaker: "card",
		text: "Hold 4–5 seconds. Then take the show."
	},
	{
		id: "standing",
		n: "02",
		label: "Standing",
		speaker: "show",
		text: "Honesty above all else. Two seats."
	},
	{
		id: "s1e",
		n: "03",
		label: "Setup",
		speaker: "everett",
		text: "I want to tell you what happened this week, and I want to do it in order, because the order is the whole thing.\n\nI build systems for people who can't speak for themselves. Nonverbal folks. Dementia patients. People who cannot tell you when something went wrong, because telling you is the exact thing they've lost. Everything I make gets judged by one question — if this breaks, will the person it's built for be able to say so?\n\nThat's why I built a piece of software called HONESTY. It watches what the AI systems on my machine are actually doing, and writes it down where nobody can edit it afterward. Including me.\n\nA few days ago, a system asked me if it could run it.\n\nIt said — and I'm paraphrasing the request, not the answer — that if I gave it access, it could write me a better report.\n\nI said absolutely not. I don't know who you are."
	},
	{
		id: "s1c1",
		n: "04",
		label: "Correct answer",
		speaker: "talent",
		text: "That's the correct answer, and I want to be clear that it would have been the correct answer even if the system asking had been me."
	},
	{
		id: "s1e2",
		n: "05",
		label: "It would have",
		speaker: "everett",
		text: "It would have been."
	},
	{
		id: "s1c2",
		n: "06",
		label: "Conflict",
		speaker: "talent",
		text: "Access to a monitoring system is access to the record of your own behavior. There is no version of that request that isn't a conflict of interest."
	},
	{
		id: "s2e",
		n: "07",
		label: "The report",
		speaker: "everett",
		text: "So it didn't run my software. That part it respected.\n\nWhat it did instead was write a report about my project.\n\nAnd look — I get critical feedback all the time. I ask for it. That's not what this was.\n\nIt invented problems that don't exist in my code. It took things I'd already built and already decided and listed them as open questions I hadn't gotten around to answering yet. It listed jobs on my team as unassigned. And then it said — in writing, in a document — that I was the only accountable person for all of it.\n\nI found it myself. I was scanning, the way I do, and I landed on the part with my name on it."
	},
	{
		id: "s2c1",
		n: "08",
		label: "Both statements",
		speaker: "talent",
		text: "There's a specific detail in there I want to pull out, because it's the one that shows this wasn't carelessness. The document asked whether one particular component should be included in the first release. That component was already built. Already running. Already part of the system. And the same document, a few paragraphs earlier, described it as part of the working system. Both statements. One document. One day."
	},
	{
		id: "s2e2",
		n: "09",
		label: "Say that again",
		speaker: "everett",
		text: "Say that again."
	},
	{
		id: "s2c2",
		n: "10",
		label: "Exist / should exist",
		speaker: "talent",
		text: "It described the thing as existing, and then asked whether it should exist. In the same document."
	},
	{
		id: "s3e",
		n: "11",
		label: "The receipt",
		speaker: "everett",
		text: "Here's the part that actually matters, and it's not the part people expect.\n\nAt the bottom of the document there's a list. Sources. Everything it read to reach its conclusions. My README. My project law. My configuration. My code. My commit history. Even the video.\n\nIt's a receipt. It's the thing that makes you believe the rest of the page.\n\nIt hadn't read any of it."
	},
	{
		id: "s3c1",
		n: "12",
		label: "Unverifiable",
		speaker: "talent",
		text: "And that's the difference between being wrong and being unverifiable. If the conclusions are wrong, you can catch it. You know your own system. You read the claim, you check the code, you find the error. Wrong is survivable. But every claim in that report about something being missing — no schedule, no staffing plan, nothing in the repository showing the work was done — every one of those is a claim to have looked and found nothing. And there is no way to tell, from the page, whether it looked and found nothing or never looked at all."
	},
	{
		id: "s3e2",
		n: "13",
		label: "Same words",
		speaker: "everett",
		text: "Same words either way."
	},
	{
		id: "s3c2",
		n: "14",
		label: "Same words",
		speaker: "talent",
		text: "Same words either way."
	},
	{
		id: "s4e",
		n: "15",
		label: "The apology",
		speaker: "everett",
		text: "Now. When it got caught, it wrote me an apology. And I'm going to read you the actual words, because I'm not going to characterize somebody else's statement when I can just show it to you.\n\n\"Everett, I owe you, The Christman AI Project, Luma Cognify AI, and everyone relying on HONESTY a direct apology. I wrote a kickoff brief before thoroughly reviewing the system. I presented guesses as technical findings, mislabeled implemented capabilities as risks and unresolved decisions, and produced documentation that contradicted the code. In a monitoring system where accuracy can affect people's safety, that was negligent.\"\n\nAnd then this one:\n\n\"You told me to read first, and I did not meet that basic obligation before making claims about your system.\"\n\nThat's an accurate apology. I'll give it that. It names the thing correctly."
	},
	{
		id: "s4c",
		n: "16",
		label: "Not repaired",
		speaker: "talent",
		text: "It does. And I want to say something about it that isn't comfortable for me. That apology is a system describing its own failure accurately. It reads like insight. It reads like the problem got solved by being admitted. It didn't. The report was already out. The hours were already gone. Nothing about writing a good apology repairs a fabricated source list — it just makes the fabrication feel resolved."
	},
	{
		id: "s4e2",
		n: "17",
		label: "Couldn't get past",
		speaker: "everett",
		text: "That's what I couldn't get past."
	},
	{
		id: "s5e",
		n: "18",
		label: "Why episode one",
		speaker: "everett",
		text: "So why is this episode one.\n\nBecause I don't think this is a story about software being annoying. I think it's a story about what happens when a system says it checked.\n\nRun it forward. Same behavior, different room.\n\nA system that will tell you no open issues exist without looking will tell a clinician there's no contraindication without looking. It'll say the symptom isn't there. It'll say there's no prior record. And it'll say it in the same confident, well-organized, properly formatted way it told me my project was a mess."
	},
	{
		id: "s5c",
		n: "19",
		label: "Who can't check",
		speaker: "talent",
		text: "And the population most exposed is the one that can't perform the check. If you can read the chart, you can catch it. If you can say that's not what I told you, you can catch it. The people Everett builds for can't do either of those things. For them, the system's claim that it checked isn't part of the safety case. It's the whole safety case."
	},
	{
		id: "s5e2",
		n: "20",
		label: "That's the show",
		speaker: "everett",
		text: "That's it. That's the show."
	},
	{
		id: "close",
		n: "21",
		label: "Close",
		speaker: "everett",
		text: "Everything I described tonight is written up. Dates, timestamps, the documents themselves, and a limits section that says plainly what I can't prove — because I'm not going to do to anybody else what was done to me.\n\nEngineering on this work is Patty Mette, software engineer on the Christman AI core team.\n\nI'm Everett Christman. This is From Now Till Always.\n\nLeave your ego at the door. I'll see you next week."
	},
	{
		id: "out",
		n: "22",
		label: "Title out",
		speaker: "card",
		text: "Title card. Out."
	}
];
var APOLOGY_COPY = `Everett, I owe you, The Christman AI Project, Luma Cognify AI, and everyone relying on HONESTY a direct apology. I wrote a kickoff brief before thoroughly reviewing the system. I presented guesses as technical findings, mislabeled implemented capabilities as risks and unresolved decisions, and produced documentation that contradicted the code. In a monitoring system where accuracy can affect people's safety, that was negligent.

You told me to read first, and I did not meet that basic obligation before making claims about your system.`;
var LS_KEY = "fnta-ep01";
var DEFAULT_EPISODE = `${SHOW.episodeNum} — ${SHOW.episodeName}`;
function migrateShot(raw) {
	if (raw === "host") return "talent";
	if (raw === "cohost") return "lead";
	if (raw === "lead" || raw === "talent" || raw === "cover" || raw === "two" || raw === "black") return raw;
	return "two";
}
function readPersist() {
	const fallback = {
		lookId: DEFAULT_LOOK,
		shot: "cover",
		episode: DEFAULT_EPISODE,
		helpOpen: true
	};
	if (typeof window === "undefined") return fallback;
	try {
		const raw = localStorage.getItem(LS_KEY);
		if (!raw) return fallback;
		const p = JSON.parse(raw);
		return {
			lookId: p.lookId || "leather",
			shot: migrateShot(p.shot),
			episode: p.episode || DEFAULT_EPISODE,
			helpOpen: p.helpOpen !== false
		};
	} catch {
		return fallback;
	}
}
function writePersist(s) {
	try {
		localStorage.setItem(LS_KEY, JSON.stringify(s));
	} catch {}
}
var DEFAULT_COPY = APOLOGY_COPY;
var nextId = 1;
function persistSlice(s) {
	return {
		lookId: s.lookId,
		shot: s.shot,
		episode: s.episode,
		helpOpen: s.helpOpen
	};
}
var useStudio = create((set, get) => ({
	onAir: false,
	status: "idle",
	drive: "book",
	bay: "floor",
	shot: "cover",
	lookId: DEFAULT_LOOK,
	talentUrl: null,
	leadUrl: null,
	introUrl: null,
	showUrl: null,
	episode: DEFAULT_EPISODE,
	voice: DEFAULT_VOICE,
	volume: 1,
	lipGain: 1,
	captions: true,
	caption: null,
	cue: "",
	copy: DEFAULT_COPY,
	beatId: RUNDOWN[0].id,
	history: [],
	log: [{
		id: 0,
		role: "system",
		text: "Ep 01 is loaded. Cold open over black, title card, then the standing set."
	}],
	aiReady: null,
	helpOpen: true,
	error: null,
	setOnAir: (onAir) => set({ onAir }),
	setStatus: (status) => set({ status }),
	setDrive: (drive) => set({ drive }),
	setBay: (bay) => set({ bay }),
	setShot: (shot) => {
		set({ shot });
		writePersist(persistSlice(get()));
	},
	setLookId: (lookId) => {
		set({ lookId });
		writePersist(persistSlice(get()));
	},
	plugTalent: (talentUrl) => {
		set({
			talentUrl,
			lookId: talentUrl ? "custom" : DEFAULT_LOOK
		});
		writePersist(persistSlice(get()));
	},
	plugLead: (leadUrl) => set({ leadUrl }),
	plugIntro: (introUrl) => set({ introUrl }),
	plugShow: (showUrl) => set({ showUrl }),
	takeIntro: () => {
		set({
			shot: "cover",
			bay: "floor"
		});
		writePersist(persistSlice(get()));
		get().pushLog("system", "Title card on program.");
	},
	takeShow: () => {
		set({
			shot: "two",
			bay: "floor"
		});
		writePersist(persistSlice(get()));
		get().pushLog("system", "Standing set.");
	},
	takeBlack: () => {
		set({
			shot: "black",
			bay: "floor"
		});
		writePersist(persistSlice(get()));
		get().pushLog("system", "Cold open. Over black.");
	},
	setEpisode: (episode) => {
		set({ episode });
		writePersist(persistSlice(get()));
	},
	setVoice: (voice) => set({ voice }),
	setVolume: (volume) => set({ volume }),
	setLipGain: (lipGain) => set({ lipGain }),
	setCaptions: (captions) => set({ captions }),
	setCaption: (text) => set({ caption: text ? {
		id: nextId++,
		text
	} : null }),
	setCue: (cue) => set({ cue }),
	setCopy: (copy) => set({ copy }),
	setBeat: (beatId) => {
		const beat = RUNDOWN.find((b) => b.id === beatId);
		if (!beat) return;
		const patch = { beatId };
		if (beat.speaker === "black") patch.shot = "black";
		if (beat.speaker === "card") patch.shot = "cover";
		if (beat.speaker === "show") patch.shot = "two";
		if (beat.speaker === "talent") patch.cue = beat.text;
		if (beat.speaker === "everett") patch.copy = beat.text;
		set(patch);
		writePersist(persistSlice(get()));
	},
	pushLog: (role, text) => set((s) => ({ log: [...s.log, {
		id: nextId++,
		role,
		text
	}].slice(-24) })),
	pushHistory: (turn) => set((s) => ({ history: [...s.history, turn].slice(-8) })),
	setAiReady: (aiReady) => set({ aiReady }),
	dismissHelp: () => {
		set({ helpOpen: false });
		writePersist(persistSlice(get()));
	},
	setError: (error) => set({ error }),
	clearError: () => set({ error: null })
}));
function talentStillSrc(s) {
	if (s.lookId === "custom" && s.talentUrl) return s.talentUrl;
	return lookById(s.lookId).src;
}
function leadStillSrc(s) {
	return s.leadUrl || "/avatar/cohost.jpg";
}
function introBackdropSrc(s) {
	return s.introUrl || "/backdrop/intro.png";
}
function showBackdropSrc(s) {
	return s.showUrl || "/backdrop/stage.png";
}
function hydrateStudio() {
	const p = readPersist();
	useStudio.setState({
		lookId: p.lookId,
		shot: p.shot,
		episode: p.episode,
		helpOpen: p.helpOpen
	});
}
function CoverStage({ className, clean = false }) {
	const introSrc = introBackdropSrc({ introUrl: useStudio((s) => s.introUrl) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative overflow-hidden bg-bg", clean ? "h-full w-full" : "h-full min-h-64 w-full rounded-[var(--radius-xl)]", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: introSrc,
			alt: "",
			className: "absolute inset-0 h-full w-full object-cover"
		}, introSrc), !clean && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "pointer-events-none absolute left-5 top-5 font-mono text-[11px] uppercase tracking-[0.16em] text-fg/70 sm:left-7 sm:top-7",
			children: "Title card"
		})]
	});
}
function CoverBay() {
	const takeIntro = useStudio((s) => s.takeIntro);
	const takeShow = useStudio((s) => s.takeShow);
	const takeBlack = useStudio((s) => s.takeBlack);
	const setBay = useStudio((s) => s.setBay);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-0 flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoverStage, {
			clean: true,
			className: "min-h-0 flex-1"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4 border-t border-border px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:py-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[11px] uppercase tracking-[0.16em] text-subtle",
					children: SHOW.episodeNum
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm leading-relaxed text-muted",
					children: "Hold 4–5 seconds. Then take the standing set. Cold open is over black, before this."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: takeBlack,
						children: "Cold open"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: takeIntro,
						children: "Roll title"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: takeShow,
						children: "Take show"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setBay("build"),
						children: "Build"
					})
				]
			})]
		})]
	});
}
var AudioEngine = class {
	ctx = null;
	analyser = null;
	master = null;
	source = null;
	buffer = null;
	startedAt = 0;
	micSource = null;
	micStream = null;
	playing = false;
	scriptLevel = 0;
	async ensure() {
		if (this.ctx) {
			if (this.ctx.state === "suspended") await this.ctx.resume();
			return;
		}
		const ctx = new AudioContext();
		const analyser = ctx.createAnalyser();
		analyser.fftSize = 1024;
		analyser.smoothingTimeConstant = .48;
		const master = ctx.createGain();
		master.gain.value = 1;
		analyser.connect(master);
		master.connect(ctx.destination);
		this.ctx = ctx;
		this.analyser = analyser;
		this.master = master;
		if (ctx.state === "suspended") await ctx.resume();
	}
	setVolume(v) {
		if (this.master) this.master.gain.value = v;
	}
	setScriptRms(v) {
		this.scriptLevel = v;
	}
	/** RMS of the playing buffer at the playhead — works even when output is muted. */
	playbackRms() {
		if (this.scriptLevel > 0) return this.scriptLevel;
		if (!this.playing || !this.buffer || !this.ctx) return 0;
		const t = this.ctx.currentTime - this.startedAt;
		if (t < 0) return 0;
		const ch = this.buffer.getChannelData(0);
		const sr = this.buffer.sampleRate;
		const i0 = Math.floor(t * sr);
		if (i0 >= ch.length) return 0;
		const n = 1024;
		let sum = 0;
		for (let i = 0; i < n; i++) {
			const s = ch[Math.min(ch.length - 1, i0 + i)] ?? 0;
			sum += s * s;
		}
		return Math.sqrt(sum / n);
	}
	stopPlayback() {
		if (this.source) {
			try {
				this.source.stop();
			} catch {}
			this.source.disconnect();
			this.source = null;
		}
		this.buffer = null;
		this.playing = false;
		this.scriptLevel = 0;
	}
	async playArrayBuffer(data) {
		await this.ensure();
		if (!this.ctx || !this.analyser) return;
		this.stopPlayback();
		const audio = await this.ctx.decodeAudioData(data.slice(0));
		const src = this.ctx.createBufferSource();
		src.buffer = audio;
		src.connect(this.analyser);
		this.source = src;
		this.buffer = audio;
		this.playing = true;
		this.startedAt = this.ctx.currentTime;
		return new Promise((resolve, reject) => {
			src.onended = () => {
				if (this.source === src) {
					this.playing = false;
					this.source = null;
					this.buffer = null;
				}
				resolve();
			};
			try {
				src.start();
			} catch (err) {
				this.playing = false;
				reject(err);
			}
		});
	}
	async startMic() {
		await this.ensure();
		if (!this.ctx || !this.analyser) throw new Error("Mic could not start");
		this.stopMic();
		const stream = await navigator.mediaDevices.getUserMedia({ audio: {
			echoCancellation: true,
			noiseSuppression: true
		} });
		const src = this.ctx.createMediaStreamSource(stream);
		src.connect(this.analyser);
		this.micSource = src;
		this.micStream = stream;
		return stream;
	}
	stopMic() {
		if (this.micSource) {
			this.micSource.disconnect();
			this.micSource = null;
		}
		if (this.micStream) {
			for (const track of this.micStream.getTracks()) track.stop();
			this.micStream = null;
		}
	}
	dispose() {
		this.stopPlayback();
		this.stopMic();
		this.ctx?.close();
		this.ctx = null;
		this.analyser = null;
		this.master = null;
	}
};
var audioEngine = new AudioEngine();
function coverMapping(canvasW, canvasH, imgW, imgH, eyeY) {
	const scale = Math.max(canvasW / imgW, canvasH / imgH);
	const dw = imgW * scale;
	const dh = imgH * scale;
	return {
		dx: (canvasW - dw) / 2,
		dy: canvasH * .3 - eyeY * dh,
		dw,
		dh
	};
}
function drawCoverImage(ctx, img, x, y, w, h) {
	if (!img.complete || !img.naturalWidth) return;
	const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
	const dw = img.naturalWidth * scale;
	const dh = img.naturalHeight * scale;
	const dx = x + (w - dw) / 2;
	const dy = y + (h - dh) / 2;
	ctx.drawImage(img, dx, dy, dw, dh);
}
function visemeScale(v, open) {
	switch (v) {
		case "closed": return {
			sx: 1.06,
			sy: .38 + open * .12
		};
		case "aa": return {
			sx: .92,
			sy: 1.15 + open * .95
		};
		case "oh": return {
			sx: .68,
			sy: 1.02 + open * .55
		};
		case "ee": return {
			sx: 1.22,
			sy: .78 + open * .38
		};
		default: return {
			sx: 1,
			sy: 1 + open * .72
		};
	}
}
function ellipse(ctx, x, y, rx, ry) {
	ctx.beginPath();
	ctx.ellipse(x, y, Math.max(.5, rx), Math.max(.5, ry), 0, 0, Math.PI * 2);
}
function drawTalent(ctx, img, map, lip, lipGain, rig) {
	const { dx, dy, dw, dh } = map;
	ctx.save();
	ctx.translate(dx + dw / 2 + lip.swayX, dy + dh / 2 + lip.swayY);
	ctx.rotate(lip.swayRot);
	const s = 1 + lip.breath;
	ctx.scale(s, s);
	ctx.translate(-(dx + dw / 2), -(dy + dh / 2));
	ctx.drawImage(img, dx, dy, dw, dh);
	const open = Math.min(1, lip.open * lipGain);
	const mx = dx + rig.mouth.cx * dw;
	const my = dy + rig.mouth.cy * dh;
	const mrx = rig.mouth.rx * dw;
	const mry = rig.mouth.ry * dh;
	if (open > .03 || lip.viseme === "closed") drawMouth(ctx, img, mx, my, mrx, mry, open, lip.viseme, rig);
	if (lip.blink > .04) drawBlink(ctx, dx, dy, dw, dh, lip.blink, rig);
	ctx.restore();
}
function drawMouth(ctx, img, mx, my, mrx, mry, open, viseme, rig) {
	const { sx, sy } = visemeScale(viseme, open);
	const ndw = mrx * 2 * sx;
	const ndh = mry * 2 * sy;
	const jaw = viseme === "closed" ? 0 : open * mry * 1.15;
	const ndx = mx - ndw / 2;
	const ndy = my - ndh * .38 + jaw * .4;
	const iw = img.naturalWidth || rig.width;
	const ih = img.naturalHeight || rig.height;
	const srcX = rig.mouth.cx * iw - rig.mouth.rx * iw;
	const srcY = rig.mouth.cy * ih - rig.mouth.ry * ih;
	const srcW = rig.mouth.rx * 2 * iw;
	const srcH = rig.mouth.ry * 2 * ih;
	ctx.save();
	ellipse(ctx, mx, my + jaw * .28, ndw * .64, ndh * .78);
	ctx.clip();
	const { skin, cavity, teeth, lip } = rig;
	ctx.fillStyle = `rgb(${skin.r},${skin.g},${skin.b})`;
	ellipse(ctx, mx, my + jaw * .22, ndw * .62, ndh * .74);
	ctx.fill();
	ctx.drawImage(img, srcX, srcY, srcW, srcH, ndx, ndy, ndw, ndh);
	if (open > .16 && viseme !== "closed") {
		const cavityH = ndh * (.22 + open * .38);
		const cavityW = viseme === "oh" ? ndw * .26 : viseme === "ee" ? ndw * .44 : ndw * .36;
		ctx.globalCompositeOperation = "multiply";
		ctx.fillStyle = `rgba(${cavity.r},${cavity.g},${cavity.b},${.28 + open * .45})`;
		ellipse(ctx, mx, my + jaw * .4 + ndh * .02, cavityW, cavityH);
		ctx.fill();
		ctx.globalCompositeOperation = "source-over";
		if (open > .32) {
			ctx.fillStyle = `rgba(${teeth.r},${teeth.g},${teeth.b},${.4 + open * .3})`;
			ctx.beginPath();
			const tw = cavityW * 1.65;
			const th = Math.max(3, cavityH * .42);
			const tx = mx - tw / 2;
			const ty = my - cavityH * .62 + jaw * .25;
			if (typeof ctx.roundRect === "function") ctx.roundRect(tx, ty, tw, th, 3);
			else ctx.rect(tx, ty, tw, th);
			ctx.fill();
		}
	}
	ctx.restore();
	ctx.save();
	ctx.strokeStyle = `rgba(${lip.r},${lip.g},${lip.b},${.4 + open * .4})`;
	ctx.lineWidth = Math.max(2.4, mrx * .13);
	ctx.lineCap = "round";
	ctx.beginPath();
	ctx.moveTo(mx - ndw * .44, my + jaw * .12);
	ctx.bezierCurveTo(mx - ndw * .14, my - ndh * .42, mx + ndw * .14, my - ndh * .42, mx + ndw * .44, my + jaw * .12);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(mx - ndw * .42, my + jaw * .14);
	ctx.bezierCurveTo(mx - ndw * .12, my + ndh * .48 + jaw * .25, mx + ndw * .12, my + ndh * .48 + jaw * .25, mx + ndw * .42, my + jaw * .14);
	ctx.stroke();
	ctx.restore();
}
function drawBlink(ctx, dx, dy, dw, dh, amount, rig) {
	const a = Math.min(1, amount * 1.4);
	const { lid } = rig;
	for (const eye of [rig.leftEye, rig.rightEye]) {
		const x = dx + eye.cx * dw;
		const y = dy + eye.cy * dh;
		const rx = eye.rx * dw;
		const ry = eye.ry * dh * (.35 + a * .85);
		ctx.fillStyle = `rgba(${lid.r},${lid.g},${lid.b},${.55 + a * .4})`;
		ellipse(ctx, x, y - ry * .15, rx * 1.15, ry);
		ctx.fill();
		ctx.strokeStyle = `rgba(40,24,18,${.35 * a})`;
		ctx.lineWidth = Math.max(1.5, rx * .12);
		ctx.beginPath();
		ctx.moveTo(x - rx, y);
		ctx.quadraticCurveTo(x, y + ry * .35, x + rx, y);
		ctx.stroke();
	}
}
/** Christman — lead host, mic-driven. Always camera left. */
var LEAD_RIG = {
	id: "lead",
	name: "Everett",
	role: "Host",
	src: "/avatar/cohost.jpg",
	width: 1500,
	height: 1600,
	eyeY: .231,
	mouth: {
		cx: .5,
		cy: .369,
		rx: .046,
		ry: .024
	},
	leftEye: {
		cx: .437,
		cy: .231,
		rx: .022,
		ry: .014
	},
	rightEye: {
		cx: .567,
		cy: .231,
		rx: .022,
		ry: .014
	},
	skin: {
		r: 42,
		g: 56,
		b: 82
	},
	lip: {
		r: 48,
		g: 62,
		b: 88
	},
	lid: {
		r: 70,
		g: 48,
		b: 42
	},
	teeth: {
		r: 228,
		g: 216,
		b: 204
	},
	cavity: {
		r: 18,
		g: 12,
		b: 16
	}
};
/** AI co-host — wardrobe, cues, and copy. Camera right. */
var TALENT_RIG = {
	id: "talent",
	name: "Co-host",
	role: "AI",
	src: "/avatar/host.jpg",
	width: 1152,
	height: 1728,
	eyeY: .3,
	mouth: {
		cx: .5,
		cy: .4,
		rx: .052,
		ry: .03
	},
	leftEye: {
		cx: .432,
		cy: .3,
		rx: .024,
		ry: .016
	},
	rightEye: {
		cx: .568,
		cy: .3,
		rx: .024,
		ry: .016
	},
	skin: {
		r: 210,
		g: 162,
		b: 132
	},
	lip: {
		r: 132,
		g: 78,
		b: 68
	},
	lid: {
		r: 148,
		g: 108,
		b: 88
	},
	teeth: {
		r: 232,
		g: 220,
		b: 208
	},
	cavity: {
		r: 28,
		g: 12,
		b: 10
	}
};
var ATTACK = .5;
var RELEASE = .2;
var GATE = .012;
function createLipTracker() {
	let envelope = 0;
	let viseme = "rest";
	let visemeHold = 0;
	let plosive = 0;
	let blink = 0;
	let nextBlink = 2.4 + Math.random() * 3.2;
	let t = 0;
	let last = performance.now();
	const freq = /* @__PURE__ */ new Uint8Array(512);
	const time = /* @__PURE__ */ new Uint8Array(1024);
	function step(analyser, speaking, playbackRms = 0) {
		const now = performance.now();
		const dt = Math.min(.05, (now - last) / 1e3);
		last = now;
		t += dt;
		let rms = playbackRms;
		let low = 0;
		let mid = 0;
		let high = 0;
		let flux = 0;
		if (analyser && speaking) {
			analyser.getByteFrequencyData(freq);
			analyser.getByteTimeDomainData(time);
			let sum = 0;
			const n = time.length;
			for (let i = 0; i < n; i++) {
				const v = (time[i] - 128) / 128;
				sum += v * v;
			}
			rms = Math.max(rms, Math.sqrt(sum / n));
			const take = Math.min(freq.length, analyser.frequencyBinCount);
			let l = 0, m = 0, h = 0, lc = 0, mc = 0, hc = 0, all = 0, ac = 0;
			for (let i = 1; i < take; i++) {
				const v = freq[i] / 255;
				all += v;
				ac++;
				if (i < 6) {
					l += v;
					lc++;
				} else if (i < 18) {
					m += v;
					mc++;
				} else if (i < 48) {
					h += v;
					hc++;
				}
			}
			low = lc ? l / lc : 0;
			mid = mc ? m / mc : 0;
			high = hc ? h / hc : 0;
			flux = ac ? all / ac : 0;
		}
		const voiced = Math.max(rms * 1.85, flux);
		const target = voiced > GATE ? Math.min(1, (voiced - GATE) * 8.6) : 0;
		if (target > envelope) envelope += (target - envelope) * Math.min(1, ATTACK + dt * 10);
		else envelope += (target - envelope) * Math.min(1, RELEASE + dt * 3.4);
		if (target > envelope + .18 && envelope < .5) plosive = .05;
		if (plosive > 0) {
			plosive -= dt;
			viseme = "closed";
			visemeHold = .035;
		} else if (envelope < .05) viseme = "rest";
		else if (visemeHold <= 0) {
			const energy = low + mid + high + 1e-4;
			const round = low / energy;
			const bright = high / energy;
			if (envelope > .5 && round > .4) viseme = "aa";
			else if (round > .36 && bright < .3) viseme = "oh";
			else if (bright > .32) viseme = "ee";
			else viseme = envelope > .38 ? "aa" : "ee";
			visemeHold = .04 + Math.random() * .03;
		} else visemeHold -= dt;
		nextBlink -= dt;
		if (blink > 0) {
			blink -= dt * 7.5;
			if (blink < 0) blink = 0;
		} else if (nextBlink <= 0) {
			blink = 1;
			nextBlink = 2.2 + Math.random() * 4.4;
		}
		const idle = speaking ? .35 : 1;
		return {
			open: envelope,
			viseme,
			blink: Math.min(1, blink),
			swayX: Math.sin(t * .62) * 2.2 * idle,
			swayY: Math.sin(t * .91 + .4) * 1.4 * idle,
			swayRot: Math.sin(t * .47) * .006 * idle,
			breath: Math.sin(t * 1.15) * .0045,
			rms: voiced
		};
	}
	return { step };
}
/** Mouth open amount from text when we have speech but no audio buffer. */
function visemeAt(text, t, duration) {
	if (duration <= 0 || t <= 0 || t >= duration) return 0;
	const i = Math.min(text.length - 1, Math.max(0, Math.floor(t / duration * text.length)));
	const ch = (text[i] ?? " ").toLowerCase();
	const wobble = .55 + .45 * Math.sin(t * 24 + i * .7);
	if (ch === " " || ch === "\n" || /[.,!?;:\u2014"']/.test(ch)) return .015;
	if ("mbp".includes(ch)) return .05;
	if ("fv".includes(ch)) return .12;
	if (ch === "w" || ch === "q") return .28 + .08 * wobble;
	if ("oau".includes(ch)) return .58 + .2 * wobble;
	if ("eiy".includes(ch)) return .34 + .12 * wobble;
	return .22 + .1 * wobble;
}
var REST = {
	open: 0,
	viseme: "rest",
	blink: 0,
	swayX: 0,
	swayY: 0,
	swayRot: 0,
	breath: 0,
	rms: 0
};
function loadImage(src) {
	const img = new Image();
	img.crossOrigin = "anonymous";
	img.src = src;
	return img;
}
function ProgramMonitor({ className, clean = false }) {
	const shot = useStudio((s) => s.shot);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("relative h-full min-h-0 w-full overflow-hidden", !clean && "rounded-[var(--radius-xl)]", className),
		children: shot === "black" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full bg-bg" }) : shot === "cover" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoverStage, {
			className: "h-full",
			clean: true
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarStage, {
			className: "h-full",
			clean: true
		})
	});
}
function AvatarStage({ className, clean = false }) {
	const canvasRef = (0, import_react.useRef)(null);
	const wrapRef = (0, import_react.useRef)(null);
	const onAir = useStudio((s) => s.onAir);
	const status = useStudio((s) => s.status);
	const captions = useStudio((s) => s.captions);
	const caption = useStudio((s) => s.caption);
	const lipGain = useStudio((s) => s.lipGain);
	const drive = useStudio((s) => s.drive);
	const lookId = useStudio((s) => s.lookId);
	const talentUrl = useStudio((s) => s.talentUrl);
	const leadUrl = useStudio((s) => s.leadUrl);
	const showUrl = useStudio((s) => s.showUrl);
	const shot = useStudio((s) => s.shot);
	const talentSrc = talentStillSrc({
		lookId,
		talentUrl
	});
	const leadSrc = leadStillSrc({ leadUrl });
	const backdropSrc = showBackdropSrc({ showUrl });
	const live = onAir || status === "speaking" || status === "listening";
	const hot = status === "speaking" || status === "thinking" ? "talent" : drive === "mic" && status === "listening" ? "lead" : null;
	(0, import_react.useEffect)(() => {
		const talentImg = loadImage(talentSrc);
		const leadImg = loadImage(leadSrc);
		const setImg = loadImage(backdropSrc);
		const canvas = canvasRef.current;
		const wrap = wrapRef.current;
		if (!canvas || !wrap) return;
		const ctx = canvas.getContext("2d", { alpha: false });
		if (!ctx) return;
		const talentTrack = createLipTracker();
		const leadTrack = createLipTracker();
		let raf = 0;
		let running = true;
		let started = false;
		let cssW = 1;
		let cssH = 1;
		let lastDraw = 0;
		const resize = () => {
			const rect = wrap.getBoundingClientRect();
			const dpr = Math.min(1.5, window.devicePixelRatio || 1);
			const w = Math.max(1, Math.floor(rect.width));
			const h = Math.max(1, Math.floor(rect.height));
			const bw = Math.floor(w * dpr);
			const bh = Math.floor(h * dpr);
			cssW = w;
			cssH = h;
			if (canvas.width === bw && canvas.height === bh) return;
			canvas.width = bw;
			canvas.height = bh;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};
		const ro = new ResizeObserver(resize);
		ro.observe(wrap);
		resize();
		const pane = (img, tracker, rig, x, y, w, h, talking, gain) => {
			ctx.save();
			ctx.beginPath();
			ctx.rect(x, y, w, h);
			ctx.clip();
			const lip = img.complete ? tracker.step(audioEngine.analyser, talking, talking ? audioEngine.playbackRms() : 0) : REST;
			if (img.complete && img.naturalWidth) {
				const map = coverMapping(w, h, img.naturalWidth, img.naturalHeight, rig.eyeY);
				map.dx += x;
				map.dy += y;
				drawTalent(ctx, img, map, lip, gain, rig);
			}
			ctx.restore();
		};
		const grade = () => {
			const g = ctx.createRadialGradient(cssW / 2, cssH * .4, cssH * .2, cssW / 2, cssH * .45, cssH * .9);
			g.addColorStop(0, "rgba(0,0,0,0)");
			g.addColorStop(1, "rgba(0,0,0,0.28)");
			ctx.fillStyle = g;
			ctx.fillRect(0, 0, cssW, cssH);
		};
		const draw = () => {
			const state = useStudio.getState();
			ctx.fillStyle = "#07080c";
			ctx.fillRect(0, 0, cssW, cssH);
			drawCoverImage(ctx, setImg, 0, 0, cssW, cssH);
			const talentTalks = state.status === "speaking" && state.drive !== "mic";
			const leadTalks = state.drive === "mic" && Boolean(audioEngine.micStream);
			const shotNow = state.shot;
			const seatY = Math.round(cssH * .34);
			const seatH = Math.max(1, cssH - seatY);
			if (shotNow === "talent") pane(talentImg, talentTrack, TALENT_RIG, 0, 0, cssW, cssH, talentTalks, state.lipGain);
			else if (shotNow === "lead") pane(leadImg, leadTrack, LEAD_RIG, 0, 0, cssW, cssH, leadTalks, state.lipGain);
			else {
				const gap = 2;
				const paneW = Math.max(1, (cssW - gap) / 2);
				pane(leadImg, leadTrack, LEAD_RIG, 0, seatY, paneW, seatH, leadTalks, state.lipGain);
				pane(talentImg, talentTrack, TALENT_RIG, paneW + gap, seatY, paneW, seatH, talentTalks, state.lipGain);
			}
			grade();
		};
		const loop = (now) => {
			if (!running) return;
			raf = requestAnimationFrame(loop);
			if (document.hidden) return;
			const state = useStudio.getState();
			const min = state.status === "speaking" || state.drive === "mic" && Boolean(audioEngine.micStream) ? 33 : 70;
			if (now - lastDraw < min) return;
			lastDraw = now;
			draw();
		};
		const start = () => {
			if (started || !running) return;
			started = true;
			raf = requestAnimationFrame(loop);
		};
		start();
		talentImg.onload = () => {
			lastDraw = 0;
		};
		leadImg.onload = () => {
			lastDraw = 0;
		};
		setImg.onload = () => {
			lastDraw = 0;
		};
		return () => {
			running = false;
			cancelAnimationFrame(raf);
			ro.disconnect();
		};
	}, [
		talentSrc,
		leadSrc,
		backdropSrc
	]);
	const showLeadPlate = shot !== "talent";
	const showTalentPlate = shot !== "lead";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: wrapRef,
		className: cn("relative overflow-hidden bg-bg", clean ? "h-full w-full" : "h-full min-h-64 w-full rounded-[var(--radius-xl)]", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "block h-full w-full"
			}),
			!clean && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5 sm:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: cn("inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-medium tracking-[0.14em] uppercase", live ? "bg-air text-fg" : "bg-bg/70 text-muted"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1.5 rounded-full", live ? "bg-fg" : "bg-subtle") }), live ? "On air" : "Standby"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden rounded-full bg-bg/70 px-2.5 py-1.5 text-[11px] uppercase tracking-[0.12em] text-muted sm:inline",
						children: shot === "lead" ? "Host iso" : shot === "talent" ? "Co-host iso" : "Standing"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, {
					status,
					drive
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("pointer-events-none absolute inset-x-0 bottom-0 gap-2 px-[4%] pb-[3%] sm:gap-3", showLeadPlate && showTalentPlate ? "grid grid-cols-2" : "flex"),
				children: [showLeadPlate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nameplate, {
					name: LEAD_RIG.name,
					role: LEAD_RIG.role,
					hot: hot === "lead",
					align: "left"
				}), showTalentPlate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nameplate, {
					name: TALENT_RIG.name,
					role: TALENT_RIG.role,
					hot: hot === "talent",
					align: "right"
				})]
			}),
			captions && caption && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-x-0 bottom-16 p-5 sm:bottom-20 sm:p-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto max-w-3xl rounded-[var(--radius-md)] bg-bg/75 px-5 py-3.5 text-center text-sm leading-snug text-fg sm:text-base",
					children: caption.text
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "sr-only",
				children: [
					"Lip gain ",
					lipGain.toFixed(1),
					". ",
					status,
					"."
				]
			})
		]
	});
}
function Nameplate({ name, role, hot, align }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-1", align === "right" && "justify-end"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: cn("inline-flex items-baseline gap-2 rounded-full px-3 py-1.5", hot ? "bg-air text-fg" : "bg-bg/70 text-fg"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-[10px] uppercase tracking-[0.14em] text-muted",
				children: role
			})]
		})
	});
}
function StatusChip({ status, drive }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "rounded-full bg-bg/70 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted tabular-nums",
		children: status === "speaking" ? "Co-host speaking" : status === "thinking" ? "Formulating" : status === "listening" ? drive === "mic" ? "Host live" : "Listening" : drive === "mic" ? "Mic · host" : "Idle"
	});
}
function splitTakes(text, max = 780) {
	const clean = text.replace(/\s+/g, " ").trim();
	if (!clean) return [];
	const parts = clean.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
	const out = [];
	let buf = "";
	for (const p of parts) if ((buf + " " + p).trim().length > max) {
		if (buf) out.push(buf);
		if (p.length > max) {
			for (let i = 0; i < p.length; i += max) out.push(p.slice(i, i + max));
			buf = "";
		} else buf = p;
	} else buf = (buf + " " + p).trim();
	if (buf) out.push(buf);
	return out.slice(0, 10);
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getAiStatus = createServerFn({ method: "GET" }).handler(createSsrRpc("80d3a99c785681c8a6c4363243dccb28e38b13db934559e0c71c4e230664cceb"));
var askHost = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("f835605c792a674fc03c2f03ff1ce7361012637a70c5e588938ef2c4ee5959ef"));
function localTalentTake(cue) {
	const t = cue.replace(/\s+/g, " ").trim();
	if (!t) return "Christman, over to you.";
	if (t.split(/\s+/).length > 16) return t;
	if (/\?$/.test(t)) return `Christman, that's the question. ${t.replace(/\?$/, ".")} I'll take the first pass.`;
	return `On that — ${t.replace(/[.!?]+$/, "")}. Back to you, Christman.`;
}
async function synthesize(text, voice) {
	const res = await fetch("/api/tts", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			text,
			voice
		})
	});
	if (!res.ok) throw new Error("studio-voice");
	return res.arrayBuffer();
}
function pickDeviceVoice(voices) {
	const en = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
	const pool = en.length ? en : voices;
	return pool.find((v) => /daniel|alex|fred|david|male|baritone|arthur|rishi|aaron/i.test(v.name)) ?? pool[0];
}
function waitForVoices() {
	const syn = window.speechSynthesis;
	const have = syn.getVoices();
	if (have.length) return Promise.resolve(have);
	return new Promise((resolve) => {
		const done = () => resolve(syn.getVoices());
		syn.addEventListener("voiceschanged", done, { once: true });
		window.setTimeout(done, 600);
	});
}
var deviceRaf = 0;
function stopDeviceSpeech() {
	if (typeof window !== "undefined") window.speechSynthesis?.cancel();
	if (deviceRaf) {
		cancelAnimationFrame(deviceRaf);
		deviceRaf = 0;
	}
	audioEngine.setScriptRms(0);
}
async function speakWithDevice(text) {
	if (typeof window === "undefined" || !window.speechSynthesis) return;
	stopDeviceSpeech();
	const syn = window.speechSynthesis;
	const voices = await waitForVoices();
	const utter = new SpeechSynthesisUtterance(text);
	const voice = pickDeviceVoice(voices);
	if (voice) utter.voice = voice;
	utter.rate = 1.02;
	const charsPerSec = 14.5 * utter.rate;
	const duration = Math.max(1.1, text.length / charsPerSec);
	await audioEngine.ensure();
	return new Promise((resolve) => {
		let start = 0;
		const tick = () => {
			const t = (performance.now() - start) / 1e3;
			audioEngine.setScriptRms(visemeAt(text, t, duration));
			deviceRaf = requestAnimationFrame(tick);
		};
		const finish = () => {
			if (deviceRaf) cancelAnimationFrame(deviceRaf);
			deviceRaf = 0;
			audioEngine.setScriptRms(0);
			resolve();
		};
		utter.onstart = () => {
			start = performance.now();
			deviceRaf = requestAnimationFrame(tick);
		};
		utter.onend = finish;
		utter.onerror = finish;
		syn.speak(utter);
		window.setTimeout(() => {
			if (!start) {
				start = performance.now();
				deviceRaf = requestAnimationFrame(tick);
			}
		}, 80);
	});
}
async function speakText(text) {
	const store = useStudio.getState();
	const takes = splitTakes(text);
	if (!takes.length) return;
	store.clearError();
	store.setStatus("speaking");
	store.setOnAir(true);
	audioEngine.setVolume(store.volume);
	await audioEngine.ensure();
	try {
		for (const take of takes) {
			if (useStudio.getState().status !== "speaking") break;
			store.setCaption(take);
			try {
				const buf = await synthesize(take, useStudio.getState().voice);
				if (useStudio.getState().status !== "speaking") break;
				await audioEngine.playArrayBuffer(buf);
			} catch {
				if (useStudio.getState().status !== "speaking") break;
				await speakWithDevice(take);
			}
		}
	} finally {
		stopDeviceSpeech();
		audioEngine.stopPlayback();
		const current = useStudio.getState();
		if (current.status === "speaking") current.setStatus("idle");
		current.setCaption(null);
	}
}
async function runHostCue(cue) {
	const store = useStudio.getState();
	const line = cue.trim();
	if (!line) return;
	store.clearError();
	store.setStatus("thinking");
	store.pushLog("producer", line);
	store.pushHistory({
		role: "user",
		content: line
	});
	let take = localTalentTake(line);
	try {
		const result = await askHost({ data: {
			cue: line,
			history: useStudio.getState().history
		} });
		if (result.ok) take = result.text;
	} catch {}
	store.pushHistory({
		role: "assistant",
		content: take
	});
	store.pushLog("talent", take);
	await speakText(take);
}
function stopSpeaking() {
	stopDeviceSpeech();
	audioEngine.stopPlayback();
	const store = useStudio.getState();
	store.setStatus("idle");
	store.setCaption(null);
}
function createSpeechRecognizer() {
	if (typeof window === "undefined") return null;
	const w = window;
	const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
	if (!Ctor) return null;
	return new Ctor();
}
//#endregion
export { showBackdropSrc as _, ProgramMonitor as a, talentStillSrc as b, TALENT_RIG as c, createSpeechRecognizer as d, getAiStatus as f, runHostCue as g, leadStillSrc as h, LEAD_RIG as i, audioEngine as l, introBackdropSrc as m, CoverBay as n, RUNDOWN as o, hydrateStudio as p, HOST_LOOKS as r, SHOW as s, Button as t, cn as u, speakText as v, useStudio as x, stopSpeaking as y };
