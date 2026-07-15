/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Pet, TripRecommendation, SavedTrip, AccommodationCheckResult } from "./types";
import PetInput from "./components/PetInput";
import SavedTripsList from "./components/SavedTripsList";
import LodgingCard from "./components/LodgingCard";
import DidYouKnow from "./components/DidYouKnow";
import TrustedCaretakersCard from "./components/TrustedCaretakersCard";
import CabifyMascotasCard from "./components/CabifyMascotasCard";
import { trackEvent } from "./utils/analytics";
import AdminStatsModal from "./components/AdminStatsModal";

const happyDogBanner = "/aukan_beach.jpg";
const puppyRoadTrip = "/emilia.jpg";
import { 
  Compass, 
  MapPin, 
  Users, 
  Sparkles, 
  History, 
  Heart, 
  Info, 
  Check, 
  Loader2, 
  ShieldAlert, 
  Briefcase, 
  Activity, 
  Coffee, 
  ChevronRight, 
  X,
  FileCheck2,
  RefreshCw,
  Baby,
  Search,
  Building2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  Mail,
  Send,
  PawPrint,
  Star,
  Instagram,
  Globe,
  MessageSquare,
  Share2
} from "lucide-react";

// Pre-defined popular provinces of Argentina (all 23 provinces are supported)
const ARG_PROVINCES = [
  { id: "Buenos Aires", name: "Buenos Aires (Provincia & CABA)", desc: "Playas caninas, estancias y parques grandes", bg: "from-amber-500 to-orange-600" },
  { id: "Córdoba", name: "Córdoba", desc: "Sierras, arroyos frescos y ríos cristalinos", bg: "from-emerald-500 to-teal-600" },
  { id: "Río Negro", name: "Río Negro (Bariloche / Las Grutas)", desc: "Lagos de pino, montañas y mar", bg: "from-sky-500 to-blue-600" },
  { id: "Mendoza", name: "Mendoza", desc: "Viñedos pet-friendly y cordillera de los Andes", bg: "from-indigo-500 to-purple-600" },
  { id: "Salta", name: "Salta", desc: "Valles Calchaquíes, peñas y viñedos de altura", bg: "from-orange-500 to-amber-600" },
  { id: "Misiones", name: "Misiones", desc: "Tierra colorada, Cataratas del Iguazú y selva", bg: "from-red-500 to-rose-600" },
  { id: "Tierra del Fuego", name: "Tierra del Fuego (Ushuaia)", desc: "Canal de Beagle, bosques y fin del mundo", bg: "from-slate-600 to-slate-800" },
  { id: "Catamarca", name: "Catamarca", desc: "Cerros rojizos, dunas gigantes y lagunas", bg: "from-amber-600 to-amber-755" },
  { id: "Chaco", name: "Chaco", desc: "Parque Nacional El Impenetrable y sabanas subtropicales", bg: "from-green-600 to-emerald-700" },
  { id: "Chubut", name: "Chubut", desc: "Avistamiento de ballenas, estepa galesa y lagos", bg: "from-blue-600 to-indigo-750" },
  { id: "Corrientes", name: "Corrientes", desc: "Esteros del Iberá y lagunas de agua dulce", bg: "from-teal-650 to-green-600" },
  { id: "Entre Ríos", name: "Entre Ríos", desc: "Termas flotantes, río Paraná y palmares", bg: "from-cyan-500 to-blue-600" },
  { id: "Formosa", name: "Formosa", desc: "Bañado La Estrella y humedales biodiversos", bg: "from-green-500 to-emerald-600" },
  { id: "Jujuy", name: "Jujuy", desc: "Cerros de siete colores y salinas grandiosas", bg: "from-orange-500 to-amber-650" },
  { id: "La Pampa", name: "La Pampa", desc: "Bosques de caldenes, lagunas quietas y asados", bg: "from-lime-600 to-green-600" },
  { id: "La Rioja", name: "La Rioja", desc: "Paredones colosales de Talampaya y viñedos", bg: "from-red-650 to-orange-700" },
  { id: "Neuquén", name: "Neuquén", desc: "Lagos andinos cristalinos, volcanes y araucarias", bg: "from-sky-550 to-indigo-600" },
  { id: "San Juan", name: "San Juan", desc: "Valle de la Luna e increíbles astroturismos", bg: "from-purple-500 to-indigo-700" },
  { id: "San Luis", name: "San Luis", desc: "Sierras de Comechingones y microclimas sanos", bg: "from-teal-600 to-blue-650" },
  { id: "Santa Cruz", name: "Santa Cruz", desc: "Glaciar Perito Moreno y trekking de El Chaltén", bg: "from-indigo-650 to-slate-800" },
  { id: "Santa Fe", name: "Santa Fe", desc: "Costaneras inmensas del Paraná e islas verdes", bg: "from-blue-500 to-cyan-600" },
  { id: "Santiago del Estero", name: "Santiago del Estero", desc: "Aguas termales del Río Hondo y folklore vivo", bg: "from-yellow-600 to-orange-650" },
  { id: "Tucumán", name: "Tucumán", desc: "Yungas verdes, cerros altos e historia nacional", bg: "from-emerald-650 to-violet-750" }
];

const PROVINCE_CITIES: Record<string, string[]> = {
  "Buenos Aires": [
    "Todas", 
    "San Pedro", 
    "San Miguel del Monte", 
    "Chascomús", 
    "Lobos", 
    "Tigre", 
    "Tandil", 
    "Mar del Plata", 
    "Pinamar", 
    "Cariló", 
    "Mar de las Pampas", 
    "Villa Gesell", 
    "Sierra de la Ventana", 
    "San Antonio de Areco", 
    "San Andrés de Giles", 
    "San Isidro", 
    "Palermo", 
    "Recoleta", 
    "Puerto Madero", 
    "La Plata", 
    "Campana", 
    "Mercedes", 
    "Balcarce", 
    "Necochea", 
    "Miramar", 
    "Bahía Blanca"
  ],
  "Córdoba": ["Todas", "Córdoba Capital", "Villa Carlos Paz", "La Cumbrecita", "La Cumbre", "Villa General Belgrano"],
  "Río Negro": ["Todas", "Bariloche", "Las Grutas"],
  "Mendoza": ["Todas", "Mendoza Capital", "Luján de Cuyo", "Agrelo", "San Rafael"],
  "Salta": ["Todas", "Salta Capital", "La Merced", "San Lorenzo"],
  "Misiones": ["Todas", "Puerto Iguazú", "Posadas"],
  "Tierra del Fuego": ["Todas", "Ushuaia"],
  "Jujuy": ["Todas", "Huacalera", "Purmamarca", "Tilcara"],
};

const STAY_TYPES = [
  { id: "cualquiera", name: "Cualquiera", desc: "La mejor opción para mis amigos", label: "Cualquiera 🌟" },
  { id: "estancia", name: "Estancia", desc: "Campos abiertos y libertad extrema", label: "Estancia 🏡" },
  { id: "hotel", name: "Hotel", desc: "Confort céntrico y paseos urbanos", label: "Hotel 🏨" },
  { id: "cabaña", name: "Cabaña", desc: "Naturaleza íntima y calor de hogar", label: "Cabaña 🪵" }
];

const LOADING_MESSAGES = [
  "Buscando hospedajes con bebederos de cortesía y amplios jardines...",
  "Calculando rutas con paradas recreativas para que estiren las patitas...",
  "Consultando senderos autorizados libres de correa en la zona...",
  "Armando la mochila ideal para humanos y mascotas...",
  "Buscando los mejores parques y plazas pet-friendly en destino...",
  "Escondiendo algunos snacks virtuales para la llegada..."
];

// Helper to guarantee any URL is absolute to prevent relative resolve 404s
export const ensureAbsoluteUrl = (url: string): string => {
  if (!url) return "";
  const trimmed = url.trim();
  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }
  if (/^(wa\.me|api\.whatsapp\.com)/i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{5,}/i.test(trimmed) || trimmed.startsWith("www.")) {
    return `https://${trimmed}`;
  }
  if (trimmed.includes(".") && !trimmed.includes(" ") && trimmed.length > 4) {
    return `https://${trimmed}`;
  }
  return trimmed;
};

// Helper to format a WhatsApp URL for Argentine mobile/landline formats
export const formatWhatsAppUrl = (input: string, message: string = "") => {
  if (!input) return "";
  const trimmed = input.trim();
  if (trimmed.includes("wa.me") || trimmed.includes("api.whatsapp.com")) {
    const withProto = ensureAbsoluteUrl(trimmed);
    if (message && !withProto.includes("text=")) {
      const separator = withProto.includes("?") ? "&" : "?";
      return `${withProto}${separator}text=${encodeURIComponent(message)}`;
    }
    return withProto;
  }
  
  // Extract number digits
  const digitsOnly = trimmed.replace(/\D/g, "");
  if (digitsOnly.length >= 7) {
    let finalNumber = digitsOnly;
    if (finalNumber.startsWith("549")) {
      // already perfect
    } else if (finalNumber.startsWith("54")) {
      if (!finalNumber.startsWith("549") && finalNumber.length === 12) {
        finalNumber = "549" + finalNumber.substring(2);
      }
    } else {
      if (finalNumber.startsWith("0")) {
        finalNumber = finalNumber.substring(1);
      }
      if (finalNumber.startsWith("15")) {
        finalNumber = finalNumber.substring(2);
      } else {
        finalNumber = finalNumber.replace("15", "");
      }
      finalNumber = "549" + finalNumber;
    }
    const textParam = message ? `?text=${encodeURIComponent(message)}` : "";
    return `https://wa.me/${finalNumber}${textParam}`;
  }
  return trimmed.startsWith("http") ? trimmed : ensureAbsoluteUrl(trimmed);
};

export default function App() {
  // Main form states
  const [province, setProvince] = useState("");
  const [customProvince, setCustomProvince] = useState("");
  const [useCustomProvince, setUseCustomProvince] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Todas");
  const [customCity, setCustomCity] = useState("");
  const [useCustomCity, setUseCustomCity] = useState(false);
  const [clientCityFilter, setClientCityFilter] = useState("Todos");
  const [clientKeywordSearch, setClientKeywordSearch] = useState("");
  const [travelersCount, setTravelersCount] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [pets, setPets] = useState<Pet[]>(() => {
    try {
      const stored = localStorage.getItem("viajando_con_amigo_trips");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.length > 0) {
          // If the user already has saved trips with other pets, let's load those pets
          const lastTrip = parsed[0];
          if (lastTrip && Array.isArray(lastTrip.pets) && lastTrip.pets.length > 0) {
            return lastTrip.pets.map((p: Pet) => {
               if (p.name.toLowerCase() === "aukan" || p.name.toLowerCase() === "rocco") {
                return { ...p, id: "aukan", name: "Aukan", image: "/aukan_park.jpg?v=1782734713", breed: p.breed || "Mestizo Negro y Fuego" };
              }
              if (p.name.toLowerCase() === "emilia" || p.name.toLowerCase() === "milo") {
                return { ...p, id: "emilia", name: "Emilia", image: "/emilia.jpg?v=1782734683", breed: p.breed || "Mestizo Tri-color" };
              }
              return p;
            });
          }
        }
      }
    } catch (e) {
      console.error("Error loading pets on init", e);
    }
    return [
      { id: "aukan", name: "Aukan", type: "Perro", breed: "Mestizo Negro y Fuego", image: "/aukan_park.jpg?v=1782734713" },
      { id: "emilia", name: "Emilia", type: "Perro", breed: "Mestizo Tri-color", image: "/emilia.jpg?v=1782734683" }
    ];
  });
  const [stayType, setStayType] = useState<string>("cualquiera");

  // App running states
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<TripRecommendation | null>(null);
  const [activeTab, setActiveTab] = useState<"builder" | "results">("builder");

  // Custom lodging pet policy checker state
  const [searchLodgingName, setSearchLodgingName] = useState<string>("");
  const [searchLodgingLocation, setSearchLodgingLocation] = useState<string>("");
  const [checkerLoading, setCheckerLoading] = useState<boolean>(false);
  const [checkerError, setCheckerError] = useState<string | null>(null);
  const [checkerResult, setCheckerResult] = useState<AccommodationCheckResult | null>(null);

  // Packing list checking status
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Saved travel history
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [activeSavedTripId, setActiveSavedTripId] = useState<string | undefined>(undefined);

  // Custom suggest pet-friendly place states
  const [sugName, setSugName] = useState("");
  const [sugLocation, setSugLocation] = useState("");
  const [sugCategory, setSugCategory] = useState("alojamiento");
  const [sugDescription, setSugDescription] = useState("");
  const [sugUserEmail, setSugUserEmail] = useState("");
  const [sugLoading, setSugLoading] = useState(false);
  const [sugSuccess, setSugSuccess] = useState(false);
  const [sugError, setSugError] = useState<string | null>(null);
  const [sugMailtoUrl, setSugMailtoUrl] = useState<string | null>(null);

  // Suggested places dashboard states (for administrator review)
  const [showAdminSuggestions, setShowAdminSuggestions] = useState(false);
  const [savedSuggestionsList, setSavedSuggestionsList] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Admin statistics panel modal state
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  const [showSandboxWarning, setShowSandboxWarning] = useState(() => {
    try {
      return typeof window !== "undefined" && window.self !== window.top;
    } catch (_) {
      return false;
    }
  });

  const [publicAppUrl, setPublicAppUrl] = useState<string>("");

  const getShareableUrl = (queryParams: string = "") => {
    let base = publicAppUrl;
    if (!base || base === "MY_APP_URL" || base.includes("MY_APP_URL") || !base.startsWith("http")) {
      const host = window.location.host;
      base = `${window.location.protocol}//${host}${window.location.pathname}`;
    }
    // Always map container dev URLs (ais-dev-) to their corresponding public shared URL (ais-pre-)
    if (base.includes("ais-dev-")) {
      base = base.replace("ais-dev-", "ais-pre-");
    }
    if (base.endsWith("/") && queryParams.startsWith("/")) {
      base = base.slice(0, -1);
    }
    return queryParams ? `${base}${queryParams}` : base;
  };

  const fetchSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const res = await fetch("/api/suggestions");
      if (res.ok) {
        const data = await res.json();
        // Show newest first
        setSavedSuggestionsList([...data].reverse());
      }
    } catch (err) {
      console.error("Error al cargar sugerencias:", err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Sharing and Toast States
  const [shareConfig, setShareConfig] = useState<{
    isOpen: boolean;
    title: string;
    url: string;
    description: string;
  } | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isFromShare, setIsFromShare] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  const showToast = (message: string) => {
    setToastMsg(message);
    setTimeout(() => {
      setToastMsg(null);
    }, 4500);
  };

  const openShareModal = (title: string, url: string, description: string) => {
    setShareConfig({
      isOpen: true,
      title,
      url,
      description
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        showToast("¡Enlace copiado al portapapeles! 🐾");
        setCopiedText(true);
        setTimeout(() => setCopiedText(false), 3000);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        showToast("¡Enlace copiado al portapapeles! 🐾");
        setCopiedText(true);
        setTimeout(() => setCopiedText(false), 3000);
      }
    } catch (err) {
      console.error("Error copyToClipboard fallback:", err);
      showToast("Haz clic abajo para seleccionar y copiar el enlace de manera manual 📋");
    }
  };

  const handleShareLinkClick = (url: string, e: React.MouseEvent<HTMLAnchorElement>, platformName: string, textToCopyIfBlocked: string) => {
    copyToClipboard(textToCopyIfBlocked || url);
    showToast(`🐾 ¡Enlace copiado! Abriendo ${platformName}...`);
  };

  const handleShareApp = () => {
    const shareUrl = getShareableUrl();
    openShareModal(
      "Compartir Aplicación de Viajes 📣",
      shareUrl,
      "Copia y compartí este enlace para que otros puedan planificar sus escapadas pet-friendly por Argentina de forma inmediata y gratuita."
    );
  };

  const handleShareTrip = () => {
    const filterObj = {
      province: useCustomProvince ? customProvince.trim() : province,
      city: selectedCity === "__other__" ? customCity.trim() : (selectedCity === "Todas" ? "" : selectedCity),
      travelersCount,
      childrenCount,
      pets,
      stayType
    };
    try {
      const encodedFilter = btoa(encodeURIComponent(JSON.stringify(filterObj)));
      const shareUrl = getShareableUrl(`?share=${encodeURIComponent(encodedFilter)}`);
      
      openShareModal(
        "Compartir este Itinerario de Viaje 🐾",
        shareUrl,
        "Compartí este enlace con tus amigos, parientes o en WhatsApp. Al abrirlo, el sistema restaurará tus filtros y generará de inmediato el itinerario completo."
      );
    } catch (e) {
      console.error(e);
      showToast("Error al generar el enlace para compartir.");
    }
  };

  const renderPawRating = (ratingStr: string) => {
    let numericRating = 5;
    if (ratingStr) {
      const matches = ratingStr.match(/(\d+(\.\d+)?)/);
      if (matches) {
        const val = parseFloat(matches[1]);
        if (val > 5) {
          if (ratingStr.includes("/10") || val > 6) {
            numericRating = (val / 10) * 5;
          } else {
            numericRating = val;
          }
        } else {
          numericRating = val;
        }
      } else {
        if (ratingStr.toLowerCase().includes("exce") || ratingStr.toLowerCase().includes("magn")) {
          numericRating = 5;
        } else if (ratingStr.toLowerCase().includes("buen")) {
          numericRating = 4;
        } else {
          numericRating = 5;
        }
      }
    }
    const rating = Math.min(5, Math.max(1, Math.round(numericRating * 10) / 10));

    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((idx) => {
          const isFull = rating >= idx;
          const isHalf = !isFull && rating >= idx - 0.5;
          return (
            <PawPrint
              key={idx}
              className={`h-2.5 w-2.5 ${
                isFull
                  ? "text-amber-500 fill-amber-500 stroke-amber-500"
                  : isHalf
                  ? "text-amber-500 fill-amber-300 stroke-amber-500"
                  : "text-gray-200 fill-transparent stroke-gray-300"
              } shrink-0`}
            />
          );
        })}
      </div>
    );
  };

  // Original mount useEffect relocated post-generateTrip to ensure hoisted access

  // Change loading messages sequentially
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Handler for suggesting a pet friendly place to administration
  const handleSuggestPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sugName.trim() || !sugLocation.trim()) {
      setSugError("Por favor, completa el nombre y la ubicación de la sugerencia.");
      return;
    }

    setSugLoading(true);
    setSugError(null);
    setSugSuccess(false);
    setSugMailtoUrl(null);

    try {
      const response = await fetch("/api/suggest-place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeName: sugName,
          placeLocation: sugLocation,
          placeCategory: sugCategory,
          placeDescription: sugDescription,
          userEmail: sugUserEmail
        })
      });

      if (!response.ok) {
        throw new Error("Ocurrió un error al enviar la sugerencia.");
      }

      const data = await response.json();
      
      setSugSuccess(true);
      
      if (!data.sent) {
        const bodyText = `Hola, quiero sugerir un nuevo lugar pet-friendly:\n\n` +
          `Nombre del lugar: ${sugName}\n` +
          `Ubicación: ${sugLocation}\n` +
          `Categoría: ${sugCategory}\n` +
          `Descripción/Comentarios: ${sugDescription}\n` +
          `Sugerido por: ${sugUserEmail || "Anónimo"}\n`;
        
        const mailto = `mailto:agosdbarea@gmail.com?subject=Sugerencia de Lugar Pet-Friendly - ${encodeURIComponent(sugName)}&body=${encodeURIComponent(bodyText)}`;
        setSugMailtoUrl(mailto);
      }

      setSugName("");
      setSugLocation("");
      setSugCategory("alojamiento");
      setSugDescription("");
      setSugUserEmail("");
    } catch (err: any) {
      setSugError(err.message || "Error al registrar la sugerencia.");
    } finally {
      setSugLoading(false);
    }
  };

  // Handler for custom lodging pet policy checking
  const checkCustomLodgingPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchLodgingName.trim()) {
      setCheckerError("Por favor, escribe el nombre del alojamiento.");
      return;
    }

    setCheckerLoading(true);
    setCheckerError(null);
    setCheckerResult(null);

    try {
      const response = await fetch("/api/check-accommodation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lodgingName: searchLodgingName,
          location: searchLodgingLocation
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Ocurrió un error al verificar el alojamiento.");
      }

      const data = await response.json() as AccommodationCheckResult;
      setCheckerResult(data);
    } catch (err: any) {
      setCheckerError(err.message || "Error al consultar las políticas del alojamiento.");
    } finally {
      setCheckerLoading(false);
    }
  };

  const handleAddPet = (newPet: Omit<Pet, "id">) => {
    const petWithId: Pet = {
      ...newPet,
      id: Math.random().toString(36).substring(2, 9)
    };
    setPets((prev) => [...prev, petWithId]);
  };

  const handleRemovePet = (id: string) => {
    setPets((prev) => prev.filter((p) => p.id !== id));
  };

  const resetFilters = () => {
    setProvince("");
    setCustomProvince("");
    setUseCustomProvince(false);
    setSelectedCity("Todas");
    setCustomCity("");
    setUseCustomCity(false);
    setClientCityFilter("Todos");
    setClientKeywordSearch("");
    setTravelersCount(2);
    setChildrenCount(0);
    setPets([]);
    setStayType("cualquiera");
    setError(null);
    setRecommendation(null);
    setActiveSavedTripId(undefined);
    setCheckedItems({});
    setActiveTab("builder");
  };

  // Run validation
  const validateForm = (): boolean => {
    const targetProvince = useCustomProvince ? customProvince.trim() : province;
    if (!targetProvince) {
      setError("Por favor, selecciona o escribe la provincia de destino.");
      return false;
    }
    if (travelersCount < 1) {
      setError("La cantidad de viajeros debe ser al menos 1.");
      return false;
    }
    if (pets.length === 0) {
      setError("¡No puedes viajar sin tu mejor amigo! Añade al menos a una mascota.");
      return false;
    }
    setError(null);
    return true;
  };

  // Request new recommendations from Gemini
  const generateTrip = async (overrideParams?: {
    province: string;
    city?: string;
    travelersCount: number;
    childrenCount: number;
    pets: Pet[];
    stayType: string;
  }) => {
    // Check if overrideParams is actually a valid parameters object rather than a React/DOM event
    const isRealOverride = !!(overrideParams && 
      typeof overrideParams === "object" && 
      "province" in overrideParams);

    const activeParams = isRealOverride ? {
      province: overrideParams.province,
      city: overrideParams.city || "",
      travelersCount: overrideParams.travelersCount,
      childrenCount: overrideParams.childrenCount,
      pets: overrideParams.pets,
      stayType: overrideParams.stayType
    } : {
      province: useCustomProvince ? customProvince.trim() : province,
      city: selectedCity === "__other__" ? customCity.trim() : (selectedCity === "Todas" ? "" : selectedCity),
      travelersCount,
      childrenCount,
      pets,
      stayType
    };

    if (!isRealOverride && !validateForm()) return;

    if (isRealOverride && (!activeParams.province || !Array.isArray(activeParams.pets) || activeParams.pets.length === 0)) {
      setError("El enlace compartido contiene datos inválidos.");
      return;
    }

    setLoading(true);
    setLoadingMsgIdx(0);
    setRecommendation(null);
    setActiveSavedTripId(undefined);
    setCheckedItems({});
    setActiveTab("results");

    try {
      // Track search parameters in analytics
      trackEvent("search", {
        province: activeParams.province,
        city: activeParams.city || "Todas",
        stayType: activeParams.stayType
      });

      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          province: activeParams.province,
          city: activeParams.city,
          travelersCount: activeParams.travelersCount,
          childrenCount: activeParams.childrenCount,
          pets: activeParams.pets,
          stayType: activeParams.stayType
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Ocurrió un error al consultar con el asistente de viaje.");
      }

      const data = await response.json() as TripRecommendation;
      setClientCityFilter("Todos");
      setClientKeywordSearch("");
      setRecommendation(data);

      // Auto save to LocalStorage list
      const newSavedTrip: SavedTrip | any = {
        id: Math.random().toString(36).substring(2, 9),
        date: new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        province: activeParams.province,
        city: activeParams.city,
        travelersCount: activeParams.travelersCount,
        childrenCount: activeParams.childrenCount,
        pets: activeParams.pets,
        stayType: activeParams.stayType,
        recommendation: data
      };

      setSavedTrips((prev) => {
        const updated = [newSavedTrip, ...prev];
        localStorage.setItem("viajando_con_amigo_trips", JSON.stringify(updated));
        return updated;
      });
      setActiveSavedTripId(newSavedTrip.id);

    } catch (err: any) {
      setError(err.message || "Error al obtener recomendaciones.");
      setActiveTab("builder");
    } finally {
      setLoading(false);
    }
  };

  // Load saved trips and auto-load shared trip parameter on mount
  useEffect(() => {
    // Register initial pageview analytics
    trackEvent("pageview");

    // Fetch public app URL from server configuration
    fetch("/api/config")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load APP_URL");
      })
      .then((data) => {
        if (data && data.appUrl) {
          setPublicAppUrl(data.appUrl);
        }
      })
      .catch((err) => {
        console.error("No se pudo obtener la URL publica, usando fallback inteligente:", err);
      });

    try {
      const stored = localStorage.getItem("viajando_con_amigo_trips");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const updatedTrips = parsed.map((trip: any) => {
            if (trip.pets && Array.isArray(trip.pets)) {
              trip.pets = trip.pets.map((p: any) => {
                if (p.name.toLowerCase() === "aukan" || p.id === "aukan" || p.name.toLowerCase() === "rocco" || p.id === "rocco") {
                  return { ...p, id: "aukan", name: "Aukan", breed: "Mestizo Negro y Fuego", image: "/aukan_park.jpg?v=1782734713" };
                }
                if (p.name.toLowerCase() === "emilia" || p.id === "emilia" || p.name.toLowerCase() === "milo" || p.id === "milo") {
                  return { ...p, id: "emilia", name: "Emilia", breed: "Mestizo Tri-color", image: "/emilia.jpg?v=1782734683" };
                }
                return p;
              });
            }
            return trip;
          });
          setSavedTrips(updatedTrips);
          localStorage.setItem("viajando_con_amigo_trips", JSON.stringify(updatedTrips));
        } else {
          setSavedTrips([]);
        }
      }
    } catch (e) {
      console.error("Error al cargar viajes guardados:", e);
    }

    try {
      const params = new URLSearchParams(window.location.search);
      const shareParam = params.get("share");
      if (shareParam) {
        let rawJson = "";
        const normalizedShareParam = shareParam.trim().replace(/ /g, "+");
        
        try {
          rawJson = decodeURIComponent(atob(normalizedShareParam));
        } catch (b64Err) {
          try {
            rawJson = decodeURIComponent(shareParam);
          } catch (urlErr) {
            console.error("Fallo la de-codificación base64 y URL:", b64Err, urlErr);
          }
        }

        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          if (parsed && typeof parsed === "object" && parsed.province) {
            setIsFromShare(true);
            const targetProvince = parsed.province;
            const targetPets = Array.isArray(parsed.pets) ? parsed.pets : [];
            
            // Auto-populate default cute pet if the array is empty to prevent failure
            const finalPets = targetPets.length > 0 ? targetPets : [{
              id: Math.random().toString(36).substring(2, 9),
              name: "Amigo",
              type: "dog",
              size: "medium",
              energy: "medium",
              specialNeeds: "Ninguna"
            }];

            const isStandard = ARG_PROVINCES.some((p) => p.name === targetProvince || p.id === targetProvince);
            if (isStandard) {
              setProvince(targetProvince);
              setUseCustomProvince(false);
            } else {
              setProvince("");
              setUseCustomProvince(true);
              setCustomProvince(targetProvince);
            }

            const targetCity = parsed.city || "";
            if (targetCity) {
              if (isStandard && PROVINCE_CITIES[targetProvince] && PROVINCE_CITIES[targetProvince].includes(targetCity)) {
                setSelectedCity(targetCity);
                setUseCustomCity(false);
                setCustomCity("");
              } else {
                setSelectedCity("__other__");
                setUseCustomCity(true);
                setCustomCity(targetCity);
              }
            } else {
              setSelectedCity("Todas");
              setUseCustomCity(false);
              setCustomCity("");
            }
            setClientCityFilter("Todos");
            setClientKeywordSearch("");

            setTravelersCount(parsed.travelersCount || 2);
            setChildrenCount(parsed.childrenCount || 0);
            setPets(finalPets);
            setStayType(parsed.stayType || "cualquiera");
            
            generateTrip({
              province: targetProvince,
              city: targetCity,
              travelersCount: parsed.travelersCount || 2,
              childrenCount: parsed.childrenCount || 0,
              pets: finalPets,
              stayType: parsed.stayType || "cualquiera"
            });
            
            showToast("¡Cargando viaje compartido de aventura! 🐾");
          }
        }
      }
    } catch (e) {
      console.error("Error al decodificar viaje compartido:", e);
    }
  }, []);

  // Scroll de forma automática arriba de todo cuando se cambia de pestaña a "results" o cuando carga la consulta
  useEffect(() => {
    if (activeTab === "results" || loading) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeTab, loading]);

  const handleSelectSavedTrip = (trip: SavedTrip | any) => {
    const isStandard = ARG_PROVINCES.some((p) => p.name === trip.province);
    setProvince(isStandard ? trip.province : "");
    if (!isStandard) {
      setUseCustomProvince(true);
      setCustomProvince(trip.province);
    } else {
      setUseCustomProvince(false);
    }

    // Restore City safely
    if (trip.city) {
      if (isStandard && PROVINCE_CITIES[trip.province] && PROVINCE_CITIES[trip.province].includes(trip.city)) {
        setSelectedCity(trip.city);
        setUseCustomCity(false);
        setCustomCity("");
      } else {
        setSelectedCity("__other__");
        setUseCustomCity(true);
        setCustomCity(trip.city);
      }
    } else {
      setSelectedCity("Todas");
      setUseCustomCity(false);
      setCustomCity("");
    }
    setClientCityFilter("Todos");
    setClientKeywordSearch("");

    setTravelersCount(trip.travelersCount);
    setChildrenCount(trip.childrenCount || 0);
    setPets(trip.pets);
    setStayType(trip.stayType);
    setRecommendation(trip.recommendation);
    setActiveSavedTripId(trip.id);
    setCheckedItems({});
    setError(null);
    setActiveTab("results");
  };

  const handleDeleteSavedTrip = (id: string) => {
    const filtered = savedTrips.filter((t) => t.id !== id);
    setSavedTrips(filtered);
    localStorage.setItem("viajando_con_amigo_trips", JSON.stringify(filtered));
    if (activeSavedTripId === id) {
      setActiveSavedTripId(undefined);
      setRecommendation(null);
      setActiveTab("builder");
    }
  };

  const togglePackingItem = (item: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const getCompletedPackingCount = () => {
    if (!recommendation) return 0;
    return recommendation.packingList.filter(item => checkedItems[item]).length;
  };

  return (
    <div id="main-app" className="min-h-screen bg-amber-50/25 font-sans text-gray-800">
      
      {showSandboxWarning && (
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs py-2.5 px-4 flex justify-between items-center z-50 text-center relative border-b border-orange-700/30">
          <p className="flex-1 font-medium">
            💡 <strong>Sugerencia de AI Studio:</strong> Tu navegador podría restringir WhatsApp o redirecciones externas dentro de este panel de diseño. Hacé clic en <span className="font-extrabold text-white underline">"Open in a new tab" (Abrir en nueva pestaña) ↗️</span> en la esquina superior derecha de AI Studio para un funcionamiento 100% óptimo con tus enlaces.
          </p>
          <button 
            onClick={() => setShowSandboxWarning(false)} 
            className="text-white hover:text-amber-100 font-bold ml-2 text-xs opacity-75 hover:opacity-100 p-1.5 focus:outline-none cursor-pointer"
            title="Cerrar"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Banner Header */}
      <header id="app-header" className="bg-white border-b border-gray-100 shadow-xs sticky top-0 z-40 transition-shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 rounded-2xl text-white shadow-md shadow-amber-500/20">
              <Compass className="h-7 w-7 animate-pulse-soft" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-2xl text-gray-900 tracking-tight flex items-center gap-1">
                Viajando con mi mejor amigo
                <span className="text-xl">🐾</span>
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                Planificador de escapadas pet-friendly por Argentina
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareApp}
              id="share-app-header-btn"
              className="px-3.5 py-2 text-sm font-semibold rounded-xl border border-amber-500/20 text-amber-800 bg-amber-50/40 hover:bg-amber-50 flex items-center gap-1.5 cursor-pointer transition-all active:scale-[0.98]"
              title="Copiar enlace para compartir la app"
            >
              <Send className="h-4 w-4 rotate-45 text-amber-600 shrink-0" />
              <span className="hidden md:inline">Compartir Web</span>
            </button>
            <button
              onClick={() => setActiveTab("builder")}
              id="tab-builder-btn"
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                activeTab === "builder"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-gray-650 hover:bg-gray-100"
              }`}
            >
              Configurar Viaje
            </button>
            <button
              onClick={() => {
                if (recommendation) {
                  setActiveTab("results");
                }
              }}
              disabled={!recommendation}
              id="tab-results-btn"
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                activeTab === "results"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              Ver Itinerario {recommendation && "✨"}
            </button>
          </div>

        </div>
      </header>

      {/* Dynamic Iframe-Safe Navigation Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 px-4 py-2.5 text-center text-xs text-amber-900 leading-relaxed font-medium">
        <span>💡 <strong>Consejo de navegación:</strong> Si tu buscador o vista previa de AI Studio bloquea la apertura de enlaces o mapas externos, podés usar los botones de copiar integrados o abrir esta app en una nueva pestaña completa tocando el botón superior derecho de AI Studio <strong>"Open in new tab"</strong> para navegar con total libertad.</span>
      </div>

      {/* Hero Welcome Info */}
      <div className={`bg-amber-50/70 border-b border-amber-200/40 py-10 px-4 ${(activeTab === "results" || loading) ? "hidden lg:block" : "block"}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-200/60 px-3 py-1 rounded-full uppercase tracking-wider">
              ✨ Planificador Inteligente con IA de Google Gemini
            </span>
            <h2 className="font-display font-black text-3xl md:text-5xl text-gray-900 leading-tight">
              ¿A dónde van de aventura esta vez?
            </h2>
            <p className="text-sm md:text-base text-gray-650 max-w-2xl">
              Indicá la provincia argentina, cuántos viajan, los nombres de tus mascotas y el tipo de estadía esperada. ¡La IA armará un plan de viaje ideal adaptado para todos con recomendaciones auténticas!
            </p>
          </div>
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm md:max-w-full rounded-3xl overflow-hidden shadow-lg border-4 border-white transform hover:rotate-1 hover:scale-[1.02] transition-all duration-300">
              <img
                src={happyDogBanner}
                alt="Perro feliz en Argentina"
                className="w-full h-48 md:h-64 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-amber-500/95 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1">
                <span>🐾 El mejor copiloto</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Builder & History */}
          <div className={`lg:col-span-5 space-y-6 ${activeTab === "builder" ? "block" : "hidden lg:block"}`}>
            
            {/* Form Section */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h2 className="font-display font-extrabold text-lg text-gray-900 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-amber-600" />
                  Filtros de mi viaje
                </h2>
                <button
                  type="button"
                  id="reset-filter-btn"
                  onClick={resetFilters}
                  className="text-xs text-gray-500 hover:text-amber-700 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Limpiar todo
                </button>
              </div>

              {/* Error Alert */}
              {error && (
                <div id="error-alert" className="p-4 bg-rose-50 border border-rose-100 text-rose-850 rounded-2xl flex items-start gap-2 text-sm leading-relaxed">
                  <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Por favor corregir: </span>
                    {error}
                  </div>
                </div>
              )}

              {/* Destination Filter */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-rose-500" />
                  ¿A qué provincia quieren viajar?
                </label>

                {!useCustomProvince ? (
                  <div className="space-y-3">
                    <select
                      id="province-select"
                      value={province}
                      onChange={(e) => {
                        if (e.target.value === "__other__") {
                          setUseCustomProvince(true);
                          setProvince("");
                          setSelectedCity("Todas");
                          setCustomCity("");
                          setUseCustomCity(false);
                        } else {
                          setProvince(e.target.value);
                          setSelectedCity("Todas");
                          setCustomCity("");
                          setUseCustomCity(false);
                        }
                      }}
                      className="w-full text-sm bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-2xs"
                    >
                      <option value="">-- Selecciona una provincia --</option>
                      {ARG_PROVINCES.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                      <option value="__other__">Otra provincia diferente...</option>
                    </select>

                    {/* Quick popular recommendations tiles */}
                    <div className="pt-1">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">Sugerencias rápidas:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {ARG_PROVINCES.slice(0, 4).map((p) => (
                          <button
                            type="button"
                            key={p.id}
                            id={`quick-province-${p.id}`}
                            onClick={() => {
                              setUseCustomProvince(false);
                              setProvince(p.id);
                              setSelectedCity("Todas");
                              setCustomCity("");
                              setUseCustomCity(false);
                            }}
                            className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                              province === p.id 
                                ? "bg-amber-100 border-amber-350 text-amber-900 font-semibold"
                                : "bg-gray-55/40 border-gray-200 text-gray-650 hover:bg-gray-50"
                            }`}
                          >
                            {p.id}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="text"
                        id="custom-province-input"
                        value={customProvince}
                        onChange={(e) => {
                          setCustomProvince(e.target.value);
                          setSelectedCity("Todas");
                          setCustomCity("");
                          setUseCustomCity(false);
                        }}
                        placeholder="Escribe la provincia (ej. Jujuy, San Luis, Chubut)"
                        className="w-full text-sm bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        type="button"
                        id="cancel-custom-province-btn"
                        onClick={() => {
                          setUseCustomProvince(false);
                          setCustomProvince("");
                          setSelectedCity("Todas");
                          setCustomCity("");
                          setUseCustomCity(false);
                        }}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 p-0.5 rounded-full"
                        title="Volver a la lista"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Puedes introducir cualquier región o provincia deseada.
                    </p>
                  </div>
                )}
              </div>

              {/* City Filter (Nested options within selected province) */}
              {(province || (useCustomProvince && customProvince)) && (
                <div className="space-y-2 bg-amber-50/40 p-3.5 border border-amber-200/50 rounded-2xl animate-in fade-in slide-in-from-top-1 duration-200" id="city-selector-section">
                  <label className="text-xs font-extrabold text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
                    <span className="text-sm">🏙️</span>
                    Filtrar por Ciudad o Localidad (Opcional)
                  </label>
                  
                  {!useCustomProvince && PROVINCE_CITIES[province] ? (
                    <div className="space-y-2">
                      <select
                        id="city-select"
                        value={selectedCity}
                        onChange={(e) => {
                          setSelectedCity(e.target.value);
                          if (e.target.value === "__other__") {
                            setUseCustomCity(true);
                          } else {
                            setUseCustomCity(false);
                            setCustomCity("");
                          }
                        }}
                        className="w-full text-sm bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-3xs cursor-pointer font-medium"
                      >
                        {PROVINCE_CITIES[province].map((c) => (
                          <option key={c} value={c}>
                            {c === "Todas" ? "Todas las ciudades / localidades" : c}
                          </option>
                        ))}
                        <option value="__other__">Otra ciudad / localidad diferente...</option>
                      </select>

                      {useCustomCity && (
                        <div className="relative animate-in slide-in-from-top-1 duration-150">
                          <input
                            type="text"
                            id="custom-city-input"
                            value={customCity}
                            onChange={(e) => setCustomCity(e.target.value)}
                            placeholder="Escribe el nombre de la ciudad (ej. Pinamar, Cariló)"
                            className="w-full text-sm bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-gray-850 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        id="custom-city-free-input"
                        value={customCity}
                        onChange={(e) => {
                          setCustomCity(e.target.value);
                          setSelectedCity("__other__");
                          setUseCustomCity(true);
                        }}
                        placeholder="Escribe la ciudad/localidad (ej. Bariloche, Carlos Paz, El Chaltén)"
                        className="w-full text-sm bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-gray-850 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-3xs"
                      />
                      <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">
                        Dejar en blanco para buscar en toda la provincia de manera general.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Travelers (HumansCount) Filter */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-emerald-600" />
                  ¿Cuántos viajeros adultos son?
                </label>
                <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 p-3 rounded-xl justify-between">
                  <div className="text-sm">
                    <span className="font-extrabold text-gray-900 text-lg">{travelersCount}</span>
                    <span className="text-gray-500 text-xs ml-1">
                      {travelersCount === 1 ? "adulto" : "adultos"}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      id="traveler-dec-btn"
                      onClick={() => setTravelersCount(prev => Math.max(1, prev - 1))}
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold font-mono transition-colors text-lg"
                      disabled={travelersCount <= 1}
                    >
                      -
                    </button>
                    <button
                      type="button"
                      id="traveler-inc-btn"
                      onClick={() => setTravelersCount(prev => Math.min(10, prev + 1))}
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold font-mono transition-colors text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Children (Hijos) Filter */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <Baby className="h-4 w-4 text-indigo-500" />
                  ¿Cuántos hijos viajan?
                </label>
                <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 p-3 rounded-xl justify-between">
                  <div className="text-sm">
                    <span className="font-extrabold text-gray-900 text-lg">{childrenCount}</span>
                    <span className="text-gray-500 text-xs ml-1">
                      {childrenCount === 1 ? "hijo" : "hijos/as"}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      id="child-dec-btn"
                      onClick={() => setChildrenCount(prev => Math.max(0, prev - 1))}
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold font-mono transition-colors text-lg"
                      disabled={childrenCount <= 0}
                    >
                      -
                    </button>
                    <button
                      type="button"
                      id="child-inc-btn"
                      onClick={() => setChildrenCount(prev => Math.min(10, prev + 1))}
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold font-mono transition-colors text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Pets Component */}
              <PetInput
                pets={pets}
                onAddPet={handleAddPet}
                onRemovePet={handleRemovePet}
              />

              {/* Stay Type Picker */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <Coffee className="h-4 w-4 text-amber-600" />
                  ¿Qué tipo de alojamiento prefieren?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {STAY_TYPES.map((st) => (
                    <button
                      type="button"
                      key={st.id}
                      id={`stay-type-picker-${st.id}`}
                      onClick={() => setStayType(st.id)}
                      className={`p-3 text-left rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        stayType === st.id
                          ? "bg-amber-500/10 border-amber-500"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="font-bold text-gray-900 text-xs">
                        {st.label}
                      </span>
                      <span className="text-[10px] text-gray-500 mt-1 block">
                        {st.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Final Trigger CTA */}
              <div className="pt-3">
                <button
                  type="button"
                  id="submit-adventure-btn"
                  onClick={generateTrip}
                  className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base rounded-2xl shadow-md cursor-pointer tracking-wider flex items-center justify-center gap-2 transition-transform active:scale-[0.99]"
                >
                  <Sparkles className="h-5 w-5 animate-pulse-soft text-yellow-300" />
                  Armar Viaje
                </button>
                <p className="text-center text-[11px] text-gray-400 mt-2">
                  Nuestra inteligente IA adaptará los hospedajes y las aventuras a tus mascotas.
                </p>
              </div>

            </div>

            {/* Verification Widget: Check any custom lodging pet policy with AI */}
            <div className="bg-white border border-amber-100 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <div className="p-1.5 bg-amber-500 rounded-lg text-white">
                  <Search className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-base text-gray-900 leading-tight">
                    Verificador de Alojamiento Pet-Friendly
                  </h3>
                  <p className="text-[10px] text-gray-550 font-medium">
                    ¿Ya elegiste hotel, cabaña o posada? Verificá con IA si admite mascotas.
                  </p>
                </div>
              </div>

              <form onSubmit={checkCustomLodgingPolicy} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Nombre del alojamiento
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Hotel Provincial, Estancia La Horqueta, etc."
                    value={searchLodgingName}
                    onChange={(e) => setSearchLodgingName(e.target.value)}
                    className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex justify-between">
                    <span>Ubicación o localidad</span>
                    <span className="text-[10px] font-normal text-gray-400">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Chascomús, Lobos, Tandil, Córdoba"
                    value={searchLodgingLocation}
                    onChange={(e) => setSearchLodgingLocation(e.target.value)}
                    className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={checkerLoading || !searchLodgingName.trim()}
                  className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-705 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-extrabold text-xs rounded-xl tracking-wider flex items-center justify-center gap-2 transition-transform active:scale-[0.99] cursor-pointer shadow-2xs"
                >
                  {checkerLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                      Consultando con Gemini...
                    </>
                  ) : (
                    <>
                      <Search className="h-3.5 w-3.5" />
                      Verificar con la IA 🐾
                    </>
                  )}
                </button>
              </form>

              {/* Checker Error Alert */}
              {checkerError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-850 rounded-xl flex items-start gap-1.5 text-xs">
                  <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Atención:</span> {checkerError}
                  </div>
                </div>
              )}

              {/* Checker Results View */}
              {checkerResult && (
                <div className="p-4 bg-amber-500/5 border border-amber-100 rounded-2xl space-y-3 relative overflow-hidden transition-all duration-300">
                  <button
                    onClick={() => {
                      setCheckerResult(null);
                      setSearchLodgingName("");
                      setSearchLodgingLocation("");
                    }}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100 transition-colors"
                    title="Cerrar verificación"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  <div>
                    <h4 className="font-display font-extrabold text-xs.5 text-gray-900 flex items-center gap-1.5 pr-6 leading-tight">
                      <Building2 className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                      {checkerResult.name}
                    </h4>
                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">📍 {checkerResult.location}</p>
                  </div>

                  {/* Badges based on isPetFriendly status */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {checkerResult.isPetFriendly.toLowerCase().includes("sí") ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-250">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        Sí, admite ✅
                      </span>
                    ) : checkerResult.isPetFriendly.toLowerCase().includes("cond") ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-250">
                        <HelpCircle className="h-3 w-3 text-amber-600" />
                        Condicional ⚠️
                      </span>
                    ) : checkerResult.isPetFriendly.toLowerCase().includes("no") ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-850 bg-red-100 px-2 py-0.5 rounded-full border border-red-250">
                        <X className="h-3 w-3 text-red-600" />
                        No admite ❌
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-250">
                        <HelpCircle className="h-3 w-3 text-gray-500" />
                        Incierto ({checkerResult.isPetFriendly})
                      </span>
                    )}

                    <span className="text-[9px] bg-slate-100 text-slate-650 px-2 py-0.5 rounded-lg border border-slate-205 uppercase tracking-wider font-extrabold">
                      Precisión: {checkerResult.confidenceScore}
                    </span>
                  </div>

                  <div className="text-xs text-gray-700 leading-relaxed bg-white border border-gray-100 rounded-xl p-3 shadow-2xs">
                    <p className="font-bold text-[9px] text-gray-400 uppercase tracking-widest mb-1">Políticas de Mascotas:</p>
                    {checkerResult.policyDetails}
                  </div>

                  {/* Recommendation/Alternative Info Box */}
                  <div className="bg-amber-100/45 border border-amber-200/50 rounded-xl p-3 space-y-1">
                    <p className="text-[10px] font-bold text-amber-900 flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                      {checkerResult.isPetFriendly.toLowerCase().includes("sí") ? "Recomendado en la zona:" : "Alternativa pet-friendly:"}
                    </p>
                    <p className="text-xs text-amber-950 italic leading-snug">
                      {checkerResult.alternativeSuggest}
                    </p>
                  </div>

                  {/* Portal Reviews ratings block */}
                  {checkerResult.reviews && checkerResult.reviews.length > 0 && (
                    <div className="space-y-1.5 pt-1 border-t border-gray-100">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <PawPrint className="h-3 w-3 text-amber-500 fill-amber-500" />
                        Calificaciones de Viajeros (Huellas)
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {checkerResult.reviews.map((rev, i) => {
                          const plat = rev.platform.toLowerCase();
                          let badgeStyle = "bg-sky-50 text-sky-855 border-sky-200";
                          if (plat.includes("trip")) {
                            badgeStyle = "bg-emerald-50 text-emerald-855 border-emerald-200";
                          } else if (plat.includes("goog")) {
                            badgeStyle = "bg-amber-50 text-amber-900 border-amber-205";
                          }
                          return (
                            <div key={i} className={`text-[10px] px-2 py-1 rounded-md border flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-1.5 font-medium ${badgeStyle}`}>
                              <div className="flex items-center gap-1 shrink-0">
                                <span className="font-bold">{rev.platform}</span>
                                <span className="opacity-30">|</span>
                                <span className="font-extrabold">{rev.rating}</span>
                              </div>
                              {renderPawRating(rev.rating)}
                              {rev.commentCount && <span className="opacity-60 text-[9px] shrink-0">({rev.commentCount})</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Suggest Pet-Friendly Place Card */}
            <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <div className="p-1.5 bg-emerald-600 rounded-lg text-white">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-base text-gray-900 leading-tight">
                    ¿Conocés un lugar pet-friendly? 🐕
                  </h3>
                  <p className="text-[10px] text-gray-550 font-medium">
                    Sugerilo para que lo sumemos. Llegará directamente por mail a la administración.
                  </p>
                </div>
              </div>

              {sugSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-950 rounded-2xl space-y-2 text-xs">
                  <p className="font-bold">¡Muchas gracias por tu recomendación! 🎉</p>
                  <p className="leading-normal">
                    La sugerencia ha sido enviada con éxito. La revisaremos pronto para incluirla en la aplicación.
                  </p>
                  {sugMailtoUrl && (
                    <div className="pt-2 border-t border-emerald-200/50">
                      <p className="mb-2 text-[10px] text-slate-500 font-medium">
                        Nota: Como no hay servidor SMTP configurado aún, también podés enviarla directamente por mail con un clic:
                      </p>
                      <a
                        href={sugMailtoUrl}
                        className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs hover:shadow-xs transition-colors"
                      >
                        <Send className="w-3 h-3" />
                        Enviar por Mail Directo
                      </a>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setSugSuccess(false)}
                    className="text-emerald-700 hover:underline block font-bold text-[10px] mt-2 cursor-pointer"
                  >
                    Sugerir otro lugar
                  </button>
                </div>
              )}

              {!sugSuccess && (
                <form onSubmit={handleSuggestPlace} className="space-y-3">
                  {sugError && (
                    <div className="p-2.5 bg-red-50 border border-red-100 text-red-800 rounded-xl text-xs">
                      {sugError}
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Nombre del lugar *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ej. Café con Patas, Hotel Canino Las Rosas"
                      value={sugName}
                      onChange={(e) => setSugName(e.target.value)}
                      className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Ubicación / Provincia *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ej. Palermo (CABA), Bariloche (Río Negro)"
                      value={sugLocation}
                      onChange={(e) => setSugLocation(e.target.value)}
                      className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Categoría
                    </label>
                    <select
                      value={sugCategory}
                      onChange={(e) => setSugCategory(e.target.value)}
                      className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                    >
                      <option value="alojamiento">Hospedaje (Hotel / Cabaña / Estancia)</option>
                      <option value="gastronomia">Gastronomía (Café / Bar / Restaurante)</option>
                      <option value="recreacion">Recreación (Parque / Reserva / Sendero)</option>
                      <option value="playa">Playa Canina</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      ¿Por qué lo recomendás? (Servicios pet-friendly que ofrece)
                    </label>
                    <textarea
                      placeholder="ej. Dan bebedero de cortesía, tienen patio cerrado grande, etc."
                      value={sugDescription}
                      onChange={(e) => setSugDescription(e.target.value)}
                      rows={3}
                      className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1 flex justify-between">
                      <span>Tu correo electrónico</span>
                      <span className="text-[10px] font-normal text-gray-400">(opcional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="ej. nombre@correo.com"
                      value={sugUserEmail}
                      onChange={(e) => setSugUserEmail(e.target.value)}
                      className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sugLoading}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-extrabold text-xs rounded-xl tracking-wider flex items-center justify-center gap-2 transition-transform active:scale-[0.99] cursor-pointer shadow-2xs"
                  >
                    {sugLoading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                        Registrando lugar...
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        Sugerir Lugar Amigo 🐾
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Toggle for admin to inspect suggestions */}
              <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-xs">
                <span className="text-[10px] text-gray-400">¿Sos administrador?</span>
                <button
                  type="button"
                  id="admin-suggest-toggle"
                  onClick={() => {
                    const next = !showAdminSuggestions;
                    setShowAdminSuggestions(next);
                    if (next) {
                      fetchSuggestions();
                    }
                  }}
                  className="text-[10px] font-bold text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>🐾 {showAdminSuggestions ? "Ocultar panel admin" : "Ver sugerencias recibidas"}</span>
                </button>
              </div>

              {showAdminSuggestions && (
                <div className="mt-2 p-3.5 bg-slate-50 border border-slate-250/80 rounded-2xl text-xs space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-gray-800 flex items-center gap-1">
                      📋 Bandeja de Sugerencias
                    </h4>
                    <button 
                      type="button" 
                      onClick={fetchSuggestions}
                      className="text-[10px] font-bold text-emerald-600 hover:text-emerald-800 transition-colors cursor-pointer"
                    >
                      🔄 Actualizar
                    </button>
                  </div>
                  
                  {loadingSuggestions ? (
                    <div className="text-center py-4 text-gray-450 font-medium">Cargando sugerencias...</div>
                  ) : savedSuggestionsList.length === 0 ? (
                    <div className="text-center py-4 text-gray-450 font-medium">No se encontraron sugerencias aún.</div>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {savedSuggestionsList.map((sug: any) => (
                        <div key={sug.id || Math.random().toString(36)} className="p-2.5 bg-white border border-gray-200 rounded-xl space-y-1">
                          <div className="flex justify-between items-start font-bold text-gray-900 gap-2">
                            <span className="leading-tight">{sug.placeName}</span>
                            <span className="text-[9px] uppercase font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md shrink-0 block">
                              {sug.placeCategory || "otro"}
                            </span>
                          </div>
                          <div className="text-slate-600 text-[11px] font-medium">📍 {sug.placeLocation}</div>
                          {sug.placeDescription && (
                            <div className="text-[10.5px] text-slate-500 italic bg-slate-50 p-1.5 rounded-lg border border-slate-100 mt-1">
                              "{sug.placeDescription}"
                            </div>
                          )}
                          <div className="flex justify-between text-[9px] pt-1.5 text-slate-400 border-t border-slate-50 mt-1">
                            <span className="truncate max-w-[130px]">De: {sug.userEmail || "Anónimo"}</span>
                            <span className={sug.emailSent ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                              {sug.emailSent ? "📧 Mail Enviado" : "💾 Respaldo Local"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Caretakers & Boarding Nurseries section */}
            <TrustedCaretakersCard />

            {/* Did You Know Weekly Section */}
            <DidYouKnow />

            {/* Cabify Mascotas Transportation Section */}
            <CabifyMascotasCard />

            {/* Saved Trips History Dashboard */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="font-display font-extrabold text-base text-gray-900 flex items-center gap-2">
                <History className="h-5 w-5 text-gray-500" />
                Mis viajes guardados ({savedTrips.length})
              </h3>
              <SavedTripsList
                trips={savedTrips}
                onSelectTrip={handleSelectSavedTrip}
                onDeleteTrip={handleDeleteSavedTrip}
                selectedTripId={activeSavedTripId}
              />
            </div>

          </div>

          {/* Right Column: Dynamic Itinerary Display & Loader */}
          <div className={`lg:col-span-7 ${activeTab === "results" ? "block" : "hidden lg:block"}`}>
            
            {loading ? (
              <div id="itinerary-loading-state" className="bg-white border border-gray-150 rounded-3xl p-10 shadow-sm text-center min-h-[500px] flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
                  <span className="absolute inset-0 flex items-center justify-center text-lg">🐕</span>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-display font-extrabold text-xl text-gray-900">
                    Armando la valija del mejor amigo...
                  </h3>
                  <p className="text-sm text-gray-650 max-w-md mx-auto h-12 flex items-center justify-center italic text-amber-800">
                    "{LOADING_MESSAGES[loadingMsgIdx]}"
                  </p>
                </div>

                <div className="w-full max-w-xs bg-gray-100 h-1 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-2/3 animate-pulse"></div>
                </div>

                <p className="text-xs text-gray-400">
                  Esto puede tardar unos pocos segundos mientras Gemini planifica la estadía óptima.
                </p>
              </div>
            ) : recommendation ? (
              <div id="itinerary-result" className="space-y-6">
                
                {/* Greeting Card banner */}
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 border border-amber-400 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-10 text-9xl transform translate-x-12 translate-y-12 select-none">
                    🏕️
                  </div>
                  
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[11px] font-bold bg-white/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        ¡Itinerario Listo! {isFromShare && "🎁 Compartido"}
                      </span>
                      <button
                        type="button"
                        onClick={handleShareTrip}
                        className="bg-white/15 text-white hover:bg-white/25 border border-white/20 font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Send className="h-3 w-3 rotate-45 text-white" />
                        <span>Compartir Itinerario 🔗</span>
                      </button>
                    </div>
                    <h3 className="font-display font-black text-2xl leading-snug">
                      Aventura en {useCustomProvince ? customProvince : province}
                    </h3>
                    {pets && pets.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-xs text-amber-100 font-semibold mr-1">🐾 Viajan con vos:</span>
                        {pets.map((pet, idx) => (
                          <div key={pet.id || pet.name || idx} className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 transition-colors px-2.5 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                            {pet.image ? (
                              <img
                                src={pet.image}
                                alt={pet.name}
                                className="h-4.5 w-4.5 rounded-full object-cover border border-amber-200/50"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="text-xs">🐕</span>
                            )}
                            <span>{pet.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="text-amber-50 text-sm leading-relaxed whitespace-pre-line border-l-2 border-amber-300 pl-4 py-1 italic font-medium">
                      {recommendation.customPetGreeting}
                    </div>
                  </div>
                </div>

                {/* Lodgings Recommendations */}
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                    <h3 className="font-display font-extrabold text-xl text-gray-900 flex items-center gap-2">
                      <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg text-sm font-bold">1</span>
                      Hospedajes {stayType === "cualquiera" ? "Recomendados" : `Estilo ${stayType}`}
                    </h3>

                    {/* Highly Interactive Combined Buscador Row */}
                    {recommendation.places && recommendation.places.length > 0 && (
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto" id="lodgings-search-control-panel">
                        {/* Text Search Input (Buscador por Texto) */}
                        <div className="relative">
                          <input
                            type="text"
                            value={clientKeywordSearch}
                            onChange={(e) => setClientKeywordSearch(e.target.value)}
                            placeholder="Buscar palabras clave (ej: pileta, campo, gratis)..."
                            className="w-full sm:w-64 text-xs bg-white border border-gray-200 rounded-xl pl-8 pr-7 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                          />
                          <span className="absolute left-2.5 top-2.5 text-gray-400 text-xs">🔍</span>
                          {clientKeywordSearch && (
                            <button
                              type="button"
                              onClick={() => setClientKeywordSearch("")}
                              className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 font-extrabold text-xs"
                              title="Limpiar búsqueda por texto"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        {/* Dropdown City Filter */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-gray-555 shrink-0">Localidad:</span>
                          <select
                            id="lodgings-city-filter-select"
                            value={clientCityFilter}
                            onChange={(e) => setClientCityFilter(e.target.value)}
                            className="text-xs bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-gray-850 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold shadow-3xs cursor-pointer border-solid border"
                          >
                            <option value="Todos">Todas ({recommendation.places.length})</option>
                            {Array.from(new Set(recommendation.places.map(p => {
                              const loc = p.location || "";
                              const commaIdx = loc.indexOf(",");
                              return commaIdx !== -1 ? loc.substring(0, commaIdx).trim() : loc.trim();
                            }))).filter(Boolean).map(city => (
                              <option key={city} value={city}>{city}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(() => {
                      const filteredPlaces = recommendation.places.filter(place => {
                        // 1. Filter by location
                        let matchesCity = true;
                        if (clientCityFilter !== "Todos") {
                          const loc = (place.location || "").toLowerCase();
                          matchesCity = loc.includes(clientCityFilter.toLowerCase());
                        }

                        // 2. Filter by keyword input matching multiple keys
                        let matchesKeyword = true;
                        if (clientKeywordSearch.trim()) {
                          const query = clientKeywordSearch.toLowerCase().trim();
                          const name = (place.name || "").toLowerCase();
                          const desc = (place.description || "").toLowerCase();
                          const high = (place.highlights || []).join(" ").toLowerCase();
                          const amen = (place.petAmenities || []).join(" ").toLowerCase();
                          const location = (place.location || "").toLowerCase();
                          const policies = place.petPolicies 
                            ? `${place.petPolicies.allowedSizes} ${place.petPolicies.leashRequirement} ${place.petPolicies.extraFeeForPets} ${place.petPolicies.additionalDetails || ""}`.toLowerCase()
                            : "";
                          
                          matchesKeyword = name.includes(query) || 
                                           desc.includes(query) || 
                                           high.includes(query) || 
                                           amen.includes(query) || 
                                           location.includes(query) || 
                                           policies.includes(query);
                        }

                        return matchesCity && matchesKeyword;
                      });

                      if (filteredPlaces.length === 0) {
                        return (
                          <div className="col-span-full py-10 text-center bg-gray-50 border border-gray-150 rounded-2xl">
                            <span className="text-xl">🔍</span>
                            <p className="text-xs text-gray-550 font-bold mt-2">No encontramos ningún alojamiento que coincida con tu búsqueda.</p>
                            <p className="text-[11px] text-gray-400 mt-1">Intentá buscar otra palabra clave o restablecer los filtros.</p>
                            <button
                              type="button"
                              onClick={() => {
                                setClientCityFilter("Todos");
                                setClientKeywordSearch("");
                              }}
                              className="text-xs text-amber-600 hover:text-amber-700 hover:underline font-extrabold mt-3 cursor-pointer bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg transition-all"
                            >
                              Restablecer búsqueda
                            </button>
                          </div>
                        );
                      }

                      return filteredPlaces.map((place, i) => (
                        <LodgingCard key={i} place={place} stayType={stayType} />
                      ));
                    })()}
                  </div>
                </div>

                {/* Adventure Activities */}
                <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs space-y-4">
                  <h3 className="font-display font-extrabold text-xl text-gray-900 flex items-center gap-2">
                    <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-sm font-bold">2</span>
                    Actividades para hacer juntos
                  </h3>

                  <div className="space-y-4 divide-y divide-gray-100">
                    {recommendation.activities.map((act, i) => (
                      <div key={i} className={`pt-4 first:pt-0 flex flex-col md:flex-row md:items-start justify-between gap-3`}>
                        <div className="space-y-1 md:max-w-[70%]">
                          <h4 className="font-bold text-gray-900 flex items-center gap-1.5 text-base">
                            <Activity className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                            {act.title}
                          </h4>
                          <p className="text-xs text-gray-500 font-medium px-2 py-0.5 bg-gray-100 rounded-full inline-block">
                            Duración: {act.duration}
                          </p>
                          <p className="text-sm text-gray-650 leading-relaxed pt-1">
                            {act.description}
                          </p>
                        </div>
                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-900 flex items-start gap-1.5 md:max-w-[28%]">
                          <Heart className="h-4 w-4 text-emerald-650 shrink-0 mt-0.5 fill-emerald-250" />
                          <div>
                            <span className="font-bold block mb-0.5">Nota de Mascota:</span>
                            {act.petSuitability}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pet-Friendly Spots (Restaurants, Shops, Bars) */}
                {recommendation.petFriendlySpots && recommendation.petFriendlySpots.length > 0 && (
                  <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs space-y-4">
                    <h3 className="font-display font-extrabold text-xl text-gray-900 flex items-center gap-2">
                      <span className="p-1.5 bg-sky-100 text-sky-800 rounded-lg text-sm font-bold">3</span>
                      Gastronomía y Paseos Comerciales Pet-Friendly 🍔🛍️
                    </h3>
                    <p className="text-xs text-gray-550 font-medium">
                      Lugares recomendados en la provincia para visitar con tus mascotas, almorzar o hacer un break de compras:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recommendation.petFriendlySpots.map((spot, i) => {
                        const typeLower = spot.type ? spot.type.toLowerCase() : "";
                        const isShopping = typeLower.includes("shop") || typeLower.includes("compr");
                        const isBar = typeLower.includes("bar") || typeLower.includes("cerve");
                        const isCafe = typeLower.includes("caf");
                        const isResto = typeLower.includes("rest");

                        let badgeColor = "bg-orange-50 text-orange-700 border-orange-100";
                        let emoji = "🍔";
                        if (isShopping) {
                          badgeColor = "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100";
                          emoji = "🛍️";
                        } else if (isBar) {
                          badgeColor = "bg-amber-50 text-amber-700 border-amber-100";
                          emoji = "🍻";
                        } else if (isCafe) {
                          badgeColor = "bg-yellow-50 text-yellow-800 border-yellow-100";
                          emoji = "☕";
                        } else if (isResto) {
                          badgeColor = "bg-rose-50 text-rose-700 border-rose-100";
                          emoji = "🍕";
                        }

                        return (
                          <div key={i} className="border border-gray-100 bg-amber-50/5 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-200 hover:bg-amber-50/10 transition-all shadow-2xs">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-bold text-gray-900 text-sm leading-tight">
                                  {spot.name}
                                </h4>
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${badgeColor} shrink-0`}>
                                  {emoji} {spot.type}
                                </span>
                              </div>
                              <p className="text-xs text-gray-650 leading-relaxed">
                                {spot.description}
                              </p>
                              <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                <span className="line-clamp-1 font-medium">{spot.address}</span>
                              </div>
                            </div>

                            {spot.specialPetBenefit && (
                              <div className="mt-3 pt-2 border-t border-dashed border-gray-100 flex items-start gap-1.5 text-[10px] text-sky-950 bg-sky-50/70 p-2.5 rounded-lg">
                                <PawPrint className="h-3.5 w-3.5 text-sky-600 shrink-0 stroke-[2.5]" />
                                <p className="font-medium">
                                  <span className="font-bold">Para tu mascota:</span> {spot.specialPetBenefit}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Guarderías o Cuidadores de Confianza */}
                {recommendation.petNurseriesOrSitters && recommendation.petNurseriesOrSitters.length > 0 && (
                  <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs space-y-4 animate-in fade-in duration-300">
                    <h3 className="font-display font-extrabold text-xl text-gray-900 flex items-center gap-2">
                      <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg text-sm font-bold">4</span>
                      Guarderías y Cuidadores de Confianza 🏡🐕
                    </h3>
                    <p className="text-xs text-gray-550 font-medium">
                      ¿Tu alojamiento o excursión tiene sectores donde no se permiten mascotas? Consultá estas opciones confiables de guarderías y cuidadores con excelentes calificaciones verificadas en la zona para que se queden en las mejores manos:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recommendation.petNurseriesOrSitters.map((care, i) => {
                        const isNursery = care.type.toLowerCase().includes("guard") || care.type.toLowerCase().includes("hosp");
                        const badgeColor = isNursery 
                          ? "bg-amber-50 text-amber-850 border-amber-205" 
                          : "bg-teal-50 text-teal-850 border-teal-205";
                        const emoji = isNursery ? "🏨" : "🧑‍🤝‍🧑";

                        return (
                          <div key={i} className="border border-gray-150 bg-amber-50/5/5 bg-white rounded-2xl p-4 flex flex-col justify-between hover:border-amber-300 hover:bg-amber-50/10/5 hover:shadow-xs transition-all shadow-2xs">
                            <div className="space-y-2.5">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-bold text-gray-900 text-sm leading-tight">
                                  {care.name}
                                </h4>
                                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${badgeColor} shrink-0 uppercase tracking-wider`}>
                                  {emoji} {care.type}
                                </span>
                              </div>

                              <div className="flex items-center gap-1">
                                {renderPawRating(care.rating)}
                                {care.reviewsCount && (
                                  <span className="text-[10px] text-gray-400 font-semibold ml-1">({care.reviewsCount})</span>
                                )}
                              </div>

                              <p className="text-xs text-gray-650 leading-relaxed font-medium">
                                {care.description}
                              </p>

                              <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                                <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                                <span className="line-clamp-1">{care.location}</span>
                              </div>

                              {care.highlights && care.highlights.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {care.highlights.map((ht, idx) => (
                                    <span key={idx} className="text-[9px] font-bold bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-500 px-2.5 py-0.5 rounded-md transition-colors">
                                      ✨ {ht}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {care.contactLink && (() => {
                              const isPhoneOrWa = care.contactLink.includes("wa.me") ||
                                                  care.contactLink.includes("api.whatsapp.com") ||
                                                  (!care.contactLink.startsWith("http") && care.contactLink.replace(/[^\d+]/g, "").replace(/\D/g, "").length >= 7);
                              
                              const msg = `Hola! Quiero consultar disponibilidad en "${care.name}" por mi mascota. Lo vi en RutaGuau. ¡Gracias!`;
                              
                              const whatsappLink = isPhoneOrWa
                                ? formatWhatsAppUrl(care.contactLink, msg)
                                : `https://www.google.com/search?q=${encodeURIComponent(care.name + " whatsapp")}`;

                              const isDirectWebOrIg = care.contactLink.includes(".") || care.contactLink.startsWith("http");
                              const resolvedContact = ensureAbsoluteUrl(care.contactLink);
                              const webOrIgLink = isDirectWebOrIg
                                ? resolvedContact
                                : `https://www.google.com/search?q=${encodeURIComponent(care.name + " instagram web oficial")}`;

                              return (
                                <div className="mt-4 pt-3 border-t border-dashed border-gray-150 flex flex-col sm:flex-row gap-2">
                                  {/* WhatsApp Button */}
                                  <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => {
                                      trackEvent("click", { placeName: care.name, clickType: "caretaker" });
                                      copyToClipboard(whatsappLink);
                                      showToast(`🐾 ¡WhatsApp de ${care.name} copiado al portapapeles! Abriendo...`);
                                    }}
                                    className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white font-extrabold text-[10px] rounded-xl tracking-wider flex items-center justify-center gap-1.5 transition-colors text-center uppercase cursor-pointer shadow-3xs"
                                  >
                                    <MessageSquare className="h-3.5 w-3.5" />
                                    <span>{isPhoneOrWa ? "WhatsApp" : "Buscar WhatsApp"}</span>
                                  </a>

                                  {/* Web/Instagram Button */}
                                  <a
                                    href={webOrIgLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => {
                                      trackEvent("click", { placeName: care.name, clickType: isDirectWebOrIg && care.contactLink.toLowerCase().includes("instagram") ? "instagram" : "web" });
                                      copyToClipboard(webOrIgLink);
                                      showToast(`🐾 ¡Sitio web/IG copiado al portapapeles! Abriendo...`);
                                    }}
                                    className={`flex-1 py-1.5 font-extrabold text-[10px] rounded-xl tracking-wider flex items-center justify-center gap-1.5 transition-all text-center uppercase cursor-pointer ${
                                      isDirectWebOrIg
                                        ? care.contactLink.toLowerCase().includes("instagram")
                                          ? "bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white shadow-3xs"
                                          : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-3xs"
                                        : "bg-gray-50 border border-gray-250 text-gray-700 hover:bg-gray-100"
                                    }`}
                                  >
                                    {isDirectWebOrIg && care.contactLink.toLowerCase().includes("instagram") ? (
                                      <Instagram className="h-3.5 w-3.5" />
                                    ) : (
                                      <Globe className="h-3.5 w-3.5" />
                                    )}
                                    <span>
                                      {isDirectWebOrIg
                                        ? care.contactLink.toLowerCase().includes("instagram")
                                          ? "Instagram"
                                          : "Sitio Web"
                                        : "Buscar Web/IG"}
                                    </span>
                                  </a>
                                </div>
                              );
                            })()}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Emergencias y Clínicas Veterinarias de Guardia */}
                {recommendation.veterinaryClinics && recommendation.veterinaryClinics.length > 0 && (
                  <div className="bg-red-50/40 border border-red-100 rounded-3xl p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-extrabold text-xl text-red-950 flex items-center gap-2">
                        <span className="p-1.5 bg-red-600 text-white rounded-lg text-sm font-bold">
                          🚨
                        </span>
                        Salud y Urgencias Veterinarias de Guardia 🏥
                      </h3>
                      <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2.5 py-1 rounded-full uppercase tracking-wider border border-red-200 font-mono">
                        S.O.S MASCOTAS
                      </span>
                    </div>
                    <p className="text-xs text-red-900 font-medium leading-relaxed font-sans">
                      Ante cualquier eventualidad, tené a mano estos centros de asistencia médica recomendados en la zona para resolver consultas urgentes o guardias de emergencias:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {recommendation.veterinaryClinics.map((vet, i) => (
                        <div key={i} className="bg-white border border-red-100 rounded-2xl p-4 flex flex-col justify-between hover:border-red-200 hover:shadow-xs transition-all shadow-2xs">
                          <div className="space-y-2.5">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-bold text-gray-900 text-sm leading-tight">
                                {vet.name}
                              </h4>
                              {vet.isEmergencyCenter && (
                                <span className="text-[9px] font-extrabold bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded-md uppercase tracking-wide shrink-0">
                                  Guardia 24h
                                </span>
                              )}
                            </div>
                            
                            <div className="space-y-1.5">
                              <div className="flex items-start gap-1.5 text-xs text-gray-650">
                                <MapPin className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                                <span className="text-[11px] font-medium leading-tight">{vet.address}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-gray-650">
                                <span className="w-3.5 h-3.5 flex items-center justify-center text-[10px] text-red-400 font-bold shrink-0">📞</span>
                                <span className="text-[11px] font-extrabold text-red-900">{vet.phone}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-gray-650">
                                <span className="w-3.5 h-3.5 flex items-center justify-center text-[10px] text-red-400 font-bold shrink-0">🕒</span>
                                <span className="text-[11px] font-semibold text-gray-600 leading-tight">Atención: {vet.emergencyHours}</span>
                              </div>
                            </div>
                          </div>

                           <div className="mt-4 flex gap-2">
                            <a
                              href={formatWhatsAppUrl(vet.phone, `Hola! Me comunico por una urgencia veterinaria con mi mascota. Lo vi en RutaGuau.`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                const waUrl = formatWhatsAppUrl(vet.phone, `Hola! Me comunico por una urgencia veterinaria con mi mascota. Lo vi en RutaGuau.`);
                                copyToClipboard(waUrl);
                                showToast(`🏥 ¡WhatsApp de Guardia de ${vet.name} copiado al portapapeles! Abriendo...`);
                              }}
                              className="flex-1 py-1.5 bg-green-500 hover:bg-green-600 text-white font-extrabold text-[10px] rounded-lg tracking-wider flex items-center justify-center gap-1.5 transition-colors text-center uppercase cursor-pointer"
                            >
                              💬 WhatsApp de Guardia
                            </a>
                            <a
                              href={`tel:${vet.phone.replace(/\s+/g, "")}`}
                              className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-extrabold text-[10px] rounded-lg tracking-wider flex items-center justify-center gap-1 transition-colors border border-red-100 text-center uppercase shrink-0"
                              title={`Llamar por teléfono a ${vet.name}`}
                            >
                              📞 Llamar
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Checklist & Packing list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-extrabold text-lg text-gray-900 flex items-center gap-2">
                        <FileCheck2 className="h-5 w-5 text-indigo-650" />
                        Checklist del Equipaje
                      </h3>
                      <span className="text-xs bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded-full">
                        {getCompletedPackingCount()} / {recommendation.packingList.length}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400">
                      Chequeá los artículos que vas metiendo al bolso antes de salir de casa:
                    </p>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {recommendation.packingList.map((item, i) => {
                        const isChecked = !!checkedItems[item];
                        return (
                          <div
                            key={i}
                            id={`packing-item-${i}`}
                            onClick={() => togglePackingItem(item)}
                            className={`flex items-start gap-2.5 p-2 rounded-xl transition-colors cursor-pointer ${
                              isChecked 
                                ? "bg-indigo-50/60 text-gray-450 text-decoration-line: line-through" 
                                : "hover:bg-gray-50 text-gray-705"
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                                isChecked 
                                  ? "bg-indigo-600 border-indigo-600 text-white" 
                                  : "border-gray-300"
                              }`}>
                                {isChecked && <Check className="h-3 w-3 inline-block stroke-[3]" />}
                              </div>
                            </div>
                            <span className="text-xs leading-tight">{item}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Travel and Veterinary Tips */}
                  <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs space-y-4">
                    <h3 className="font-display font-extrabold text-lg text-gray-900 flex items-center gap-2">
                      <Info className="h-5 w-5 text-rose-500" />
                      Consejos Sanitarios y de Ruta
                    </h3>

                    <div className="space-y-3">
                      {recommendation.travelTips.map((tip, i) => (
                        <div key={i} className="flex gap-2.5 text-xs text-gray-700 leading-relaxed">
                          <span className="w-5 h-5 bg-rose-50 text-rose-600 font-bold rounded-full flex items-center justify-center shrink-0">
                            {i+1}
                          </span>
                          <p>{tip}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4.5 text-[11px] text-amber-900 space-y-1">
                      <p className="font-bold">⚠️ Atención Sanitaria Regulada:</p>
                      <p className="leading-relaxed">
                        Recordá que para viajar por transporte público o pasar límites provinciales en Argentina, es mandatorio tener libreta sanitaria al día expedida por un veterinario colegiado, con vacunas antirrábicas y desparasitaciones documentadas.
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              <div id="no-itinerary-placeholder" className="bg-white border border-gray-150 rounded-3xl p-10 text-center min-h-[500px] flex flex-col items-center justify-center space-y-6">
                <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-amber-500 shadow-lg transform rotate-[-2deg]">
                  <img
                    src={puppyRoadTrip}
                    alt="Perrito ansioso para viajar"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <h3 className="font-display font-black text-xl text-gray-950">
                    Tu itinerario soñado te espera 🐾
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Suma a tus mejores amigos en los filtros de la izquierda, selecciona la provincia que desean visitar e inicia el armado. 
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-3 w-full max-w-sm pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <span className="text-lg block">🛏️</span>
                    <span className="text-[10px] text-gray-400 font-bold">HOTEL PET-FRIENDLY</span>
                  </div>
                  <div className="text-center">
                    <span className="text-lg block">🍖</span>
                    <span className="text-[10px] text-gray-400 font-bold">SNACKS DE CORTE_N</span>
                  </div>
                  <div className="text-center">
                    <span className="text-lg block">🏞️</span>
                    <span className="text-[10px] text-gray-400 font-bold">LIBRE DE CORREA</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      {/* Decorative footer footer */}
      <footer className="max-w-7xl mx-auto px-4 py-8 border-t border-gray-150 text-center mt-20 space-y-3">
        <p className="text-xs text-gray-400">
          Viajando con mi mejor amigo — Hecho con amor para todos los cat lovers y dog lovers de Argentina. 🧡
        </p>
        <div>
          <button
            type="button"
            onClick={() => setIsStatsModalOpen(true)}
            className="px-4.5 py-2 inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-950 hover:-translate-y-0.5 active:translate-y-0.5 text-white font-extrabold text-[11px] rounded-full uppercase tracking-wider transition-all cursor-pointer shadow-3xs"
          >
            📊 Panel de Estadísticas (Admin)
          </button>
        </div>
      </footer>

      {/* Admin Statistics & Reporting Modal */}
      <AdminStatsModal isOpen={isStatsModalOpen} onClose={() => setIsStatsModalOpen(false)} />

      {/* Dynamic Link Share Modal with High Robustness for Sandbox Iframes */}
      {shareConfig && shareConfig.isOpen && (() => {
        const isItinerary = shareConfig.title.toLowerCase().includes("itinerario");
        const shareText = isItinerary
          ? "🐾 ¡Mirá este itinerario pet-friendly por Argentina que armé en Dejando Huellas! 👇"
          : "🐾 ¡Te comparto Dejando Huellas, un planificador espectacular de escapadas pet-friendly por toda Argentina! 👇";
        
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + "\n" + shareConfig.url)}`;
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareConfig.url)}&text=${encodeURIComponent(shareText)}`;
        const emailUrl = `mailto:?subject=${encodeURIComponent(isItinerary ? "Itinerario de Viaje Pet-Friendly" : "Planificador de Viajes Pet-Friendly - Dejando Huellas")}&body=${encodeURIComponent(shareText + "\n\n" + shareConfig.url)}`;

        return (
          <div id="share-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in duration-205">
            <div className="bg-white border border-gray-150 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
              
              <button
                onClick={() => setShareConfig(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-650 p-1.5 rounded-full hover:bg-gray-100 transition-all cursor-pointer"
                title="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-1.5 pr-8">
                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold tracking-widest uppercase bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full">
                  Compartir de forma segura 🐾
                </span>
                <h3 className="font-display font-extrabold text-xl text-gray-950 flex items-center gap-2 mt-1">
                  {shareConfig.title}
                </h3>
                <p className="text-xs text-gray-550 leading-relaxed">
                  {shareConfig.description}
                </p>
              </div>

              {/* Quick direct share options (No clipboard access needed) */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-extrabold text-gray-405 uppercase tracking-widest block">
                  Opciones directas (Ideal para celulares)
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      trackEvent("click", { clickType: "whatsapp", action: "share_whatsapp" });
                      handleShareLinkClick(whatsappUrl, e, "WhatsApp", shareText + "\n" + shareConfig.url);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba56] text-white font-bold text-xs rounded-xl shadow-xs hover:-translate-y-0.5 active:translate-y-0 text-center transition-all cursor-pointer border border-[#20ba56]/20"
                  >
                    <MessageSquare className="h-4 w-4 fill-white text-[#25D366]" />
                    <span>Compartir por WhatsApp</span>
                  </a>

                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      trackEvent("click", { clickType: "web", action: "share_telegram" });
                      handleShareLinkClick(telegramUrl, e, "Telegram", shareText + "\n" + shareConfig.url);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold text-xs rounded-xl shadow-xs hover:-translate-y-0.5 active:translate-y-0 text-center transition-all cursor-pointer border border-[#0077b5]/20"
                  >
                    <Share2 className="h-4 w-4 text-white" />
                    <span>Compartir por Telegram</span>
                  </a>

                  <a
                    href={shareConfig.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      trackEvent("click", { clickType: "web", action: "open_new_tab" });
                      handleShareLinkClick(shareConfig.url, e, "Nueva Pestaña", shareConfig.url);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl shadow-3xs hover:-translate-y-0.5 active:translate-y-0 text-center transition-all cursor-pointer border border-amber-250"
                  >
                    <Globe className="h-4 w-4 text-amber-700" />
                    <span>Abrir en Nueva Pestaña</span>
                  </a>

                  <a
                    href={emailUrl}
                    onClick={(e) => {
                      // Standard mailto links don't require popup, but we copy for convenience
                      copyToClipboard(shareText + "\n\n" + shareConfig.url);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-xl shadow-3xs hover:-translate-y-0.5 active:translate-y-0 text-center transition-all cursor-pointer border border-gray-200"
                  >
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>Enviar por Correo (Mail)</span>
                  </a>
                </div>
              </div>

              {/* Input field and copy button */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-extrabold text-gray-450 uppercase tracking-widest block">
                    Copiar Enlace Manual
                  </label>
                  {copiedText && (
                    <span className="text-[10px] text-emerald-600 font-bold animate-pulse-soft">
                      ¡Copiado con éxito!
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1.5 pl-3 focus-within:ring-2 focus-within:ring-amber-500/10 focus-within:border-amber-500 transition-all">
                  <input
                    type="text"
                    readOnly
                    value={shareConfig.url}
                    onClick={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.select();
                    }}
                    className="bg-transparent text-xs text-gray-700 font-medium focus:outline-none w-full font-mono select-all overflow-ellipsis cursor-pointer"
                    title="Hacé clic para seleccionar todo"
                  />
                  
                  <button
                    type="button"
                    onClick={() => copyToClipboard(shareConfig.url)}
                    className={`${
                      copiedText 
                        ? "bg-emerald-600 hover:bg-emerald-750 text-white" 
                        : "bg-amber-600 hover:bg-amber-705 text-white"
                    } font-extrabold text-xs px-4 py-2 rounded-lg shrink-0 shadow-3xs hover:shadow-2xs transition-all cursor-pointer active:scale-95`}
                  >
                    {copiedText ? "¡Copiado!" : "Copiar"}
                  </button>
                </div>
                
                <p className="text-[10px] text-gray-400 italic leading-normal">
                  💡 <strong>Nota:</strong> Si visualizás la app dentro del panel de AI Studio, tu navegador podría bloquear la copia automática por directivas del sandboxing. Hacé click en el campo para seleccionarlo manualmente o usá las opciones directas de arriba para enviar sin cargo.
                </p>
              </div>

              <div className="flex justify-end pt-1 border-t border-gray-50">
                <button
                  type="button"
                  onClick={() => setShareConfig(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-150 rounded-xl transition-all cursor-pointer"
                >
                  Listo, cerrar
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* Floating Global Toast Notification */}
      {toastMsg && (
        <div id="global-toast-notification" className="fixed bottom-6 right-6 z-55 bg-gray-900 border border-gray-850 text-white text-xs px-4.5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in slide-in-from-bottom duration-350">
          <span className="text-sm">🎉</span>
          <p className="font-semibold text-gray-100">{toastMsg}</p>
        </div>
      )}

    </div>
  );
}
