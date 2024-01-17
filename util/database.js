import * as SQLite from 'expo-sqlite'
import { Place } from '../models/place'

const  database = SQLite.openDatabase('places.db')
  // Creates a new one if this is the first time running, or open the existing one


export function init(){
  // By promise-ifying this database thing, we only resolve it if it succeeds so we return a promise
  const promise = new Promise((resolve, reject) => {
    // Set up base structure (table with base structure)
    database.transaction((tx) => {
      // Pass SQL instruction
      // These are standard SQL commands
      // The id line says we want an id to be made automatically if there is not one provided
      // So this generates the table with the different parameters we want
      // Then the 2 functions after define what should happen if this succeeds and if it fails
        // They're callback functions
      // REAL is a number with decimals
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS places (
          id INTEGER PRIMARY KEY NOT NULL, 
          title TEXT NOT NULL,
          imageUri TEXT NOT NULL,
          address TEXT NOT NULL,
          lat REAL NOT NULL,
          lng REAL NOT NULL
        )`,
        [],
        () => {
          resolve()
        },
        (_, error) => {
          reject(error)
        }
        )
    }) // Perform query against database
  })
  return promise;
}


export function insertPlace(place){
  const promise = new Promise((resolve, reject) => {

    // The values in the [] replace the ?
    database.transaction((tx) => { // standard sql command to insert data
      tx.executeSql(`INSERT INTO places (title, imageUri, address, lat, lng) VALUES (?, ?, ?, ?, ?)`, 
      [place.title, place.imageUri, place.address, place.location.lat, place.location.lng],
      (_, result) => {
        console.log(result)
        resolve(result)
      },
      (_, error) => {
        reject(error)
      },
      )
    })

  })

  return promise
}



export function fetchPlaces(){
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => { 
      tx.executeSql('SELECT * FROM places', //This command gets all the places
      [], 
      (_, result) => {{
        const places = []

        for(const dp of result.rows._array){
          places.push(
            new Place(
              dp.title, 
              dp.imageUri, 
              {address: dp.address, lat: dp.lat, lng: dp.lng},
              dp.id
            ))
        }
        resolve(places)
      }}, 
      (_, error) => {
        reject(error)
      })
    })
  })

  return promise;
}



export function fetchPlaceDetails(id){
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM places WHERE id = ?', //This only gets the place with correct id
        [id],
        (_, result) => {
          const dbPlace = result.rows._array[0]
          const place = new Place(
            dbPlace.title,
            dbPlace.imageUri, 
            {lat: dbPlace.lat, lng: dbPlace.lng, address: dbPlace.address},
            dbPlace.id
            )
          resolve(place)
        },
        (_, error) => {
          reject(error)
        }
      )
    })
  })
  return promise
}
