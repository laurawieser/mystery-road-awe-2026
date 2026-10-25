import { createRoot } from "react-dom/client";
import ReactApp from "./ReactApp";

const rootElement = document.getElementById("react-root");

if (rootElement) {
  createRoot(rootElement).render(<ReactApp />);
}