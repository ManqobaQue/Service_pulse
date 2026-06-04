import { useState } from "react";

const WARDS = ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5", "Ward 6", "Ward 7", "Ward 8"];

const STATUS = {
  good: { label: "Operational", color: "#22c55e", bg: "#052e16" },
  warning: { label: "Disrupted", color: "#f59e0b", bg: "#1c1008" },
  critical: { label: "Critical", color: "#ef4444", bg: "#1c0a0a" },
};

const services = [
  { id: "electricity", icon: "⚡", label: "Electricity", status: "warning", reports: 43, lastUpdate: "2h ago" },
  { id: "water", icon: "💧", label: "Water & Sanitation", status: "critical", reports: 91, lastUpdate: "30m ago" },
  { id: "roads", icon: "🛣️", label: "Roads & Potholes", status: "warning", reports: 67, lastUpdate: "1h ago" },
  { id: "waste", icon: "🗑️", label: "Waste Collection", status: "good", reports: 12, lastUpdate: "4h ago" },
];

const recentReports = [
  { id: 1, type: "Water", location: "Murchison St, Ward 3", time: "12 min ago", status: "open", desc: "Main pipe burst near intersection" },
  { id: 2, type: "Electricity", location: "Lyell St, Ward 5", time: "34 min ago", status: "in-progress", desc: "No power since last night" },
  { id: 3, type: "Roads", location: "Keate St, Ward 2", time: "1h ago", status: "open", desc: "Large pothole damaging vehicles" },
  { id: 4, type: "Waste", location: "Alexandra Rd, Ward 7", time: "3h ago", status: "resolved", desc: "Missed collection for 2 weeks" },
  { id: 5, type: "Water", location: "Pietermaritz St, Ward 1", time: "5h ago", status: "in-progress", desc: "Low water pressure reported" },
];

const loadshedding = { stage: 2, next: "18:00 – 20:30", area: "Ladysmith North", tomorrow: "06:00 – 08:30" };

const statusColor = { open: "#ef4444", "in-progress": "#f59e0b", resolved: "#22c55e" };
const statusLabel = { open: "Open", "in-progress": "In Progress", resolved: "Resolved" };

export default function ServicePulse() {
  const [view, setView] = useState("resident");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [reportStep, setReportStep] = useState(1);
  const [reportData, setReportData] = useState({ type: "", ward: "", desc: "" });
  const [submitted, setSubmitted] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [photos, setPhotos] = useState([]);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      size: (file.size / 1024).toFixed(1) + " KB"
    }));
    setPhotos(prev => [...prev, ...previews].slice(0, 3));
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (reportData.type && reportData.ward && reportData.desc) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false); setReportStep(1);
        setReportData({ type: "", ward: "", desc: "" });
        setPhotos([]);
        setActiveTab("dashboard");
      }, 3000);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0e1a", color: "#e2e8f0",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      display: "flex", flexDirection: "column"
    }}>
      {/* Header */}
      <header style={{
        borderBottom: "1px solid #1e2d4a", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 60, position: "sticky", top: 0, background: "#0a0e1a", zIndex: 50
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg, #1d4ed8, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18
          }}>📡</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.02em", color: "#f1f5f9" }}>
              Alfred Duma <span style={{ color: "#3b82f6" }}>Service Pulse</span>
            </div>
            <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "monospace" }}>
              Ladysmith · KwaZulu-Natal
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div style={{
          display: "flex", background: "#111827", borderRadius: 8, padding: 3,
          border: "1px solid #1e2d4a", gap: 2
        }}>
          {["resident", "official"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: "5px 14px", borderRadius: 6, border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase",
              background: view === v ? (v === "official" ? "#7c3aed" : "#1d4ed8") : "transparent",
              color: view === v ? "#fff" : "#64748b", transition: "all 0.2s"
            }}>{v === "official" ? "🔒 Official" : "👤 Resident"}</button>
          ))}
        </div>
      </header>

      {/* Load Shedding Banner */}
      <div style={{
        background: "linear-gradient(90deg, #1c1008, #0a0e1a)",
        borderBottom: "1px solid #92400e", padding: "8px 24px",
        display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap"
      }}>
        <span style={{ fontSize: 11, color: "#f59e0b", fontWeight: 700, letterSpacing: "0.1em", fontFamily: "monospace" }}>
          ⚡ ESKOM STAGE {loadshedding.stage}
        </span>
        <span style={{ fontSize: 12, color: "#d97706" }}>
          Next outage: <strong style={{ color: "#fbbf24" }}>{loadshedding.next}</strong> · {loadshedding.area}
        </span>
        <span style={{ fontSize: 11, color: "#92400e" }}>Tomorrow: {loadshedding.tomorrow}</span>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "#78716c", fontFamily: "monospace" }}>
          via EskomSePush
        </span>
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar Nav */}
        <nav style={{
          width: 200, borderRight: "1px solid #1e2d4a", padding: "20px 12px",
          display: "flex", flexDirection: "column", gap: 4, background: "#080c17"
        }}>
          {[
            { id: "dashboard", icon: "◈", label: "Dashboard" },
            { id: "report", icon: "＋", label: "Report Issue" },
            { id: "map", icon: "◎", label: "Ward Map" },
            ...(view === "official" ? [
              { id: "analytics", icon: "▦", label: "Analytics" },
              { id: "manage", icon: "≡", label: "Manage Reports" },
            ] : [
              { id: "track", icon: "◉", label: "Track Report" },
            ])
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
              borderRadius: 7, border: "none", cursor: "pointer", textAlign: "left",
              background: activeTab === item.id ? "#1e2d4a" : "transparent",
              color: activeTab === item.id ? "#93c5fd" : "#64748b",
              fontSize: 13, fontWeight: activeTab === item.id ? 600 : 400,
              transition: "all 0.15s"
            }}>
              <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{item.icon}</span>
              {item.label}
            </button>
          ))}

          <div style={{ marginTop: "auto", padding: "12px", borderTop: "1px solid #1e2d4a" }}>
            <div style={{ fontSize: 10, color: "#334155", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Live Stats</div>
            <div style={{ fontSize: 12, color: "#475569" }}>213 active reports</div>
            <div style={{ fontSize: 12, color: "#475569" }}>27 wards covered</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 6px #22c55e" }}></span>
              <span style={{ fontSize: 10, color: "#4ade80" }}>System online</span>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main style={{ flex: 1, padding: "24px", overflowY: "auto" }}>

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>
                  Service Status Overview
                </h1>
                <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>
                  Real-time service delivery status for Alfred Duma Municipality
                </p>
              </div>

              {/* Service Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 28 }}>
                {services.map(svc => {
                  const s = STATUS[svc.status];
                  return (
                    <div key={svc.id} onClick={() => setSelectedService(selectedService === svc.id ? null : svc.id)}
                      style={{
                        background: s.bg, border: `1px solid ${s.color}30`,
                        borderRadius: 12, padding: "18px 20px", cursor: "pointer",
                        transition: "all 0.2s",
                        boxShadow: selectedService === svc.id ? `0 0 20px ${s.color}20` : "none",
                        borderColor: selectedService === svc.id ? s.color : `${s.color}30`
                      }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <span style={{ fontSize: 24 }}>{svc.icon}</span>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginTop: 8 }}>{svc.label}</div>
                          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2, fontFamily: "monospace" }}>Updated {svc.lastUpdate}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            background: `${s.color}20`, border: `1px solid ${s.color}40`,
                            borderRadius: 20, padding: "3px 10px"
                          }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, display: "inline-block" }}></span>
                            <span style={{ fontSize: 11, color: s.color, fontWeight: 600 }}>{s.label}</span>
                          </div>
                          <div style={{ fontSize: 22, fontWeight: 700, color: s.color, marginTop: 10 }}>{svc.reports}</div>
                          <div style={{ fontSize: 10, color: "#64748b" }}>active reports</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent Reports */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 600, color: "#94a3b8", margin: 0, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Recent Community Reports
                  </h2>
                  <span style={{ fontSize: 11, color: "#3b82f6", cursor: "pointer" }}>View all →</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {recentReports.map(r => (
                    <div key={r.id} style={{
                      background: "#0f172a", border: "1px solid #1e293b",
                      borderRadius: 10, padding: "14px 16px",
                      display: "flex", alignItems: "flex-start", gap: 14
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 8, background: "#1e293b",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0
                      }}>
                        {services.find(s => s.label.includes(r.type))?.icon || "📋"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{r.type}</span>
                            <span style={{ fontSize: 12, color: "#64748b", marginLeft: 8 }}>{r.location}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{
                              fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                              background: `${statusColor[r.status]}20`, color: statusColor[r.status],
                              border: `1px solid ${statusColor[r.status]}40`
                            }}>{statusLabel[r.status]}</span>
                            <span style={{ fontSize: 11, color: "#475569", fontFamily: "monospace" }}>{r.time}</span>
                          </div>
                        </div>
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{r.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* REPORT ISSUE */}
          {activeTab === "report" && (
            <div style={{ maxWidth: 540 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", margin: "0 0 4px" }}>Report an Issue</h1>
              <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 28px" }}>Help your community by reporting service delivery problems.</p>

              {submitted ? (
                <div style={{
                  background: "#052e16", border: "1px solid #16a34a", borderRadius: 14,
                  padding: 32, textAlign: "center"
                }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#4ade80", marginBottom: 8 }}>Report Submitted!</div>
                  <div style={{ fontSize: 13, color: "#86efac" }}>Reference: <strong>#ALD-{Math.floor(Math.random() * 9000) + 1000}</strong></div>
                  <div style={{ fontSize: 12, color: "#4ade80", marginTop: 8 }}>You'll be notified when the status changes.</div>
                </div>
              ) : (
                <div>
                  {/* Progress */}
                  <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
                    {[1, 2, 3, 4].map(step => (
                      <div key={step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center",
                          justifyContent: "center", fontSize: 12, fontWeight: 700,
                          background: reportStep >= step ? "#1d4ed8" : "#1e293b",
                          color: reportStep >= step ? "#fff" : "#475569",
                          border: `2px solid ${reportStep >= step ? "#3b82f6" : "#1e293b"}`
                        }}>{step}</div>
                        {step < 4 && <div style={{ width: 28, height: 2, background: reportStep > step ? "#1d4ed8" : "#1e293b" }}></div>}
                      </div>
                    ))}
                    <div style={{ marginLeft: 8, fontSize: 12, color: "#64748b", alignSelf: "center" }}>
                      {["Select Type", "Add Details", "Add Photos", "Confirm"][reportStep - 1]}
                    </div>
                  </div>

                  {/* Step 1 */}
                  {reportStep === 1 && (
                    <div>
                      <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 14 }}>What type of issue?</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        {services.map(svc => (
                          <button key={svc.id} onClick={() => { setReportData({ ...reportData, type: svc.id }); setReportStep(2); }}
                            style={{
                              background: "#0f172a", border: `2px solid ${reportData.type === svc.id ? "#3b82f6" : "#1e293b"}`,
                              borderRadius: 12, padding: "20px 16px", cursor: "pointer", textAlign: "center",
                              transition: "all 0.2s"
                            }}>
                            <div style={{ fontSize: 32, marginBottom: 8 }}>{svc.icon}</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{svc.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2 */}
                  {reportStep === 2 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div>
                        <label style={{ fontSize: 13, color: "#94a3b8", display: "block", marginBottom: 8 }}>Select your ward</label>
                        <select value={reportData.ward} onChange={e => setReportData({ ...reportData, ward: e.target.value })}
                          style={{
                            width: "100%", padding: "10px 14px", background: "#0f172a",
                            border: "1px solid #1e293b", borderRadius: 8, color: "#e2e8f0",
                            fontSize: 13, outline: "none"
                          }}>
                          <option value="">Choose ward...</option>
                          {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 13, color: "#94a3b8", display: "block", marginBottom: 8 }}>Street / Location</label>
                        <input placeholder="e.g. Corner of Murchison & Lyell St"
                          style={{
                            width: "100%", padding: "10px 14px", background: "#0f172a",
                            border: "1px solid #1e293b", borderRadius: 8, color: "#e2e8f0",
                            fontSize: 13, outline: "none", boxSizing: "border-box"
                          }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 13, color: "#94a3b8", display: "block", marginBottom: 8 }}>Describe the problem</label>
                        <textarea rows={4} value={reportData.desc}
                          onChange={e => setReportData({ ...reportData, desc: e.target.value })}
                          placeholder="What exactly is the issue? How long has it been happening?"
                          style={{
                            width: "100%", padding: "10px 14px", background: "#0f172a",
                            border: "1px solid #1e293b", borderRadius: 8, color: "#e2e8f0",
                            fontSize: 13, outline: "none", resize: "vertical", boxSizing: "border-box"
                          }} />
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={() => setReportStep(1)} style={{
                          flex: 1, padding: "11px", background: "#1e293b", border: "none",
                          borderRadius: 8, color: "#94a3b8", fontSize: 13, cursor: "pointer"
                        }}>← Back</button>
                        <button onClick={() => reportData.ward && reportData.desc && setReportStep(3)} style={{
                          flex: 2, padding: "11px", background: "#1d4ed8", border: "none",
                          borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer"
                        }}>Continue →</button>
                      </div>
                    </div>
                  )}

                  {/* Step 3 — Photos */}
                  {reportStep === 3 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div>
                        <label style={{ fontSize: 13, color: "#94a3b8", display: "block", marginBottom: 4 }}>Add Photos <span style={{ color: "#475569" }}>(optional — up to 3)</span></label>
                        <p style={{ fontSize: 12, color: "#475569", marginBottom: 12 }}>A photo helps the municipal team understand and prioritise the issue faster.</p>

                        {/* Upload / Camera Box */}
                        <label htmlFor="photo-upload" style={{
                          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                          border: "2px dashed #1e293b", borderRadius: 12, padding: "28px 20px",
                          cursor: "pointer", background: "#0f172a", transition: "border-color 0.2s",
                          marginBottom: 14
                        }}>
                          <div style={{ fontSize: 36, marginBottom: 10 }}>📷</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 4 }}>Tap to take a photo or upload</div>
                          <div style={{ fontSize: 11, color: "#475569" }}>JPG, PNG — max 5MB each</div>
                          <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            capture="environment"
                            multiple
                            onChange={handlePhotoUpload}
                            style={{ display: "none" }}
                          />
                        </label>

                        {/* Photo Previews */}
                        {photos.length > 0 && (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                            {photos.map((photo, i) => (
                              <div key={i} style={{ position: "relative", borderRadius: 8, overflow: "hidden", border: "1px solid #1e293b" }}>
                                <img src={photo.url} alt={`upload-${i}`} style={{ width: "100%", height: 90, objectFit: "cover", display: "block" }} />
                                <button onClick={() => removePhoto(i)} style={{
                                  position: "absolute", top: 4, right: 4, width: 20, height: 20,
                                  borderRadius: "50%", background: "#ef444499", border: "none",
                                  color: "#fff", fontSize: 11, cursor: "pointer", display: "flex",
                                  alignItems: "center", justifyContent: "center", fontWeight: 700
                                }}>✕</button>
                                <div style={{ fontSize: 9, color: "#64748b", padding: "3px 6px", background: "#0f172a", textAlign: "center" }}>{photo.size}</div>
                              </div>
                            ))}
                            {photos.length < 3 && (
                              <label htmlFor="photo-upload" style={{
                                height: 90, border: "2px dashed #1e293b", borderRadius: 8,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", color: "#475569", fontSize: 22
                              }}>+</label>
                            )}
                          </div>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={() => setReportStep(2)} style={{
                          flex: 1, padding: "11px", background: "#1e293b", border: "none",
                          borderRadius: 8, color: "#94a3b8", fontSize: 13, cursor: "pointer"
                        }}>← Back</button>
                        <button onClick={() => setReportStep(4)} style={{
                          flex: 2, padding: "11px", background: "#1d4ed8", border: "none",
                          borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer"
                        }}>{photos.length > 0 ? `Continue with ${photos.length} photo${photos.length > 1 ? "s" : ""} →` : "Skip & Continue →"}</button>
                      </div>
                    </div>
                  )}

                  {/* Step 4 — Confirm */}
                  {reportStep === 4 && (
                    <div>
                      <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 20, marginBottom: 20 }}>
                        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.08em" }}>Review your report</div>
                        {[
                          { label: "Type", value: services.find(s => s.id === reportData.type)?.label },
                          { label: "Ward", value: reportData.ward },
                          { label: "Description", value: reportData.desc },
                          { label: "Photos", value: photos.length > 0 ? `${photos.length} photo${photos.length > 1 ? "s" : ""} attached` : "None" },
                        ].map(f => (
                          <div key={f.label} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                            <span style={{ fontSize: 12, color: "#475569", width: 80, flexShrink: 0 }}>{f.label}</span>
                            <span style={{ fontSize: 13, color: "#e2e8f0" }}>{f.value}</span>
                          </div>
                        ))}
                        {photos.length > 0 && (
                          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                            {photos.map((p, i) => (
                              <img key={i} src={p.url} alt="" style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 6, border: "1px solid #1e293b" }} />
                            ))}
                          </div>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={() => setReportStep(3)} style={{
                          flex: 1, padding: "11px", background: "#1e293b", border: "none",
                          borderRadius: 8, color: "#94a3b8", fontSize: 13, cursor: "pointer"
                        }}>← Back</button>
                        <button onClick={handleSubmit} style={{
                          flex: 2, padding: "11px", background: "linear-gradient(135deg, #1d4ed8, #7c3aed)",
                          border: "none", borderRadius: 8, color: "#fff", fontSize: 13,
                          fontWeight: 700, cursor: "pointer"
                        }}>Submit Report ✓</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* MAP VIEW */}
          {activeTab === "map" && (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", margin: "0 0 4px" }}>Ward Issue Map</h1>
              <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 20px" }}>Ladysmith / Alfred Duma — live report density by ward</p>
              <div style={{
                background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14,
                height: 340, display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", overflow: "hidden"
              }}>
                {/* Simulated map grid */}
                <div style={{ position: "absolute", inset: 0, opacity: 0.07 }}>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} style={{ position: "absolute", left: `${(i % 4) * 25}%`, top: `${Math.floor(i / 4) * 33}%`, width: "25%", height: "33%", border: "1px solid #3b82f6" }}></div>
                  ))}
                </div>
                {/* Ward blobs */}
                {[
                  { label: "W3", x: 30, y: 40, size: 52, color: "#ef4444", count: 91 },
                  { label: "W5", x: 58, y: 55, size: 44, color: "#f59e0b", count: 43 },
                  { label: "W2", x: 45, y: 25, size: 38, color: "#f59e0b", count: 67 },
                  { label: "W7", x: 70, y: 30, size: 24, color: "#22c55e", count: 12 },
                  { label: "W1", x: 20, y: 65, size: 30, color: "#f59e0b", count: 28 },
                  { label: "W6", x: 80, y: 65, size: 20, color: "#22c55e", count: 8 },
                ].map(ward => (
                  <div key={ward.label} style={{
                    position: "absolute", left: `${ward.x}%`, top: `${ward.y}%`,
                    width: ward.size, height: ward.size, borderRadius: "50%",
                    background: `${ward.color}25`, border: `2px solid ${ward.color}60`,
                    transform: "translate(-50%, -50%)",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: "all 0.2s",
                    boxShadow: `0 0 ${ward.size / 2}px ${ward.color}30`
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: ward.color }}>{ward.label}</div>
                    <div style={{ fontSize: 9, color: ward.color, opacity: 0.8 }}>{ward.count}</div>
                  </div>
                ))}
                <div style={{ position: "absolute", bottom: 14, right: 14, display: "flex", gap: 12 }}>
                  {[["#ef4444", "Critical"], ["#f59e0b", "Issues"], ["#22c55e", "Clear"]].map(([color, label]) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }}></span>
                      <span style={{ fontSize: 10, color: "#64748b" }}>{label}</span>
                    </div>
                  ))}
                </div>
                <div style={{ position: "absolute", top: 14, left: 14, fontSize: 11, color: "#334155", fontFamily: "monospace" }}>
                  LADYSMITH · 27 WARDS
                </div>
              </div>

              {/* Ward List */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 16 }}>
                {WARDS.map((w, i) => {
                  const counts = [91, 67, 43, 28, 12, 8, 15, 34];
                  const colors = ["#ef4444", "#f59e0b", "#f59e0b", "#f59e0b", "#22c55e", "#22c55e", "#22c55e", "#f59e0b"];
                  return (
                    <div key={w} style={{
                      background: "#0f172a", border: `1px solid ${colors[i]}30`,
                      borderRadius: 8, padding: "10px 12px"
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>{w}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: colors[i], marginTop: 2 }}>{counts[i]}</div>
                      <div style={{ fontSize: 10, color: "#475569" }}>reports</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* OFFICIAL ANALYTICS */}
          {activeTab === "analytics" && view === "official" && (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", margin: "0 0 4px" }}>Analytics</h1>
              <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 24px" }}>Service delivery performance — April 2026</p>

              {/* KPI Row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
                {[
                  { label: "Total Reports", value: "213", delta: "+18%", up: true },
                  { label: "Resolved", value: "89", delta: "42%", up: true },
                  { label: "Avg. Resolution", value: "4.2d", delta: "-0.8d", up: true },
                  { label: "Unresolved >7d", value: "31", delta: "+5", up: false },
                ].map(kpi => (
                  <div key={kpi.label} style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: "16px" }}>
                    <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>{kpi.label}</div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: "#f1f5f9", margin: "6px 0 4px" }}>{kpi.value}</div>
                    <div style={{ fontSize: 11, color: kpi.up ? "#4ade80" : "#f87171" }}>{kpi.delta} this month</div>
                  </div>
                ))}
              </div>

              {/* Bar Chart Simulation */}
              <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Reports by Category
                </div>
                {services.map(svc => {
                  const pct = [43, 91, 67, 12][services.indexOf(svc)];
                  const maxPct = 91;
                  return (
                    <div key={svc.id} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: "#94a3b8" }}>{svc.icon} {svc.label}</span>
                        <span style={{ fontSize: 12, color: "#64748b", fontFamily: "monospace" }}>{pct} reports</span>
                      </div>
                      <div style={{ background: "#1e293b", borderRadius: 4, height: 8 }}>
                        <div style={{
                          width: `${(pct / maxPct) * 100}%`, height: "100%", borderRadius: 4,
                          background: STATUS[svc.status].color, transition: "width 0.6s ease"
                        }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* SLA Table */}
              <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  SLA Performance by Ward
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #1e293b" }}>
                      {["Ward", "Reports", "Resolved", "Avg Days", "SLA"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "6px 8px", fontSize: 11, color: "#475569", textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Ward 3", 91, 34, 5.2, "warning"],
                      ["Ward 2", 67, 41, 3.8, "good"],
                      ["Ward 5", 43, 20, 6.1, "critical"],
                      ["Ward 1", 28, 18, 2.9, "good"],
                      ["Ward 8", 34, 22, 4.0, "good"],
                    ].map(([ward, rep, res, days, sla]) => (
                      <tr key={ward} style={{ borderBottom: "1px solid #0f172a" }}>
                        <td style={{ padding: "10px 8px", fontSize: 13, color: "#e2e8f0" }}>{ward}</td>
                        <td style={{ padding: "10px 8px", fontSize: 13, color: "#94a3b8", fontFamily: "monospace" }}>{rep}</td>
                        <td style={{ padding: "10px 8px", fontSize: 13, color: "#94a3b8", fontFamily: "monospace" }}>{res}</td>
                        <td style={{ padding: "10px 8px", fontSize: 13, color: "#94a3b8", fontFamily: "monospace" }}>{days}d</td>
                        <td style={{ padding: "10px 8px" }}>
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                            background: `${STATUS[sla].color}20`, color: STATUS[sla].color
                          }}>{STATUS[sla].label}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TRACK */}
          {activeTab === "track" && (
            <div style={{ maxWidth: 500 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", margin: "0 0 4px" }}>Track Your Report</h1>
              <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 24px" }}>Enter your reference number to check the status.</p>
              <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                <input placeholder="e.g. ALD-4821" style={{
                  flex: 1, padding: "11px 14px", background: "#0f172a",
                  border: "1px solid #1e293b", borderRadius: 8, color: "#e2e8f0", fontSize: 14, outline: "none"
                }} />
                <button style={{
                  padding: "11px 20px", background: "#1d4ed8", border: "none",
                  borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer"
                }}>Search</button>
              </div>
              {/* Sample result */}
              <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>💧 Water Leak</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>Murchison St, Ward 3</div>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                    background: "#f59e0b20", color: "#f59e0b", border: "1px solid #f59e0b40", height: "fit-content"
                  }}>In Progress</span>
                </div>
                {[
                  { label: "Reported", date: "Apr 20, 09:14", done: true },
                  { label: "Acknowledged", date: "Apr 20, 11:30", done: true },
                  { label: "Team Dispatched", date: "Apr 21, 08:00", done: true },
                  { label: "Resolved", date: "Pending", done: false },
                ].map((step, i) => (
                  <div key={step.label} style={{ display: "flex", gap: 14, marginBottom: 12 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                        background: step.done ? "#1d4ed8" : "#1e293b",
                        border: `2px solid ${step.done ? "#3b82f6" : "#334155"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, color: step.done ? "#fff" : "#475569"
                      }}>{step.done ? "✓" : "○"}</div>
                      {i < 3 && <div style={{ width: 2, height: 20, background: step.done ? "#1d4ed8" : "#1e293b", margin: "3px 0" }}></div>}
                    </div>
                    <div style={{ paddingTop: 2 }}>
                      <div style={{ fontSize: 13, color: step.done ? "#e2e8f0" : "#475569" }}>{step.label}</div>
                      <div style={{ fontSize: 11, color: "#475569", fontFamily: "monospace" }}>{step.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MANAGE (Official) */}
          {activeTab === "manage" && view === "official" && (
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", margin: "0 0 4px" }}>Manage Reports</h1>
              <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 20px" }}>Review and update the status of all submitted reports.</p>
              <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
                {["All", "Open", "In Progress", "Resolved"].map(f => (
                  <button key={f} style={{
                    padding: "6px 14px", borderRadius: 20, border: "1px solid #1e293b",
                    background: f === "All" ? "#1d4ed8" : "#0f172a", color: f === "All" ? "#fff" : "#64748b",
                    fontSize: 12, cursor: "pointer"
                  }}>{f}</button>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {recentReports.map(r => (
                  <div key={r.id} style={{
                    background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10,
                    padding: "14px 16px", display: "flex", alignItems: "center", gap: 14
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{r.type}</span>
                        <span style={{ fontSize: 11, color: "#64748b" }}>{r.location}</span>
                        <span style={{ fontSize: 10, color: "#475569", marginLeft: "auto", fontFamily: "monospace" }}>{r.time}</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{r.desc}</div>
                    </div>
                    <select defaultValue={r.status} style={{
                      padding: "6px 10px", background: "#1e293b", border: "1px solid #334155",
                      borderRadius: 6, color: "#e2e8f0", fontSize: 12, cursor: "pointer"
                    }}>
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
