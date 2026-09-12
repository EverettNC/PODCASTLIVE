import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as VOICES } from "./voices-CtJxj4PU.mjs";
import { _ as showBackdropSrc, a as ProgramMonitor, b as talentStillSrc, c as TALENT_RIG, d as createSpeechRecognizer, f as getAiStatus, g as runHostCue, h as leadStillSrc, i as LEAD_RIG, l as audioEngine, m as introBackdropSrc, n as CoverBay, o as RUNDOWN, p as hydrateStudio, r as HOST_LOOKS, s as SHOW, t as Button, u as cn, v as speakText, x as useStudio, y as stopSpeaking } from "./speak-CxDtY7hT.mjs";
import { a as ImagePlus, i as Mic, o as Airplay, r as Square, t as Volume2 } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BNvNMTvX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SHOTS = [
	{
		id: "black",
		label: "Cold"
	},
	{
		id: "cover",
		label: "Title"
	},
	{
		id: "two",
		label: "Standing"
	},
	{
		id: "lead",
		label: "Host iso"
	},
	{
		id: "talent",
		label: "Co-host iso"
	}
];
function BuildBay() {
	const lookId = useStudio((s) => s.lookId);
	const setLookId = useStudio((s) => s.setLookId);
	const shot = useStudio((s) => s.shot);
	const setShot = useStudio((s) => s.setShot);
	const takeIntro = useStudio((s) => s.takeIntro);
	const takeShow = useStudio((s) => s.takeShow);
	const talentUrl = useStudio((s) => s.talentUrl);
	const plugTalent = useStudio((s) => s.plugTalent);
	const plugLead = useStudio((s) => s.plugLead);
	const plugIntro = useStudio((s) => s.plugIntro);
	const plugShowSet = useStudio((s) => s.plugShow);
	const leadUrl = useStudio((s) => s.leadUrl);
	const introUrl = useStudio((s) => s.introUrl);
	const showUrl = useStudio((s) => s.showUrl);
	const episode = useStudio((s) => s.episode);
	const setEpisode = useStudio((s) => s.setEpisode);
	const pushLog = useStudio((s) => s.pushLog);
	const introSrc = introBackdropSrc({ introUrl });
	const showSrc = showBackdropSrc({ showUrl });
	function pickLook(id) {
		setLookId(id);
		const look = HOST_LOOKS.find((l) => l.id === id);
		pushLog("system", `Co-host look · ${look?.name ?? id}.`);
	}
	function onFile(file, slot) {
		if (!file || !file.type.startsWith("image/")) return;
		const url = URL.createObjectURL(file);
		if (slot === "talent") {
			if (talentUrl) URL.revokeObjectURL(talentUrl);
			plugTalent(url);
			pushLog("system", "Plugged a custom co-host still.");
		} else if (slot === "lead") {
			if (leadUrl) URL.revokeObjectURL(leadUrl);
			plugLead(url);
			pushLog("system", "Plugged a custom host still.");
		} else if (slot === "intro") {
			if (introUrl) URL.revokeObjectURL(introUrl);
			plugIntro(url);
			setShot("cover");
			pushLog("system", "Plugged the intro backdrop.");
		} else {
			if (showUrl) URL.revokeObjectURL(showUrl);
			plugShowSet(url);
			setShot("two");
			pushLog("system", "Plugged the show backdrop.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "relative h-[30vh] shrink-0 p-3 sm:h-[34vh] sm:p-5 lg:px-10 lg:pt-6 lg:pb-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgramMonitor, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
			className: "min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex w-full max-w-[90rem] flex-col gap-6 px-5 py-5 sm:px-8 sm:py-6 lg:px-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-2xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-[11px] uppercase tracking-[0.16em] text-subtle",
									children: "Build"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-1 text-xl font-medium tracking-tight",
									children: "Studio"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-relaxed text-muted",
									children: "Drop the title card. The standing set is Honesty above all else. Two seats on the wall."
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: takeIntro,
								children: "Roll intro"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								onClick: takeShow,
								children: "Take show"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "flex flex-col gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] uppercase tracking-[0.14em] text-subtle",
							children: "Sets"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SetSlot, {
								label: "Intro backdrop",
								hint: introUrl ? "Custom plugged" : "Ep 01 title card",
								src: introSrc,
								active: shot === "cover",
								onPreview: () => setShot("cover"),
								onFile: (file) => onFile(file, "intro")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SetSlot, {
								label: "Show backdrop",
								hint: showUrl ? "Custom plugged" : "Honesty above all else",
								src: showSrc,
								active: shot !== "cover",
								onPreview: () => setShot("two"),
								onFile: (file) => onFile(file, "show")
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "flex flex-col gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] uppercase tracking-[0.14em] text-subtle",
							children: "Shot"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-3 gap-1 rounded-[var(--radius-lg)] bg-surface p-1 shadow-[var(--shadow-border)] sm:grid-cols-5",
							children: SHOTS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShot(s.id),
								className: cn("h-11 rounded-[var(--radius-md)] text-sm font-medium transition-colors duration-150", shot === s.id ? "bg-surface-2 text-fg" : "text-muted hover:text-fg"),
								children: s.label
							}, s.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "flex flex-col gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] uppercase tracking-[0.14em] text-subtle",
							children: "Co-host wardrobe"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6",
							children: [HOST_LOOKS.map((look) => {
								const on = lookId === look.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => pickLook(look.id),
									className: cn("group overflow-hidden rounded-[var(--radius-lg)] text-left transition-opacity duration-150", on ? "shadow-[var(--shadow-border-hover)] ring-1 ring-fg" : "shadow-[var(--shadow-border)] opacity-80 hover:opacity-100"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: look.thumb,
										alt: "",
										className: "aspect-[5/4] w-full object-cover object-[50%_18%]"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-baseline justify-between gap-1 bg-surface-2 px-3 py-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-medium text-fg",
											children: look.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[10px] uppercase tracking-[0.12em] text-subtle",
											children: look.note
										})]
									})]
								}, look.id);
							}), talentUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setLookId("custom"),
								className: cn("overflow-hidden rounded-[var(--radius-lg)] text-left", lookId === "custom" ? "shadow-[var(--shadow-border-hover)]" : "shadow-[var(--shadow-border)]"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: talentUrl,
									alt: "",
									className: "aspect-[5/4] w-full object-cover object-[50%_18%]"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex bg-surface-2 px-3 py-2 text-sm font-medium",
									children: "Plug"
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-6 pb-8 md:grid-cols-[1fr_minmax(16rem,22rem)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "flex flex-col gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[11px] uppercase tracking-[0.14em] text-subtle",
								children: "Talent"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropSlot, {
									label: "Host still",
									hint: leadUrl ? "Custom plugged" : "Christman — lead",
									onFile: (file) => onFile(file, "lead")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropSlot, {
									label: "Co-host still",
									hint: "Outfit or new face",
									onFile: (file) => onFile(file, "talent")
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[11px] uppercase tracking-[0.14em] text-subtle",
								children: "Episode"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: episode,
								onChange: (e) => setEpisode(e.target.value),
								className: "h-11 rounded-[var(--radius-md)] bg-surface px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-accent/40"
							})]
						})]
					})
				]
			})
		})]
	});
}
function SetSlot({ label, hint, src, active, onPreview, onFile }) {
	function onDrop(e) {
		e.preventDefault();
		onFile(e.dataTransfer.files?.[0]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		onDragOver: (e) => e.preventDefault(),
		onDrop,
		className: cn("overflow-hidden rounded-[var(--radius-lg)]", active ? "shadow-[var(--shadow-border-hover)] ring-1 ring-fg" : "shadow-[var(--shadow-border)]"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onPreview,
			className: "block w-full text-left",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src,
				alt: "",
				className: "h-36 w-full object-cover sm:h-44"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3 bg-surface-2 px-3 py-2.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-sm font-medium text-fg",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-xs text-muted",
					children: hint
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-[var(--radius-sm)] bg-surface px-3 text-sm font-medium text-fg shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-4" }),
					"Drop",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "image/*",
						className: "sr-only",
						onChange: (e) => {
							onFile(e.target.files?.[0]);
							e.target.value = "";
						}
					})
				]
			})]
		})]
	});
}
function DropSlot({ label, hint, onFile }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		onDragOver: (e) => e.preventDefault(),
		onDrop: (e) => {
			e.preventDefault();
			onFile(e.dataTransfer.files?.[0]);
		},
		className: "flex min-h-24 cursor-pointer flex-col items-start justify-center gap-1 rounded-[var(--radius-lg)] bg-surface px-4 py-4 text-left shadow-[var(--shadow-border)] transition-opacity duration-150 hover:opacity-90",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-1.5 text-sm font-medium",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-3.5 text-subtle" }), label]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-muted",
				children: hint
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "file",
				accept: "image/*",
				className: "sr-only",
				onChange: (e) => {
					onFile(e.target.files?.[0]);
					e.target.value = "";
				}
			})
		]
	});
}
var FOUR_PIECES = [
	{
		id: "runtime",
		num: "01",
		title: "Avatar runtime",
		body: "A still image. Audio moves the mouth. That is the core. No mocap suit, no camera on a face — the picture talks because the voice is loud."
	},
	{
		id: "voice",
		num: "02",
		title: "Voice",
		body: "Text becomes speech. Before a mouth can move there has to be audio, which means a voice. Cue the co-host or paste copy. The studio speaks it. If that path is busy, the device speaks it. Either way the mouth moves. Nobody signs in."
	},
	{
		id: "route",
		num: "03",
		title: "Audio route",
		body: "That speech feeds the runtime. Three drives on the floor: cue the co-host, read copy, or put Christman’s mic on his still. Pick one. Watch program."
	},
	{
		id: "program",
		num: "04",
		title: "Program out",
		body: "A clean camera view. Share it, or drop it in as a browser source. Intro plate first, then the show set. Christman lead left, co-host right."
	}
];
var DRIVES = [
	{
		id: "book",
		title: "Rundown",
		body: "Episode one, in order. Cold open over black. Title card. Standing set. Tap a co-host line to put it on his mouth."
	},
	{
		id: "talent",
		title: "Cue co-host",
		body: "Type a question or a toss. He answers in a short take, speaks it, lips move. That’s the live path: text, then voice, then the mouth."
	},
	{
		id: "copy",
		title: "Read copy",
		body: "Paste a bumper or a script. Generate the audio, run it through the still. No thinking. He just reads."
	},
	{
		id: "mic",
		title: "Mic · host",
		body: "Arm the mic. Christman’s still tracks that audio. You’re the lead. The co-host stays idle."
	}
];
var SAMPLE_CUE = "In one sentence, welcome listeners back to the show.";
function Deck() {
	const drive = useStudio((s) => s.drive);
	const setDrive = useStudio((s) => s.setDrive);
	const voice = useStudio((s) => s.voice);
	const setVoice = useStudio((s) => s.setVoice);
	const volume = useStudio((s) => s.volume);
	const setVolume = useStudio((s) => s.setVolume);
	const lipGain = useStudio((s) => s.lipGain);
	const setLipGain = useStudio((s) => s.setLipGain);
	const captions = useStudio((s) => s.captions);
	const setCaptions = useStudio((s) => s.setCaptions);
	const onAir = useStudio((s) => s.onAir);
	const setOnAir = useStudio((s) => s.setOnAir);
	const status = useStudio((s) => s.status);
	const error = useStudio((s) => s.error);
	const helpOpen = useStudio((s) => s.helpOpen);
	const shot = useStudio((s) => s.shot);
	const takeIntro = useStudio((s) => s.takeIntro);
	const takeShow = useStudio((s) => s.takeShow);
	const takeBlack = useStudio((s) => s.takeBlack);
	const live = onAir || status === "speaking" || status === "listening";
	const driveHelp = DRIVES.find((d) => d.id === drive);
	(0, import_react.useEffect)(() => {
		audioEngine.setVolume(volume);
	}, [volume]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: "max-h-[44vh] shrink-0 overflow-y-auto overscroll-contain border-t border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-[90rem] flex-col gap-4 px-4 py-4 sm:px-8 sm:py-5 lg:px-8",
			children: [
				helpOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HelpStrip, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[11px] uppercase tracking-[0.16em] text-subtle",
								children: "Floor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 text-lg font-medium tracking-tight",
								children: "Control"
							}),
							driveHelp && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 hidden max-w-xl text-sm leading-relaxed text-muted sm:block",
								children: driveHelp.body
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex rounded-full bg-surface p-1 shadow-[var(--shadow-border)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: takeBlack,
									className: cn("h-10 rounded-full px-3 text-sm font-medium transition-colors duration-150 sm:px-4", shot === "black" ? "bg-surface-2 text-fg" : "text-muted hover:text-fg"),
									children: "Cold"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: takeIntro,
									className: cn("h-10 rounded-full px-3 text-sm font-medium transition-colors duration-150 sm:px-4", shot === "cover" ? "bg-surface-2 text-fg" : "text-muted hover:text-fg"),
									children: "Title"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: takeShow,
									className: cn("h-10 rounded-full px-3 text-sm font-medium transition-colors duration-150 sm:px-4", shot === "two" || shot === "lead" || shot === "talent" ? "bg-surface-2 text-fg" : "text-muted hover:text-fg"),
									children: "Standing"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setOnAir(!live),
							className: cn("inline-flex h-10 items-center gap-2 rounded-full px-4 text-[11px] font-medium uppercase tracking-[0.14em] transition-opacity duration-150", live ? "bg-air text-fg" : "bg-surface-2 text-muted shadow-[var(--shadow-border)]"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-1.5 rounded-full", live ? "bg-fg" : "bg-subtle") }), live ? "On air" : "Standby"]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(16rem,22rem)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 flex-col gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-1 rounded-[var(--radius-lg)] bg-surface p-1 shadow-[var(--shadow-border)] sm:grid-cols-4",
								children: [
									["book", "Rundown"],
									["talent", "Cue"],
									["copy", "Copy"],
									["mic", "Mic"]
								].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setDrive(id),
									className: cn("h-11 rounded-[var(--radius-md)] text-sm font-medium transition-colors duration-150", drive === id ? "bg-surface-2 text-fg" : "text-muted hover:text-fg"),
									children: label
								}, id))
							}),
							drive === "book" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RundownPanel, {}),
							drive === "talent" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TalentPanel, {}),
							drive === "copy" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyPanel, {}),
							drive === "mic" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicPanel, {})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-5",
						children: [
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-air",
								role: "alert",
								children: error
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[11px] uppercase tracking-[0.14em] text-subtle",
									children: "Voice"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: voice,
									onChange: (e) => setVoice(e.target.value),
									className: "h-11 rounded-[var(--radius-md)] bg-surface px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
									children: VOICES.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: v.id,
										children: [
											v.label,
											" — ",
											v.note
										]
									}, v.id))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-subtle",
									children: ["Output", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular-nums text-muted",
										children: Math.round(volume * 100)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: 0,
										max: 1,
										step: .01,
										value: volume,
										onChange: (e) => setVolume(Number(e.target.value)),
										className: "w-full accent-accent"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-subtle",
									children: ["Lip gain", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular-nums text-muted",
										children: lipGain.toFixed(1)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: .4,
									max: 2,
									step: .05,
									value: lipGain,
									onChange: (e) => setLipGain(Number(e.target.value)),
									className: "w-full accent-accent"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex h-11 items-center gap-2 text-sm text-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: captions,
										onChange: (e) => setCaptions(e.target.checked),
										className: "size-4 accent-accent"
									}), "Captions"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "outline",
									size: "sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/out",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Airplay, {}), "Program out"]
									})
								})]
							}),
							status === "speaking" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								onClick: stopSpeaking,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3.5 fill-current" }), "Stop take"]
							})
						]
					})]
				})
			]
		})
	});
}
function HelpStrip() {
	const dismissHelp = useStudio((s) => s.dismissHelp);
	const setBay = useStudio((s) => s.setBay);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hidden flex-wrap items-center justify-between gap-3 rounded-[var(--radius-lg)] bg-surface px-4 py-3 shadow-[var(--shadow-border)] sm:flex sm:px-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "max-w-3xl text-sm leading-relaxed text-muted",
			children: [
				SHOW.title,
				". Cold open over black. Title card. Standing set. Cue the co-host from the rundown.",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-fg underline decoration-border underline-offset-4 hover:decoration-fg",
					onClick: () => setBay("learn"),
					children: "Learn the four pieces"
				}),
				". Nothing here is locked."
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "ghost",
			size: "sm",
			onClick: dismissHelp,
			children: "Got it"
		})]
	});
}
function RundownPanel() {
	const beatId = useStudio((s) => s.beatId);
	const setBeat = useStudio((s) => s.setBeat);
	const status = useStudio((s) => s.status);
	const beat = RUNDOWN.find((b) => b.id === beatId) ?? RUNDOWN[0];
	const busy = status === "thinking" || status === "speaking" || status === "listening";
	const idx = RUNDOWN.findIndex((b) => b.id === beat.id);
	function playLine() {
		if (beat.speaker !== "talent" || busy) return;
		runHostCue(beat.text);
	}
	function next() {
		const n = RUNDOWN[idx + 1];
		if (n) setBeat(n.id);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1 overflow-x-auto pb-1",
				children: RUNDOWN.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setBeat(b.id),
					className: cn("h-8 shrink-0 rounded-full px-2.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-150", b.id === beat.id ? "bg-surface-2 text-fg shadow-[var(--shadow-border)]" : "text-muted hover:text-fg"),
					children: [
						b.n,
						" ",
						b.label
					]
				}, b.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-h-40 overflow-y-auto rounded-[var(--radius-lg)] bg-surface px-4 py-3 shadow-[var(--shadow-border)] sm:max-h-48",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] uppercase tracking-[0.16em] text-subtle",
					children: speakerLabel(beat)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 whitespace-pre-wrap text-sm leading-relaxed text-fg",
					children: beat.text
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					beat.speaker === "talent" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "flex-1",
						disabled: busy,
						onClick: playLine,
						children: status === "thinking" ? "Formulating…" : "Cue co-host"
					}),
					beat.speaker === "everett" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "flex-1",
						variant: "secondary",
						onClick: () => useStudio.getState().setDrive("mic"),
						children: "Arm Everett"
					}),
					beat.speaker === "black" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "flex-1",
						onClick: () => useStudio.getState().takeBlack(),
						children: "Over black"
					}),
					beat.speaker === "card" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "flex-1",
						onClick: () => useStudio.getState().takeIntro(),
						children: "Roll title"
					}),
					beat.speaker === "show" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "flex-1",
						onClick: () => useStudio.getState().takeShow(),
						children: "Take standing"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						disabled: !RUNDOWN[idx + 1],
						onClick: next,
						children: "Next"
					})
				]
			})
		]
	});
}
function speakerLabel(beat) {
	if (beat.speaker === "everett") return "Everett";
	if (beat.speaker === "talent") return "Co-host";
	if (beat.speaker === "card") return "Title card";
	if (beat.speaker === "show") return "Standing";
	return "Over black";
}
function TalentPanel() {
	const cue = useStudio((s) => s.cue);
	const setCue = useStudio((s) => s.setCue);
	const status = useStudio((s) => s.status);
	const log = useStudio((s) => s.log);
	const scroller = (0, import_react.useRef)(null);
	const busy = status === "thinking" || status === "speaking" || status === "listening";
	(0, import_react.useEffect)(() => {
		const el = scroller.current;
		if (el) el.scrollTop = el.scrollHeight;
	}, [log]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-col gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: scroller,
			className: "max-h-28 overflow-y-auto rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-border)] sm:max-h-40",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-3",
				children: log.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-col gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[10px] uppercase tracking-[0.16em] text-subtle",
						children: row.role === "producer" ? "Cue" : row.role === "talent" ? "Co-host" : "Floor"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("text-sm leading-relaxed", row.role === "system" ? "text-muted" : "text-fg"),
						children: row.text
					})]
				}, row.id))
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "flex flex-col gap-2",
			onSubmit: (e) => {
				e.preventDefault();
				const line = cue.trim();
				if (!line || busy) return;
				setCue("");
				runHostCue(line);
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: cue,
				onChange: (e) => setCue(e.target.value),
				placeholder: "Cue the co-host — a question, a toss, a note.",
				rows: 3,
				className: "w-full resize-none rounded-[var(--radius-md)] bg-surface px-3 py-2.5 text-sm text-fg shadow-[var(--shadow-border)] outline-none placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-accent/40"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "flex-1",
					disabled: busy,
					children: status === "thinking" ? "Formulating…" : "Send cue"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoldToTalk, { disabled: busy })]
			})]
		})]
	});
}
function CopyPanel() {
	const copy = useStudio((s) => s.copy);
	const setCopy = useStudio((s) => s.setCopy);
	const status = useStudio((s) => s.status);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			value: copy,
			onChange: (e) => setCopy(e.target.value),
			rows: 6,
			className: "w-full resize-y rounded-[var(--radius-lg)] bg-surface px-4 py-3 text-sm leading-relaxed text-fg shadow-[var(--shadow-border)] outline-none placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-accent/40"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			disabled: status === "speaking" || status === "thinking" || !copy.trim(),
			onClick: () => void speakText(copy),
			children: "Read on air"
		})]
	});
}
function MicPanel() {
	const [armed, setArmed] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)(null);
	async function toggle() {
		setErr(null);
		if (armed) {
			audioEngine.stopMic();
			setArmed(false);
			useStudio.getState().setStatus("idle");
			return;
		}
		try {
			await audioEngine.startMic();
			setArmed(true);
			useStudio.getState().setOnAir(true);
			useStudio.getState().setStatus("listening");
		} catch {
			setErr("Microphone is blocked. Allow access, then arm again.");
		}
	}
	(0, import_react.useEffect)(() => () => audioEngine.stopMic(), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: armed ? "air" : "primary",
			onClick: () => void toggle(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, {}), armed ? "Mic live — tap to cut" : "Arm mic"]
		}), err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-air",
			children: err
		})]
	});
}
function HoldToTalk({ disabled }) {
	const recRef = (0, import_react.useRef)(null);
	const [held, setHeld] = (0, import_react.useState)(false);
	const [supported, setSupported] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		setSupported(Boolean(createSpeechRecognizer()));
	}, []);
	function start() {
		if (disabled) return;
		const rec = createSpeechRecognizer();
		if (!rec) {
			setSupported(false);
			return;
		}
		rec.lang = "en-US";
		rec.continuous = false;
		rec.interimResults = false;
		rec.onresult = (ev) => {
			const text = ev.results[ev.results.length - 1]?.[0]?.transcript?.trim();
			if (text) runHostCue(text);
		};
		rec.onerror = () => {
			setHeld(false);
			useStudio.getState().setStatus("idle");
		};
		rec.onend = () => setHeld(false);
		recRef.current = rec;
		try {
			rec.start();
			setHeld(true);
			useStudio.getState().setStatus("listening");
		} catch {
			setSupported(false);
		}
	}
	function stop() {
		recRef.current?.stop();
		setHeld(false);
	}
	if (!supported) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		type: "button",
		variant: "outline",
		disabled: true,
		title: "Type the cue instead",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, {}), "Hold"]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		type: "button",
		variant: held ? "air" : "secondary",
		disabled,
		onMouseDown: start,
		onMouseUp: stop,
		onMouseLeave: stop,
		onTouchStart: (e) => {
			e.preventDefault();
			start();
		},
		onTouchEnd: stop,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, {}), held ? "Listening" : "Hold"]
	});
}
function LearnBay() {
	const setBay = useStudio((s) => s.setBay);
	const setDrive = useStudio((s) => s.setDrive);
	const setCue = useStudio((s) => s.setCue);
	const setShot = useStudio((s) => s.setShot);
	const lookId = useStudio((s) => s.lookId);
	const talentUrl = useStudio((s) => s.talentUrl);
	const leadUrl = useStudio((s) => s.leadUrl);
	const talentSrc = talentStillSrc({
		lookId,
		talentUrl
	});
	const leadSrc = leadStillSrc({ leadUrl });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-0 flex-1 overflow-y-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 py-12 sm:px-10 sm:py-16 lg:py-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "max-w-3xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] uppercase tracking-[0.18em] text-subtle",
							children: "How it works"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-4 font-display text-4xl tracking-tight text-fg sm:text-5xl md:text-6xl",
							children: "A live talking head is four pieces. None of them are locked."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-2xl text-lg leading-relaxed text-muted",
							children: "Christman is the lead host. The co-host sits camera right and speaks when you cue him. Open the floor and try it — no account, no key to paste, no waiting on permission."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => {
									setShot("two");
									setDrive("talent");
									setCue(SAMPLE_CUE);
									setBay("floor");
								},
								children: "Open the floor"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								onClick: () => setBay("cover"),
								children: "See the cover"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "grid grid-cols-2 gap-3 overflow-hidden rounded-[var(--radius-xl)] sm:gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
						className: "relative overflow-hidden rounded-[var(--radius-lg)] bg-surface",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: leadSrc,
							alt: "",
							className: "aspect-[4/5] w-full object-cover object-[50%_12%] sm:aspect-[5/4]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
							className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg via-bg/70 to-transparent px-4 pb-4 pt-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-fg",
								children: LEAD_RIG.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-[11px] uppercase tracking-[0.14em] text-muted",
								children: [LEAD_RIG.role, " · camera left"]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
						className: "relative overflow-hidden rounded-[var(--radius-lg)] bg-surface",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: talentSrc,
							alt: "",
							className: "aspect-[4/5] w-full object-cover object-[50%_18%] sm:aspect-[5/4]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
							className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg via-bg/70 to-transparent px-4 pb-4 pt-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-fg",
								children: TALENT_RIG.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-[11px] uppercase tracking-[0.14em] text-muted",
								children: [TALENT_RIG.role, " · camera right"]
							})]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "flex flex-col gap-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] uppercase tracking-[0.16em] text-subtle",
							children: "The live path"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 text-2xl font-medium tracking-tight",
							children: "Four things"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-2xl text-base leading-relaxed text-muted",
							children: "Depends which of the two you’re building. For live — mouth moving while someone talks on air — you need all four. Pre-rendered segments need less: script, generate the audio, run it through an image-to-video tool, drop the clip on a timeline. This studio is the live one."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "grid gap-8 sm:grid-cols-2",
						children: FOUR_PIECES.map((piece) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-col gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-[11px] uppercase tracking-[0.16em] text-subtle",
									children: piece.num
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xl font-medium tracking-tight",
									children: piece.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-base leading-relaxed text-muted",
									children: piece.body
								})
							]
						}, piece.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "flex flex-col gap-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[11px] uppercase tracking-[0.16em] text-subtle",
						children: "On the floor"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 text-2xl font-medium tracking-tight",
						children: "Three drives"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-6 sm:grid-cols-3",
						children: DRIVES.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-col gap-3 rounded-[var(--radius-xl)] bg-surface px-5 py-6 shadow-[var(--shadow-border)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-medium tracking-tight",
								children: d.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm leading-relaxed text-muted",
								children: d.body
							})]
						}, d.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "flex flex-col gap-6 border-t border-border pt-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[11px] uppercase tracking-[0.16em] text-subtle",
						children: "Also open"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-8 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-medium tracking-tight",
							children: "Build"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-base leading-relaxed text-muted",
							children: "Two plates: intro backdrop for the open, show backdrop for the set. Drop your own. Roll intro, then take the show — it cuts. Wardrobe and stills sit on top of those plates."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-medium tracking-tight",
							children: "Cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-base leading-relaxed text-muted",
							children: "The intro. Christman lead, co-host right, sitting on the intro plate. Roll it, then take the show."
						})] })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "flex flex-col items-start gap-4 rounded-[var(--radius-xl)] bg-surface px-6 py-8 shadow-[var(--shadow-border)] sm:px-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] uppercase tracking-[0.16em] text-subtle",
							children: "Try it"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "max-w-2xl text-lg leading-relaxed text-fg",
							children: [
								"Cue the co-host: “",
								SAMPLE_CUE,
								"” Watch program. Then arm the mic and take the floor yourself."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								setShot("two");
								setDrive("talent");
								setCue(SAMPLE_CUE);
								setBay("floor");
							},
							children: "Take that cue to the floor"
						})
					]
				})
			]
		})
	});
}
var BAYS = [
	{
		id: "floor",
		label: "Floor"
	},
	{
		id: "build",
		label: "Build"
	},
	{
		id: "cover",
		label: "Cover"
	},
	{
		id: "learn",
		label: "Learn"
	}
];
function TopBar() {
	const [clock, setClock] = (0, import_react.useState)("00:00:00");
	const onAir = useStudio((s) => s.onAir);
	const status = useStudio((s) => s.status);
	const bay = useStudio((s) => s.bay);
	const setBay = useStudio((s) => s.setBay);
	const live = onAir || status === "speaking";
	(0, import_react.useEffect)(() => {
		const start = Date.now();
		const tick = () => {
			const s = Math.floor((Date.now() - start) / 1e3);
			const hh = String(Math.floor(s / 3600)).padStart(2, "0");
			const mm = String(Math.floor(s % 3600 / 60)).padStart(2, "0");
			const ss = String(s % 60).padStart(2, "0");
			setClock(`${hh}:${mm}:${ss}`);
		};
		tick();
		const id = setInterval(tick, 1e3);
		return () => clearInterval(id);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:h-20 sm:px-8 lg:px-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex items-baseline gap-3 text-fg no-underline",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-2xl tracking-tight sm:text-3xl",
					children: SHOW.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden font-mono text-[11px] uppercase tracking-[0.18em] text-subtle sm:inline",
					children: SHOW.episodeNum
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex rounded-full bg-surface p-1 shadow-[var(--shadow-border)]",
				children: BAYS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setBay(b.id),
					className: cn("h-9 rounded-full px-3 text-sm font-medium transition-colors duration-150 sm:px-4", bay === b.id ? "bg-surface-2 text-fg" : "text-muted hover:text-fg"),
					children: b.label
				}, b.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4 sm:gap-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden font-mono text-sm tabular-nums text-muted sm:inline",
					children: clock
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: live ? "font-mono text-[11px] uppercase tracking-[0.16em] text-air" : "font-mono text-[11px] uppercase tracking-[0.16em] text-subtle",
					children: live ? "Live" : "Standby"
				})]
			})
		]
	});
}
function Home() {
	const setAiReady = useStudio((s) => s.setAiReady);
	const bay = useStudio((s) => s.bay);
	(0, import_react.useEffect)(() => {
		hydrateStudio();
		getAiStatus().then((s) => setAiReady(s.ready));
	}, [setAiReady]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col overflow-hidden bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {}), bay === "cover" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoverBay, {}) : bay === "learn" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LearnBay, {}) : bay === "build" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuildBay, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "flex min-h-0 flex-1 flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative min-h-[46vh] flex-1 p-2 sm:p-4 lg:px-8 lg:pb-2 lg:pt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgramMonitor, { className: "h-full" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Deck, {})]
		})]
	});
}
//#endregion
export { Home as component };
