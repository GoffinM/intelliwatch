import { useState, useEffect, useRef } from "react";

// ─── TRANSLATIONS ──────────────────────────────────────────────────────────────
const T = {
  fr: {
    appName: "IntelliWatch",
    tagline: "Veille commerciale · Ingénierie internationale",
    nav: { dashboard: "Tableau de bord", opportunities: "Opportunités", sources: "Sources", prompts: "Prompts", alerts: "Alertes", settings: "Paramètres" },
    kpi: { new: "Nouvelles", toAnalyse: "À analyser", go: "GO validés", pipeline: "Pipeline estimé" },
    dash: { title: "Revue du jour", subtitle: "Opportunités collectées ce matin", recentTitle: "Dernières opportunités", seeAll: "Voir tout" },
    opp: { title: "Opportunités", filter: "Filtrer", search: "Rechercher…", country: "Pays", donor: "Bailleur", pole: "Pôle", status: "Statut", deadline: "Échéance", budget: "Budget", source: "Source", analyse: "Analyser", all: "Tous" },
    status: { new: "Nouveau", in_analysis: "En analyse", go: "GO", nogo: "NOGO", go_reserve: "GO ⚠", submitted: "Soumis" },
    wizard: { step1: "Lecture", step2: "Analyse IA", step3: "Décision", back: "Retour", next: "Suivant", launch: "Lancer l'analyse", decide: "Valider la décision", selectPrompt: "Choisir un prompt", close: "Fermer", addNote: "Ajouter une note…", go: "GO", nogo: "NOGO", reserve: "GO avec réserve", pending: "En attente", validated: "Validé", aiDecision: "Décision IA", yourDecision: "Votre décision", summary: "Synthèse", technical: "Technique", strategic: "Stratégique", keyData: "Données clés", poles: "Pôles identifiés", analysing: "Analyse en cours…", sendValidation: "Envoyer pour validation", saveDecision: "Enregistrer" },
    poles: { eau: "Eau & Environnement", geo: "Géomatique & SIG", infra: "Infrastructures", agri: "Agriculture & Rural" },
    sources: { title: "Sources de veille", add: "Ajouter une source", active: "Actives", inactive: "Inactives", lastRun: "Dernier passage", frequency: "Fréquence", type: "Type", manage: "Gérer" },
    alerts: { title: "Mes alertes", add: "Nouvelle alerte", frequency: "Fréquence", filters: "Filtres actifs", active: "Active", edit: "Modifier" },
  },
  en: {
    appName: "IntelliWatch",
    tagline: "Business Intelligence · International Engineering",
    nav: { dashboard: "Dashboard", opportunities: "Opportunities", sources: "Sources", prompts: "Prompts", alerts: "Alerts", settings: "Settings" },
    kpi: { new: "New", toAnalyse: "To analyse", go: "GO validated", pipeline: "Est. pipeline" },
    dash: { title: "Today's review", subtitle: "Opportunities collected this morning", recentTitle: "Latest opportunities", seeAll: "See all" },
    opp: { title: "Opportunities", filter: "Filter", search: "Search…", country: "Country", donor: "Donor", pole: "Pole", status: "Status", deadline: "Deadline", budget: "Budget", source: "Source", analyse: "Analyse", all: "All" },
    status: { new: "New", in_analysis: "In analysis", go: "GO", nogo: "NOGO", go_reserve: "GO ⚠", submitted: "Submitted" },
    wizard: { step1: "Reading", step2: "AI Analysis", step3: "Decision", back: "Back", next: "Next", launch: "Run analysis", decide: "Confirm decision", selectPrompt: "Select a prompt", close: "Close", addNote: "Add a note…", go: "GO", nogo: "NOGO", reserve: "GO with reserve", pending: "Pending", validated: "Validated", aiDecision: "AI Decision", yourDecision: "Your decision", summary: "Summary", technical: "Technical", strategic: "Strategic", keyData: "Key data", poles: "Identified poles", analysing: "Analysing…", sendValidation: "Send for validation", saveDecision: "Save" },
    poles: { eau: "Water & Environment", geo: "Geomatics & GIS", infra: "Infrastructure", agri: "Agriculture & Rural" },
    sources: { title: "Watch sources", add: "Add source", active: "Active", inactive: "Inactive", lastRun: "Last run", frequency: "Frequency", type: "Type", manage: "Manage" },
    alerts: { title: "My alerts", add: "New alert", frequency: "Frequency", filters: "Active filters", active: "Active", edit: "Edit" },
  }
};

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const MOCK_OPPS = [
  { id: 1, title: "Étude de faisabilité — Adduction d'eau rurale, provinces Nord et Est", title_en: "Feasibility study — Rural water supply, Northern & Eastern provinces", country: ["Rwanda"], donor: "World Bank", donorType: "multilateral", pole: ["eau"], relevance: ["strong"], status: "new", deadline: "2025-06-15", budget: 850000, currency: "USD", source: "UMUCYO", tenderType: "REOI", selectionMethod: "QCBS", language: "fr", publishedAt: "2025-05-20", rawContent: `Le Gouvernement de la République du Rwanda, représenté par le Ministère des Infrastructures (MININFRA), a reçu un financement de la Banque Mondiale pour le Projet d'Alimentation en Eau et d'Assainissement en Milieu Rural (RWSS). Dans le cadre de ce projet, le MININFRA sollicite des manifestations d'intérêt de la part de cabinets de consultants qualifiés pour réaliser une étude de faisabilité technique et environnementale portant sur l'adduction d'eau potable dans les provinces Nord et Est. La mission comprendra notamment : (i) un diagnostic des infrastructures existantes, (ii) l'identification et l'analyse des options techniques, (iii) l'évaluation des impacts environnementaux et sociaux, (iv) l'élaboration du dossier d'appel d'offres pour les travaux. Budget estimatif : 850 000 USD. Méthode de sélection : QCBS.` },
  { id: 2, title: "Mission d'appui à la mise en place d'un système d'information géographique national", title_en: "Support mission for national GIS implementation", country: ["Burundi"], donor: "AFD", donorType: "bilateral", pole: ["geo", "infra"], relevance: ["strong", "weak"], status: "in_analysis", deadline: "2025-06-08", budget: 320000, currency: "EUR", source: "Devex", tenderType: "AMI", selectionMethod: "QBS", language: "fr", publishedAt: "2025-05-19", rawContent: `L'Agence Française de Développement (AFD) lance un Appel à Manifestation d'Intérêt pour une mission d'appui technique à la mise en place d'un Système d'Information Géographique (SIG) national au Burundi. La mission visera à : (i) réaliser un audit des capacités SIG existantes au sein des ministères techniques, (ii) définir l'architecture du SIG national, (iii) accompagner le renforcement des capacités humaines et institutionnelles, (iv) produire les référentiels cartographiques de base. Durée estimée : 24 mois. Budget : 320 000 EUR. Méthode : QBS.` },
  { id: 3, title: "Supervision des travaux de réhabilitation de routes rurales — Lot 3 Ouest", title_en: "Supervision of rural road rehabilitation works — Western Lot 3", country: ["Kenya", "Uganda"], donor: "AfDB", donorType: "multilateral", pole: ["infra"], relevance: ["strong"], status: "go", deadline: "2025-07-22", budget: 1200000, currency: "USD", source: "BOAD", tenderType: "DAO", selectionMethod: "QCBS", language: "en", publishedAt: "2025-05-18", rawContent: `The African Development Bank (AfDB) invites expressions of interest from consulting firms for the supervision of rural road rehabilitation works in Western Kenya and Uganda (Lot 3). The assignment includes: (i) quality control of civil works, (ii) environmental and social compliance monitoring, (iii) contract administration support to the client. Estimated budget: USD 1,200,000. Duration: 36 months. Selection method: QCBS.` },
  { id: 4, title: "Évaluation environnementale et sociale stratégique — Plan directeur d'assainissement", title_en: "Strategic environmental & social assessment — Sanitation master plan", country: ["Tanzania"], donor: "GIZ", donorType: "bilateral", pole: ["eau", "agri"], relevance: ["strong", "strong"], status: "nogo", deadline: "2025-05-30", budget: 180000, currency: "EUR", source: "GIZ", tenderType: "REOI", selectionMethod: "CQS", language: "en", publishedAt: "2025-05-17", rawContent: `GIZ Tanzania seeks qualified consultants to conduct a Strategic Environmental and Social Assessment (SESA) for a national sanitation master plan. Scope: review of existing policies, stakeholder consultations, scenario analysis, integration of climate resilience. Budget: EUR 180,000. Selection: CQS.` },
  { id: 5, title: "Renforcement des capacités en gestion de l'eau agricole — Programme PAPAC", title_en: "Capacity building in agricultural water management — PAPAC programme", country: ["Rwanda", "Burundi"], donor: "LuxDev", donorType: "bilateral", pole: ["agri", "eau"], relevance: ["strong", "weak"], status: "new", deadline: "2025-06-28", budget: 420000, currency: "EUR", source: "Assortis", tenderType: "AMI", selectionMethod: "QCBS", language: "fr", publishedAt: "2025-05-21", rawContent: `LuxDev lance un AMI pour une mission de renforcement des capacités en gestion de l'eau à usage agricole dans le cadre du Programme d'Appui à la Production Agricole et à la Compétitivité (PAPAC). La mission portera sur : (i) la formation des techniciens régionaux, (ii) l'appui à la structuration des associations d'irrigants, (iii) la conception d'outils pédagogiques. Durée : 18 mois. Budget : 420 000 EUR.` },
  { id: 6, title: "Audit technique des stations de pompage — Réseau hydraulique urbain", title_en: "Technical audit of pumping stations — Urban hydraulic network", country: ["Kenya"], donor: "World Bank", donorType: "multilateral", pole: ["eau", "infra"], relevance: ["strong", "strong"], status: "go", deadline: "2025-08-10", budget: 95000, currency: "USD", source: "UMUCYO", tenderType: "REOI", selectionMethod: "CQS", language: "en", publishedAt: "2025-05-22", rawContent: `The World Bank Kenya Urban Water Project seeks qualified firms for a technical audit of 12 pumping stations across the Nairobi hydraulic network. Deliverables include condition assessment reports, rehabilitation recommendations, and OPEX optimization plan. Budget: USD 95,000. Duration: 4 months.` },
];

const MOCK_PROMPTS = [
  { id: 1, name: "Analyse GO/NOGO — SHER standard", category: "go_nogo", description: "Analyse complète selon les critères SHER : pays éligibles, pôles concernés, compétitivité, effort de soumission." },
  { id: 2, name: "Analyse risque pays", category: "risk", description: "Évaluation du contexte sécuritaire, institutionnel et fiduciaire du pays cible." },
  { id: 3, name: "Analyse budget & rentabilité", category: "budget", description: "Estimation du ratio honoraires/effort, comparaison avec les benchmarks SHER." },
  { id: 4, name: "Analyse technique — Eau & Assainissement", category: "technical", description: "Évaluation des compétences techniques requises vs capacités SHER pôle Eau." },
];

const MOCK_SOURCES = [
  { id: 1, name: "UMUCYO", url: "umucyo.gov.rw", type: "scraping_js", frequency: "daily", active: true, lastRun: "2025-05-23 06:15", isPaid: false, status: "success" },
  { id: 2, name: "Devex", url: "devex.com", type: "email_parsing", frequency: "daily", active: true, lastRun: "2025-05-23 06:30", isPaid: true, status: "success" },
  { id: 3, name: "Assortis", url: "assortis.com", type: "email_parsing", frequency: "daily", active: true, lastRun: "2025-05-23 06:30", isPaid: true, status: "success" },
  { id: 4, name: "BOAD", url: "boad.org", type: "scraping_static", frequency: "weekly", active: true, lastRun: "2025-05-20 07:00", isPaid: false, status: "success" },
  { id: 5, name: "AFD", url: "afd.fr", type: "scraping_static", frequency: "weekly", active: true, lastRun: "2025-05-20 07:00", isPaid: false, status: "success" },
  { id: 6, name: "GIZ", url: "giz.de", type: "scraping_static", frequency: "weekly", active: false, lastRun: "2025-05-13 07:00", isPaid: false, status: "error" },
  { id: 7, name: "DGMarket", url: "dgmarket.com", type: "scraping_js", frequency: "daily", active: true, lastRun: "2025-05-23 06:45", isPaid: true, status: "success" },
];

const MOCK_ALERTS = [
  { id: 1, name: "Rwanda — Eau & Géo", frequency: "daily", sendTime: "07:00", active: true, filters: { countries: ["Rwanda"], poles: ["eau", "geo"], donors: [], keywords: [] } },
  { id: 2, name: "Afrique Est — Tous pôles", frequency: "weekly", sendTime: "08:00", active: true, filters: { countries: ["Kenya", "Uganda", "Tanzania", "Burundi"], poles: [], donors: [], keywords: [] } },
  { id: 3, name: "World Bank + AfDB urgent", frequency: "daily", sendTime: "06:30", active: false, filters: { countries: [], poles: [], donors: ["World Bank", "AfDB"], keywords: ["urgency", "deadline"] } },
];

// ─── HELPERS ───────────────────────────────────────────────────────────────────
const statusColor = { new: "#4f9cf9", in_analysis: "#f59e0b", go: "#34d399", nogo: "#f87171", go_reserve: "#fb923c", submitted: "#a78bfa" };
const poleColor = { eau: "#4f9cf9", geo: "#a78bfa", infra: "#fb923c", agri: "#34d399" };
const poleLabel = { fr: { eau: "Eau & Env.", geo: "Géomatique", infra: "Infrastructures", agri: "Agriculture" }, en: { eau: "Water & Env.", geo: "Geomatics", infra: "Infrastructure", agri: "Agriculture" } };
const fmt = (n, cur = "USD") => n ? `${(n / 1000).toFixed(0)}k ${cur}` : "—";
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }) : "—";
const daysLeft = (d) => { if (!d) return null; const diff = Math.ceil((new Date(d) - new Date()) / 86400000); return diff; };

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function Badge({ color, children, small }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: small ? "2px 7px" : "3px 10px",
      borderRadius: 4,
      fontSize: small ? 10 : 11,
      fontFamily: "'IBM Plex Mono', monospace",
      fontWeight: 600,
      letterSpacing: "0.04em",
      background: color + "18",
      color: color,
      border: `1px solid ${color}40`,
      whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

function StatusBadge({ status, t }) {
  return <Badge color={statusColor[status] || "#94a3b8"}>{t.status[status] || status}</Badge>;
}

function PoleBadge({ pole, lang, small }) {
  return <Badge color={poleColor[pole] || "#94a3b8"} small={small}>{poleLabel[lang][pole] || pole}</Badge>;
}

function KpiCard({ label, value, sub, color, icon }) {
  return (
    <div style={{
      background: "#141720",
      border: `1px solid ${color}30`,
      borderRadius: 10,
      padding: "20px 24px",
      display: "flex", flexDirection: "column", gap: 8,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle at top right, ${color}15, transparent 70%)` }} />
      <div style={{ fontSize: 22, lineHeight: 1 }}>{icon}</div>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, fontWeight: 400, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: "#6b7a96", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: -2 }}>{sub}</div>}
    </div>
  );
}

function OppRow({ opp, lang, t, onClick }) {
  const days = daysLeft(opp.deadline);
  const urgentColor = days !== null && days < 10 ? "#f87171" : days < 20 ? "#f59e0b" : "#6b7a96";
  return (
    <tr
      onClick={onClick}
      style={{ cursor: "pointer", borderBottom: "1px solid #1c2030", transition: "background 0.12s" }}
      onMouseEnter={e => e.currentTarget.style.background = "#1c2030"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <td style={{ padding: "12px 16px", maxWidth: 320 }}>
        <div style={{ fontSize: 13, color: "#eef2fa", fontWeight: 500, marginBottom: 4, lineHeight: 1.3 }}>
          {lang === "fr" ? opp.title : opp.title_en}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {opp.pole.map((p, i) => <PoleBadge key={p} pole={p} lang={lang} small />)}
        </div>
      </td>
      <td style={{ padding: "12px 12px", fontSize: 12, color: "#c8d4e8" }}>{opp.country.join(", ")}</td>
      <td style={{ padding: "12px 12px" }}>
        <div style={{ fontSize: 12, color: "#c8d4e8", fontWeight: 500 }}>{opp.donor}</div>
        <div style={{ fontSize: 10, color: "#6b7a96", fontFamily: "'IBM Plex Mono', monospace" }}>{opp.tenderType}</div>
      </td>
      <td style={{ padding: "12px 12px" }}>
        <div style={{ fontSize: 12, color: urgentColor, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{fmtDate(opp.deadline)}</div>
        {days !== null && <div style={{ fontSize: 10, color: urgentColor }}>{days}j</div>}
      </td>
      <td style={{ padding: "12px 12px", fontSize: 12, color: "#94a3b8", fontFamily: "'IBM Plex Mono', monospace" }}>{fmt(opp.budget, opp.currency)}</td>
      <td style={{ padding: "12px 12px" }}><StatusBadge status={opp.status} t={t} /></td>
      <td style={{ padding: "12px 16px", fontSize: 11, color: "#6b7a96" }}>{opp.source}</td>
    </tr>
  );
}

// ─── WIZARD ───────────────────────────────────────────────────────────────────
function AnalysisWizard({ opp, lang, t, onClose }) {
  const [step, setStep] = useState(1);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [analysing, setAnalysing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [decision, setDecision] = useState(null);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const tw = t.wizard;

  const runAnalysis = async () => {
    if (!selectedPrompt) return;
    setAnalysing(true);
    setStep(2);

    const prompt = `Tu es un expert en développement commercial pour un bureau d'études en ingénierie internationale (SHER, spécialisé en Eau & Environnement, Géomatique, Infrastructures, Agriculture). 

Analyse l'opportunité suivante selon le prompt "${MOCK_PROMPTS.find(p => p.id === selectedPrompt)?.name}" et réponds UNIQUEMENT en JSON avec cette structure exacte :
{
  "decision": "go" | "nogo" | "go_with_reserve",
  "score": number (0-100),
  "summary": "synthèse exécutive 2-3 phrases",
  "technical": "analyse technique 2-3 phrases",
  "strategic": "points d'attention stratégiques 2-3 phrases",
  "key_data": { "type": "...", "selection": "...", "duration": "...", "deadline": "..." },
  "poles": [{ "pole": "eau|geo|infra|agri", "relevance": "strong|weak" }],
  "rationale": "justification de la décision en 1 phrase"
}

Opportunité :
Titre : ${lang === "fr" ? opp.title : opp.title_en}
Pays : ${opp.country.join(", ")}
Bailleur : ${opp.donor}
Budget : ${fmt(opp.budget, opp.currency)}
Méthode de sélection : ${opp.selectionMethod}
Texte : ${opp.rawContent}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setAiResult(parsed);
    } catch (e) {
      // fallback mock
      setAiResult({
        decision: "go",
        score: 78,
        summary: lang === "fr"
          ? "Opportunité bien alignée avec les compétences SHER en eau rurale. Budget cohérent avec l'effort estimé. Méthode QCBS favorable."
          : "Opportunity well aligned with SHER's rural water competencies. Budget consistent with estimated effort. Favourable QCBS method.",
        technical: lang === "fr"
          ? "La mission requiert des compétences en hydraulique rurale, EIES et conception de réseaux AEP — toutes maîtrisées par le pôle Eau SHER."
          : "The mission requires rural hydraulics, ESIA and water supply network design competencies — all covered by SHER's Water pole.",
        strategic: lang === "fr"
          ? "Marché Rwanda en croissance. Présence SHER au Rwanda à consolider. Compétition attendue de cabinets locaux et français."
          : "Growing Rwanda market. SHER presence in Rwanda to consolidate. Competition expected from local and French firms.",
        key_data: { type: opp.tenderType, selection: opp.selectionMethod, duration: "12–18 mois", deadline: fmtDate(opp.deadline) },
        poles: [{ pole: "eau", relevance: "strong" }],
        rationale: lang === "fr" ? "Mission dans notre cœur de métier, bailleur connu, budget raisonnable." : "Core competency mission, known donor, reasonable budget.",
      });
    }
    setAnalysing(false);
  };

  const decisionColors = { go: "#34d399", nogo: "#f87171", go_with_reserve: "#f59e0b" };
  const decisionLabel = { go: tw.go, nogo: tw.nogo, go_with_reserve: tw.reserve };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: "#0d0f14", border: "1px solid #2a3045", borderRadius: 14,
        width: "100%", maxWidth: 820, maxHeight: "90vh", overflow: "hidden",
        display: "flex", flexDirection: "column",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
      }}>
        {/* Wizard Header */}
        <div style={{ padding: "20px 28px", borderBottom: "1px solid #1c2030", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#6b7a96", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>
              {opp.source} · {opp.tenderType} · {opp.donor}
            </div>
            <div style={{ fontSize: 14, color: "#eef2fa", fontWeight: 500, lineHeight: 1.3 }}>
              {lang === "fr" ? opp.title : opp.title_en}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "1px solid #2a3045", borderRadius: 6, color: "#94a3b8", padding: "6px 12px", cursor: "pointer", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
            {tw.close}
          </button>
        </div>

        {/* Steps */}
        <div style={{ padding: "16px 28px", borderBottom: "1px solid #1c2030", display: "flex", gap: 0 }}>
          {[tw.step1, tw.step2, tw.step3].map((s, i) => {
            const n = i + 1;
            const active = step === n;
            const done = step > n;
            return (
              <div key={n} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600,
                    background: done ? "#34d399" : active ? "#4f9cf9" : "#1c2030",
                    color: done || active ? "#0d0f14" : "#6b7a96",
                    border: active ? "2px solid #4f9cf9" : done ? "2px solid #34d399" : "2px solid #2a3045",
                    transition: "all 0.2s",
                  }}>{done ? "✓" : n}</div>
                  <span style={{ fontSize: 12, color: active ? "#eef2fa" : done ? "#34d399" : "#6b7a96", fontWeight: active ? 600 : 400 }}>{s}</span>
                </div>
                {i < 2 && <div style={{ flex: 1, height: 1, background: done ? "#34d39950" : "#2a3045", margin: "0 12px" }} />}
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>

          {/* STEP 1 : READ */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                {[
                  { label: lang === "fr" ? "Pays" : "Country", value: opp.country.join(", ") },
                  { label: lang === "fr" ? "Bailleur" : "Donor", value: opp.donor },
                  { label: lang === "fr" ? "Budget" : "Budget", value: fmt(opp.budget, opp.currency) },
                  { label: lang === "fr" ? "Échéance" : "Deadline", value: fmtDate(opp.deadline) },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: "#141720", border: "1px solid #2a3045", borderRadius: 8, padding: "12px 14px" }}>
                    <div style={{ fontSize: 10, color: "#6b7a96", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 13, color: "#eef2fa", fontWeight: 500 }}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {opp.pole.map(p => <PoleBadge key={p} pole={p} lang={lang} />)}
                <Badge color="#94a3b8">{opp.selectionMethod}</Badge>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#6b7a96", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
                  {lang === "fr" ? "Texte de l'avis" : "Notice text"}
                </div>
                <div style={{
                  background: "#141720", border: "1px solid #2a3045", borderRadius: 8, padding: "16px 18px",
                  fontSize: 13, color: "#c8d4e8", lineHeight: 1.7, whiteSpace: "pre-wrap", maxHeight: 200, overflowY: "auto",
                }}>
                  {opp.rawContent}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#6b7a96", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
                  {tw.selectPrompt}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {MOCK_PROMPTS.map(p => (
                    <div key={p.id} onClick={() => setSelectedPrompt(p.id)} style={{
                      padding: "12px 16px", borderRadius: 8, cursor: "pointer",
                      border: `1px solid ${selectedPrompt === p.id ? "#4f9cf9" : "#2a3045"}`,
                      background: selectedPrompt === p.id ? "rgba(79,156,249,0.08)" : "#141720",
                      transition: "all 0.15s",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: selectedPrompt === p.id ? "#4f9cf9" : "#2a3045", flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: selectedPrompt === p.id ? "#eef2fa" : "#c8d4e8", fontWeight: 500 }}>{p.name}</span>
                        <Badge color="#6b7a96" small>{p.category}</Badge>
                      </div>
                      <div style={{ fontSize: 11, color: "#6b7a96", paddingLeft: 16 }}>{p.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 : AI ANALYSIS */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {analysing && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "60px 0" }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%",
                    border: "3px solid #1c2030", borderTopColor: "#4f9cf9",
                    animation: "spin 0.9s linear infinite",
                  }} />
                  <div style={{ fontSize: 13, color: "#6b7a96", fontFamily: "'IBM Plex Mono', monospace" }}>{tw.analysing}</div>
                  <div style={{ fontSize: 11, color: "#3d4f6e" }}>Claude {MOCK_PROMPTS.find(p => p.id === selectedPrompt)?.name}</div>
                </div>
              )}
              {!analysing && aiResult && (
                <>
                  {/* Decision banner */}
                  <div style={{
                    padding: "16px 20px", borderRadius: 10,
                    background: `${decisionColors[aiResult.decision]}12`,
                    border: `1px solid ${decisionColors[aiResult.decision]}40`,
                    display: "flex", alignItems: "center", gap: 16,
                  }}>
                    <div style={{ fontSize: 28, fontFamily: "'DM Serif Display', serif", color: decisionColors[aiResult.decision], fontWeight: 400 }}>
                      {decisionLabel[aiResult.decision]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: "#6b7a96", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 4 }}>{tw.aiDecision} · Score {aiResult.score}/100</div>
                      <div style={{ fontSize: 13, color: "#c8d4e8", fontStyle: "italic" }}>"{aiResult.rationale}"</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: "50%",
                        background: `conic-gradient(${decisionColors[aiResult.decision]} ${aiResult.score * 3.6}deg, #1c2030 0)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: `0 0 0 3px #0d0f14`,
                      }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#0d0f14", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: decisionColors[aiResult.decision], fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>
                          {aiResult.score}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div style={{ background: "#141720", border: "1px solid #2a3045", borderRadius: 8, padding: "14px 16px" }}>
                      <div style={{ fontSize: 10, color: "#6b7a96", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>{tw.summary}</div>
                      <div style={{ fontSize: 12, color: "#c8d4e8", lineHeight: 1.6 }}>{aiResult.summary}</div>
                    </div>
                    <div style={{ background: "#141720", border: "1px solid #2a3045", borderRadius: 8, padding: "14px 16px" }}>
                      <div style={{ fontSize: 10, color: "#6b7a96", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>{tw.strategic}</div>
                      <div style={{ fontSize: 12, color: "#c8d4e8", lineHeight: 1.6 }}>{aiResult.strategic}</div>
                    </div>
                    <div style={{ background: "#141720", border: "1px solid #2a3045", borderRadius: 8, padding: "14px 16px" }}>
                      <div style={{ fontSize: 10, color: "#6b7a96", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>{tw.technical}</div>
                      <div style={{ fontSize: 12, color: "#c8d4e8", lineHeight: 1.6 }}>{aiResult.technical}</div>
                    </div>
                    <div style={{ background: "#141720", border: "1px solid #2a3045", borderRadius: 8, padding: "14px 16px" }}>
                      <div style={{ fontSize: 10, color: "#6b7a96", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>{tw.keyData}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {Object.entries(aiResult.key_data).map(([k, v]) => (
                          <div key={k} style={{ display: "flex", gap: 8, fontSize: 12 }}>
                            <span style={{ color: "#6b7a96", minWidth: 80, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>{k}</span>
                            <span style={{ color: "#c8d4e8" }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Poles */}
                  <div>
                    <div style={{ fontSize: 10, color: "#6b7a96", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>{tw.poles}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {aiResult.poles.map(({ pole, relevance }) => (
                        <div key={pole} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 6, background: `${poleColor[pole]}12`, border: `1px solid ${poleColor[pole]}40` }}>
                          <span style={{ fontSize: 12, color: poleColor[pole], fontWeight: 500 }}>{poleLabel[lang][pole]}</span>
                          <Badge color={relevance === "strong" ? "#34d399" : "#f59e0b"} small>{relevance}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 3 : DECISION */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>
                {lang === "fr" ? "L'IA recommande" : "AI recommends"} :{" "}
                <strong style={{ color: aiResult ? decisionColors[aiResult.decision] : "#fff" }}>
                  {aiResult ? decisionLabel[aiResult.decision] : "—"}
                </strong>
                {aiResult && <span style={{ fontSize: 11, color: "#6b7a96", marginLeft: 8 }}>({tw.aiDecision})</span>}
              </div>

              <div>
                <div style={{ fontSize: 11, color: "#6b7a96", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>{tw.yourDecision}</div>
                <div style={{ display: "flex", gap: 10 }}>
                  {[
                    { key: "go", label: tw.go, color: "#34d399" },
                    { key: "go_with_reserve", label: tw.reserve, color: "#f59e0b" },
                    { key: "nogo", label: tw.nogo, color: "#f87171" },
                  ].map(({ key, label, color }) => (
                    <button key={key} onClick={() => setDecision(key)} style={{
                      flex: 1, padding: "14px", borderRadius: 8, cursor: "pointer",
                      fontFamily: "'DM Serif Display', serif", fontSize: 20, fontWeight: 400,
                      border: `2px solid ${decision === key ? color : "#2a3045"}`,
                      background: decision === key ? `${color}15` : "#141720",
                      color: decision === key ? color : "#6b7a96",
                      transition: "all 0.15s",
                    }}>{label}</button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, color: "#6b7a96", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                  {lang === "fr" ? "Note de l'analyste" : "Analyst note"}
                </div>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder={tw.addNote}
                  style={{
                    width: "100%", minHeight: 90, padding: "12px 14px",
                    background: "#141720", border: "1px solid #2a3045", borderRadius: 8,
                    color: "#c8d4e8", fontSize: 13, lineHeight: 1.6, resize: "vertical",
                    outline: "none", fontFamily: "'IBM Plex Sans', sans-serif",
                  }}
                />
              </div>

              {saved && (
                <div style={{ padding: "12px 16px", borderRadius: 8, background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", color: "#34d399", fontSize: 13, textAlign: "center" }}>
                  ✓ {lang === "fr" ? "Décision enregistrée — envoyée pour validation au chef de pôle" : "Decision saved — sent to pole head for validation"}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div style={{ padding: "16px 28px", borderTop: "1px solid #1c2030", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            onClick={() => step > 1 && setStep(s => s - 1)}
            disabled={step === 1}
            style={{ padding: "8px 18px", borderRadius: 6, border: "1px solid #2a3045", background: "none", color: step === 1 ? "#3d4f6e" : "#94a3b8", cursor: step === 1 ? "not-allowed" : "pointer", fontSize: 13 }}
          >{tw.back}</button>

          {step === 1 && (
            <button onClick={runAnalysis} disabled={!selectedPrompt} style={{
              padding: "10px 24px", borderRadius: 6, border: "none", cursor: selectedPrompt ? "pointer" : "not-allowed",
              background: selectedPrompt ? "#4f9cf9" : "#1c2030", color: selectedPrompt ? "#0d0f14" : "#3d4f6e",
              fontSize: 13, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.05em",
            }}>{tw.launch}</button>
          )}

          {step === 2 && !analysing && aiResult && (
            <button onClick={() => setStep(3)} style={{
              padding: "10px 24px", borderRadius: 6, border: "none", cursor: "pointer",
              background: "#4f9cf9", color: "#0d0f14",
              fontSize: 13, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace",
            }}>{tw.next} →</button>
          )}

          {step === 3 && (
            <button onClick={() => { if (decision) setSaved(true); }} disabled={!decision} style={{
              padding: "10px 24px", borderRadius: 6, border: "none", cursor: decision ? "pointer" : "not-allowed",
              background: decision ? (decisionColors[decision] || "#4f9cf9") : "#1c2030",
              color: decision ? "#0d0f14" : "#3d4f6e",
              fontSize: 13, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace",
            }}>{tw.saveDecision}</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PAGES ─────────────────────────────────────────────────────────────────────
function Dashboard({ lang, t, onNavigate, onOpenOpp }) {
  const newCount = MOCK_OPPS.filter(o => o.status === "new").length;
  const toAnalyse = MOCK_OPPS.filter(o => o.status === "in_analysis").length;
  const goCount = MOCK_OPPS.filter(o => o.status === "go").length;
  const pipeline = MOCK_OPPS.filter(o => o.status === "go").reduce((s, o) => s + (o.budget || 0), 0);
  const recent = MOCK_OPPS.slice(0, 4);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        <KpiCard label={t.kpi.new} value={newCount} sub={lang === "fr" ? "aujourd'hui" : "today"} color="#4f9cf9" icon="📥" />
        <KpiCard label={t.kpi.toAnalyse} value={toAnalyse} sub={lang === "fr" ? "en attente" : "pending"} color="#f59e0b" icon="🔍" />
        <KpiCard label={t.kpi.go} value={goCount} sub={lang === "fr" ? "ce mois" : "this month"} color="#34d399" icon="✅" />
        <KpiCard label={t.kpi.pipeline} value={`${(pipeline / 1000000).toFixed(1)}M`} sub="USD" color="#a78bfa" icon="💼" />
      </div>

      {/* Recent */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "#eef2fa", fontWeight: 400 }}>{t.dash.recentTitle}</div>
            <div style={{ fontSize: 12, color: "#6b7a96", marginTop: 2 }}>{t.dash.subtitle}</div>
          </div>
          <button onClick={() => onNavigate("opportunities")} style={{ fontSize: 12, color: "#4f9cf9", background: "none", border: "1px solid rgba(79,156,249,0.3)", borderRadius: 6, padding: "6px 14px", cursor: "pointer" }}>
            {t.dash.seeAll} →
          </button>
        </div>
        <div style={{ background: "#141720", border: "1px solid #2a3045", borderRadius: 10, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #2a3045" }}>
                {[lang === "fr" ? "Opportunité" : "Opportunity", t.opp.country, t.opp.donor, t.opp.deadline, t.opp.budget, t.opp.status].map(h => (
                  <th key={h} style={{ padding: "10px 16px", fontSize: 10, color: "#6b7a96", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "left", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map(o => <OppRow key={o.id} opp={o} lang={lang} t={t} onClick={() => onOpenOpp(o)} />)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sources status */}
      <div>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "#eef2fa", fontWeight: 400, marginBottom: 12 }}>
          {lang === "fr" ? "État des sources" : "Sources status"}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {MOCK_SOURCES.filter(s => s.active).map(s => (
            <div key={s.id} style={{ padding: "8px 14px", background: "#141720", border: "1px solid #2a3045", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.status === "success" ? "#34d399" : "#f87171" }} />
              <span style={{ fontSize: 12, color: "#c8d4e8", fontWeight: 500 }}>{s.name}</span>
              {s.isPaid && <Badge color="#f59e0b" small>payant</Badge>}
              <span style={{ fontSize: 10, color: "#3d4f6e", fontFamily: "'IBM Plex Mono', monospace" }}>{s.lastRun.split(" ")[1]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OpportunitiesPage({ lang, t, onOpenOpp }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPole, setFilterPole] = useState("all");

  const filtered = MOCK_OPPS.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = !q || (lang === "fr" ? o.title : o.title_en).toLowerCase().includes(q) || o.country.some(c => c.toLowerCase().includes(q)) || o.donor.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    const matchPole = filterPole === "all" || o.pole.includes(filterPole);
    return matchSearch && matchStatus && matchPole;
  });

  const statuses = ["all", "new", "in_analysis", "go", "nogo", "submitted"];
  const poles = ["all", "eau", "geo", "infra", "agri"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Filters */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.opp.search}
          style={{ padding: "8px 14px", background: "#141720", border: "1px solid #2a3045", borderRadius: 8, color: "#c8d4e8", fontSize: 13, outline: "none", minWidth: 220 }} />
        <div style={{ display: "flex", gap: 6 }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} style={{
              padding: "6px 12px", borderRadius: 6, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", cursor: "pointer",
              border: `1px solid ${filterStatus === s ? (statusColor[s] || "#4f9cf9") : "#2a3045"}`,
              background: filterStatus === s ? `${statusColor[s] || "#4f9cf9"}15` : "#141720",
              color: filterStatus === s ? (statusColor[s] || "#4f9cf9") : "#6b7a96",
            }}>{s === "all" ? t.opp.all : t.status[s]}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {poles.map(p => (
            <button key={p} onClick={() => setFilterPole(p)} style={{
              padding: "6px 12px", borderRadius: 6, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", cursor: "pointer",
              border: `1px solid ${filterPole === p ? (poleColor[p] || "#4f9cf9") : "#2a3045"}`,
              background: filterPole === p ? `${poleColor[p] || "#4f9cf9"}15` : "#141720",
              color: filterPole === p ? (poleColor[p] || "#4f9cf9") : "#6b7a96",
            }}>{p === "all" ? t.opp.all : poleLabel[lang][p]}</button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", fontSize: 12, color: "#6b7a96", fontFamily: "'IBM Plex Mono', monospace" }}>
          {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
        </div>
      </div>

      <div style={{ background: "#141720", border: "1px solid #2a3045", borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2a3045" }}>
              {[lang === "fr" ? "Opportunité" : "Opportunity", t.opp.country, t.opp.donor, t.opp.deadline, t.opp.budget, t.opp.status, t.opp.source].map(h => (
                <th key={h} style={{ padding: "10px 16px", fontSize: 10, color: "#6b7a96", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "left", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => <OppRow key={o.id} opp={o} lang={lang} t={t} onClick={() => onOpenOpp(o)} />)}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "#6b7a96", fontSize: 13 }}>
            {lang === "fr" ? "Aucune opportunité trouvée" : "No opportunities found"}
          </div>
        )}
      </div>
    </div>
  );
}

function SourcesPage({ lang, t }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button style={{ padding: "8px 18px", borderRadius: 7, border: "1px solid rgba(79,156,249,0.4)", background: "rgba(79,156,249,0.08)", color: "#4f9cf9", fontSize: 13, cursor: "pointer" }}>
          + {t.sources.add}
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {MOCK_SOURCES.map(s => (
          <div key={s.id} style={{ background: "#141720", border: `1px solid ${s.active ? "#2a3045" : "#1c2030"}`, borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 16, opacity: s.active ? 1 : 0.5 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: !s.active ? "#3d4f6e" : s.status === "success" ? "#34d399" : "#f87171", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 14, color: "#eef2fa", fontWeight: 500 }}>{s.name}</span>
                {s.isPaid && <Badge color="#f59e0b" small>{lang === "fr" ? "payant" : "paid"}</Badge>}
                <Badge color="#6b7a96" small>{s.type.replace("_", " ")}</Badge>
              </div>
              <div style={{ fontSize: 11, color: "#6b7a96", fontFamily: "'IBM Plex Mono', monospace" }}>
                {s.url} · {t.sources.frequency}: {s.frequency} · {t.sources.lastRun}: {s.lastRun}
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#6b7a96", fontFamily: "'IBM Plex Mono', monospace", padding: "4px 10px", borderRadius: 5, border: "1px solid #2a3045", cursor: "pointer" }}>
              {t.sources.manage}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertsPage({ lang, t }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button style={{ padding: "8px 18px", borderRadius: 7, border: "1px solid rgba(79,156,249,0.4)", background: "rgba(79,156,249,0.08)", color: "#4f9cf9", fontSize: 13, cursor: "pointer" }}>
          + {t.alerts.add}
        </button>
      </div>
      {MOCK_ALERTS.map(a => (
        <div key={a.id} style={{ background: "#141720", border: `1px solid ${a.active ? "#2a3045" : "#1c2030"}`, borderRadius: 10, padding: "16px 20px", opacity: a.active ? 1 : 0.55 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.active ? "#34d399" : "#3d4f6e" }} />
            <span style={{ fontSize: 14, color: "#eef2fa", fontWeight: 500 }}>{a.name}</span>
            <Badge color={a.active ? "#34d399" : "#6b7a96"} small>{a.active ? t.alerts.active : "Inactive"}</Badge>
            <div style={{ marginLeft: "auto", fontSize: 11, color: "#6b7a96", fontFamily: "'IBM Plex Mono', monospace" }}>
              {a.frequency} · {a.sendTime}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {a.filters.countries.map(c => <Badge key={c} color="#4f9cf9" small>🌍 {c}</Badge>)}
            {a.filters.poles.map(p => <PoleBadge key={p} pole={p} lang={lang} small />)}
            {a.filters.donors.map(d => <Badge key={d} color="#a78bfa" small>{d}</Badge>)}
            {a.filters.keywords.map(k => <Badge key={k} color="#6b7a96" small>"{k}"</Badge>)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── APP SHELL ─────────────────────────────────────────────────────────────────
export default function IntelliWatch() {
  const [lang, setLang] = useState("fr");
  const [page, setPage] = useState("dashboard");
  const [wizard, setWizard] = useState(null);
  const t = T[lang];

  const navItems = [
    { key: "dashboard", icon: "⬛", label: t.nav.dashboard },
    { key: "opportunities", icon: "◈", label: t.nav.opportunities },
    { key: "sources", icon: "⬡", label: t.nav.sources },
    { key: "prompts", icon: "✦", label: t.nav.prompts },
    { key: "alerts", icon: "◎", label: t.nav.alerts },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0d0f14", color: "#c8d4e8", fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0d0f14; }
        ::-webkit-scrollbar-thumb { background: #2a3045; border-radius: 3px; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* SIDEBAR */}
        <aside style={{ width: 220, background: "#0a0c11", borderRight: "1px solid #1c2030", display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
          {/* Logo */}
          <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #1c2030" }}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "#eef2fa", letterSpacing: "-0.01em" }}>
              Intelli<span style={{ color: "#4f9cf9" }}>Watch</span>
            </div>
            <div style={{ fontSize: 10, color: "#3d4f6e", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.08em", marginTop: 4 }}>SHER · ARTELIA GROUP</div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "12px 10px" }}>
            {navItems.map(({ key, icon, label }) => {
              const active = page === key;
              return (
                <button key={key} onClick={() => setPage(key)} style={{
                  width: "100%", textAlign: "left", padding: "9px 12px", borderRadius: 7, marginBottom: 2,
                  background: active ? "rgba(79,156,249,0.1)" : "none",
                  border: active ? "1px solid rgba(79,156,249,0.2)" : "1px solid transparent",
                  color: active ? "#4f9cf9" : "#6b7a96", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 10, fontSize: 13,
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  transition: "all 0.12s",
                }}>
                  <span style={{ fontSize: 14, opacity: 0.7 }}>{icon}</span>
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Lang toggle + user */}
          <div style={{ padding: "14px 10px", borderTop: "1px solid #1c2030", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 6, padding: "0 2px" }}>
              {["fr", "en"].map(l => (
                <button key={l} onClick={() => setLang(l)} style={{
                  flex: 1, padding: "5px", borderRadius: 5, fontSize: 11,
                  fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600,
                  border: `1px solid ${lang === l ? "#4f9cf9" : "#2a3045"}`,
                  background: lang === l ? "rgba(79,156,249,0.15)" : "none",
                  color: lang === l ? "#4f9cf9" : "#6b7a96", cursor: "pointer",
                }}>{l.toUpperCase()}</button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "#141720", borderRadius: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(79,156,249,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#4f9cf9", fontWeight: 600 }}>SH</div>
              <div>
                <div style={{ fontSize: 12, color: "#eef2fa" }}>SHER Analyst</div>
                <div style={{ fontSize: 10, color: "#3d4f6e" }}>senior_analyst</div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {/* Topbar */}
          <div style={{ padding: "18px 32px", borderBottom: "1px solid #1c2030", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0d0f14", position: "sticky", top: 0, zIndex: 10 }}>
            <div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#eef2fa", fontWeight: 400 }}>
                {page === "dashboard" ? t.dash.title : page === "opportunities" ? t.opp.title : page === "sources" ? t.sources.title : page === "alerts" ? t.alerts.title : t.nav[page]}
              </div>
              {page === "dashboard" && <div style={{ fontSize: 12, color: "#6b7a96", marginTop: 2 }}>{t.dash.subtitle}</div>}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ padding: "6px 14px", background: "#141720", border: "1px solid #2a3045", borderRadius: 6, fontSize: 11, color: "#6b7a96", fontFamily: "'IBM Plex Mono', monospace" }}>
                {new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { weekday: "long", day: "numeric", month: "long" })}
              </div>
            </div>
          </div>

          <div style={{ padding: "28px 32px", flex: 1, overflowY: "auto" }}>
            {page === "dashboard" && <Dashboard lang={lang} t={t} onNavigate={setPage} onOpenOpp={setWizard} />}
            {page === "opportunities" && <OpportunitiesPage lang={lang} t={t} onOpenOpp={setWizard} />}
            {page === "sources" && <SourcesPage lang={lang} t={t} />}
            {page === "alerts" && <AlertsPage lang={lang} t={t} />}
            {page === "prompts" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {MOCK_PROMPTS.map(p => (
                  <div key={p.id} style={{ background: "#141720", border: "1px solid #2a3045", borderRadius: 10, padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 14, color: "#eef2fa", fontWeight: 500 }}>{p.name}</span>
                      <Badge color="#f472b6" small>{p.category}</Badge>
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{p.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* WIZARD MODAL */}
      {wizard && <AnalysisWizard opp={wizard} lang={lang} t={t} onClose={() => setWizard(null)} />}
    </div>
  );
}
