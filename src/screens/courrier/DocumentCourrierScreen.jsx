import React, { useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, TouchableNativeFeedback, TextInput } from "react-native";
import { OutlinedTextField } from 'rn-material-ui-textfield'
import { FontAwesome, Fontisto, EvilIcons, AntDesign, Entypo, Ionicons,Feather } from '@expo/vector-icons';
import fetchApi from '../../helpers/fetchApi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUserAction } from "../../store/actions/userActions"
import { COLORS } from '../../styles/COLORS';
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import Loading from '../../components/app/Loading';
import { notificationTokenSelector } from '../../store/selectors/appSelectors';
import { useEffect } from 'react';


export default function DocumentCourrierScreen() {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false);

    const prenomInputRef = useRef(null)
    const token = useSelector(notificationTokenSelector)

    const route = useRoute()



    const previousRouteName = navigation.getState().routes[navigation.getState().index - 2].name


    const handleBackPress = () => {
        navigation.goBack()
    }
    const [data, handleChange, setValue] = useForm({
        descriptionsociete: "",

    })

    // useEffect (()=>{
    //   if(newSociete&&newSociete.DESCRIPTION){
    //     handleChange("descriptionsociete",newSociete.DESCRIPTION)
    //   }
    // }, [newSociete])
    const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
        descriptionsociete: {
            required: true,
            length: [1, 50]
        }
    }, {
        descriptionsociete: {
            required: 'Ce champ est obligatoire',
            length: "Nom de la socièté est invalide"
        }
    })

    const enregistrement = async () => {
        setLoading(true)
        // navigation.navigate(previousRouteName,{
        //     societe:{
        //         ID_SOCIETE:"new",
        //         DESCRIPTION:data.descriptionsociete
        //     }
        // })

    }

    return (
        <>
            {loading && <Loading />}
            <View style={styles.container}>

                <View style={styles.header}>
                    <View style={styles.exiitSearch}>
                        <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#C4C4C4', true)} onPress={handleBackPress}>
                            <View style={styles.headerBtn}>
                                <Ionicons name="arrow-back-outline" size={24} color="#777" />
                            </View>
                        </TouchableNativeFeedback>

                    </View>

                </View>

                <ScrollView keyboardShouldPersistTaps="handled">
                    <View>
                        <View style={styles.inputCard}>
                            <View>
                                <OutlinedTextField
                                    label="Lieu du courrier"
                                    fontSize={14}
                                    baseColor={COLORS.smallBrown}
                                    tintColor={COLORS.primary}
                                    containerStyle={{ borderRadius: 20 }}
                                    lineWidth={1}
                                    activeLineWidth={1}
                                    errorColor={COLORS.error}
                                    value={data.descriptionsociete}
                                    onChangeText={(newValue) => handleChange('descriptionsociete', newValue)}
                                    onBlur={() => checkFieldData('descriptionsociete')}
                                    error={hasError('descriptionsociete') ? getError('descriptionsociete') : ''}
                                    onSubmitEditing={() => {
                                        prenomInputRef.current.focus()
                                    }}
                                    autoCompleteType='off'
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                />
                            </View>

                        </View>

                        <View style={styles.inputCard}>
                            <View style={[styles.selectControl, { marginTop: 10 }]}>
                                <Text style={styles.sectionTitle}>Document</Text>
                                <View style={styles.images}>

                                  
                                     <TouchableWithoutFeedback >
                                        <View style={[styles.addImager,{ marginLeft: 10 }]}>
                                            <Feather name="image" size={30} color="#777" />
                                        </View>
                                    </TouchableWithoutFeedback> 
                                </View>
                            </View>

                        </View>
                        {/* <TouchableWithoutFeedback
                            disabled={!isValidate()}
                            onPress={enregistrement}>
                            <View style={[styles.button, !isValidate() && { opacity: 0.5 }]}>
                                <Text style={styles.buttonText}>Enregistrer</Text>
                            </View>
                        </TouchableWithoutFeedback> */}
                    </View>
                </ScrollView>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    addImager: {
        width: 360,
        height: 60,
        backgroundColor: '#F1F1F1',
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 5,
},
    images: {
        flexDirection: "row"
},
    sectionTitle: {
        fontSize: 13
},
    selectControl: {
        paddingHorizontal: -1
},
    exiitSearch: {
        flexDirection: "row",
        alignItems: "center",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10
    },
    headerBtn: {
        padding: 10,
        borderRadius: 20
    },
    selectLabel: {
        color: '#777',
        fontSize: 13
    },
    selectContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // marginHorizontal: 2,
        backgroundColor: "#fff",
        padding: 13,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: "#777",
        marginVertical: 7
    },
    Title: {
        fontSize: 18,
        fontWeight: "bold"
    },
    description: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1D8585"
    },
    cardTitle: {
        flexDirection: "row",
        marginTop: 30,
        marginVertical: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    inputCard: {
        marginHorizontal: 20,
        marginTop: 10
    },
    InputIcon: {
        position: "absolute",
        right: 15,
        marginTop: 15
    },
    button: {
        marginTop: 10,
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 10,
        backgroundColor: COLORS.primaryPicker,
        marginHorizontal: 20
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        // textTransform:"uppercase",
        fontSize: 16,
        textAlign: "center"
    },
    cardButton: {
        marginBottom: 20,
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 118
    },
    container: {
        flex: 1,
    },
    errorss: {
        fontSize: 12,
        color: "red"
    }
})