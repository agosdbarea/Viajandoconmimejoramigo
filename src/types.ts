export interface Pet {
  id: string;
  name: string;
  type: string; // e.g. "Perro", "Gato", "Ave", etc.
  breed?: string; // Optional breed or descriptor
  image?: string; // Optional real image URL
}

export interface ReviewSource {
  platform: string; // e.g., 'Booking.com', 'TripAdvisor', 'Google Reviews'
  rating: string; // e.g., "9.1/10", "4.8/5"
  commentCount?: string; // e.g., "1200 reseñas"
}

export interface TravelerComment {
  author: string;
  text: string;
  platform?: string; // e.g., 'Booking.com' or 'TripAdvisor'
}

export interface PetPolicies {
  allowedSizes: string; // e.g. "Todos los tamaños", "Solo tamaño pequeño/mediano", etc.
  leashRequirement: string; // e.g. "Con correa en áreas comunes, libre en sectores delimitados" etc.
  extraFeeForPets: string; // e.g. "Sin costo adicional" o el monto/política de tarifa
  additionalDetails?: string; // any other rule like "No dejarlos solos", etc.
}

export interface RecommendedPlace {
  name: string;
  description: string;
  highlights: string[];
  priceEstimate: string;
  petAmenities: string[];
  location: string;
  contactLink?: string;
  whatsappLink?: string;
  webOrInstagramLink?: string;
  reviews?: ReviewSource[];
  travelerComments?: TravelerComment[];
  petPolicies?: PetPolicies;
}

export interface RecommendedActivity {
  title: string;
  description: string;
  duration: string;
  petSuitability: string;
}

export interface PetFriendlySpot {
  name: string;
  type: string; // e.g. "Restaurante" | "Bar" | "Shopping" | "Café"
  address: string;
  description: string;
  specialPetBenefit?: string;
}

export interface VeterinaryClinic {
  name: string;
  address: string;
  phone: string;
  emergencyHours: string;
  isEmergencyCenter: boolean;
}

export interface PetNurseryOrSitter {
  name: string;
  type: string; // "Guardería" | "Cuidador"
  location: string;
  description: string;
  rating: string;
  reviewsCount?: string;
  highlights: string[];
  contactLink?: string;
}

export interface TripRecommendation {
  customPetGreeting: string;
  places: RecommendedPlace[];
  activities: RecommendedActivity[];
  packingList: string[];
  travelTips: string[];
  petFriendlySpots?: PetFriendlySpot[];
  veterinaryClinics?: VeterinaryClinic[];
  petNurseriesOrSitters?: PetNurseryOrSitter[];
}

export interface SavedTrip {
  id: string;
  date: string;
  province: string;
  travelersCount: number;
  childrenCount: number;
  pets: Pet[];
  stayType: string;
  recommendation: TripRecommendation;
}

export interface AccommodationCheckResult {
  found: boolean;
  name: string;
  location: string;
  isPetFriendly: "Sí" | "No" | "Condicional" | "Desconocido" | string;
  policyDetails: string;
  alternativeSuggest: string;
  confidenceScore: "Alta" | "Media" | "Baja" | string;
  reviews: ReviewSource[];
}

