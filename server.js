import mongoose from "mongoose";
import app from "./app.js";

const { DB_HOST, PORT = 3000 } = process.env;
mongoose
    .connect(process.env.DB_HOST)
    .then(() => {
        app.listen(PORT, () => {
            console.log("Database connection successful. Server on port", PORT);
        });
    })
    .catch((error) => {
        console.log(error.message);
        process.exit(1);
    });
