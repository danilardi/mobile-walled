import { isDevice } from "expo-device";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useEffect, useRef, useState } from "react";
import { Alert, Button, Platform, Text, View } from "react-native";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

function handleRegistrationError(errorMessage) {
    alert(errorMessage);
    throw new Error(errorMessage);
}

export default function NotificationsExample() {
    const [expoPushToken, setExpoPushToken] = useState('');

    useEffect(() => {
        registerForPushNotificationsAsync()
            .then(token => setExpoPushToken(token ?? ''))
            .catch((error) => setExpoPushToken(`${error}`));

        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notification received:', notification);
        });

        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('Notification response received:', response);
            Alert.alert('Notification Response', `You tapped on the notification: ${response.notification.request.content.title}`);
        });

        return () => {
            notificationListener.remove();
            responseListener.remove();
        };

    }, [])

    async function registerForPushNotificationsAsync() {
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                handleRegistrationError('Permission not granted to get push token for push notification!');
                return;
            }
            const projectId =
                Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
            if (!projectId) {
                handleRegistrationError('Project ID not found');
            }
            try {
                const pushTokenString = (
                    await Notifications.getExpoPushTokenAsync({
                        projectId,
                    })
                ).data;
                console.log(pushTokenString);
                return pushTokenString;
            } catch (e) {
                handleRegistrationError(`${e}`);
            }
        } else {
            handleRegistrationError('Must use physical device for push notifications');
        }
    }

    const scheduleNotification = async () => {
        await scheduleNotificationAsync({
            content: {
                title: "You've got mail! 📬",
                body: 'Here is the notification body',
                sound: true,
                channelId: 'default', // tambahkan ini
            },
            trigger: null,
        });
    }

    return (
        <>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Your Expo Push Token:</Text>
                <Text selectable style={{ margin: 10 }}>{expoPushToken || 'Fetching token...'}</Text>
                <Button
                    title="Schedule local notification"
                    onPress={scheduleNotification}
                />
            </View>
        </>
    )
}