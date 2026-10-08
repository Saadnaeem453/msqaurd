import { useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import {
  FiAlertCircle,
  FiBox,
  FiCheck,
  FiChevronDown,
  FiClock,
  FiCopy,
  FiFilter,
  FiGrid,
  FiInfo,
  FiMapPin,
  FiMonitor,
  FiPlus,
  FiPlusCircle,
  FiShield,
  FiTrash2,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { MdAccountBalance } from "react-icons/md";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { toast } from "sonner";

/* ============================= Types ============================= */

interface EventType {
  id: string;
  name: string;
  icon: IconType;
  rules: string;
  scope: string;
  status: "active" | "draft";
}

interface FieldRow {
  id: string;
  label: string;
  dataType: string;
  required: boolean;
  tag: string;
}

interface ValidationRow {
  id: string;
  icon: IconType;
  title: string;
  description: string;
  enabled: boolean;
}

interface TypeConfig {
  internalId: string;
  fields: FieldRow[];
  validations: ValidationRow[];
  roles: string[];
  scopes: string[];
}

interface AuditItem {
  id: string;
  icon: IconType;
  iconClasses: string;
  title: string;
  author: string;
  time: string;
  tag?: { text: string; classes: string };
}

/* ================== Mock data (swap with real API later) ================== */

const eventTypes: EventType[] = [
  { id: "in-person", name: "In-person", icon: MdAccountBalance, rules: "14 Rules", scope: "Core Only", status: "active" },
  { id: "virtual", name: "Virtual", icon: FiMonitor, rules: "8 Rules", scope: "Extended", status: "active" },
  { id: "hybrid", name: "Hybrid", icon: FiUsers, rules: "23 Rules", scope: "Restricted", status: "draft" },
];

const dataTypeOptions = ["String (Large)", "Integer", "Boolean", "Date"];

const buildConfig = (typeId: string): TypeConfig => {
  if (typeId === "virtual")
    return {
      internalId: "EVT_VIR_002",
      fields: [
        { id: "f1", label: "Stream Provider", dataType: "String (Large)", required: true, tag: "Core Schema" },
        { id: "f2", label: "Max Concurrent Views", dataType: "Integer", required: false, tag: "Extended" },
      ],
      validations: [
        { id: "v1", icon: FiShield, title: "DRM Enforcement", description: "Require encrypted playback for paid virtual tiers.", enabled: true },
        { id: "v2", icon: FiMapPin, title: "Regional Blackouts", description: "Apply licensing blackouts by viewer region.", enabled: false },
      ],
      roles: ["Super_Admin", "Broadcast_Ops"],
      scopes: ["Standard_User"],
    };
  if (typeId === "hybrid")
    return {
      internalId: "EVT_HYB_003",
      fields: [
        { id: "f1", label: "Venue Address", dataType: "String (Large)", required: true, tag: "Core Schema" },
        { id: "f2", label: "Stream Provider", dataType: "String (Large)", required: true, tag: "Extended" },
      ],
      validations: [
        { id: "v1", icon: FiShield, title: "KYC/AML Verification Required", description: "Enforce physical ID verification for high-capacity venue hosts.", enabled: true },
        { id: "v2", icon: FiMapPin, title: "Geo-fence Validation", description: "Validate venue coordinates against supported regional zones.", enabled: true },
      ],
      roles: ["Super_Admin"],
      scopes: ["Standard_User", "Remote_View"],
    };
  return {
    internalId: "EVT_PHY_001",
    fields: [
      { id: "f1", label: "Venue Address", dataType: "String (Large)", required: true, tag: "Core Schema" },
      { id: "f2", label: "Max Capacity", dataType: "Integer", required: true, tag: "Extended" },
    ],
    validations: [
      { id: "v1", icon: FiShield, title: "KYC/AML Verification Required", description: "Enforce physical ID verification for high-capacity venue hosts.", enabled: true },
      { id: "v2", icon: FiMapPin, title: "Geo-fence Validation", description: "Validate venue coordinates against supported regional zones.", enabled: false },
    ],
    roles: ["Super_Admin", "Event Manager"],
    scopes: ["Standard_User"],
  };
};

const auditItems: AuditItem[] = [
  {
    id: "a1",
    icon: FiCheck,
    iconClasses: "bg-green text-grayblue",
    title: "Updated \"Virtual\" event validation logic",
    author: "Admin Alex J.",
    time: "2 hours ago",
    tag: { text: "V2.4.1", classes: "bg-bgray/10 text-bgray/80" },
  },
  {
    id: "a2",
    icon: FiAlertCircle,
    iconClasses: "bg-primary/15 text-primary",
    title: "Emergency schema override triggered",
    author: "System Automation",
    time: "5 hours ago",
    tag: { text: "CRITICAL", classes: "text-primary font-bold" },
  },
  {
    id: "a3",
    icon: FiPlus,
    iconClasses: "bg-bgray/10 text-bgray/70",
    title: "Draft created: \"Private Exhibition\"",
    author: "Admin Sarah K.",
    time: "Yesterday at 14:22",
  },
];

const loadPublished = (): { types: EventType[]; configs: Record<string, TypeConfig> } => {
  try {
    const stored = JSON.parse(localStorage.getItem("admin-event-schemas") || "null");
    if (!Array.isArray(stored?.types) || !stored?.configs) return { types: eventTypes, configs: {} };
    const types: EventType[] = [];
    const configs: Record<string, TypeConfig> = {};
    for (const item of stored.types) {
      const value = stored.configs[item.id];
      if (typeof item.id !== "string" || typeof item.name !== "string" || !value || typeof value.internalId !== "string" || !Array.isArray(value.fields) || !value.fields.every((field: FieldRow) => typeof field.id === "string" && typeof field.label === "string" && dataTypeOptions.includes(field.dataType) && typeof field.required === "boolean") || !Array.isArray(value.roles) || !value.roles.every((role: unknown) => typeof role === "string") || !Array.isArray(value.scopes) || !value.scopes.every((scope: unknown) => typeof scope === "string")) continue;
      const base = buildConfig(item.id);
      configs[item.id] = { ...base, internalId: value.internalId, fields: value.fields, roles: value.roles, scopes: value.scopes, validations: base.validations.map(validation => ({ ...validation, enabled: Array.isArray(value.validations) && typeof value.validations.find((entry: { id: string }) => entry.id === validation.id)?.enabled === "boolean" ? value.validations.find((entry: { id: string }) => entry.id === validation.id).enabled : validation.enabled })) };
      types.push({ id: item.id, name: item.name, icon: eventTypes.find(type => type.id === item.id)?.icon ?? FiBox, rules: item.rules || "Custom", scope: item.scope || "Custom", status: "active" });
    }
    return { types: [...eventTypes.filter(type => !types.some(saved => saved.id === type.id)), ...types], configs };
  } catch { return { types: eventTypes, configs: {} }; }
};

/* ============================= Page ============================= */

const EventTypeArchitectPage = () => {
  const [restored] = useState(loadPublished);
  const [filter, setFilter] = useState("");
  const [selectedType, setSelectedType] = useState("in-person");
  const [config, setConfig] = useState<TypeConfig>(() => restored.configs["in-person"] ?? buildConfig("in-person"));
  const [openSelect, setOpenSelect] = useState<string | null>(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [types, setTypes] = useState(restored.types);
  const [saved, setSaved] = useState<Record<string, TypeConfig>>(restored.configs);
  const drafts = useRef<Record<string, TypeConfig>>({});
  const [audit, setAudit] = useState(auditItems);
  const auditRef = useRef<HTMLElement>(null);
  const [entryKind, setEntryKind] = useState<"type" | "role" | "scope" | null>(null);
  const [entryName, setEntryName] = useState("");
  const entryRef = useRef<HTMLDialogElement>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  useEffect(() => { if (entryKind) entryRef.current?.showModal(); else entryRef.current?.close(); }, [entryKind]);
  const openEntry = (kind: "type" | "role" | "scope") => { setEntryName(""); setEntryKind(kind); };
  const addAudit = (title: string) => setAudit(prev => [{ id: crypto.randomUUID(), icon: FiCheck, iconClasses: "bg-green/15 text-green", title, author: "Local administrator", time: new Date().toLocaleTimeString() }, ...prev]);

  const activeType = types.find((t) => t.id === selectedType) ?? types[0];

  const selectType = (id: string) => {
    drafts.current[selectedType] = config;
    setSelectedType(id);
    setConfig(drafts.current[id] ?? saved[id] ?? buildConfig(id));
    setOpenSelect(null);
  };

  const updateField = (id: string, patch: Partial<FieldRow>) =>
    setConfig((prev) => ({
      ...prev,
      fields: prev.fields.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    }));

  const handlePublish = () => {
    const labels = config.fields.map(field => field.label.trim().toLowerCase());
    if (!labels.length || labels.some(label => !label) || new Set(labels).size !== labels.length || !config.roles.length) { toast.error("Add unique, nonempty field labels and at least one admin role."); setPublishOpen(false); return; }
    try {
      const next = { ...saved, [selectedType]: config };
      localStorage.setItem("admin-event-schemas", JSON.stringify({ configs: next, types: types.filter(type => next[type.id]).map(({ icon, ...type }) => { void icon; return type; }) }));
      setSaved(next); drafts.current[selectedType] = config;
      setTypes(prev => prev.map(type => type.id === selectedType ? { ...type, status: "active" } : type));
      setPublishOpen(false); addAudit(`Saved "${activeType.name}" schema locally`); toast.success("Schema saved locally. Live events are unchanged.");
    } catch { toast.error("Unable to save schema in browser storage."); }
  };

  const visibleTypes = types.filter((t) =>
    t.name.toLowerCase().includes(filter.trim().toLowerCase()),
  );

  return (
    <div className="min-h-full bg-grayblue font-jakarta text-bgray">
      <div className="admin-page">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-md">
            <h1 className="text-3xl font-medium tracking-tight text-bgray">
              Event Type Architect
            </h1>
            <p className="mt-1 text-xs leading-relaxed text-secondary/80">
              Configure global event schemas, required metadata, and validation hierarchies
              for all supported participation modes.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => { auditRef.current?.scrollIntoView({ behavior: "smooth" }); auditRef.current?.focus({ preventScroll: true }); }}
              className="flex items-center gap-2 rounded-md bg-bgray/10 px-4 py-2 text-xs font-semibold text-bgray transition hover:bg-bgray/15"
            >
              <FiClock size={13} />
              Audit Log
            </button>
            <button
              type="button"
              onClick={() => openEntry("type")}
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-bgray transition hover:bg-primary/90"
            >
              <FiPlusCircle size={13} />
              Define New Type
            </button>
          </div>
        </header>

        {/* Body grid */}
        <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(210px,1fr)_minmax(0,2.05fr)]">
          {/* Left rail */}
          <div className="space-y-3 min-w-0">
            <div className="relative rounded-t-md bg-[#151c24] p-3">
              <FiFilter
                size={12}
                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-secondary/70"
              />
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter type schemas..."
                className="w-full rounded-sm bg-[#080f15] py-2.5 pl-8 pr-3 text-xs text-bgray placeholder:text-secondary/70 focus:outline-none"
              />
            </div>

            <ul className="!mt-0 bg-[#151c24]">
              {visibleTypes.map((type) => {
                const TypeIcon = type.icon;
                const isActive = type.id === selectedType;
                return (
                  <li key={type.id}>
                    <button
                      type="button"
                      onClick={() => selectType(type.id)}
                      className={`w-full bg-[#151c24] p-4 text-left transition hover:bg-bgray/5 ${
                        isActive ? "border-l-2 border-secondary !bg-[#22262e]" : "border-l-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`flex items-center gap-2 text-xs font-bold ${isActive ? "text-bgray" : "text-bgray/90"}`}>
                          <TypeIcon size={13} className={isActive ? "text-secondary" : "text-bgray/70"} />
                          {type.name}
                        </span>
                        <span
                          className={`rounded-sm px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wide ${
                            type.status === "active"
                              ? "bg-green/15 text-green"
                              : "bg-bgray/10 text-bgray/80"
                          }`}
                        >
                          {type.status}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-[8px] text-secondary/70">
                        <span className="flex items-center gap-1">
                          <FiGrid size={8} />
                          {type.rules}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiBox size={8} />
                          {type.scope}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* System integrity */}
            <div className="rounded-md bg-[#151c24] p-4">
              <p className="text-[10px] font-medium uppercase tracking-widest text-secondary">
                System Integrity
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-bgray/80">Schema Validated</span>
                <span className="text-xs font-bold text-bgray">98.4%</span>
              </div>
              <div className="mt-2 h-1 w-full rounded-full bg-bgray/15">
                <div className="h-full rounded-full bg-secondary" style={{ width: "98.4%" }} />
              </div>
              <p className="mt-3 text-[9px] leading-relaxed text-secondary/70">
                {types.filter(type => type.status === "draft").length} draft types currently awaiting validation before deployment to production
                environment.
              </p>
            </div>
          </div>

          {/* Configuration panel */}
          <section className="rounded-md bg-[#151c24] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/15 text-secondary">
                  <activeType.icon size={16} />
                </span>
                <div>
                  <h2 className="text-xl font-medium text-bgray">
                    Configuration: {activeType.name}
                  </h2>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[9px] text-secondary/70">
                    Internal ID:
                    <span className="rounded bg-bgray/10 px-1.5 py-0.5 text-[9px] text-bgray/80">
                      {config.internalId}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" aria-label="Copy configuration" onClick={async () => { try { await navigator.clipboard.writeText(JSON.stringify(config, null, 2)); toast.success("Configuration copied."); } catch { toast.error("Clipboard access was denied."); } }} className="rounded p-1.5 text-bgray/70 transition hover:bg-bgray/10 hover:text-bgray">
                  <FiCopy size={14} />
                </button>
                <button type="button" aria-label="Delete configuration" onClick={() => setDeleteOpen(true)} disabled={types.length === 1} className="rounded p-1.5 text-bgray/70 transition hover:bg-bgray/10 hover:text-bgray">
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>

            {/* Metadata requirements */}
            <div className="mt-6 flex items-center justify-between">
              <p className="text-[10px] font-medium uppercase tracking-widest text-secondary">
                Metadata Requirements
              </p>
              <button
                type="button"
                onClick={() =>
                  setConfig((prev) => ({
                    ...prev,
                    fields: [
                      ...prev.fields,
                      { id: crypto.randomUUID(), label: "New Field", dataType: "String (Large)", required: false, tag: "Extended" },
                    ],
                  }))
                }
                className="text-[9px] font-bold text-secondary transition hover:text-bgray"
              >
                + Add Field
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {config.fields.map((field) => (
                <div key={field.id} className="flex flex-wrap items-center gap-2 rounded-sm bg-[#1d242d] p-3">
                  <FiGrid size={12} className="shrink-0 text-secondary/70" />
                  <div className="min-w-[110px] flex-1">
                    <p className="mb-1 text-[7px] font-bold uppercase tracking-wider text-secondary/70">
                      Field Label
                    </p>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                      className="w-full rounded-sm bg-[#080f15] px-3 py-2 text-xs text-bgray focus:outline-none"
                    />
                  </div>
                  <div className="w-28">
                    <p className="mb-1 text-[7px] font-bold uppercase tracking-wider text-secondary/70">
                      Data Type
                    </p>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setOpenSelect(openSelect === field.id ? null : field.id)}
                        className="flex w-full items-center justify-between gap-2 rounded-sm bg-[#080f15] px-3 py-2 text-xs text-bgray transition hover:bg-bgray/5"
                      >
                        {field.dataType}
                        <FiChevronDown size={11} className="text-secondary/70" />
                      </button>
                      {openSelect === field.id && (
                        <div className="absolute left-0 top-full z-10 mt-1 w-full rounded-md border border-border_color bg-[#151c24] py-1 shadow-lg">
                          {dataTypeOptions.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                updateField(field.id, { dataType: option });
                                setOpenSelect(null);
                              }}
                              className={`block w-full px-3 py-1.5 text-left text-xs transition hover:bg-bgray/10 ${
                                option === field.dataType ? "font-medium text-bgray" : "text-bgray/80"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <label className="flex items-center gap-1.5">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={field.required}
                      aria-label={`Require ${field.label}`}
                      onClick={() => updateField(field.id, { required: !field.required })}
                      className={`flex h-3.5 w-3.5 items-center justify-center rounded-sm border transition ${
                        field.required ? "border-secondary bg-secondary" : "border-bgray/30 bg-transparent"
                      }`}
                    >
                      {field.required && <FiCheck size={9} className="text-grayblue" />}
                    </button>
                    <span className="text-[9px] text-bgray/80">Required</span>
                  </label>
                  <span className="ml-auto rounded-md bg-bgray/10 px-2.5 py-1 text-[8px] font-semibold text-bgray/80">
                    {field.tag}
                  </span>
                </div>
              ))}
            </div>

            {/* Validation hierarchy */}
            <p className="mt-6 text-[10px] font-medium uppercase tracking-widest text-secondary">
              Validation Hierarchy
            </p>
            <div className="mt-3 space-y-3">
              {config.validations.map((validation) => {
                const ValidationIcon = validation.icon;
                return (
                  <div key={validation.id} className="flex items-center gap-3 rounded-sm bg-[#1d242d] p-3">
                    <ValidationIcon size={15} className="shrink-0 text-secondary" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-bgray">{validation.title}</p>
                      <p className="mt-0.5 text-[9px] text-secondary/70">{validation.description}</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={validation.enabled}
                      aria-label={validation.title}
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          validations: prev.validations.map((v) =>
                            v.id === validation.id ? { ...v, enabled: !v.enabled } : v,
                          ),
                        }))
                      }
                      className={`relative h-5 w-10 shrink-0 rounded-full transition ${
                        validation.enabled ? "bg-primary" : "bg-bgray/20"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 flex h-4 w-4 items-center justify-center rounded-full transition-all ${
                          validation.enabled ? "left-5 bg-blue-600" : "left-1 bg-bgray"
                        }`}
                      >
                        {validation.enabled && <FiCheck size={8} className="text-bgray" />}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* RBAC */}
            <p className="mt-6 text-[10px] font-medium uppercase tracking-widest text-secondary">
              Role-Based Access Control
            </p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-sm bg-[#1d242d] p-3">
                <p className="text-[7px] font-bold uppercase tracking-wider text-secondary/70">
                  Admin Roles
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {config.roles.map((role) => (
                    <span key={role} className="flex items-center gap-1 rounded-sm bg-bgray/10 px-2 py-1 text-[8px] font-semibold text-bgray/80">
                      {role}
                      <button
                        type="button"
                        aria-label={`Remove ${role}`}
                        onClick={() =>
                          setConfig((prev) => ({ ...prev, roles: prev.roles.filter((r) => r !== role) }))
                        }
                        className="text-secondary/70 transition hover:text-bgray"
                      >
                        <FiX size={8} />
                      </button>
                    </span>
                  ))}
                  <button type="button" onClick={() => openEntry("role")} className="rounded-sm border border-secondary/40 px-2 py-1 text-[8px] font-semibold text-secondary transition hover:bg-secondary/10">
                    + Add Role
                  </button>
                </div>
              </div>
              <div className="rounded-sm bg-[#1d242d] p-3">
                <p className="text-[7px] font-bold uppercase tracking-wider text-secondary/70">
                  User Scopes
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {config.scopes.map((scope) => (
                    <span key={scope} className="flex items-center gap-1 rounded-sm bg-bgray/10 px-2 py-1 text-[8px] font-semibold text-bgray/80">
                      {scope}
                      <button
                        type="button"
                        aria-label={`Remove ${scope}`}
                        onClick={() =>
                          setConfig((prev) => ({ ...prev, scopes: prev.scopes.filter((s) => s !== scope) }))
                        }
                        className="text-secondary/70 transition hover:text-bgray"
                      >
                        <FiX size={8} />
                      </button>
                    </span>
                  ))}
                  <button type="button" onClick={() => openEntry("scope")} className="rounded-sm border border-secondary/40 px-2 py-1 text-[8px] font-semibold text-secondary transition hover:bg-secondary/10">
                    + Add Scope
                  </button>
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-bgray/5 pt-5">
              <p className="flex max-w-[180px] items-start gap-1.5 text-[9px] leading-snug text-secondary/70">
                <FiInfo size={11} className="mt-0.5 shrink-0" />
                Publish saves this schema locally in your browser.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { setConfig(saved[selectedType] ?? buildConfig(selectedType)); setOpenSelect(null); toast.info("Changes reset."); }}
                  className="rounded-md bg-bgray/10 px-4 py-2.5 text-xs font-semibold text-bgray transition hover:bg-bgray/15"
                >
                  Reset Changes
                </button>
                <button
                  type="button"
                  onClick={() => setPublishOpen(true)}
                  className="rounded-md bg-primary px-5 py-2.5 text-xs font-bold text-bgray transition hover:bg-primary/90"
                >
                  Publish Schema
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Audit panel */}
        <section ref={auditRef} tabIndex={-1} className="mt-6 rounded-md bg-[#151c24] p-5">
          <p className="text-[10px] font-medium uppercase tracking-widest text-secondary">
            Recent Configuration Audit
          </p>
          <ul className="mt-4 space-y-4">
            {audit.map((item) => {
              const ItemIcon = item.icon;
              return (
                <li key={item.id} className="flex items-start gap-3">
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${item.iconClasses}`}>
                    <ItemIcon size={10} />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-bgray">{item.title}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[9px] text-secondary/70">
                      {item.author} • {item.time}
                      {item.tag && (
                        <>
                          •
                          <span className={`rounded px-1.5 py-0.5 text-[8px] ${item.tag.classes}`}>
                            {item.tag.text}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <dialog ref={entryRef} onClose={() => setEntryKind(null)} className="w-[calc(100%-2rem)] max-w-md rounded-md border border-bgray/10 bg-[#192028] p-6 text-bgray backdrop:bg-black/70">
        <form onSubmit={event => { event.preventDefault(); const name = entryName.trim(); if (!name) return;
          if (entryKind === "type") { if (types.some(type => type.name.toLowerCase() === name.toLowerCase())) { toast.error("That type already exists."); return; } const id = crypto.randomUUID(); const next = { ...buildConfig(id), internalId: `EVT_${id.slice(0,8).toUpperCase()}` }; drafts.current[selectedType] = config; drafts.current[id] = next; setTypes(prev => [...prev, { id, name, icon: FiBox, rules: "2 Fields", scope: "Custom", status: "draft" }]); setSelectedType(id); setConfig(next); addAudit(`Draft created: "${name}"`); }
          else { const key = entryKind === "role" ? "roles" : "scopes"; if (config[key].some(value => value.toLowerCase() === name.toLowerCase())) { toast.error("This entry already exists."); return; } setConfig(prev => ({ ...prev, [key]: [...prev[key], name] })); }
          setEntryKind(null);
        }}><div className="flex items-center justify-between"><h2 className="text-lg">{entryKind === "type" ? "Define New Type" : entryKind === "role" ? "Add Admin Role" : "Add User Scope"}</h2><button type="button" aria-label="Close" onClick={() => setEntryKind(null)}><FiX /></button></div><label className="mt-5 block text-sm">Name<input autoFocus required maxLength={80} value={entryName} onChange={event => setEntryName(event.target.value)} className="mt-2 block w-full rounded bg-grayblue p-3" /></label><button type="submit" className="mt-5 rounded bg-primary px-5 py-2 text-white">Add</button></form>
      </dialog>
      <ConfirmModal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete configuration" message={`Remove "${activeType.name}" from this local session?`} onConfirm={() => { const remaining = types.filter(type => type.id !== selectedType); if (!remaining.length) return; delete drafts.current[selectedType]; setTypes(remaining); const nextSaved = { ...saved }; delete nextSaved[selectedType]; setSaved(nextSaved); setSelectedType(remaining[0].id); setConfig(drafts.current[remaining[0].id] ?? nextSaved[remaining[0].id] ?? buildConfig(remaining[0].id)); setDeleteOpen(false); addAudit(`Removed "${activeType.name}" from session`); }} />
      <ConfirmModal
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        onConfirm={handlePublish}
        message={`Save the "${activeType.name}" schema in this browser? Live events will not be changed.`}
        variant="info"
        confirmLabel="Save Schema"
      />
    </div>
  );
};

export default EventTypeArchitectPage;