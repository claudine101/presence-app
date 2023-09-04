import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View, TouchableNativeFeedback, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback, ActivityIndicator } from "react-native";
import { Ionicons, AntDesign, MaterialIcons, FontAwesome5, Fontisto, Feather } from '@expo/vector-icons';
import { COLORS } from "../../../../styles/COLORS"
import moment from 'moment'
import ImageView from "react-native-image-viewing";
import fetchApi from "../../../../helpers/fetchApi";
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import Loading from "../../../../components/app/Loading";

export default function DetailsVolReenvoyerRetourSupAilleScanScreen(){
        const route = useRoute()
        const navigation = useNavigation()
        const { details, userTraite } = route.params
        const [document, setDocument] = useState(null)
        const [isCompressingPhoto, setIsCompressingPhoto] = useState(false)
        const [loadingData, setLoadingData] = useState(false)
        const [galexyIndex, setGalexyIndex] = useState(null)
        const [loadingPvs, setLoadingPvs] = useState(false)
        const [pvs, setPvs] = useState(false)
        const [check, setCheck] = useState([])
        const [loadingCheck, setLoadingCheck] = useState(false)
        return(
                <View>
                        <Text>DetailsVolReenvoyerRetourSupAilleScanScreen</Text>
                </View>
        )
}