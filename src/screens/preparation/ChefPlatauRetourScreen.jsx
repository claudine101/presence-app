import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native"
import { ActivityIndicator, Image, Text, ToastAndroid, TouchableNativeFeedback, TouchableOpacity, View } from "react-native"
import { StyleSheet } from "react-native"
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
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
        //   return  console.log(volume.volume.ID_VOLUME)
          const [flashDetail, setFlashDetail] = useState(null)
          const [loading, setLoading] = useState(true)
          const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)
          const [pvPhoto, setPvPhoto] = useState(null)
          const navigation = useNavigation()
          const agentsModalRef = useRef()
          const [isSubmitting, setIsSubmitting] = useState(false)
          const [galexyIndex, setGalexyIndex] = useState(null)

          const [loadingChefPlateau, supAile] = useFetch(`/preparation/volume/chefsPlateaux/${volume.volume.ID_VOLUME}`)
        //   return  console.log(supAile)
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

          const openAgentModalize = () => {
                    agentsModalRef.current?.open()
          }
          const handleAgentPress = agent => {
                    agentsModalRef.current?.close()
                    handleChange('agent', agent)
          }

          useFocusEffect(useCallback(() => {
                    (async () => {
                              try {
                                        const res = await fetchApi(`/preparation/volume/detailsVolume/${volume.volume.ID_VOLUME}`)
                                        setFlashDetail(res.result)
                              } catch (error) {
                                        console.log(error)
                              } finally {
                                        setLoading(false)
                              }
                    })()
          }, []))

          
          /**
           * Permet de traiter le retour entre le sup aile indexation et le chef d'equipe
           * @author darcydev <darcy@mediabox.bi>
           * @date 04/08/2023
           * @returns 
           */
          const handleSubmitRetour = async () => {
                    try {
                              if (!isRetourValid()) return false
                              setIsSubmitting(true)
                              const form = new FormData()
                              form.append("ID_FLASH_INDEXE", flashDetail?.foliosIndexes[0].ID_FLASH_INDEXE)
                              form.append("ID_SUP_AILE_INDEXATION", supAile.result.USER_TRAITEMENT)
                              if(data.pv) {
                                        const photo = data.pv
                                        let localUri = photo.uri;
                                        let filename = localUri.split('/').pop();
                                        let match = /\.(\w+)$/.exec(filename);
                                        let type = match ? `image/${match[1]}` : `image`;
                                        form.append(`pv`, {
                                                  uri: localUri, name: filename, type
                                        })
                              }
                              const res = await fetchApi(`/indexation/agent_sup_aile_indexation/retour`, {
                                        method: 'POST',
                                        body: form
                              })
                              ToastAndroid.show("Opération effectuée avec succès", ToastAndroid.SHORT);
                              navigation.goBack()
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
                                                  <Text style={styles.title}>{volume? volume.volume.NUMERO_VOLUME : null}</Text>
                                        </View>
                                        {loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
                                                                                                    Superviseur aile indexation
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
                                                            {supAile?.result ? null : <TouchableOpacity onPress={onTakePhoto}>
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
                                                                                {pvPhoto && <Image source={{ uri: pvPhoto.uri }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />}
                                                                      </View>
                                                            </TouchableOpacity>}
                                                            {flashDetail?.foliosIndexes.length > 0 ? <View style={styles.selectContainer}>
                                                                      <View style={{ width: '100%' }}>
                                                                                <View style={[styles.labelContainer, { justifyContent: 'space-between' }]}>
                                                                                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                                    <View style={styles.icon}>
                                                                                                              <MaterialCommunityIcons name="file-document-multiple-outline" size={20} color="#777" />
                                                                                                    </View>
                                                                                                    <Text style={styles.selectLabel}>
                                                                                                              Les dossiers
                                                                                                    </Text>
                                                                                          </View>
                                                                                </View>
                                                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                                          <Text style={styles.selectedValue}>
                                                                                                    {flashDetail?.folios.length} dossier{flashDetail?.folios.length > 1 && 's'}
                                                                                          </Text>
                                                                                          <Text style={styles.selectedValue}>
                                                                                                    {flashDetail?.foliosIndexes.length} indexé{flashDetail?.foliosIndexes.length > 1 && 's'}
                                                                                          </Text>
                                                                                </View>
                                                                                <View style={styles.folioList}>
                                                                                          {flashDetail?.foliosIndexes.map((folio, index) => {
                                                                                                    return (
                                                                                                              <Folio style={{ backgroundColor: '#f1f1f1' }} folio={folio} key={index} onPress={null} isSelected={() => true} />
                                                                                                    )
                                                                                          })}
                                                                                </View>
                                                                      </View>
                                                            </View> : null}
                                                            {flashDetail?.foliosIndexes.length > 0 ? <View style={[styles.selectContainer, { flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'baseline'}]}>
                                                                      <View style={styles.labelContainer}>
                                                                                <View style={styles.icon}>
                                                                                          <MaterialCommunityIcons name="usb-flash-drive-outline" size={20} color="#777" />
                                                                                </View>
                                                                                <Text style={styles.selectLabel}>
                                                                                          Clé USB des dossiers indexés
                                                                                </Text>
                                                                      </View>
                                                                      <Text style={styles.selectedValue}>
                                                                                {flashDetail?.foliosIndexes[0].flash?.NOM_FLASH}
                                                                      </Text> 
                                                            </View> : null}
                                                            {(supAile?.result && flashDetail?.foliosIndexes.length > 0) ? <TouchableOpacity onPress={onTakePhoto} disabled={supAile?.result?.retour ? true : false}>
                                                                      <View style={[styles.addImageItem]}>
                                                                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                                                                                          <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                                                                    <FontAwesome5 name="file-signature" size={20} color="#777" />
                                                                                                    <Text style={styles.addImageLabel}>
                                                                                                              Procès verbal du retour
                                                                                                    </Text>
                                                                                          </View>
                                                                                          {isCompressingPhoto ? <ActivityIndicator animating size={'small'} color={'#777'} /> : null}
                                                                                </View>
                                                                                {pvPhoto && <Image source={{ uri: pvPhoto.uri }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />}
                                                                                {supAile?.result?.retour ? <>
                                                                                <TouchableOpacity onPress={() => {
                                                                                          setGalexyIndex(1)
                                                                                }}>
                                                                                          <Image source={{ uri: supAile?.result?.retour.PV_PATH }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 5 }} />
                                                                                </TouchableOpacity>
                                                                                <Text style={{ fontStyle: 'italic', color: '#777', fontSize: 10, marginTop: 5, textAlign: 'right' }}>Fait: { moment(supAile?.result?.retour.DATE_INSERTION).format("DD/MM/YYYY [à] HH:mm") }</Text>
                                                                                </> : null}
                                                                      </View>
                                                            </TouchableOpacity> : null}
                                                  </View>
                                        </ScrollView>}
                                        {(flashDetail && supAile?.result && !supAile?.result.retour && flashDetail?.foliosIndexes.length > 0) ? <View style={styles.actions}>
                                                  <View style={styles.actions}>
                                                            <TouchableOpacity style={[styles.actionBtn, { opacity: !isRetourValid() ? 0.5 : 1 }]} disabled={!isRetourValid()} onPress={handleSubmitRetour}>
                                                                      <Text style={styles.actionText}>Envoyer</Text>
                                                            </TouchableOpacity>
                                                  </View>
                                        </View> : null}
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
                    backgroundColor: '#fff',
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
                    backgroundColor: '#ddd',
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
})