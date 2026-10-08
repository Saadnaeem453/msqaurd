import { useState, useEffect, useRef } from "react";
import { Camera, Save, X } from "lucide-react";
import { toast } from "sonner";
import {
  organizerSettingsApi,
  OrganizerSettings,
  UpdateSettingsPayload,
} from "../../../services/organizer_settings.service";
import { TIMEZONES, LANGUAGES, TimezoneOption } from "../../../data/timezones";

const AccountSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("Europe/London");

  const [timezoneSearch, setTimezoneSearch] = useState("");
  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);
  const timezoneDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await organizerSettingsApi.get();
        if (res.ok && res.data) {
          const data = res.data as OrganizerSettings;
          setFullName(data.full_name || "");
          setEmail(data.email || "");
          setAvatarUrl(data.avatar_url || null);
          setJobTitle(data.job_title || "");
          setPhoneNumber(data.phone_number || "");
          setBio(data.bio || "");
          setLanguage(data.preferred_language || "en");
          setTimezone(data.timezone || "Europe/London");
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (timezoneDropdownRef.current && !timezoneDropdownRef.current.contains(e.target as Node)) {
        setShowTimezoneDropdown(false);
      }
    };
    if (showTimezoneDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showTimezoneDropdown]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file (JPG, GIF or PNG)");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setSelectedFile(null);
    setAvatarUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFilteredTimezones = (): TimezoneOption[] => {
    const allTimezones: TimezoneOption[] = [];
    TIMEZONES.forEach((group) => {
      group.zones.forEach((zone) => {
        allTimezones.push({ value: zone.value, label: zone.label });
      });
    });

    if (!timezoneSearch) return allTimezones;

    const search = timezoneSearch.toLowerCase();
    return allTimezones.filter(
      (tz) =>
        tz.value.toLowerCase().includes(search) ||
        tz.label.toLowerCase().includes(search)
    );
  };

  const getCurrentTimezoneLabel = (): string => {
    for (const group of TIMEZONES) {
      for (const zone of group.zones) {
        if (zone.value === timezone) {
          return zone.label;
        }
      }
    }
    return timezone;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: UpdateSettingsPayload = {
        full_name: fullName,
        job_title: jobTitle,
        phone_number: phoneNumber,
        bio,
        preferred_language: language,
        timezone,
        profile_image: selectedFile,
      };

      const res = await organizerSettingsApi.update(payload);

      if (res.ok) {
        const data = res.data as OrganizerSettings;
        if (data.avatar_url) {
          setAvatarUrl(data.avatar_url);
        }
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        toast.success("Settings updated successfully!");
      } else {
        const detail = (res as any).detail || "";
        toast.error(detail || "Failed to update settings");
      }
    } catch {
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {

    toast.info("Changes discarded");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-secondary text-sm">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Account Settings</h1>
        <p className="text-secondary text-sm mt-1">
          Manage your professional profile and application preferences.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-sm">👤</span>
            </div>
            <h2 className="text-white font-semibold">Profile Details</h2>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-24 h-24 rounded-lg bg-secondary/10 overflow-hidden flex items-center justify-center">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-secondary text-2xl">?</span>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-7 h-7 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
                  title="Change profile picture"
                >
                  <Camera size={12} className="text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <p className="text-secondary/50 text-[10px] mt-3 text-center">
                JPG, GIF or PNG.<br />Max size 5MB
              </p>
              {selectedFile && (
                <button
                  onClick={removeAvatar}
                  className="text-xs text-red-400 hover:text-red-300 mt-1 block mx-auto"
                >
                  Remove new picture
                </button>
              )}
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-secondary text-[10px] uppercase tracking-wider font-semibold block mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#0d0e12] border border-[#292a2b] rounded-lg px-4 py-2.5 text-white text-sm outline-none placeholder:text-gray-500 focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-secondary text-[10px] uppercase tracking-wider font-semibold block mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-[#0d0e12] border border-[#292a2b] rounded-lg px-4 py-2.5 text-white text-sm outline-none placeholder:text-gray-500 focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-secondary text-[10px] uppercase tracking-wider font-semibold block mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-[#0d0e12]/50 border border-[#292a2b] rounded-lg px-4 py-2.5 text-secondary/50 text-sm outline-none cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-secondary text-[10px] uppercase tracking-wider font-semibold block mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-[#0d0e12] border border-[#292a2b] rounded-lg px-4 py-2.5 text-white text-sm outline-none placeholder:text-gray-500 focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-sm">📄</span>
            </div>
            <h2 className="text-white font-semibold">Personal Bio</h2>
          </div>

          <div>
            <label className="text-secondary text-[10px] uppercase tracking-wider font-semibold block mb-2">
              Short Professional Summary
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              maxLength={500}
              className="w-full bg-[#0d0e12] border border-[#292a2b] rounded-lg px-4 py-3 text-white text-sm outline-none placeholder:text-gray-500 focus:border-primary/50 transition-colors resize-none"
              placeholder="Describe your professional background..."
            />
            <p className="text-secondary/40 text-xs mt-1">{bio.length}/500 characters</p>
          </div>
        </div>

        <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-sm">🌐</span>
            </div>
            <h2 className="text-white font-semibold">Language & Region</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-secondary text-[10px] uppercase tracking-wider font-semibold block mb-2">
                Preferred Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-[#0d0e12] border border-[#292a2b] rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-primary/50 transition-colors"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value} className="bg-[#131418]">
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div ref={timezoneDropdownRef} className="relative">
              <label className="text-secondary text-[10px] uppercase tracking-wider font-semibold block mb-2">
                Timezone
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={showTimezoneDropdown ? timezoneSearch : getCurrentTimezoneLabel()}
                  onChange={(e) => {
                    setTimezoneSearch(e.target.value);
                    setShowTimezoneDropdown(true);
                  }}
                  onFocus={() => setShowTimezoneDropdown(true)}
                  placeholder="Search timezone..."
                  className="w-full bg-[#0d0e12] border border-[#292a2b] rounded-lg px-4 py-2.5 text-white text-sm outline-none placeholder:text-gray-500 focus:border-primary/50 transition-colors"
                />
                {showTimezoneDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#131418] border border-[#292a2b] rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                    {getFilteredTimezones().map((tz) => (
                      <button
                        key={tz.value}
                        type="button"
                        onClick={() => {
                          setTimezone(tz.value);
                          setTimezoneSearch("");
                          setShowTimezoneDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-secondary/10 ${
                          timezone === tz.value
                            ? "bg-primary/10 text-primary"
                            : "text-secondary hover:text-white"
                        }`}
                      >
                        {tz.label}
                      </button>
                    ))}
                    {getFilteredTimezones().length === 0 && (
                      <div className="px-4 py-3 text-secondary text-sm text-center">
                        No timezones found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            onClick={handleDiscard}
            disabled={saving}
            className="px-6 py-2.5 border border-secondary/20 text-secondary hover:text-white hover:border-secondary/40 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
