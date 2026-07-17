// src/AirportSelect.jsx
import { useState } from "react";
import { theme } from "./theme";
import { AIRPORTS } from "./data";

export default function AirportSelect({ label, value, onChange, exclude }) {
  const [open, setOpen] = useState(false);
  const current = AIRPORTS.find((a) => a.code === value);

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          fontSize: 11,
          color: theme.textMuted,
          marginBottom: 6,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          background: theme.bgAlt,
          border: `1px solid ${theme.divider}`,
          borderRadius: 8,
          padding: "10px 14px",
          color: theme.text,
          cursor: "pointer",
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          minWidth: 140,
        }}
      >
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700 }}>
          {current?.code}
        </span>
        <span style={{ fontSize: 12.5, color: theme.textMuted }}>{current?.city}</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: 6,
            background: theme.card,
            border: `1px solid ${theme.divider}`,
            borderRadius: 10,
            width: 200,
            zIndex: 20,
            boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
          }}
        >
          {AIRPORTS.filter((a) => a.code !== exclude).map((a) => (
            <div
              key={a.code}
              onClick={() => {
                onChange(a.code);
                setOpen(false);
              }}
              style={{
                padding: "10px 14px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13.5,
                borderBottom: `1px solid ${theme.divider}`,
              }}
            >
              <span>{a.city}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: theme.textMuted }}>
                {a.code}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}