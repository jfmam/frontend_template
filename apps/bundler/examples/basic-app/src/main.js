import { message } from "./message.js";
import { format } from "./utils/format.js";

const app = document.querySelector("#app");
app.textContent = format(message);

