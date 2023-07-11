import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View, Image} from "react-native";
import { COLORS } from "../../styles/COLORS";
import AppHeader from "../../components/app/AppHeader";
import { FloatingAction } from "react-native-floating-action";
import { useSelector } from 'react-redux';
import { userSelector } from '../../store/selectors/userSelector';
/**
 * Screen pour la listes des volume planifier pour vous
 * @author Vanny Boy <vanny@mediabox.bi>
 * @date 11/7/2023
 * @returns 
 */
export default function AllVolumeScreen() {
    const navigation = useNavigation()
    const user = useSelector(userSelector)

    const Action = ({ title, image }) => {
        return (
            <View style={styles.action}>
                <Text style={styles.actionLabel}>{title}</Text>
                <View style={styles.actionIcon}>
                    <Image source={image} style={{ tintColor: '#fff', maxWidth: '50%', maxHeight: '50%', minWidth: '50%', minHeight: '50%' }} />
                </View>
            </View>
        )
    }

    const actions = [
        {
            text: "Ajouter volume",
            icon: require("../../../assets/images/entrant.jpg"),
            name: "NewVolumeScreen",
            position: 1,
            render: () => <Action title={"Courrier entrants"} image={require("../../../assets/images/mail-receive-small.png")} key={"key1"} />
        },
        {
            text: "Scanner un QR",
            icon: require("../../../assets/images/qr-code.png"),
            name: "CourrierScanScreen",
            position: 3,
            render: () => <Action title={"Scanner un QR"} image={require("../../../assets/images/qr-code.png")} key={"key3"} />
        }
    ];

    return (
        <>
            <AppHeader />
                    <View style={styles.emptyContaier}>
                        <Image source={require('../../../assets/images/mail-receive.png')} style={styles.emptyImage} />
                                <Text style={styles.emptyTitle}>
                                    Aucun volume trouvé
                                </Text>
                        <Text style={styles.emptyDesc}>
                            Aucun volume planifier ou vous n'êtes pas affecte a aucun volume
                        </Text>
                    </View>

            <FloatingAction
                actions={actions}
                onPressItem={name => {
                    if (name == 'NewVolumeScreen') {
                        navigation.navigate("NewVolumeScreen")
                    } else {
                        // scanModalizeRef.current?.open()
                        navigation.navigate('CourrierScanSourceScreen')
                    }
                }}
                color={COLORS.primary}
            />
        </>
    )
}

const styles = StyleSheet.create({
    actionIcon: {
        width: 45,
        height: 45,
        backgroundColor: COLORS.primary,
        borderRadius: 50,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    actionLabel: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 5,
        marginRight: 10,
        fontWeight: 'bold',
    },
    action: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center'
    },
    emptyContaier: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain'
    },
    emptyTitle: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 10,
        fontSize: 15
    },
    emptyDesc: {
        color: '#777',
        textAlign: 'center',
        maxWidth: 300,
        lineHeight: 20
    }
})