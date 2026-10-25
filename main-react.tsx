import { createRoot } from "react-dom/client";

function App() {
  return (
    <div>
      <h2>React version</h2>
      <p>React is running alongside the vanilla app.</p>
    </div>
  );
}

const rootElement = document.getElementById("react-root");

if (rootElement) {
  createRoot(rootElement).render(<App />);
}