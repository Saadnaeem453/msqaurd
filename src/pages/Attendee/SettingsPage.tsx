import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Lock,
  Shield,
  Eye,
  Share2,
  Bell,
  Mail,
  MessageSquare,
  FileText,
  ShieldCheck,
  LogOut,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

const SettingsPage = () => {
  const navigate = useNavigate();

  const [profileVisibility, setProfileVisibility] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("accountType");
    localStorage.removeItem("onboardingCompleted");
    localStorage.removeItem("mh_token");
    localStorage.removeItem("initialLoaderShown");
    navigate("/login");
  };

  const Toggle = ({
    enabled,
    onToggle,
  }: {
    enabled: boolean;
    onToggle: () => void;
  }) => (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
        enabled ? "bg-primary" : "bg-secondary/20"
      }`}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          enabled ? "translate-x-[22px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );

  const sectionClass =
    "bg-[#131418] border border-secondary/10 rounded-xl overflow-hidden";

  const rowClass =
    "flex items-center justify-between px-5 py-4 border-b border-secondary/5 last:border-0 hover:bg-secondary/5 transition-colors";

  return (
    <div className="w-full py-6">
      {/* ─ Back Button ─────────────────────────────────── */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-secondary hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Edit Profile
      </button>

      {/* ─ Header ──────────────────────────────────────── */}
      <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
      <p className="text-secondary text-sm mb-8">
        Manage your account preferences and security settings.
      </p>

      <div className="space-y-6">
        {/* ─ Account Settings ─────────────────────────── */}
        <div className={sectionClass}>
          <div className="px-5 py-3 border-b border-secondary/5">
            <h2 className="text-primary text-[10px] font-bold uppercase tracking-[0.15em]">
              Account Settings
            </h2>
          </div>
          <div className={rowClass}>
            <div className="flex items-center gap-3">
              <Lock size={16} className="text-secondary" />
              <div>
                <p className="text-white text-sm font-medium">Password</p>
                <p className="text-secondary/50 text-xs">
                  Change your account password regularly
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-secondary/30" />
          </div>
          <div className={rowClass}>
            <div className="flex items-center gap-3">
              <Shield size={16} className="text-secondary" />
              <div>
                <p className="text-white text-sm font-medium">Security</p>
                <p className="text-secondary/50 text-xs">
                  Two-factor authentication and login history
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-secondary/30" />
          </div>
        </div>

        {/* ─ Privacy ──────────────────────────────────── */}
        <div className={sectionClass}>
          <div className="px-5 py-3 border-b border-secondary/5">
            <h2 className="text-primary text-[10px] font-bold uppercase tracking-[0.15em]">
              Privacy
            </h2>
          </div>
          <div className={rowClass}>
            <div className="flex items-center gap-3">
              <Eye size={16} className="text-secondary" />
              <div>
                <p className="text-white text-sm font-medium">Profile visibility</p>
                <p className="text-secondary/50 text-xs">
                  Make your profile public or private
                </p>
              </div>
            </div>
            <Toggle
              enabled={profileVisibility}
              onToggle={() => setProfileVisibility(!profileVisibility)}
            />
          </div>
          <div className={rowClass}>
            <div className="flex items-center gap-3">
              <Share2 size={16} className="text-secondary" />
              <div>
                <p className="text-white text-sm font-medium">Data sharing</p>
                <p className="text-secondary/50 text-xs">
                  Manage how your data is used with partners
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-secondary/30" />
          </div>
        </div>

        {/* ─ Notifications ─────────────────────────────── */}
        <div className={sectionClass}>
          <div className="px-5 py-3 border-b border-secondary/5">
            <h2 className="text-primary text-[10px] font-bold uppercase tracking-[0.15em]">
              Notifications
            </h2>
          </div>
          <div className={rowClass}>
            <div className="flex items-center gap-3">
              <Bell size={16} className="text-secondary" />
              <div>
                <p className="text-white text-sm font-medium">Push Notifications</p>
                <p className="text-secondary/50 text-xs">
                  Alerts on your mobile device
                </p>
              </div>
            </div>
            <Toggle
              enabled={pushNotifications}
              onToggle={() => setPushNotifications(!pushNotifications)}
            />
          </div>
          <div className={rowClass}>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-secondary" />
              <div>
                <p className="text-white text-sm font-medium">Email</p>
                <p className="text-secondary/50 text-xs">
                  Periodic updates and newsletters
                </p>
              </div>
            </div>
            <Toggle
              enabled={emailNotifications}
              onToggle={() => setEmailNotifications(!emailNotifications)}
            />
          </div>
          <div className={rowClass}>
            <div className="flex items-center gap-3">
              <MessageSquare size={16} className="text-secondary" />
              <div>
                <p className="text-white text-sm font-medium">SMS</p>
                <p className="text-secondary/50 text-xs">Urgent event reminders</p>
              </div>
            </div>
            <Toggle
              enabled={smsNotifications}
              onToggle={() => setSmsNotifications(!smsNotifications)}
            />
          </div>
        </div>

        {/* ─ Legal ─────────────────────────────────────── */}
        <div className={sectionClass}>
          <div className="px-5 py-3 border-b border-secondary/5">
            <h2 className="text-primary text-[10px] font-bold uppercase tracking-[0.15em]">
              Legal
            </h2>
          </div>
          <div className={rowClass}>
            <div className="flex items-center gap-3">
              <FileText size={16} className="text-secondary" />
              <div>
                <p className="text-white text-sm font-medium">Terms of Service</p>
              </div>
            </div>
            <ExternalLink size={14} className="text-secondary/30" />
          </div>
          <div className={rowClass}>
            <div className="flex items-center gap-3">
              <ShieldCheck size={16} className="text-secondary" />
              <div>
                <p className="text-white text-sm font-medium">Privacy Policy</p>
              </div>
            </div>
            <ExternalLink size={14} className="text-secondary/30" />
          </div>
        </div>

        {/* ─ Log Out ──────────────────────────────────── */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
