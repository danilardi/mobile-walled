import { StatusBar } from 'expo-status-bar';
import { Button, Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { getCurrentPositionAsync, requestForegroundPermissionsAsync, reverseGeocodeAsync } from 'expo-location';
import HeroWelcome from '../../assets/images/hero-welcome.png';

export default function Index() {
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      const currentLocation = await getCurrentPositionAsync({});
      const address = await reverseGeocodeAsync(currentLocation.coords);
      setAddress(address[0]);
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      // mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  const pickCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [1, 1],
      quality: 1,
    })

    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  return (
    <>
      {/* Home Screen */}
      <View className="flex-1">
        {/* StatusBar */}
        <View className="flex-row bg-white px-5 py-2.5 justify-between items-center">
          <View className="flex-row items-center gap-2">
            <TouchableOpacity onPress={()=> setModalVisible(true)} className="border-[5px] border-[#178F8D] rounded-full">
              <Image
                source={{ uri: image ? image : "https://reactnative.dev/img/tiny_logo.png" }}
                className="w-12 h-12 rounded-full"
              />
            </TouchableOpacity>
            <View>
              <Text className="text-[14px] font-bold">Danil Ardi</Text>
              <View className="flex-row items-center gap-2">
                <Ionicons name="location-outline" size={12} color="black" />
                <Text className="text-[14px]">{address?.city ? address.city : "location"}</Text>
              </View>
            </View>
          </View>
          <Ionicons name="sunny-outline" size={26} color="#F8AB39" />
        </View>

        {/* Main Content */}
        <View className="flex-1 bg-[#FAFBFD] py-[50px] px-5">
          <View className="flex-row justify-between items-center gap-4">
            <View className="flex-1">
              <Text className="text-[20px] font-bold">Good Morning, Danil</Text>
              <Text className="text-[16px] mt-5">Check all your incoming and outgoing transactions here</Text>
            </View>
            <Link href="/notification" className="text-[#178F8D] text-[16px] font-bold">
              <Image source={HeroWelcome} style={{width:81, height:77}} />
            </Link>
          </View>
        </View>
        <StatusBar style="auto" />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white rounded-lg p-5 gap-4">
              <Button title='Pick an image' onPress={() => {
                pickImage();
                setModalVisible(!modalVisible);
              }} />
              <Button title='Open Camera' onPress={() => {
                pickCamera();
                setModalVisible(!modalVisible);
              }} />
              <Button title='Cancel' onPress={() => setModalVisible(!modalVisible)} />
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}
