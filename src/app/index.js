import { StatusBar } from 'expo-status-bar';
import { Button, Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
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
            <TouchableOpacity onPress={() => setModalVisible(true)} className="border-[5px] border-[#178F8D] rounded-full">
              <Image
                source={{ uri: image ? image : "https://reactnative.dev/img/tiny_logo.png" }}
                className="w-12 h-12 rounded-full"
              />
            </TouchableOpacity>
            <View>
              <Text className="text-[14px] font-semibold">Danil Ardi</Text>
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
              <Text className="text-[20px] font-semibold">Good Morning, Danil</Text>
              <Text className="text-[16px] mt-5">Check all your incoming and outgoing transactions here</Text>
            </View>
            <Link href="/notification" className="text-[#178F8D] text-[16px] font-semibold">
              <Image source={HeroWelcome} style={{ width: 81, height: 77 }} />
            </Link>
          </View>
          <View className="flex-row justify-between items-center h-12 mt-7 bg-[#0061FF] px-5 py-2 rounded-[16px]">
            <Text className="text-white text-base ">Account No.</Text>
            <Text className="text-white text-base font-semibold">100899</Text>
          </View>
          <View className="mt-5 bg-white px-5 py-4 rounded-[16px] shadow-md">
            <View className="flex-row justify-between items-center ">
              <View>
                <Text className="text-sm">Balance</Text>
                <View className="flex-row">
                  <Text className="text-2xl font-semibold">Rp 10.000.000</Text>
                  <Ionicons name="eye-outline" size={24} color="black" />
                </View>
              </View>
              <View>
                <TouchableOpacity className="btn">
                  <Feather name="plus" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
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
