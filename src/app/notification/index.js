import { isDevice } from "expo-device";
import { addNotificationReceivedListener, addNotificationResponseReceivedListener, AndroidImportance, getExpoPushTokenAsync, getPermissionsAsync, removeNotificationSubscription, requestPermissionsAsync, scheduleNotificationAsync, setNotificationChannelAsync, setNotificationHandler } from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Alert, Button, Platform, Text, View } from "react-native";

setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export default function NotificationsExample() {
    const [expoPushToken, setExpoPushToken] = useState('');
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            if (token) {
                setExpoPushToken(token);
            }
        });

        notificationListener.current = addNotificationReceivedListener(notification => {
            console.log('Notification received:', notification);
        })

        responseListener.current = addNotificationResponseReceivedListener(response => {
            console.log('Notification response received:', response);
            Alert.alert('Notification Response', `You tapped on the notification: ${response.notification.request.content.title}`);
        })

        return () => {
            removeNotificationSubscription(notificationListener.current);
            removeNotificationSubscription(responseListener.current);
        }
    }, [])

    async function registerForPushNotificationsAsync() {
        let token;
        if (!isDevice) {
            alert('Must use physical device for Push Notifications');
            return;
        }
        const { status: existingStatus } = await getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notifications!');
            return;
        }
        token = (await getExpoPushTokenAsync()).data
        console.log('Expo Push Token:', token);
        if (Platform.OS === 'android') {
            await setNotificationChannelAsync('default', {
                name: 'default',
                importance: AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
        return token;
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