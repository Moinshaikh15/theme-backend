const express = require("express");
let router = express.Router();
const dbPool = require("../dbConfig");


router.post("/update-theme", async (req, res) => {
    dbPool.query(
        "CREATE TABLE IF NOT EXISTS \"THEME_PREFERENCE\"(user_id SERIAL PRIMARY KEY,primary_colour VARCHAR, secondary_colour VARCHAR, text_colour VARCHAR, font_size VARCHAR, font VARCHAR)");

    const { userId, primaryColor, secondaryColor, textColor, fontSize, font } = req.body;

    const query = `
    INSERT INTO "THEME_PREFERENCE" (user_id, primary_colour, secondary_colour, text_colour, font_size, font)
    VALUES ($6,$1, $2, $3, $4, $5)
    ON CONFLICT (user_id)
    DO UPDATE SET
      primary_colour = EXCLUDED.primary_colour,
      secondary_colour = EXCLUDED.secondary_colour,
      text_colour = EXCLUDED.text_colour,
      font_size = EXCLUDED.font_size,
      font = EXCLUDED.font
    RETURNING *;`;

    const values = [primaryColor, secondaryColor, textColor, fontSize, font, userId];

    dbPool.query(query, values, (error, result) => {
        if (error) {
            console.error('Error updating theme preference:', error);
            res.status(500).json({ error: 'Failed to update theme preference' });
        } else {
            req.io.emit('theme-updated', result.rows[0]);
            res.status(200).json({ message: 'Theme preference updated successfully' });
        }
    });
})

module.exports = router;


