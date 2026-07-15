import React, { useState, useEffect } from "react";
import { 
  X, 
  BarChart3, 
  Users, 
  MousePointerClick, 
  Search, 
  MessageSquare, 
  Instagram, 
  Globe, 
  RefreshCw, 
  Trash2, 
  Share2, 
  Check, 
  MapPin, 
  TrendingUp, 
  Sparkles,
  Lock,
  Unlock,
  AlertTriangle
} from "lucide-react";

interface AdminStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AnalyticsData {
  summary: {
    totalPageviews: number;
    totalClicks: number;
    totalSearches: number;
    clicksByType: {
      whatsapp: number;
      instagram: number;
      web: number;
      caretaker: number;
      cabify: number;
    };
    clicksByPlace: Record<string, number>;
    searchesByProvince: Record<string, number>;
    searchesByCity: Record<string, number>;
  };
  events: Array<{
    id: string;
    type: string;
    timestamp: string;
    details: Record<string, any>;
  }>;
}

export default function AdminStatsModal({ isOpen, onClose }: AdminStatsModalProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pinError, setPinError] = useState(false);

  // Set default PIN for the administrator or keep it open with optional locking.
  // We'll require a simple, friendly Argentine/Pet-friendly PIN code "GUAU" or "1234" to simulate realistic access,
  // but allow instant reveal so checking it is highly frictionless.
  const CORRECT_PIN = "GUAU";

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analytics");
      if (!res.ok) throw new Error("No se pudo cargar la información estadística");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "Error al conectar con la base de analíticas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthorized) {
      fetchStats();
    }
  }, [isOpen, isAuthorized]);

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin.trim().toUpperCase() === CORRECT_PIN || adminPin === "1234") {
      setIsAuthorized(true);
      setPinError(false);
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    }
  };

  const handleShareReport = () => {
    if (!data) return;

    const summary = data.summary;
    const sortedPlaces = (Object.entries(summary.clicksByPlace || {}) as [string, number][])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const sortedProvinces = (Object.entries(summary.searchesByProvince || {}) as [string, number][])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Beautifully-formatted template for copying and sharing
    const reportText = `🐾 *REPORTE ESTADÍSTICO - VIAJANDO CON MI MEJOR AMIGO* 🐾
📅 Fecha de reporte: ${new Date().toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}

📈 *MÉTRICAS CORE:*
• 👥 Visitas de Usuarios: ${summary.totalPageviews || 0} ingresos
• 🔍 Búsquedas con IA: ${summary.totalSearches || 0} consultas
• 🖱️ Clics en Canales: ${summary.totalClicks || 0} conexiones directas

💬 *CLICS POR CANAL:*
• WhatsApp Directo: ${summary.clicksByType?.whatsapp || 0} clics
• Instagram 📸: ${summary.clicksByType?.instagram || 0} clics
• Sitio Web Oficial 🌐: ${summary.clicksByType?.web || 0} clics
• Cuidador / Guardería 🏡: ${summary.clicksByType?.caretaker || 0} clics
• Cabify Mascotas 🚕: ${summary.clicksByType?.cabify || 0} clics

🏢 *ALOJAMIENTOS & DESTINOS ADHERIDOS MÁS SOLICITADOS:*
${sortedPlaces.length > 0 
  ? sortedPlaces.map(([place, count], i) => `${i + 1}. ${place} (${count} clics)`).join("\n")
  : "• Sin registros de clics aún."
}

📍 *PROVINCIAS DE ARGENTINA MÁS BUSCADAS:*
${sortedProvinces.length > 0
  ? sortedProvinces.map(([prov, count], i) => `• ${prov}: ${count} búsquedas`).join("\n")
  : "• Sin registros de búsquedas aún."
}

🚀 Generado automáticamente desde el Panel de Administración de RutaGuau. ¡Fomentemos el turismo pet-friendly!`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetAnalytics = async () => {
    try {
      const res = await fetch("/api/analytics/reset", { method: "POST" });
      if (res.ok) {
        fetchStats();
        setShowResetConfirm(false);
      }
    } catch (e) {
      console.error("Error resetting stats:", e);
    }
  };

  // Helper calculation for progress percentages
  const getMaxVal = (record: Record<string, number> | undefined) => {
    if (!record) return 1;
    const values = Object.values(record);
    return values.length > 0 ? Math.max(...values) : 1;
  };

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-gray-150 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-900 rounded-xl text-white">
              <BarChart3 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-display font-black text-gray-900 text-sm leading-tight uppercase tracking-wider">
                RutaGuau Analytics
              </h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                Panel de Administración & Conversión
              </p>
            </div>
          </div>
          
          <button 
            type="button" 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-150 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Gate (PIN Screen) */}
        {!isAuthorized ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-5 my-auto overflow-y-auto">
            <div className="p-4 bg-slate-50 border border-slate-150 rounded-full text-slate-800 shadow-3xs">
              <Lock className="w-8 h-8 animate-bounce text-slate-800" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h3 className="font-display font-black text-sm text-gray-900 uppercase tracking-wide">
                Ingreso de Administrador
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed font-sans">
                Para acceder a las métricas reales y descargar estadísticas para patrocinadores, ingresá el PIN de seguridad asignado.
              </p>
              <p className="text-[10.5px] bg-sky-50 text-sky-800 border border-sky-150 p-2 rounded-xl mt-1 leading-normal">
                💡 PIN de prueba rápido: <span className="font-black font-mono bg-sky-200/50 px-1 py-0.5 rounded text-sky-950 uppercase">{CORRECT_PIN}</span> (o "1234")
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="w-full max-w-xs space-y-3">
              <div className="relative">
                <input
                  type="password"
                  required
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="Escribir clave de acceso..."
                  className={`w-full text-center text-sm bg-slate-50 border rounded-xl px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-1 focus:ring-slate-500 font-extrabold tracking-widest ${
                    pinError ? "border-red-400 focus:ring-red-400 bg-red-50 text-red-900" : "border-gray-300"
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider cursor-pointer shadow-3xs transition-transform active:scale-[0.98]"
              >
                Ingresar al Dashboard 🔑
              </button>
            </form>
          </div>
        ) : (
          /* Authorized Content (Statistics Display) */
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            
            {loading && !data && (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="w-8 h-8 text-slate-800 animate-spin" />
                <p className="text-xs font-bold font-mono text-gray-400 uppercase tracking-widest">
                  Estableciendo conexión...
                </p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-900">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {data && (() => {
              const summary = data.summary;
              const totalClicks = summary.totalClicks || 0;
              const totalPageviews = summary.totalPageviews || 0;
              const totalSearches = summary.totalSearches || 0;

              // Sorting calculations
              const topClicksPlaces = (Object.entries(summary.clicksByPlace || {}) as [string, number][])
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);

              const topProvinces = (Object.entries(summary.searchesByProvince || {}) as [string, number][])
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);

              const topCities = (Object.entries(summary.searchesByCity || {}) as [string, number][])
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);

              return (
                <div className="space-y-6 animate-in fade-in duration-300">
                  
                  {/* Bento Scorecards Core Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Pageviews scorecard */}
                    <div className="bg-slate-50 border border-gray-150 p-4 rounded-2xl space-y-2 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-gray-400">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest">Visitas</span>
                        <Users className="w-4 h-4 text-gray-400 text-slate-850" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-2xl font-display font-black text-slate-900 leading-none">
                          {totalPageviews}
                        </p>
                        <p className="text-[9.5px] text-gray-400 font-bold leading-normal">
                          Sesiones inicializadas
                        </p>
                      </div>
                    </div>

                    {/* Searches scorecard */}
                    <div className="bg-indigo-50/60 border border-indigo-100 p-4 rounded-2xl space-y-2 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-indigo-400">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-805">Consultas IA</span>
                        <Search className="w-4 h-4 text-indigo-605" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-2xl font-display font-black text-indigo-950 leading-none">
                          {totalSearches}
                        </p>
                        <p className="text-[9.5px] text-indigo-600 font-bold leading-normal">
                          Búsquedas de rutas
                        </p>
                      </div>
                    </div>

                    {/* Clicks scorecard */}
                    <div className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-2xl space-y-2 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-emerald-400">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-805">Conversiones</span>
                        <MousePointerClick className="w-4 h-4 text-emerald-605" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-2xl font-display font-black text-emerald-950 leading-none">
                          {totalClicks}
                        </p>
                        <p className="text-[9.5px] text-emerald-600 font-bold leading-normal">
                          Conexiones a prestadores
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Channel conversions block */}
                  <div className="bg-white border border-gray-150 rounded-2xl p-4.5 space-y-4">
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-100 pb-2">
                      <TrendingUp className="w-4 h-4 text-slate-805" />
                      Conversión por Canales de Comunicación
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5 pt-1">
                      {/* WhatsApp Channels */}
                      <div className="border border-green-150 bg-green-50/30 p-3 rounded-xl flex flex-col justify-between space-y-1.5 text-center">
                        <div className="mx-auto p-1.5 bg-green-500 text-white rounded-lg">
                          <MessageSquare className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-[10px] font-black text-green-950 uppercase leading-none">WhatsApp</p>
                        <p className="text-xl font-display font-black text-green-900">{summary.clicksByType?.whatsapp || 0}</p>
                      </div>

                      {/* Instagram Channels */}
                      <div className="border border-pink-150 bg-pink-50/20 p-3 rounded-xl flex flex-col justify-between space-y-1.5 text-center">
                        <div className="mx-auto p-1.5 bg-pink-600 text-white rounded-lg">
                          <Instagram className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-[10px] font-black text-pink-950 uppercase leading-none">Instagram</p>
                        <p className="text-xl font-display font-black text-pink-900">{summary.clicksByType?.instagram || 0}</p>
                      </div>

                      {/* Web Channels */}
                      <div className="border border-sky-150 bg-sky-50/20 p-3 rounded-xl flex flex-col justify-between space-y-1.5 text-center">
                        <div className="mx-auto p-1.5 bg-sky-600 text-white rounded-lg">
                          <Globe className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-[10px] font-black text-sky-950 uppercase leading-none">Websites</p>
                        <p className="text-xl font-display font-black text-sky-900">{summary.clicksByType?.web || 0}</p>
                      </div>

                      {/* Caretakers Channels */}
                      <div className="border border-indigo-150 bg-indigo-50/20 p-3 rounded-xl flex flex-col justify-between space-y-1.5 text-center">
                        <div className="mx-auto p-1.5 bg-indigo-600 text-white rounded-lg">
                          <Users className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-[10px] font-black text-indigo-950 uppercase leading-none">Cuidadores</p>
                        <p className="text-xl font-display font-black text-indigo-905">{summary.clicksByType?.caretaker || 0}</p>
                      </div>

                      {/* Cabify Channels */}
                      <div className="border border-purple-150 bg-purple-50/20 p-3 rounded-xl flex flex-col justify-between space-y-1.5 text-center">
                        <div className="mx-auto p-1.5 bg-purple-600 text-white rounded-lg">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-[10px] font-black text-purple-950 uppercase leading-none">Cabify Tx</p>
                        <p className="text-xl font-display font-black text-purple-905">{summary.clicksByType?.cabify || 0}</p>
                      </div>
                    </div>
                  </div>

                  {/* Leaderboard Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Top destination spots */}
                    <div className="bg-white border border-gray-150 rounded-2xl p-4.5 space-y-3">
                      <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        Prestadores más contactados
                      </h3>
                      
                      <div className="space-y-2.5 pt-1">
                        {topClicksPlaces.length > 0 ? (
                          topClicksPlaces.map(([place, count]) => {
                            const maxVal = getMaxVal(summary.clicksByPlace);
                            const widthPercent = Math.max(8, Math.min(100, (count / maxVal) * 100));
                            return (
                              <div key={place} className="space-y-1 font-sans">
                                <div className="flex items-center justify-between text-[11px] font-bold text-gray-850">
                                  <span className="truncate max-w-[80%]">{place}</span>
                                  <span className="font-mono text-gray-500 font-extrabold text-[10px] bg-slate-50 border border-gray-150 px-1.5 py-0.5 rounded leading-none shrink-0">{count} clics</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                                    style={{ width: `${widthPercent}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-xs text-gray-400 font-medium py-3 text-center">
                            Ningún clic registrado todavía.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Top searches provinces */}
                    <div className="bg-white border border-gray-150 rounded-2xl p-4.5 space-y-3">
                      <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-indigo-550" />
                        Provincias más consultadas
                      </h3>

                      <div className="space-y-2.5 pt-1">
                        {topProvinces.length > 0 ? (
                          topProvinces.map(([prov, count]) => {
                            const maxVal = getMaxVal(summary.searchesByProvince);
                            const widthPercent = Math.max(8, Math.min(100, (count / maxVal) * 100));
                            return (
                              <div key={prov} className="space-y-1 font-sans">
                                <div className="flex items-center justify-between text-[11px] font-bold text-gray-850">
                                  <span className="truncate">{prov}</span>
                                  <span className="font-mono text-gray-500 font-extrabold text-[10px] bg-slate-50 border border-gray-150 px-1.5 py-0.5 rounded leading-none shrink-0">{count} búsquedas</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                                    style={{ width: `${widthPercent}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-xs text-gray-400 font-medium py-3 text-center">
                            Ninguna provincia buscada todavía.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Sharing Footer block inside Stats Modal */}
                  <div className="pt-3 border-t border-dashed border-gray-150 flex flex-wrap gap-2.5 items-center justify-between">
                    <button
                      type="button"
                      onClick={fetchStats}
                      className="p-1 px-3 py-1.5 inline-flex items-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-705 border border-slate-205 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                      Refrescar
                    </button>

                    <div className="flex flex-wrap gap-2">
                      {/* Reset button with immediate confirm toggling */}
                      {showResetConfirm ? (
                        <div className="flex items-center gap-1.5 animate-in slide-in-from-right-2 duration-150">
                          <span className="text-[10px] text-rose-800 bg-rose-50 border border-rose-150 px-2 py-1 rounded-lg font-bold leading-none">¿Eliminar datos permanentemente?</span>
                          <button
                            type="button"
                            onClick={handleResetAnalytics}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[9.5px] rounded-lg cursor-pointer uppercase transition-all"
                          >
                            Sí, Borrar
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowResetConfirm(false)}
                            className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[9.5px] rounded-lg cursor-pointer uppercase"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowResetConfirm(true)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Limpiar
                        </button>
                      )}

                      {/* Share Copy Text Button */}
                      <button
                        type="button"
                        onClick={handleShareReport}
                        className={`px-4 py-1.5 text-[10.5px] font-black uppercase tracking-wider rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
                          copied 
                            ? "bg-green-600 text-white hover:bg-green-650 shadow-sm" 
                            : "bg-slate-900 text-white hover:bg-slate-950 shadow-3xs hover:-translate-y-0.5 active:translate-y-0"
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Reporte Copiado
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5" />
                            Copiar Reporte para Compartir 📋
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })()}

          </div>
        )}

        {/* Footnote of administrative modal */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center shrink-0">
          <p className="text-[9.5px] text-gray-400 font-medium">
            RutaGuau Analytics es una herramienta de telemetría local de código libre. No comparte datos personales de manera comercial.
          </p>
        </div>

      </div>
    </div>
  );
}
