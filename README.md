# NAZAR AI
### AI-Powered Public Infrastructure Intelligence & Automated Response Platform

> *"See the damage. Understand the risk. Trigger the action."*

NAZAR AI is an autonomous smart-city civil infrastructure intelligence platform that transforms raw public infrastructure photographs into actionable engineering intelligence, dynamic multi-factor public safety risk ratings, and automated municipal dispatch tickets.

---

## 🌟 Key Highlights & Innovations

1. **Real AI Computer Vision Inspection**:
   - Built on **Google Gemini 2.5 Flash Multimodal Vision** with structured JSON output schema.
   - Categorizes defect types: `POTHOLE`, `ROAD_CRACK`, `BROKEN_STREETLIGHT`, `GARBAGE_OVERFLOW`, `OPEN_MANHOLE`, `DAMAGED_FOOTPATH`, `DRAINAGE_ISSUE`, `OTHER`, `NO_DAMAGE`.
   - Extracts observable visual evidence, assigns model-estimated confidence, and formulates public safety implications.
   - Scientific uncertainty handling: explicitly clarifies that single 2D photographs provide qualitative indicators and not calibrated metric depths.

2. **Autonomous Action Trigger Engine (Core Differentiator)**:
   - When damage is confirmed by AI, the system autonomously triggers:
     - **Unique Incident ID** generation (`NAZ-2026-XXXX`).
     - **Jurisdictional Department Routing** (e.g., Pothole $\to$ Road Maintenance; Broken Streetlight $\to$ Electrical; Open Manhole $\to$ Drainage; Garbage $\to$ Sanitation).
     - **SLA Generation**: Strict response windows (Immediate $<6$h for Critical, $<24$h for High, $48$–$72$h for Medium).
     - **Prescribed Civil Action Plan**.
     - **In-App Dispatch Event Log & Topbar Notification**.
     - **Live GIS Map Pinning**.
     - **Animated HUD Action Confirmation** with sound cues and celebration effects.

3. **Intelligent Risk Assessment Engine**:
   - Multi-factor safety weighting across four distinct hazards:
     - Pedestrian Fall / Injury Hazard
     - Vehicular Impact / Blowout Risk
     - Mobility & Walkability Obstruction
     - Structural Moisture / Erosion Spread
   - Generates transparent, human-readable risk rationales.

4. **Lightweight Duplicate Incident Detection**:
   - Compares incoming defects against active tickets in real-time.
   - Evaluates category identity, geospatial proximity ($<250$ meters via Haversine calculation), and textual similarity.
   - Prevents duplicate city contractor dispatch with a deduplication warning dialog.

5. **Futuristic Command Center Experience**:
   - Ultra-premium dark navy aesthetic (`#070B14`, `#0D1424`) with electric blue and neon cyan accents.
   - Web Audio API real-time sound synthesizer (radar pings, scan oscillations, hazard alarms).
   - Interactive GIS Map with glowing, pulsating Leaflet markers and CartoDB Dark Matter tiles.
   - Recharts visual analytics: Defect inflow, severity proportions, department workload, and sector hotspots.
   - Formal audit-ready municipal work order generation with 1-click PDF/print styling.
   - 6 Built-in 1-Click Test Scenarios for instant evaluation without searching your hard drive.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Recharts, Canvas Confetti |
| **Mapping** | Leaflet, OpenStreetMap, CartoDB Dark Matter GIS Tiles |
| **Backend** | Node.js, Express, Google Gen AI SDK (`@google/generative-ai`), CORS, Dotenv, Multer |
| **Audio** | HTML5 Web Audio API Synthesizer (Zero asset dependencies) |
| **Persistence** | HTML5 LocalStorage with pre-seeded metropolitan dataset |

---

## 🚀 Quick Start Instructions

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v24)
- **npm** v9+

### 2. Installation
```bash
# Clone or navigate to the repository directory
cd sudarshanX

# Install all dependencies (already installed in workspace)
npm install
```

### 3. Environment Variables Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Inside `.env`:
```env
PORT=5000
# Optional: Provide your Google Gemini API key from https://aistudio.google.com/
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
```
> **Note on API Keys**: If you do not set an API key in `.env`, NAZAR AI **seamlessly runs in Smart Demo Mode** using deterministic high-fidelity heuristic scenario modeling. You can also paste your Gemini API key directly into the **Settings** tab in the web interface at any time!

### 4. Running the Platform
Run both the Express backend and the Vite frontend concurrently with a single command:
```bash
npm run dev
```

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🧭 Step-by-Step Demo Guide (For Judges & Evaluators)

1. **Command Center Overview (`Overview` Tab)**:
   - Observe live metropolitan KPIs: Total Logged, Critical Hazards, High Priority, In Progress, and Resolved.
   - Inspect the live Recharts visualizations: Damage Category Distribution, Severity Breakdown, Department Dispatch Load, and 7-day Inflow vs Resolution velocity.
   - Click any incident in the *Live Incident Stream* table to inspect its high-resolution imagery, AI telemetry, and audit trail.

2. **Core AI Vision Detection (`AI Detection` Tab)**:
   - **Method A (1-Click Test Scenarios)**: Click any scenario button at the top:
     - `Open Manhole` (Critical pedestrian fall void)
     - `Pothole` (High vehicular danger)
     - `Broken Streetlight` (Electrical & illumination hazard)
     - `Garbage Overflow` (Sanitation runoff & sidewalk blockage)
     - `Road Crack` (Bituminous fatigue cracking)
     - `Clean Road` (Sound infrastructure baseline)
   - **Method B (Upload or Camera)**: Drag & drop your own photograph or click *Use Device Camera*.
   - Click **Start Autonomous AI Analysis**.
   - Watch the holographic laser scan line traverse the image.
   - Review the detailed structured output:
     - Category and Model-estimated Confidence
     - Risk Score Matrix (0–100)
     - Observable Visual Evidence list
     - Department Auto-Routing & Prescribed Action Plan
     - Scientific uncertainty notice
   - Notice the **Automated Action Trigger HUD** appear, confirming ticket creation, department assignment, and SLA generation.

3. **Deduplication Engine Test**:
   - Run the same test scenario twice in succession at the same location.
   - Notice the **Deduplication Alert** modal, warning that an active incident already exists within proximity, with options to view the existing ticket or proceed.

4. **Incident Management Desk (`Incidents` Tab)**:
   - Search across tickets using the real-time query bar (e.g., search *"manhole"*, *"pothole"*, or *"central"*).
   - Filter by Category, Severity, Department, or Status (`OPEN`, `ASSIGNED`, `IN_PROGRESS`, `RESOLVED`).
   - Click *Details* on any incident to open the Operational Status Updater, enter operator notes, and update its lifecycle state. Notice the dashboard KPIs update immediately.

5. **Live Geospatial Map (`Live Map` Tab)**:
   - Pan and zoom across the interactive Leaflet dark-matter map.
   - Notice the custom pulsating glow markers color-coded by hazard severity (Red = Critical, Amber = High, Cyan = Medium, Green = Low).
   - Click any marker to view its defect photo, description, and SLA timer.
   - Click *Locate Current Position* to center the map on your GPS coordinates.

6. **Formal Report Generation (`Reports` Tab)**:
   - Select any incident from the selector dropdown.
   - Review the formal municipal civil dispatch document featuring official NAZAR AI seals, defect telemetry, visual evidence breakdown, and sign-off blocks.
   - Click **Print / Save as PDF** to generate an audit-ready document.

7. **System Settings (`Settings` Tab)**:
   - View live diagnostics showing backend connectivity and model state.
   - Add your Gemini API key or switch to Smart Demo Mode.
   - Review the autonomous jurisdictional routing matrix.
   - Use **Reset to Seed Data** to restore the demonstration baseline whenever needed.

---

## 📊 Automated Department Routing Matrix

| Detected Category | Assigned Municipal Department | Default SLA |
|---|---|---|
| `OPEN_MANHOLE` | **Drainage Department** | 6 Hours (Critical) |
| `POTHOLE` | **Road Maintenance** | 24 Hours (High) |
| `ROAD_CRACK` | **Road Maintenance** | 72 Hours (Medium) |
| `BROKEN_STREETLIGHT` | **Electrical Department** | 18 Hours (High) |
| `GARBAGE_OVERFLOW` | **Sanitation Department** | 36 Hours (Medium) |
| `DAMAGED_FOOTPATH` | **Public Works Department** | 48 Hours (Medium) |
| `DRAINAGE_ISSUE` | **Drainage Department** | 24 Hours (High) |
| `OTHER` | **General Administration** | 72 Hours (Medium) |
| `NO_DAMAGE` | **General Administration** | Archive (Low) |

---

## 🔒 Security & Privacy

- AI API keys are kept strictly on the backend or in local browser session memory—never hardcoded or exposed in static bundles.
- File upload validations enforce permitted MIME types (`image/jpeg`, `image/png`, `image/webp`).
- All simulated prototype department dispatches are clearly annotated to prevent deceptive claims of real municipal crew deployment.
- Leaflet map gracefully handles missing or denied geolocation without fabricating coordinates.

---

## 📈 Completed Features Checklist

- [x] **Futuristic Dark Navy Smart-City UI** with glassmorphism and cyan/electric blue accents.
- [x] **Collapsible Sidebar & Responsive Navigation** with 7 specialized modules.
- [x] **Real-time Command Center Dashboard** with 5 KPI cards and Recharts visualizations.
- [x] **Core AI Vision Detection Workspace** with drag & drop, file upload, device camera capture, and 6 sample presets.
- [x] **Node.js + Express Backend** with `/api/health` and `/api/analyze` endpoints.
- [x] **Official Google Gemini Multimodal SDK Integration** (`gemini-2.5-flash` / `gemini-1.5-flash`).
- [x] **Structured AI JSON Output Schema** with confidence, severity, evidence, and public safety risk.
- [x] **Intelligent Multi-Factor Risk Assessment Engine** with pedestrian, vehicular, and mobility hazard indices.
- [x] **Automated Action Trigger Engine** with animated confirmation modal, ticket creation, and department routing.
- [x] **Lightweight Duplicate Incident Detection** with Haversine spatial proximity and keyword similarity checks.
- [x] **Incident Management Desk** with search, multi-filters, sorting, and lifecycle status updates.
- [x] **Interactive Leaflet + OpenStreetMap Live Map** with custom glowing severity markers and radar animations.
- [x] **Municipal Infrastructure Analytics** with category frequencies, department workloads, and sector hotspots.
- [x] **Downloadable & Printable Formal Dispatch Reports** with clean CSS print media support.
- [x] **Platform Settings & Live Diagnostics** with custom API key configuration and database reset options.
- [x] **Web Audio API Sound Synthesizer** with audible tactile feedback and mute controls.

---

## 🔮 Future Roadmap (Post-Hackathon)

- **Firebase Firestore / Supabase Realtime Sync**: Cloud sync for multi-operator simultaneous coordination.
- **Drone Swarm Video Ingestion**: Real-time video frame stream sampling from autonomous aerial municipal patrols.
- **Citizen Mobile PWA**: Native citizen reporting app with auto-geotagging and rewards points for verified reports.
- **Municipal Work-Order Integration**: Direct bi-directional Webhooks into SAP, Cityworks, or Maximo enterprise systems.

---

## 📄 License
ISC License. Built for the Hackathon by an elite autonomous software engineering agent.
