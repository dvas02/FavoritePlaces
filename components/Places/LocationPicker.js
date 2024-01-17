import { Alert, View, StyleSheet, Text, Image } from "react-native";
import OutlinedButton from "../UI/OutlinedButton";
import { Colors } from "../../constants/colors";
import {getCurrentPositionAsync, useForegroundPermissions, PermissionStatus} from 'expo-location'
import { useEffect, useState } from "react";
import { getAddress, getMapPreview } from "../../util/location";
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";




function LocationPicker({onPickLocation}){

  const navigation = useNavigation()
  const route = useRoute()
  const isFocused = useIsFocused() // returns bool, true if screen is currently focused

  const [pickedLocation, setPickedLocation] = useState(null);

  const [LocationPermissionInformation, requestPermission] = useForegroundPermissions()
  
  

  useEffect(() => {
    if(isFocused && route.params){
      const mapPickedLocation = {
        lat: route.params.pickedLat, 
        lng: route.params.pickedLng
      }
      setPickedLocation(mapPickedLocation)
      
    }
  
  }, [route, isFocused])

  useEffect(() => {
    async function handleLocation() {
      if(pickedLocation){
        const address = await getAddress(pickedLocation.lat, pickedLocation.lng)
        onPickLocation({...pickedLocation, address: address})
      }
    }

    handleLocation()
    
  }, [pickedLocation, onPickLocation])

  async function verifyPermissions(){
    if(LocationPermissionInformation.status === PermissionStatus.UNDETERMINED 
      || LocationPermissionInformation.status === PermissionStatus.DENIED){
      const permissionReponse = await requestPermission()

      return permissionReponse.granted //true or false depending on if it was given
    }
    if(LocationPermissionInformation.status === PermissionStatus.DENIED){
      Alert.alert('Insufficient Permissions!', 'You need to grant location permissions to use this app.')
      return false
    }
    return true
  }
    

  async function getLocationHandler(){
    const hasPermission = await verifyPermissions()
    if(!hasPermission){
      return
    }
    const location = await getCurrentPositionAsync()
    console.log(location)
    setPickedLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude
    })
  }

  function pickOnMapHandler(){
    navigation.navigate('Map')
  }

  let locationPreview = <Text>No Location Picked Yet</Text>

  if(pickedLocation){
    locationPreview = <Image style={styles.image} source={{uri: getMapPreview(pickedLocation.lat, pickedLocation.lng)}}/>
  }


  return(
    <View>
      <View style={styles.mapPreview}>
        {locationPreview}
      </View>
      <View style={styles.actions}>
        <OutlinedButton icon="location" onPress={getLocationHandler}>Locate User</OutlinedButton>
        <OutlinedButton icon="map" onPress={pickOnMapHandler}>Pick on Map</OutlinedButton>
      </View>
    </View>
  )
}

export default LocationPicker;

const styles = StyleSheet.create({
  mapPreview: {
    width: '100%',
    height: 200,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  }
})