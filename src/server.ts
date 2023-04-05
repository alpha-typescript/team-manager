import App from "./app";
import { config } from "dotenv";
config({ path: "config/.env" });

const PORT = process.env.PORT || 8000;
const HOSTNAME = process.env.HOST || "localhost";

const app = new App();

app.server.listen(PORT, () => {
    console.log(`Server running on http://${HOSTNAME}:${PORT}`);
});
