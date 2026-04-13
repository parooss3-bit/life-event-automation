/*
 * Geolocation Utilities
 * Location-based filtering and distance calculation
 */

export interface Location {
  latitude: number;
  longitude: number;
}

export interface BusinessLocation {
  city: string;
  state: string;
  zip: string;
}

// Mock coordinates for cities (in production, use geocoding API)
const cityCoordinates: Record<string, Location> = {
  "San Francisco": { latitude: 37.7749, longitude: -122.4194 },
  "Los Angeles": { latitude: 34.0522, longitude: -118.2437 },
  "New York": { latitude: 40.7128, longitude: -74.006 },
  "Chicago": { latitude: 41.8781, longitude: -87.6298 },
  "Houston": { latitude: 29.7604, longitude: -95.3698 },
  "Phoenix": { latitude: 33.4484, longitude: -112.074 },
  "Philadelphia": { latitude: 39.9526, longitude: -75.1652 },
  "San Antonio": { latitude: 29.4241, longitude: -98.4936 },
  "San Diego": { latitude: 32.7157, longitude: -117.1611 },
  "Dallas": { latitude: 32.7767, longitude: -96.797 },
};

/**
 * Get user's current location using geolocation API
 */
export async function getUserLocation(): Promise<Location | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.warn("Geolocation error:", error);
        resolve(null);
      }
    );
  });
}

/**
 * Calculate distance between two coordinates in miles
 * Using Haversine formula
 */
export function calculateDistance(
  from: Location,
  to: Location
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(to.latitude - from.latitude);
  const dLon = toRad(to.longitude - from.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.latitude)) *
      Math.cos(toRad(to.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Get coordinates for a city
 */
export function getCityCoordinates(city: string): Location | null {
  return cityCoordinates[city] || null;
}

/**
 * Convert degrees to radians
 */
function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Format distance for display
 */
export function formatDistance(miles: number): string {
  if (miles < 0.1) return "< 0.1 mi";
  if (miles < 1) return `${miles.toFixed(1)} mi`;
  return `${miles.toFixed(1)} mi`;
}
