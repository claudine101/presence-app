import React, { useRef, useState, } from 'react'
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, ToastAndroid, TouchableWithoutFeedback, Image } from "react-native";
import { OutlinedTextField } from 'rn-material-ui-textfield'
import { FontAwesome, Fontisto, EvilIcons, Feather, MaterialIcons } from '@expo/vector-icons';
import fetchApi from '../../helpers/fetchApi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '../../styles/COLORS';
import { useForm } from '../../hooks/useForm';
import { useFormErrorsHandle } from '../../hooks/useFormErrorsHandle';
import Loading from '../../components/app/Loading';
import { notificationTokenSelector } from '../../store/selectors/appSelectors';
import { MaterialCommunityIcons, AntDesign, Entypo } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useEffect } from 'react';

export default function InscriptionScreen() {
    const route = useRoute()
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false);
    const plaqueInputRef = useRef(null)
    const prenomInputRef = useRef(null)
    const telRef = useRef(null)
    const emailInputRef = useRef(null)
    const passwordInputRef = useRef(null)
    const banqueInputRef = useRef(null)
    const titulaireInputRef = useRef(null)
    const [logo, setLogo] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);


    const password_confirmInputRef = useRef(null)
    const token = useSelector(notificationTokenSelector)
    const [data, handleChange, setValue] = useForm({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        password: "",
        password_confirm: "",
        profil: "",
        genre: "",
        banque: "",
        titulaire: "",
        compte: "",
        permis: null,
        plaque: "",
        conduite: null,
        cni: null,
        assurence: null,
        controle: null,
        carte: null,
        vehicule: null,
        user: null,
        societe: null,
        departemant: null,
    })
    const { errors, setError, getErrors, setErrors, checkFieldData, isValidate, getError, hasError } = useFormErrorsHandle(data, {
        nom: {
            required: true,
            length: [1, 50]
        },
        genre: {
            required: true,
        },
        profil: {
            required: true,
        },
        // logo: {
        //     required: true,
        // },
        prenom: {
            required: true,
            length: [1, 50]
        },
        email: {
            required: true,
            email: true
        },
        password: {
            required: true,
            length: [8]
        },
        telephone: {
            required: true,
            length: [8]
        },
        password_confirm: {
            required: true,
            length: [8],
            match: "password"
        }
    }, {
        nom: {
            required: 'Le nom est obligatoire',
            length: "Nom invalide"
        },
        prenom: {
            required: 'Le prénom est obligatoire',
            length: "Prénom invalide"
        },
        email: {
            required: "L'email est obligatoire",
            email: "Email invalide"
        },
        telephone: {
            required: "Le Telephone est obligatoire",

        },
        password: {
            required: "Le mot de passe est obligatoire",
            length: "Mot de passe trop court"
        },
        password_confirm: {
            required: "Ce champ est obligatoire",
            length: "Mot de passe trop court",
            match: "Les mots de passe ne correspondent pas"
        }
    })

    const isValid = () => {
        var isValiDocument = false
        if (data.profil == 2) {
            isValiDocument = (data.societe && data.departemant) ? true : false
        }
        else if (data.profil == 3) {
            isValiDocument = (data.banque && data.titulaire && data.compte && data.permis
                && data.permis && data.conduite && data.cni && data.assurence &&
                data.controle && data.carte && data.vehicule && data.plaque) ? true : false
        }
        else {
            isValiDocument = logo ? true : false
        }
        return isValidate() && isValiDocument
    }
    const societeselect = () => {
        navigation.navigate('SocieteScreen', {
            societe: data.societe,
            previousRouteName: "Inscription"
        })
    }
    useEffect(() => {
        const { societe } = route.params || {}
        if (societe) {
            handleChange("societe", societe)
        }
    }, [route])

    const departemantselect = () => {
        navigation.navigate('DepartemantScreen', {
            departemant: data.departemant,
            societe: data.societe,
            previousRouteName: "Inscription"
        })
    }
    useEffect(() => {
        const { departemant } = route.params || {}
        if (departemant) {
            handleChange("departemant", departemant)
        }
    }, [route])

    /**
     *fonction utiliser pour  selectionner  permis de conduire
     * @author NDAYISABA claudine <claudine@mediabox.bi>
     * @date 06/05/2023
     * @returns 
     */
    const selectpermis = async () => {
        setError("permis", "")
        handleChange("permis", null)
        const permis = await DocumentPicker.getDocumentAsync({
            type: ["image/*", "application/pdf", "application/docx", "application/xls", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
        })
        if (permis.type == 'cancel') {
            return false
        }
        var sizePermis = ((permis.size / 1000) / 1000).toFixed(2)
        if (sizePermis <= 2) {
            handleChange("permis", permis)
        }
        else {
            setError("permis", ["permis trop volumineux(max:2M)"])
        }
    }
    /**
    *fonction utiliser pour  selectionner  attestation  de bonne conduite
    * @author NDAYISABA claudine <claudine@mediabox.bi>
    * @date 06/05/2023
    * @returns 
    */
    const selectconduite = async () => {
        setError("conduite", "")
        handleChange("conduite", null)
        const conduite = await DocumentPicker.getDocumentAsync({
            type: ["image/*", "application/pdf", "application/docx", "application/xls", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
        })
        if (conduite.type == 'cancel') {
            return false
        }
        var sizePermis = ((conduite.size / 1000) / 1000).toFixed(2)
        if (sizePermis <= 2) {
            handleChange("conduite", conduite)
        }
        else {
            setError("conduite", ["attestation  de bonne conduite trop volumineux(max:2M)"])
        }
    }
    /**
  *fonction utiliser pour  selectionner cni /PASSPORT
  * @author NDAYISABA claudine <claudine@mediabox.bi>
  * @date 06/05/2023
  * @returns 
  */
    const selectcni = async () => {
        setError("cni", "")
        handleChange("cni", null)
        const cni = await DocumentPicker.getDocumentAsync({
            type: ["image/*", "application/pdf", "application/docx", "application/xls", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
        })
        if (cni.type == 'cancel') {
            return false
        }
        var sizeCni = ((cni.size / 1000) / 1000).toFixed(2)
        if (sizeCni <= 2) {
            handleChange("cni", cni)
        }
        else {
            setError("cni", ["cni trop volumineux(max:2M)"])
        }
    }
    /**
   *fonction utiliser pour  selectionner cni /PASSPORT
   * @author NDAYISABA claudine <claudine@mediabox.bi>
   * @date 06/05/2023 à 13:48
   * @returns 
   */
    const selectassurence = async () => {
        setError("assurence", "")
        handleChange("assurence", null)
        const assurence = await DocumentPicker.getDocumentAsync({
            type: ["image/*", "application/pdf", "application/docx", "application/xls", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
        })
        if (assurence.type == 'cancel') {
            return false
        }
        var sizeAssurence = ((assurence.size / 1000) / 1000).toFixed(2)
        if (sizeAssurence <= 2) {
            handleChange("assurence", assurence)
        }
        else {
            setError("assurence", ["assurence trop volumineux(max:2M)"])
        }
    }
    /**
   *fonction utiliser pour  selectionner cni /PASSPORT
   * @author NDAYISABA claudine <claudine@mediabox.bi>
   * @date 06/05/2023 à 13:50
   * @returns 
   */
    const selectcontrole = async () => {
        setError("controle", "")
        handleChange("controle", null)
        const controle = await DocumentPicker.getDocumentAsync({
            type: ["image/*", "application/pdf", "application/docx", "application/xls", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
        })
        if (controle.type == 'cancel') {
            return false
        }
        var sizeControle = ((controle.size / 1000) / 1000).toFixed(2)
        if (sizeControle <= 2) {
            handleChange("controle", controle)
        }
        else {
            setError("controle", ["controle technique trop volumineux(max:2M)"])
        }
    }

    /**
   *fonction utiliser pour  selectionner  carte rose
   * @author NDAYISABA claudine <claudine@mediabox.bi>
   * @date 06/05/2023 à 13:50
   * @returns 
   */
    const selectcarte = async () => {
        setError("carte", "")
        handleChange("carte", null)
        const carte = await DocumentPicker.getDocumentAsync({
            type: ["image/*", "application/pdf", "application/docx", "application/xls", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
        })
        if (carte.type == 'cancel') {
            return false
        }
        var sizeCarte = ((carte.size / 1000) / 1000).toFixed(2)
        if (sizeCarte <= 2) {
            handleChange("carte", carte)
        }
        else {
            setError("carte", ["carte rose trop volumineux(max:2M)"])
        }
    }
    /**
    *fonction utiliser pour selectionne photo  de vehicule
    * @author NDAYISABA claudine <claudine@mediabox.bi>
    * @date 06/05/2023 à 14:00
    * @returns 
    */
    const selectvehicule = async () => {
        setError("vehicule", "")
        handleChange("vehicule", null)
        const vehicule = await DocumentPicker.getDocumentAsync({
            type: ["image/*", "application/pdf", "application/docx", "application/xls", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
        })
        if (vehicule.type == 'cancel') {
            return false
        }
        var sizeCarte = ((vehicule.size / 1000) / 1000).toFixed(2)
        if (sizeCarte <= 2) {
            handleChange("vehicule", vehicule)

        }
        else {
            setError("vehicule", ["photo vehicule rose trop volumineux(max:2M)"])
        }
    }

    /**
    *fonction utiliser pour selectionne photo  d'utilisateur
    * @author NDAYISABA claudine <claudine@mediabox.bi>
    * @date 06/05/2023 à 15:27
    * @returns 
    */
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });



        if (!result.canceled) {
            // handleChange("user", result)
            setLogo(result)
        }
    };

    const enregistrement = async () => {
        setLoading(true)


        try {
            const form = new FormData()
            form.append('NOM', data.nom)
            form.append('PRENOM', data.prenom)
            form.append('EMAIL', data.email)
            form.append('TELEPHONE', data.telephone)
            form.append('PASSWORD', data.password)
            form.append('genre', data.genre.toString())
            form.append('profil', data.profil.toString())
            form.append('banque', data.banque)
            form.append('compte', data.compte)
            form.append('titulaire', data.titulaire)
            form.append('PUSH_NOTIFICATION_TOKEN', token)
            form.append('DEVICE', Platform.OS === 'ios' ? 1 : 0)
            if (data.profil == 3) {
            form.append('plaque', data.plaque)

                if (data.permis) {
                    let localUri = data.permis.uri;
                    let filename = localUri.split('/').pop();
                    form.append("permis", {
                        uri: data.permis.uri, name: filename, type: data.permis.mimeType
                    })
                }
                if (data.conduite) {
                    let localUri = data.conduite.uri;
                    let filename = localUri.split('/').pop();
                    form.append("conduite", {
                        uri: data.conduite.uri, name: filename, type: data.conduite.mimeType
                    })
                }
                if (data.controle) {
                    let localUri = data.controle.uri;
                    let filename = localUri.split('/').pop();
                    form.append("controle", {
                        uri: data.controle.uri, name: filename, type: data.controle.mimeType
                    })
                }
                if (data.cni) {
                    let localUri = data.cni.uri;
                    let filename = localUri.split('/').pop();
                    form.append("cni", {
                        uri: data.cni.uri, name: filename, type: data.cni.mimeType
                    })
                }
                if (data.assurence) {
                    let localUri = data.assurence.uri;
                    let filename = localUri.split('/').pop();
                    form.append("assurence", {
                        uri: data.assurence.uri, name: filename, type: data.assurence.mimeType
                    })
                }
                if (data.carte) {
                    let localUri = data.carte.uri;
                    let filename = localUri.split('/').pop();
                    form.append("carte", {
                        uri: data.carte.uri, name: filename, type: data.carte.mimeType
                    })
                }
                if (data.vehicule) {
                    let localUri = data.vehicule.uri;
                    let filename = localUri.split('/').pop();
                    form.append("vehicule", {
                        uri: data.vehicule.uri, name: filename, type: data.vehicule.mimeType
                    })
                }
            }
            else if (data.profil == 2) {
                form.append('societe', JSON.stringify(data.societe))
                form.append('departemant', JSON.stringify(data.departemant))
            }
            if (logo) {
                let localUri = logo.uri;
                let filename = localUri.split('/').pop();
                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;
                form.append("user", {
                    uri: localUri, name: filename, type
                })
            }
            const res = await fetchApi("/auth/users", {
                method: 'POST',
                body: form
            })
            navigation.navigate("LoginScreen")
            handleChange('nom', "")
            handleChange('prenom', "")
            handleChange('email', "")
            handleChange('telephone', "")
            handleChange('password', "")
            handleChange('password_confirm', "")
            handleChange('profil', "")
            handleChange('genre', "")
            handleChange('banque', "")
            handleChange('titulaire', "")
            handleChange('compte', "")
            handleChange('permis', null)
            handleChange('conduite', null)
            handleChange('cni', null)
            handleChange('assurence', null)
            handleChange('controle', null)
            handleChange('carte', null)
            handleChange('vehicule', null)
            handleChange('societe', null)
            handleChange('departemant', null)
            handleChange('plaque', "")

            setLogo(null)
            ToastAndroid.show('Enregistrement effectué avec succès!', ToastAndroid.LONG);
        }
        catch (error) {
            console.log(error)
            if (error.httpStatus == "UNPROCESSABLE_ENTITY") {
                setErrors({
                    nom: error.result.NOM,
                    prenom: error.result.PRENOM,
                    email: error.result.EMAIL,
                    telephone: error.result.TELEPHONE,
                    password: error.result.PASSWORD,
                })
            }
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            {loading && <Loading />}
            <View style={styles.container}>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <View>
                        <View style={styles.cardTitle}>
                            <Text style={styles.Title}>Inscription</Text>
                        </View>
                        <View style={styles.inputCard}>
                            <View>
                                <OutlinedTextField
                                    label="Nom"
                                    fontSize={14}
                                    baseColor={COLORS.smallBrown}
                                    tintColor={COLORS.primary}
                                    containerStyle={{ borderRadius: 20 }}
                                    lineWidth={1}
                                    activeLineWidth={1}
                                    errorColor={COLORS.error}
                                    renderRightAccessory={() => <FontAwesome name="user-o" size={20} color={hasError('nom') ? COLORS.error : "#a2a2a2"} />}
                                    value={data.nom}
                                    onChangeText={(newValue) => handleChange('nom', newValue)}
                                    onBlur={() => checkFieldData('nom')}
                                    error={hasError('nom') ? getError('nom') : ''}
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
                            <View>
                                <OutlinedTextField
                                    label="Prénom"
                                    fontSize={14}
                                    baseColor={COLORS.smallBrown}
                                    tintColor={COLORS.primary}
                                    lineWidth={1}
                                    activeLineWidth={1}
                                    errorColor={COLORS.error}
                                    renderRightAccessory={() => <FontAwesome name="user-o" size={20} color={hasError('prenom') ? COLORS.error : "#a2a2a2"} />}
                                    value={data.prenom}
                                    onChangeText={(newValue) => handleChange('prenom', newValue)}
                                    onBlur={() => checkFieldData('prenom')}
                                    error={hasError('prenom') ? getError('prenom') : ''}
                                    ref={prenomInputRef}
                                    onSubmitEditing={() => {
                                        telRef.current.focus()
                                    }}
                                    autoCompleteType='off'
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                />
                            </View>
                        </View>
                        <View style={styles.inputCard}>
                            <View>
                                <OutlinedTextField
                                    label="Téléphone"
                                    fontSize={14}
                                    baseColor={COLORS.smallBrown}
                                    tintColor={COLORS.primary}
                                    lineWidth={1}
                                    activeLineWidth={1}
                                    errorColor={COLORS.error}
                                    renderRightAccessory={() => <Feather name="phone" size={24} color={hasError('telephone') ? COLORS.error : "#a2a2a2"} />}
                                    value={data.telephone}
                                    onChangeText={(newValue) => handleChange('telephone', newValue)}
                                    onBlur={() => checkFieldData('telephone')}
                                    error={hasError('telephone') ? getError('telephone') : ''}
                                    ref={telRef}
                                    onSubmitEditing={() => {
                                        emailInputRef.current.focus()
                                    }}
                                    autoCompleteType='off'
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                    keyboardType='number-pad'
                                />
                            </View>
                        </View>

                        <View style={styles.inputCard}>
                            <View>
                                <OutlinedTextField
                                    label="Adresse email"
                                    fontSize={14}
                                    baseColor={COLORS.smallBrown}
                                    tintColor={COLORS.primary}
                                    lineWidth={1}
                                    activeLineWidth={1}
                                    errorColor={COLORS.error}
                                    renderRightAccessory={() => <Fontisto name="email" size={20} color={hasError('email') ? COLORS.error : "#a2a2a2"} />}
                                    value={data.email}
                                    onChangeText={(newValue) => handleChange('email', newValue)}
                                    onBlur={() => checkFieldData('email')}
                                    error={hasError('email') ? getError('email') : ''}
                                    ref={emailInputRef}
                                    onSubmitEditing={() => {
                                        passwordInputRef.current.focus()
                                    }}
                                    autoCompleteType='off'
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                />
                            </View>
                        </View>
                        <View style={styles.inputCard}>

                            <View style={styles.selectContainer1}
                            >
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <Text style={[styles.selectLabel]}>
                                            Genre
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => handleChange("genre", 1)}
                                            style={styles.radioBtn}
                                        >
                                            <View style={{ flexDirection: "row" }}>
                                                {data?.genre == 1 ?

                                                    <MaterialCommunityIcons name="radiobox-marked" size={24} color={COLORS.primary} /> :
                                                    <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                <Text style={styles.radioLabel} >Homme</Text>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => handleChange("genre", 2)}
                                            style={styles.radioBtn}
                                        >
                                            <View style={{ flexDirection: "row" }}>
                                                {data?.genre == 2 ? <MaterialCommunityIcons name="radiobox-marked" size={24} color={COLORS.primary} /> :
                                                    <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                <Text style={styles.radioLabel}>Femme</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                </View>

                            </View>


                        </View>
                        <View style={styles.inputCard}>

                            <View style={styles.selectContainer1}
                            >

                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.selectLabel]}>
                                        Profil
                                    </Text>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

                                        <TouchableOpacity
                                            onPress={() => handleChange("profil", 2)}
                                            style={styles.radioBtn}
                                        >
                                            <View style={{ flexDirection: "row" }}>
                                                {data?.profil == 2 ?

                                                    <MaterialCommunityIcons name="radiobox-marked" size={24} color={COLORS.primary} /> :
                                                    <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                <Text style={styles.radioLabel} >sécréteur</Text>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => handleChange("profil", 3)}
                                            style={styles.radioBtn}
                                        >
                                            <View style={{ flexDirection: "row" }}>
                                                {data?.profil == 3 ? <MaterialCommunityIcons name="radiobox-marked" size={24} color={COLORS.primary} /> :
                                                    <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                <Text style={styles.radioLabel}>chauffeur</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => handleChange("profil", 5)}
                                            style={styles.radioBtn}
                                        >
                                            <View style={{ flexDirection: "row" }}>
                                                {data?.profil == 5 ? <MaterialCommunityIcons name="radiobox-marked" size={24} color={COLORS.primary} /> :
                                                    <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                <Text style={styles.radioLabel}>Particulier</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>


                        </View>
                        {data.profil == 2 ?
                            <>
                            
                                <TouchableOpacity style={styles.selectContainer}
                                    onPress={societeselect}
                                >
                                    <View style={{}}>
                                        <Text style={[styles.selectLabel]}>
                                            Séléctionner la socièté
                                        </Text>
                                        {data.societe ? <Text style={[styles.selectedValue, { color: '#333' }]}>
                                            {data.societe.DESCRIPTION}
                                        </Text> : null}
                                    </View>
                                    <EvilIcons name="chevron-down" size={30} color="#777" />
                                </TouchableOpacity>
                                {data.societe ? <TouchableOpacity style={styles.selectContainer}
                                    onPress={departemantselect}
                                >
                                    <View style={{}}>
                                        <Text style={[styles.selectLabel]}>
                                            Séléctionner le departement
                                        </Text>
                                        {data.departemant ? <Text style={[styles.selectedValue, { color: '#333' }]}>
                                            {data.departemant.DESCRIPTION}
                                        </Text> : null}
                                    </View>
                                    <EvilIcons name="chevron-down" size={30} color="#777" />
                                </TouchableOpacity> : null}
                            </>
                            : null}
                        {data.profil == 3 ?
                            <>
                             <View style={styles.inputCard}>
                            <View>
                                <OutlinedTextField
                                    label="Numero plaque"
                                    fontSize={14}
                                    baseColor={COLORS.smallBrown}
                                    tintColor={COLORS.primary}
                                    lineWidth={1}
                                    activeLineWidth={1}
                                    errorColor={COLORS.error}
                                    renderRightAccessory={() => <Fontisto name="email" size={20} color={hasError('email') ? COLORS.error : "#a2a2a2"} />}
                                    value={data.plaque}
                                    onChangeText={(newValue) => handleChange('plaque', newValue)}
                                    onBlur={() => checkFieldData('plaque')}
                                    error={hasError('plaque') ? getError('plaque') : ''}
                                    ref={plaqueInputRef}
                                    onSubmitEditing={() => {
                                        plaqueInputRef.current.focus()
                                    }}
                                    autoCompleteType='off'
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                />
                            </View>
                        </View>
                                <View style={styles.inputCard}>
                                    <View>
                                        <OutlinedTextField
                                            label="Nom banque"
                                            fontSize={14}
                                            baseColor={COLORS.smallBrown}
                                            tintColor={COLORS.primary}
                                            lineWidth={1}
                                            activeLineWidth={1}
                                            errorColor={COLORS.error}
                                            renderRightAccessory={() => <AntDesign name="bank" size={20} color={hasError('banque') ? COLORS.error : "#a2a2a2"} />}
                                            value={data.banque}
                                            onChangeText={(newValue) => handleChange('banque', newValue)}
                                            onBlur={() => checkFieldData('banque')}
                                            error={hasError('banque') ? getError('banque') : ''}
                                            ref={banqueInputRef}
                                            onSubmitEditing={() => {
                                                banqueInputRef.current.focus()
                                            }}
                                            autoCompleteType='off'
                                            returnKeyType="next"
                                            blurOnSubmit={false}
                                        />
                                    </View>
                                </View>
                                <View style={styles.inputCard}>
                                    <View>
                                        <OutlinedTextField
                                            label="Titulaire"
                                            fontSize={14}
                                            baseColor={COLORS.smallBrown}
                                            tintColor={COLORS.primary}
                                            lineWidth={1}
                                            activeLineWidth={1}
                                            errorColor={COLORS.error}
                                            renderRightAccessory={() => <FontAwesome name="user-o" size={20} color={hasError('titulaire') ? COLORS.error : "#a2a2a2"} />}
                                            value={data.titulaire}
                                            onChangeText={(newValue) => handleChange('titulaire', newValue)}
                                            onBlur={() => checkFieldData('titulaire')}
                                            error={hasError('titulaire') ? getError('titulaire') : ''}
                                            ref={titulaireInputRef}
                                            onSubmitEditing={() => {
                                                titulaireInputRef.current.focus()
                                            }}
                                            autoCompleteType='off'
                                            returnKeyType="next"
                                            blurOnSubmit={false}
                                        />
                                    </View>
                                </View>
                                <View style={styles.inputCard}>
                                    <View>
                                        <OutlinedTextField
                                            label="Numero  de compte"
                                            fontSize={14}
                                            baseColor={COLORS.smallBrown}
                                            tintColor={COLORS.primary}
                                            lineWidth={1}
                                            activeLineWidth={1}
                                            errorColor={COLORS.error}
                                            renderRightAccessory={() => <MaterialIcons name="account-balance-wallet" size={24} color={hasError('compte') ? COLORS.error : "#a2a2a2"} />
                                            }
                                            value={data.compte}
                                            onChangeText={(newValue) => handleChange('compte', newValue)}
                                            onBlur={() => checkFieldData('compte')}
                                            error={hasError('compte') ? getError('compte') : ''}
                                            ref={emailInputRef}
                                            onSubmitEditing={() => {
                                                passwordInputRef.current.focus()
                                            }}
                                            autoCompleteType='off'
                                            returnKeyType="next"
                                            blurOnSubmit={false}
                                        />
                                    </View>
                                </View>
                                <View style={styles.inputCard}>
                                    <TouchableOpacity style={[styles.selectContainer1, hasError("permis") && { borderColor: "red" }]}
                                        onPress={selectpermis}
                                    >
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text style={[styles.selectLabel, hasError("conduite") && { color: 'red' }]}>
                                                    Permis de conduire
                                                </Text>
                                                <FontAwesome name="drivers-license-o" size={20} color={"#a2a2a2"} />
                                            </View>
                                            {data.permis ? <View>
                                                <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                    {data.permis.name}
                                                </Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text>{data.permis.name.split('.')[1].toUpperCase()} - </Text>
                                                    <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                        {((data.permis.size / 1000) / 1000).toFixed(2)} M
                                                    </Text>
                                                </View>
                                            </View> : null}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.inputCard}>
                                    <TouchableOpacity style={[styles.selectContainer1, hasError("conduite") && { borderColor: "red" }]}
                                        onPress={selectconduite}
                                    >
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text style={[styles.selectLabel, hasError("conduite") && { color: 'red' }]}>
                                                    Attestation  de bonne conduite
                                                </Text>
                                                <FontAwesome name="drivers-license-o" size={20} color={"#a2a2a2"} />
                                            </View>
                                            {data.conduite ? <View>
                                                <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                    {data.conduite.name}
                                                </Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text>{data.conduite.name.split('.')[1].toUpperCase()} - </Text>
                                                    <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                        {((data.conduite.size / 1000) / 1000).toFixed(2)} M
                                                    </Text>
                                                </View>
                                            </View> : null}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.inputCard}>
                                    <TouchableOpacity style={[styles.selectContainer1, hasError("cni") && { borderColor: "red" }]}
                                        onPress={selectcni}
                                    >
                                        <View style={{ flex: 1 }}>

                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text style={[styles.selectLabel, hasError("vehicule") && { color: 'red' }]}>
                                                    CNI/Passport
                                                </Text>
                                                <Fontisto name="passport-alt" size={20} color={"#a2a2a2"} />
                                            </View>
                                            {data.cni ? <View>
                                                <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                    {data.cni.name}
                                                </Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text>{data.cni.name.split('.')[1].toUpperCase()} - </Text>
                                                    <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                        {((data.cni.size / 1000) / 1000).toFixed(2)} M
                                                    </Text>
                                                </View>
                                            </View> : null}
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.inputCard}>
                                    <TouchableOpacity style={[styles.selectContainer1, hasError("assurence") && { borderColor: "red" }]}
                                        onPress={selectassurence}
                                    >
                                        <View style={{ flex: 1 }}>

                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text style={[styles.selectLabel, hasError("assurence") && { color: 'red' }]}>
                                                    assurance
                                                </Text>
                                                <AntDesign name="switcher" size={20} color={"#a2a2a2"} />
                                            </View>
                                            {data.assurence ? <View>
                                                <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                    {data.assurence.name}
                                                </Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text>{data.assurence.name.split('.')[1].toUpperCase()} - </Text>
                                                    <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                        {((data.assurence.size / 1000) / 1000).toFixed(2)} M
                                                    </Text>
                                                </View>
                                            </View> : null}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.inputCard}>
                                    <TouchableOpacity style={[styles.selectContainer1, hasError("cni") && { borderColor: "red" }]}
                                        onPress={selectcontrole}
                                    >
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text style={[styles.selectLabel, hasError("cni") && { color: 'red' }]}>
                                                    controle technique
                                                </Text>
                                                <FontAwesome name="bus" size={20} color={"#a2a2a2"} />
                                            </View>
                                            {data.controle ? <View>
                                                <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                    {data.controle.name}
                                                </Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text>{data.controle.name.split('.')[1].toUpperCase()} - </Text>
                                                    <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                        {((data.controle.size / 1000) / 1000).toFixed(2)} M
                                                    </Text>
                                                </View>
                                            </View> : null}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.inputCard}>
                                    <TouchableOpacity style={[styles.selectContainer1, hasError("cni") && { borderColor: "red" }]}
                                        onPress={selectcarte}
                                    >
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text style={[styles.selectLabel, hasError("cni") && { color: 'red' }]}>
                                                    carte rose
                                                </Text>
                                                <Entypo name="documents" size={20} color={"#a2a2a2"} />
                                            </View>
                                            {data.carte ? <View>
                                                <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                    {data.carte.name}
                                                </Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text>{data.carte.name.split('.')[1].toUpperCase()} - </Text>
                                                    <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                        {((data.carte.size / 1000) / 1000).toFixed(2)} M
                                                    </Text>
                                                </View>
                                            </View> : null}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.inputCard}>
                                    <TouchableOpacity style={[styles.selectContainer1, hasError("vehicule") && { borderColor: "red" }]}
                                        onPress={selectvehicule}
                                    >
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <Text style={[styles.selectLabel, hasError("vehicule") && { color: 'red' }]}>
                                                    vehicule
                                                </Text>
                                                <FontAwesome name="bus" size={20} color={"#a2a2a2"} />
                                            </View>
                                            {data.vehicule ? <View>
                                                <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                    {data.vehicule.name}
                                                </Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text>{data.vehicule.name.split('.')[1].toUpperCase()} - </Text>
                                                    <Text style={[styles.selectedValue, { color: '#333' }]}>
                                                        {((data.vehicule.size / 1000) / 1000).toFixed(2)} M
                                                    </Text>
                                                </View>
                                            </View> : null}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </>
                            : null}
                        <View style={styles.inputCard}>
                            <TouchableOpacity style={[styles.selectContainer1, hasError("user") && { borderColor: "red" }]}
                                onPress={pickImage}
                            >
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <Text style={[styles.selectLabel, hasError("user") && { color: 'red' }]}>
                                            Photo profil
                                        </Text>
                                        <FontAwesome name="bus" size={20} color={"#a2a2a2"} />
                                    </View>
                                    {logo && <Image source={{ uri: logo.uri }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />}
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputCard}>
                            <View>
                                <OutlinedTextField
                                    label="Mot de passe"
                                    fontSize={14}
                                    baseColor={COLORS.smallBrown}
                                    tintColor={COLORS.primary}
                                    secureTextEntry={!showPassword}
                                    lineWidth={1}
                                    activeLineWidth={1}
                                    errorColor={COLORS.error}
                                    renderRightAccessory={() => <EvilIcons name={!showPassword ? "lock" : "unlock"} size={30} color={hasError('password') ? COLORS.error : "#a2a2a2"}
                                        onPress={() => setShowPassword(t => !t)} />}
                                    value={data.password}
                                    onChangeText={(newValue) => handleChange('password', newValue)}
                                    onBlur={() => checkFieldData('password')}
                                    error={hasError('password') ? getError('password') : ''}
                                    ref={passwordInputRef}
                                    onSubmitEditing={() => {
                                        password_confirmInputRef.current.focus()
                                    }}
                                    autoCompleteType='off'
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                />
                            </View>

                        </View>

                        <View style={styles.inputCard}>
                            <View>
                                <OutlinedTextField
                                    label="Confirmer le mot de passe"
                                    fontSize={14}
                                    baseColor={COLORS.smallBrown}
                                    tintColor={COLORS.primary}
                                    secureTextEntry={!showPasswordConfirm}
                                    lineWidth={1}
                                    activeLineWidth={1}
                                    errorColor={COLORS.error}
                                    renderRightAccessory={() => <EvilIcons name={!showPasswordConfirm ? "lock" : "unlock"} size={30} color={hasError('password_confirm') ? COLORS.error : "#a2a2a2"}
                                        onPress={() => setShowPasswordConfirm(t => !t)}
                                    />}
                                    value={data.password_confirm}
                                    onChangeText={(newValue) => handleChange('password_confirm', newValue)}
                                    onBlur={() => checkFieldData('password_confirm')}
                                    error={hasError('password_confirm') ? getError('password_confirm') : ''}
                                    ref={password_confirmInputRef}
                                />
                            </View>

                        </View>
                        <TouchableWithoutFeedback
                            disabled={!isValid()}
                            onPress={enregistrement}>
                            <View style={[styles.button, !isValid() && { opacity: 0.5 }]}>
                                <Text style={styles.buttonText}>S'inscrire</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </ScrollView>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
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
    selectLabel: {
        color: '#777',
        fontSize: 13
    },
    selectContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 13,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: "#777",
        marginVertical: 10,
        marginHorizontal: 20,
        marginTop: 10
    },
    selectContainer1: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 13,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: "#777",
        marginVertical: 10,

    },
    radioLabel: {
        opacity: 0.5
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
        backgroundColor:COLORS.primary,
        marginHorizontal: 20,
        marginBottom:5
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
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