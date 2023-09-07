import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native"
import { ActivityIndicator, Image, Text, ToastAndroid, TouchableNativeFeedback, TouchableOpacity, View, TouchableWithoutFeedback } from "react-native"
import { StyleSheet } from "react-native"
import { Ionicons, MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { ScrollView } from "react-native";
import { useCallback, useRef, useState } from "react";
import fetchApi from "../../helpers/fetchApi";
import { COLORS } from "../../styles/COLORS";
import { useForm } from "../../hooks/useForm";
import { useFormErrorsHandle } from "../../hooks/useFormErrorsHandle";
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'
import useFetch from "../../hooks/useFetch";
import Loading from "../../components/app/Loading";
import ImageView from "react-native-image-viewing";
import moment from "moment";
import Folio from "../../components/folio/Folio";

export default function ChefPlatauRetourScreen() {
  const route = useRoute()
  const { volume } = route.params
  // return  console.log()
  const [volumeDetail, setVolumeDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)
  const [document, setDocument] = useState(null)
  const [check, setCheck] = useState(null)
  const navigation = useNavigation()
  const agentsModalRef = useRef()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [galexyIndex, setGalexyIndex] = useState(null)


  const [loadingChefPlateau, supAile] = useFetch(`/preparation/volume/chefsPlateaux/${volume.volume.ID_VOLUME}`)
  const [data, handleChange] = useForm({
    agent: null,
    pv: null
  })
  const { hasError, getError, setErrors, checkFieldData, isValidate, setError } = useFormErrorsHandle(data, {
    agent: {
      required: true
    },
    pv: {
      required: true
    }
  })

  useFocusEffect(useCallback(() => {
    (async () => {
            try {
                    // setLoadingCheck(true)
                    const form = new FormData()
                    form.append('ID_VOLUME', volume.volume.ID_VOLUME)
                    const res = await fetchApi(`/preparation/folio/checkPlateau`, {
                            method: "POST",
                            body: form
                    })
                    setCheck(res.result)
                    
            } catch (error) {
                    console.log(error)
            } finally {
                    // setLoadingCheck(false)
            }
    })()
}, [volume]))
  const openAgentModalize = () => {
    agentsModalRef.current?.open()
  }
  const isValidAdd = () => {
    var isValid = false
    isValid = document != null ? true : false
    return isValid
  }
  //Fonction pour le prendre l'image avec l'appareil photos
  const onTakePicha = async () => {
    setIsCompressingPhoto(true)
    const permission = await ImagePicker.requestCameraPermissionsAsync()
    if (!permission.granted) return false
    const image = await ImagePicker.launchCameraAsync()
    if (image.canceled) {
      return setIsCompressingPhoto(false)
    }
    const photo = image.assets[0]
    setDocument(photo)
    const manipResult = await manipulateAsync(
      photo.uri,
      [
        { resize: { width: 500 } }
      ],
      { compress: 0.7, format: SaveFormat.JPEG }
    );
    setIsCompressingPhoto(false)
    //     handleChange('pv', manipResult)
  }


  /**
   * Permet de traiter le retour entre le sup aile indexation et le chef d'equipe
   * @author darcydev <darcy@mediabox.bi>
   * @date 04/08/2023
   * @returns 
   */
  const handleSubmitRetour = async () => {
    try {
      setIsSubmitting(true)
      const form = new FormData()
      form.append('volume', volume.volume.ID_VOLUME)
      form.append('CHEF_PLATEAU', supAile?.result?.traitant.USERS_ID)
      console.log(form)
      if (document) {
        const manipResult = await manipulateAsync(
          document.uri,
          [
            { resize: { width: 500 } }
          ],
          { compress: 0.8, format: SaveFormat.JPEG }
        );
        let localUri = manipResult.uri;
        let filename = localUri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        form.append('PV', {
          uri: localUri, name: filename, type
        })
      }
      const res = await fetchApi(`/preparation/volume/retourChefPlateau`, {
        method: "PUT",
        body: form
      })
      ToastAndroid.show("Opération effectuée avec succès", ToastAndroid.SHORT);
      navigation.navigate("ChefPlateauScreen")
    } catch (error) {
      console.log(error)
      ToastAndroid.show("Opération non effectuée, réessayer encore", ToastAndroid.SHORT);
    } finally {
      setIsSubmitting(false)
    }
  }

  const isRetourValid = () => {
    return data.pv && !isCompressingPhoto
  }

  const onTakePhoto = async () => {
    setIsCompressingPhoto(true)
    const permission = await ImagePicker.requestCameraPermissionsAsync()
    if (!permission.granted) return false
    const image = await ImagePicker.launchCameraAsync()
    if (image.canceled) {
      return setIsCompressingPhoto(false)
    }
    const photo = image.assets[0]
    setPvPhoto(photo)
    const manipResult = await manipulateAsync(
      photo.uri,
      [
        { resize: { width: 500 } }
      ],
      { compress: 0.7, format: SaveFormat.JPEG }
    );
    setIsCompressingPhoto(false)
    handleChange('pv', manipResult)
  }
  return (
    <>
      {(galexyIndex != null && supAile?.result && supAile?.result) &&
        <ImageView
          images={[{ uri: supAile?.result.PV_PATH }, supAile?.result?.retour ? { uri: supAile?.result?.retour.PV_PATH } : undefined]}
          imageIndex={galexyIndex}
          visible={(galexyIndex != null) ? true : false}
          onRequestClose={() => setGalexyIndex(null)}
          swipeToCloseEnabled
          keyExtractor={(_, index) => index.toString()}
        />
      }
      {isSubmitting && <Loading />}
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableNativeFeedback
            onPress={() => navigation.goBack()}
            background={TouchableNativeFeedback.Ripple('#c9c5c5', true)}>
            <View style={styles.headerBtn}>
              <Ionicons name="chevron-back-outline" size={24} color="black" />
            </View>
          </TouchableNativeFeedback>
          <Text style={styles.title}>{volume ? volume.volume.NUMERO_VOLUME : null}</Text>
        </View>
        {loadingChefPlateau ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator animating size={'large'} color={'#777'} />
        </View> : <ScrollView style={styles.inputs}>

          <View style={styles.content}>
            <TouchableOpacity style={styles.selectContainer} onPress={openAgentModalize} disabled={supAile.result ? true : false}>
              <View style={{ width: '100%' }}>
                <View style={styles.labelContainer}>
                  <View style={styles.icon}>
                    <Feather name="user" size={20} color="#777" />
                  </View>
                  <Text style={styles.selectLabel}>
                    chef plateau
                  </Text>
                </View>
                {loadingChefPlateau ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <ActivityIndicator animating size={'small'} color={'#777'} />
                  <Text style={[styles.selectedValue, { marginLeft: 5 }]}>
                    Chargement
                  </Text>
                </View> : null}
                <Text style={styles.selectedValue}>
                  {supAile?.result?.traitant?.NOM} {supAile?.result?.traitant?.PRENOM}
                </Text>
                {supAile.result ?
                  <>
                    <TouchableOpacity onPress={() => {
                      setGalexyIndex(0)
                    }}>
                      <Image source={{ uri: supAile.result.PV_PATH }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />
                    </TouchableOpacity>
                    <Text style={{ fontStyle: 'italic', color: '#777', fontSize: 10, marginTop: 5, textAlign: 'right' }}>Fait: {moment(supAile.result.DATE_INSERTION).format("DD/MM/YYYY [à] HH:mm")}</Text>
                  </> : null}
              </View>
            </TouchableOpacity>
            {supAile?.result?.foliosPrepares?.length > 0 ? <View style={styles.selectContainer}>
              <View style={{ width: '100%' }}>
                <View style={[styles.labelContainer, { justifyContent: 'space-between' }]}>

                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={styles.selectedValue}>
                  </Text>
                  <Text style={styles.selectedValue}>
                    {supAile?.result?.foliosPrepares?.length} préparé{supAile?.result?.foliosPrepares.length > 1 && 's'}
                  </Text>
                </View>
                <View style={styles.folioList}>
                  {supAile?.result?.foliosPrepares.map((folio, index) => {
                    return (
                      <View style={{ marginTop: 10, overflow: 'hidden', borderRadius: 8 }} key={index}>
                        <View style={[styles.folio]}>
                          <View style={styles.folioLeftSide}>
                            <View style={styles.folioImageContainer}>
                              <Image source={require("../../../assets/images/folio.png")} style={styles.folioImage} />
                            </View>
                            <View style={styles.folioDesc}>
                              <Text style={styles.folioName}>{folio.NUMERO_FOLIO}</Text>
                              <Text style={styles.folioSubname}>{folio.NUMERO_FOLIO}</Text>
                            </View>
                          </View>
                          <MaterialIcons style={styles.checkIndicator} name="check-box" size={24} color={COLORS.primary} />
                        </View>
                      </View>
                    )
                  })}
                </View>
              </View>
            </View> : null}
            {supAile?.result?.foliosNoPrepare?.length > 0 ?
              <View style={styles.selectContainer}>
                <View style={{ width: '100%' }}>
                  <View style={[styles.labelContainer, { justifyContent: 'space-between' }]}>

                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.selectedValue}>
                    </Text>
                    <Text style={styles.selectedValue}>
                      {supAile?.result?.foliosNoPrepare.length} non préparé{supAile?.result?.foliosPrepares.length > 1 && 's'}
                    </Text>
                  </View>
                  <View style={styles.folioList}>
                    {supAile?.result?.foliosNoPrepare.map((folio, index) => {
                      return (
                        <View style={{ marginTop: 10, overflow: 'hidden', borderRadius: 8 }} key={index}>
                          <View style={[styles.folio]}>
                            <View style={styles.folioLeftSide}>
                              <View style={styles.folioImageContainer}>
                                <Image source={require("../../../assets/images/folio.png")} style={styles.folioImage} />
                              </View>
                              <View style={styles.folioDesc}>
                                <Text style={styles.folioName}>{folio.NUMERO_FOLIO}</Text>
                                <Text style={styles.folioSubname}>{folio.NUMERO_FOLIO}</Text>
                              </View>
                            </View>
                            <MaterialIcons style={styles.checkIndicator} name="cancel" size={24} color="red" />
                          </View>
                        </View>
                      )
                    })}
                  </View>
                </View>
              </View> : null}


            {supAile?.result?.check?.length > 0 && check.length==check[0].volume.NOMBRE_DOSSIER ?
              <TouchableOpacity onPress={onTakePicha}>
                <View style={[styles.addImageItem]}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <FontAwesome5 name="file-signature" size={20} color="#777" />
                      <Text style={styles.addImageLabel}>
                        Photo du procès verbal
                      </Text>
                    </View>
                    {isCompressingPhoto ? <ActivityIndicator animating size={'small'} color={'#777'} /> : null}
                  </View>
                  {document && <Image source={{ uri: document.uri }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />}
                </View>
              </TouchableOpacity> : null}


          </View>
          {supAile?.result?.check?.length > 0 && check.length==check[0].volume.NOMBRE_DOSSIER ?
            <TouchableNativeFeedback
              disabled={!isValidAdd()}
              onPress={handleSubmitRetour}
            >
              <View style={[styles.button, !isValidAdd() && { opacity: 0.5 }]}>
                <Text style={styles.buttonText}>Enregistrer</Text>
              </View>
            </TouchableNativeFeedback> : null}
        </ScrollView>


        }


      </View>

    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10
  },
  headerBtn: {
    padding: 10
  },
  title: {
    paddingHorizontal: 5,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#777',
  },
  detailsHeader: {
    paddingHorizontal: 10
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  selectLabel: {
    marginLeft: 5
  },
  flash: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  flashName: {
    marginLeft: 5
  },
folio: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ddd',
    padding: 10
  },
  folioLeftSide: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  folioImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  folioImage: {
    width: '60%',
    height: '60%'
  },
  folioDesc: {
    marginLeft: 10
  },
  folioName: {
    fontWeight: 'bold',
    color: '#333',
  },
  folioSubname: {
    color: '#777',
    fontSize: 12
  },
  folioList: {
    // paddingHorizontal: 10
  },
  actions: {
    padding: 10
  },
  actionBtn: {
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: COLORS.primary
  },
  actionText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff'
  },
  selectContainer: {
    backgroundColor: "#fff",
    padding: 13,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: "#ddd",
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  selectedValue: {
    color: '#777',
    marginTop: 2
  },
  content: {
    paddingHorizontal: 10
  },
  addImageItem: {
    borderWidth: 0.5,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginBottom: 5
  },
  addImageLabel: {
    marginLeft: 5,
    opacity: 0.8
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  modalTitle: {
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    fontSize: 16
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  listItemImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center'
  },
  listItemImage: {
    width: '60%',
    height: '60%',
  },
  listItemDesc: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  listNames: {
    marginLeft: 10
  },
  listItemTitle: {
    fontWeight: 'bold'
  },
  listItemSubTitle: {
    color: '#777',
    fontSize: 12,
    marginTop: 5
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: COLORS.primary,
    marginHorizontal: 10
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center"
  },
})