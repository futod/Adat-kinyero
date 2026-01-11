// ============================================================================
// MOBILPONT TRELLO INTEGRÁCIÓ (Külön Modul)
// ============================================================================

// Default credentials (ha nincs felülírva a Settings-ben)
const DEFAULT_TRELLO = {
    apiKey: 'd5992c73e5e2daa2a7897774c2f67fea',
    apiToken: 'ATTA304c0825a7563f6cc1f8df4bd211b94bcfa62a89189e9787f92e791b837b2560D3B036A4'
};

// Globális változók (ezeket tölti be a getCredentials())
let TRELLO_API_KEY = DEFAULT_TRELLO.apiKey;
let TRELLO_TOKEN = DEFAULT_TRELLO.apiToken;

// ============================================================================
// HELPER: CREDENTIALS BETÖLTÉSE (HIBRID)
// ============================================================================
async function loadTrelloCredentials() {
    try {
        const result = await chrome.storage.local.get(['trelloApiKey', 'trelloApiToken']);
        
        // Ha van mentett, azt használjuk
        if (result.trelloApiKey && result.trelloApiToken) {
            TRELLO_API_KEY = result.trelloApiKey;
            TRELLO_TOKEN = result.trelloApiToken;
            console.log("🔑 Trello: Chrome Storage kulcsok betöltve");
        } else {
            // Ha nincs, default-ot használunk
            TRELLO_API_KEY = DEFAULT_TRELLO.apiKey;
            TRELLO_TOKEN = DEFAULT_TRELLO.apiToken;
            console.log("🔑 Trello: Default kulcsok használata");
        }
    } catch (error) {
        console.error("⚠️ Trello credentials hiba:", error);
        // Fallback: default kulcsok
        TRELLO_API_KEY = DEFAULT_TRELLO.apiKey;
        TRELLO_TOKEN = DEFAULT_TRELLO.apiToken;
    }
}

// Azonnal betöltjük a scriptet indításakor
loadTrelloCredentials();

// ⚠️⚠️⚠️ MÁSOLD BE A HIÁNYZÓ ID-T! ⚠️⚠️⚠️
const LIST_IDS = {
    'UGYFELES': '68848d52b8cc28c623fa2c1c', 
    'PARTNER': '68b165ae199f07aa179f9189'
};

const LABEL_MAPPING = {
    "Somogyi Szerviz": "Somogyi", "Tisza Lajos Szerviz": "Tisza Lajos",
    "Makó Szerviz": "Makó", "SzervizFutár": "SzervizFutár",
    "SAJÁT (Mobilpont)": "SAJÁT", "TATA": "Mobilpont TATA",
    "DUNAÚJVÁROS": "DUNAÚJVÁROS", "BOZSÓ": "BOZSÓ"
};

const MEMBER_MAPPING = {
    "Fekete Gergő": "gergofekete5", "Szabó Gábor": "gaborszabo137",
    "Varga Balázs": "vargabalazs56", "Berki Viktor": "berkiviktormobilpont",
    "Futó Dávid": "davidfuto5", "Kovács Dániel": "kovacsdanielmobilpont",
    "Budai László": "laszlobudai13", "Szeri Marcell": "marcellszeri",
    "Palotás Ábel": "palotasabelmobilpont", "Szabó Szilvia": "szilviaszabo28"
};

let isProcessing = false;

// --- LOGGER ---
function logTrello(type, message, data = null) {
    const styles = {
        info: 'background: #0079BF; color: #fff; padding: 2px 5px; border-radius: 3px;',
        success: 'background: #61bd4f; color: #fff; padding: 2px 5px; border-radius: 3px;',
        warn: 'background: #FF9F1A; color: #fff; padding: 2px 5px; border-radius: 3px;',
        error: 'background: #EB5A46; color: #fff; padding: 2px 5px; border-radius: 3px;'
    };
    const prefix = `[Mobilpont TRELLO]`;
    if (data) console.log(`%c${prefix} ${message}`, styles[type] || styles.info, data);
    else console.log(`%c${prefix} ${message}`, styles[type] || styles.info);
}

// --- SEGÉDFÜGGVÉNYEK ---
function getSorszam() {
    const sorszamInput = document.getElementById('sorszam');
    if (sorszamInput && sorszamInput.value) return sorszamInput.value.trim();
    const h2Title = document.querySelector('h2'); 
    if (h2Title) {
        const match = h2Title.innerText.match(/#(\d+-\d+|\d+)/);
        if (match) return match[1];
    }
    return null;
}

function cleanHTML(html) {
    let temp = document.createElement('div');
    let formatted = html.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n\n');
    temp.innerHTML = formatted;
    let text = temp.textContent || temp.innerText || "";
    return text.trim();
}

function formatDate(isoDate) {
    const d = new Date(isoDate);
    const today = new Date();
    const isToday = d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    const timeStr = d.toLocaleTimeString('hu-HU', { hour: '2-digit', minute:'2-digit' });
    if (isToday) return `Ma, ${timeStr}`;
    return d.toLocaleDateString('hu-HU', { month: '2-digit', day: '2-digit' }) + ` ${timeStr}`;
}

// ============================================================================
// ÚJ SEGÉDFÜGGVÉNY: TOAST (POPUP HELYETT)
// ============================================================================
function showToast(message, type = 'success') {
    // Töröljük a korábbi toastot, ha van
    const existing = document.querySelector('.mp-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `mp-toast ${type}`;
    
    let icon = type === 'success' ? '✅' : '⚠️';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    
    document.body.appendChild(toast);

    // Automatikus törlés az animáció végén (3s)
    setTimeout(() => {
        if(toast.parentElement) toast.remove();
    }, 3100);
}

// --- API HÍVÁSOK ---
async function getBoardId(listId) {
    const response = await fetch(`https://api.trello.com/1/lists/${listId}?fields=idBoard&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`);
    if (!response.ok) throw new Error('Board ID lekérés hiba');
    const data = await response.json();
    return data.idBoard;
}

async function findLabelId(boardId, labelName) {
    try {
        const response = await fetch(`https://api.trello.com/1/boards/${boardId}/labels?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`);
        const labels = await response.json();
        const found = labels.find(l => l.name && l.name.toLowerCase() === labelName.toLowerCase());
        return found ? found.id : null;
    } catch (e) { return null; }
}

async function findMemberId(boardId, username) {
    try {
        const response = await fetch(`https://api.trello.com/1/boards/${boardId}/members?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`);
        const members = await response.json();
        const found = members.find(m => m.username === username);
        return found ? found.id : null;
    } catch (e) { return null; }
}

async function getSecondPosition(listId) {
    try {
        const response = await fetch(`https://api.trello.com/1/lists/${listId}?fields=pos&limit=3&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`);
        const cards = await response.json();
        cards.sort((a, b) => a.pos - b.pos);
        if (cards.length === 0) return 'top';
        const firstPos = cards[0].pos;
        if (cards.length >= 2) return (firstPos + cards[1].pos) / 2;
        return firstPos + 1000;
    } catch (e) { return 'bottom'; }
}

async function checkCardExistence(sorszam) {
    try {
        // Trello API keresés
        const searchUrl = `https://api.trello.com/1/search?query=name:"${sorszam}"&modelTypes=cards&card_fields=name,shortUrl,idList,idBoard&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`;
        
        const response = await fetch(searchUrl);
        if (!response.ok) throw new Error('Keresés hiba');
        const data = await response.json();
        
        // RUGALMAS szűrés: a kártya neve tartalmazhatja a sorszámot különböző formátumokban
        const exactMatches = data.cards.filter(card => {
            const cardNameLower = card.name.toLowerCase();
            const sorszamLower = sorszam.toLowerCase();
            
            // 1. Pontos egyezés (teljes név = sorszám)
            if (cardNameLower === sorszamLower || cardNameLower === `#${sorszamLower}`) {
                return true;
            }
            
            // 2. A név TARTALMAZZA a sorszámot + elválasztó előtte vagy utána
            // Példák:
            // - "71479 - Apple" ✓
            // - "R-71479" ✓
            // - "#R-71479 - iPhone" ✓
            // - "5-2026 - Apple" ✓
            // - "714792" ✗ (nincs elválasztó)
            
            // Regex: szóhatáron vagy elválasztó után/előtt legyen a sorszám
            const pattern = new RegExp(`(^|[\\s\\-#])${sorszamLower}([\\s\\-]|$)`, 'i');
            if (pattern.test(cardNameLower)) {
                return true;
            }
            
            return false;
        });
        
        if (exactMatches.length !== data.cards.length) {
            console.log(`🔍 Trello keresés szűrés: ${data.cards.length} találat → ${exactMatches.length} pontos egyezés`);
        }
        
        return exactMatches;
    } catch (e) {
        logTrello('error', 'Hiba a keresésnél', e);
        return [];
    }
}

// ============================================================================
// UI LÉTREHOZÁS - SZERVIZ OLDAL (FELÚJÍTVA)
// ============================================================================

async function injectHeaderStatus() {
    const sorszam = getSorszam();
    if (!sorszam) return;

    const titleContainer = document.querySelector('.x_title h2');
    // Ellenőrzés, hogy nincs-e már ott
    if (!titleContainer || document.getElementById('mp-trello-service-container')) return;

    const cards = await checkCardExistence(sorszam);
    
    if (cards.length === 0) return; // Ha nincs kártya, nem csinálunk semmit (vagy gombot tehetnénk)

    const card = cards[0];

    // Konténer Létrehozása
    const badgeContainer = document.createElement('span');
    badgeContainer.id = 'mp-trello-service-container';
    badgeContainer.style.display = 'inline-block';
    badgeContainer.style.marginLeft = '15px';
    badgeContainer.style.verticalAlign = 'middle';

    // 1. LINK GOMB
    let linkClass = "mp-trello-link-btn";
    let warningIcon = "";
    let duplicateWarning = "";
    
    // Duplikáció jelzése
    if (cards.length > 1) {
        linkClass += " mp-badge-red"; // Piros keret vagy háttér
        warningIcon = `<i class="fa fa-exclamation-triangle" style="color:#ff6b6b; margin-right:5px;" title="Duplikált kártyák!"></i>`;
        duplicateWarning = `<span style="color:#ff6b6b; font-size:11px; margin-left:8px; font-weight:700;">⚠️ ${cards.length} kártya!</span>`;
        showToast(`Figyelem: ${cards.length} Trello kártya van a #${sorszam} munkaszámmal!`, 'error');
    }

    const linkHtml = `<a href="${card.shortUrl}" target="_blank" class="${linkClass}" title="Megnyitás Trelloban">${warningIcon}<i class="fa fa-trello"></i> Kártya</a>${duplicateWarning}`;
    
    // 2. TÖLTÉS JELZŐ
    badgeContainer.innerHTML = linkHtml + `<span style="color:#999; font-size:12px; margin-left:5px;"><i class="fa fa-spinner fa-spin"></i></span>`;
    titleContainer.appendChild(badgeContainer);

    // Listák betöltése és Select építése
    try {
        const boardId = card.idBoard; 
        const listsUrl = `https://api.trello.com/1/boards/${boardId}/lists?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`;
        const resp = await fetch(listsUrl);
        if(!resp.ok) throw new Error("Lista lekérés hiba");
        const lists = await resp.json();

        // 3. LEGÖRDÜLŐ MENÜ (SELECT)
        let selectHtml = `<select id="mp-trello-service-select" class="mp-trello-select" style="margin-left: 5px;" title="Áthelyezés másik oszlopba">`;
        
        lists.forEach(list => {
            const selected = (list.id === card.idList) ? 'selected' : '';
            selectHtml += `<option value="${list.id}" ${selected}>${list.name}</option>`;
        });
        selectHtml += `</select>`;

        badgeContainer.innerHTML = linkHtml + selectHtml;

        // ESEMÉNYFIGYELŐ MOZGATÁSHOZ
        const selectEl = document.getElementById('mp-trello-service-select');
        selectEl.addEventListener('change', async function() {
            const newListId = this.value;
            const newListName = this.options[this.selectedIndex].text;
            
            // UI Blokkolás
            this.disabled = true;
            document.body.style.cursor = 'wait';

            const success = await moveCard(card.id, newListId);
            
            this.disabled = false;
            document.body.style.cursor = 'default';
            
            if(success) {
                showToast(`Áthelyezve ide: ${newListName}`, 'success');
            } else {
                showToast('Hiba történt az áthelyezéskor!', 'error');
            }
        });

    } catch(e) { 
        console.error("Hiba:", e);
        badgeContainer.innerHTML = linkHtml + `<span style="color:red; font-size:11px; margin-left:5px;">Hiba (API)</span>`;
    }
}

async function addTrelloButtons() {
    if (!getSorszam()) return;
    
    // Keressük meg a helyét
    const allContents = document.querySelectorAll('.x_content');
    let targetContainer = null;
    for (let div of allContents) {
        if (div.innerText.includes('Műveletek') || div.innerText.includes('Lezárás')) {
            targetContainer = div;
            break;
        }
    }
    if (!targetContainer || document.getElementById('mobilpont-trello-container')) return;

    // Konténer létrehozása (még üresen)
    const container = document.createElement('div');
    container.id = 'mobilpont-trello-container';
    container.className = 'btn-group';
    container.style.verticalAlign = 'top';
    container.style.marginLeft = '5px';
    container.innerHTML = `<button class="btn btn-default btn-app" disabled><i class="fa fa-spinner fa-spin"></i> Trello...</button>`;
    
    targetContainer.appendChild(container);

    // ELLENŐRZÉS: Van már kártya?
    const sorszam = getSorszam();
    const cards = await checkCardExistence(sorszam);
    const hasCard = cards.length > 0;

    const iconUrl = "https://www.vectorlogo.zone/logos/trello/trello-icon.svg";

    if (hasCard) {
        // --- VAN KÁRTYA: CSAK MEGNYITÁS (Biztonsági mód) ---
        const cardUrl = cards[0].shortUrl;
        container.innerHTML = `
            <a href="${cardUrl}" target="_blank" class="btn btn-default btn-app" style="height: 60px; color: #27ae60; font-weight:bold; border-color: #27ae60;">
                <i class="fa fa-check-circle" style="font-size: 16px; display:block; margin: 0 auto 5px auto;"></i> 
                Megnyitás
            </a>
        `;
    } else {
        // --- NINCS KÁRTYA: LÉTREHOZÁS GOMBOK + FIGYELMEZTETÉS ---
        container.innerHTML = `
            <button id="trello-main-btn" data-toggle="dropdown" class="btn btn-default btn-app dropdown-toggle" type="button" aria-expanded="false" style="height: 60px; color: #0079BF; font-weight:bold;">
                <span style="position:absolute; top:-5px; right:-5px; color:#EB5A46; font-size:16px;">●</span> <img src="${iconUrl}" width="18" height="18" style="display:block; margin: 0 auto 5px auto;"> 
                Létrehozás <span class="caret"></span>
            </button>
            <ul role="menu" class="dropdown-menu">
                <li><a href="#" id="tr-send-ugyfeles"><i class="fa fa-user"></i> Ügyfeles kártya</a></li>
                <li><a href="#" id="tr-send-partner"><i class="fa fa-building"></i> Partner kártya</a></li>
            </ul>
            <div style="font-size:10px; color:#EB5A46; font-weight:bold; text-align:center; margin-top:5px;">⚠️ Nincs kártya!</div>
        `;
        
        document.getElementById('tr-send-ugyfeles').addEventListener('click', (e) => { e.preventDefault(); startSending('UGYFELES'); });
        document.getElementById('tr-send-partner').addEventListener('click', (e) => { e.preventDefault(); startSending('PARTNER'); });
    }
}
async function injectTrelloHistoryPanel() {
    const sorszam = getSorszam();
    if (!sorszam) return;
    const megjegyzesPanel = document.getElementById('megjegyzesek_div')?.closest('.x_panel')?.parentElement;
    if (!megjegyzesPanel || document.getElementById('trello-history-panel')) return;

    const panelHTML = `
        <div class="x_panel margbot20" id="trello-history-panel" style="border-top: 3px solid #0079BF;">
            <div class="x_title collapse-link" style="padding: 5px 10px;">
                <h2 style="width: auto; color: #0079BF; display: flex; align-items: center; font-size: 16px; margin: 5px 0;">
                    <i class="fa fa-trello" style="margin-right: 8px;"></i> Trello
                    <span id="trello-status-badge" style="margin-left: 12px; font-size: 11px; color: #555; background: #eee; border: 1px solid #ddd; padding: 2px 8px; border-radius: 12px; font-weight: normal; opacity: 0; transition: opacity 0.5s;">...</span>
                </h2>
                <ul class="nav navbar-right panel_toolbox" style="min-width: auto;">
                    <li><a id="trello-open-link" href="#" target="_blank" title="Kártya megnyitása" style="display:none; color:#777;"><i class="fa fa-external-link"></i></a></li>
                    <li><a onclick="loadTrelloComments('${sorszam}')" title="Frissítés" style="color:#777;"><i class="fa fa-refresh"></i></a></li>
                </ul>
                <div class="clearfix"></div>
            </div>
            <div class="x_content" id="trello-history-content" style="max-height: 350px; overflow-y: auto; background-color: #fff; padding: 0;">
                <div style="text-align:center; padding: 15px; color: #999; font-size: 12px;">
                    <i class="fa fa-spinner fa-spin"></i> Betöltés...
                </div>
            </div>
        </div>
    `;
    megjegyzesPanel.insertAdjacentHTML('beforeend', panelHTML);
    loadTrelloComments(sorszam);
}

async function loadTrelloComments(sorszam) {
    const contentDiv = document.getElementById('trello-history-content');
    const statusBadge = document.getElementById('trello-status-badge');
    const openLink = document.getElementById('trello-open-link');

    try {
        const cards = await checkCardExistence(sorszam);
        if (cards.length === 0) {
            contentDiv.innerHTML = '<div style="padding:15px; color:#aaa; text-align:center; font-size:12px;">📭 Nincs még Trello kártya.</div>';
            statusBadge.style.opacity = '0';
            return;
        }
        const card = cards[0];
        openLink.href = card.shortUrl;
        openLink.style.display = 'inline-block';

        if (card.idList) {
            try {
                const listUrl = `https://api.trello.com/1/lists/${card.idList}?fields=name&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`;
                const listResp = await fetch(listUrl);
                if (listResp.ok) {
                    const listData = await listResp.json();
                    statusBadge.innerText = listData.name; 
                    statusBadge.style.opacity = '1';
                }
            } catch (err) { console.warn("Lista név hiba", err); }
        }

        const actionsUrl = `https://api.trello.com/1/cards/${card.id}/actions?filter=commentCard&limit=15&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`;
        const actionsResp = await fetch(actionsUrl);
        const actions = await actionsResp.json();

        if (actions.length === 0) {
            contentDiv.innerHTML = '<div style="padding:15px; text-align:center; color:#aaa; font-size:12px;">Nincsenek kommentek.</div>';
            return;
        }

        let html = '<ul class="list-unstyled" style="margin:0; padding:0;">';
        actions.forEach((action, index) => {
            const date = formatDate(action.date);
            const text = action.data.text;
            const author = action.memberCreator.fullName;
            const bg = index % 2 === 0 ? '#fff' : '#fcfcfc';
            html += `
                <li style="padding: 8px 12px; border-bottom: 1px solid #eee; background-color: ${bg}; font-size: 12px;">
                    <div style="margin-bottom: 2px;">
                        <span style="font-weight: 700; color: #444;">${author}</span>
                        <span style="float: right; color: #999; font-size: 11px;">${date}</span>
                    </div>
                    <div style="color: #555; line-height: 1.4; white-space: pre-wrap;">${text}</div>
                </li>`;
        });
        html += '</ul>';
        contentDiv.innerHTML = html;
    } catch (error) {
        logTrello('error', 'History betöltés hiba', error);
        contentDiv.innerHTML = '<div style="color:red; padding:10px; font-size:12px;">Hiba történt.</div>';
    }
}

async function startSending(type) {
    if (isProcessing) return;
    const listId = LIST_IDS[type];
    const btn = document.querySelector('#trello-main-btn');
    const originalContent = btn.innerHTML;
    
    // Ellenőrzés
    if (!listId || listId.includes('MÁSOLD')) { 
        alert("HIBA: Nincs beállítva a Lista ID a kódban!"); 
        return; 
    }
    const sorszam = getSorszam();
    if (!sorszam) { alert("Nincs sorszám (nem található a #szám a fejlécben)!"); return; }

    btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Ell...';
    
    // Duplikáció ellenőrzés
    const existingCards = await checkCardExistence(sorszam);
    if (existingCards.length > 0) {
        if (!confirm(`Már létezik kártya (${sorszam})! Létrehozol még egyet?`)) {
            btn.innerHTML = originalContent; return;
        }
    }

    isProcessing = true;
    btn.innerHTML = '<i class="fa fa-spinner fa-spin" style="font-size:20px; display:block; margin-bottom:5px;"></i> Küldés...';
    btn.classList.add('disabled'); 

    try {
        // --- ADATGYŰJTÉS ---
        let titleInput = document.querySelector('input[name="nev"]') || document.querySelector('input[name="ugyfel_nev"]');
        let ugyfelNev = titleInput ? titleInput.value : "Ismeretlen";
        let cardName = `${sorszam} - ${ugyfelNev}`;

        // Leírás kinyerése
        let descriptionHTML = "";
        // @ts-ignore
        if (typeof CKEDITOR !== 'undefined' && CKEDITOR.instances.megrendelo_leiras) {
            descriptionHTML = CKEDITOR.instances.megrendelo_leiras.getData();
        } else {
            const textArea = document.getElementById('megrendelo_leiras');
            if (textArea) descriptionHTML = textArea.value;
        }
        let cleanDesc = cleanHTML(descriptionHTML);
        let finalDesc = `⚠️ A kártya létrehozásakor beimportált adatok!\n\n🔗 OVIP Link: ${window.location.href}\n\n------------------\n${cleanDesc}`;

        // --- DÁTUM JAVÍTÁS ---
        let dueDate = null;
        const dateInput = document.getElementById('vallalasi_hatarido');
        if (dateInput && dateInput.value) {
            let rawDate = dateInput.value.trim().replace(/\./g, '-').replace(/-$/, ''); 
            let d = new Date(rawDate);
            if (!isNaN(d.getTime())) {
                dueDate = d.toISOString(); 
            } else {
                console.warn("[Mobilpont TRELLO] Érvénytelen dátum formátum, a határidő nem kerül beállításra:", rawDate);
            }
        }

        const boardId = await getBoardId(listId);
        
        // Címkék
        let labelIds = [];
        const catSelect = document.getElementById('kategoria');
        if (catSelect) {
            const selectedText = catSelect.options[catSelect.selectedIndex].text.trim();
            let targetLabelName = LABEL_MAPPING[selectedText];
            if (!targetLabelName) targetLabelName = selectedText.replace(' Szerviz', '').replace(' (Mobilpont)', '').trim();
            
            const foundLabelId = await findLabelId(boardId, targetLabelName);
            if (foundLabelId) labelIds.push(foundLabelId);
        }

        // Felelősök
        let memberIds = [];
        const felelosSelect = document.getElementById('felelos');
        if (felelosSelect) {
            const felelosName = felelosSelect.options[felelosSelect.selectedIndex].text.trim();
            const trelloUser = MEMBER_MAPPING[felelosName];
            if (trelloUser) {
                const foundMemberId = await findMemberId(boardId, trelloUser);
                if (foundMemberId) memberIds.push(foundMemberId);
            }
        }

        const position = await getSecondPosition(listId);

        // --- PAYLOAD ÖSSZEÁLLÍTÁS ---
        const payload = {
            idList: listId, 
            name: cardName, 
            desc: finalDesc, 
            pos: position,
            idLabels: labelIds, 
            idMembers: memberIds, 
            due: dueDate 
        };

        logTrello('info', 'Küldendő adatok (DEBUG):', payload);

        const url = `https://api.trello.com/1/cards?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`;
        const response = await fetch(url, { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(payload) 
        });

        if (response.ok) {
            const data = await response.json();
            logTrello('success', 'Kártya sikeresen létrehozva!', data);
            
            // Sikeres létrehozás után: gombok VÉGLEGESEN letiltása
            btn.innerHTML = '<i class="fa fa-check" style="color:green; font-size:20px; display:block; margin-bottom:5px;"></i> Létrehozva';
            btn.classList.add('disabled');
            btn.style.pointerEvents = 'none'; // Kattintás tiltása
            btn.style.opacity = '0.6';
            
            // Többi gomb is letiltása
            const allButtons = document.querySelectorAll('#tr-send-ugyfeles, #tr-send-partner');
            allButtons.forEach(b => {
                b.classList.add('disabled');
                b.style.pointerEvents = 'none';
                b.style.opacity = '0.6';
                b.innerHTML = '<i class="fa fa-check"></i> Már létrehozva';
            });
            
            // Header frissítése (megjelenik a Trello badge)
            injectHeaderStatus();
            
            // Kommentek betöltése
            loadTrelloComments(sorszam);
            
            // NE állítsuk vissza a gombot!
            isProcessing = false;
        } else { 
            const errText = await response.text();
            throw new Error(`API: ${response.status} - ${errText}`); 
        }

    } catch (error) {
        logTrello('error', 'Hiba a küldés során:', error);
        alert('Hiba történt a Trello kommunikációban! Részletek a konzolon (F12).');
        btn.innerHTML = originalContent; btn.classList.remove('disabled'); isProcessing = false;
    }
}

// ============================================================================
// UI LOGIKA - RENDELÉS OLDAL
// ============================================================================

window.initTrelloForOrder = async function(orderId) {
    logTrello('info', 'Rendelés mód aktiválva:', orderId);
    
    const cards = await checkCardExistence(orderId);
    
    if (cards.length === 0) {
        logTrello('warn', 'Nincs Trello kártya ehhez a rendeléshez.');
        return;
    }
    
    const card = cards[0];
    injectOrderHeaderBadges(card);
    injectOrderFooterComments(card, orderId);
}

async function injectOrderHeaderBadges(card) {
    const headerDiv = document.querySelector('.bizonylat_fejlec');
    if (!headerDiv) return;
    
    // Ha már létezik, ne duplikáljuk
    if (document.getElementById('mp-trello-header-container')) return;

    const badgeContainer = document.createElement('span');
    badgeContainer.id = 'mp-trello-header-container';
    badgeContainer.style.display = 'inline-block';
    badgeContainer.style.marginLeft = '15px';
    badgeContainer.style.verticalAlign = 'middle';

    // 1. LINK GOMB
    const linkHtml = `<a href="${card.shortUrl}" target="_blank" class="mp-trello-link-btn" title="Megnyitás Trelloban"><i class="fa fa-trello"></i> Kártya megnyitása</a>`;
    
    // 2. TÖLTÉS JELZŐ
    badgeContainer.innerHTML = linkHtml + `<span style="color:#999; font-size:12px;"><i class="fa fa-spinner fa-spin"></i></span>`;
    headerDiv.appendChild(badgeContainer);

    try {
        const boardId = card.idBoard; 
        const listsUrl = `https://api.trello.com/1/boards/${boardId}/lists?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`;
        const resp = await fetch(listsUrl);
        if(!resp.ok) throw new Error("Lista lekérés hiba");
        const lists = await resp.json();

        // 3. LEGÖRDÜLŐ MENÜ (SELECT)
        let selectHtml = `<select id="mp-trello-list-select" class="mp-trello-select" title="Áthelyezés másik oszlopba">`;
        
        lists.forEach(list => {
            const selected = (list.id === card.idList) ? 'selected' : '';
            selectHtml += `<option value="${list.id}" ${selected}>${list.name}</option>`;
        });
        selectHtml += `</select>`;

        badgeContainer.innerHTML = linkHtml + selectHtml;

        // ESEMÉNYFIGYELŐ
        const selectEl = document.getElementById('mp-trello-list-select');
        selectEl.addEventListener('change', async function() {
            const newListId = this.value;
            const newListName = this.options[this.selectedIndex].text;
            
            // UI Blokkolás
            this.disabled = true;
            document.body.style.cursor = 'wait';

            const success = await moveCard(card.id, newListId);
            
            this.disabled = false;
            document.body.style.cursor = 'default';
            
            if(success) {
                showToast(`Áthelyezve ide: ${newListName}`, 'success');
            } else {
                showToast('Hiba történt az áthelyezéskor!', 'error');
            }
        });

    } catch(e) { 
        console.error("Hiba:", e);
        badgeContainer.innerHTML = linkHtml + `<span style="color:red; font-size:11px;">Hiba</span>`;
    }
}

async function moveCard(cardId, newListId) {
    try {
        const url = `https://api.trello.com/1/cards/${cardId}?idList=${newListId}&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`;
        const response = await fetch(url, { method: 'PUT' });
        return response.ok;
    } catch (e) {
        console.error("Move error:", e);
        return false;
    }
}

// --- FOOTER (GRID TÁMOGATÁSSAL) ---
function injectOrderFooterComments(card, orderId) {
    const table = document.querySelector('.table-striped');
    if (!table) return;
    const mainPanel = table.closest('.x_panel');

    // Közös tároló kezelése (ha még nincs)
    let gridContainer = document.getElementById('mp-unified-dashboard');
    if (!gridContainer) {
        gridContainer = document.createElement('div');
        gridContainer.id = 'mp-unified-dashboard';
        mainPanel.insertAdjacentElement('afterend', gridContainer);
    }

    if (document.getElementById('mp-trello-order-panel')) return;

    // Panel létrehozása (Ugyanaz a design, mint a szerviznél)
    const container = document.createElement('div');
    container.id = 'mp-trello-order-panel';
    container.className = 'x_panel mp-grid-col mp-trello-history-panel'; // + mp-trello-history-panel class
    container.style.marginTop = '0'; 

    // Profi fejléc (Szervizes mintára)
    container.innerHTML = `
        <div class="x_title collapse-link" style="padding: 8px 10px; min-height:auto; height:auto; display:block;">
            <div class="mp-trello-header-row">
                <h2 class="mp-trello-title">
                    <i class="fa fa-comments" style="margin-right: 8px;"></i> Trello Napló
                </h2>
                <div class="mp-trello-controls">
                    <a href="${card.shortUrl}" target="_blank" title="Kártya megnyitása"><i class="fa fa-external-link"></i></a>
                    <a onclick="loadTrelloCommentsToContainer('${card.id}', 'trello-order-comments')" title="Frissítés"><i class="fa fa-refresh"></i></a>
                </div>
            </div>
            <div class="clearfix"></div>
        </div>
        <div class="x_content" id="trello-order-comments" style="max-height: 350px; overflow-y: auto; background-color: #fff; padding: 0;">
            <div style="text-align:center; padding:15px;"><i class="fa fa-spinner fa-spin"></i> Betöltés...</div>
        </div>
    `;

    gridContainer.appendChild(container);
    
    // Betöltés
    loadTrelloCommentsToContainer(card.id, 'trello-order-comments');
}

// Refaktorált komment betöltő (hogy ID alapján is menjen, ne csak sorszám alapján)
async function loadTrelloCommentsToContainer(cardId, containerId) {
    const contentDiv = document.getElementById(containerId);
    try {
        const actionsUrl = `https://api.trello.com/1/cards/${cardId}/actions?filter=commentCard&limit=10&key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`;
        const actionsResp = await fetch(actionsUrl);
        const actions = await actionsResp.json();

        if (actions.length === 0) {
            contentDiv.innerHTML = '<div style="padding:15px; text-align:center; color:#aaa;">Nincsenek kommentek.</div>';
            return;
        }

        let html = '<ul class="list-unstyled" style="margin:0; padding:0;">';
        actions.forEach((action, index) => {
            const date = formatDate(action.date); 
            const text = action.data.text;
            const author = action.memberCreator.fullName;
            const bg = index % 2 === 0 ? '#f9f9f9' : '#fff';
            
            html += `
                <li style="padding: 10px; border-bottom: 1px solid #eee; background-color: ${bg};">
                    <div style="font-weight:bold; margin-bottom:4px; color:#444;">
                        ${author} <span style="float:right; font-weight:normal; color:#999; font-size:11px;">${date}</span>
                    </div>
                    <div style="color:#555; white-space: pre-wrap;">${text}</div>
                </li>`;
        });
        html += '</ul>';
        contentDiv.innerHTML = html;

    } catch (e) {
        contentDiv.innerHTML = 'Hiba a kommentek betöltésekor.';
    }
}

// Inicializálás
// Szerviz/Munkalap/Munkanyilvántartó oldal: injectHeaderStatus + addTrelloButtons + injectTrelloHistoryPanel
// Rendelés oldal: initTrelloForOrder() (content.js hívja meg)
if (window.location.href.includes('/szervizek/') || 
    window.location.href.includes('munkalap_id=') ||
    window.location.href.includes('/munkanyilvantarto/')) {
    setTimeout(() => { 
        injectHeaderStatus(); 
        addTrelloButtons(); 
        injectTrelloHistoryPanel(); 
    }, 1500);
}

// Rendelések oldal: A content.js hívja meg az initTrelloForOrder()-t automatikusan

// ============================================================================
// MOBILPONT TRELLO INTEGRÁCIÓ v3 (Performance + Design Update)
// ============================================================================

console.log("🐘 Trello Integráció v3 betöltve");

const T_ICONS = {
    trello: `<svg viewBox="0 0 24 24" width="16" height="16" fill="#0079bf" style="vertical-align:text-bottom;"><path d="M19.5 2h-15C2.6 2 1.5 3.1 1.5 5v14c0 1.9 1.1 3 2.9 3h15c1.9 0 3-1.1 3-3V5c0-1.9-1.1-3-3-3zm-9 15H5.8V6h4.7v11zm8.2-4.7h-4.7V6h4.7v6.3z"/></svg>`,
    comment: `<svg viewBox="0 0 24 24" width="12" height="12" fill="#666"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>`,
    external: `<svg viewBox="0 0 24 24" width="10" height="10" fill="#999"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>`
};

// CSS Injektálása a szebb dizájnért
const trelloStyle = document.createElement('style');
trelloStyle.innerHTML = `
    .mp-trello-card {
        background: #fff;
        border: 1px solid #e1e4e8;
        border-radius: 6px;
        padding: 12px;
        margin-bottom: 10px;
        transition: box-shadow 0.2s ease, transform 0.1s;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
    .mp-trello-card:hover {
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        transform: translateY(-1px);
        border-color: #0079bf;
    }
    .mp-trello-list-badge {
        display: inline-block;
        background: #f4f5f7;
        color: #172b4d;
        font-size: 10px;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 3px;
        margin-bottom: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border: 1px solid #dfe1e6;
    }
    .mp-trello-labels {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-bottom: 6px;
    }
    .mp-trello-label {
        font-size: 10px;
        padding: 2px 8px;
        border-radius: 10px;
        font-weight: 700;
        color: white;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        box-shadow: 0 1px 1px rgba(0,0,0,0.1);
    }
    .mp-trello-title a {
        color: #172b4d !important;
        font-weight: 600;
        font-size: 13px;
        text-decoration: none;
        line-height: 1.4;
        display: block;
    }
    .mp-trello-title a:hover {
        color: #0079bf !important;
        text-decoration: underline;
    }
    .mp-trello-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        padding-top: 8px;
        border-top: 1px dashed #eee;
        font-size: 11px;
        color: #6b778c;
    }
    .mp-trello-btn {
        background: #f4f5f7;
        color: #172b4d;
        border: none;
        padding: 4px 10px;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        transition: background 0.2s;
    }
    .mp-trello-btn:hover {
        background: #ebecf0;
    }
    .mp-trello-badge {
        background: #e1e4e8;
        color: #172b4d;
        padding: 2px 6px;
        border-radius: 10px;
        font-size: 9px;
        margin-left: 4px;
    }
`;
document.head.appendChild(trelloStyle);

// Késleltetett indítás (Performance Fix)
// Nem blokkoljuk a fő renderelést, várunk amíg a böngésző "levegőhöz jut"
if (window.location.href.includes('termek_id=')) {
    if (document.readyState === 'complete') {
        setTimeout(initTrelloPanel, 500);
    } else {
        window.addEventListener('load', () => setTimeout(initTrelloPanel, 500));
    }
}

async function initTrelloPanel() {
    const skuInput = document.getElementById('cikkszam');
    if (!skuInput) return;
    const sku = skuInput.value.trim();

    // 1. Célterület keresése
    const stockPanelTitle = Array.from(document.querySelectorAll('.x_title h2')).find(el => el.innerText.includes('Készlet'));
    if (!stockPanelTitle) return;

    const rightCol = stockPanelTitle.closest('.col-md-4');

    // 2. Konténer létrehozása (ha még nincs)
    if (document.getElementById('mp-trello-panel')) return;

    const trelloPanel = document.createElement('div');
    trelloPanel.className = 'x_panel margbot20';
    trelloPanel.id = 'mp-trello-panel';
    trelloPanel.innerHTML = `
        <div class="x_title">
            <h2>${T_ICONS.trello} Trello Keresés</h2>
            <ul class="nav navbar-right panel_toolbox">
                <li><a class="collapse-link" style="cursor:pointer;"><i class="fa fa-chevron-up"></i></a></li>
            </ul>
            <div class="clearfix"></div>
        </div>
        <div class="x_content" id="mp-trello-content" style="min-height:60px;">
            <div style="text-align:center; padding:15px; color:#777;">
                <span class="mp-loading-pulse">Adatok lekérése...</span>
            </div>
        </div>
    `;

    // Aljára szúrjuk be (appendChild)
    rightCol.appendChild(trelloPanel);

    // Collapse logika
    trelloPanel.querySelector('.collapse-link').addEventListener('click', function() {
        const content = trelloPanel.querySelector('.x_content');
        const icon = this.querySelector('i');
        if (content.style.display === 'none') {
            content.style.display = 'block';
            icon.className = 'fa fa-chevron-up';
        } else {
            content.style.display = 'none';
            icon.className = 'fa fa-chevron-down';
        }
    });

    // 3. Adatlekérés (Aszinkron, nem blokkol)
    fetchTrelloCards(sku);
}

function fetchTrelloCards(sku) {
    chrome.runtime.sendMessage({ action: "fetchTrelloData", type: "search", query: sku }, (response) => {
        const container = document.getElementById('mp-trello-content');
        
        if (!response || !response.success || !response.data.cards || response.data.cards.length === 0) {
            container.innerHTML = `<div style="text-align:center; color:#999; padding:10px; font-size:12px; font-style:italic;">Nincs találat a Trelloban erre a cikkszámra.</div>`;
            return;
        }

        renderTrelloCards(response.data.cards, container);
    });
}

function renderTrelloCards(cards, container) {
    let html = `<div style="display:flex; flex-direction:column; gap:0;">`;

    cards.forEach(card => {
        // OSZLOP NÉV (ÚJ!)
        let listName = '';
        if (card.list && card.list.name) {
            listName = card.list.name;
        } else if (card.idList) {
            // Fallback: ha nincs list objektum, csak az ID
            listName = `Lista: ${card.idList.substring(0, 8)}...`;
        }
        
        const listBadge = listName 
            ? `<div class="mp-trello-list-badge">${listName}</div>` 
            : '';
        
        // CÍMKÉK (Javított logika)
        let labelsHtml = '';
        if (card.labels && card.labels.length > 0) {
            labelsHtml = `<div class="mp-trello-labels">`;
            card.labels.forEach(l => {
                // Trello API színek mapolása
                const colorMap = {
                    green: '#61bd4f', yellow: '#f2d600', orange: '#ff9f1a', red: '#eb5a46',
                    purple: '#c377e0', blue: '#0079bf', sky: '#00c2e0', lime: '#51e898',
                    pink: '#ff78cb', black: '#344563', 
                    null: '#b6bbbf'
                };
                // Ha a szín neve jön vissza (pl "green"), vagy hex kód, vagy null
                let bg = colorMap[l.color] || '#b6bbbf';
                
                // Szöveg fallback: Ha nincs név, akkor a színt írjuk ki vagy üres
                const text = l.name ? l.name : '&nbsp;&nbsp;';
                labelsHtml += `<span class="mp-trello-label" style="background:${bg};">${text}</span>`;
            });
            labelsHtml += `</div>`;
        }

        // KOMMENTEK SZÁMA
        // A 'badges' objektumban van a comments szám
        const commentCount = (card.badges && card.badges.comments) ? card.badges.comments : 0;
        const commentBadge = commentCount > 0 
            ? `<span class="mp-trello-badge">${commentCount}</span>` 
            : '';

        // DÁTUM
        const lastActivity = new Date(card.dateLastActivity).toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' });

        // KÁRTYA HTML (Új Design + Oszlop név)
        html += `
            <div class="mp-trello-card">
                ${listBadge}
                ${labelsHtml}
                <div class="mp-trello-title">
                    <a href="${card.shortUrl}" target="_blank">${card.name} ${T_ICONS.external}</a>
                </div>
                
                <div class="mp-trello-footer">
                    <div>📅 ${lastActivity}</div>
                    <button class="mp-trello-btn mp-trello-comments-btn" data-id="${card.id}">
                        ${T_ICONS.comment} Hozzászólások ${commentBadge}
                    </button>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;

    // Gomb események
    container.querySelectorAll('.mp-trello-comments-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openTrelloCommentsModal(btn.dataset.id);
        });
    });
}

function openTrelloCommentsModal(cardId) {
    let modal = document.getElementById('mp-m360-modal');
    
    // Modal létrehozása ha nincs (Fallback)
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'mp-m360-modal';
        modal.className = 'mp-modal-overlay';
        modal.style.cssText = "display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; align-items:center; justify-content:center;";
        modal.innerHTML = `
            <div class="mp-modal-content" style="background:white; width:500px; max-width:90%; border-radius:8px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.2);">
                <div class="mp-modal-header" style="padding:15px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center; background:#f9f9f9;">
                    <div class="mp-modal-title" style="font-weight:bold;"><span style="color:#0079bf;">${T_ICONS.trello}</span> Adatlap</div>
                    <div class="mp-modal-close" style="cursor:pointer; font-size:20px; color:#999;">&times;</div>
                </div>
                <div class="mp-modal-body" id="mp-modal-body-content" style="padding:0;"></div>
            </div>`;
        document.body.appendChild(modal);
        modal.querySelector('.mp-modal-close').onclick = () => { modal.style.display = 'none'; };
        modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
    }

    const modalBody = document.getElementById('mp-modal-body-content');
    modalBody.innerHTML = `<div style="text-align:center; padding:40px;">${T_ICONS.trello} Hozzászólások betöltése...</div>`;
    modal.style.display = 'flex';

    chrome.runtime.sendMessage({ action: "fetchTrelloData", type: "getComments", cardId: cardId }, (response) => {
        if (!response || !response.success) {
            modalBody.innerHTML = `<div style="color:red; padding:20px; text-align:center;">Hiba a betöltéskor.</div>`;
            return;
        }

        const comments = response.data;
        if (!comments || comments.length === 0) {
            modalBody.innerHTML = `<div style="text-align:center; padding:40px; color:#777;">Nincsenek hozzászólások ezen a kártyán.</div>`;
            return;
        }

        let html = `<div style="padding:15px; max-height:500px; overflow-y:auto; background:#f4f5f7;">`;
        comments.forEach(c => {
            const text = c.data.text ? c.data.text.replace(/\n/g, '<br>') : '';
            const author = c.memberCreator.fullName;
            const date = new Date(c.date).toLocaleString('hu-HU');
            const avatar = c.memberCreator.avatarUrl ? `<img src="${c.memberCreator.avatarUrl}/30.png" style="width:24px; height:24px; border-radius:50%;">` : `<div style="width:24px; height:24px; background:#ddd; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px;">${author.charAt(0)}</div>`;

            html += `
                <div style="background:white; border-radius:8px; padding:12px; margin-bottom:10px; box-shadow:0 1px 2px rgba(0,0,0,0.05);">
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                        ${avatar}
                        <div style="font-size:12px; font-weight:bold; color:#172b4d;">${author}</div>
                        <div style="font-size:10px; color:#6b778c; margin-left:auto;">${date}</div>
                    </div>
                    <div style="font-size:13px; color:#172b4d; line-height:1.5; padding-left:32px;">${text}</div>
                </div>
            `;
        });
        html += `</div>`;
        modalBody.innerHTML = html;
    });
}