const express = require("express");
let router = express.Router();
const dbPool = require("../dbConfig");


router.post("/update-theme", async (req, res) => {
    dbPool.query(
        "CREATE TABLE IF NOT EXISTS \"THEME_PREFERENCE\"(user_id SERIAL PRIMARY KEY,primary_colour VARCHAR, secondary_colour VARCHAR, text_colour VARCHAR, font_size VARCHAR, font VARCHAR)");

    const { userId, primaryColor, secondaryColor, textColor, fontSize, font } = req.body;

    const query = `
    UPDATE \"THEME_PREFERENCE\"
    SET primary_colour = $1, secondary_colour = $2,
        text_colour = $3, font_size = $4, font = $5
    WHERE user_id = $6
  `;

    const values = [primaryColor, secondaryColor, textColor, fontSize, font, userId];

    dbPool.query(query, values, (error, result) => {
        if (error) {
            console.error('Error updating theme preference:', error);
            res.status(500).json({ error: 'Failed to update theme preference' });
        } else {
            req.io.emit('theme-updated', { userId, primaryColor, secondaryColor, textColor, fontSize, font });
            res.status(200).json({ message: 'Theme preference updated successfully' });
        }
    });
})

module.exports = router;


