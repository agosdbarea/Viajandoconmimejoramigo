import React, { useState } from "react";
import { Pet } from "../types";
import { Plus, Trash2, Dog, Cat, Bird, HeartHandshake, Sparkles } from "lucide-react";

interface PetInputProps {
  pets: Pet[];
  onAddPet: (pet: Omit<Pet, "id">) => void;
  onRemovePet: (id: string) => void;
}

const PET_TYPES = [
  { id: "Perro", label: "Perro 🐶", icon: Dog, color: "text-amber-600 bg-amber-50" },
  { id: "Gato", label: "Gato 🐱", icon: Cat, color: "text-slate-600 bg-slate-50" },
  { id: "Ave", label: "Ave 🦜", icon: Bird, color: "text-emerald-600 bg-emerald-50" },
  { id: "Otro", label: "Otro 🐾", icon: HeartHandshake, color: "text-indigo-600 bg-indigo-50" },
];

export default function PetInput({ pets, onAddPet, onRemovePet }: PetInputProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Perro");
  const [breed, setBreed] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const petName = name.trim();
    let petImage: string | undefined = undefined;
    let petBreed = breed.trim() || undefined;

    if (petName.toLowerCase() === "aukan" || petName.toLowerCase() === "rocco") {
      petImage = "/aukan_park.jpg?v=1782734713";
      if (!petBreed) petBreed = "Mestizo Negro y Fuego";
    } else if (petName.toLowerCase() === "emilia" || petName.toLowerCase() === "milo") {
      petImage = "/emilia.jpg?v=1782734683";
      if (!petBreed) petBreed = "Mestizo Tri-color";
    }

    onAddPet({ name: petName, type, breed: petBreed, image: petImage });
    setName("");
    setBreed("");
  };

  return (
    <div id="pet-input-container" className="space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <h3 className="font-display font-semibold text-gray-800 text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Mascotas Viajeras
        </h3>
        <span className="text-xs bg-amber-100 text-amber-800 font-medium px-2 py-1 rounded-full">
          {pets.length} {pets.length === 1 ? "viajera" : "viajeras"}
        </span>
      </div>

      {/* Pet List */}
      {pets.length === 0 ? (
        <div className="text-center py-6 px-4 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
          <p className="text-sm text-gray-500">¿Quién es el dueño de tus sonrisas en el viaje?</p>
          <p className="text-xs text-gray-400 mt-1">Suma al menos a una mascota para armar la aventura</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
          {pets.map((pet) => {
            const petTypeObj = PET_TYPES.find((t) => t.id === pet.type) || PET_TYPES[3];
            const TypeIcon = petTypeObj.icon;
            return (
              <div
                key={pet.id}
                id={`pet-badge-${pet.id}`}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl shadow-xs hover:border-amber-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  {pet.image ? (
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="h-10 w-10 rounded-lg object-cover border border-amber-200 shadow-2xs flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className={`p-2 rounded-lg ${petTypeObj.color} flex-shrink-0`}>
                      <TypeIcon className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{pet.name}</h4>
                    <p className="text-xs text-gray-500">
                      {pet.type} {pet.breed ? `• ${pet.breed}` : ""}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  id={`remove-pet-btn-${pet.id}`}
                  onClick={() => onRemovePet(pet.id)}
                  className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                  title={`Quitar a ${pet.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Pet Form */}
      <form onSubmit={handleSubmit} id="add-pet-form" className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl space-y-3">
        <p className="text-xs font-semibold text-amber-900 uppercase tracking-wider">Añadir mejor amigo de cuatro patas (u otras plumas)</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-gray-600 block font-medium">Nombre</label>
            <input
              type="text"
              id="new-pet-name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Coco, Luna, Rocco"
              className="w-full text-sm bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-600 block font-medium">Tipo</label>
            <select
              id="new-pet-type-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full text-sm bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              {PET_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.id}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-600 block font-medium">Raza / Tipo de amigo (Opcional)</label>
            <input
              type="text"
              id="new-pet-breed-input"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="Ej: Golden Retriever, Caniche"
              className="w-full text-sm bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            id="add-pet-submit-btn"
            disabled={!name.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-3.5 w-3.5" />
            Añadir Mascota
          </button>
        </div>
      </form>
    </div>
  );
}
