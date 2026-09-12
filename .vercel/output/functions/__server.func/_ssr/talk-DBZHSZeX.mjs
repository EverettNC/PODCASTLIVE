import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { n as HOST_SYSTEM } from "./voices-CtJxj4PU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/talk-DBZHSZeX.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var MAX_REPLY_TOKENS = 220;
var MAX_CUE = 1200;
var getAiStatus_createServerFn_handler = createServerRpc({
	id: "80d3a99c785681c8a6c4363243dccb28e38b13db934559e0c71c4e230664cceb",
	name: "getAiStatus",
	filename: "src/lib/xai/talk.ts"
}, (opts) => getAiStatus.__executeServer(opts));
var getAiStatus = createServerFn({ method: "GET" }).handler(getAiStatus_createServerFn_handler, async () => {
	return { ready: Boolean(process.env.XAI_API_KEY) };
});
var askHost_createServerFn_handler = createServerRpc({
	id: "f835605c792a674fc03c2f03ff1ce7361012637a70c5e588938ef2c4ee5959ef",
	name: "askHost",
	filename: "src/lib/xai/talk.ts"
}, (opts) => askHost.__executeServer(opts));
var askHost = createServerFn({ method: "POST" }).validator((input) => input).handler(askHost_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "offline"
	};
	const cue = data.cue.trim().slice(0, MAX_CUE);
	if (!cue) return {
		ok: false,
		error: "empty"
	};
	const history = (data.history ?? []).slice(-8).map((t) => ({
		role: t.role,
		content: t.content.slice(0, MAX_CUE)
	}));
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			max_tokens: MAX_REPLY_TOKENS,
			temperature: .8,
			messages: [
				{
					role: "system",
					content: HOST_SYSTEM
				},
				...history,
				{
					role: "user",
					content: cue
				}
			]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: "busy"
	};
	const text = ((await res.json()).choices?.[0]?.message?.content ?? "").trim();
	if (!text) return {
		ok: false,
		error: "empty"
	};
	return {
		ok: true,
		text
	};
});
//#endregion
export { askHost_createServerFn_handler, getAiStatus_createServerFn_handler };
