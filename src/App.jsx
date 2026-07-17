// src/App.jsx
import { useState, useMemo } from "react";
import { theme } from "./theme";
import { genFlights, formatPrice } from "./data";
import RouteArc from "./RouteArc";
import AirportSelect from "./AirportSelect";

function Nav({ onLogoClick }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "22px 32px",
        borderBottom: `1px solid ${theme.divider}`,
      }}
    >
      <span
        style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 19, cursor: "pointer" }}
        onClick={onLogoClick}
      >
        Arclane
      </span>
      <div className="nav-links" style={{ display: "flex", gap: 24, fontSize: 13.5, color: theme.textMuted }}>
        <span>Trips</span>
        <span>Deals</span>
        <span>Help</span>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <span
      className="spinner"
      style={{
        display: "inline-block",
        width: 14,
        height: 14,
        border: "2px solid rgba(11,30,61,0.3)",
        borderTopColor: theme.bg,
        borderRadius: "50%",
      }}
    />
  );
}

export default function App() {
  const [view, setView] = useState("search");
  const [origin, setOrigin] = useState("LOS");
  const [destination, setDestination] = useState("LHR");
  const [date, setDate] = useState("2026-09-14");
  const [passengers, setPassengers] = useState(1);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [traveler, setTraveler] = useState({ name: "", email: "" });
  const [bookingExtras, setBookingExtras] = useState(null);
  const [searching, setSearching] = useState(false);

  const flights = useMemo(
    () => genFlights(origin, destination, date),
    [origin, destination, date]
  );

  const shell = {
    background: theme.bg,
    color: theme.text,
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
  };

  const page = { maxWidth: 900, margin: "0 auto", padding: "0 32px 60px" };

  const inputStyle = {
    width: "100%",
    background: theme.bgAlt,
    border: `1px solid ${theme.divider}`,
    borderRadius: 8,
    padding: "12px 14px",
    color: theme.text,
    fontSize: 14,
  };

  const labelStyle = {
    fontSize: 12,
    color: theme.textMuted,
    marginBottom: 6,
    display: "block",
  };

  const primaryBtn = {
    background: theme.accent,
    color: theme.bg,
    border: "none",
    borderRadius: 8,
    padding: "12px 22px",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  };

  const backBtn = {
    background: "none",
    border: "none",
    color: theme.textMuted,
    cursor: "pointer",
    fontSize: 13.5,
    marginBottom: 20,
  };

  function handleSearch() {
    setSearching(true);
    // Fake a network round-trip so results don't just snap in instantly.
    setTimeout(() => {
      setSearching(false);
      setView("results");
    }, 700);
  }

  // ---------------- SEARCH ----------------
  if (view === "search") {
    return (
      <div style={shell} className="view">
        <Nav onLogoClick={() => setView("search")} />
        <div style={page}>
          <div style={{ paddingTop: 56 }}>
            <h1
              className="hero-title"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 40, lineHeight: 1.1, margin: "0 0 32px" }}
            >
              Plot the route.
              <br />
              Book the arc.
            </h1>

            <div
              className="search-card"
              style={{
                background: theme.card,
                border: `1px solid ${theme.divider}`,
                borderRadius: 16,
                padding: 24,
                display: "flex",
                gap: 20,
                alignItems: "flex-end",
                flexWrap: "wrap",
              }}
            >
              <AirportSelect label="From" value={origin} exclude={destination} onChange={setOrigin} />
              <AirportSelect label="To" value={destination} exclude={origin} onChange={setDestination} />

              <div>
                <div style={labelStyle}>Depart</div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{ ...inputStyle, colorScheme: "dark", width: 150 }}
                />
              </div>

              <div>
                <div style={labelStyle}>Travelers</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0" }}>
                  <button type="button" className="btn" onClick={() => setPassengers((p) => Math.max(1, p - 1))} style={{ ...primaryBtn, padding: "4px 10px", background: theme.bgAlt, color: theme.text }}>
                    −
                  </button>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{passengers}</span>
                  <button type="button" className="btn" onClick={() => setPassengers((p) => Math.min(6, p + 1))} style={{ ...primaryBtn, padding: "4px 10px", background: theme.bgAlt, color: theme.text }}>
                    +
                  </button>
                </div>
              </div>

              <button
                className="btn"
                onClick={handleSearch}
                disabled={searching}
                style={{ ...primaryBtn, marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}
              >
                {searching ? (<><Spinner /> Searching…</>) : "Search flights"}
              </button>
            </div>

            <div style={{ marginTop: 40 }}>
              <RouteArc origin={origin} destination={destination} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- RESULTS ----------------
  if (view === "results") {
    return (
      <div style={shell} className="view">
        <Nav onLogoClick={() => setView("search")} />
        <div style={page}>
          <div style={{ paddingTop: 32 }}>
            <button className="btn" onClick={() => setView("search")} style={backBtn}>
              ← Edit search
            </button>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", marginBottom: 4 }}>
              {origin} → {destination}
            </h2>
            <p style={{ color: theme.textMuted, fontSize: 13.5, marginBottom: 20 }}>
              {date} · {passengers} traveler{passengers > 1 ? "s" : ""}
            </p>

            {flights.length === 0 ? (
              // EMPTY STATE — every real app needs one of these for "no results"
              <div
                style={{
                  border: `1px dashed ${theme.divider}`,
                  borderRadius: 12,
                  padding: "48px 24px",
                  textAlign: "center",
                  color: theme.textMuted,
                }}
              >
                <div style={{ fontSize: 15, marginBottom: 8, color: theme.text }}>No flights found</div>
                <div style={{ fontSize: 13 }}>Try a different date or route.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {flights.map((f) => (
                  <div
                    key={f.id}
                    className="flight-card"
                    style={{
                      background: theme.card,
                      border: `1px solid ${theme.divider}`,
                      borderRadius: 12,
                      padding: "16px 20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{f.airline.name}</div>
                      <div style={{ fontSize: 12, color: theme.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>
                        {f.flightNo} · departs {f.depTime} · {f.duration} · {f.stops === 0 ? "Nonstop" : `${f.stops} stop`} · {f.baggage} checked
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, color: theme.accent, fontWeight: 700 }}>
                        {formatPrice(f.price)}
                      </div>
                      <button
                        className="btn"
                        onClick={() => {
                          setSelectedFlight(f);
                          setView("details");
                        }}
                        style={{ ...primaryBtn, background: theme.accent2, color: theme.text, padding: "8px 16px", fontSize: 13 }}
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---------------- TRAVELER DETAILS ----------------
  if (view === "details") {
    const f = selectedFlight;
    const total = f.price * passengers;
    const canContinue = traveler.name.trim().length > 1 && traveler.email.includes("@");

    return (
      <div style={shell} className="view">
        <Nav onLogoClick={() => setView("search")} />
        <div style={page}>
          <div style={{ paddingTop: 32, maxWidth: 560 }}>
            <button className="btn" onClick={() => setView("results")} style={backBtn}>
              ← Back to results
            </button>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", marginBottom: 20 }}>Traveler details</h2>

            <div
              style={{
                background: theme.card,
                border: `1px solid ${theme.divider}`,
                borderRadius: 12,
                padding: 18,
                marginBottom: 24,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {f.airline.name} · {f.flightNo}
                </div>
                <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>
                  {origin} {f.depTime} → {destination} · {date}
                </div>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 17, color: theme.accent, fontWeight: 700 }}>
                {formatPrice(f.price)}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Full name</label>
              <input
                value={traveler.name}
                onChange={(e) => setTraveler({ ...traveler, name: e.target.value })}
                placeholder="As it appears on your ID"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Email</label>
              <input
                value={traveler.email}
                onChange={(e) => setTraveler({ ...traveler, email: e.target.value })}
                placeholder="you@email.com"
                style={inputStyle}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28, flexWrap: "wrap", gap: 12 }}>
              <div style={{ fontSize: 13.5, color: theme.textMuted }}>
                Total for {passengers} traveler{passengers > 1 ? "s" : ""}:{" "}
                <b style={{ color: theme.text }}>{formatPrice(total)}</b>
              </div>
              <button
                className="btn"
                disabled={!canContinue}
                onClick={() => setView("payment")}
                style={{
                  ...primaryBtn,
                  background: canContinue ? theme.accent : theme.divider,
                  color: canContinue ? theme.bg : theme.textMuted,
                  cursor: canContinue ? "pointer" : "not-allowed",
                }}
              >
                Continue to payment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- PAYMENT ----------------
  if (view === "payment") {
    const f = selectedFlight;
    const total = f.price * passengers;

    return (
      <div style={shell} className="view">
        <Nav onLogoClick={() => setView("search")} />
        <div style={page}>
          <div style={{ paddingTop: 32, maxWidth: 480 }}>
            <button className="btn" onClick={() => setView("details")} style={backBtn}>
              ← Back
            </button>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", marginBottom: 20 }}>Payment</h2>

            <div style={{ background: theme.card, border: `1px solid ${theme.divider}`, borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 12.5, color: theme.textMuted, marginBottom: 16 }}>
                Demo checkout — no real payment is processed.
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Card number</label>
                <input placeholder="4242 4242 4242 4242" style={{ ...inputStyle, fontFamily: "'JetBrains Mono', monospace" }} />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Expiry</label>
                  <input placeholder="MM/YY" style={{ ...inputStyle, fontFamily: "'JetBrains Mono', monospace" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>CVC</label>
                  <input placeholder="123" style={{ ...inputStyle, fontFamily: "'JetBrains Mono', monospace" }} />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, flexWrap: "wrap", gap: 12 }}>
              <div style={{ fontSize: 14, color: theme.textMuted }}>
                Total due: <b style={{ color: theme.accent, fontFamily: "'JetBrains Mono', monospace" }}>{formatPrice(total)}</b>
              </div>
              <button
                className="btn"
                onClick={() => {
                  setBookingExtras({
                    seat: `14${String.fromCharCode(65 + Math.floor(Math.random() * 6))}`,
                    gate: `B${2 + Math.floor(Math.random() * 20)}`,
                  });
                  setView("confirmation");
                }}
                style={{ ...primaryBtn, background: theme.accent2, color: theme.text }}
              >
                Confirm & pay
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- CONFIRMATION ----------------
  if (view === "confirmation") {
    const f = selectedFlight;
    const { seat, gate } = bookingExtras;

    return (
      <div style={shell} className="view">
        <Nav onLogoClick={() => setView("search")} />
        <div style={page}>
          <div style={{ paddingTop: 48, maxWidth: 480 }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22 }}>Booking confirmed</h2>
              <p style={{ color: theme.textMuted, fontSize: 13.5 }}>
                A copy was sent to {traveler.email}
              </p>
            </div>

            <div style={{ background: "#F7F8FA", color: theme.bg, borderRadius: 16, padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>Arclane</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>{f.flightNo}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 700 }}>{origin}</div>
                <div style={{ flex: 1, borderTop: "2px dashed rgba(11,30,61,0.25)", margin: "0 12px" }} />
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 700 }}>{destination}</div>
              </div>

              <div style={{ borderTop: "2px dashed rgba(11,30,61,0.25)", paddingTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, fontSize: 12.5 }}>
                <div>
                  <div style={{ color: "rgba(11,30,61,0.55)", fontSize: 10.5, textTransform: "uppercase" }}>Passenger</div>
                  <div style={{ fontWeight: 700 }}>{traveler.name}</div>
                </div>
                <div>
                  <div style={{ color: "rgba(11,30,61,0.55)", fontSize: 10.5, textTransform: "uppercase" }}>Seat</div>
                  <div style={{ fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{seat}</div>
                </div>
                <div>
                  <div style={{ color: "rgba(11,30,61,0.55)", fontSize: 10.5, textTransform: "uppercase" }}>Gate</div>
                  <div style={{ fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{gate}</div>
                </div>
              </div>
            </div>

            <button
              className="btn"
              onClick={() => {
                setView("search");
                setSelectedFlight(null);
                setTraveler({ name: "", email: "" });
                setBookingExtras(null);
              }}
              style={{ ...primaryBtn, width: "100%", marginTop: 24, background: "transparent", border: `1px solid ${theme.divider}`, color: theme.text }}
            >
              Book another flight
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}