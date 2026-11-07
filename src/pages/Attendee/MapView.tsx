import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, MapPin, Search, ChevronRight } from "lucide-react";
import * as maplibregl from "maplibre-gl";
import { setWorkerUrl } from "maplibre-gl";
import type { Map as MapLibreMap, Marker } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";
import { attendeeEventsApi, AttendeeEvent } from "../../services/attendee_events.service";
import { attendeeProfileApi } from "../../services/attendee_profile.service";

const WORLD_CENTER: [number, number] = [0, 0];
const DEFAULT_RADIUS_METERS = 50000;
const PAGE_SIZE = 12;

setWorkerUrl(workerUrl);

const eventDateLabel = (event: AttendeeEvent) => {
  const date = new Date(`${event.event_date}T${event.start_time}`);
  return `${date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} · ${event.start_time.slice(0, 5)}`;
};

function markerGlyph(category = "") {
  const value = category.toLowerCase();
  if (value.includes("food") || value.includes("dinner") || value.includes("social")) return "✦";
  if (value.includes("sport")) return "◆";
  if (value.includes("charity")) return "♥";
  if (value.includes("network")) return "◎";
  if (value.includes("islam") || value.includes("talk") || value.includes("lecture")) return "☾";
  if (value.includes("workshop") || value.includes("education") || value.includes("youth")) return "⌂";
  return "•";
}

const MapView = () => {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);
  const markers = useRef<Marker[]>([]);
  const fitEventsOnNextResults = useRef(true);

  const [center, setCenter] = useState<[number, number] | null>(null);
  const [profileLocationLoaded, setProfileLocationLoaded] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapLoadError, setMapLoadError] = useState<string | null>(null);
  const [events, setEvents] = useState<AttendeeEvent[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [radius, setRadius] = useState(DEFAULT_RADIUS_METERS);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{ formatted: string; lat: number; lon: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const geoapifyKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

  useEffect(() => {
    let active = true;
    attendeeProfileApi.get().then((response) => {
      if (!active) return;
      const profile = response.data?.profile;
      if (profile?.city && !/^lat:\s*-?\d+(?:\.\d+)?\s*,?\s*lng:/i.test(profile.city)) {
        setQuery(`${profile.city}${profile.country ? `, ${profile.country}` : ""}`);
      }
      const lat = Number(profile?.latitude);
      const lon = Number(profile?.longitude);
      if (
        profile?.latitude != null && profile.longitude != null &&
        Number.isFinite(lat) && lat >= -90 && lat <= 90 &&
        Number.isFinite(lon) && lon >= -180 && lon <= 180
      ) {
        setCenter([lon, lat]);
      }
    }).catch(() => undefined).finally(() => {
      if (active) setProfileLocationLoaded(true);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    // Wait for the saved location so MapLibre does not start fetching tiles at
    // [0, 0] only to cancel them as soon as the profile request completes.
    if (!profileLocationLoaded || !mapContainer.current) return;
    const instance = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/dark",
      center: center || WORLD_CENTER,
      zoom: center ? 11 : 1.5,
      attributionControl: true,
    });
    // The OpenFreeMap dark style currently references two sprites that are not
    // present in its published sprite sheet. Supply small local fallbacks so
    // those layers do not emit style-image errors or disappear.
    instance.setMissingStyleImageResolver((id) => {
      if (id !== "wood-pattern" && id !== "circle-11") return;

      const size = id === "wood-pattern" ? 16 : 11;
      const data = new Uint8Array(size * size * 4);
      for (let y = 0; y < size; y += 1) {
        for (let x = 0; x < size; x += 1) {
          const offset = (y * size + x) * 4;
          if (id === "wood-pattern") {
            const stripe = (x + y) % 7 < 2;
            data[offset] = stripe ? 57 : 43;
            data[offset + 1] = stripe ? 63 : 49;
            data[offset + 2] = stripe ? 56 : 44;
            data[offset + 3] = 255;
          } else {
            const inside = (x - 5) ** 2 + (y - 5) ** 2 <= 25;
            if (inside) {
              data[offset] = 150;
              data[offset + 1] = 150;
              data[offset + 2] = 150;
              data[offset + 3] = 255;
            }
          }
        }
      }
      instance.addImage(id, { width: size, height: size, data });
    });
    instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-left");
    const loadTimeout = window.setTimeout(() => {
      if (!instance.isStyleLoaded()) setMapLoadError("The map is taking longer than expected to load.");
    }, 12000);
    instance.on("load", () => {
      window.clearTimeout(loadTimeout);
      setMapReady(true);
      setMapLoadError(null);
    });
    instance.on("error", (event) => {
      if (!instance.isStyleLoaded()) setMapLoadError(event.error?.message || "Could not load the map tiles.");
    });
    instance.on("click", (event) => {
      setPage(1);
      setSelected(null);
      setCenter([event.lngLat.lng, event.lngLat.lat]);
    });
    instance.on("dragend", () => {
      const point = instance.getCenter();
      setPage(1);
      setSelected(null);
      setCenter([point.lng, point.lat]);
    });
    map.current = instance;
    const resize = () => instance.resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mapContainer.current);
    const initialResizeFrame = window.requestAnimationFrame(resize);
    return () => {
      window.clearTimeout(loadTimeout);
      window.cancelAnimationFrame(initialResizeFrame);
      resizeObserver.disconnect();
      instance.remove();
      map.current = null;
      setMapReady(false);
    };
    // The map is created once after location loading; later state updates must
    // not destroy it. React StrictMode still performs its intentional one-time
    // development setup/cleanup check.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileLocationLoaded]);

  useEffect(() => {
    if (!center || !map.current) return;
    const current = map.current.getCenter();
    if (Math.abs(current.lng - center[0]) < 1e-7 && Math.abs(current.lat - center[1]) < 1e-7) return;
    map.current.flyTo({ center, zoom: 11, duration: 600 });
  }, [center]);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      if (!geoapifyKey || query.trim().length < 3) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&limit=5&apiKey=${encodeURIComponent(geoapifyKey)}`
        );
        if (!response.ok) throw new Error("Autocomplete request failed");
        const json = await response.json();
        setSuggestions((json.features || []).map((feature: { properties: { formatted: string; lat: number; lon: number } }) => feature.properties));
      } catch {
        setSuggestions([]);
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [geoapifyKey, query]);

  useEffect(() => {
    let active = true;
    if (!center) {
      setLoading(false);
      setEvents([]);
      setTotalEvents(0);
      setPages(1);
      return () => { active = false; };
    }

    if (page === 1) {
      setEvents([]);
      setTotalEvents(0);
      setSelected(null);
    }
    setLoading(true);
    setError(null);
    attendeeEventsApi.getNearby({
      lat: center[1],
      lon: center[0],
      radius_m: radius,
      page,
      limit: PAGE_SIZE,
    }).then((response) => {
      if (!active) return;
      if (!response.ok) {
        setError(response.detail || "Could not load nearby events.");
        if (page === 1) setEvents([]);
        return;
      }
      const resultPage = (response.data || []) as AttendeeEvent[];
      if (page === 1) fitEventsOnNextResults.current = true;
      setEvents((current) => page === 1
        ? resultPage
        : [...current, ...resultPage.filter((event) => !current.some((loaded) => loaded.id === event.id))]);
      const pagination = response.pagination as { total?: number; total_pages?: number } | undefined;
      setTotalEvents(pagination?.total || 0);
      setPages(pagination?.total_pages || 1);
    }).catch(() => {
      if (active) {
        setError("Could not load nearby events.");
        if (page === 1) setEvents([]);
      }
    }).finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [center, page, radius]);

  useEffect(() => {
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];
    if (!mapReady || !map.current) return;

    if (fitEventsOnNextResults.current && center && events.length > 0) {
      const coordinates: Array<[number, number]> = [center];
      for (const event of events) {
        const latitude = Number(event.latitude);
        const longitude = Number(event.longitude);
        if (
          Number.isFinite(latitude) && latitude >= -90 && latitude <= 90 &&
          Number.isFinite(longitude) && longitude >= -180 && longitude <= 180
        ) {
          coordinates.push([longitude, latitude]);
        }
      }

      if (coordinates.length > 1) {
        const bounds = new maplibregl.LngLatBounds();
        coordinates.forEach((coordinate) => bounds.extend(coordinate));
        map.current.fitBounds(bounds, {
          padding: 64,
          maxZoom: 11,
          duration: 700,
        });
      }
      fitEventsOnNextResults.current = false;
    }

    markers.current = events.flatMap((event) => {
      const latitude = Number(event.latitude);
      const longitude = Number(event.longitude);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return [];

      const element = document.createElement("button");
      element.type = "button";
      element.setAttribute("aria-label", `${event.title}, ${event.category}`);
      element.title = event.title;
      element.textContent = markerGlyph(event.category);
      element.className = `grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-[#ed1025] text-lg font-semibold leading-none text-white shadow-[0_0_0_7px_rgba(239,16,37,.2),0_5px_16px_rgba(0,0,0,.6)] transition-transform hover:scale-110 ${selected === event.id ? "scale-125" : ""}`;
      element.onclick = () => {
        setSelected(event.id);
        document.getElementById(`nearby-event-${event.id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      };

      return [new maplibregl.Marker({ element, anchor: "center" })
        .setLngLat([longitude, latitude])
        .addTo(map.current!)];
    });

    return () => {
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];
    };
  }, [events, mapReady, selected]);

  const chooseSuggestion = (suggestion: typeof suggestions[number]) => {
    setCenter([suggestion.lon, suggestion.lat]);
    setQuery(suggestion.formatted);
    setSuggestions([]);
    setPage(1);
  };

  const shownCount = events.length;
  const radiusKm = radius / 1000;

  return (
    <div className="relative flex h-[calc(100vh-140px)] min-h-[560px] overflow-hidden app-container-breakout bg-[#090a0d]">
      <div className="relative min-w-0 flex-1 bg-[#090a0d]">
        <div ref={mapContainer} className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10" />

        <div className="absolute left-4 top-4 z-10 w-[min(390px,calc(100%-2rem))]">
          <div className="relative pointer-events-auto">
            <Search size={16} className="absolute left-3 top-3.5 text-secondary" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search an area or address"
              className="w-full rounded-xl border border-white/10 bg-[#111216]/95 py-3 pl-10 pr-4 text-sm text-white outline-none shadow-xl backdrop-blur focus:border-red-500/50"
            />
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 overflow-hidden rounded-xl border border-white/10 bg-[#15161a] shadow-2xl">
                {suggestions.map((suggestion) => (
                  <button
                    type="button"
                    key={suggestion.formatted}
                    onClick={() => chooseSuggestion(suggestion)}
                    className="block w-full px-3 py-2.5 text-left text-sm text-gray-200 hover:bg-white/10"
                  >
                    {suggestion.formatted}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {!mapReady && (
          <div className="pointer-events-none absolute inset-0 z-[1] grid place-items-center bg-[#090a0d]/70">
            <div className="rounded-xl border border-white/10 bg-[#111216]/90 px-4 py-3 text-sm text-gray-300 shadow-xl">
              {mapLoadError || "Loading dark map…"}
            </div>
          </div>
        )}
      </div>

      <aside className="z-10 flex w-[min(360px,42vw)] min-w-[310px] flex-col overflow-hidden border-l border-white/[0.07] bg-[#101115]/95 shadow-2xl backdrop-blur-xl">
        <div className="border-b border-white/[0.07] px-5 py-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-white">In this area</h2>
              <p className="mt-1 max-w-[220px] truncate text-xs text-[#c8a8a8]">
                {query || (center ? "Selected map location" : "Choose a location")}
              </p>
            </div>
            <span className="rounded-md bg-red-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-300">
              {totalEvents || shownCount} {totalEvents === 1 || shownCount === 1 ? "event" : "events"}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-[11px] text-secondary">Within {radiusKm} km</span>
            <select
              value={radius}
              onChange={(event) => { setRadius(Number(event.target.value)); setPage(1); }}
              aria-label="Search radius"
              className="rounded-lg border border-white/10 bg-[#17181d] px-2.5 py-1.5 text-xs text-gray-200 outline-none focus:border-red-500/50"
            >
              <option value={25000}>25 km</option>
              <option value={50000}>50 km</option>
              <option value={100000}>100 km</option>
              <option value={200000}>200 km</option>
            </select>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-3.5">
          {loading && !events.length && (
            <p className="py-10 text-center text-sm text-secondary">Loading nearby events…</p>
          )}
          {!loading && error && (
            <p className="py-10 text-center text-sm text-red-300">{error}</p>
          )}
          {!loading && !error && !center && (
            <p className="py-10 text-center text-sm text-secondary">Search for a place or click the map to choose a center.</p>
          )}
          {!loading && !error && center && !events.length && (
            <p className="py-10 text-center text-sm text-secondary">No events found within {radiusKm} km.</p>
          )}

          {events.map((event) => {
            const imageUrl = event.image_url || event.hero_image || event.gallery?.find((image) => image.is_hero)?.image_url || "/events.svg";
            return (
              <button
                type="button"
                id={`nearby-event-${event.id}`}
                key={event.id}
                onClick={() => { setSelected(event.id); navigate(`/home/events/${event.id}`); }}
                className={`w-full rounded-xl border p-3 text-left transition ${selected === event.id ? "border-red-500/60 bg-red-500/[0.08]" : "border-white/[0.07] bg-[#191a1f] hover:border-white/15 hover:bg-[#1e1f25]"}`}
              >
                <div className="flex gap-3">
                  <img
                    src={imageUrl}
                    alt={event.title}
                    onError={(errorEvent) => { errorEvent.currentTarget.onerror = null; errorEvent.currentTarget.src = "/events.svg"; }}
                    className="h-[58px] w-[58px] shrink-0 rounded-lg border border-white/[0.06] bg-[#25262b] object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-[13px] font-medium leading-5 text-gray-100">{event.title}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-[10px] text-[#c8a8a8]">
                      <Clock size={11} />
                      <span>{eventDateLabel(event)} · {event.timezone}</span>
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 truncate text-[10px] text-secondary">
                      <MapPin size={11} />
                      <span>{event.venue_name || event.street_address || "Venue details unavailable"}</span>
                    </p>
                    <p className="mt-1 text-[10px] font-medium text-red-300">
                      {event.category}{event.distance_m != null ? ` · ${(event.distance_m / 1000).toFixed(1)} km` : ""}
                    </p>
                  </div>
                  <ChevronRight size={14} className="mt-1 shrink-0 text-secondary/40" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="border-t border-white/[0.07] bg-[#17171b] p-3">
          {loading && events.length > 0 ? (
            <p className="py-1 text-center text-xs text-secondary">Loading more events…</p>
          ) : page < pages ? (
            <button
              type="button"
              onClick={() => setPage((current) => current + 1)}
              className="w-full rounded-lg py-2 text-xs font-semibold text-[#e9b5b5] transition hover:bg-white/[0.04] hover:text-white"
            >
              Load more events
            </button>
          ) : (
            <p className="py-2 text-center text-[10px] text-secondary/60">
              © OpenStreetMap contributors · OpenFreeMap
            </p>
          )}
        </div>
      </aside>

      <style>{`
        .maplibregl-ctrl-bottom-left { left: 18px; bottom: 18px; }
        .maplibregl-ctrl-group { overflow: hidden; border: 1px solid rgba(255,255,255,.12) !important; border-radius: 14px !important; background: rgba(17,18,22,.92) !important; box-shadow: 0 8px 28px rgba(0,0,0,.35) !important; }
        .maplibregl-ctrl-group button { width: 42px !important; height: 42px !important; background-color: transparent !important; }
        .maplibregl-ctrl-group button:hover { background-color: rgba(255,255,255,.08) !important; }
        .maplibregl-ctrl-group .maplibregl-ctrl-icon { filter: invert(1); }
        .maplibregl-ctrl-group button + button { border-top-color: rgba(255,255,255,.1) !important; }
        .maplibregl-ctrl-attrib { color: #d1d5db !important; background: rgba(17,18,22,.75) !important; }
        .maplibregl-ctrl-attrib a { color: #e5b7b7 !important; }
      `}</style>
    </div>
  );
};

export default MapView;
