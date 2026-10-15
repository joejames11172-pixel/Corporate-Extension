# Corporate Extension 0.4.0 — automatic native-helper preview

Main popup: On/Off and Settings, plus an explicit master-connection status. No address, identity or password fields. A single installation of Corporate Helper provides protected machine enrollment and a boot task. The extension contacts only its registered local native host; it never opens a LAN connection. The master initiates the authenticated peer connection.

The native helper uses certificate authentication on every connection, with no hourly browser pairing. Non-master helpers listen and send connectionless discovery readiness replies only. They never authenticate or connect to another non-master. The master checks its actual connected subnet before TCP connect and binds its local interface. Peer certificates and master identity are pinned. Discovery grants no access.

The latest rule supersedes a Windows-initiated SSH supervisor: this helper control channel is master-initiated TLS. Existing SSH tunnels and the Gateway are preserved. This release does not claim to manage unrelated SSH forwards.

Install the personalized private Windows package once with Install.cmd as administrator; it includes the compatible Python runtime, protected enrollment, boot-task setup and extension folder. Load that included Corporate Extension folder once in Supermium. It has a stable extension ID. Do not reuse the same private machine enrollment on another computer. Do not publish bootstrap.json, enrollment.dat, certificates' private keys, or the private installer archive.

When enabled, opening an active Gemini chat automatically enables its JSON bridge; no per-chat permission checkbox or pairing form. Changing tabs/conversation updates the grant to the active chat. Gemini assistant requests use the corporate_helper envelope documented in JACK_START_HERE.txt. Tools remain read-only: discovery, help, status and redacted text capture. Other supported AI sites have launcher/chat-only layout; their JSON DOM adapters are not implemented.

No credentials are stored in page scripts or extension storage. The native host stores machine credentials using Windows DPAPI and restricted filesystem permissions. Chat requests, capture text, queues and deduplication caches are in memory. Business document storage remains on Drive.

Validation: nine Python native-core tests and nine extension Node tests pass. Master broker predeployment TLS/SRP/relay tests must pass before switch. Windows Server 2003 DPAPI, task startup, firewall registration, native-host launch and real Supermium DOM interaction require verification on the actual machine. This remains a development preview until those tests pass. No successful live Jack round-trip is claimed.

Source: https://github.com/joejames11172-pixel/Corporate-Extension
Documentation and deployment status: Channels / Corporate Helper. Keep them updated with each change.
