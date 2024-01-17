export class Place{
  constructor(title, imageUri, location, id){
    this.title = title;
    this.imageUri = imageUri;
    this.address = location.address; // 6877 edison
    this.location = {lat: location.lat, lng: location.lng}; // {lat: 0.243543, lng: 123.432}
    this.id = id;
  }
}