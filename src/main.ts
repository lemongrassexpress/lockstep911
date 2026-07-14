import "./style.css";
import { sounds } from "./sound";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<button>hi</button>
`;

document
  .querySelector<HTMLDivElement>("#app")!
  .addEventListener("click", () => {
    sounds.cowbell.play();
  });
