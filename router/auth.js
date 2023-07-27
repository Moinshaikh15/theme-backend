const dbPool = require("../dbConfig");
const express = require("express");
const bcryptjs = require("bcryptjs");
let router = express.Router();


// signup
router.post("/signup", async (req, res) => {
    dbPool.query(
        "CREATE TABLE IF NOT EXISTS \"USER\"(ID SERIAL PRIMARY KEY,USER_NAME VARCHAR NOT NULL,password VARCHAR NOT NULL)");

    const { user_name, password } = req.body;


    let salt = await bcryptjs.genSalt(10);
    let hash = await bcryptjs.hash(password, salt);
    dbPool.query(
        `INSERT INTO "USER" (USER_NAME, password) VALUES ( $1, $2) RETURNING *`,
        [user_name, hash],
        (err, response) => {
            if (err) {
                console.log(err.stack);
                return res.status(400).send(err.stack);
            } else {
                response.rows[0].password = null
                return res.status(200).send({ message: "Signed up in successful", userInfo: response.rows[0] });
            }
        }
    );
});


// login
router.post("/login", (req, res) => {
    const { user_name, password } = req.body;

    dbPool.query(
        "SELECT * FROM \"USER\" WHERE user_name = $1",
        [user_name],
        async (err, response) => {
            if (err) {
                console.log(err.stack);
                return res.status(400).send(err.stack);
            } else {

                let existingUser = response.rows[0];

                if (existingUser !== undefined) {
                    let correctPass = await bcryptjs.compare(
                        password,
                        existingUser.password
                    );
                    if (correctPass) {
                        existingUser.password = null;

                        return res
                            .status(200)
                            .send({ message: "Log in successful", userInfo: existingUser });
                    }
                    return res.status(200).send("passwords does not match");
                }
                return res.status(400).send("user does not exists");
            }
        }
    );
});

module.exports = router;