import React from "react";
import { SavedTrip } from "../types";
import { Plane, Calendar, Users, Heart, Trash2, ChevronRight, MapPin } from "lucide-react";

interface SavedTripsListProps {
  trips: SavedTrip[];
  onSelectTrip: (trip: SavedTrip) => void;
  onDeleteTrip: (id: string) => void;
  selectedTripId?: string;
}

export default function SavedTripsList({
  trips,
  onSelectTrip,
  onDeleteTrip,
  selectedTripId
}: SavedTripsListProps) {
  if (trips.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center text-gray-500 shadow-xs">
        <p className="text-sm font-medium">No tienes viajes guardados todavía.</p>
        <p className="text-xs text-gray-400 mt-1">Configura tus filtros y genera un plan personalizado para guardarlo aquí.</p>
      </div>
    );
  }

  return (
    <div id="saved-trips-list" className="space-y-3">
      {trips.map((trip) => {
        const isSelected = selectedTripId === trip.id;
        return (
          <div
            key={trip.id}
            id={`saved-trip-${trip.id}`}
            className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
              isSelected
                ? "bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/10"
                : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
            }`}
            onClick={() => onSelectTrip(trip)}
          >
            <div className="flex-1 min-w-0 mr-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  {trip.stayType === "cualquiera" ? "Cualquier Hospedaje" : trip.stayType}
                </span>
                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {trip.date}
                </span>
              </div>
              
              <h4 className="font-display font-bold text-gray-900 truncate flex items-center gap-1.5 text-base">
                <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                {trip.province}
              </h4>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {trip.travelersCount} {trip.travelersCount === 1 ? "adulto" : "adultos"}
                  {trip.childrenCount > 0 && ` • ${trip.childrenCount} hijo/s`}
                </span>
                <span className="flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  <Heart className="h-3 w-3 fill-emerald-500 text-emerald-500" />
                  <span className="flex items-center gap-1.5">
                    {trip.pets.map((p, pIdx) => (
                      <span key={p.id || p.name || pIdx} className="inline-flex items-center gap-0.5">
                        {p.image && (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-3.5 w-3.5 rounded-full object-cover border border-emerald-200"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <span>{p.name}</span>
                      </span>
                    ))}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                id={`delete-trip-btn-${trip.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTrip(trip.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-all duration-200"
                title="Eliminar viaje"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className={`p-1.5 rounded-lg transition-colors ${isSelected ? "text-emerald-600 bg-emerald-100" : "text-gray-400 group-hover:text-amber-600 group-hover:bg-amber-50"}`}>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
