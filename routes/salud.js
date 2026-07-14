const express = require('express');
const router = express.Router();
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'funcionando correctamente', timestamp: new Date().toISOString() });

});

module.exports = router;