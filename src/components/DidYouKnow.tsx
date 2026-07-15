import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Scale, Plane, Globe, Award, HelpCircle, Phone, Info } from "lucide-react";

interface WeeklyFact {
  weekNum: number;
  title: string;
  icon: React.ReactNode;
  subtitle: string;
  category: string;
  tagline: string;
  mainBody: string;
  bulletTitle?: string;
  bullets?: string[];
  denounceInfo?: {
    title: string;
    items: string[];
  };
}

export default function DidYouKnow() {
  const [activeIdx, setActiveIdx] = useState(0);

  const facts: WeeklyFact[] = [
    {
      weekNum: 1,
      category: "Leyes y Derechos ⚖️",
      title: "Ley contra el Maltrato Animal (Ley 14.346) en Argentina",
      icon: <Scale className="h-5 w-5 text-red-650" />,
      subtitle: "Protección legal para los que no tienen voz",
      tagline: "El maltrato animal es un delito penal en Argentina. Conocer cómo funciona te permite actuar a tiempo y salvar vidas.",
      mainBody: "La Ley Nacional 14.346 reprime con prisión a quienes infrinjan malos tratos o hagan víctimas de actos de crueldad a los animales. Esto abarca desde no alimentarlos adecuadamente o mantenerlos en lugares insalubres, hasta castigarlos físicamente, abandonarlos o dejarlos bajo el sol y frío extremos sin refugio adecuado.",
      bulletTitle: "Señales de alerta comunes:",
      bullets: [
        "Falta evidente de agua potable y alimento diario.",
        "Mascotas atadas permanentemente con cadenas cortas que impiden su movilidad natural.",
        "Abandono prolongado dentro de viviendas, terrazas o balcones sin resguardo del clima.",
        "Signos obvios de golpes, heridas abiertas no tratadas o desnutrición avanzada."
      ],
      denounceInfo: {
        title: "🚨 ¿Cómo denuncias ante la policía o fiscalía?",
        items: [
          "📞 Llamá de inmediato al 911 si el animal corre riesgo de muerte inminente.",
          "🏢 Hacé la denuncia penal en la Comisaría de la zona o la Fiscalía correspondiente. Recordá que por ley judicial tienen la obligación civil de tomarte la denuncia.",
          "🌐 En CABA, podés denunciar en la web oficial del Ministerio Público Fiscal (MPF) o enviando un e-mail detallado a denuncias@fiscalias.gob.ar.",
          "📸 Recolectá pruebas clave: fotos rápidas, videos nítidos del entorno, la dirección exacta y de ser posible, testimonios de vecinos que certifiquen el maltrato continuo."
        ]
      }
    },
    {
      weekNum: 2,
      category: "Cultura Viajera 🇨🇭",
      title: "Suiza: El verdadero sueño y paraíso pet-friendly",
      icon: <Globe className="h-5 w-5 text-emerald-600" />,
      subtitle: "Un país ejemplar que considera a las mascotas como su familia",
      tagline: "En Suiza, los animales no son considerados meros objetos. Tienen estatus de dignidad garantizado bajo su Constitución.",
      mainBody: "Suiza posee una de las legislaciones animales más avanzadas y ejemplares del planeta. Allí, las mascotas gozan de acceso prácticamente irrestricto en hoteles de alta gama, restaurantes pintorescos e incluso shoppings modernos. No solo se les tiene permitido el ingreso, sino que en restaurantes es completamente natural que los mozos traigan un pote de agua fresca de cortesía sin que lo pidas.",
      bulletTitle: "Regulaciones asombrosas en Suiza:",
      bullets: [
        "🐕 Chip Obligatorio: Todo perro debe llevar un chip subcutáneo antes de los 3 meses de edad. El chip vincula al animal con la base de datos nacional AMICUS con información de vacunación y datos del dueño, lo que reduce los animales extraviados o abandonados a cero.",
        "🚌 Boleto de Transporte: Los perros viajan de manera legal en trenes y buses públicos. Tienen inclusive abonos mensuales o abonan medio boleto estándar para viajar seguros en su propio asiento.",
        "🛍️ Centros Comerciales: Los grandes templos de compras poseen carritos adaptados para que recorran el centro de compras con total comodidad junto a sus familias.",
        "🥩 Respeto Social: Dejarlos encerrados solos largas horas o cortarles las cuerdas vocales o colas está estrictamente prohibido bajo pena de fuertes multas penales."
      ]
    },
    {
      weekNum: 3,
      category: "Transporte y Aviones ✈️",
      title: "Mascotas a bordo: Viajar en Cabina por Argentina",
      icon: <Plane className="h-5 w-5 text-sky-655" />,
      subtitle: "La guía definitiva de aerolíneas nacionales autorizadas",
      tagline: "¿Sabías que podés ir sentado con tu perro a tu lado en vuelos nacionales? Olvidate de la bodega de carga y viajá tranquilo con estas pautas.",
      mainBody: "Para realizar viajes aéreos en Argentina con tu mascota dentro de la cabina de pasajeros, las aerolíneas locales ofrecen servicios regulados ideales. Consiste en llevarlos en bolsos de transporte flexibles que quepan debajo del asiento delantero, asegurando que estén contenidos y confortables durante todo el trayecto.",
      bulletTitle: "Pautas de las aerolíneas líderes en vuelos nacionales:",
      bullets: [
        "✈️ Aerolíneas Argentinas: Permite perros de más de 12 semanas hasta 9 kg (incluyendo el bolso de viaje homologado). Requiere reserva previa antes de las 48hs del vuelo.",
        "✈️ Flybondi: Admite viajar en cabina de pasajeros con una tarifa plana para mascotas de hasta 10 kg en vuelos locales. Las medidas máximas del bolso transportador flexible son de 43cm x 31cm x 20cm.",
        "✈️ JetSmart: Autoriza perros en cabina con un límite de 10 kg sumados su bolso porta-mascotas impermeable. Se debe presentar certificado veterinario oficial emitido los días previos."
      ],
      denounceInfo: {
        title: "📋 Documentación mandatoria indispensable para embarcar:",
        items: [
          "Libreta Sanitaria original expedida por veterinario con vacunas y tratamientos al día.",
          "Certificado Sanitario de Co-existencia y salud emitido por veterinario matriculado (validez máxima de 10 días previos al despegue).",
          "Vacunación Antirrábica obligatoria aplicada para mascotas de más de 3 meses de edad.",
          "Bolso transportador cerrado y cómodo, con base impermeable en caso de accidentes menores de micción."
        ]
      }
    },
    {
      weekNum: 4,
      category: "Salud y Bienestar 🐶",
      title: "Los secretos del bostezo y estornudo caninos",
      icon: <Award className="h-5 w-5 text-amber-600" />,
      subtitle: "Las asombrosas señales con las que se comunican con vos",
      tagline: "Nuestras mascotas se expresan corporalmente todo el tiempo de formas fascinantes y amigables.",
      mainBody: "¿Alguna vez te llamó la atención que tu perro estornude cuando juega con vos o con otros animales? ¡No te preocupes, no está resfriado! Se trata de una 'señal de calma'. El estornudo cortito e inofensivo durante el juego es un mecanismo de comunicación canina para decir 'todo está bien, esto es solo diversión y juego'.",
      bulletTitle: "Otras señales curiosas para aprender hoy:",
      bullets: [
        "🥱 El Bostezo de Paciencia: No siempre significa fatiga o sueño. Al igual que el parpadeo lento, un perro bosteza en situaciones nuevas para auto-relajarse y calmar a los humanos a su alrededor.",
        "🙇 El Regocijo Exquisito: Cuando baja las patas delanteras con el pecho al suelo y deja elevada la cola meneándola ('reverencia'), te está invitando estrictamente a una sesión afectuosa de juego.",
        "👅 Lamidos Rápidos: Un lamido veloz al aire o sobre tus manos libera endorfinas que les transmiten seguridad mutua y fortalecen el apego biológico sano."
      ]
    }
  ];

  // Dynamically select week based on actual calendar week
  useEffect(() => {
    try {
      const getWeekOfYear = () => {
        const d = new Date();
        const yearStart = new Date(d.getFullYear(), 0, 1);
        const days = Math.floor((d.getTime() - yearStart.getTime()) / (24 * 60 * 60 * 1000));
        const week = Math.ceil((days + yearStart.getDay() + 1) / 7);
        return week;
      };
      const currentWeek = getWeekOfYear();
      // Map current offset module to facts list length
      const recommendedIdx = currentWeek % facts.length;
      setActiveIdx(recommendedIdx);
    } catch {
      setActiveIdx(0);
    }
  }, []);

  const currentFact = facts[activeIdx];

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % facts.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + facts.length) % facts.length);
  };

  return (
    <div
      id="did-you-know-card"
      className="bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/65 rounded-3xl p-6 shadow-xs space-y-4"
    >
      {/* Header section with weekly navigation */}
      <div className="flex items-center justify-between border-b border-amber-200/40 pb-3" id="did-you-know-header">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500 rounded-lg text-white">
            <HelpCircle className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-base text-gray-900 leading-tight">
              ¿Sabías que...? 🐾
            </h3>
            <p className="text-[10px] text-amber-900 font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
              EDICIÓN RECOMENDADA DE LA SEMANA
            </p>
          </div>
        </div>

        {/* Carousel buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            id="dyk-prev-btn"
            className="p-1.5 bg-white border border-amber-200/80 rounded-lg hover:bg-amber-100/50 text-gray-600 transition-colors shadow-2xs cursor-pointer"
            title="Anterior dato curioso"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="text-[10px] font-mono text-gray-400 font-bold px-1 select-none">
            {activeIdx + 1}/{facts.length}
          </span>
          <button
            type="button"
            onClick={handleNext}
            id="dyk-next-btn"
            className="p-1.5 bg-white border border-amber-200/80 rounded-lg hover:bg-amber-100/50 text-gray-600 transition-colors shadow-2xs cursor-pointer"
            title="Siguiente dato de interés"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main fact panel content */}
      <div className="space-y-3" id={`did-you-know-slide-${activeIdx}`}>
        {/* Category Tag and Card Title */}
        <div className="space-y-1.5">
          <span className="inline-block px-2.5 py-0.5 bg-amber-100/80 border border-amber-200/60 text-[10px] font-extrabold text-amber-950 rounded-full uppercase tracking-wider font-mono">
            {currentFact.category}
          </span>
          <div className="flex items-start gap-2">
            <div className="p-1.5 bg-white border border-amber-200/50 rounded-xl shadow-2xs mt-0.5">
              {currentFact.icon}
            </div>
            <div>
              <h4 className="font-display font-black text-sm.5 text-gray-900 leading-tight">
                {currentFact.title}
              </h4>
              <p className="text-[11px] text-gray-500 font-bold leading-tight mt-0.5">
                {currentFact.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Highlight/Tagline */}
        <div className="bg-white border-l-4 border-amber-500 rounded-r-xl p-3 text-xs text-gray-700 italic font-medium leading-relaxed shadow-3xs">
          "{currentFact.tagline}"
        </div>

        {/* Narrative / Main Body */}
        <p className="text-xs text-gray-650 leading-relaxed font-sans">
          {currentFact.mainBody}
        </p>

        {/* Bullets/List if available */}
        {currentFact.bullets && currentFact.bullets.length > 0 && (
          <div className="space-y-1.5 pt-1.5">
            {currentFact.bulletTitle && (
              <p className="text-[10px] font-bold text-amber-950 uppercase tracking-widest flex items-center gap-1">
                <Info className="w-3 h-3 text-amber-600" />
                {currentFact.bulletTitle}
              </p>
            )}
            <ul className="space-y-1.5 pl-0.5">
              {currentFact.bullets.map((bullet, bIdx) => (
                <li
                  key={bIdx}
                  className="text-xs text-gray-650 flex items-start gap-2 bg-white/70 border border-amber-100/40 p-2.5 rounded-xl shadow-3xs leading-relaxed"
                >
                  <span className="text-[11px] select-none shrink-0 mt-0.5">📍</span>
                  <span className="font-sans text-[11.5px] font-medium">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Denounce Info Block if applicable */}
        {currentFact.denounceInfo && (
          <div className="mt-3.5 bg-red-50/70 border border-red-200/50 rounded-2xl p-4.5 space-y-2">
            <p className="text-[11px] font-bold text-red-950 uppercase tracking-wide flex items-center gap-1.5 font-sans">
              <span>🚨</span>
              {currentFact.denounceInfo.title}
            </p>
            <ul className="space-y-2">
              {currentFact.denounceInfo.items.map((item, iIdx) => (
                <li key={iIdx} className="text-xs text-red-900/95 leading-relaxed flex items-start gap-1.5">
                  <span className="text-[10px] select-none text-red-600 shrink-0 mt-0.5">✔</span>
                  <span className="font-semibold text-[11px] leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Decorative caption */}
      <div className="text-center pt-2.5 border-t border-dashed border-amber-200/50">
        <p className="text-[9px] text-gray-400 font-medium">
          Dato semanal sincronizado de manera autónoma con las ordenanzas pet-friendly vigentes.
        </p>
      </div>
    </div>
  );
}
