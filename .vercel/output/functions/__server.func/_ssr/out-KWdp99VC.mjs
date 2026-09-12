import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ProgramMonitor, t as Button, v as speakText, x as useStudio, y as stopSpeaking } from "./speak-CxDtY7hT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/out-KWdp99VC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProgramOut() {
	const [chrome, setChrome] = (0, import_react.useState)(true);
	const copy = useStudio((s) => s.copy);
	const status = useStudio((s) => s.status);
	const setCaptions = useStudio((s) => s.setCaptions);
	(0, import_react.useEffect)(() => {
		setCaptions(false);
	}, [setCaptions]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-dvh w-full bg-bg",
		onPointerMove: () => setChrome(true),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgramMonitor, { clean: true }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-x-0 top-0 flex items-start justify-between p-5 transition-opacity duration-200 sm:p-6",
				style: { opacity: chrome ? 1 : 0 },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "rounded-full bg-bg/70 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted no-underline",
					children: "Filament · Program"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: status === "speaking" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "secondary",
						onClick: stopSpeaking,
						children: "Cut"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "secondary",
						onClick: () => void speakText(copy),
						children: "Read copy"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pointer-events-none absolute inset-x-0 bottom-5 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-subtle",
				children: "Share this view, or add it as a browser source"
			})
		]
	});
}
//#endregion
export { ProgramOut as component };
