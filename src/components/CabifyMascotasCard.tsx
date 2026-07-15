import React, { useState } from "react";
import { 
  Car, 
  MapPin, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  Smartphone, 
  X, 
  ChevronRight, 
  AlertTriangle,
  Compass,
  DollarSign
} from "lucide-react";
import { trackEvent } from "../utils/analytics";

interface CabifyOption {
  id: string;
  name: string;
  price: number;
  description: string;
  eta: string;
  isPetFriendly: boolean;
  tag?: string;
}

export default function CabifyMascotasCard() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [petSize, setPetSize] = useState("Pequeño");
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedOptions, setSimulatedOptions] = useState<CabifyOption[] | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [copiedRoute, setCopiedRoute] = useState(false);

  const handleCopyRoute = () => {
    navigator.clipboard.writeText(`Ruta de viaje: Desde ${origin} hasta ${destination}`);
    setCopiedRoute(true);
    setTimeout(() => setCopiedRoute(false), 2000);
  };

  // Preset quick options to make testing fun and instant
  const presetTrips = [
    { from: "Aeroparque Jorge Newbery (CABA)", to: "Palermo Soho", dist: 5.4 },
    { from: "Plaza de Mayo (Microcentro)", to: "Bosques de Palermo", dist: 8.2 },
    { from: "Terminal de Ómnibus de Retiro", to: "San Telmo", dist: 4.8 },
    { from: "Quinta de Olivos (GBA Norte)", to: "Recoleta", dist: 14.5 }
  ];

  const handleApplyPreset = (from: string, to: string) => {
    setOrigin(from);
    setDestination(to);
    setSimulatedOptions(null);
    setSelectedOptionId(null);
  };

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) return;

    trackEvent("click", { placeName: `Simulación Cabify: ${origin} a ${destination}`, clickType: "cabify" });

    setIsSimulating(true);
    setSimulatedOptions(null);

    // Simulate search delay of 1.2 seconds for great feedback UX
    setTimeout(() => {
      // Calculate a randomized but proportional price based on string lengths or mock distance
      const distanceFactor = Math.min(18, Math.max(4, (origin.length + destination.length) / 4));
      const basePrice = Math.round(distanceFactor * 650);
      
      const options: CabifyOption[] = [
        {
          id: "cabify-mascotas",
          name: "Cabify Mascotas",
          price: Math.round(basePrice * 1.25),
          description: "Viajá legalmente con tu perro o gato sin cargo extra oculto. El auto cuenta con funda protectora especial para tapizado.",
          eta: "3-5 min",
          isPetFriendly: true,
          tag: "Apto Mascotas 🐾"
        },
        {
          id: "cabify-standard",
          name: "Cabify Light",
          price: basePrice,
          description: "Servicio convencional. El conductor tiene derecho a rechazar el viaje si transportás un animal sin transportadora rígida.",
          eta: "2 min",
          isPetFriendly: false
        },
        {
          id: "cabify-premium",
          name: "Cabify Executive",
          price: Math.round(basePrice * 1.5),
          description: "Vehículos de alta gama. Exclusivo pasajeros corporativos, no admite el traslado de mascotas sueltas.",
          eta: "6 min",
          isPetFriendly: false
        }
      ];

      setSimulatedOptions(options);
      setSelectedOptionId("cabify-mascotas"); // Auto-select the mascot option
      setIsSimulating(false);
    }, 1200);
  };

  const activeOption = simulatedOptions?.find(opt => opt.id === selectedOptionId);

  return (
    <div
      id="cabify-mascotas-card"
      className="bg-gradient-to-br from-purple-50/90 to-slate-50 border border-purple-200 rounded-3xl p-6 shadow-xs space-y-5"
    >
      {/* Title & Badge */}
      <div className="flex items-start gap-3 border-b border-purple-100 pb-3" id="cabify-header">
        <div className="p-2.5 bg-purple-600 rounded-2xl text-white shadow-sm shrink-0 flex items-center justify-center">
          <Car className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display font-black text-base text-gray-950 leading-tight">
            ¿Necesitás moverte por la Ciudad en auto con tu mascota y no sabés cómo ir? 🚗🐾
          </h3>
          <p className="text-[10px] text-purple-900 font-bold mt-1 uppercase tracking-wider flex items-center gap-1.5 leading-snug">
            <span className="inline-block w-1.5 h-1.5 bg-purple-600 rounded-full animate-ping"></span>
            SOLUCIÓN OFICIAL: CABIFY MASCOTAS
          </p>
        </div>
      </div>

      {/* Educational Walkthrough on How It Works */}
      <div className="bg-white/80 border border-purple-100/60 rounded-2xl p-4 space-y-3 shadow-3xs" id="cabify-explanation">
        <h4 className="font-display font-extrabold text-[12.5px] text-purple-950 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-purple-600" />
          ¿Cómo funciona Cabify Mascotas de manera oficial?
        </h4>
        <p className="text-xs text-gray-650 leading-relaxed font-sans">
          Ya no tenés que rogarle al chofer ni esconder a tu mascota. Cabify ofrece una categoría específica adaptada para viajar de forma legal, predecible y segura con tu mejor amigo dentro de Buenos Aires y ciudades del interior del país.
        </p>

        {/* Step-by-Step guides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1.5">
          <div className="bg-purple-50/40 border border-purple-100/50 p-2.5 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center font-mono text-[10px] font-black">
                1
              </span>
              <p className="text-[11px] font-bold text-gray-900">Pedí tu Cabify</p>
            </div>
            <p className="text-[10px] text-gray-550 leading-relaxed font-sans">
              Abrí la app normal de Cabify. Escribí tu punto de origen y tu destino deseado en el buscador.
            </p>
          </div>

          <div className="bg-purple-50/40 border border-purple-100/50 p-2.5 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center font-mono text-[10px] font-black">
                2
              </span>
              <p className="text-[11px] font-bold text-gray-900">Elegí la opción</p>
            </div>
            <p className="text-[10px] text-gray-550 leading-relaxed font-sans">
              Deslizá el catálogo de vehículos hacia abajo y seleccioná la categoría exclusiva <span className="font-bold text-purple-950">"Cabify Mascotas"</span>.
            </p>
          </div>

          <div className="bg-purple-50/40 border border-purple-100/50 p-2.5 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center font-mono text-[10px] font-black flex-shrink-0">
                3
              </span>
              <p className="text-[11px] font-bold text-gray-900">Viajá con manta</p>
            </div>
            <p className="text-[10px] text-gray-550 leading-relaxed font-sans">
              El vehículo vendrá equipado con una manta especial sobre el asiento trasero para cuidar el tapizado.
            </p>
          </div>
        </div>
      </div>

      {/* Simulator Interface Container */}
      <div className="bg-white border border-purple-200/50 rounded-2xl p-4.5 space-y-3.5 shadow-3xs" id="cabify-simulator">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-purple-950 uppercase tracking-wider flex items-center gap-1">
            <Compass className="w-4 h-4 text-purple-600 animate-spin-slow" />
            Simulador Digital de Viajes Caninos
          </span>
          <span className="text-[9.5px] font-bold bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full uppercase">
            Interactiva
          </span>
        </div>

        {/* Quick presets list */}
        <div className="space-y-1 pt-0.5">
          <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide">
            📍 O elegí un trayecto de prueba rápido:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {presetTrips.map((p, pIdx) => (
              <button
                key={pIdx}
                type="button"
                onClick={() => handleApplyPreset(p.from, p.to)}
                className="text-[10px] bg-purple-50/60 hover:bg-purple-100 text-purple-900 border border-purple-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-left font-medium max-w-xs truncate"
              >
                {p.from.split(" (")[0]} ➡ {p.to}
              </button>
            ))}
          </div>
        </div>

        {/* User Input Form */}
        <form onSubmit={handleSimulate} className="space-y-3 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Origin input */}
            <div className="space-y-1">
              <label htmlFor="cabify-origin" className="text-[10.5px] font-bold text-gray-700 flex items-center gap-1">
                <span className="text-emerald-500 text-xs">●</span> Origen del viaje
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="cabify-origin"
                  required
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="Ej: Aeroparque Jorge Newbery..."
                  className="w-full text-xs bg-slate-50 border border-gray-300 rounded-xl pl-3 pr-8 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500 font-medium"
                />
                {origin && (
                  <button
                    type="button"
                    onClick={() => setOrigin("")}
                    className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Destination input */}
            <div className="space-y-1">
              <label htmlFor="cabify-destination" className="text-[10.5px] font-bold text-gray-700 flex items-center gap-1">
                <span className="text-red-500 text-xs">■</span> Destino final
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="cabify-destination"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Ej: Palermo Hollywood..."
                  className="w-full text-xs bg-slate-50 border border-gray-300 rounded-xl pl-3 pr-8 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500 font-medium"
                />
                {destination && (
                  <button
                    type="button"
                    onClick={() => setDestination("")}
                    className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            {/* Tamaños de mascota selector */}
            <div className="flex items-center gap-2">
              <span className="text-[10.5px] font-bold text-gray-750">Tamaño de mascota:</span>
              <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg border border-gray-200">
                {["Pequeño", "Mediano", "Grande"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setPetSize(size)}
                    className={`text-[9.5px] font-bold px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      petSize === size 
                        ? "bg-purple-600 text-white shadow-2xs" 
                        : "text-gray-650 hover:bg-slate-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Simulator Button */}
            <button
              type="submit"
              disabled={isSimulating || !origin.trim() || !destination.trim()}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-black text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs transition-transform active:scale-[0.98]"
            >
              {isSimulating ? (
                <>
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Buscando Autos Cercanos...
                </>
              ) : (
                <>
                  Simular Viaje con Cabify 🚕✨
                </>
              )}
            </button>
          </div>
        </form>

        {/* Search Results Simulator Panel (Visible once loaded) */}
        {simulatedOptions && (
          <div className="pt-3 border-t border-dashed border-purple-100 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300" id="simulation-results">
            {/* Travel Route Header Visualization */}
            <div className="bg-slate-50/70 border border-slate-150 p-3 rounded-xl flex items-center justify-between text-xs font-mono text-gray-500">
              <span className="truncate max-w-[45%] font-medium text-gray-800">{origin}</span>
              <span className="text-purple-300 text-sm px-2 animate-pulse font-bold flex items-center gap-1">
                🚘💨
              </span>
              <span className="truncate max-w-[45%] font-medium text-gray-850 text-right">{destination}</span>
            </div>

            {/* Real Direct Navigation and Copy Shortcut */}
            <div className="flex gap-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("click", { placeName: `Mapa Cabify: ${origin} a ${destination}`, clickType: "cabify" })}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-705 hover:to-indigo-705 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs cursor-pointer transition-transform active:scale-[0.98] text-center"
              >
                <span>Navegar Ruta en Mapa 🗺️</span>
              </a>
              <button
                type="button"
                onClick={handleCopyRoute}
                className={`px-3 py-2 border rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 ${
                  copiedRoute 
                    ? "bg-purple-600 text-white border-purple-750" 
                    : "bg-slate-50 text-gray-700 border-gray-250 hover:bg-slate-100"
                }`}
                title="Copiar texto de ruta rápida al portapapeles"
              >
                <span>{copiedRoute ? "¡Copiada! 📋" : "Copiar Ruta 📋"}</span>
              </button>
            </div>

            <p className="text-[10.5px] text-gray-500 font-bold uppercase tracking-wider">
              Categorías de vehículos encontradas en zona:
            </p>

            {/* List of Cabify options options */}
            <div className="space-y-2">
              {simulatedOptions.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`border rounded-xl p-3 flex justify-between items-start gap-3.5 transition-all cursor-pointer ${
                      isSelected 
                        ? "border-purple-600 bg-purple-50/30 ring-1 ring-purple-600" 
                        : "border-gray-200 hover:border-gray-300 hover:bg-slate-50/30"
                    }`}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-display font-black text-xs text-gray-900 leading-none">
                          {opt.name}
                        </span>
                        {opt.tag && (
                          <span className="text-[8.5px] font-extrabold bg-green-150 text-green-950 px-1.5 py-0.5 rounded uppercase tracking-wide font-mono">
                            {opt.tag}
                          </span>
                        )}
                        {opt.isPetFriendly && (
                          <span className="text-[8.5px] font-extrabold bg-purple-600 text-white px-1.5 py-0.5 rounded uppercase tracking-wide font-mono">
                            Categoría Oficial
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500 leading-normal">
                        {opt.description}
                      </p>
                      <span className="text-[9px] text-gray-400 font-bold block pt-0.5 font-mono">
                        ⏰ Tiempo de llegada: {opt.eta}
                      </span>
                    </div>

                    <div className="text-right shrink-0 space-y-0.5 font-mono">
                      <p className="text-xs font-black text-gray-950">
                        ${opt.price.toLocaleString("es-AR")} ARS
                      </p>
                      <p className="text-[9px] text-gray-400 font-bold">tarifa fija</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* If Cabify Mascotas is selected, show instructions */}
            {activeOption?.isPetFriendly && (
              <div className="bg-purple-100/40 border border-purple-200 rounded-xl p-3.5 space-y-2.5 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start gap-2">
                  <span className="text-base">⭐</span>
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-purple-950">
                      ¿Cómo pedir este viaje real en tu teléfono? 📱🐾
                    </p>
                    <p className="text-xs text-gray-650 leading-relaxed font-sans">
                      Para utilizar este servicio, primero asegurate de descargar la app oficial de <span className="font-bold text-gray-800">Cabify</span> en tu celular, registrá tu medio de pago y seguí estas sencillas normativas sanitarias locales:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px] text-gray-700 font-sans">
                  <div className="flex items-start gap-1.5 bg-white border border-purple-100 p-2 rounded-lg">
                    <span className="text-emerald-500 text-xs shrink-0 mt-0.5">✔</span>
                    <p>
                      <span className="font-bold">Una Mascota por viaje</span>: Podés viajar con un perro o un gato acompañado por su dueño de manera legal y cómoda.
                    </p>
                  </div>
                  <div className="flex items-start gap-1.5 bg-white border border-purple-100 p-2 rounded-lg">
                    <span className="text-emerald-500 text-xs shrink-0 mt-0.5">✔</span>
                    <p>
                      <span className="font-bold">Higiene y Sujeción</span>: Llevá siempre pretal con correa/cinturón de seguridad canino para sujetarlo en el asiento trasero. Base transportadora para felinos.
                    </p>
                  </div>
                </div>

                <p className="text-[10px] text-purple-900 font-bold text-center leading-normal">
                  🚀 ¡Probá abriendo la app real de Cabify en Buenos Aires y buscá la opción de "Cabify Mascotas" al cotizar tu próximo destino de paseo!
                </p>
              </div>
            )}

            {/* If selectedOption is standard, show friendly pets rule alert warning */}
            {activeOption && !activeOption.isPetFriendly && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 text-xs text-amber-900 font-sans leading-relaxed">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <span className="font-bold">Atención:</span> Esta categoría regular no garantiza el traslado de mascotas. El chofer posee entera facultad civil para denegar la subida en caso de no llevar una transportadora cerrada por protección de higiene. ¡Te recomendamos cambiar a <span className="font-bold text-purple-950 underline cursor-pointer" onClick={() => setSelectedOptionId("cabify-mascotas")}>Cabify Mascotas</span>!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Trust & Safe usage caption */}
      <div className="pt-3.5 border-t border-dashed border-purple-200 text-center space-y-1.5" id="cabify-footer">
        <p className="text-[10.5px] text-purple-950 font-black flex items-center justify-center gap-1 uppercase tracking-wide">
          🛡️ Viajes Confortables & Protegidos
        </p>
        <p className="text-[10px] text-gray-500 leading-snug">
          Los choferes adheridos a Cabify Mascotas cuentan con capacitación previa sobre el traslado seguro de animales en tránsito. Se recomienda llevar una manta extra si tu mejor amigo está mudando mucho pelaje.
        </p>
      </div>
    </div>
  );
}
