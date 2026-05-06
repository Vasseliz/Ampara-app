import { useState, useEffect } from "react";

let _nextId   = 0;
let _dispatch = null;

function show(message, type) {
  if (!_dispatch) return;
  const id = ++_nextId;
  _dispatch((prev) => [...prev, { id, message, type }]);
  setTimeout(() => {
    _dispatch((prev) => prev.filter((t) => t.id !== id));
  }, 3500);
}

export const toast = {
  success: (message) => show(message, "success"),
  error:   (message) => show(message, "error"),
  info:    (message) => show(message, "info"),
};

export function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    _dispatch = setToasts;
    return () => { _dispatch = null; };
  }, []);

  return (
    <div style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 9999,
      display: "flex", flexDirection: "column", gap: "0.5rem", pointerEvents: "none" }}>
      {toasts.map(({ id, message, type }) => (
        <div key={id} style={{
          background: type === "error" ? "#fef2f2" : "#f0faf4",
          color:      type === "error" ? "#b91c1c" : "#2d6b4a",
          border:     `1px solid ${type === "error" ? "#fecaca" : "#a7d7b8"}`,
          borderRadius: "0.75rem", padding: "0.65rem 1rem",
          fontSize: "0.875rem", fontWeight: 500, fontFamily: "inherit",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)", pointerEvents: "auto",
        }}>
          {message}
        </div>
      ))}
    </div>
  );
}