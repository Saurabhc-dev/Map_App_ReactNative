import * as SQLite from "expo-sqlite";
import { Place } from "../models/place";

let db;

// ✅ Initialize DB
export async function init() {
  db = await SQLite.openDatabaseAsync("places.db");

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS places (
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      imageUri TEXT NOT NULL,
      address TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL
    );
  `);
}

// ✅ Insert Place
export async function insertPlace(place) {
  if (!db) {
    db = await SQLite.openDatabaseAsync("places.db");
  }

  const result = await db.runAsync(
    `INSERT INTO places (title, imageUri, address, lat, lng)
     VALUES (?, ?, ?, ?, ?)`,
    [
      place.title,
      place.imageUri,
      place.address,
      place.location.lat,
      place.location.lng,
    ],
  );

  return result;
}

// ✅ Fetch Places (FINAL FIXED)
export async function fetchPlaces() {
  if (!db) {
    db = await SQLite.openDatabaseAsync("places.db");
  }

  const result = await db.getAllAsync("SELECT * FROM places");

  const places = result.map(
    (dp) =>
      new Place(
        dp.title,
        dp.imageUri,
        {
          address: dp.address,
          lat: dp.lat,
          lng: dp.lng,
        },
        dp.id,
      ),
  );

  return places;
}

export async function fetchPlaceDetails(id) {
  if (!db) {
    db = await SQLite.openDatabaseAsync("places.db");
  }

  const dp = await db.getFirstAsync(
    "SELECT * FROM places WHERE id = ?",
    [id]
  );

  return new Place(
    dp.title,
    dp.imageUri,
    {
      address: dp.address,
      lat: dp.lat,
      lng: dp.lng,
    },
    dp.id
  );
}
