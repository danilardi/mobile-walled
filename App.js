import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import "./global.css"

export default function App() {
  return (
    <View className="flex-1 bg-black items-center justify-center">
      <Text className="text-green-600 text-center">Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}
