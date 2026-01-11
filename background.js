// ============================================================================
// MOBILPONT BACKGROUND SERVICE WORKER
// Kezelés: OVIP, M360, Sidebar
// ============================================================================

// Import default credentials
importScripts('config.js');

const M360_API_URL = "https://m360soft.com/api/customer/v1/getHistory";

console.log("🚀 Mobilpont Background Service Worker betöltve");

// ============================================================================
// HELPER: GET API CREDENTIALS FROM STORAGE (HIBRID MEGOLDÁS)
// ============================================================================

async function getApiCredentials() {
    try {
        const result = await chrome.storage.local.get([
            'm360AuthCode',
            'm360AuthToken',
            'trelloApiKey',
            'trelloApiToken'
        ]);

        // HIBRID LOGIKA: Ha van mentett adat, azt használjuk
        if (result.m360AuthCode && result.m360AuthToken) {
            return {
                m360: {
                    authCode: result.m360AuthCode,
                    authToken: result.m360AuthToken
                },
                trello: {
                    apiKey: result.trelloApiKey || DEFAULT_CREDENTIALS.trello.apiKey,
                    apiToken: result.trelloApiToken || DEFAULT_CREDENTIALS.trello.apiToken
                }
            };
        }

        // Ha nincs mentett adat, default kulcsokat használunk
        console.log("ℹ️ Chrome Storage üres, default credentials használata");
        return DEFAULT_CREDENTIALS;

    } catch (error) {
        console.error("❌ Hiba az API kulcsok olvasásakor:", error);
        // Hiba esetén is default-ot adjunk vissza
        return DEFAULT_CREDENTIALS;
    }
}

// ============================================================================
// SIDEBAR MANAGEMENT
// ============================================================================

// Extension icon click - Open sidebar
chrome.action.onClicked.addListener((tab) => {
    chrome.sidePanel.open({ windowId: tab.windowId });
    console.log("📂 Sidebar megnyitva");
});

// Keyboard shortcut - Open sidebar
chrome.commands.onCommand.addListener((command) => {
    if (command === "open-sidebar") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.sidePanel.open({ windowId: tabs[0].windowId });
                console.log("⌨️ Sidebar megnyitva billentyűparanccsal");
            }
        });
    }
});

// ============================================================================
// MESSAGE HANDLING
// ============================================================================

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    
    // M360 API kérés kezelése (a content script vagy sidebar számára)
    if (request.action === "fetchM360Data") {
        console.log("🔍 M360 kérés fogadva:", request.imei);

        // Async wrapper (mivel nem lehet await a top-level listenerben)
        (async () => {
            try {
                // Load credentials from storage (or use defaults)
                const credentials = await getApiCredentials();
                
                if (!credentials || !credentials.m360 || !credentials.m360.authCode) {
                    throw new Error("M360 API kulcsok hiányoznak! Ellenőrizd a config.js-t vagy a Settings oldalt.");
                }

                // Make API call
                const response = await fetch(M360_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        authCode: credentials.m360.authCode,
                        authToken: credentials.m360.authToken,
                        imei: request.imei,
                        limit: request.limit || 5
                    })
                });

                console.log("📡 M360 HTTP státusz:", response.status);
                
                if (!response.ok) {
                    throw new Error(`HTTP hiba: ${response.status}`);
                }

                const jsonResponse = await response.json();
                console.log("✅ M360 válasz sikeres");
                sendResponse({ success: true, data: jsonResponse });

            } catch (error) {
                console.error("❌ M360 hiba:", error);
                sendResponse({ success: false, error: error.message });
            }
        })();

        return true; // Keep message channel open for async response
    }

    // TRELLO API KÉRÉSEK KEZELÉSE
    if (request.action === "fetchTrelloData") {
        console.log("🐘 Trello kérés:", request.type);

        (async () => {
            try {
                const credentials = await getApiCredentials();
                const apiKey = credentials.trello.apiKey;
                const token = credentials.trello.apiToken;

                if (!apiKey || !token) throw new Error("Trello API kulcsok hiányoznak!");

                let url = "";
                
                // 1. Keresés Cikkszám alapján
                if (request.type === "search") {
                    // Keresés kártyákra, amik nem archiváltak
                    // card_list=true: visszaadja a lista objektumot is minden kártyához
                    const query = encodeURIComponent(`${request.query} is:open`);
                    url = `https://api.trello.com/1/search?query=${query}&modelTypes=cards&card_list=true&card_fields=name,idList,labels,dateLastActivity,shortUrl,badges&key=${apiKey}&token=${token}&cards_limit=10`;
                } 
                // 2. Kommentek lekérése
                else if (request.type === "getComments") {
                    url = `https://api.trello.com/1/cards/${request.cardId}/actions?filter=commentCard&key=${apiKey}&token=${token}`;
                }

                const response = await fetch(url);
                if (!response.ok) throw new Error(`Trello API hiba: ${response.status}`);
                
                const data = await response.json();
                sendResponse({ success: true, data: data });

            } catch (error) {
                console.error("❌ Trello hiba:", error);
                sendResponse({ success: false, error: error.message });
            }
        })();

        return true; // Async válasz miatt
    }

    // Open sidebar programmatically
    if (request.action === "openSidebar") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.sidePanel.open({ windowId: tabs[0].windowId });
                sendResponse({ success: true });
            } else {
                sendResponse({ success: false, error: "No active tab" });
            }
        });
        return true;
    }

    // Get current tab info
    if (request.action === "getCurrentTab") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            sendResponse({ tab: tabs[0] || null });
        });
        return true;
    }
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

self.addEventListener('error', (event) => {
    console.error("💥 Background error:", event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error("💥 Unhandled promise rejection:", event.reason);
});

console.log("✅ Background service worker inicializálva");