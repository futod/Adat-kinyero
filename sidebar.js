// ============================================================================
// MOBILPONT SIDEBAR CONTROLLER - IFRAME MODE
// ============================================================================

console.log("🚀 Mobilpont Assistant Iframe Mode Loaded");

const iframe = document.getElementById('mp-assistant-frame');

// JÖVŐÁLLÓSÁG: Kommunikáció a weboldal és a bővítmény között
// Ha a mobilpontszeged.hu/assistant oldal üzenetet küld (pl. "Lépj be a Drive-ba"),
// itt tudjuk elkapni.
window.addEventListener('message', (event) => {
    // Biztonsági ellenőrzés: Csak a saját domainünkről fogadunk üzenetet
    if (event.origin !== "https://mobilpontszeged.hu") return;

    const data = event.data;
    console.log("Üzenet érkezett a weboldalról:", data);

    // Példa jövőbeli logikára:
    // if (data.action === 'GET_CURRENT_TAB_URL') { ... }
});

// Ha később dinamikusan akarsz tartalmat injektálni a Headerbe:
function updateHeader(content) {
    const header = document.getElementById('ext-header');
    header.innerHTML = content;
    header.style.padding = "10px"; // Csak akkor adjunk paddingot, ha van tartalom
}

document.getElementById("gmailBtn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "OPEN_GMAIL" });
});