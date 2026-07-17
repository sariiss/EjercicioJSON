const express = require('express');
const router = express.Router();

// ============ ENDPOINT DE SALUD ============//
router.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'funcionando correctamente', 
        timestamp: new Date().toISOString() 
    });
});

module.exports = router;