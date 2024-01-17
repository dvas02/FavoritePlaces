import MapView, { Marker } from 'react-native-maps'
import { Alert, StyleSheet } from 'react-native';
import { useCallback, useLayoutEffect, useState } from 'react';
import IconButton from '../components/UI/IconButton';

function Map({navigation, route}){

  const initialLocation = route.params &&
  {lat: route.params.intialLat, lng: route.params.initialLng}
  //Only want this to be set if route.params is defined
  

  const [selectedLocation, setSelectedLocation] = useState(initialLocation)
  
  const region = {
    latitude: initialLocation ? initialLocation.lat : 45.470990, //Center of the map
    longitude: initialLocation ? initialLocation.lng : -73.662790, //Center of the map
    latitudeDelta: 0.0922, // Sets zoom of map
    longitudeDelta: 0.0421, // Sets zoom of map
  }

  function selectedLocationHandler(event){
    if(initialLocation){
      return;
    }
    const lat = event.nativeEvent.coordinate.latitude;
    const lng = event.nativeEvent.coordinate.longitude;

    setSelectedLocation({lat: lat, lng: lng})
  }

  const savePickedLocationHandler = useCallback(() => {
    if(!selectedLocation){
      Alert.alert('No location picked!', 'You havce to pick a location first')
      return
    }
    navigation.navigate('AddPlace', {pickedLat: selectedLocation.lat, pickedLng: selectedLocation.lng})

  }, [navigation, selectedLocation]) //whenever either of these things changed, this function is recreated
  // stops infinite loops
  // required whenever a function is used as a dependicy in an effect

  useLayoutEffect(() => {
    if(initialLocation){
      return; // Dont want to have the save button thing if we are in "view" mode
    }

    navigation.setOptions({
      headerRight: ({tintColor}) => <IconButton onPress={savePickedLocationHandler} icon={"save"} size={24} color={tintColor}/>
    })
  }, [navigation, savePickedLocationHandler, initialLocation])

  return (
  <MapView style={styles.map} initialRegion={region} onPress={selectedLocationHandler}>
    {selectedLocation && <Marker 
      title='Picked Location'
      coordinate={{latitude: selectedLocation.lat, longitude: selectedLocation.lng}}/>}
  </MapView>
  )
}

export default Map;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  }
})