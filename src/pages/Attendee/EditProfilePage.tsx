import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Shield,
  Bell,
  CheckCircle2,
  Target,
  Camera,
} from "lucide-react";
import { toast } from "sonner";
import { attendeeProfileApi } from "../../services/attendee_profile.service";

interface UserProfile {
  full_name?: string;
  username?: string;
  avatar_url?: string;
  email?: string;
  bio?: string;
}

const getUserProfile = (): UserProfile => {
  try {
    const stored = localStorage.getItem("user");
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return {};
};

const ALL_INTERESTS = [
  "Islamic Talks",
  "Sports",
  "Socials",
  "Charity",
  "Workshops",
  "Tech",
  "Networking",
  "Public Speaking",
];


const INTEREST_API_TO_DISPLAY: Record<string, string> = {
  islamic_talks: "Islamic Talks",
  sports: "Sports",
  socials: "Socials",
  charity: "Charity",
  workshops: "Workshops",
  tech: "Tech",
  networking: "Networking",
  public_speaking: "Public Speaking",
};


const INTEREST_DISPLAY_TO_API: Record<string, string> = {
  "Islamic Talks": "islamic_talks",
  Sports: "sports",
  Socials: "socials",
  Charity: "charity",
  Workshops: "workshops",
  Tech: "tech",
  Networking: "networking",
  "Public Speaking": "public_speaking",
};

const GENDER_OPTIONS = ["Brother", "Sister", "Prefer not to say"];

const EditProfilePage = () => {
  const navigate = useNavigate();
  const profile = getUserProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState("public");
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [interests, setInterests] = useState<string[]>([]);
  const [gender, setGender] = useState("Brother");
  const [notifications, setNotifications] = useState({
    eventReminders: true,
    marketingEmails: false,
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(profile?.avatar_url || null);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await attendeeProfileApi.get();
        if (res.ok && res.data) {
          const data = res.data as any;
          const { user, profile: profileData } = data;
          setFullName(user?.full_name || "");
          setEmail(user?.email || "");
          setAvatarUrl(user?.avatar_url || null);
          setPreviewUrl(user?.avatar_url || null);
          setBio(profileData?.bio || "");

          const apiInterests = profileData?.interests || [];
          const normalizedInterests: string[] = Array.from(
            new Set<string>(
              apiInterests
                .map((interest: string) => INTEREST_API_TO_DISPLAY[interest] || interest)
                .filter((interest: string) => ALL_INTERESTS.includes(interest))
            )
          );
          setInterests(normalizedInterests);
          setGender(
            profileData?.gender === "brother"
              ? "Brother"
              : profileData?.gender === "sister"
              ? "Sister"
              : "Prefer not to say"
          );
          setNotifications({
            eventReminders: profileData?.event_reminders ?? true,
            marketingEmails: profileData?.marketing_emails ?? false,
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const userInitial =
    profile?.full_name?.charAt(0).toUpperCase() ||
    profile?.username?.charAt(0).toUpperCase() ||
    "Z";

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Profile picture must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePicture = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {


      const apiInterests: string[] = Array.from(
        new Set<string>(
          interests
            .map((interest) => INTEREST_DISPLAY_TO_API[interest] || interest)
            .filter((interest) => interest.length > 0)
        )
      );

      const payload = {
        full_name: fullName,
        bio,
        interests: apiInterests,
        gender: (
          gender === "Brother"
            ? "brother"
            : gender === "Sister"
            ? "sister"
            : "prefer_not_to_say"
        ) as "brother" | "sister" | "prefer_not_to_say",
        event_reminders: notifications.eventReminders,
        marketing_emails: notifications.marketingEmails,
        profile_picture: selectedFile,
      };

      const res = await attendeeProfileApi.update(payload);

      if (res.ok) {

        const data = res.data as any;
        const updatedUser = {
          ...profile,
          full_name: data?.user?.full_name || fullName,
          email: data?.user?.email || email,
          avatar_url: data?.user?.avatar_url || previewUrl || profile?.avatar_url,
          bio: data?.profile?.bio || bio,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Profile updated successfully!");
        navigate("/home/profile");
      } else {
        const detail = (res as any).detail || "";
        toast.error(detail || "Failed to update profile");
      }
    } catch {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "public", label: "Public Profile", icon: User },
    { id: "settings", label: "Settings & Account Control", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="w-full py-6">

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-secondary hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Profile
      </button>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="space-y-6">

          <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6 text-center">

            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="w-24 h-24 rounded-full bg-secondary/10 overflow-hidden flex items-center justify-center border-2 border-primary/30">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-primary text-3xl font-bold">{userInitial}</span>
                )}
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center border-2 border-[#131418] hover:bg-primary/90 transition-colors"
                title="Change profile picture"
              >
                <Camera size={12} className="text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
            </div>

            {selectedFile && (
              <button
                onClick={removeProfilePicture}
                className="text-xs text-secondary hover:text-red-400 transition-colors mb-3"
              >
                Remove new picture
              </button>
            )}

            <h2 className="text-white text-lg font-bold">{fullName || "Zaid Ahmed"}</h2>
            <p className="text-secondary text-sm mt-0.5">Elite Community Member</p>


            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border border-primary/20">
                Active Member
              </span>
              <span className="bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border border-secondary/20">
                MSQ Premium
              </span>
            </div>
          </div>


          <div className="bg-[#131418] border border-secondary/10 rounded-xl p-3 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-secondary hover:text-white hover:bg-secondary/5"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-primary" : "text-secondary"} />
                  {tab.label}
                  {isActive && (
                    <div className="ml-auto w-1 h-5 bg-primary rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>


        <div className="lg:col-span-2">
          {activeTab === "public" && (
            <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6 md:p-8">

              <h1 className="text-xl font-bold text-white mb-1">Edit Profile</h1>
              <p className="text-secondary text-sm mb-8">
                Manage your public information and how other members see you.
              </p>


              <div className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.15em] font-semibold text-secondary block mb-2">
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
                    <label className="text-[10px] uppercase tracking-[0.15em] font-semibold text-secondary block mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full bg-[#0d0e12]/50 border border-[#292a2b] rounded-lg px-4 py-2.5 text-secondary/50 text-sm outline-none cursor-not-allowed"
                    />
                  </div>
                </div>


                <div>
                  <label className="text-[10px] uppercase tracking-[0.15em] font-semibold text-secondary block mb-2">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full bg-[#0d0e12] border border-[#292a2b] rounded-lg px-4 py-3 text-white text-sm outline-none placeholder:text-gray-500 focus:border-primary/50 transition-colors resize-none"
                  />
                </div>


                <div>
                  <label className="text-[10px] uppercase tracking-[0.15em] font-semibold text-secondary block mb-3">
                    Interests
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_INTERESTS.map((interest) => {
                      const isSelected = interests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                            isSelected
                              ? "bg-primary/10 text-primary border-primary/30"
                              : "bg-secondary/5 text-secondary border-secondary/10 hover:border-secondary/30"
                          }`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.15em] font-semibold text-secondary block mb-3">
                      Gender Preference
                    </label>
                    <div className="space-y-3">
                      {GENDER_OPTIONS.map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <div className="relative flex items-center">
                            <input
                              type="radio"
                              name="gender"
                              value={option}
                              checked={gender === option}
                              onChange={() => setGender(option)}
                              className="sr-only"
                            />
                            <div
                              className={`w-5 h-5 rounded-full border-2 transition-colors flex items-center justify-center ${
                                gender === option
                                  ? "border-primary"
                                  : "border-secondary/30"
                              }`}
                            >
                              {gender === option && (
                                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                              )}
                            </div>
                          </div>
                          <span className="text-secondary text-sm group-hover:text-white transition-colors">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>


                  <div>
                    <label className="text-[10px] uppercase tracking-[0.15em] font-semibold text-secondary block mb-3">
                      Notifications
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-secondary text-sm">Event Reminders</span>
                        <button
                          onClick={() =>
                            setNotifications((n) => ({
                              ...n,
                              eventReminders: !n.eventReminders,
                            }))
                          }
                          className={`relative w-11 h-6 rounded-full transition-colors ${
                            notifications.eventReminders ? "bg-primary" : "bg-secondary/20"
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                              notifications.eventReminders
                                ? "translate-x-5.5"
                                : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-secondary text-sm">Marketing Emails</span>
                        <button
                          onClick={() =>
                            setNotifications((n) => ({
                              ...n,
                              marketingEmails: !n.marketingEmails,
                            }))
                          }
                          className={`relative w-11 h-6 rounded-full transition-colors ${
                            notifications.marketingEmails ? "bg-primary" : "bg-secondary/20"
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                              notifications.marketingEmails
                                ? "translate-x-5.5"
                                : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>


                <div className="border-t border-secondary/10 pt-6 flex items-center justify-end gap-3">
                  <button
                    onClick={() => navigate("/home/profile")}
                    className="px-6 py-2.5 text-secondary hover:text-white text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-8 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6 md:p-8 text-center py-20">
              <Shield size={32} className="text-secondary/30 mx-auto mb-3" />
              <h3 className="text-white text-lg font-semibold mb-2">Settings & Account Control</h3>
              <p className="text-secondary text-sm mb-4">Manage security, privacy and account settings.</p>
              <button
                onClick={() => navigate("/home/profile/settings")}
                className="text-sm text-primary border border-primary/30 hover:bg-primary/10 rounded-full px-5 py-2 transition-colors"
              >
                Open Settings
              </button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-[#131418] border border-secondary/10 rounded-xl p-6 md:p-8 text-center py-20">
              <Bell size={32} className="text-secondary/30 mx-auto mb-3" />
              <h3 className="text-white text-lg font-semibold mb-2">Notification Preferences</h3>
              <p className="text-secondary text-sm mb-4">Control push, email and SMS notifications.</p>
              <button
                onClick={() => navigate("/home/profile/settings#notifications")}
                className="text-sm text-primary border border-primary/30 hover:bg-primary/10 rounded-full px-5 py-2 transition-colors"
              >
                Go to Notifications
              </button>
            </div>
          )}


          <div className="bg-[#131418] border border-secondary/10 rounded-xl p-5 mt-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Target size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Premium Loyalty</h3>
                <p className="text-secondary text-sm">Member since October 2023</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary text-[10px] font-bold uppercase tracking-wider">
                Active Now
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
