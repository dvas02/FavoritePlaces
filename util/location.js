const GOOGLE_API_KEY = 'AIzaSyBP5bjsx1F58iV2UxkknwOGsIWiSGA8Pkg'

export function getMapPreview({lat, lng}){
  const imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:S%7C${lat},${lng}&key=${GOOGLE_API_KEY}`
  return imagePreviewUrl
}


//https://maps.googleapis.com/maps/api/staticmap?center=37.785834,-122.406417&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:S%7C37.785834,-122.406417&key=AIzaSyBP5bjsx1F58iV2UxkknwOGsIWiSGA8Pkg

export async function getAddress(lat, lng){
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
  const response = await fetch(url)

  if(!response.ok){
    // Tells us if we got error or not
    throw new Error('Failed to fetch address')
  }

  const data = await response.json()
  const address = data.results[0].formatted_address
  return address
}