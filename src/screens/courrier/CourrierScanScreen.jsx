import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, TouchableNativeFeedback, ActivityIndicator } from 'react-native'
import { Portal } from 'react-native-portalize';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Loading from '../../components/app/Loading';
import ErrorModal from '../../components/modals/ErrorModal';
import fetchApi from '../../helpers/fetchApi';
export default function CourrierScanScreen() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [location, setLocation] = useState("null")
    const navigation = useNavigation()
    const route = useRoute()

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location.coords);
        })();
    }, []);


    const askCameraPermission = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === "granted");
    }
    useEffect(() => {
        askCameraPermission()
    }, []);
    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
        console.log(JSON.parse(data))
        try {
            setLoading(true)
            const ScanCourrier = await fetchApi(`/services/coderefernce?CODE_REFERENCE=${data}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
            navigation.navigate('DetailCourrierScreen', { courrier: ScanCourrier.result })

        } catch (error) {
            console.log(error)
            if (error.message) {
                setError(error.message)
            }
        } finally {
            setLoading(false)
        }
    };


    if (hasPermission === false) {
        return <View style={{ alignContent: 'center', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Text>Pas d'accès à la caméra</Text>
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple('#fff')}
                useForeground={true}
                onPress={() => askCameraPermission()}
            >
                <View style={{ backgroundColor: '#ddd', borderRadius: 10, padding: 10, marginTop: 50 }}>
                    <Text>Autoriser l'accès</Text>
                </View>
            </TouchableNativeFeedback>
        </View>
    }

    return (
        // handleClose={onDecline}

        <View style={styles.container}>
            {loading && <Loading />}
            {error ? <ErrorModal onClose={() => {setError(null),setScanned(false)}} body={error} handleTitle="Ok" /> : null}
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
                barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
            />
            <View style={styles.mask}>
                <Text style={styles.scanTitle}>
                    Scanner un QR code du courrier
                </Text>
                <View style={styles.maskScan} />
                <View style={styles.scanActions}>
                    {/* {location && <Text style={{color: 'red'}}>{ calcCrow(qrCodeCoords.lat, qrCodeCoords.long, location.coords.latitude, location.coords.longitude) }</Text>} */}
                    <TouchableNativeFeedback
                        background={TouchableNativeFeedback.Ripple('#ddd')}
                        useForeground={true}
                        onPress={() => {
                            navigation.goBack()
                        }}
                    >
                        <View style={styles.actionBtn}>
                            <Ionicons name="close" size={40} color="#fff" />
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
            {false && <View style={{ flex: 1, height: '100%', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'center', alignItems: 'center', position: 'absolute' }}>
                <View style={{ width: 100, height: 100, backgroundColor: '#fff', borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator animating={true} color={'#000'} size='large' />
                </View>
            </View>}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 30,
        borderStartColor: '#fff'
    },
    mask: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    scanTitle: {
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        fontSize: 16,
        padding: 15,
        borderRadius: 10
    },
    scanActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    maskScan: {
        width: '70%',
        height: 250,
        borderColor: '#fff',
        borderRadius: 20,
        borderWidth: 2,
        backgroundColor: 'transparent'
    },
    actionBtn: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 100,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    }
})