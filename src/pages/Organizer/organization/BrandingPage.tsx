import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Download,
  Upload,
  Heart,
  Pencil,
  Type,
  Palette,
  Image,
  FileText,
  Film,
  Plus,
  LayoutGrid,
  ChevronRight,
} from "lucide-react";

// ── Color Data ──────────────────────────────────────────────────────────────

const colorTokens = [
  { name: "Primary Red", hex: "#E5C614", swatch: "#ef4444", label: "#E5C614" },
  { name: "Deep Black", hex: "#0D0008", swatch: "#0d0008", label: "#0D0008" },
  { name: "Charcoal", hex: "#121212", swatch: "#121212", label: "#121212" },
  { name: "Off White", hex: "#F2E2E7", swatch: "#f2e2e7", label: "#F2E2E7" },
];

// ── Asset Data ──────────────────────────────────────────────────────────────

const assets = [
  { name: "Gala_Hero_Backgro", size: "4.2 MB", meta: "4500×3007", type: "image" },
  { name: "Annual_Review_Tea", size: "20.6 MB", meta: "1270", type: "video" },
  { name: "Brand_Guidelines_V", size: "1.1 MB", meta: "32 PAGES", type: "pdf" },
  { name: "Workshop_Imagery", size: "3.8 MB", meta: "2500×2133", type: "image" },
];

type AssetTab = "All Assets" | "Images" | "Videos";
const assetTabs: AssetTab[] = ["All Assets", "Images", "Videos"];

// ── Component ───────────────────────────────────────────────────────────────

const BrandingPage = () => {
  const [activeAssetTab, setActiveAssetTab] = useState<AssetTab>("All Assets");

  const filteredAssets = (() => {
    if (activeAssetTab === "Images") return assets.filter((a) => a.type === "image");
    if (activeAssetTab === "Videos") return assets.filter((a) => a.type === "video");
    return assets;
  })();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* ─ Breadcrumb ───────────────────────────────────── */}
      <div className="flex items-center gap-2 text-sm">
        <Link to="/organizer/organization/profile" className="text-secondary hover:text-white transition-colors">
          Organization
        </Link>
        <ChevronRight size={12} className="text-secondary/40" />
        <span className="text-primary font-medium">Brand Assets</span>
      </div>

      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-jakarta text-3xl font-bold text-white">Visual Identity</h1>
          <p className="text-secondary text-sm mt-2 max-w-lg leading-relaxed">
            Centralize your organization's voice. Manage primary assets, color tokens, and the typography system that powers MSQUARED events.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-secondary/10 border border-secondary/15 text-secondary hover:text-white hover:border-secondary/30 rounded-lg text-sm transition-colors">
            <Download size={14} /> Download Brand Kit
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
            <Upload size={14} /> Upload New Asset
          </button>
        </div>
      </div>

      {/* ─ Top Row: Primary Identity + Typography ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Primary Identity (3/5) */}
        <div className="lg:col-span-3 bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Heart size={16} className="text-red-400" />
              <h2 className="text-white text-base font-bold">Primary Identity</h2>
            </div>
            <button className="p-1.5 text-secondary/40 hover:text-white transition-colors">
              <Pencil size={14} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Main Logo */}
            <LogoCard label="Main Logo" dimensions="250 × 250 PX" icon={
              <div className="w-10 h-10 bg-red-500 rounded-sm" />
            } />
            {/* Secondary */}
            <LogoCard label="Secondary" dimensions="750 × 520 PX" icon={
              <div className="grid grid-cols-2 gap-1">
                <div className="w-4 h-4 bg-white rounded-sm" />
                <div className="w-4 h-4 bg-white rounded-sm" />
                <div className="w-4 h-4 bg-white rounded-sm" />
                <div className="w-4 h-4 bg-white rounded-sm" />
              </div>
            } />
            {/* Favicon */}
            <LogoCard label="Favicon" dimensions="60 × 320" icon={
              <div className="w-8 h-8 bg-red-500 rounded-sm" />
            } />
          </div>
        </div>

        {/* Typography (2/5) */}
        <div className="lg:col-span-2 bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Type size={16} className="text-red-400" />
            <h2 className="text-white text-base font-bold">Typography</h2>
          </div>

          {/* Display Font */}
          <div className="mb-5">
            <p className="text-red-400 text-[9px] uppercase tracking-[0.15em] font-bold mb-1.5">Display Font</p>
            <p className="text-white text-lg font-bold font-jakarta mb-1">Plus Jakarta Sans</p>
            <p className="text-secondary/50 text-xs leading-relaxed">
              Used for headlines and major impact sections.
            </p>
          </div>

          {/* Body Font */}
          <div className="mb-5">
            <p className="text-red-400 text-[9px] uppercase tracking-[0.15em] font-bold mb-1.5">Body Font</p>
            <p className="text-white text-base font-semibold mb-1">Inter Variable</p>
            <p className="text-secondary/50 text-xs leading-relaxed">
              Optimized for legibility and dense information.
            </p>
          </div>

          {/* System Tokens */}
          <div>
            <p className="text-red-400 text-[9px] uppercase tracking-[0.15em] font-bold mb-2.5">System Tokens</p>
            <div className="bg-secondary/5 rounded-lg p-3 border border-secondary/10">
              <p className="text-secondary text-xs font-mono leading-relaxed">
                H1: <span className="text-white">48px / Bold</span> &nbsp; H2: <span className="text-white">32px / Semi</span><br />
                Body: <span className="text-white">16px / Regular</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Color Tokens ──────────────────────────────────── */}
      <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Palette size={16} className="text-red-400" />
          <h2 className="text-white text-base font-bold">Color Tokens</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {colorTokens.map((color) => (
            <div key={color.hex} className="group">
              <div
                className="h-20 rounded-lg border border-secondary/10 mb-2 transition-transform group-hover:scale-[1.02]"
                style={{ backgroundColor: color.swatch }}
              />
              <p className="text-white text-xs font-medium">{color.name}</p>
              <p className="text-secondary/40 text-[10px] font-mono">{color.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Asset Library ─────────────────────────────────── */}
      <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Image size={16} className="text-red-400" />
              <h2 className="text-white text-base font-bold">Asset Library</h2>
            </div>
            <p className="text-secondary/50 text-xs">
              High-resolution promotional media and event imagery.
            </p>
          </div>
          <div className="flex items-center gap-1 bg-secondary/10 rounded-lg p-0.5">
            {assetTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveAssetTab(tab)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  tab === activeAssetTab
                    ? "bg-secondary/20 text-white"
                    : "text-secondary/60 hover:text-secondary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredAssets.map((asset) => (
            <AssetCard key={asset.name} asset={asset} />
          ))}

          {/* Upload Asset Card */}
          <div className="border-2 border-dashed border-secondary/15 rounded-xl flex flex-col items-center justify-center p-6 hover:border-primary/30 transition-colors cursor-pointer group min-h-[160px]">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mb-2 group-hover:bg-primary/10 transition-colors">
              <Plus size={18} className="text-secondary group-hover:text-primary transition-colors" />
            </div>
            <p className="text-white text-xs font-medium">Upload Asset</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Logo Card ───────────────────────────────────────────────────────────────

const LogoCard = ({
  label,
  dimensions,
  icon,
}: {
  label: string;
  dimensions: string;
  icon: React.ReactNode;
}) => (
  <div className="bg-[#0d0e12] border border-secondary/10 rounded-xl p-4 flex flex-col items-center text-center hover:border-secondary/20 transition-colors">
    <div className="w-full h-24 bg-[#131418] rounded-lg flex items-center justify-center mb-3">
      {icon}
    </div>
    <p className="text-white text-xs font-medium">{label}</p>
    <p className="text-secondary/40 text-[10px] mt-0.5">{dimensions}</p>
  </div>
);

// ── Asset Card ──────────────────────────────────────────────────────────────

const AssetCard = ({ asset }: { asset: (typeof assets)[0] }) => {
  const Icon = asset.type === "video" ? Film : asset.type === "pdf" ? FileText : LayoutGrid;

  return (
    <div className="bg-[#0d0e12] border border-secondary/10 rounded-xl overflow-hidden hover:border-secondary/20 transition-colors group">
      {/* Preview area */}
      <div className="h-24 bg-[#131418] flex items-center justify-center relative">
        <Icon size={24} className="text-secondary/30" />
        {asset.type === "video" && (
          <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/60 text-white text-[8px] font-bold uppercase rounded">
            Video
          </span>
        )}
        {asset.type === "pdf" && (
          <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-red-500/80 text-white text-[8px] font-bold uppercase rounded">
            PDF
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-white text-xs font-medium truncate">{asset.name}</p>
        <p className="text-secondary/40 text-[10px] mt-0.5">
          {asset.size} • {asset.meta}
        </p>
      </div>
    </div>
  );
};

export default BrandingPage;
