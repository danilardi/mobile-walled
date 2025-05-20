import { View } from "react-native";
import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../../global.css";

// import {}
const RootLayout = () => {
    return (
        <>
            <View style={{ flex: 1 }}>
                <SafeAreaProvider>
                    <SafeAreaView style={{ flex: 1 }} edges={["bottom", "top"]}>
                        <Stack
                            screenOptions={{
                                headerShown: false,
                                statusBarBackgroundColor: "fff",
                                statusBarStyle: "dark",
                                contentStyle: {
                                    backgroundColor: "#f2f2f2",
                                },
                            }}
                        >
                            <StatusBar style="dark" />
                        </Stack>
                    </SafeAreaView>
                </SafeAreaProvider>
            </View>
        </>
    );
};

export default RootLayout;
