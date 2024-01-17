import { Alert, View, Text, Image, StyleSheet } from "react-native";
import {launchCameraAsync, useCameraPermissions, PermissionStatus} from 'expo-image-picker'
import { useState } from "react";
import { Colors } from "../../constants/colors";
import OutlinedButton from "../UI/OutlinedButton";

function ImagePicker({onTakeImage}){

  const [pickedImage, setPickedImage] = useState()

  const [cameraPermissionInformation, requestPermission] = useCameraPermissions()

  async function verifyPermissions(){
    if(cameraPermissionInformation.status === PermissionStatus.UNDETERMINED 
      || cameraPermissionInformation.status === PermissionStatus.DENIED){
      const permissionReponse = await requestPermission()

      return permissionReponse.granted //true or false depending on if it was given
    }
    if(cameraPermissionInformation.status === PermissionStatus.DENIED){
      Alert.alert('Insufficient Permissions!', 'You need to grant camera permissions to use this app.')
      return false
    }
    return true
  }

  async function takeImageHandler(){
    const hasPermission = await verifyPermissions()

    if(!hasPermission){
      return
    }
    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
      
    })
    setPickedImage(image.assets[0].uri)
    onTakeImage(image.assets[0].uri)
  }

  let imagePreview = <Text>No image taken yet.</Text>
  if(pickedImage){
    imagePreview = <Image style={styles.image} source={{uri: pickedImage}}/>
  }

  return(
    <View>
      <View style={styles.imagePreview}>{imagePreview}</View>
      <OutlinedButton onPress={takeImageHandler} icon="camera">Take Image</OutlinedButton>
    </View>
  )
}

export default ImagePicker;

const styles = StyleSheet.create({
  imagePreview: {
    width: '100%',
    height: 200,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  }
})