// ============================================================================
// MOBILPONT - DEFAULT API CREDENTIALS
// ============================================================================
// 
// Ezek az alapértelmezett API kulcsok, amelyek a bővítmény telepítése után
// azonnal működnek. A Settings oldalon felülírhatók, ha szükséges.
//
// FONTOS: Ha frissülnek a kulcsok, csak ezt a fájlt kell módosítani!
// ============================================================================

const DEFAULT_CREDENTIALS = {
    // M360 API
    m360: {
        authCode: "a288f785-08e1-435f-8c7f-207318822fc1",
        authToken: "efd4b88b4db6a568e1ed210b0af2a669f7098caede53ada2e9100ad0789714db"
    },
    
    // Trello API
    trello: {
        apiKey: "d5992c73e5e2daa2a7897774c2f67fea",
        apiToken: "ATTA304c0825a7563f6cc1f8df4bd211b94bcfa62a89189e9787f92e791b837b2560D3B036A4"
    },
    
    // Trello List IDs (szerviz workflow-hoz)
    trelloLists: {
        'UGYFELES': '68848d52b8cc28c623fa2c1c', 
        'PARTNER': '68b165ae199f07aa179f9189'
    }
};

// Export (hogy más fájlok is használhassák)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DEFAULT_CREDENTIALS;
}
