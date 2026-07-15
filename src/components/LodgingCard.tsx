import React from "react";
import { RecommendedPlace } from "../types";
import { Check, Hotel, Home, Landmark, PawPrint, BadgePercent, MapPin, DollarSign, MessageSquare, ExternalLink, Instagram, Globe } from "lucide-react";
import { trackEvent } from "../utils/analytics";

const ensureAbsoluteUrl = (url: string): string => {
  if (!url) return "";
  const trimmed = url.trim();
  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }
  if (/^(wa\.me|api\.whatsapp\.com)/i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i.test(trimmed) || trimmed.startsWith("www.")) {
    return `https://${trimmed}`;
  }
  if (trimmed.includes(".") && !trimmed.includes(" ") && trimmed.length > 4) {
    return `https://${trimmed}`;
  }
  return trimmed;
};

interface LodgingCardProps {
  place: RecommendedPlace;
  stayType: string;
  key?: any;
}

export default function LodgingCard({ place, stayType }: LodgingCardProps) {
  // Determine icon based on place name or accommodation type
  const getIcon = () => {
    const nameLower = place.name.toLowerCase();
    if (nameLower.includes("estancia") || nameLower.includes("campo") || nameLower.includes("chacra") || nameLower.includes("eloisa")) {
      return Landmark;
    }
    if (nameLower.includes("cabaña") || nameLower.includes("bungalow") || nameLower.includes("refugio")) {
      return Home;
    }
    return Hotel;
  };

  const IconType = getIcon();

  const getPriceBadge = (price: string) => {
    switch (price) {
      case "Económico":
        return { color: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Económico" };
      case "Moderado":
        return { color: "bg-amber-50 text-amber-700 border-amber-200", label: "Moderado" };
      case "Premium":
        return { color: "bg-rose-50 text-rose-700 border-rose-200", label: "Premium" };
      default:
        return { color: "bg-slate-50 text-slate-700 border-slate-200", label: price || "Moderado" };
    }
  };

  const pb = getPriceBadge(place.priceEstimate);

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
      <div className="flex items-center gap-0.5" title={`${rating} de 5 huellas`}>
        {[1, 2, 3, 4, 5].map((idx) => {
          const isFull = rating >= idx;
          const isHalf = !isFull && rating >= idx - 0.5;
          return (
            <PawPrint
              key={idx}
              className={`h-3 w-3 ${
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

  const [copied, setCopied] = React.useState(false);

  // Helper to format a WhatsApp URL for Argentine mobile/landline formats
  const getWhatsAppUrl = (input: string, message: string = "") => {
    if (!input) return "";
    const trimmed = input.trim();
    if (trimmed.includes("wa.me") || trimmed.includes("api.whatsapp.com")) {
      if (message && !trimmed.includes("text=")) {
        const separator = trimmed.includes("?") ? "&" : "?";
        return `${trimmed}${separator}text=${encodeURIComponent(message)}`;
      }
      return trimmed;
    }
    
    // Extract phone number digits
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
    return "";
  };

  const messageForLodging = `Hola! Vi su hospedaje "${place.name}" en RutaGuau y quería consultar disponibilidad/tarifas para hospedarme con mi mascota. ¡Muchas gracias!`;

  // Determine WhatsApp Contact input
  const rawWhatsApp = place.whatsappLink || (place.contactLink && (
    place.contactLink.includes("wa.me") ||
    place.contactLink.includes("api.whatsapp.com") ||
    (!place.contactLink.startsWith("http") && place.contactLink.replace(/[^\d+]/g, "").replace(/\D/g, "").length >= 7)
  ) ? place.contactLink : "");

  const hasWhatsApp = !!rawWhatsApp;
  const whatsappUrl = hasWhatsApp
    ? getWhatsAppUrl(rawWhatsApp, messageForLodging)
    : `https://www.google.com/search?q=${encodeURIComponent(place.name + " " + place.location + " whatsapp de contacto")}`;

  // Determine Web/Instagram input
  const isContactLinkWeb = !!(place.contactLink && (place.contactLink.includes(".") || place.contactLink.startsWith("http")) && !place.contactLink.includes("wa.me") && !place.contactLink.includes("api.whatsapp.com"));
  const rawWebOrIg = place.webOrInstagramLink || (isContactLinkWeb ? (place.contactLink || "") : "");

  const hasWebOrIg = !!rawWebOrIg;
  const directWebOrInstagramUrl = hasWebOrIg
    ? ensureAbsoluteUrl(rawWebOrIg)
    : `https://www.google.com/search?q=${encodeURIComponent(place.name + " " + place.location + " instagram web oficial")}`;

  const isInstagram = rawWebOrIg.toLowerCase().includes("instagram");
  const isOfficialWeb = hasWebOrIg && !isInstagram;

  const handleLinkClick = (url: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.error("No se pudo copiar de forma directa:", err);
    }
  };

  return (
    <div
      id={`lodging-${place.name.replace(/\s+/g, "-").toLowerCase()}`}
      className="bg-white border border-gray-150 rounded-2xl p-5 hover:border-amber-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between relative"
    >
      {copied && (
        <div className="absolute top-3 right-3 bg-emerald-50 border border-emerald-250 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm animate-pulse-soft z-10">
          ¡Copiado al portapapeles! 🐾
        </div>
      )}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-amber-50 rounded-xl text-amber-700 border border-amber-100">
              <IconType className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-amber-900 border border-amber-100 bg-amber-100/55 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Recomendado
              </span>
              <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3 text-red-500 shrink-0" />
                {place.location}
              </p>
            </div>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-lg border ${pb.color}`}>
            {pb.label}
          </span>
        </div>

        <h3 className="font-display font-extrabold text-gray-905 text-lg leading-snug">
          {place.name}
        </h3>

        <p className="text-sm text-gray-650 mt-2 leading-relaxed">
          {place.description}
        </p>

        {/* Highlights */}
        {place.highlights && place.highlights.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Puntos Destacados</p>
            {place.highlights.map((hl, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                <PawPrint className="h-3.5 w-3.5 text-amber-500 fill-amber-500 mt-0.5 shrink-0" />
                <span>{hl}</span>
              </div>
            ))}
          </div>
        )}

        {/* Portal Reviews / Ratings */}
        {place.reviews && place.reviews.length > 0 && (
          <div className="mt-4 pt-3.5 border-t border-gray-100 space-y-2">
            <p className="text-xs font-bold text-gray-750 uppercase tracking-wide flex items-center gap-1">
              <PawPrint className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              Valoraciones en Portales (Huellas)
            </p>
            <div className="flex flex-wrap gap-1.5">
              {place.reviews.map((rev, i) => {
                const plat = rev.platform.toLowerCase();
                let badgeStyle = "bg-sky-50 text-sky-800 border-sky-150";
                if (plat.includes("trip")) {
                  badgeStyle = "bg-emerald-50 text-emerald-850 border-emerald-150";
                } else if (plat.includes("goog")) {
                  badgeStyle = "bg-amber-50 text-amber-900 border-amber-250";
                }
                return (
                  <div key={i} className={`text-[11px] px-2.5 py-1.5 rounded-lg border flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-1.5 font-medium ${badgeStyle}`}>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="font-bold">{rev.platform}</span>
                      <span className="opacity-40">|</span>
                      <span className="font-extrabold">{rev.rating}</span>
                    </div>
                    {renderPawRating(rev.rating)}
                    {rev.commentCount && (
                      <span className="text-[10px] opacity-70 font-normal shrink-0">({rev.commentCount})</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* House Policies (Pet-Friendly Specific Rules) */}
      {place.petPolicies && (
        <div className="mt-4 pt-3.5 border-t border-gray-100 space-y-2">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
            <span className="text-sm">⚖️</span>
            Normas de Convivencia y Políticas
          </p>
          <div className="bg-amber-50/25 border border-amber-200/50 rounded-xl p-3 space-y-2 text-[11px] text-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <span className="font-bold text-gray-800 uppercase text-[9px] tracking-wider block">🐾 Tamaños / Pesos</span>
                <span className="font-medium text-gray-600 block leading-tight">{place.petPolicies.allowedSizes}</span>
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-gray-800 uppercase text-[9px] tracking-wider block">🦮 Uso de Correa</span>
                <span className="font-medium text-gray-600 block leading-tight">{place.petPolicies.leashRequirement}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-dashed border-amber-100 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <span className="font-bold text-gray-800 uppercase text-[9px] tracking-wider block">🪙 Tarifa Extra</span>
                <span className="font-medium text-gray-600 block leading-tight">{place.petPolicies.extraFeeForPets}</span>
              </div>
              {place.petPolicies.additionalDetails && (
                <div className="space-y-0.5">
                  <span className="font-bold text-gray-800 uppercase text-[9px] tracking-wider block">📌 Observaciones</span>
                  <span className="font-medium text-gray-600 block leading-tight">{place.petPolicies.additionalDetails}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pet Amenities */}
      {place.petAmenities && place.petAmenities.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100/40">
          <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1">
            <BadgePercent className="h-3.5 w-3.5" />
            Servicios para Mascotas
          </p>
          <div className="flex flex-wrap gap-1.5">
            {place.petAmenities.map((am, i) => (
              <span
                key={i}
                className="bg-white border border-emerald-200/65 text-emerald-800 text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1"
              >
                <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                {am}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Traveler Comments */}
      {place.travelerComments && place.travelerComments.length > 0 && (
        <div className="mt-4 pt-3.5 border-t border-gray-100 space-y-2">
          <p className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5 text-indigo-500" />
            Opiniones de Viajeros
          </p>
          <div className="space-y-2">
            {place.travelerComments.slice(0, 2).map((comm, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-xs space-y-1">
                <p className="text-slate-700 italic leading-snug">
                  "{comm.text}"
                </p>
                <div className="flex justify-between items-center text-[10px] text-slate-450 font-medium">
                  <span>👤 {comm.author}</span>
                  {comm.platform && <span className="opacity-75">{comm.platform}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Direct Contact Buttons */}
      <div className="mt-4 pt-3.5 border-t border-gray-100 space-y-2">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Dynamic WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              trackEvent("click", { placeName: place.name, clickType: "whatsapp" });
              handleLinkClick(whatsappUrl, e);
            }}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer ${
              hasWhatsApp
                ? "bg-green-500 hover:bg-green-600 text-white shadow-3xs"
                : "bg-gray-50 border border-gray-250 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>{hasWhatsApp ? "WhatsApp Directo" : "Buscar WhatsApp"}</span>
          </a>

          {/* Dynamic Web/Instagram Button */}
          <a
            href={directWebOrInstagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              trackEvent("click", { placeName: place.name, clickType: isInstagram ? "instagram" : "web" });
              handleLinkClick(directWebOrInstagramUrl, e);
            }}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer ${
              hasWebOrIg
                ? isInstagram
                  ? "bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white shadow-3xs"
                  : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-3xs"
                : "bg-gray-50 border border-gray-250 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {hasWebOrIg && isInstagram ? (
              <Instagram className="h-4 w-4" />
            ) : (
              <Globe className="h-4 w-4" />
            )}
            <span>
              {hasWebOrIg
                ? isInstagram
                  ? "Instagram"
                  : "Sitio Web"
                : "Buscar Web/IG"}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
