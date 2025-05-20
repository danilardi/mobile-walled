import { CameraView, useCameraPermissions } from "expo-camera";
import { CameraType } from "expo-image-picker";
import { useEffect, useRef, useState } from "react"
import { Button, Text, View } from "react-native";

export default function FullCamera() {
    const [image, setImage] = useState(null);
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef(null);

    useEffect(() => {
        if (!permission?.granted) requestPermission();
    }, []);

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            setImage(photo.uri);
        }
    }

    if (!permission) return <Text>Requesting permission...</Text>;
    if (!permission.granted)
        return (
            <View>
                <Text>No access to camera</Text>
                <Button title="Grant Permission" onPress={requestPermission} />
            </View>
        );

    return (
        <>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <CameraView style={{ widht: 300, height: 300 }} facing={type} ref={cameraRef} />
                <Button
                    title="Flip Camera"
                    onPress={() => setType(type === CameraType.back ? CameraType.front : CameraType.back)} />
                <Button title="Take Picture" onPress={takePicture} />
                {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginTop: 10 }} />}
            </View>
        </>
    )
}