import { useState, useEffect } from "react";
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
} from "lucide-react";
import { attendeeProfileApi } from "../../services/attendee_profile.service";

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

  const recentActivity = [
    {
      icon: MessageSquare,
      text: (
        <>
          You posted a new insight in{" "}
          <span className="text-primary">Tech & Faith Hub</span>
        </>
      ),
      time: "2 hours ago",
      quote: "The intersection of ethical AI and community values is the next frontier...",
    },
    {
      icon: UserPlus,
      text: (
        <>
          Connected with <span className="text-white">Zaid Malik</span> and 4 others
        </>
      ),
      time: "Yesterday",
    },
    {
      icon: Ticket,
      text: (
        <>
          Booked a ticket for{" "}
          <span className="text-primary">Networking Iftar 2024</span>
        </>
      ),
      time: "3 days ago",
    },
  ];

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
                <CheckCircle2 size={14} className="text-white" />
              </div>
            )}
          </div>


          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-jakarta md:text-3xl font-bold text-white">
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
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <Edit3 size={14} />
            Edit Hub
          </button>
          <button className="p-2.5 border border-secondary/20 text-secondary hover:text-white hover:border-secondary/40 rounded-lg transition-colors">
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
                  <span className="text-white text-sm">Events Attended</span>
                </div>
                <span className="text-primary text-lg font-semibold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users size={16} className="text-secondary" />
                  <span className="text-white text-sm">Communities Joined</span>
                </div>
                <span className="text-white text-lg font-semibold">05</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap size={16} className="text-secondary" />
                  <span className="text-white text-sm">Impact Points</span>
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
              <button className="text-secondary hover:text-white transition-colors">
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
            <button className="w-full bg-primary hover:bg-primary/90 text-white text-sm font-medium py-2.5 rounded-lg transition-colors">
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
                      <Icon size={20} className="text-white" />
                    </div>
                    <p className="text-white text-sm font-medium mb-0.5">{achievement.title}</p>
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
                <h3 className="text-white font-jakarta text-lg font-semibold mb-3">
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
              <button className="text-primary text-xs font-medium hover:text-primary/80 transition-colors">
                View All
              </button>
            </div>
            <div className="space-y-5">
              {recentActivity.map((activity, idx) => {
                const Icon = activity.icon;
                return (
                  <div key={idx} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary/5 border border-secondary/10 flex items-center justify-center">
                      <Icon size={14} className="text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-secondary text-sm">{activity.text}</p>
                      <p className="text-secondary/40 text-xs mt-0.5">{activity.time}</p>
                      {activity.quote && (
                        <div className="mt-2 bg-secondary/5 border border-secondary/10 rounded-lg p-3">
                          <p className="text-secondary/60 text-xs italic">{activity.quote}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
