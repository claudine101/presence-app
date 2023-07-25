import React, { useEffect } from 'react'
import { View, Text, StyleSheet, BackHandler } from 'react-native'
import LottieView from 'lottie-react-native';
import codePush from 'react-native-code-push';
import { useState } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

export default function UpdatingScreen() {
        const [isUpdating, setIsUpdating] = useState(false)
        const [receivedBytes, setReceivedBytes] = useState(0)
        const [totalBytes, setTotalBytes] = useState(0)
        const progressWidthPercentage = useSharedValue(0)
        const percentageStyles = useAnimatedStyle(() => ({
                  width: `${progressWidthPercentage.value}%`
        }))

        codePush.sync({
                  deploymentKey: "Hrj8IFSGTR-G_Eu_LTeZ-O621NISbnS5j4pfX",
                  installMode: codePush.InstallMode.IMMEDIATE
        }, status => {
                  // console.log("status", status, codePush.SyncStatus.DOWNLOADING_PACKAGE)
                  // console.log("status", status, codePush.SyncStatus.DOWNLOADING_PACKAGE)
                  switch(status) {
                            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                                      if(!isUpdating) {
                                                setIsUpdating(true)
                                      }
                                      break;
                            case codePush.SyncStatus.INSTALLING_UPDATE:
                                      setIsUpdating(false)
                                      handler.remove()
                                      break;
                  }
        }, ({ receivedBytes: recBytes, totalBytes: totBytes }) => {
                  setReceivedBytes(recBytes)
                  if(totalBytes == 0) {
                            setTotalBytes(totBytes)
                  }
        })
        useEffect(() => {
                  progressWidthPercentage.value = withTiming(receivedBytes <= 0 ? 0 : (receivedBytes * 100) / totalBytes, { duration: 100 })
        }, [receivedBytes])
        return (
                  isUpdating ? 
                  <View style={styles.container}>
                            <View style={styles.techImage}>
                                      <LottieView style={{width: '100%', height: '100%'}} source={require('../../assets/lotties/update.json')} autoPlay loop />
                            </View>
                            <Text style={styles.title}>
                                Mis à jour en cours...
                            </Text>
                            <Text style={styles.desc}>
                                L'application se rédemarre après l'installation des mis à jour
                            </Text>
                            <View style={styles.progress}>
                                      <Animated.View style={[styles.progressBar, percentageStyles]} />
                            </View>
                            <Text style={styles.downloadPercentage}>{(receivedBytes / 1000000).toFixed(1) } MB / {(totalBytes / 1000000).toFixed(1) } MB</Text>
                  </View> : null
        )
}

const styles = StyleSheet.create({
        container: {
                  flex: 1,
                  backgroundColor: '#fff',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  position: 'absolute',
                  width: '100%',
                  height: "100%",
                  zIndex: 1
        },
        techImage: {
                  width: '80%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignContent: 'center',
                  marginTop: -40,
                  maxHeight: '30%'
        },
        title: {
                  fontSize: 35,
                  fontWeight: 'bold',
                  color: '#777',
                  marginBottom: 40,
                  textAlign: 'center'
        },
        desc: {
                  textAlign: 'center',
                  marginHorizontal: 20,
                  color: '#777'
        },
        progress: {
                  height: 5,
                  width: '50%',
                  // backgroundColor: '#071E43',
                  backgroundColor: '#F1F1F1',
                  marginTop: 20,
                  borderRadius: 5
        },
        progressBar: {
                  height: '100%',
                  backgroundColor: '#071E43',
                  borderRadius: 5
        },
        downloadPercentage: {
                  marginTop: 5,
                  color: '#777',
                  fontSize: 13
        }
})