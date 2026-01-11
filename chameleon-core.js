// ============================================================================
// MOBILPONT CHAMELEON CORE MODULE v1.0
// Küldetés: 100% natív OVIP megjelenés - "láthatatlan integráció"
// ============================================================================

console.log("🎭 Chameleon Mode aktiválva");

// ============================================================================
// 1. OVIP STYLE SCRAPER - Natív stílusok kinyerése
// ============================================================================

const OVIPStyles = {
    // Cache a scraped stílusoknak
    _cache: {},
    _lastScrape: null,
    _scrapeCooldown: 5000, // 5 mp cache

    /**
     * Főfüggvény: OVIP natív stílus scrapelése
     * @param {string} selector - CSS selector (pl. '.btn-primary')
     * @param {array} properties - Kinyerendő CSS tulajdonságok
     * @returns {object} - Computed style objektum
     */
    scrape(selector, properties = []) {
        const cacheKey = `${selector}_${properties.join(',')}`;
        
        // Cache ellenőrzés
        if (this._cache[cacheKey] && (Date.now() - this._lastScrape < this._scrapeCooldown)) {
            console.log(`🎭 [CACHE HIT] ${selector}`);
            return this._cache[cacheKey];
        }

        // DOM elem keresése
        const element = document.querySelector(selector);
        if (!element) {
            console.warn(`⚠️ [SCRAPE FAIL] Nem található: ${selector}`);
            return this._getFallbackStyle(selector);
        }

        // Computed style kinyerése
        const computed = window.getComputedStyle(element);
        const scraped = {};

        // Ha nincs megadva property lista, default-ot használunk
        const propsToScrape = properties.length > 0 ? properties : this._getDefaultProperties();

        propsToScrape.forEach(prop => {
            scraped[prop] = computed.getPropertyValue(prop);
        });

        // Cache mentése
        this._cache[cacheKey] = scraped;
        this._lastScrape = Date.now();

        console.log(`✅ [SCRAPE SUCCESS] ${selector}`, scraped);
        return scraped;
    },

    /**
     * Default CSS properties gomb/panel scrapeléshez
     */
    _getDefaultProperties() {
        return [
            'font-family',
            'font-size',
            'font-weight',
            'color',
            'background-color',
            'border',
            'border-radius',
            'padding',
            'margin',
            'box-shadow',
            'transition',
            'line-height',
            'text-transform',
            'letter-spacing'
        ];
    },

    /**
     * Fallback stílus, ha nem található az OVIP elem
     */
    _getFallbackStyle(selector) {
        console.log(`🔄 Fallback stílus használata: ${selector}`);
        
        // OVIP alapértelmezett stílusok (manual backup)
        const ovipDefaults = {
            '.btn-primary': {
                'font-family': '"Open Sans", sans-serif',
                'font-size': '14px',
                'font-weight': '400',
                'color': '#fff',
                'background-color': '#5A738E',
                'border': '1px solid #5A738E',
                'border-radius': '3px',
                'padding': '6px 12px',
                'box-shadow': 'none',
                'transition': 'background-color 0.2s ease',
                'line-height': '1.42857143',
                'text-transform': 'none',
                'letter-spacing': 'normal'
            },
            '.btn-success': {
                'font-family': '"Open Sans", sans-serif',
                'font-size': '14px',
                'font-weight': '400',
                'color': '#fff',
                'background-color': '#26B99A',
                'border': '1px solid #26B99A',
                'border-radius': '3px',
                'padding': '6px 12px',
                'box-shadow': 'none',
                'transition': 'background-color 0.2s ease',
                'line-height': '1.42857143',
                'text-transform': 'none',
                'letter-spacing': 'normal'
            },
            '.btn-danger': {
                'font-family': '"Open Sans", sans-serif',
                'font-size': '14px',
                'font-weight': '400',
                'color': '#fff',
                'background-color': '#E74C3C',
                'border': '1px solid #E74C3C',
                'border-radius': '3px',
                'padding': '6px 12px',
                'box-shadow': 'none',
                'transition': 'background-color 0.2s ease',
                'line-height': '1.42857143',
                'text-transform': 'none',
                'letter-spacing': 'normal'
            },
            '.x_panel': {
                'background-color': '#fff',
                'border': '1px solid #E6E9ED',
                'border-radius': '3px',
                'box-shadow': '0 1px 1px rgba(0,0,0,0.05)',
                'padding': '0',
                'margin-bottom': '20px'
            },
            '.x_title': {
                'border-bottom': '2px solid #E6E9ED',
                'padding': '10px 15px',
                'background-color': '#F7F7F7',
                'font-family': '"Open Sans", sans-serif',
                'font-size': '16px',
                'font-weight': '600',
                'color': '#73879C'
            }
        };

        return ovipDefaults[selector] || {};
    },

    /**
     * Több elem batch scrapelése
     */
    scrapeMultiple(selectors) {
        const results = {};
        selectors.forEach(selector => {
            results[selector] = this.scrape(selector);
        });
        return results;
    },

    /**
     * Cache törlése (ha frissíteni kell a stílusokat)
     */
    clearCache() {
        this._cache = {};
        this._lastScrape = null;
        console.log("🗑️ Chameleon cache törölve");
    }
};

// ============================================================================
// 2. NATÍV GOMB GENERÁTOR - 100% OVIP kinézet
// ============================================================================

const ChameleonButton = {
    /**
     * Natív OVIP gomb létrehozása
     * @param {object} options - Gomb konfiguráció
     * @returns {HTMLElement} - Natív gomb elem
     */
    create(options = {}) {
        const defaults = {
            text: 'Mobilpont',
            type: 'primary', // primary, success, danger, info, warning
            icon: null, // SVG string vagy null
            onClick: null,
            className: '', // Extra CSS class
            style: {}, // Egyedi style override
            attributes: {} // Egyedi attribútumok (data-*, id, stb.)
        };

        const config = { ...defaults, ...options };

        // OVIP gomb stílus scrapelése
        const ovipStyle = this._getOVIPButtonStyle(config.type);

        // Gomb elem létrehozása
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `btn btn-${config.type} ${config.className}`.trim();

        // Szöveg + ikon összeállítása
        let content = '';
        if (config.icon) {
            content += `<span style="display:inline-flex; align-items:center; margin-right:6px;">${config.icon}</span>`;
        }
        content += config.text;
        button.innerHTML = content;

        // OVIP natív stílus alkalmazása
        this._applyStyle(button, ovipStyle);

        // Egyedi style override
        if (Object.keys(config.style).length > 0) {
            this._applyStyle(button, config.style);
        }

        // Egyedi attribútumok
        Object.entries(config.attributes).forEach(([key, value]) => {
            button.setAttribute(key, value);
        });

        // Click handler
        if (config.onClick && typeof config.onClick === 'function') {
            button.addEventListener('click', config.onClick);
        }

        // Hover effect (OVIP natív)
        this._attachHoverEffect(button, config.type);

        console.log(`🎭 Chameleon gomb generálva: ${config.text}`);
        return button;
    },

    /**
     * OVIP gomb típus stílus meghatározása
     */
    _getOVIPButtonStyle(type) {
        const typeMap = {
            'primary': '.btn-primary',
            'success': '.btn-success',
            'danger': '.btn-danger',
            'info': '.btn-info',
            'warning': '.btn-warning',
            'default': '.btn-default'
        };

        const selector = typeMap[type] || typeMap.primary;
        return OVIPStyles.scrape(selector);
    },

    /**
     * Style objektum alkalmazása elemre
     */
    _applyStyle(element, styleObj) {
        Object.entries(styleObj).forEach(([prop, value]) => {
            // CSS property név konverzió (font-size → fontSize)
            const camelProp = prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            element.style[camelProp] = value;
        });
    },

    /**
     * OVIP natív hover effect
     */
    _attachHoverEffect(button, type) {
        // OVIP hover: sötétebb background
        const hoverMap = {
            'primary': '#4A5F75',
            'success': '#1D9B84',
            'danger': '#D43F2F',
            'info': '#1F91C7',
            'warning': '#D68910',
            'default': '#D4D4D4'
        };

        const originalBg = button.style.backgroundColor;
        const hoverBg = hoverMap[type] || hoverMap.default;

        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = hoverBg;
            button.style.cursor = 'pointer';
        });

        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = originalBg;
        });
    },

    /**
     * Gomb csoport létrehozása (OVIP btn-group)
     */
    createGroup(buttons = []) {
        const group = document.createElement('div');
        group.className = 'btn-group';
        group.style.display = 'inline-flex';
        group.style.gap = '5px';

        buttons.forEach(buttonConfig => {
            const btn = this.create(buttonConfig);
            group.appendChild(btn);
        });

        return group;
    }
};

// ============================================================================
// 3. NATÍV PANEL GENERÁTOR - OVIP x_panel klónozása
// ============================================================================

const ChameleonPanel = {
    /**
     * Natív OVIP panel létrehozása
     * @param {object} options - Panel konfiguráció
     * @returns {HTMLElement} - Natív panel elem
     */
    create(options = {}) {
        const defaults = {
            title: 'Mobilpont Panel',
            icon: null,
            content: '',
            collapsible: true,
            collapsed: false,
            className: '',
            toolbox: [] // Toolbox gombok (pl. refresh)
        };

        const config = { ...defaults, ...options };

        // OVIP panel stílus scrapelése
        const panelStyle = OVIPStyles.scrape('.x_panel');
        const titleStyle = OVIPStyles.scrape('.x_title');

        // Panel konténer
        const panel = document.createElement('div');
        panel.className = `x_panel ${config.className}`.trim();
        this._applyStyle(panel, panelStyle);

        // Title bar
        const titleBar = this._createTitleBar(config, titleStyle);
        panel.appendChild(titleBar);

        // Content
        const content = document.createElement('div');
        content.className = 'x_content';
        content.style.padding = '15px';
        content.style.display = config.collapsed ? 'none' : 'block';
        
        if (typeof config.content === 'string') {
            content.innerHTML = config.content;
        } else if (config.content instanceof HTMLElement) {
            content.appendChild(config.content);
        }

        panel.appendChild(content);

        console.log(`🎭 Chameleon panel generálva: ${config.title}`);
        return panel;
    },

    /**
     * Panel fejléc (x_title) létrehozása
     */
    _createTitleBar(config, titleStyle) {
        const titleBar = document.createElement('div');
        titleBar.className = 'x_title';
        this._applyStyle(titleBar, titleStyle);

        // Cím
        const h2 = document.createElement('h2');
        h2.style.margin = '0';
        h2.style.fontSize = titleStyle['font-size'] || '16px';
        h2.style.fontWeight = titleStyle['font-weight'] || '600';
        h2.style.color = titleStyle['color'] || '#73879C';
        h2.style.display = 'flex';
        h2.style.alignItems = 'center';
        h2.style.gap = '8px';

        if (config.icon) {
            const iconSpan = document.createElement('span');
            iconSpan.innerHTML = config.icon;
            h2.appendChild(iconSpan);
        }
        h2.appendChild(document.createTextNode(config.title));
        titleBar.appendChild(h2);

        // Toolbox (collapse, close, stb.)
        if (config.collapsible || config.toolbox.length > 0) {
            const toolboxUl = document.createElement('ul');
            toolboxUl.className = 'nav navbar-right panel_toolbox';
            toolboxUl.style.cssText = 'float:right; list-style:none; padding:0; margin:0; display:flex; gap:10px;';

            // Collapse gomb
            if (config.collapsible) {
                const collapseLi = document.createElement('li');
                const collapseLink = document.createElement('a');
                collapseLink.className = 'collapse-link';
                collapseLink.style.cursor = 'pointer';
                collapseLink.style.color = '#73879C';
                collapseLink.innerHTML = '<i class="fa fa-chevron-up"></i>';

                collapseLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const content = titleBar.nextElementSibling;
                    const icon = collapseLink.querySelector('i');
                    
                    if (content.style.display === 'none') {
                        content.style.display = 'block';
                        icon.className = 'fa fa-chevron-up';
                    } else {
                        content.style.display = 'none';
                        icon.className = 'fa fa-chevron-down';
                    }
                });

                collapseLi.appendChild(collapseLink);
                toolboxUl.appendChild(collapseLi);
            }

            // Egyedi toolbox gombok
            config.toolbox.forEach(tool => {
                const li = document.createElement('li');
                const link = document.createElement('a');
                link.style.cursor = 'pointer';
                link.style.color = '#73879C';
                link.innerHTML = tool.icon || '<i class="fa fa-cog"></i>';
                if (tool.onClick) {
                    link.addEventListener('click', tool.onClick);
                }
                li.appendChild(link);
                toolboxUl.appendChild(li);
            });

            titleBar.appendChild(toolboxUl);
        }

        // Clearfix
        const clearfix = document.createElement('div');
        clearfix.className = 'clearfix';
        clearfix.style.clear = 'both';
        titleBar.appendChild(clearfix);

        return titleBar;
    },

    /**
     * Style objektum alkalmazása elemre
     */
    _applyStyle(element, styleObj) {
        Object.entries(styleObj).forEach(([prop, value]) => {
            const camelProp = prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            element.style[camelProp] = value;
        });
    }
};

// ============================================================================
// 4. CONTEXT DETECTOR - Intelligens oldal felismerés
// ============================================================================

const ContextDetector = {
    /**
     * Aktuális OVIP kontextus meghatározása
     * @returns {object} - Context info
     */
    detect() {
        const url = window.location.href;
        const context = {
            type: 'unknown',
            pageId: null,
            capabilities: [],
            data: {}
        };

        // Termék oldal
        if (url.includes('termek_id=')) {
            context.type = 'product';
            context.pageId = this._extractParam(url, 'termek_id');
            context.capabilities = ['m360', 'woocommerce', 'trello', 'print'];
            context.data.sku = this._extractSKU();
            context.data.title = this._extractProductTitle();
        }
        // Rendelés oldal
        else if (url.includes('rendelesek') && url.includes('id=')) {
            context.type = 'order';
            context.pageId = this._extractParam(url, 'id');
            context.capabilities = ['m360', 'trello', 'print'];
            context.data.orderNumber = this._extractOrderNumber();
            context.data.imeis = this._extractIMEIs();
        }
        // Szerviz munkalap
        else if (document.getElementById('megrendelo_leiras')) {
            context.type = 'service';
            context.pageId = this._extractServiceId();
            context.capabilities = ['m360', 'trello', 'print'];
            context.data.serviceNumber = this._extractServiceNumber();
            context.data.identifier = this._extractIdentifier();
        }
        // Raktár / készlet
        else if (url.includes('raktarkeszlet')) {
            context.type = 'warehouse';
            context.capabilities = ['woocommerce', 'trello'];
        }

        console.log('🧠 Context detected:', context);
        return context;
    },

    /**
     * URL paraméter kinyerése
     */
    _extractParam(url, param) {
        const regex = new RegExp(`[?&]${param}=([^&#]*)`);
        const match = url.match(regex);
        return match ? match[1] : null;
    },

    /**
     * SKU kinyerése termék oldalról
     */
    _extractSKU() {
        const skuLabel = Array.from(document.querySelectorAll('strong')).find(el => el.textContent.includes('Cikkszám:'));
        if (skuLabel) {
            const skuText = skuLabel.nextSibling?.textContent?.trim();
            return skuText || null;
        }
        return null;
    },

    /**
     * Termék név kinyerése
     */
    _extractProductTitle() {
        const h2 = document.querySelector('h2');
        return h2 ? h2.textContent.trim() : null;
    },

    /**
     * Rendelésszám kinyerése
     */
    _extractOrderNumber() {
        const headerEl = document.querySelector('.bizonylat_fejlec span');
        return headerEl ? headerEl.textContent.trim() : null;
    },

    /**
     * IMEI-k kinyerése rendelésből
     */
    _extractIMEIs() {
        const imeis = [];
        const rows = document.querySelectorAll('.table-striped tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach(cell => {
                const match = cell.textContent.match(/(?<!\d)\d{15}(?!\d)/);
                if (match) imeis.push(match[0]);
            });
        });
        return [...new Set(imeis)]; // Deduplikálás
    },

    /**
     * Szerviz azonosító kinyerése
     */
    _extractServiceId() {
        const sorszamInput = document.getElementById('sorszam');
        return sorszamInput?.value?.trim() || null;
    },

    /**
     * Szerviz sorszám kinyerése
     */
    _extractServiceNumber() {
        return this._extractServiceId();
    },

    /**
     * IMEI/Serial kinyerése szerviz leírásból
     */
    _extractIdentifier() {
        const textArea = document.getElementById('megrendelo_leiras');
        if (!textArea) return null;

        const rawContent = textArea.value || textArea.innerHTML;
        const cleanText = this._decodeHtml(rawContent);

        // IMEI keresés
        let match = cleanText.match(/(?<!\d)\d{15}(?!\d)/);
        if (match) return match[0];

        // Serial Number keresés
        const snMatch = cleanText.match(/(?:SN|Serial|S\/N)[:\s]+([A-Za-z0-9]{8,15})/i);
        if (snMatch) return snMatch[1];

        return null;
    },

    _decodeHtml(html) {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }
};

// ============================================================================
// 5. AUTO-INJECTOR - Intelligens gomb/panel injektálás
// ============================================================================

const AutoInjector = {
    /**
     * Kontextus alapú automatikus injektálás
     */
    inject() {
        const context = ContextDetector.detect();

        switch (context.type) {
            case 'product':
                this._injectProductButtons(context);
                break;
            case 'order':
                this._injectOrderButtons(context);
                break;
            case 'service':
                this._injectServiceButtons(context);
                break;
            default:
                console.log('⚠️ Nincs injektálás erre a kontextusra');
        }
    },

    /**
     * Termék oldal gombok
     */
    _injectProductButtons(context) {
        console.log('🔧 Product page injection...');
        
        // Célpont: Képek melletti panel toolbox
        const targetToolbox = document.querySelector('.x_panel .panel_toolbox');
        if (!targetToolbox) return;

        // WooCommerce gomb
        if (context.capabilities.includes('woocommerce') && context.data.sku) {
            const wooBtn = ChameleonButton.create({
                text: 'WP Admin',
                type: 'info',
                icon: '<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
                onClick: () => {
                    const wpUrl = `https://mobilpontszeged.hu/wp-admin/post.php?post=PRODUCT_ID&action=edit`;
                    // TODO: Product ID lekérése API-ból SKU alapján
                    window.open(wpUrl, '_blank');
                }
            });
            targetToolbox.insertBefore(wooBtn, targetToolbox.firstChild);
        }

        // Trello gomb
        if (context.capabilities.includes('trello') && context.data.sku) {
            const trelloBtn = ChameleonButton.create({
                text: 'Trello',
                type: 'primary',
                icon: '<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h6v16H4zm10 0h6v10h-6z"/></svg>',
                onClick: () => {
                    // TODO: Trello keresés SKU alapján
                    console.log('Trello search:', context.data.sku);
                }
            });
            targetToolbox.insertBefore(trelloBtn, targetToolbox.firstChild);
        }

        console.log('✅ Product buttons injected');
    },

    /**
     * Rendelés oldal gombok
     */
    _injectOrderButtons(context) {
        console.log('🔧 Order page injection...');
        
        // TODO: Rendelés oldal gomb injektálás
        // (A meglévő initOrderPage() logikával való integráció)
    },

    /**
     * Szerviz oldal gombok
     */
    _injectServiceButtons(context) {
        console.log('🔧 Service page injection...');
        
        // TODO: Szerviz oldal gomb injektálás
        // (A meglévő initServicePage() logikával való integráció)
    }
};

// ============================================================================
// EXPORT (Global scope-ba)
// ============================================================================

window.ChameleonCore = {
    OVIPStyles,
    ChameleonButton,
    ChameleonPanel,
    ContextDetector,
    AutoInjector
};

console.log("✅ Chameleon Core betöltve - Használat: window.ChameleonCore");