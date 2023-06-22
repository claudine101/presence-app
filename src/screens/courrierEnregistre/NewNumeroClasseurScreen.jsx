import React, { useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, View, TouchableWithoutFeedback,TouchableNativeFeedback } from "react-native";
import { OutlinedTextField } from 'rn-material-ui-textfield'
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation ,useRoute} from '@react-navigation/native';
import { COLORS } from '../../styles/COLORS';
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import Loading from '../../components/app/Loading';
import { useEffect } from 'react';

/**
 * Screen pour l'enregistrement departemant
 * @author NDAYISABA claudine <claudine@mediabox.bi>
 * @date 06/06/2023 à 13:15 à 13:16
 * @returns 
 */

export default function NewNumeroClasseurScreen() {
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false);
    const numeroInputRef = useRef(null)
    const route = useRoute()
    const{newNumero,previousRouteName,departemant}=route.params
    const handleBackPress = () => {
        navigation.goBack()
}
    const [data, handleChange, setValue] = useForm({
        numero: "",
    })

    useEffect (()=>{
      if(newNumero&&newNumero.NUMERO_CLASSEUR){
        handleChange("numero",newNumero.NUMERO_CLASSEUR)
      }
      
    }, [newNumero])
    const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
        numero: {
            required: true,
        }
    }, {
        numero: {
            required: 'Ce champ est obligatoire',
        }
    })

    const enregistrement = async () => {
        setLoading(true)
        navigation.navigate(previousRouteName,{
            ...route.params,
            numeroClasseur:{
                ID_CLASSEUR:"new",
                ID_DEPARTEMENT:departemant.DEPARTEMENT_ID,
                NUMERO_CLASSEUR:data.numero,
            },
        })
      
    }

    return (
        <>
            {loading && <Loading />}
            <View style={styles.container}>

            <View style={styles.header}>
                <View style={styles.exiitSearch}>
                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#C4C4C4', true)} onPress={handleBackPress}>
                        <View style={styles.headerBtn}>
                            <Ionicons name="arrow-back-outline" size={24} color={COLORS.primary} />
                        </View>
                    </TouchableNativeFeedback>
                    <View style={styles.cardTitle}>
                            <Text style={styles.Title}>Nouvelle departemant</Text>
                        </View>
                </View>
                
            </View>

                <ScrollView keyboardShouldPersistTaps="handled">
                    <View>
                        <View style={styles.inputCard}>
                            <View>
                                <OutlinedTextField
                                    label="Numero  classeur"
                                    fontSize={14}
                                    baseColor={COLORS.smallBrown}
                                    tintColor={COLORS.primary}
                                    containerStyle={{ borderRadius: 20 }}
                                    lineWidth={1}
                                    activeLineWidth={1}
                                    errorColor={COLORS.error}
                                    value={data.numero}
                                    onChangeText={(newValue) => handleChange('numero', newValue)}
                                    onBlur={() => checkFieldData('numero')}
                                    error={hasError('numero') ? getError('numero') : ''}
                                    ref={numeroInputRef}
                                    onSubmitEditing={() => {
                                        descriptionInputRef.current.focus()
                                    }}
                                    autoCompleteType='off'
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                    keyboardType='number-pad'
                                />
                            </View>

                        </View>
                        
                        <TouchableWithoutFeedback
                            disabled={!isValidate()}
                            onPress={enregistrement}>
                            <View style={[styles.button, !isValidate() && { opacity: 0.5 }]}>
                                <Text style={styles.buttonText}>Enregistrer</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </ScrollView>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
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
        fontWeight: "bold",
        color:COLORS.primary
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
        backgroundColor:"#18678E",
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