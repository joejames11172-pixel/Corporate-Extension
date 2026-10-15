# Corporate Extension 0.3.1 preview

Corporate Helper's Chromium/Supermium browser component. This is an installable development preview, not a verified live-site production release.

Includes: launcher for eleven AI sites (opens selection in the current tab); automatic conservative chat-only layout on registered hosts; per-tab display toggle and full-page restore; native settings discovery; local cryptographic password generator; existing SRP pairing and read-only browser bridge.

Chat-only mode waits for a native composer and main content before hiding navigation. It preserves panels containing New chat, settings, uploads, microphone or sign-in controls. This may leave extra navigation visible. Unknown AI sites are not yet detected automatically. Settings attempts to open a visible native Settings button; otherwise it restores the full page rather than inventing a settings URL. Native voice/upload functions remain the site's responsibility.

Install: extract the ZIP, open chrome://extensions in Supermium, turn Developer mode on, choose Load unpacked, and select the extracted folder containing manifest.json. Pin Corporate Extension. Existing AI tabs may need one reload. This is a separate extension ID; pair it using the Pair browser bridge button, and disable the old diagnostic extension after the new pairing works to avoid duplicate sessions. Existing enrollment credentials remain valid. No browser certificate checks are disabled.

The password generator uses Web Crypto with rejection sampling. Generated text is held only in popup memory and copied only on request; it is never inserted into a chat. A copied password remains in the OS clipboard. Protect the screen when showing passwords.

Implemented in 0.3.0: Gemini-specific explicit JSON request adapter, authenticated session-scoped discovery/help/status/text-capture tools, result insertion/submission, request-ID caching and uncertain-outcome handling. See JACK_START_HERE.txt. Requires the helper 0.2.0 browser endpoint and a per-chat enable toggle. Native Gemini UI interaction has not yet been verified on Supermium.

Not implemented: Windows SSH service/tunnel automation; write-capable JSON tools; screen video relay, PNG upload adapters, language-expert dictation, automatic pairing renewal and arbitrary-site detection. Do not infer these capabilities from pairing status. Keep the existing tunnel active for this preview.

Validation on 2026-10-15: all JavaScript syntax checks pass; nine combined extension/helper Node tests pass covering exact HTTPS host matching, 300 password samples and input bounds, and content-script preference isolation, explicit command envelopes, chat binding, duplicate IDs, discovery schemas and cross-session capture denial. Browser fixture tests are included but have NOT run: Chromium is absent from this environment and its download did not produce a valid archive. Run `node --test tests/core.test.cjs` and, with Playwright/Chromium installed, `node tests/browser-fixtures.cjs`. Real Supermium on Windows Server 2003 and all provider interfaces still require testing. No remote clicking, typing or message sending is performed by the legacy bridge.

Source repositories: Corporate-Extension and Corporate-Helper under the deployment owner's GitHub account. No credentials are included in this package. Deployment details are configured through pairing rather than hardcoded source defaults.

Documentation maintenance: update Channels / Corporate Helper documentation with each implementation or deployment change, including verification and remaining work.

Deployment verification 2026-10-15: Alpine live HTTPS health reports Corporate Helper 0.2.0. All 16 installed helper tests pass, including actual verified HTTPS/SRP/browser JSON integration. Six extension Node tests pass (three helper registry tests are also part of the combined eight-test local run). Native Gemini/Supermium UI remains unverified.

0.3.1 correction: the chat-only layout no longer restores/hides panels on every page mutation; existing hidden panels remain untouched until switched off. A regression test simulates 20 repeated chat DOM changes and verifies no sidebar style churn, then verifies restoration on off. The chat popup shows its on/off switch; password, pairing, JSON permissions and native settings are inside a collapsed Settings section. After updating/reloading the extension, reload Gemini once to unload the old observer. Six extension tests pass; native Supermium validation remains with the installed browser.
