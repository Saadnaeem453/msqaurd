import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  Zap,
  MapPin,
  Clock,
  ChevronRight,
  Share2,
  Edit3,
  MessageSquare,
  UserPlus,
  Ticket,
  Award,
  Star,
  CheckCircle2,
  Activity as ActivityIcon,
  X,
} from "lucide-react";
import { attendeeProfileApi } from "../../services/attendee_profile.service";
import { activityApi, Activity } from "../../services/activity_service";

interface UserProfile {
  full_name?: string;
  username?: string;
  avatar_url?: string;
  email?: string;
  bio?: string;
}

const getUserProfile = (): UserProfile | null => {
  try {
    const stored = localStorage.getItem("user");
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return null;
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const profile = getUserProfile();

  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [isPremium] = useState(true);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<Activity[]>([]);
  const [historyCursor, setHistoryCursor] = useState<string | undefined>();
  const [historyHasMore, setHistoryHasMore] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(false);

  const loadRecentActivity = useCallback(async () => {
    setActivityLoading(true);
    setActivityError(false);
    const response = await activityApi.getRecent();
    if (response.ok) {
      const activities = Array.isArray(response.data) ? response.data : response.data?.activities || [];
      setRecentActivity(activities);
    } else {
      setActivityError(true);
    }
    setActivityLoading(false);
  }, []);

  const loadHistory = useCallback(async (cursor?: string) => {
    if (historyLoading) return;
    setHistoryLoading(true);
    setHistoryError(false);
    const page = await activityApi.getHistory(cursor);
    if (!page.ok) {
      setHistoryError(true);
      setHistoryLoading(false);
      return;
    }
    setHistory((current) => {
      const existing = new Set(current.map((item) => item.id));
      return cursor ? [...current, ...page.activities.filter((item) => !existing.has(item.id))] : page.activities;
    });
    setHistoryCursor(page.pagination.next_cursor || undefined);
    setHistoryHasMore(page.pagination.has_more);
    setHistoryError(false);
    setHistoryLoading(false);
  }, [historyLoading]);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await attendeeProfileApi.get();
        if (res.ok && res.data) {
          const data = res.data as any;
          const { user, profile: profileData } = data;
          setProfileData({
            full_name: user?.full_name || profile?.full_name || "",
            avatar_url: user?.avatar_url || profile?.avatar_url,
            bio: profileData?.bio || profile?.bio || "",
          });
          setInterests(profileData?.interests || []);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    void loadRecentActivity();
  }, [loadRecentActivity]);

  const userInitial =
    profileData?.full_name?.charAt(0).toUpperCase() ||
    profile?.full_name?.charAt(0).toUpperCase() ||
    profile?.username?.charAt(0).toUpperCase() ||
    "U";

  const achievements = [
    {
      icon: Award,
      title: "Early Adopter",
      tier: "TIER 1",
      color: "bg-primary",
    },
    {
      icon: Star,
      title: "Top Contributor",
      tier: "TIER 2",
      color: "bg-secondary",
    },
  ];

  const relativeTime = (value: string) => {
    const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
    if (seconds < 60) return "Just now";
    const units = [[60, "minute"], [60, "hour"], [24, "day"], [7, "week"], [4.345, "month"], [12, "year"]] as const;
    let amount = seconds;
    let unit = "second";
    for (const [size, name] of units) {
      if (amount < size) { unit = name; break; }
      amount = Math.floor(amount / size);
    }
    return `${amount} ${unit}${amount === 1 ? "" : "s"} ago`;
  };

  const activityIcon = (type: string) => {
    const normalized = type.toLowerCase();
    if (normalized.includes("message") || normalized.includes("post")) return MessageSquare;
    if (normalized.includes("connect") || normalized.includes("follow")) return UserPlus;
    if (normalized.includes("ticket") || normalized.includes("book")) return Ticket;
    return ActivityIcon;
  };

  const renderActivity = (activity: Activity) => {
    const Icon = activityIcon(activity.activity_type);
    return <div key={activity.id} className="flex gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary/5 border border-secondary/10 flex items-center justify-center"><Icon size={14} className="text-secondary" /></div>
      <div className="flex-1 min-w-0"><p className="text-secondary text-sm">{activity.title}</p>{activity.description && <p className="text-secondary/60 text-xs mt-1">{activity.description}</p>}<p className="text-secondary/40 text-xs mt-0.5">{relativeTime(activity.created_at)}</p></div>
    </div>;
  };

  return (
    <div className="w-full py-24">

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">

        <div className="flex items-start gap-5">

          <div className="relative">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-secondary/10 overflow-hidden flex items-center justify-center">
              {profileData?.avatar_url ? (
                <img
                  src={profileData.avatar_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-primary text-3xl font-bold">{userInitial}</span>
              )}
            </div>
            {isPremium && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-[#0a0b0e]">
                <CheckCircle2 size={14} className="text-gray-200" />
              </div>
            )}
          </div>


          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-jakarta md:text-3xl font-bold text-gray-200">
                {profileData?.full_name || profile?.full_name || "Hassan Ahmed"}
              </h1>
              {isPremium && (
                <span className="bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                  Premium Discovery
                </span>
              )}
            </div>
            <p className="text-secondary text-sm leading-relaxed max-w-lg">
              {profileData?.bio ||
                profile?.bio ||
                "Community Lead · Tech Enthusiast · Shaping the future of elite networking and student mobilization."}
            </p>
          </div>
        </div>


        <div className="flex items-center gap-3 md:mt-2">
          <button
            onClick={() => navigate("/home/profile/edit")}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-gray-200 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <Edit3 size={14} />
            Edit Hub
          </button>
          <button className="p-2.5 border border-secondary/20 text-secondary hover:text-gray-200 hover:border-secondary/40 rounded-lg transition-colors">
            <Share2 size={16} />
          </button>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-1 space-y-6">

          <div className="bg-gradient-to-br from-[#191a1e] to-[#0e0f14] border border-secondary/10 rounded-xl px-5 py-8">
            <h3 className="text-[10px] uppercase tracking-[0.15em] font-normal text-primary mb-4">
              Identity Metrics
            </h3>
            <div className="space-y-4 font-thin">
              <div className="flex items-center  justify-between">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-secondary" />
                  <span className="text-gray-200 text-sm">Events Attended</span>
                </div>
                <span className="text-primary text-lg font-semibold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users size={16} className="text-secondary" />
                  <span className="text-gray-200 text-sm">Communities Joined</span>
                </div>
                <span className="text-gray-200 text-lg font-semibold">05</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap size={16} className="text-secondary" />
                  <span className="text-gray-200 text-sm">Impact Points</span>
                </div>
                <span className="text-primary text-lg font-semibold">2.4k</span>
              </div>
            </div>
          </div>


          <div className="bg-gradient-to-br from-[#191a1e] to-[#0e0f14] border border-secondary/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[12px] uppercase tracking-[0.15em] font-normal text-secondary">
                Core Interests
              </h3>
              <button className="text-secondary hover:text-gray-200 transition-colors">
                <Edit3 size={12} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {interests.map((interest) => (
                <span
                  key={interest}
                  className={`${
                    interest === "Islamic Talks"
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-secondary/5 text-secondary border-secondary/10"
                  } border text-xs font-medium px-3 py-1.5 rounded-lg`}
                >
                  {interest}
                </span>
              ))}
            </div>
            <button className="w-full bg-primary hover:bg-primary/90 text-gray-200 text-sm font-medium py-2.5 rounded-lg transition-colors">
              Personalized Recommendations
            </button>
          </div>


          <div className="bg-gradient-to-br from-[#191a1e] to-[#0e0f14] border border-secondary/10 rounded-xl p-5">
            <h3 className="text-[10px] uppercase tracking-[0.15em] font-normal text-secondary mb-4">
              Achievements
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.title}
                    className="bg-secondary/5 border border-secondary/10 rounded-xl p-4 text-center"
                  >
                    <div
                      className={`w-12 h-12 rounded-full ${achievement.color} flex items-center justify-center mx-auto mb-3`}
                    >
                      <Icon size={20} className="text-gray-200" />
                    </div>
                    <p className="text-gray-200 text-sm font-medium mb-0.5">{achievement.title}</p>
                    <p className="text-secondary/50 text-[10px] uppercase tracking-wider">
                      {achievement.tier}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>


        <div className="lg:col-span-2 space-y-6">

          <div className="relative bg-gradient-to-br from-[#191a1e] to-[#0e0f14] border border-secondary/10 rounded-xl p-5 overflow-hidden">

            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-600/20 via-red-600/5 to-transparent rounded-bl-full" />
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[12px] uppercase tracking-[0.15em] font-normal text-primary">
                Next Event
              </span>
            </div>
            <div className="flex items-start justify-between gap-4 relative z-10">
              <div className="flex-1">
                <h3 className="text-gray-200 font-jakarta text-lg font-semibold mb-3">
                  Global Islamic Leadership Summit 2024
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-secondary mb-4">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-primary" />
                    London Convention Centre
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-primary" />
                    09:00 AM – 06:00 PM
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-7 h-7 rounded-full bg-secondary/20 border-2 border-[#131418] flex items-center justify-center"
                      >
                        <span className="text-[10px] text-secondary">U{i}</span>
                      </div>
                    ))}
                  </div>
                  <span className="text-secondary text-xs">+48</span>
                </div>
              </div>

              <div className="flex-shrink-0 text-center">
                <div className="bg-primary/10 border border-primary/20 rounded-xl px-3 py-2">
                  <p className="text-primary text-2xl font-bold">24</p>
                  <p className="text-primary/60 text-[10px] uppercase tracking-wider">May</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end mt-4 pt-4 border-t border-secondary/10 relative z-10">
              <button className="flex items-center gap-1.5 text-primary text-sm font-medium hover:text-primary/80 transition-colors">
                View Digital Pass
                <ChevronRight size={14} />
              </button>
            </div>
          </div>


          <div className="bg-gradient-to-br from-[#191a1e] to-[#0e0f14] border border-secondary/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[10px] uppercase tracking-[0.15em] font-semibold text-secondary">
                Recent Activity
              </h3>
              <button onClick={() => { setShowHistory(true); if (!history.length) void loadHistory(); }} className="text-primary text-xs font-medium hover:text-primary/80 transition-colors">
                View All
              </button>
            </div>
            <div className="space-y-5">
              {activityLoading ? <p className="text-secondary text-sm">Loading activity...</p> : activityError ? <div className="flex items-center justify-between gap-3"><p className="text-secondary text-sm">Unable to load activity.</p><button onClick={() => void loadRecentActivity()} className="text-primary text-xs">Retry</button></div> : recentActivity.length ? recentActivity.map(renderActivity) : <p className="text-secondary text-sm">No recent activity yet.</p>}
            </div>
          </div>
        </div>
      </div>
      {showHistory && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-label="Activity history">
        <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl border border-secondary/10 bg-[#131418] p-5"><div className="flex items-center justify-between mb-5"><h2 className="text-sm uppercase tracking-[0.15em] text-secondary">Activity History</h2><button onClick={() => setShowHistory(false)} aria-label="Close activity history"><X size={18} /></button></div><div className="space-y-5">{history.map(renderActivity)}{historyLoading && <p className="text-secondary text-sm">Loading...</p>}{historyError && <div className="flex items-center justify-between gap-3"><p className="text-secondary text-sm">Unable to load activity history.</p><button onClick={() => void loadHistory(historyCursor)} className="text-primary text-xs">Retry</button></div>}{!historyLoading && !historyError && !history.length && <p className="text-secondary text-sm">No activity history yet.</p>}{historyHasMore && <button disabled={historyLoading} onClick={() => void loadHistory(historyCursor)} className="w-full rounded-lg border border-secondary/10 py-2 text-sm text-primary disabled:opacity-50">Load more</button>}</div></div>
      </div>}
    </div>
  );
};

export default ProfilePage;
