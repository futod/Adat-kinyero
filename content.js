console.log("🎭 Mobilpont Univerzális Asszisztens v18.0 (Chameleon Mode) 🚀");

// ============================================================================
// CHAMELEON CORE INTEGRATION (KIEGÉSZÍTÉS, NEM HELYETTESÍTÉS!)
// ============================================================================

// Várjuk meg, amíg a Chameleon Core betöltődik
if (window.ChameleonCore) {
    console.log("✅ Chameleon Core betöltve - Natív OVIP stílus elérhető");
    
    // Destructure Chameleon modulok (opcionális használathoz)
    const { OVIPStyles, ChameleonButton, ChameleonPanel, ContextDetector } = window.ChameleonCore;
    
    // Context detection példa
    if (ContextDetector) {
        const context = ContextDetector.detect();
        console.log("🧠 Detektált kontextus:", context);
    }
} else {
    console.warn("⚠️ Chameleon Core nincs betöltve - Fallback módban működik");
}

// ============================================================================
// KONFIG ÉS IKONOK
// ============================================================================

const ICONS_V2 = {
    m360_small: `<svg viewBox="0 0 24 24" width="10" height="10" fill="white"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14zM16 13h-3V8h-2v5H8l4 4 4-4z"/></svg>`,
    loading: `<svg viewBox="0 0 24 24" width="16" height="16" style="animation: spin 1s linear infinite; fill:#0073aa;"><path d="M12 4V2C6.48 2 2 6.48 2 12h2c0-4.41 3.59-8 8-8z"/></svg>`,
    placeholder_phone: `<svg viewBox="0 0 24 24" width="40" height="40" fill="#e0e0e0"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14zM16 13h-3V8h-2v5H8l4 4 4-4z"/></svg>`,
    print: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>`,
    m360: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg>`,
    trello: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M4 4h6v16H4zm10 0h6v10h-6z"/></svg>`,
    wordpress: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.85.63-3.55 1.69-4.9l4.4 12.05c-.66.22-1.36.35-2.09.35zm6.92-2.44c-.3-.53-1.04-1.27-2.49-2.49L15 11.5c-.18-.48-.29-.99-.29-1.5 0-1.66 1.34-3 3-3 1.66 0 3 1.34 3 3 0 2.76-2.24 5-5 5-.83 0-1.6-.26-2.23-.71z"/></svg>`,
    external: `<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>`
};

// ============================================================================
// CONSOLE LOG INTERCEPTOR (Bug Report számára)
// ============================================================================

function setupConsoleLogInterceptor() {
    // Log tároló inicializálása
    if (!window.__MOBILPONT_LOGS__) {
        window.__MOBILPONT_LOGS__ = [];
    }
    
    // Eredeti console metódusok mentése
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalInfo = console.info;
    
    // Console.log override
    console.log = function(...args) {
        const timestamp = new Date().toLocaleTimeString('hu-HU');
        const message = `[${timestamp}] LOG: ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')}`;
        window.__MOBILPONT_LOGS__.push(message);
        
        // Max 100 log tárolása (memória spórolás)
        if (window.__MOBILPONT_LOGS__.length > 100) {
            window.__MOBILPONT_LOGS__.shift();
        }
        
        originalLog.apply(console, args);
    };
    
    // Console.warn override
    console.warn = function(...args) {
        const timestamp = new Date().toLocaleTimeString('hu-HU');
        const message = `[${timestamp}] WARN: ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')}`;
        window.__MOBILPONT_LOGS__.push(message);
        
        if (window.__MOBILPONT_LOGS__.length > 100) {
            window.__MOBILPONT_LOGS__.shift();
        }
        
        originalWarn.apply(console, args);
    };
    
    // Console.error override
    console.error = function(...args) {
        const timestamp = new Date().toLocaleTimeString('hu-HU');
        const message = `[${timestamp}] ERROR: ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')}`;
        window.__MOBILPONT_LOGS__.push(message);
        
        if (window.__MOBILPONT_LOGS__.length > 100) {
            window.__MOBILPONT_LOGS__.shift();
        }
        
        originalError.apply(console, args);
    };
    
    // Console.info override
    console.info = function(...args) {
        const timestamp = new Date().toLocaleTimeString('hu-HU');
        const message = `[${timestamp}] INFO: ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')}`;
        window.__MOBILPONT_LOGS__.push(message);
        
        if (window.__MOBILPONT_LOGS__.length > 100) {
            window.__MOBILPONT_LOGS__.shift();
        }
        
        originalInfo.apply(console, args);
    };
    
    console.log('✅ Console log interceptor aktiválva (Bug Report)');
}

// ============================================================================
// ROUTER (EREDETI - VÁLTOZATLAN!)
// ============================================================================

function init() {
    const url = window.location.href;
    
    // CONSOLE LOG INTERCEPTOR (bug report számára)
    setupConsoleLogInterceptor();
    
    // NAVBAR VERZIÓ injektálása (minden oldalon)
    injectVersionBadge();
    
    // SIDEBAR KERESŐK injektálása (minden ovip.hu oldalon, több próbálkozással)
    setTimeout(() => injectSidebarSearchInputs(), 1000);
    setTimeout(() => injectSidebarSearchInputs(), 2000);  // 2. próbálkozás
    setTimeout(() => injectSidebarSearchInputs(), 3000);  // 3. próbálkozás
    
    // 1. Termék oldal
    if (url.includes('termek_id=')) {
        waitForElement('.right_col', initProductPage);
    } 
    // 2. Rendelés oldal
    else if (url.includes('rendelesek') && url.includes('id=')) {
        waitForElement('.table-striped', initOrderPage);
    }
    // 3. SZERVIZ MUNKALAP
    else if (document.getElementById('megrendelo_leiras')) {
        console.log("🔧 Szerviz Munkalap detektálva");
        waitForElement('#megjegyzesek_div', initServicePage);
        waitForElement('.x_content .btn-group', injectPrintButtonService);
    }
}

function waitForElement(selector, callback) {
    const el = document.querySelector(selector);
    if (el) { callback(el); } else { setTimeout(() => waitForElement(selector, callback), 500); }
}

// ============================================================================
// NAVBAR VERZIÓ BADGE + BUG REPORT
// ============================================================================

function injectVersionBadge() {
    // Csak OVIP domain-en
    if (!window.location.href.includes('ovip.hu/')) return;
    
    // Ellenőrizzük, hogy már létezik-e
    if (document.getElementById('mp-version-badge')) {
        console.log('✅ Verzió badge már létezik');
        return;
    }
    
    // Keressük meg a navbar-right-ot
    const navbarRight = document.querySelector('.navbar-nav.navbar-right');
    if (!navbarRight) {
        console.log('⚠️ Navbar-right nem található');
        setTimeout(() => injectVersionBadge(), 500);
        return;
    }
    
    // Verzió kiolvasása a manifest.json-ból
    const manifest = chrome.runtime.getManifest();
    const version = manifest.version || '?';
    
    // Verzió badge létrehozása
    const versionLi = document.createElement('li');
    versionLi.id = 'mp-version-badge';
    versionLi.style.cssText = 'display: flex; align-items: stretch; padding: 0px 15px; height: 100%; align-content: center;';
    
    versionLi.innerHTML = `
        <span style="color: #73879C; font-size: 12px; font-weight: 500; display: flex; align-items: center; gap: 6px;">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="#73879C" style="opacity: 0.7;">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
            </svg>
            <span style="opacity: 0.8;">MP Plugin v${version}</span>
            <a href="#" id="mp-bug-report-btn" style="color: #73879C; display: flex; align-items: center; text-decoration: none; margin-left: 4px;" title="Hiba bejelentése">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="#73879C" style="opacity: 0.7;">
                    <path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z"/>
                </svg>
            </a>
        </span>
    `;
    
    // Beszúrás a navbar-right VÉGÉRE
    navbarRight.appendChild(versionLi);
    
    // CSS injektálás a navbar-right-hoz (flexbox align)
    injectNavbarCSS();
    
    // Bug report event listener (kis késleltetéssel, hogy a DOM-ba kerüljön)
    setTimeout(() => {
        const bugBtn = document.getElementById('mp-bug-report-btn');
        if (bugBtn) {
            bugBtn.addEventListener('click', function(e) {
                e.preventDefault();
                openBugReportEmail();
            });
        }
    }, 100);
    
    console.log(`✅ Verzió badge + Bug report injektálva: v${version}`);
}

// Navbar CSS injektálás
function injectNavbarCSS() {
    if (document.getElementById('mp-navbar-css')) return;
    
    const style = document.createElement('style');
    style.id = 'mp-navbar-css';
    style.textContent = `
        .top_nav .navbar-right {
            width: inherit;
            display: flex;
            flex-direction: row-reverse;
            align-content: center;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: center;
        }
    `;
    document.head.appendChild(style);
    console.log('✅ Navbar CSS injektálva');
}

// Bug report email küldés
function openBugReportEmail() {
    // Adatok gyűjtése
    const manifest = chrome.runtime.getManifest();
    const version = manifest.version || '?';
    const currentUrl = window.location.href;
    const userAgent = navigator.userAgent;
    const timestamp = new Date().toLocaleString('hu-HU');
    const screenRes = `${screen.width}x${screen.height}`;
    
    // CONSOLE LOG AUTOMATIKUS GYŰJTÉSE
    let consoleLog = 'Nincs elérhető log';
    try {
        // Próbáljuk meg a console.log történetet lekérni
        // Ez egy fallback, mert a Chrome nem tárolja az összes logot
        const logs = [];
        
        // Ha van window.__MOBILPONT_LOGS__ tömb (amit mi készítünk)
        if (window.__MOBILPONT_LOGS__ && Array.isArray(window.__MOBILPONT_LOGS__)) {
            consoleLog = window.__MOBILPONT_LOGS__.slice(-50).join('\n');
        } else {
            consoleLog = '[Console log automatikus gyűjtés nem elérhető. Nyisd meg az F12-t és másold be kézzel.]';
        }
    } catch (e) {
        consoleLog = '[Console log hiba: ' + e.message + ']';
    }
    
    // Email címzett
    const emailTo = 'futod.david.mobilpont@gmail.com';
    const subject = `MP Plugin v${version} - Hiba bejelentés`;
    
    const body = `
Hiba bejelentés - MP Plugin v${version}

═══════════════════════════════════════════
RENDSZER INFO
═══════════════════════════════════════════
Plugin verzió: ${version}
Időpont: ${timestamp}
Oldal: ${currentUrl}
Böngésző: ${userAgent}
Képernyő: ${screenRes}

═══════════════════════════════════════════
HIBA LEÍRÁSA
═══════════════════════════════════════════

Mit csináltál, amikor a hiba előfordult?


Mi történt? (Mit vártál és mit kaptál helyette?)


═══════════════════════════════════════════
CONSOLE LOG (Automatikusan bemásolva)
═══════════════════════════════════════════
${consoleLog}


`.trim();
    
    // GMAIL HASZNÁLATA (új lapon)
   const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailTo}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
document.addEventListener("click", (e) => {
    if (e.target.id === "gmailBtn") {
        window.open(gmailComposeUrl, "_blank");
    }
});


    // Toast üzenet
    showBugReportToast();
}

// Toast üzenet a bug report után
function showBugReportToast() {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #2A3F54;
        color: white;
        padding: 12px 18px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-size: 13px;
        max-width: 320px;
    `;
    
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#5cb85c">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
            </svg>
            <div style="font-weight: 500;">Gmail megnyitva új lapon! Küld el. 📧</div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Automatikus törlés 4s után
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.transition = 'opacity 0.3s';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }
    }, 4000);
}

// ============================================================================
// SIDEBAR KERESŐK (Munka & Termék)
// ============================================================================

function injectSidebarSearchInputs() {
    // Csak OVIP domain-en futtatjuk
    if (!window.location.href.includes('ovip.hu/')) {
        return;
    }
    
    // Keressük meg a sidebar menüt
    const sidebar = document.querySelector('.left_col');
    if (!sidebar) {
        console.log('⚠️ Sidebar nem található, újrapróbálkozás...');
        setTimeout(() => injectSidebarSearchInputs(), 500);
        return;
    }
    
    // Ellenőrizzük, hogy már létezik-e
    if (document.getElementById('mp-munka-kereso') || document.getElementById('mp-termek-kereso')) {
        console.log('✅ Sidebar keresők már léteznek');
        return;
    }
    
    // Keressük meg a #oldalso_menu elemet (fő menü) VAGY fallback: sidebar-menu első section
    let mainMenu = document.getElementById('oldalso_menu');
    let insertionPoint = null;
    let insertAfter = false;  // Flag: utána szúrjuk-e be
    
    if (mainMenu) {
        // Van oldalso_menu → beszúrás ELÉ
        insertionPoint = mainMenu;
        insertAfter = false;
        console.log('✅ oldalso_menu találva - beszúrás elé');
    } else {
        // NINCS oldalso_menu → keressük a sidebar-menu első menu_section-jét
        const sidebarMenu = document.getElementById('sidebar-menu') || document.querySelector('.main_menu_side');
        if (sidebarMenu) {
            const firstMenuSection = sidebarMenu.querySelector('.menu_section');
            if (firstMenuSection) {
                insertionPoint = firstMenuSection;
                insertAfter = true;  // UTÁNA szúrjuk be!
                console.log('✅ sidebar-menu első menu_section találva - beszúrás UTÁNA');
            }
        }
        
        // Ha még mindig nincs, próbáljuk a .left_col első gyerekét
        if (!insertionPoint) {
            const firstChild = sidebar.querySelector('.scroll-view > *') || sidebar.querySelector('> *');
            if (firstChild) {
                insertionPoint = firstChild;
                insertAfter = true;  // UTÁNA szúrjuk be!
                console.log('✅ .left_col első elem találva - beszúrás UTÁNA');
            }
        }
    }
    
    if (!insertionPoint) {
        console.log('⚠️ Nincs beszúrási pont');
        return;
    }
    
    // EREDETI GYORSKERESO ELREJTÉSE
    const originalGyorskereso = document.getElementById('gyorskereso');
    if (originalGyorskereso) {
        const originalContainer = originalGyorskereso.closest('.menu_section');
        if (originalContainer) {
            originalContainer.style.display = 'none';
            console.log('✅ Eredeti gyorskereso elrejtve');
        }
    }
    
    // Konténer létrehozása a keresőknek (NINCS PADDING!)
    const searchContainer = document.createElement('div');
    searchContainer.id = 'mp-sidebar-search-container';
    searchContainer.style.cssText = 'margin-top: -10px;';
    
    // 1. MUNKA KERESŐ
    const munkaKeresoDiv = document.createElement('div');
    munkaKeresoDiv.className = 'menu_section';  // Eltávolítva: osszecsukott_menuben_eltunik mobilon_eltunik
    munkaKeresoDiv.style.marginTop = '-10px';
    munkaKeresoDiv.innerHTML = `
        <div class="row">
            <div class="col-md-12">
                <div class="col-md-12">
                    <input type="text" 
                           class="form-control" 
                           id="mp-munka-kereso" 
                           style="border-radius: 25px;" 
                           placeholder="Munka kereső" 
                           autocomplete="off" 
                           value="">
                </div>
            </div>
        </div>
    `;
    
    // 2. TERMÉK KERESŐ
    const termekKeresoDiv = document.createElement('div');
    termekKeresoDiv.className = 'menu_section';  // Eltávolítva: osszecsukott_menuben_eltunik mobilon_eltunik
    termekKeresoDiv.style.marginTop = '-10px';
    termekKeresoDiv.innerHTML = `
        <div class="row">
            <div class="col-md-12">
                <div class="col-md-12">
                    <input type="text" 
                           class="form-control" 
                           id="mp-termek-kereso" 
                           style="border-radius: 25px;" 
                           placeholder="Termék kereső" 
                           autocomplete="off" 
                           value="">
                </div>
            </div>
        </div>
    `;
    
    searchContainer.appendChild(munkaKeresoDiv);
    searchContainer.appendChild(termekKeresoDiv);
    
    // Beszúrás: ELÉ vagy UTÁNA (flag alapján)
    if (insertAfter) {
        // UTÁNA: insertionPoint után szúrjuk be
        if (insertionPoint.nextSibling) {
            insertionPoint.parentNode.insertBefore(searchContainer, insertionPoint.nextSibling);
        } else {
            insertionPoint.parentNode.appendChild(searchContainer);
        }
    } else {
        // ELÉ: insertionPoint elé szúrjuk be
        insertionPoint.parentNode.insertBefore(searchContainer, insertionPoint);
    }
    
    // EVENT LISTENERS
    
    // Munka kereső - OVIP natív gyorskereso hívása VAGY saját redirect
    const munkaKereso = document.getElementById('mp-munka-kereso');
    munkaKereso.addEventListener('keyup', function(e) {
        const searchValue = this.value.trim();
        
        // Ha Enter, akkor redirect
        if (e.key === 'Enter' && searchValue) {
            // Redirect a munkanyilvántartó gyorskeresőhöz
            window.location.href = `https://www.ovip.hu/munkanyilvantarto/?gyorskereso=${encodeURIComponent(searchValue)}`;
            return;
        }
    });
    
    // Termék kereső - Redirect raktárkezelő kereséshez
    const termekKereso = document.getElementById('mp-termek-kereso');
    termekKereso.addEventListener('keyup', function(e) {
        const searchValue = this.value.trim();
        
        if (e.key === 'Enter' && searchValue) {
            // Redirect a raktárkezelő termék keresőhöz
            window.location.href = `https://www.ovip.hu/raktarkezelo/?command=termek_kereso&nev=${encodeURIComponent(searchValue)}`;
        }
    });
    
    console.log('✅ Sidebar keresők injektálva (Munka & Termék)');
}

// ============================================================================
// 1. SZERVIZ MUNKALAP LOGIKA
// ============================================================================

function initServicePage() {
    const textArea = document.getElementById('megrendelo_leiras');
    if (!textArea) return;

    const rawContent = textArea.value || textArea.innerHTML;
    const cleanText = decodeHtml(rawContent);

    // Keresés
    let match = cleanText.match(/(?<!\d)\d{15}(?!\d)/);
    let identifier = match ? match[0] : null;

    if (!identifier) {
        const snMatch = cleanText.match(/(?:SN|Serial|S\/N)[:\s]+([A-Za-z0-9]{8,15})/i);
        if (snMatch) identifier = snMatch[1];
    }

    if (identifier) {
        console.log(`✅ Talált azonosító: ${identifier}`);
        injectServiceDashboard(identifier);
    } else {
        console.log("ℹ️ Nem található IMEI/SN a szerviz leírásban");
    }
}

function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function injectServiceDashboard(identifier) {
    // CÉLPONT: A "Megjegyzések" doboz (x_panel) ALÁ
    const commentsDiv = document.getElementById('megjegyzesek_div');
    let targetElement = null;

    if (commentsDiv) {
        targetElement = commentsDiv.closest('.x_panel');
    }
    
    // Fallback: ha nincs megjegyzés doboz, akkor a nagy konténer aljára
    if (!targetElement) {
        targetElement = document.querySelector('.right_col .x_panel:last-of-type');
    }

    if (!targetElement) return;
    if (document.querySelector('.mp-service-dashboard')) return;

    const panel = document.createElement('div');
    panel.className = 'x_panel mp-service-dashboard'; 
    panel.style.marginTop = '20px';
    panel.style.marginBottom = '20px';
    // A fejlécet kivettük a HTML-ből, mert a renderUnifiedCard generálja majd
    panel.id = 'mp-service-panel-root';
    panel.innerHTML = `<div style="padding:20px; text-align:center; color:#666;">${ICONS_V2.loading} Adatok keresése...</div>`;
    
    targetElement.insertAdjacentElement('afterend', panel);

    // Adatlekérés
    loadM360DataGeneric(identifier, 'mp-service-panel-root');
}


// ============================================================================
// 2. RENDELÉS OLDAL LOGIKA
// ============================================================================

function initOrderPage() {
    const headerEl = document.querySelector('.bizonylat_fejlec span');
    if (headerEl && typeof initTrelloForOrder === 'function') {
        initTrelloForOrder(headerEl.innerText.trim());
    }

    // CÍMKE NYOMTATÁS GOMB injektálása
    injectPrintButtonOrder();

    const imeiMap = scrapeImeisFromTable();
    const imeiCount = Object.keys(imeiMap).length;

    if (imeiCount === 1) {
        const singleImei = Object.keys(imeiMap)[0];
        injectSingleOrderDashboard(singleImei);
    } else if (imeiCount > 1) {
        // Több IMEI: Modal struktúra + Gombok a táblázatban
        injectModalStructure();
        injectTableIcons(imeiMap);
    }
}

function scrapeImeisFromTable() {
    const imeis = {}; 
    const rows = document.querySelectorAll('.table-striped tbody tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        cells.forEach(cell => {
            const text = cell.innerText;
            const match = text.match(/(?<!\d)\d{15}(?!\d)/);
            if (match) imeis[match[0]] = cell; 
        });
    });
    return imeis;
}

function injectSingleOrderDashboard(imei) {
    const table = document.querySelector('.table-striped');
    if (!table) return;
    const mainPanel = table.closest('.x_panel');

    let gridContainer = document.getElementById('mp-unified-dashboard');
    if (!gridContainer) {
        gridContainer = document.createElement('div');
        gridContainer.id = 'mp-unified-dashboard';
        mainPanel.insertAdjacentElement('afterend', gridContainer);
    }

    if (document.querySelector('.mp-order-dashboard')) return;

    const panel = document.createElement('div');
    panel.className = 'x_panel mp-order-dashboard mp-grid-col'; 
    panel.id = 'mp-order-panel-root';
    panel.innerHTML = `<div style="padding:20px; text-align:center; color:#666;">${ICONS_V2.loading} Betöltés...</div>`;
    
    gridContainer.insertBefore(panel, gridContainer.firstChild);
    loadM360DataGeneric(imei, 'mp-order-panel-root');
}

function injectTableIcons(imeiMap) {
    // Táblázat sorai: kis info gomb minden IMEI-hez
    for (const [imei, cell] of Object.entries(imeiMap)) {
        if(cell.querySelector('.mp-table-btn')) continue;
        
        // Kis kék gomb a cellában
        const btn = document.createElement('button');
        btn.className = 'btn btn-xs btn-info mp-table-btn';
        btn.style.marginLeft = '8px';
        btn.style.fontSize = '10px';
        btn.innerHTML = '<i class="fa fa-info-circle"></i>';
        btn.title = "M360 + Webshop adatok";
        btn.onclick = (e) => { 
            e.preventDefault(); 
            e.stopPropagation();
            
            // Scrape termék adatok a sorból (termék név, link)
            const row = cell.closest('tr');
            const productData = scrapeProductFromRow(row, imei);
            
            openModal(imei, productData); 
        };
        cell.appendChild(btn);
    }
}

// Termék adatok kinyerése a táblázat sorából
function scrapeProductFromRow(row, imei) {
    const cells = row.querySelectorAll('td');
    let productName = '';
    let productLink = '';
    
    cells.forEach(cell => {
        // Termék link (raktarkezelo vagy termek)
        const link = cell.querySelector('a[href*="termek"]');
        if (link && !productName) {  // Első találat
            productName = link.textContent.trim();
            productLink = link.href;
        }
    });
    
    console.log(`📝 Scraped from row:`, { imei, productName, productLink });
    
    // IMEI-t használjuk azonosításra (nincs külön cikkszám a rendelési táblázatban)
    return { imei, productName, productLink, sku: imei };
}

// --- MODAL (visszaállítva) ---
function injectModalStructure() {
    if (document.getElementById('mp-m360-modal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'mp-m360-modal';
    modal.className = 'mp-modal-overlay';
    modal.innerHTML = `
        <div class="mp-modal-content" style="width: 800px; max-width: 95%;">
            <div class="mp-modal-header">
                <div class="mp-modal-title">
                    <span style="font-size:18px;">📱</span> Termék & Diagnosztika
                </div>
                <div class="mp-modal-close">&times;</div>
            </div>
            <div class="mp-modal-body" id="mp-modal-body-content"></div>
        </div>`;
    
    document.body.appendChild(modal);
    modal.querySelector('.mp-modal-close').onclick = closeModal;
    modal.onclick = (e) => { if (e.target === modal) closeModal(); };
}

function openModal(imei, productData) {
    const modal = document.getElementById('mp-m360-modal');
    const modalBody = document.getElementById('mp-modal-body-content');
    
    modalBody.innerHTML = `<div style="text-align:center; padding:40px;">${ICONS_V2.loading} Adatok betöltése...</div>`;
    modal.style.display = 'flex';
    
    // Lazy loading: csak most töltjük be az adatokat
    loadFullProductPanel(imei, productData);
}

function closeModal() { 
    const modal = document.getElementById('mp-m360-modal');
    modal.style.display = 'none'; 
}

// ÚJ: Teljes termékadatlap betöltése (WooCommerce + M360)
async function loadFullProductPanel(imei, productData) {
    const modalBody = document.getElementById('mp-modal-body-content');
    
    try {
        console.log(`🔄 Adatok betöltése IMEI alapján: ${imei}`);
        
        // 1. WooCommerce API hívás (IMEI alapján - ez az egyedi azonosító!)
        let wooData = null;
        try {
            // IMEI-t használjuk SKU-ként a keresésnél
            const response = await fetch(`${API_CHECK}?sku=${imei}`);
            if (response.ok) {
                const data = await response.json();
                if (data && data.id) {
                    wooData = data;
                    console.log(`✅ WooCommerce adat találva IMEI alapján: ${data.name}`);
                } else {
                    console.log(`ℹ️ Nincs WooCommerce termék ezzel az IMEI-vel: ${imei}`);
                }
            }
        } catch (error) {
            console.warn(`⚠️ WooCommerce API hiba:`, error);
        }
        
        // 2. M360 API hívás (IMEI alapján)
        const m360Data = await new Promise((resolve) => {
            const cleanImei = imei.replace(/[\s\-\/\.]/g, '');
            chrome.runtime.sendMessage({ action: "fetchM360Data", imei: cleanImei }, (response) => {
                if (response && response.success && response.data && response.data.data.records.length > 0) {
                    console.log(`✅ M360 adat találva`);
                    resolve(response.data.data.records[0]);
                } else {
                    console.log(`ℹ️ Nincs M360 adat ehhez az IMEI-hez: ${imei}`);
                    resolve(null);
                }
            });
        });
        
        // 3. Termék panel renderelése (UGYANAZ, mint a termék oldalon!)
        const panelHTML = renderFullProductPanel(wooData, m360Data, productData, imei);
        modalBody.innerHTML = panelHTML;
        
    } catch (error) {
        console.error('❌ Modal adat betöltési hiba:', error);
        modalBody.innerHTML = `
            <div style="padding:40px; text-align:center;">
                <div style="color:#c0392b; font-size:16px; margin-bottom:10px;">❌ Hiba az adatok betöltésekor</div>
                <div style="color:#999; font-size:12px;">${error.message}</div>
            </div>`;
    }
}

// TELJES TERMÉK PANEL HTML (PONTOSAN ugyanaz, mint a termék oldalon!)
function renderFullProductPanel(wooData, m360Data, productData, imei) {
    // WooCommerce adatok (ha van)
    const hasWoo = wooData && wooData.id;
    const imgUrl = hasWoo ? (wooData.image_url || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23ddd" width="150" height="150"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E') : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23ddd" width="150" height="150"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
    const productName = hasWoo ? wooData.name : (productData.productName || 'Ismeretlen termék');
    const priceDisplay = hasWoo ? (wooData.price_fmt || 'Nincs ár') : 'Nincs ár';
    const stockWP = hasWoo ? wooData.stock_wp : 0;
    const imageCount = hasWoo ? wooData.image_count : 0;
    const dateCreated = hasWoo ? (wooData.created_at || '-') : '-';
    const dateModified = hasWoo ? (wooData.modified_at || '-') : '-';
    const extraInfo = hasWoo ? wooData.extra_info : '';
    const editLink = hasWoo ? wooData.edit_link : '#';
    const permalink = hasWoo ? wooData.permalink : '#';
    
    // Raktár lokációk (ha van WooCommerce adat)
    let locationHTML = '';
    if (hasWoo && wooData.locations && wooData.locations.length > 0) {
        const locs = wooData.locations.map(loc => `<span class="mp-tag mp-tag-purple">${loc.location}: ${loc.quantity} db</span>`).join('');
        locationHTML = `<div class="mp-woo-row" style="margin-top:8px;"><div style="font-size:11px; color:#666;">Raktár:</div> ${locs}</div>`;
    }
    
    // M360 adatok
    const hasM360 = m360Data !== null;
    let m360ModelDisplay = '';
    let m360DateDisplay = '';
    let m360IdsHTML = '';
    let m360SpecsHTML = '';
    let m360WarningsHTML = '';
    let m360HistoryLink = `https://m360soft.com/dashboard/work-history?WorkHistoryFilter%5Bimei%5D=${imei}`;
    
    if (hasM360) {
        const d = m360Data;
        
        // Modell
        const modelName = d.modelName || d.marketingName || d.model;
        const modelCode = d.modelCode || d.iosRegulatoryModel || d.productCode;
        if (modelName) m360ModelDisplay += `(${modelName})`;
        if (modelCode) m360ModelDisplay += ` <span style="font-size:11px; color:#666;">[${modelCode}]</span>`;
        
        // Dátum
        const testTime = d.connectionTime ? new Date(d.connectionTime).toLocaleDateString('hu-HU') : '-';
        m360DateDisplay = `Tesztelve: <strong style="color:#0073aa;">${testTime}</strong>`;
        
        // ID-k
        const imei1 = d.imei || d.imei1;
        const imei2 = d.imei2;
        const sn = d.serial;
        const os = d.softwareVersion || d.osVersion;
        
        if (imei1) m360IdsHTML += `<div>IMEI: <b>${imei1}</b></div>`;
        if (imei2) m360IdsHTML += `<div>IMEI2: <b>${imei2}</b></div>`;
        if (sn) m360IdsHTML += `<div>SN: <b>${sn}</b></div>`;
        if (os) m360IdsHTML += `<div>OS: <b>${os}</b></div>`;
        
        // Specifikációk
        if (imei2) m360SpecsHTML += `<span class="mp-tag mp-tag-green">Dual SIM</span>`;
        
        const battHealth = d.batteryHealthPercent || d.batteryHealth;
        if (battHealth) {
            const val = parseInt(battHealth.toString().replace('%', ''));
            const colorClass = (!isNaN(val) && val < 80) ? 'mp-tag-orange' : 'mp-tag-purple';
            m360SpecsHTML += `<span class="mp-tag ${colorClass}">Ciklus: ${battHealth}%</span>`;
        }
        
        const battCycles = d.batteryCycles;
        if (battCycles && battCycles !== 0) m360SpecsHTML += `<span class="mp-tag mp-tag-purple">Ciklus: ${battCycles}</span>`;
        
        // Tárhely
        let storage = null;
        if (d.diagnosticsResults && d.diagnosticsResults.length > 0) {
            const lastDiag = d.diagnosticsResults[0];
            if (lastDiag.storage && lastDiag.storage.details && lastDiag.storage.details.total) {
                storage = lastDiag.storage.details.total;
            }
        }
        if (!storage && d.internalStorageFree) storage = `Szabad: ${d.internalStorageFree}`;
        if (storage && !storage.includes('NaN')) m360SpecsHTML += `<span class="mp-tag mp-tag-purple">${storage}</span>`;
        
        const color = d.deviceColor || d.color || d.colour;
        if (color) m360SpecsHTML += `<span class="mp-tag mp-tag-purple">${color}</span>`;
        
        const region = d.iosSalesRegion;
        if (region) m360SpecsHTML += `<span class="mp-tag mp-tag-purple">${region}</span>`;
        
        // OEM
        let badParts = [];
        if (d.oemCheckResult) {
            for (const [key, value] of Object.entries(d.oemCheckResult)) {
                if (value && typeof value === 'object' && value.isOriginal === false) {
                    badParts.push(key);
                }
            }
        }
        
        if (badParts.length > 0) {
            m360SpecsHTML += `<span class="mp-tag mp-tag-orange" title="${badParts.join(', ')}">⚠️ Nem Eredeti</span>`;
        } else {
            m360SpecsHTML += `<span class="mp-tag mp-tag-green">✔ Eredeti</span>`;
        }
        
        // SIM Lock
        const simLock = d.simLockStatus;
        if (simLock) {
            const lockClass = simLock === 'unlocked' ? 'mp-tag-green' : 'mp-tag-orange';
            const lockText = simLock === 'unlocked' ? 'Független' : simLock;
            m360SpecsHTML += `<span class="mp-tag ${lockClass}">${lockText}</span>`;
        }
        
        // Warnings (hibák)
        let failures = [];
        if (d.diagnosticsResults && d.diagnosticsResults.length > 0) {
            for (const [key, value] of Object.entries(d.diagnosticsResults[0])) {
                if (value && value.status === 'failed') failures.push(key);
            }
        }
        if (failures.length > 0) {
            m360WarningsHTML = `<div style="font-size:10px; color:#c62828; background:#ffebee; padding:4px; border-radius:3px;"><strong>Hibák:</strong> ${failures.join(', ')}</div>`;
        }
    } else {
        m360ModelDisplay = '<span style="color:#999; font-size:10px;">(Nincs M360)</span>';
        m360DateDisplay = 'Tesztelve: <strong>-</strong>';
    }
    
    // Státusz szín
    const statusColor = hasWoo ? (stockWP > 0 ? '#27ae60' : '#e67e22') : '#999';
    const statusText = hasWoo ? (stockWP > 0 ? `Webshop: ${stockWP}` : 'Nincs készleten') : 'Nincs WP kapcsolat';
    
    // TELJES PANEL HTML (PONTOSAN ugyanaz, mint a termék oldalon!)
    return `
        <div class="x_title mp-panel-title">
            <h2>Mobilpont Webshop</h2>
            <div class="mp-status-area">
                <span class="mp-status-text" style="color: ${statusColor};">${statusText}</span>
            </div>
        </div>
        
        <div class="mp-panel-body">
            <div class="mp-dashboard-grid">
                
                <div class="mp-col-media">
                    <img src="${imgUrl}" alt="Kép">
                    <div style="font-size:9px; color:#999;">${imageCount} db kép feltöltve</div>
                </div>

                <div class="mp-col-data">
                    <div class="mp-name-full">
                        ${productName} 
                        <span style="color:#8e44ad; font-weight:400; font-size:12px; margin-left:5px;">
                            ${m360ModelDisplay}
                        </span>
                    </div>

                    <div class="mp-meta-row">
                        <div class="mp-meta-item">Feltöltve: <strong>${dateCreated}</strong></div>
                        <div style="color:#ddd;">|</div>
                        <div class="mp-meta-item">Frissítve: <strong>${dateModified}</strong></div>
                        <div style="color:#ddd;">|</div>
                        <div class="mp-meta-item">${m360DateDisplay}</div>
                    </div>

                    <div class="mp-woo-row">
                        <div>Ár: <span class="mp-woo-val">${priceDisplay}</span></div>
                        <div>Webshop: <span class="mp-woo-val" style="color: ${stockWP > 0 ? 'green' : 'red'};">${stockWP} db</span></div>
                    </div>
                    
                    ${locationHTML}

                    <div class="mp-id-row">${m360IdsHTML}</div>
                    <div class="mp-spec-row">${m360SpecsHTML}</div>
                    ${m360WarningsHTML}
                    
                    ${extraInfo ? `<div style="font-size:10px; color:#888; margin-top:5px;">Egyéb: ${extraInfo}</div>` : ''}
                </div>

                <div class="mp-col-controls">
                    <a href="${m360HistoryLink}" target="_blank" class="mp-btn mp-btn-m360">${ICONS.history} Előzmények</a>
                    ${hasWoo ? `<a href="${editLink}" target="_blank" class="mp-btn mp-btn-wp">${ICONS.edit} Szerkesztés</a>` : ''}
                    ${hasWoo ? `<a href="${permalink}" target="_blank" class="mp-btn mp-btn-view">${ICONS.view} Megtekintés</a>` : ''}
                </div>

            </div>
        </div>
    `;
}

// ============================================================================
// EGYSÉGES MEGJELENÍTŐ MOTOR (Unified Card Renderer)
// ============================================================================

function loadM360DataGeneric(rawImei, containerId, containerElement = null) {
    const cleanImei = rawImei.replace(/[\s\-\/\.]/g, ''); 
    let targetEl = containerElement || document.getElementById(containerId);
    if (!targetEl) return;

    // Timeout védelem
    let isTimedOut = false;
    const timeoutId = setTimeout(() => {
        isTimedOut = true;
        if(targetEl.innerHTML.includes('svg')) {
            targetEl.innerHTML = "<div style='padding:15px; color:#c0392b; text-align:center;'>⏱️ Időtúllépés: Az M360 nem válaszol.</div>";
        }
    }, 5000);

    chrome.runtime.sendMessage({ action: "fetchM360Data", imei: cleanImei }, (response) => {
        if (isTimedOut) return;
        clearTimeout(timeoutId);

        if (chrome.runtime.lastError) {
            targetEl.innerHTML = `<div style='padding:15px; color:#c0392b; text-align:center;'>⚠️ Hiba: ${chrome.runtime.lastError.message}</div>`;
            return;
        }

        if (!response || !response.success || !response.data || !response.data.data || !response.data.data.records || response.data.data.records.length === 0) {
            targetEl.innerHTML = `<div style='padding:15px; color:#999; text-align:center;'>❌ Nincs M360 adat (${cleanImei}).</div>`;
            return; 
        }

        try {
            const d = response.data.data.records[0];
            // ITT HÍVJUK AZ ÚJ RENDERELŐT
            targetEl.innerHTML = renderUnifiedCard(d, cleanImei);
        } catch (err) {
            console.error(err);
            targetEl.innerHTML = `<div style='padding:15px; color:#c0392b; text-align:center;'>⚠️ Megjelenítési hiba.</div>`;
        }
    });
}

function renderUnifiedCard(d, searchedImei) {
    const modelName = d.modelName || d.marketingName || 'Ismeretlen Modell';
    const modelCode = d.modelCode || d.productCode || '';
    
    // Dátum és Tesztelési Állapot Logika
    let dateStr = '-';
    let isTested = false;
    
    if (d.connectionTime) {
        try { 
            const testDate = new Date(d.connectionTime);
            // Ha érvényes dátum és nem 1970 (néha 0 timestamp jön)
            if (testDate.getFullYear() > 2000) {
                dateStr = testDate.toLocaleDateString('hu-HU');
                isTested = true;
            }
        } catch(e){} 
    }

    // Dátum HTML: Ha nincs tesztelve, feltűnő figyelmeztetés!
    let dateHtml = '';
    if (isTested) {
        dateHtml = `<div class="mp-meta-item" style="color:#0073aa;">Tesztelve: <strong>${dateStr}</strong></div>`;
    } else {
        dateHtml = `<div class="mp-meta-item"><span class="mp-status-warning" style="margin-left:0;">⚠️ MÉG NEM TESZTELTÉK</span></div>`;
    }
    // Akku
    const batHealthVal = d.batteryHealthPercent || d.batteryHealth;
    const batHealth = batHealthVal ? batHealthVal.toString().replace('%','') : '-';
    const batClass = (batHealth !== '-' && parseInt(batHealth) < 80) ? 'mp-tag-orange' : 'mp-tag-purple';
    
    // Link
    const linkImei = d.imei || d.imei1 || searchedImei;
    const historyLink = `https://m360soft.com/dashboard/work-history?WorkHistoryFilter%5Bimei%5D=${linkImei}`;

    // Tárhely
    let storageInfo = '';
    if (d.storage && d.storage.details && d.storage.details.total) storageInfo = d.storage.details.total;
    else if (d.internalStorageFree) storageInfo = `Szabad: ${d.internalStorageFree}`;

    // OEM
    let oemBadge = '';
    let isOriginal = true;
    if (d.oemCheckResult) {
         let badParts = [];
         for (const [key, value] of Object.entries(d.oemCheckResult)) {
            if (value && typeof value === 'object' && value.isOriginal === false) badParts.push(key);
        }
        if (badParts.length > 0) {
            oemBadge = `<span class="mp-tag mp-tag-orange" title="${badParts.join(', ')}">⚠️ Nem Eredeti</span>`;
            isOriginal = false;
        } else {
            oemBadge = `<span class="mp-tag mp-tag-green">✔ Eredeti</span>`;
        }
    }

    // Specifikációk HTML
    let specsHtml = '';
    if (batHealth !== '-') specsHtml += `<span class="mp-tag ${batClass}">Akku: ${batHealth}%</span>`;
    if (d.batteryCycles) specsHtml += `<span class="mp-tag mp-tag-purple">Ciklus: ${d.batteryCycles}</span>`;
    if (storageInfo) specsHtml += `<span class="mp-tag mp-tag-purple">${storageInfo}</span>`;
    specsHtml += oemBadge;
    specsHtml += `<span class="mp-tag mp-tag-${d.simLockStatus === 'unlocked' ? 'green' : 'orange'}">${d.simLockStatus === 'unlocked' ? 'Független' : (d.simLockStatus || 'Ismeretlen')}</span>`;

    // ID sor
    let idsHtml = `<div>IMEI: <b>${linkImei}</b></div>`;
    if (d.serial) idsHtml += `<div>SN: <b>${d.serial}</b></div>`;
    if (d.osVersion) idsHtml += `<div>OS: <b>${d.osVersion}</b></div>`;

    // Hibák
    let warningsHtml = renderFailures(d);

    // KÉP (Mivel szerviz/rendelés, nincs WP kép, ezért placeholder)
    // De a layout ugyanaz marad: mp-col-media
    const imageHtml = `
        <div class="mp-col-media" style="display:flex; align-items:center; justify-content:center; background:#f9f9f9; border:1px solid #eee; border-radius:4px; height:80px; width:80px;">
            ${ICONS_V2.placeholder_phone}
        </div>
    `;

    // 2. HTML ÖSSZEÁLLÍTÁS (A "Szép" struktúra alapján)
    return `
        <div class="x_title mp-panel-title">
            <h2>M360 Diagnosztika</h2>
            <div class="mp-status-area">
                <span class="mp-status-text" style="color: ${isOriginal ? '#27ae60' : '#e67e22'};">${isOriginal ? 'Állapot: OK' : 'Figyelmeztetés'}</span>
            </div>
        </div>
        
        <div class="mp-panel-body">
            <div class="mp-dashboard-grid">
                
                ${imageHtml} <div class="mp-col-data">
                    <div class="mp-name-full">
                        ${modelName} 
                        <span style="color:#8e44ad; font-weight:400; font-size:12px; margin-left:5px;">
                            <span style="font-size:11px; color:#666;">[${modelCode}]</span>
                        </span>
                    </div>

                    <div class="mp-meta-row">
                        ${dateHtml} <div style="color:#ddd;">|</div>
                        <div class="mp-meta-item">Szín: <strong>${d.color || '-'}</strong></div>
                    </div>

                    <div class="mp-id-row">${idsHtml}</div>
                    <div class="mp-spec-row">${specsHtml}</div>
                    <div style="margin-top:8px;">${warningsHtml}</div>
                </div>

                <div class="mp-col-controls">
                    <a href="${historyLink}" target="_blank" class="mp-btn mp-btn-m360">
                        ${ICONS_V2.loading.replace('animation: spin 1s linear infinite;', '') /* statikus ikon trükk */} Előzmények
                    </a>
                </div>

            </div>
        </div>
    `;
}

function renderFailures(d) {
    let failures = [];
    if (d.diagnosticsResults && d.diagnosticsResults.length > 0) {
        for (const [key, value] of Object.entries(d.diagnosticsResults[0])) { 
            if (value && value.status === 'failed') failures.push(key); 
        }
    }
    if (failures.length > 0) {
        return `<div style="font-size:10px; color:#c62828; background:#ffebee; padding:4px; border-radius:3px;"><strong>Hibák:</strong> ${failures.join(', ')}</div>`;
    }
    return '';
}

// ============================================================================
// 3. TERMÉK OLDAL (EREDETI KÓD)
// ============================================================================
function initProductPage(rightCol) {
    if (document.querySelector('#mp-ovip-panel')) return;
    
    // Cikkszám vágólap gomb injektálása
    injectClipboardButtonToSku();
    
    startProcess(rightCol); 
}

// ============================================================================
// CIKKSZÁM VÁGÓLAP GOMB (TERMÉK OLDAL)
// ============================================================================
function injectClipboardButtonToSku() {
    const skuInput = document.getElementById('cikkszam');
    if (!skuInput) return;
    
    // Keressük meg a label-t
    const formGroup = skuInput.closest('.form-group');
    if (!formGroup) return;
    
    const label = formGroup.querySelector('label');
    if (!label || label.querySelector('.mp-clipboard-btn')) return;  // Ne duplikáljuk
    
    const sku = skuInput.value.trim();
    if (!sku) return;
    
    // Vágólap gomb létrehozása (ugyanolyan, mint a munkáknál)
    const clipboardBtn = document.createElement('a');
    clipboardBtn.className = 'fa fa-clone text-warning mp-clipboard-btn';
    clipboardBtn.title = 'Másolás vágólapra';
    clipboardBtn.style.marginLeft = '8px';
    clipboardBtn.style.cursor = 'pointer';
    clipboardBtn.onclick = () => {
        copyToClipboard(sku);
        // Vizuális feedback
        clipboardBtn.className = 'fa fa-check text-success mp-clipboard-btn';
        setTimeout(() => {
            clipboardBtn.className = 'fa fa-clone text-warning mp-clipboard-btn';
        }, 1500);
    };
    
    label.appendChild(clipboardBtn);
    console.log('✅ Cikkszám vágólap gomb injektálva');
}

// Vágólapra másolás helper
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            console.log(`📋 Vágólapra másolva: ${text}`);
        }).catch(err => {
            console.error('❌ Vágólap hiba:', err);
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

// Fallback vágólapra másolás (régi böngészőknek)
function fallbackCopyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        console.log(`📋 Vágólapra másolva (fallback): ${text}`);
    } catch (err) {
        console.error('❌ Vágólap fallback hiba:', err);
    }
    document.body.removeChild(textarea);
}

// ... (ITT KÖVETKEZNEK A RÉGI FÜGGVÉNYEK: startProcess, updatePanelSuccess stb.) ...
// KÉRLEK, EZEKET A RÉSZEKET MÁSOLD VISSZA A KORÁBBI FÁJLODBÓL VAGY A LENTI BLOKKBÓL!

// A teljesség kedvéért, itt vannak a szükséges régiek (rövidítve, hogy elférjen, de te a teljeset használd):
const API_CHECK = "https://mobilpontszeged.hu/wp-json/mp-ovip/v1/check";
const API_UPDATE = "https://mobilpontszeged.hu/wp-json/mp-ovip/v1/update-locations";
let isSyncing = false;
const ICONS = {
    m360: `<svg viewBox="0 0 24 24" width="13" height="13"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14zM16 13h-3V8h-2v5H8l4 4 4-4z"/></svg>`, 
    edit: `<svg viewBox="0 0 24 24" width="13" height="13"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`, 
    view: `<svg viewBox="0 0 24 24" width="13" height="13"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`, 
    check: `<svg viewBox="0 0 24 24" fill="#28a745" width="12" height="12"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`, 
    loading: `<svg viewBox="0 0 24 24" width="16" height="16" style="animation: spin 1s linear infinite; fill:#0073aa;"><path d="M12 4V2C6.48 2 2 6.48 2 12h2c0-4.41 3.59-8 8-8z"/></svg>`,
    refresh: `<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>`,
    sync: `<svg viewBox="0 0 24 24" width="13" height="13"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>`,
    error: `<svg viewBox="0 0 24 24" fill="#dc3545" width="14" height="14"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>`,
    history: `<svg viewBox="0 0 24 24" width="13" height="13"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>`
};
const style = document.createElement('style');
style.innerHTML = `
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .mp-loading-pulse { animation: pulse 1.5s infinite; color:#999; }
    @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
    .mp-tag { display:inline-block; padding:3px 7px; border-radius:4px; font-size:11px; font-weight:700; margin: 0 4px 4px 0; white-space: nowrap; }
    .mp-tag-purple { background:#f3e5f5; color:#8e44ad; border:1px solid #e1bee7; }
    .mp-tag-green { background:#e8f5e9; color:#2e7d32; border:1px solid #c8e6c9; }
    .mp-tag-red { background:#ffebee; color:#c62828; border:1px solid #ffcdd2; }
    .mp-tag-orange { background:#fff3e0; color:#ef6c00; border:1px solid #ffe0b2; }
    .mp-dashboard-grid { display: grid; grid-template-columns: 85px 1fr 170px; gap: 20px; align-items: stretch; }
    .mp-col-media { text-align: center; border-right: 1px dashed #eee; padding-right: 15px; display:flex; flex-direction:column; justify-content:flex-start; }
    .mp-col-media img { width: 100%; border-radius: 4px; border: 1px solid #e0e0e0; padding: 2px; background: #fff; margin-bottom: 5px; }
    .mp-col-data { padding-right: 15px; display: flex; flex-direction: column; gap: 12px; }
    .mp-name-full { font-size: 15px; font-weight: 800; color: #333; line-height: 1.3; }
    .mp-meta-row { display:flex; gap:15px; font-size:10px; color:#777; border-bottom:1px solid #f5f5f5; padding-bottom:8px; }
    .mp-meta-item { display:flex; align-items:center; gap:4px; }
    .mp-meta-item strong { color:#444; }
    .mp-woo-row { display:flex; gap:20px; font-size:11px; align-items:center; }
    .mp-woo-val { font-weight:700; color:#333; font-size:12px; }
    .mp-id-row { font-size: 11px; color: #555; font-family: monospace; display: flex; flex-wrap: wrap; gap: 15px; }
    .mp-id-item strong { color:#000; }
    .mp-col-controls { display: flex; flex-direction: column; gap: 10px; padding-left:15px; border-left:1px dashed #eee; justify-content: flex-end; }
    .mp-btn { width: 100%; padding: 5px 15px; display: flex; align-items: center; justify-content: center; border-radius: 4px; text-decoration: none !important; font-size: 11px; font-weight: 700; color: white !important; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: none; cursor: pointer; text-transform:uppercase; gap:6px; }
    .mp-btn:hover { opacity: 0.9; transform: translateY(-1px); }
    .mp-btn-m360 { background-color: #8e44ad; border: 1px solid #7d3c98; }
    .mp-btn-wp { background-color: #0073aa; border: 1px solid #006799; }
    .mp-btn-view { background-color: #555; border: 1px solid #444; }
`;
document.head.appendChild(style);

async function startProcess(container) {
    const skuInput = document.getElementById('cikkszam');
    const sku = skuInput ? skuInput.value.trim() : null;
    if (!sku) return;

    const panel = createPanelElement();
    container.insertBefore(panel, container.firstChild);

    panel.innerHTML = `
        <div class="x_title mp-panel-title">
            <h2>Mobilpont</h2>
            <div class="mp-status-area"><span style="color:#0073aa;">${ICONS.loading}</span></div>
        </div>
        <div class="mp-panel-body" style="display:flex; align-items:center; justify-content:center; gap:8px; height:80px; color:#666;">
            ${ICONS.loading} Adatok betöltése...
        </div>
    `;

    try {
        const response = await fetch(`${API_CHECK}?sku=${sku}`);
        if (!response.ok) throw new Error("API Hiba");
        const data = await response.json();
        
        if (data && data.id) updatePanelSuccess(panel, data, sku);
        else updatePanelNotFound(panel, sku);
    } catch (error) {
        console.error("Hiba:", error);
        updatePanelNotFound(panel, sku);
    }
}

function createPanelElement() {
    const div = document.createElement('div');
    div.className = 'x_panel'; 
    div.id = 'mp-ovip-panel';
    div.style.marginBottom = '15px'; 
    return div;
}

function updatePanelSuccess(panel, data, sku) {
    const m360Link = generateM360Link(sku);
    const imgUrl = data.image_url || 'https://via.placeholder.com/80?text=No+Img';
    const priceDisplay = data.price_fmt || 'Nincs ár';
    
    const dateCreated = data.created_at || '-';
    const dateModified = data.modified_at || '-';

    panel.innerHTML = `
        <div class="x_title mp-panel-title">
            <h2>Mobilpont Webshop</h2>
            <div class="mp-status-area">
                <span id="mp-status-text" class="mp-status-text">Csatlakozva</span>
                <div id="mp-manual-sync" class="mp-refresh-icon" title="Kézi frissítés">${ICONS.refresh}</div>
            </div>
        </div>
        
        <div class="mp-panel-body">
            <div class="mp-dashboard-grid">
                
                <div class="mp-col-media">
                    <img src="${imgUrl}" alt="Kép">
                    <div style="font-size:9px; color:#999;">${data.image_count} db kép feltöltve</div>
                </div>

                <div class="mp-col-data">
                    <div class="mp-name-full">
                        ${data.name} 
                        <span id="mp-m360-model" style="color:#8e44ad; font-weight:400; font-size:12px; margin-left:5px;">
                            <span class="mp-loading-pulse">M360...</span>
                        </span>
                    </div>

                    <div class="mp-meta-row">
                        <div class="mp-meta-item">Feltöltve: <strong>${dateCreated}</strong></div>
                        <div style="color:#ddd;">|</div>
                        <div class="mp-meta-item">Frissítve: <strong>${dateModified}</strong></div>
                        <div style="color:#ddd;">|</div>
                        <div class="mp-meta-item" id="mp-m360-date">
                            <span class="mp-loading-pulse" style="font-size:9px;">Teszt dátum...</span>
                        </div>
                    </div>

                    <div class="mp-woo-row">
                        <div>Ár: <span class="mp-woo-val">${priceDisplay}</span></div>
                        <div>Webshop: <span class="mp-woo-val" style="color: ${data.stock_wp > 0 ? 'green' : 'red'};">${data.stock_wp} db</span></div>
                    </div>

                    <div id="mp-m360-ids" class="mp-id-row"></div>
                    <div id="mp-m360-specs" class="mp-spec-row"></div>
                    <div id="mp-m360-warnings"></div>
                    
                    ${data.extra_info ? `<div style="font-size:10px; color:#888; margin-top:5px;">Egyéb: ${data.extra_info}</div>` : ''}
                </div>

                <div class="mp-col-controls">
                    <a href="${m360Link}" target="_blank" class="mp-btn mp-btn-m360">${ICONS.history} Előzmények</a>
                    <a href="${data.edit_link}" target="_blank" class="mp-btn mp-btn-wp">${ICONS.edit} Szerkesztés</a>
                    <a href="${data.permalink}" target="_blank" class="mp-btn mp-btn-view">${ICONS.view} Megtekintés</a>
                </div>

            </div>
        </div>
    `;

    document.getElementById('mp-manual-sync').addEventListener('click', function() { syncStockToWebshop(sku, false); });

    setTimeout(() => {
        if (document.visibilityState === 'visible') {
            syncStockToWebshop(sku, true);
            loadM360Data(sku); 
        }
    }, 1000);
}

function updatePanelNotFound(panel, sku) {
    const m360Link = generateM360Link(sku);
    const searchLink = `https://mobilpontszeged.hu/wp-admin/edit.php?s=${sku}&post_status=all&post_type=product`;
    panel.innerHTML = `
        <div class="x_title mp-panel-title"><h2>Mobilpont Webshop</h2></div>
        <div class="mp-panel-body">
            <div style="color: #dc3545; font-weight: bold; margin-bottom: 8px; text-align: center; font-size:12px;">${ICONS.error} Nincs szinkronban</div>
            <div class="mp-col-buttons" style="justify-content:center; display:flex; gap:10px;">
                <a href="${m360Link}" target="_blank" class="mp-btn mp-btn-m360">${ICONS.history} M360</a>
                <a href="${searchLink}" target="_blank" class="mp-btn mp-btn-wp">${ICONS.search} Keresés WP</a>
            </div>
        </div>`;
}

function loadM360Data(rawImei) {
    const cleanImei = rawImei.replace(/[\s\-\/\.]/g, ''); 
    chrome.runtime.sendMessage({ action: "fetchM360Data", imei: cleanImei }, (response) => {
        if (!response || !response.success || !response.data || !response.data.data.records.length) {
            document.getElementById('mp-m360-model').innerHTML = "<span style='color:#999; font-size:10px;'>(Nincs M360)</span>";
            document.getElementById('mp-m360-date').innerHTML = "Tesztelve: <strong>-</strong>";
            return; 
        }
        if (response.data.data.records.length > 0) {
            injectM360Data(response.data.data.records[0]);
        }
    });
}

function injectM360Data(d) {
    // 1. MODELL
    const modelName = d.modelName || d.marketingName || d.model;
    const modelCode = d.modelCode || d.iosRegulatoryModel || d.productCode;
    let modelDisplay = "";
    if (isValid(modelName)) modelDisplay += `(${modelName})`;
    if (isValid(modelCode)) modelDisplay += ` <span style="font-size:11px; color:#666;">[${modelCode}]</span>`; 
    document.getElementById('mp-m360-model').innerHTML = modelDisplay;

    // 2. ID-k
    const imei = d.imei || d.imei1;
    const imei2 = d.imei2;
    const sn = d.serial;
    const os = d.softwareVersion || d.osVersion;
    
    let idsHtml = '';
    if(isValid(imei)) idsHtml += `<div>IMEI: <b>${imei}</b></div>`;
    if(isValid(imei2)) idsHtml += `<div>IMEI2: <b>${imei2}</b></div>`;
    if(isValid(sn)) idsHtml += `<div>SN: <b>${sn}</b></div>`;
    if(isValid(os)) idsHtml += `<div>OS: <b>${os}</b></div>`;
    
    document.getElementById('mp-m360-ids').innerHTML = idsHtml;

    // Dátum
    const testTime = d.connectionTime ? new Date(d.connectionTime).toLocaleDateString('hu-HU') : '-';
    document.getElementById('mp-m360-date').innerHTML = `Tesztelve: <strong style="color:#0073aa;">${testTime}</strong>`;

    // 3. SPECIFIKÁCIÓK
    const specsContainer = document.getElementById('mp-m360-specs');
    let specsHtml = '';

    if (isValid(imei2)) specsHtml += `<span class="mp-tag mp-tag-green">Dual SIM</span>`;

    const battHealth = d.batteryHealthPercent || d.batteryHealth;
    if(isValid(battHealth)) {
        let valStr = battHealth.toString().replace('%', ''); 
        const val = parseInt(valStr);
        const colorClass = (!isNaN(val) && val < 80) ? 'mp-tag-orange' : 'mp-tag-purple';
        specsHtml += `<span class="mp-tag ${colorClass}">Akku: ${valStr}%</span>`;
    }
    const battCycles = d.batteryCycles;
    if(isValid(battCycles) && battCycles !== 0) specsHtml += `<span class="mp-tag mp-tag-purple">Ciklus: ${battCycles}</span>`;

    // Tárhely/RAM
    const formatBytes = (bytes) => (!bytes || isNaN(bytes)) ? null : Math.round(bytes / (1024*1024*1024)) + ' GB';
    let storage = null;
    if (d.diagnosticsResults && d.diagnosticsResults.length > 0) {
        const lastDiag = d.diagnosticsResults[0];
        if (lastDiag.storage && lastDiag.storage.details && lastDiag.storage.details.total) storage = lastDiag.storage.details.total; 
    }
    if ((!storage || storage.includes('NaN')) && d.internalStorageFree) storage = `Szabad: ${d.internalStorageFree}`;
    if(isValid(storage) && !storage.includes('NaN')) specsHtml += `<span class="mp-tag mp-tag-purple">${storage}</span>`;
    
    const ram = d.totalRAMSize ? formatBytes(d.totalRAMSize) : null;
    if(isValid(ram)) specsHtml += `<span class="mp-tag mp-tag-purple">RAM: ${ram}</span>`;

    const color = d.deviceColor || d.color || d.colour;
    if(isValid(color)) specsHtml += `<span class="mp-tag mp-tag-purple">${color}</span>`;
    const region = d.iosSalesRegion;
    if(isValid(region)) specsHtml += `<span class="mp-tag mp-tag-purple">${region}</span>`;

    // OEM
    let badParts = [];
    if (d.oemCheckResult) {
        for (const [key, value] of Object.entries(d.oemCheckResult)) {
            if (value && typeof value === 'object' && value.isOriginal === false) badParts.push(key);
        }
    }
    if(badParts.length > 0) specsHtml += `<span class="mp-tag mp-tag-orange" title="${badParts.join(', ')}">⚠️ Nem Eredeti</span>`;
    else if (d.oemCheckResult) specsHtml += `<span class="mp-tag mp-tag-green">✔ Eredeti</span>`;

    if(d.simLockStatus === 'unlocked') specsHtml += `<span class="mp-tag mp-tag-green">Független</span>`;
    else if (isValid(d.simLockStatus) && d.simLockStatus !== 'unknown') specsHtml += `<span class="mp-tag mp-tag-orange">${d.simLockStatus}</span>`;

    specsContainer.innerHTML = specsHtml;

    // HIBÁK
    const warningsContainer = document.getElementById('mp-m360-warnings');
    let warnHtml = '';
    let failures = [];
    if (d.diagnosticsResults && d.diagnosticsResults.length > 0) {
        const lastDiag = d.diagnosticsResults[0];
        for (const [key, value] of Object.entries(lastDiag)) {
            if (value && value.status === 'failed') failures.push(key);
        }
    }
    if(failures.length > 0) warnHtml += `<div style="font-size:10px; color:#c62828; background:#ffebee; padding:3px; border-radius:3px; margin-bottom:4px;"><strong>Hibás:</strong> ${failures.join(', ')}</div>`;
    if(d.gradingResult && d.gradingResult.notes) warnHtml += `<div style="font-size:10px; color:#555; background:#f5f5f5; padding:3px; border-radius:3px; font-style:italic;">📝 ${d.gradingResult.notes}</div>`;
    warningsContainer.innerHTML = warnHtml;
}

function isValid(val) {
    if (val === null || val === undefined) return false;
    if (typeof val === 'string' && (val.trim() === '' || val === '-' || val === 'unknown' || val === '0 GB' || val.includes('NaN'))) return false;
    return true;
}

// --- RAKTÁR SZINKRON ---
async function syncStockToWebshop(sku, isAuto) {
    if (isSyncing && isAuto) return;
    isSyncing = true;
    const statusTextEl = document.getElementById('mp-status-text');
    const refreshIconEl = document.getElementById('mp-manual-sync');

    if(statusTextEl) { statusTextEl.innerHTML = "Szinkronizálás..."; statusTextEl.style.color = "#0073aa"; }
    if(refreshIconEl) { refreshIconEl.innerHTML = ICONS.loading; refreshIconEl.style.pointerEvents = 'none'; refreshIconEl.style.opacity = '0.5'; }

    let stockData = { 'Sajka': 0, 'Makó': 0, 'Somogyi': 0 };
    let foundPanel = false;

    try {
        const allPanels = document.querySelectorAll('.x_panel');
        for (let panel of allPanels) {
            const title = panel.querySelector('.x_title h2');
            if (title && title.innerText.includes('Készlet')) {
                foundPanel = true;
                const content = panel.querySelector('.x_content');
                if (content) {
                    const spans = content.querySelectorAll('span');
                    spans.forEach(span => {
                        const name = span.innerText.trim();
                        if (['Somogyi', 'Makó', 'Sajka'].some(w => name.includes(w))) {
                            let nextEl = span.nextElementSibling;
                            while(nextEl && !nextEl.classList.contains('row')) { nextEl = nextEl.nextElementSibling; }
                            if (nextEl) {
                                const countSpan = nextEl.querySelector('.progress-bar span');
                                if (countSpan) {
                                    let count = parseInt(countSpan.innerText.trim());
                                    if (!isNaN(count)) {
                                        if (name.includes('Sajka')) stockData['Sajka'] = count;
                                        if (name.includes('Makó')) stockData['Makó'] = count;
                                        if (name.includes('Somogyi')) stockData['Somogyi'] = count;
                                    }
                                }
                            }
                        }
                    });
                }
                break;
            }
        }

        if (!foundPanel) { if (!isAuto) { alert('HIBA: Nem találom a "Készlet" dobozt.'); throw new Error("Készlet doboz hiányzik"); } }

        if (!isAuto) {
            await new Promise(r => setTimeout(r, 100)); 
            const confirmMsg = `Készletek:\nSajka: ${stockData['Sajka']}\nMakó: ${stockData['Makó']}\nSomogyi: ${stockData['Somogyi']}\n\nMehet a frissítés?`;
            if (!confirm(confirmMsg)) { if(statusTextEl) statusTextEl.innerHTML = "Megszakítva"; return; }
        }

        const response = await fetch(API_UPDATE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sku: sku, stocks: stockData })
        });
        const resData = await response.json();

        if (response.ok && resData.success) {
            let parts = [];
            if(stockData['Sajka'] > 0) parts.push(`Sajka: ${stockData['Sajka']}`);
            if(stockData['Makó'] > 0) parts.push(`Makó: ${stockData['Makó']}`);
            if(stockData['Somogyi'] > 0) parts.push(`Somogyi: ${stockData['Somogyi']}`);
            let successText = parts.length > 0 ? parts.join(', ') : "Nincs készleten";
            if(statusTextEl) { statusTextEl.innerHTML = successText; statusTextEl.style.color = "#27ae60"; }
        } else { throw new Error('Szerver hiba'); }

    } catch (e) {
        console.error("Sync Error:", e);
        if(statusTextEl) { statusTextEl.innerHTML = isAuto ? "Sync Hiba" : "Hiba!"; statusTextEl.style.color = "#c0392b"; }
        if (!isAuto) alert('Hiba történt: ' + e.message);
    } finally {
        isSyncing = false;
        if(refreshIconEl) { refreshIconEl.innerHTML = ICONS.refresh; refreshIconEl.style.pointerEvents = 'auto'; refreshIconEl.style.opacity = '1'; }
    }
}

function generateM360Link(sku) {
    return `https://m360soft.com/dashboard/work-history?WorkHistoryFilter%5BconnectionTimeMin%5D=&WorkHistoryFilter%5BconnectionTimeMax%5D=&WorkHistoryFilter%5BoperatorId%5D=&WorkHistoryFilter%5Bimei%5D=${sku}`;
}

// VÉGSŐ INDÍTÁS
if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { setTimeout(init, 1000); }

// ============================================================================
// ÚJ TAB MEGNYITÁS - RENDELÉSEK ÉS TERMÉKEK TÁBLÁZATBAN
// ============================================================================

function enableNewTabClicksOnTables() {
    const url = window.location.href;
    
    // 1. RENDELÉSEK TÁBLÁZAT
    if (url.includes('/rendelesek/')) {
        const rows = document.querySelectorAll('tr.pointer');
        rows.forEach(row => {
            // Keressük meg a rendelés ID-t
            const idMatch = row.innerHTML.match(/rendelesbeLepes\((\d+)/);
            if (!idMatch) return;
            
            const orderId = idMatch[1];
            const targetURL = `?id=${orderId}&kereses=ok&datum_tol=2025-09-30`;
            
            // Minden kattintható cellához event listener
            const cells = row.querySelectorAll('td.belepo_sor');
            cells.forEach(cell => {
                // Középső gomb kattintás és Ctrl+Click kezelése
                cell.addEventListener('mousedown', (e) => {
                    if (e.button === 1) { // Középső gomb
                        e.preventDefault();
                        window.open(targetURL, '_blank');
                    }
                });
                
                cell.addEventListener('click', (e) => {
                    if (e.ctrlKey || e.metaKey) { // Ctrl+Click vagy Cmd+Click (Mac)
                        e.preventDefault();
                        window.open(targetURL, '_blank');
                    }
                });
                
                // Tooltip hozzáadása
                cell.title = 'Középső gomb vagy Ctrl+Click új tabban nyitja meg';
            });
        });
        console.log(`✅ ${rows.length} rendelés sor: új tab funkció hozzáadva`);
    }
    
    // 2. TERMÉKEK TÁBLÁZAT (Raktárkezelő)
    if (url.includes('raktarkezelo')) {
        const rows = document.querySelectorAll('tr.pointer, tbody tr');  // Minden kattintható sor
        let productRowCount = 0;
        
        rows.forEach(row => {
            // Keressük meg a termék ID-t
            const idMatch = row.innerHTML.match(/termek_id=(\d+)/);
            if (!idMatch) return;
            
            const productId = idMatch[1];
            // Megőrizzük az URL paramétereket (sorrend, keresés, stb.)
            const currentParams = window.location.search;
            const targetURL = `?termek_id=${productId}${currentParams.slice(1) ? '&' + currentParams.slice(1) : ''}`;
            
            // MINDEN TD cellához event listener (nem csak .belepo_sor!)
            const cells = row.querySelectorAll('td');
            cells.forEach(cell => {
                // Skip action buttons (gombok, ikonok)
                if (cell.querySelector('a.btn, button, input')) return;
                
                cell.style.cursor = 'pointer';  // Kurzor változtatás
                
                cell.addEventListener('mousedown', (e) => {
                    if (e.button === 1) { // Középső gomb
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(targetURL, '_blank');
                    }
                });
                
                cell.addEventListener('click', (e) => {
                    if (e.ctrlKey || e.metaKey) { // Ctrl+Click
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(targetURL, '_blank');
                    }
                });
                
                cell.title = 'Középső gomb vagy Ctrl+Click új tabban nyitja meg';
            });
            
            productRowCount++;
        });
        console.log(`✅ ${productRowCount} termék sor: új tab funkció hozzáadva (raktárkezelő)`);
    }
}

// Késleltetett indítás (hogy a táblázat biztosan betöltődjön)
setTimeout(() => {
    enableNewTabClicksOnTables();
}, 1500);

// ============================================================================
// CÍMKENYOMTATÁS FUNKCIÓK
// ============================================================================

// ============================================================================
// CÍMKENYOMTATÁS GOMBOK (CHAMELEON MODE - OPCIONÁLIS)
// ============================================================================

// --- GOMB INJEKTÁLÁS: SZERVIZ MUNKALAP ---
function injectPrintButtonService() {
    const buttonContainer = document.querySelector('.x_content .btn-group');
    if (!buttonContainer || document.getElementById('mp-print-btn-service')) return;

    console.log("🖨️ Print Button injektálása (Szerviz) - .btn-app stílus");

    const OVIPStyles = window.ChameleonCore?.OVIPStyles;
    
    // MANUAL .btn-app létrehozása (nem ChameleonButton.create!)
    // Az OVIP .btn-app struktúrája: Icon BLOCK (felül) + Text (alul)
    const printBtn = document.createElement('a');
    printBtn.id = 'mp-print-btn-service';
    printBtn.className = 'btn btn-default btn-app';
    printBtn.title = 'Mobilpont címke nyomtatása';
    printBtn.style.cursor = 'pointer';
    
    // OVIP NATÍV STRUKTÚRA: Icon display:block (felül), szöveg alul
    printBtn.innerHTML = `
        <i class="fa fa-print" style="display:block; margin:0 auto 5px auto; font-size:16px;"></i>
        Címke
    `;
    
    printBtn.onclick = () => mobilpontPrintLabel('service');
    
    // Chameleon: Scrape natív .btn-app stílust (ha elérhető)
    if (OVIPStyles) {
        console.log("🎭 Chameleon: .btn-app stílus scraping");
        const btnAppStyle = OVIPStyles.scrape('.btn-app');
        Object.entries(btnAppStyle).forEach(([key, value]) => {
            const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
            printBtn.style[camelKey] = value;
        });
    }

    // Beszúrás a Trello gomb elé (ha van) vagy a végére
    const trelloBtn = document.getElementById('mobilpont-trello-container');
    if (trelloBtn && trelloBtn.parentElement === buttonContainer.parentElement) {
        trelloBtn.before(printBtn);
    } else {
        buttonContainer.parentElement.appendChild(printBtn);
    }

    console.log('✅ Print gomb injektálva (Szerviz) - OVIP natív .btn-app');
}

// --- GOMB INJEKTÁLÁS: RENDELÉS OLDAL ---
function injectPrintButtonOrder() {
    const buttonGroup = document.querySelector('.btn-group.pull-right');
    if (!buttonGroup || document.getElementById('mp-print-btn-order')) return;

    console.log("🖨️ Print Button injektálása (Rendelés)...");

    // Scrape natív .btn-default .btn-round stílust
    const ChameleonButton = window.ChameleonCore?.ChameleonButton;
    const OVIPStyles = window.ChameleonCore?.OVIPStyles;
    
    let printBtn;
    
    if (ChameleonButton && OVIPStyles) {
        console.log("🎭 Chameleon Button használata");
        
        // SCRAPE natív gomb stílust
        const btnStyle = OVIPStyles.scrape('.btn-default.btn-sm.btn-round');
        
        printBtn = ChameleonButton.create({
            text: 'Címke',
            type: 'default',
            icon: '<i class="fa fa-print"></i>',
            // EXACT class match (btn-round is kell!)
            className: 'btn-default btn-sm btn-round',
            attributes: {
                'id': 'mp-print-btn-order',
                'data-context': 'order',
                'title': 'Mobilpont címke nyomtatása'
            },
            onClick: () => mobilpontPrintLabel('order')
        });
        
        // Natív stílus alkalmazása
        Object.entries(btnStyle).forEach(([key, value]) => {
            const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
            printBtn.style[camelKey] = value;
        });
        
        // BTN-GROUP spacing: NEM kell margin-left!
        // Az OVIP btn-group automatikusan kezeli a spacing-et
        printBtn.style.marginLeft = '0';
        
    } else {
        // Fallback: Manual OVIP stílus
        console.log("⚠️ Chameleon Button fallback");
        printBtn = document.createElement('a');
        printBtn.id = 'mp-print-btn-order';
        printBtn.className = 'btn btn-default btn-sm btn-round'; // EXACT match!
        printBtn.title = 'Mobilpont címke nyomtatása';
        printBtn.style.cursor = 'pointer';
        printBtn.innerHTML = '<i class="fa fa-print"></i> Címke';
        printBtn.onclick = () => mobilpontPrintLabel('order');
    }

    // Beszúrás a "Nyomtatás" gomb UTÁN
    const printMainBtn = buttonGroup.querySelector('a.btn-narancs');
    if (printMainBtn) {
        printMainBtn.after(printBtn);
    } else {
        buttonGroup.insertBefore(printBtn, buttonGroup.firstChild);
    }

    console.log('✅ Print gomb injektálva (Rendelés) - OVIP natív btn-group');
}

// --- CÍMKE ADATOK SCRAPING ---
function scrapeLabelData() {
    try {
        const url = window.location.href;
        let data = {
            isOrder: false,
            sorszam: null,
            kategoria: "EGYÉB",
            vevo: "N/A",
            keszulek: "N/A",
            jelkod: "-",
            atvetelDatuma: "N/A",
            qrUrl: url
        };

        // 1. MUNKALAP
        if (url.includes('munkanyilvantarto')) {
            const sorszamEl = document.getElementById('sorszam');
            if (sorszamEl) data.sorszam = sorszamEl.value.trim();

            const katEl = document.getElementById('kategoria');
            if (katEl && katEl.selectedIndex >= 0) {
                data.kategoria = katEl.options[katEl.selectedIndex].text.replace(' Szerviz', '').replace(' (Mobilpont)', '').trim();
            }

            const vevoEl = document.getElementById('partner_nev_kiir');
            if (vevoEl) data.vevo = vevoEl.value.trim();

            const nevEl = document.getElementById('nev');
            if (nevEl) data.keszulek = nevEl.value.trim();

            const datumEl = document.getElementById('datum_kezd');
            if (datumEl) data.atvetelDatuma = datumEl.value.trim();

            const leirasArea = document.getElementById('megrendelo_leiras');
            if (leirasArea) {
                const txt = document.createElement("textarea");
                txt.innerHTML = leirasArea.value || leirasArea.innerHTML;
                const rawText = txt.value.replace(/<[^>]*>/g, ' '); 
                const jelkodMatch = rawText.match(/(?:Jelkód|feloldó minta).*?:\s*([^\n\r<]+)/i);
                if (jelkodMatch && jelkodMatch[1]) {
                    data.jelkod = jelkodMatch[1].trim();
                }
            }
        } 
        // 2. RENDELÉS
        else if (url.includes('rendelesek')) {
            data.isOrder = true;

            const headerEl = document.querySelector('.bizonylat_fejlec span');
            if (headerEl) data.sorszam = headerEl.innerText.trim();

            // Vevő
            const vasarloNevEl = document.getElementById('vasarlo_nev');
            if (vasarloNevEl && vasarloNevEl.value) {
                data.vevo = vasarloNevEl.value.trim();
            } else {
                const vasarloDiv = document.querySelector('#adatok_vasarlo_div b');
                if (vasarloDiv) data.vevo = vasarloDiv.innerText.trim();
            }

            // Szállítás
            const szallEl = document.getElementById('szall_mod');
            if (szallEl) data.keszulek = szallEl.value.trim();

            // Fizetés
            const fizEl = document.getElementById('fiz_mod');
            if (fizEl) data.jelkod = fizEl.value.trim();

            // Dátum
            const egyebDiv = document.getElementById('adatok_egyeb_div');
            if (egyebDiv) {
                const paragraphs = egyebDiv.getElementsByTagName('p');
                for (let p of paragraphs) {
                    if (p.innerText.includes('Létrehozva') || p.innerText.includes('202')) { 
                        const dateMatch = p.innerText.match(/(\d{4}-\d{2}-\d{2}.*\d{2}:\d{2})/);
                        if (dateMatch) {
                            data.atvetelDatuma = dateMatch[0];
                            break; 
                        } else if (p.innerText.match(/\d{4}-\d{2}-\d{2}/)) {
                            data.atvetelDatuma = p.innerText.trim();
                        }
                    }
                }
            }
            if (data.atvetelDatuma === "N/A") {
                const keltEl = document.getElementById('kelt');
                if (keltEl) data.atvetelDatuma = keltEl.value.trim();
            }
        }

        return data;
    } catch (e) {
        console.error("❌ Scraping hiba:", e);
        return null;
    }
}

// --- QR KÓD GENERÁLÁS ---
async function generateQRCode(text) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        canvas.width = 90;
        canvas.height = 90;
        
        // Ha van QRCode library
        if (typeof QRCode !== 'undefined' && QRCode.toCanvas) {
            QRCode.toCanvas(canvas, text, { width: 90, margin: 1 }, function (error) {
                if (error) {
                    console.error('QR Error:', error);
                    resolve('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='); // 1x1 px transparent
                } else {
                    resolve(canvas.toDataURL('image/png'));
                }
            });
        } else {
            // Fallback: placeholder kép
            resolve('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
        }
    });
}

// --- CÍMKE NYOMTATÁS FŐFÜGGVÉNY ---
async function mobilpontPrintLabel(type) {
    console.log('🖨️ Címke nyomtatás indítása...', type);

    // 1. Adatok kinyerése
    const data = scrapeLabelData();
    if (!data || !data.sorszam) {
        alert('❌ Nem sikerült kinyerni az adatokat! Győződj meg róla, hogy egy megnyitott munkalap vagy rendelés oldalon vagy.');
        return;
    }

    console.log('📋 Kinyert adatok:', data);

    // 2. QR kód generálása
    const qrDataURL = await generateQRCode(data.qrUrl);

    // 3. Logo betöltése (Chrome Extension path)
    const logoURL = chrome.runtime.getURL('lib/logo.png');

    // 4. Címke típus meghatározása
    const jelkodLabel = data.isOrder ? "Fizetés:" : "Jelkód:";
    const kategoriaText = data.isOrder ? "RENDELÉS" : (data.kategoria?.toUpperCase() || 'N/A');

    // 5. HTML generálása
    const printHTML = `
<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mobilpont Címke - ${data.sorszam}</title>
    <style>
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        body {
            font-family: 'Poppins', 'Arial', sans-serif;
            background: white;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        #label-container {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            gap: 20px;
            border: 1px solid #e0e0e0;
            padding: 20px;
            border-radius: 8px;
            background: white;
            max-width: 600px;
        }
        #qr-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            width: 90px;
            flex-shrink: 0;
        }
        #qr-section img {
            width: 90px;
            height: auto;
            display: block;
        }
        .qr-label {
            font-size: 12px;
            font-weight: 700;
            color: black;
            text-align: center;
        }
        #data-section {
            flex: 1;
            font-size: 13px;
            line-height: 1.6;
            color: black;
            font-weight: 600;
        }
        #header-row {
            display: flex;
            flex-direction: row;
            gap: 15px;
            margin-bottom: 8px;
        }
        
        @media print {
            body { padding: 0; margin: 0; }
            #label-container { border: none; page-break-inside: avoid; }
            #auto-msg { display: none; }
        }
        
        #auto-msg {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #0085FF;
            color: white;
            padding: 14px 24px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            text-align: center;
            line-height: 1.5;
            max-width: 500px;
        }
        
        #auto-msg kbd {
            background: rgba(255,255,255,0.2);
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: monospace;
            font-size: 12px;
            font-weight: 600;
            border: 1px solid rgba(255,255,255,0.3);
            display: inline-block;
            margin: 0 2px;
        }
    </style>
</head>
<body>
    <div id="auto-msg">
        ℹ️ <strong>Nyomtatás:</strong> Jobb klikk → Nyomtatás vagy <kbd>Ctrl+P</kbd> (Mac: <kbd>Cmd+P</kbd>)
        <div style="font-size: 11px; margin-top: 5px; opacity: 0.8;">Az ablak automatikusan bezáródik nyomtatás után</div>
    </div>
    
    <div id="label-container">
        <div id="qr-section">
            <img src="${logoURL}" alt="Logo" onerror="this.style.display='none'">
            <img src="${qrDataURL}" alt="QR Code">
            <div class="qr-label">OVIP Link</div>
        </div>
        
        <div id="data-section">
            <div id="header-row">
                <div><strong>${data.sorszam}</strong></div>
                <div><strong>${kategoriaText}</strong></div>
            </div>
            <div style="margin-bottom:6px;">${data.vevo || 'N/A'}</div>
            <div style="margin-bottom:6px;">${data.keszulek || 'N/A'}</div>
            <div style="margin-bottom:6px;"><strong>${jelkodLabel}</strong> ${data.jelkod || 'N/A'}</div>
            <div><strong>Dátum:</strong> ${data.atvetelDatuma || 'N/A'}</div>
        </div>
    </div>
    
    <script>
        console.log('📄 Címke oldal betöltve');
        
        // Automatikus nyomtatás indítása
        window.addEventListener('load', () => {
            console.log('✅ Load event - címke készen áll');
            
            // 1.2 másodperc várakozás (hogy biztosan minden betöltődjön)
            setTimeout(() => {
                console.log('🖨️ Print Dialog megnyitása...');
                try {
                    window.print();
                    console.log('✅ Print indítva');
                } catch(e) {
                    console.error('❌ Print hiba:', e);
                }
                
                // Bezárás 1 másodperc után (ha user nem nyomtat)
                setTimeout(() => {
                    console.log('🚪 Ablak bezárása (timeout)');
                    window.close();
                }, 1200);
            }, 1200);
        });
        
        // Bezárás nyomtatás után (ha user nyomtat)
        window.addEventListener('afterprint', () => {
            console.log('✅ Nyomtatás kész, bezárás...');
            setTimeout(() => {
                window.close();
            }, 300);
        });
        
        // Debug: beforeprint event
        window.addEventListener('beforeprint', () => {
            console.log('🖨️ Print Dialog megjelent');
        });
    </script>
</body>
</html>
    `;

    // 6. Új tab nyitása
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(printHTML);
        printWindow.document.close();
        console.log('✅ Címke nyomtatási ablak megnyitva');
    } else {
        alert('❌ Popup blocker megakadályozta az ablak nyitását! Engedélyezd a popup ablakokat ehhez a bővítményhez.');
    }
}

// ============================================================================
// UNIVERZÁLIS GYORSKERESŐ (GLOBÁLIS)
// ============================================================================
function injectUniversalSearch() {
    if (document.getElementById('mp-universal-search')) return;
    
    // Floating toggle gomb (jobb alsó sarok)
    const toggleBtn = document.createElement('div');
    toggleBtn.id = 'mp-search-toggle';
    toggleBtn.innerHTML = '<i class="fa fa-search"></i>';
    toggleBtn.title = 'Gyorskereső megnyitása (Ctrl+K)';
    toggleBtn.onclick = () => toggleSearchPanel();
    
    // Keresőpanel
    const searchPanel = document.createElement('div');
    searchPanel.id = 'mp-universal-search';
    searchPanel.style.display = 'none';
    searchPanel.innerHTML = `
        <div class="mp-search-header">
            <h3><i class="fa fa-search"></i> Gyorskereső</h3>
            <button class="mp-search-close" onclick="document.getElementById('mp-universal-search').style.display='none'">
                <i class="fa fa-times"></i>
            </button>
        </div>
        <div class="mp-search-body">
            <div class="mp-search-group">
                <label><i class="fa fa-wrench"></i> Munka keresése</label>
                <input type="text" 
                       id="mp-search-work" 
                       class="form-control" 
                       placeholder="Munkaszám (pl. 38-2026)"
                       onkeypress="if(event.key==='Enter') searchWork()">
                <small class="help-block">Enter: ugrás a munkához</small>
            </div>
            <div class="mp-search-group">
                <label><i class="fa fa-mobile"></i> Termék keresése</label>
                <input type="text" 
                       id="mp-search-product" 
                       class="form-control" 
                       placeholder="Cikkszám, IMEI, terméknév"
                       onkeypress="if(event.key==='Enter') searchProduct()">
                <small class="help-block">Enter: keresés a raktárkezelőben</small>
            </div>
        </div>
    `;
    
    document.body.appendChild(toggleBtn);
    document.body.appendChild(searchPanel);
    
    // Keyboard shortcut: Ctrl+K
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            toggleSearchPanel();
        }
    });
    
    console.log('✅ Univerzális gyorskereső injektálva (Ctrl+K)');
}

function toggleSearchPanel() {
    const panel = document.getElementById('mp-universal-search');
    if (panel.style.display === 'none') {
        panel.style.display = 'block';
        // Focus az első input mezőre
        setTimeout(() => {
            document.getElementById('mp-search-work').focus();
        }, 100);
    } else {
        panel.style.display = 'none';
    }
}

function searchWork() {
    const input = document.getElementById('mp-search-work');
    const query = input.value.trim();
    if (!query) return;
    
    // OVIP gyorskereső működése (ha van, használjuk azt)
    if (typeof gyorskereso === 'function') {
        gyorskereso();
    } else {
        // Fallback: manuális keresés a munkanyilvántartóban
        window.location.href = `https://www.ovip.hu/munkanyilvantarto/?kereses=ok&sorszam=${encodeURIComponent(query)}`;
    }
}

function searchProduct() {
    const input = document.getElementById('mp-search-product');
    const query = input.value.trim();
    if (!query) return;
    
    // Termék keresés a raktárkezelőben
    window.location.href = `https://www.ovip.hu/raktarkezelo/?command=termek_kereso&nev=${encodeURIComponent(query)}`;
}

// Univerzális gyorskereső inicializálása (késleltetve, hogy a DOM biztosan betöltődjön)
setTimeout(() => {
    injectUniversalSearch();
}, 2000);