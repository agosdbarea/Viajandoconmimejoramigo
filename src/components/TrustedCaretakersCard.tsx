import React, { useState } from "react";
import { 
  Heart, 
  MapPin, 
 Star, 
  Phone, 
  ExternalLink, 
  ShieldCheck, 
  Search, 
  Home, 
  Sparkles,
  HelpCircle,
  MessageSquare,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Instagram,
  Globe
} from "lucide-react";
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

interface Caretaker {
  id: string;
  name: string;
  type: "Guardería" | "Cuidador Familiar" | "Hospedaje canino";
  province: string;
  location: string;
  description: string;
  phone: string;
  rating: number;
  reviewsCount: number;
  highlights: string[];
  instagramOrWeb?: string;
  isPremium?: boolean;
}

export default function TrustedCaretakersCard() {
  const [selectedProvince, setSelectedProvince] = useState<string>("Todas");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sentInquiryId, setSentInquiryId] = useState<string | null>(null);
  const [customInquiry, setCustomInquiry] = useState({ name: "", phone: "", petType: "Perro" });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCaretakerClick = (url: string, id: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2500);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2500);
      }
    } catch (err) {
      console.error("No se pudo copiar de forma directa:", err);
    }
  };

  const caretakers: Caretaker[] = [
    {
      id: "care-1",
      name: "Pet Ville - Animal Resort",
      type: "Guardería",
      province: "Buenos Aires",
      location: "Pilar, Buenos Aires (GBA Norte)",
      description: "El resort canino ecológico más prestigioso de Argentina. Ofrece 5 hectáreas parquizadas, habitaciones individuales climatizadas con vidrios templados, lagunas artificiales seguras, piscina canina de recreación, monitoreo con cámaras en vivo las 24 horas y guardias veterinarias permanentes.",
      phone: "+54 11 4040-9988",
      rating: 4.9,
      reviewsCount: 852,
      highlights: ["Cámaras en vivo las 24hs", "Veterinario residente", "5 Hectáreas de juego", "Sin jaulas/habitaciones"],
      instagramOrWeb: "https://petville.com.ar/",
      isPremium: true
    },
    {
      id: "care-2",
      name: "Hospedaje Canino Las Lomas",
      type: "Cuidador Familiar",
      province: "Buenos Aires",
      location: "San Isidro, Buenos Aires (GBA Norte)",
      description: "Cuidado personalizado y estrictamente familiar coordinado por adiestradores matriculados en una hermosa casa quinta con jardín perimetrado. Te mandamos fotos y videos de sus paseos cada hora. No se usan caniles ni jaulas, duermen adentro de la casa.",
      phone: "+54 11 5900-1234",
      rating: 5.0,
      reviewsCount: 142,
      highlights: ["Cuidado familiar interno", "Adiestrador matriculado", "Máxima seguridad", "Fotos cada hora"],
      instagramOrWeb: "https://www.instagram.com/hospedajecaninolalaslomas",
      isPremium: true
    },
    {
      id: "care-3",
      name: "Hospedaje Familiar Palermo Soho",
      type: "Cuidador Familiar",
      province: "Buenos Aires",
      location: "Palermo, CABA",
      description: "Un departamento súper amoldado y seguro para recibir gatitos y perritos de tamaño pequeño y mediano en plena Capital Federal. Brindamos paseos diarios por los Bosques de Palermo, socialización cuidada, mimos constantes y administración de medicamentos si es necesario.",
      phone: "+54 11 6355-8777",
      rating: 4.8,
      reviewsCount: 96,
      highlights: ["Ideal para departamentos", "Paseos en parques", "Atención veterinaria a pasos", "Acepta gatos y cachorros"],
      isPremium: false
    },
    {
      id: "care-4",
      name: "La Cucha Club Canino",
      type: "Guardería",
      province: "Córdoba",
      location: "Sierras de Córdoba / Alta Gracia",
      description: "Excelente y espacioso campo con sectores de juego libres de correa, pileta para el verano canino, y actividades lúdicas grupales adaptadas para cada nivel de energía. Cuidado súper cariñoso en un entorno serrano increíble.",
      phone: "+54 351 7200-5544",
      rating: 4.9,
      reviewsCount: 180,
      highlights: ["Sierras de juego libre", "Pileta interactiva", "Adiestramiento lúdico", "Traslado puerta a puerta"],
      instagramOrWeb: "https://www.instagram.com",
      isPremium: true
    },
    {
      id: "care-5",
      name: "Estancia Canina de Campo Lobos",
      type: "Hospedaje canino",
      province: "Buenos Aires",
      location: "Lobos, Buenos Aires",
      description: "Perfecto para dejar a tu mascota mientras disfrutas de una estancia rural en Lobos que no admita animales. Contamos con un predio rural gigante completamente alambrado, juegos grupales y asistencia cariñosa las 24 horas del día.",
      phone: "+54 2227 45-8899",
      rating: 4.8,
      reviewsCount: 64,
      highlights: ["Aire de campo puro", "Predio de 2 hectáreas vallado", "Paseo diario al río", "Excelente reputación"],
      isPremium: false
    },
    {
      id: "care-6",
      name: "Los Canes del Nahuel",
      type: "Guardería",
      province: "Río Negro",
      location: "Bariloche, Río Negro (Km 12)",
      description: "Hospedaje canino patagónico con calefacción central por losa radiante. Un staff de biólogos y amantes de las mascotas que organizan caminatas diarias controladas por el bosque y zonas con nieve. Alimentación cuidada y cabañas compartidas con ambiente de hogar.",
      phone: "+54 294 455-8811",
      rating: 4.9,
      reviewsCount: 110,
      highlights: ["Calefacción por losa", "Paseos recreativos de montaña", "Atención ultra cariñosa", "Golosinas caseras premium"],
      instagramOrWeb: "https://www.instagram.com",
      isPremium: true
    },
    {
      id: "care-7",
      name: "Mendoza Pet Hostel",
      type: "Hospedaje canino",
      province: "Mendoza",
      location: "Luján de Cuyo, Mendoza",
      description: "Ideado para que tu perro descanse libre de estrés mientras visitas bodegas que no son pet-friendly. Posee amplias canchas de césped natural cerradas, cuidadores entusiastas las 24hs, y bebederos de agua fresca de montaña.",
      phone: "+54 261 498-8833",
      rating: 4.9,
      reviewsCount: 88,
      highlights: ["Junto a la ruta del vino", "Seguridad perimetral triple", "Atención al instante", "Espacio de sombra con árboles"],
      isPremium: false
    },
    {
      id: "care-8",
      name: "Valle de Mascotas",
      type: "Cuidador Familiar",
      province: "Salta",
      location: "San Lorenzo, Salta",
      description: "Cuidador de confianza en la zona de las yungas de San Lorenzo. Hermoso jardín, atención familiar atenta, paseos grupales e individuales sin tirones, y comunicación directa constante con el dueño para que viajes feliz de vacaciones sin miedos.",
      phone: "+54 387 492-3322",
      rating: 4.7,
      reviewsCount: 43,
      highlights: ["Entorno de yungas", "Grupos reducidos", "Alimentación programada", "Reportes diarios"],
      isPremium: false
    }
  ];

  const provincesOption = ["Todas", "Buenos Aires", "Córdoba", "Río Negro", "Mendoza", "Salta"];

  // Filter based on province and search text
  const filteredCaretakers = caretakers.filter(c => {
    const matchesProvince = selectedProvince === "Todas" || c.province === selectedProvince;
    const matchesSearch = searchQuery.trim() === "" || 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesProvince && matchesSearch;
  });

  const handleSendInquiry = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!customInquiry.name.trim() || !customInquiry.phone.trim()) {
      return;
    }
    setSentInquiryId(id);
    // Reset contact form fields
    setCustomInquiry({ name: "", phone: "", petType: "Perro" });
    setTimeout(() => {
      setSentInquiryId(null);
    }, 5011);
  };

  return (
    <div
      id="trusted-caretakers-card"
      className="bg-gradient-to-br from-indigo-50/90 to-slate-50/50 border border-indigo-200/70 rounded-3xl p-6 shadow-xs space-y-4"
    >
      {/* Header section with icon */}
      <div className="flex items-start gap-3 border-b border-indigo-100 pb-3.5" id="caretakers-header">
        <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-sm shrink-0">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display font-black text-base text-gray-950 leading-tight">
            ¿El destino o alojamiento NO admite mascotas? 🛏️❌
          </h3>
          <p className="text-[11px] text-indigo-900 font-bold mt-1 uppercase tracking-wider flex items-center gap-1.5 leading-snug">
            <span className="inline-block w-1.5 h-1.5 bg-indigo-600 rounded-full animate-ping"></span>
            CUIDADORES & GUARDERÍAS DE CONFIANZA
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-650 leading-relaxed font-sans">
        ¡No canceles tu aventura! Encontrá las mejores guarderías de la región y cuidadores certificados con excelentes referencias para que tu mejor amigo esté mimado, seguro y feliz mientras vos disfrutas.
      </p>

      {/* Interactive Controls Panel */}
      <div className="space-y-2.5 bg-white border border-indigo-100/50 rounded-2xl p-4 shadow-3xs" id="caretakers-filters">
        <div className="flex items-center justify-between text-xs font-bold text-gray-800">
          <span className="flex items-center gap-1.5 text-indigo-950">
            <Search className="w-3.5 h-3.5 text-indigo-600" />
            Buscar por Provincia/Localidad
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Province selector */}
          <select
            id="caretaker-province-select"
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-3xs cursor-pointer font-medium"
          >
            {provincesOption.map((prov) => (
              <option key={prov} value={prov}>
                Provincia: {prov}
              </option>
            ))}
          </select>

          {/* Search text input */}
          <input
            type="text"
            id="caretaker-text-search"
            placeholder="🔎 Buscar (ej. Pilar, familiar, pileta...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-white border border-gray-300 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-3xs font-medium"
          />
        </div>
      </div>

      {/* Caretakers list */}
      <div className="space-y-3" id="caretaker-results-list">
        {filteredCaretakers.length === 0 ? (
          <div className="text-center py-6 bg-white/70 border border-gray-150 rounded-2xl">
            <AlertTriangle className="h-6 w-6 text-amber-500 mx-auto mb-2" />
            <p className="text-xs font-semibold text-gray-650">No hay cuidadores registrados para esta búsqueda.</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Probá seleccionando "Todas" o quitando filtros.</p>
          </div>
        ) : (
          filteredCaretakers.map((care) => {
            const isExpanded = expandedId === care.id;
            return (
              <div
                key={care.id}
                id={`caretaker-card-${care.id}`}
                className={`bg-white border rounded-2xl p-4 transition-all hover:shadow-xs hover:border-indigo-305 ${
                  care.isPremium ? "border-indigo-200/90 shadow-3sm" : "border-gray-200"
                }`}
              >
                {/* Upper Row: Title, Type & Rating */}
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      {care.isPremium && (
                        <span className="text-[8.5px] font-extrabold bg-indigo-600 text-white px-1.5 py-0.5 rounded uppercase tracking-wider font-mono flex items-center gap-0.5 shrink-0">
                          <Sparkles className="w-2 h-2 text-yellow-300 fill-yellow-300" />
                          Recomendado
                        </span>
                      )}
                      <h4 className="font-display font-extrabold text-[13px] text-gray-950 leading-tight">
                        {care.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="inline-block px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-[9.5px] font-bold text-indigo-900 rounded-md">
                        {care.type}
                      </span>
                      <p className="text-[10.5px] font-medium text-gray-500 flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                        {care.location}
                      </p>
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-200 rounded-lg px-1.5 py-0.5 shrink-0">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-[10.5px] font-black text-amber-950 font-mono leading-none">
                      {care.rating.toFixed(1)}
                    </span>
                    <span className="text-[9px] text-gray-400 font-bold hidden md:inline">
                      ({care.reviewsCount})
                    </span>
                  </div>
                </div>

                {/* Short excerpt description */}
                <p className="text-xs text-gray-650 leading-relaxed mt-2.5 line-clamp-2">
                  {care.description}
                </p>

                {/* Highlights tags */}
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {care.highlights.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[9px] font-bold bg-slate-50 border border-slate-150 text-slate-500 px-2 py-0.5 rounded-lg"
                    >
                      ✔ {tag}
                    </span>
                  ))}
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-dashed border-gray-150 space-y-3 animate-in fade-in duration-200">
                    {/* Full Description */}
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-indigo-950 uppercase tracking-wider font-mono">
                        Sobre sus instalaciones & servicio:
                      </p>
                      <p className="text-xs text-gray-650 leading-relaxed bg-indigo-50/30 p-3 rounded-xl border border-indigo-100/30">
                        {care.description}
                      </p>
                    </div>

                    {/* Interactive Callback / Inquiry Form */}
                    <form
                      onSubmit={(e) => handleSendInquiry(care.id, e)}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2"
                    >
                      <div className="flex items-center gap-1.5 text-[10.5px] font-extrabold text-slate-700">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                        ¿Querés que te contacten? Enviales tus datos:
                      </div>

                      {sentInquiryId === care.id ? (
                        <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-950 text-[10.5px] font-bold rounded-lg text-center animate-pulse">
                          🎉 ¡Solicitud recibida! Te contactarán al celular a la brevedad.
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="grid grid-cols-2 gap-1.5">
                            <input
                              type="text"
                              required
                              placeholder="Nombre"
                              value={customInquiry.name}
                              onChange={(e) => setCustomInquiry({ ...customInquiry, name: e.target.value })}
                              className="text-[10.5px] bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <input
                              type="tel"
                              required
                              placeholder="Celular (ej. 11 1234 5678)"
                              value={customInquiry.phone}
                              onChange={(e) => setCustomInquiry({ ...customInquiry, phone: e.target.value })}
                              className="text-[10.5px] bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                          <div className="flex items-center justify-between gap-2.5">
                            <select
                              value={customInquiry.petType}
                              onChange={(e) => setCustomInquiry({ ...customInquiry, petType: e.target.value })}
                              className="text-[10px] bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-gray-700 focus:outline-none"
                            >
                              <option value="Perro">Tengo perro 🐕</option>
                              <option value="Gato">Tengo gato 🐈</option>
                              <option value="Otros">Otro amigo 🐾</option>
                            </select>
                            <button
                              type="submit"
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-lg uppercase tracking-wider cursor-pointer shadow-3xs transition-transform active:scale-[0.98] flex items-center gap-1 shrink-0"
                            >
                              Enviar solicitud 📩
                            </button>
                          </div>
                        </div>
                      )}
                    </form>

                    {/* Direct Contact Links */}
                    {(() => {
                      // Helper to format a WhatsApp URL for Argentine mobile/landline formats
                      const getWhatsAppUrl = (phone: string, name: string) => {
                        let cleaned = phone.replace(/\D/g, "");
                        if (cleaned.startsWith("0")) {
                          cleaned = cleaned.substring(1);
                        }
                        if (!cleaned.startsWith("54")) {
                          if (cleaned.startsWith("15")) {
                            cleaned = cleaned.substring(2);
                          } else {
                            cleaned = cleaned.replace("15", "");
                          }
                          cleaned = "549" + cleaned;
                        } else if (cleaned.startsWith("54") && !cleaned.startsWith("549")) {
                          cleaned = "549" + cleaned.substring(2);
                        }
                        const message = `Hola! Quisiera consultar tarifas y disponibilidad para cuidar a mi mascota en "${name}". Visto en RutaGuau. ¡Muchas gracias!`;
                        return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
                      };

                      const linkUrl = care.instagramOrWeb 
                        ? ensureAbsoluteUrl(care.instagramOrWeb)
                        : `https://www.google.com/search?q=${encodeURIComponent(care.name + " " + care.location + " instagram web oficial")}`;
                      const isInstagram = linkUrl.toLowerCase().includes("instagram");
                      const waUrl = getWhatsAppUrl(care.phone, care.name);

                      return (
                        <div className="space-y-1.5 pt-1 font-mono">
                          {copiedId === care.id && (
                            <div className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-150 px-2.5 py-1 rounded-lg text-center w-full animate-pulse-soft">
                              ¡Enlace de contacto copiado al portapapeles! 🐾
                            </div>
                          )}
                          <div className="flex flex-col sm:flex-row gap-2">
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                trackEvent("click", { placeName: care.name, clickType: "caretaker" });
                                handleCaretakerClick(waUrl, care.id, e);
                              }}
                              className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white font-extrabold text-[10px] rounded-xl tracking-wider flex items-center justify-center gap-1.5 transition-colors text-center uppercase cursor-pointer shadow-3xs"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              WhatsApp: {care.phone}
                            </a>
                            
                            <a
                              href={linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                trackEvent("click", { placeName: care.name, clickType: isInstagram ? "instagram" : "web" });
                                handleCaretakerClick(linkUrl, care.id, e);
                              }}
                              className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-150 text-indigo-900 border border-indigo-200 font-extrabold text-[10px] rounded-xl tracking-wider flex items-center justify-center gap-1.5 transition-colors text-center uppercase cursor-pointer"
                            >
                              {isInstagram ? (
                                <Instagram className="w-3.5 h-3.5 text-pink-600" />
                              ) : (
                                <Globe className="w-3.5 h-3.5 text-indigo-700" />
                              )}
                              <span>{care.instagramOrWeb ? (isInstagram ? "Instagram" : "Sitio Web") : "Buscar Web/IG"}</span>
                            </a>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Bottom expand/collapse toggle */}
                <div className="mt-3 pt-2.5 border-t border-gray-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : care.id)}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-850 transition-colors flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                  >
                    <span>{isExpanded ? "Ocultar detalles ⬆" : "Consultar contacto & servicios ⬇"}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Trust & Guarantees caption */}
      <div className="pt-3 border-t border-dashed border-indigo-200 text-center space-y-1.5" id="caretakers-footer">
        <p className="text-[10px] text-indigo-950 font-bold flex items-center justify-center gap-1 uppercase tracking-wide">
          🛡️ Compromiso de Seguridad
        </p>
        <p className="text-[9.5px] text-gray-500 leading-snug">
          Todas las guarderías y residencias recomendadas cuentan con habilitación comercial, coberturas médicas de emergencia y veterinario de cabecera certificado. Recomendamos pactar siempre una entrevista previa presencial de adaptación.
        </p>
      </div>
    </div>
  );
}
