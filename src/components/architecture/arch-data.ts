export type ArchTaskMeta = {
  index: number;
  title: string;
  week: number;
  duration: string;
  deliverable: string;
};

export const ARCH_TASKS: ArchTaskMeta[] = [
  {
    index: 1,
    title: "Client Brief Analysis",
    week: 1,
    duration: "1 day",
    deliverable: "Brief Decoding Sheet: needs vs wants, every unknown flagged",
  },
  {
    index: 2,
    title: "Site Analysis",
    week: 1,
    duration: "2 days",
    deliverable: "Site Analysis Board (A2): 5 analysis layers + design implications",
  },
  {
    index: 3,
    title: "Space Programming & Adjacency",
    week: 2,
    duration: "2 days",
    deliverable: "Area Programme Table + Adjacency Justification (100 words)",
  },
  {
    index: 4,
    title: "Concept Direction",
    week: 2,
    duration: "1 day",
    deliverable: "MCQ selection + 50 word concept statement, assessed on evidence",
  },
  {
    index: 5,
    title: "Schematic Floor Plan",
    week: 3,
    duration: "2 days",
    deliverable: "Scaled floor plan + 3D massing, with self review checks",
  },
  {
    index: 6,
    title: "Elemental Cost Plan",
    week: 3,
    duration: "1 day",
    deliverable: "Elemental Cost Summary + Reconciliation Note (150 words)",
  },
  {
    index: 7,
    title: "Sustainability Coordination",
    week: 3,
    duration: "1 day",
    deliverable: "Sustainability Decision Matrix: select exactly 3 interventions",
  },
  {
    index: 8,
    title: "MEP Coordination",
    week: 4,
    duration: "1 day",
    deliverable: "Resolve 3 service conflicts before MEP drawings are issued",
  },
  {
    index: 9,
    title: "Site Review RFI",
    week: 4,
    duration: "1.5 days",
    deliverable: "Answer RFI-004 within 24 hours, brickwork gang on site tomorrow",
  },
  {
    index: 10,
    title: "Pre Construction Defect Audit",
    week: 4,
    duration: "1 day",
    deliverable: "Signed Defect Register + Mentor Note (150 words)",
  },
  {
    index: 11,
    title: "Crisis Management",
    week: 5,
    duration: "0.5 days",
    deliverable: "One page redesign memo to Principal Architect",
  },
];

export type Persona = { name: string; profile: string; need: string };
export const PERSONAS: Persona[] = [
  { name: "Asha, 16", profile: "Student, no home internet, 4 siblings", need: "Quiet study space after school" },
  { name: "Rajesh, 34", profile: "Freelancer, co-working costs INR 6,000 / month", need: "Affordable workspace away from home" },
  { name: "Meena, 62", profile: "Retired teacher, park too hot afternoons", need: "Social connection + shaded comfort" },
  { name: "Farhan, 28", profile: "NGO coordinator, rents halls INR 2,000 to 5,000 / event", need: "Affordable venue for workshops" },
];

export type SiteLayer = { layer: string; focus: string; placeholder: string };
export const SITE_LAYERS: SiteLayer[] = [
  { layer: "Physical & Topographic", focus: "Landform, drainage, trees, demolitions", placeholder: "e.g. 0.4m fall NE to SW suggests drainage direction; black cotton soil means raft foundation at upper rate..." },
  { layer: "Climate & Solar", focus: "Sun path, winds, shading, thermal", placeholder: "e.g. Deep overhangs required on E and W. Cross ventilation from SW (monsoon) and E to W (dry season)..." },
  { layer: "Urban Context", focus: "Street grid, pedestrian flows, views", placeholder: "e.g. Primary pedestrian approach from DP Road east. Park on west is visual and acoustic asset..." },
  { layer: "Noise & Services", focus: "Noise sources, utility connections, access", placeholder: "e.g. Library should not face DP Road (68 to 72 dB). Place library west or shield with buffer zone..." },
  { layer: "Regulatory Envelope", focus: "Setbacks, FAR, height, parking", placeholder: "e.g. Max buildable area = FAR 2.0 x 4,856 = 9,712 sq.m..." },
];

export type ProgrammeRow = { space: string; benchmark: string; emphasis?: boolean };
export const PROGRAMME_ROWS: ProgrammeRow[] = [
  { space: "Library + stacks", benchmark: "3,500 sq.ft." },
  { space: "Children's reading corner", benchmark: "400 sq.ft." },
  { space: "Co-working open (60 x 35)", benchmark: "2,100 sq.ft." },
  { space: "Co-working booths (6 x 50)", benchmark: "300 sq.ft." },
  { space: "Meeting room (8 seats)", benchmark: "180 sq.ft." },
  { space: "Multipurpose hall + stage", benchmark: "2,660 sq.ft. min", emphasis: true },
  { space: "Café (kitchen + 30 covers)", benchmark: "900 sq.ft." },
  { space: "Reception / lobby", benchmark: "300 sq.ft." },
  { space: "Public toilets (M/F/accessible)", benchmark: "450 sq.ft." },
  { space: "Plant room + services", benchmark: "300 sq.ft." },
  { space: "Storage", benchmark: "200 sq.ft." },
  { space: "Circulation (18 to 22%)", benchmark: "Do not under-programme", emphasis: true },
];

export type ConceptOption = { id: "A" | "B" | "C" | "D"; title: string; tagline: string; description: string; risks: string };
export const CONCEPT_OPTIONS: ConceptOption[] = [
  { id: "A", title: "Nature First", tagline: "Trees as organising element", description: "Three neem trees as organising element. Building wraps them. Green roof + planted terrace above café. Spaces oriented to park views (west).", risks: "Green infrastructure cost + maintenance. Reduced civic DP Road presence." },
  { id: "B", title: "Flexible Community Space", tagline: "Adaptable volumes", description: "Adaptable volumes, moveable partitions. Hall folds into library for large events. No permanently assigned rooms except toilets + plant.", risks: "Acoustic performance of moveable walls. Higher fit out cost. Client uncertainty about ambiguity." },
  { id: "C", title: "Landmark Civic Building", tagline: "Street presence", description: "Double-height entrance on DP Road. Expressed structural frame. Basalt stone + terracotta referencing Pune civic architecture. Strong street presence.", risks: "Risk of imposing aesthetic. Budget pressure. Conflicts with low maintenance requirement." },
  { id: "D", title: "Low Cost Modular", tagline: "Replicable grid", description: "Regular 6x6m grid. Flat-slab construction. Services in central spine. Standard precast façade with colour variation. Designed for replicability.", risks: "Institutional appearance. Limited design expression. May not satisfy civic ambition." },
];

export type DesignCheck = { check: string; issue: string; consequence: string };
export const DESIGN_CHECKS: DesignCheck[] = [
  { check: "Acoustic separation", issue: "Library adjacent to hall or café", consequence: "Noise complaints, library unusable" },
  { check: "Circulation efficiency", issue: "Circulation > 22% GFA", consequence: "Budget overrun, poor experience" },
  { check: "Egress compliance", issue: "Emergency exits missing", consequence: "Building regulation failure" },
  { check: "Structural logic", issue: "Irregular columns unjustified", consequence: "Cost premium + MEP clashes" },
  { check: "Independent access", issue: "Hall, café or plant not separately lockable", consequence: "Operational failure (Nashik precedent)" },
];

export const ANNOTATION_CHECKLIST = [
  "All spaces named and dimensioned",
  "North point and scale bar shown",
  "Structural grid shown",
  "Access routes highlighted: public / staff / service",
  "Entrance faces DP Road (east), client requirement",
  "Max 3 storeys, 15m height confirmed",
  "Three neem trees protected in site plan",
  "Min 20% landscaped area shown",
];

export type CostRow = { element: string; rateRange: string; areaPlaceholder: string };
export const COST_ROWS: CostRow[] = [
  { element: "1. Substructure (raft, black cotton)", rateRange: "INR 1,800 to 2,400 / sq.ft.", areaPlaceholder: "GF footprint" },
  { element: "2. Structural frame + upper floors", rateRange: "INR 2,200 to 2,800 / sq.ft.", areaPlaceholder: "GFA" },
  { element: "3. External envelope (walls, roof, windows)", rateRange: "INR 3,200 to 4,200 / sq.ft.", areaPlaceholder: "External area" },
  { element: "4. Internal walls + partitions", rateRange: "INR 800 to 1,200 / sq.ft.", areaPlaceholder: "Internal wall area" },
  { element: "5. Internal finishes", rateRange: "INR 1,200 to 1,800 / sq.ft.", areaPlaceholder: "GFA" },
  { element: "6. MEP services", rateRange: "INR 2,400 to 3,200 / sq.ft.", areaPlaceholder: "GFA" },
  { element: "7. Fittings, furnishings + equipment", rateRange: "INR 600 to 1,000 / sq.ft.", areaPlaceholder: "Relevant area" },
  { element: "8. External works + landscaping", rateRange: "INR 800 to 1,400 / sq.m.", areaPlaceholder: "External sq.m." },
];

export type SustainabilityRow = { id: string; name: string; upfront: string; impact: string; maintenance: string };
export const SUSTAINABILITY_OPTIONS: SustainabilityRow[] = [
  { id: "pv", name: "Solar PV panels", upfront: "High", impact: "High, 6.2 kWh/sq.m./day", maintenance: "Medium" },
  { id: "rain", name: "Rainwater harvesting", upfront: "Medium", impact: "Medium", maintenance: "Low" },
  { id: "passive", name: "Passive cooling", upfront: "Low", impact: "High, critical for 38 to 42°C summers", maintenance: "Very low" },
  { id: "green", name: "Extensive green roof", upfront: "Medium", impact: "Medium", maintenance: "Low" },
  { id: "local", name: "Local materials", upfront: "Low to Medium", impact: "Medium", maintenance: "Very low" },
  { id: "glaze", name: "High performance glazing", upfront: "Medium to High", impact: "High", maintenance: "Low" },
];

export type MepConflict = {
  id: number;
  title: string;
  report: string;
  options: { id: "a" | "b" | "c"; text: string }[];
  correct: "a" | "b" | "c";
  rationale: string;
};
export const MEP_CONFLICTS: MepConflict[] = [
  {
    id: 1,
    title: "Library Ceiling Height vs AHU Ductwork",
    report: "Floor to floor 3,500mm gives finished ceiling around 3,100mm. Primary AHU ductwork requires 600mm duct zone, dropping finished ceiling to 2,500mm. Recommended minimum for a public reading room: 2,700mm.",
    options: [
      { id: "a", text: "Increase floor to floor to 3,900mm, adds cost and affects floor plate" },
      { id: "b", text: "Use distributed low velocity system, higher cost, avoids duct zone" },
      { id: "c", text: "Displacement ventilation at skirting level, avoids overhead duct zone entirely" },
    ],
    correct: "c",
    rationale: "Displacement ventilation keeps the ceiling clean and protects the reading-room volume without inflating floor to floor.",
  },
  {
    id: 2,
    title: "Electrical DB Location",
    report: "DB shown adjacent to reception desk. Requires 1,000mm clear working zone, but the cupboard is only 900mm deep. Fault alarm would also be disruptive to a public facing reception.",
    options: [
      { id: "a", text: "Keep at reception, accept the 100mm shortfall with a note on the drawing" },
      { id: "b", text: "Relocate to plant room, max 20m cable run from DP Road meter" },
      { id: "c", text: "Install DB under main staircase cupboard" },
    ],
    correct: "b",
    rationale: "Plant room placement satisfies the working-zone code, removes alarm risk from a public area, and stays within cable-run limits.",
  },
  {
    id: 3,
    title: "Solar Inverter Room Not in Programme",
    report: "Solar inverter room (12 sq.m.) is required adjacent to roof access. Not currently in the programme. Must be accessible from roof without occupied space, naturally ventilated, and within 15m of the PV array.",
    options: [
      { id: "a", text: "Add 12 sq.m. at roof level, adjacent to roof access stair, naturally ventilated" },
      { id: "b", text: "Place inverter in ground floor plant room, long cable run to roof array" },
      { id: "c", text: "Delete PV panels from sustainability selection to avoid the issue" },
    ],
    correct: "a",
    rationale: "Locating the inverter at roof level minimises cable losses and meets the ventilation and access requirements without sacrificing PV strategy.",
  },
];

export type RfiQuestion = {
  id: number;
  title: string;
  body: string;
  options: { id: "a" | "b" | "c"; text: string }[];
  correct: "a" | "b" | "c";
  rationale: string;
};
export const RFI_QUESTIONS: RfiQuestion[] = [
  {
    id: 1,
    title: "Q1: Cavity Closer Specification",
    body: "Drawing shows 'proprietary insulated cavity closer' but specification does not name a product or provide a performance spec (U value, compressive strength, fire rating). Different products have different sill projections that affect brick alignment.",
    options: [
      { id: "a", text: "'Proprietary insulated cavity closer, contractor's choice.' Let the site team decide." },
      { id: "b", text: "Issue a performance spec: min 0.15 W/m²K, 100kN/m² compressive, Class A1 fire. Contractor sources compliant product and submits for approval." },
      { id: "c", text: "Remove cavity closer, specify solid insulated blockwork instead." },
    ],
    correct: "b",
    rationale: "A performance spec preserves design intent, keeps thermal/fire targets enforceable, and shifts product selection risk to the contractor.",
  },
  {
    id: 2,
    title: "Q2: DPC Datum",
    body: "Drawing shows 'continuous DPC' but does not indicate height above finished ground level. NBC 2016 requires minimum 150mm above FGL. Site section shows FGL varying by up to 300mm around the perimeter. Which datum governs?",
    options: [
      { id: "a", text: "Use average FGL around perimeter, simpler for bricklayers." },
      { id: "b", text: "Use lowest FGL, conservative and avoids ponding." },
      { id: "c", text: "Use highest FGL, NBC 2016 requires 150mm above FGL at all points, so highest datum ensures compliance everywhere. Issue an updated section drawing." },
    ],
    correct: "c",
    rationale: "Highest FGL is the only datum that satisfies NBC compliance at every point along the perimeter.",
  },
];

export type DefectCard = {
  id: number;
  code: string;
  title: string;
  location: string;
  body: string;
  fieldLabel: string;
  placeholder: string;
};
export const DEFECT_CARDS: DefectCard[] = [
  { id: 1, code: "DR-001", title: "Acoustic Separation, Library vs Café and Hall", location: "Floor Plan · Task 5", body: "Min 2 rooms + STC 50 partition between library quiet zone and café or hall. Nashik used STC 38 and the library was unusable from Day 1.", fieldLabel: "Your finding", placeholder: "Is this resolved in your design? Cite the drawing reference..." },
  { id: 2, code: "DR-002", title: "Thermal: Shading and Passive Cooling Retained", location: "Sustainability Matrix · Task 7", body: "Check passive cooling was not removed in T6 VE. E/W overhangs specified on elevations. Pune hits 38 to 42°C, deep overhangs are not optional.", fieldLabel: "Your finding", placeholder: "Is passive cooling confirmed? Are overhangs drawn on elevations?" },
  { id: 3, code: "DR-003", title: "Accessibility: Ramps, Doors, Parking", location: "Floor Plan · Task 5 + Task 9", body: "Nashik's ramp was 1:10 with three formal complaints. Verify ramp gradient, WC door widths, accessible parking, tactile warnings and low level reception desk.", fieldLabel: "Your finding", placeholder: "Confirm each accessibility check is met on the drawings..." },
  { id: 4, code: "DR-004", title: "Independent Access: Café, Hall, Plant Room", location: "Floor Plan · Task 3 + Task 5", body: "Nashik café operator left after 8 months, they couldn't open at 8am without staffing the whole building. Your brief requires independent café, hall and plant room access.", fieldLabel: "Confirm each has its own lockable access route", placeholder: "Café: direct door to... Hall: separate entrance on... Plant room: service lane..." },
  { id: 5, code: "DR-005", title: "Outdoor Space: Shade, Acoustics, Seating", location: "Site Plan + Landscape Strategy", body: "Nashik outdoor space ran at 15% capacity, no shade, exposed to road noise. Your three neem trees (8m canopy each) are a free shading asset. DP Road is 68 to 72 dB so an acoustic buffer is needed.", fieldLabel: "Shade strategy + acoustic buffer", placeholder: "e.g. Plaza placed west near neem trees. 1.2m planter wall buffers DP Road noise..." },
  { id: 6, code: "DR-006", title: "Wayfinding: Entrance Visible from DP Road", location: "Site Plan + East Elevation", body: "71% of Nashik visitors couldn't find the entrance. Your brief requires entrance to face DP Road (east). Verify on east elevation and confirm reception is visible upon entry.", fieldLabel: "Confirm entrance east facing, visible, reception in sightline", placeholder: "e.g. Entrance on east elevation, canopy marks it, glazed lobby allows reception sightline..." },
];

export type CrisisScenario = { id: "A" | "B" | "C" | "D"; title: string; body: string };
export const CRISIS_SCENARIOS: CrisisScenario[] = [
  { id: "A", title: "Scenario A: Budget Cut (14.8%)", body: "Tender received from Subramanian Construction exceeds budget by INR 1.2 crore (14.8%). PMC cannot increase the budget. Prepare a value engineering schedule that reduces the contract sum by INR 1.2 crore without reducing building area or removing any programme element." },
  { id: "B", title: "Scenario B: Setback Change", body: "PMC planning has revised its interpretation: front setback is now 9m (previously 6m). This reduces buildable area by around 200 sq.m. Propose a redesign strategy that complies while retaining the full programme. Going to 4 storeys is permitted but must be justified against the 15m height limit." },
  { id: "C", title: "Scenario C: Community Objection", body: "A 340 signature petition objects to loss of informal green space at the western boundary. Planning committee requests a revised landscape proposal that demonstrably retains or improves green space. Prepare the design amendment and a written response for the planning committee." },
  { id: "D", title: "Scenario D: Accessibility Failures at Inspection", body: "Pre handover inspection identifies 4 non compliances: accessible WC door 780mm wide (NBC requires 900mm); no tactile warning at ramp top; accessible parking 2,200mm wide (requires 2,500mm); no low level reception desk. Prepare a remediation schedule addressing all four items." },
];

export const POE_FINDINGS: { finding: string; root: string; check: string }[] = [
  { finding: "Overheating: 34°C+ on 18 days; HVAC at 155% load", root: "Passive cooling VE'd out; W façade unshaded", check: "Passive cooling retained in T7? E/W overhangs specified?" },
  { finding: "Library: 44 noise complaints yr 1; STC 38 (needed 50)", root: "Library within 2 rooms of café; partition spec unchecked", check: "2+ rooms between library and café on T5 plan?" },
  { finding: "Ramp: 1:10 gradient; NBC requires 1:12", root: "Ramp redesigned late; NBC not checked pre submission", check: "Verify all ramp gradients + WC door widths (900mm min)" },
  { finding: "Wayfinding: 71% visitors couldn't find entrance", root: "Entrance not visible from street", check: "Entrance faces DP Road (east) + reception visible from door?" },
  { finding: "Outdoor space: 15% utilisation; no shade, noise exposed", root: "Outdoor space ticked a box; no solar or acoustic design", check: "Shaded by neem trees? Acoustic buffer from DP Road?" },
  { finding: "Energy: 27% over prediction", root: "PV + shading VE'd out pre tender", check: "Cross check T7 selections vs T6, any removed?" },
  { finding: "Café operator left after 8 months; independent access impossible", root: "Independent café access not designed", check: "Independent café access from street on T5 plan?" },
];