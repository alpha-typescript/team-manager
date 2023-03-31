import App from "./app";
import { config } from "dotenv";
config({ path: "config/.env" }); // cool, thanks chatGPT

const PORT = process.env.PORT || 8000;
const HOSTNAME = process.env.HOST || "localhost";

const app = new App();

// remove later
import express from "express";
app.server.get("/", (req: express.Request, res: express.Response) => {
    res.status(200).send("Hello world!");
});

app.server.listen(PORT, () => {
    console.log(`Server running on http://${HOSTNAME}:${PORT}`);
});
