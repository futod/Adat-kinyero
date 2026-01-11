// ============================================================================
// MOBILPONT SETTINGS CONTROLLER
// Chrome Storage API használatával biztonságos tárolás
// ============================================================================

console.log("⚙️ Settings Controller Loaded");

// DOM Elements
const m360CodeInput = document.getElementById('m360-code');
const m360TokenInput = document.getElementById('m360-token');
const trelloKeyInput = document.getElementById('trello-key');
const trelloTokenInput = document.getElementById('trello-token');
const saveBtn = document.getElementById('save-btn');
const testBtn = document.getElementById('test-btn');
const statusMsg = document.getElementById('status-msg');

// ============================================================================
// INIT: LOAD SAVED SETTINGS
// ============================================================================

document.addEventListener('DOMContentLoaded', loadSettings);

async function loadSettings() {
    try {
        const result = await chrome.storage.local.get([
            'm360AuthCode',
            'm360AuthToken',
            'trelloApiKey',
            'trelloApiToken'
        ]);

        // Default credentials (ha még nem mentettek semmit)
        const defaults = {
            m360AuthCode: 'a288f785-08e1-435f-8c7f-207318822fc1',
            m360AuthToken: 'efd4b88b4db6a568e1ed210b0af2a669f7098caede53ada2e9100ad0789714db',
            trelloApiKey: 'd5992c73e5e2daa2a7897774c2f67fea',
            trelloApiToken: 'ATTA304c0825a7563f6cc1f8df4bd211b94bcfa62a89189e9787f92e791b837b2560D3B036A4'
        };

        // Populate inputs (mentett vagy default értékekkel)
        m360CodeInput.value = result.m360AuthCode || defaults.m360AuthCode;
        m360TokenInput.value = result.m360AuthToken || defaults.m360AuthToken;
        trelloKeyInput.value = result.trelloApiKey || defaults.trelloApiKey;
        trelloTokenInput.value = result.trelloApiToken || defaults.trelloApiToken;

        // Ha default-ok vannak, jelezd a felhasználónak
        if (!result.m360AuthCode) {
            showStatus('info', 'ℹ️ Alapértelmezett API kulcsok betöltve. Csak akkor módosítsd, ha tudod, mit csinálsz!');
        } else {
            console.log("✅ Egyedi beállítások betöltve");
        }

    } catch (error) {
        console.error("❌ Betöltési hiba:", error);
        showStatus('error', 'Nem sikerült betölteni az adatokat.');
    }
}

// ============================================================================
// SAVE SETTINGS
// ============================================================================

saveBtn.addEventListener('click', saveSettings);

async function saveSettings() {
    const m360Code = m360CodeInput.value.trim();
    const m360Token = m360TokenInput.value.trim();
    const trelloKey = trelloKeyInput.value.trim();
    const trelloToken = trelloTokenInput.value.trim();

    // Validation
    if (!m360Code || !m360Token) {
        showStatus('error', 'Kérlek töltsd ki az M360 mezőket!');
        return;
    }

    // Show loading
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<div class="spinner"></div> Mentés...';

    try {
        await chrome.storage.local.set({
            'm360AuthCode': m360Code,
            'm360AuthToken': m360Token,
            'trelloApiKey': trelloKey,
            'trelloApiToken': trelloToken
        });

        console.log("💾 Adatok mentve Chrome Storage-ba");
        showStatus('success', '✓ Sikeresen mentve! A bővítmény már használja az új beállításokat.');

        // Reset button
        setTimeout(() => {
            saveBtn.disabled = false;
            saveBtn.innerHTML = `
                <svg class="icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                </svg>
                Mentés
            `;
        }, 2000);

    } catch (error) {
        console.error("❌ Mentési hiba:", error);
        showStatus('error', 'Hiba történt a mentés során: ' + error.message);
        
        saveBtn.disabled = false;
        saveBtn.innerHTML = `
            <svg class="icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
            </svg>
            Mentés
        `;
    }
}

// ============================================================================
// TEST CONNECTION
// ============================================================================

testBtn.addEventListener('click', testConnection);

async function testConnection() {
    const m360Code = m360CodeInput.value.trim();
    const m360Token = m360TokenInput.value.trim();

    if (!m360Code || !m360Token) {
        showStatus('error', 'Először töltsd ki az M360 mezőket!');
        return;
    }

    // Show loading
    testBtn.disabled = true;
    testBtn.innerHTML = '<div class="spinner"></div> Tesztelés...';

    try {
        // Test M360 API with a dummy IMEI
        const response = await fetch('https://m360soft.com/api/customer/v1/getHistory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                authCode: m360Code,
                authToken: m360Token,
                imei: '000000000000000', // Dummy IMEI for testing auth
                limit: 1
            })
        });

        console.log("🔍 M360 API teszt válasz:", response.status);

        if (response.ok) {
            const data = await response.json();
            
            // Ha válaszol az API (még ha 0 találattal is), akkor működik
            if (data) {
                showStatus('success', '✓ M360 API kapcsolat sikeres! A hitelesítés működik.');
            } else {
                showStatus('error', 'Váratlan válasz az M360 API-tól.');
            }
        } else if (response.status === 401 || response.status === 403) {
            showStatus('error', '❌ Hibás Auth Code vagy Token! Ellenőrizd az adatokat.');
        } else {
            showStatus('error', `API hiba: ${response.status} - ${response.statusText}`);
        }

    } catch (error) {
        console.error("❌ Teszt hiba:", error);
        showStatus('error', 'Nem sikerült kapcsolódni az M360 API-hoz. Ellenőrizd az internetkapcsolatot.');
    } finally {
        // Reset button
        testBtn.disabled = false;
        testBtn.innerHTML = `
            <svg class="icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
            </svg>
            Kapcsolat Tesztelése
        `;
    }
}

// ============================================================================
// HELPER: SHOW STATUS MESSAGE
// ============================================================================

function showStatus(type, message) {
    statusMsg.className = `status-message ${type} show`;
    
    const icons = {
        success: '<svg class="icon" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>',
        error: '<svg class="icon" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>',
        info: '<svg class="icon" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>'
    };
    
    const icon = icons[type] || icons.info;
    statusMsg.innerHTML = icon + message;

    // Auto-hide after 5 seconds
    setTimeout(() => {
        statusMsg.classList.remove('show');
    }, 5000);
}
