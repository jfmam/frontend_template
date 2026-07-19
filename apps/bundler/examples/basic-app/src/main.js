import { message } from "./message.js";
import { format } from "./utils/format.js";

const app = document.querySelector("#app");

function render(value) {
  app.textContent = format(value);
}

render(message);

if (import.meta.hot) {
  import.meta.hot.accept("./message.js", (updatedModule) => {
    render(updatedModule.message);
  });
}
