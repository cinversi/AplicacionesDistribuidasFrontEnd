import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
import { size } from 'lodash'
import firebase from 'firebase/app'

import Loading from '../../components/Loading'
import ListSubastas from '../../components/subastas/ListSubastas'
import { getCurrentUser, getDocumentById, getMoreSubastas,getSubastas, getSubastasComun,getSubastasEspecial,getSubastasPlata,getSubastasOro,getSubastasPlatino } from '../../utils/actions'

import config from'../../config';
import { API_URL,REACT_APP_BACKEND_GETALLSUBASTAS} from '@env';

import axios from 'axios'
import { configureFonts } from 'react-native-paper'
//const API_HOST = config.REACT_APP_BACKEND_URL

export default function Subastas({ navigation }) {
    const [user, setUser] = useState(null)
    const [startSubasta, setStartSubasta] = useState(null)
    const [subastas, setSubastas] = useState([])
    const [loading, setLoading] = useState(false)
    const [usuario, setUsuario] = useState()
    const [usuarioCategoria, setUsuarioCategoria] = useState()
    const [currentUser, setcurrentUser] = useState(false)

    // useEffect(() => {
    //     firebase.auth().onAuthStateChanged((userInfo) => {
    //         userInfo ? (setUser(true) && setcurrentUser(true)) : setUser(false)
    //     })
    // }, [])

    // console.log("user",user)
    // console.log("currentuser",currentUser)

    console.log("printeo",config.API_URL+config.REACT_APP_BACKEND_GETALLSUBASTAS)
    useEffect(() => {
        setLoading(true)
        //if USER LOGGED PONER LA OTRA FUNCION
         axios.get(config.API_URL+config.REACT_APP_BACKEND_GETALLSUBASTAS).then(res => {
          setSubastas(res.data);
          setLoading(false)
        }).catch(err => {
          console.log(err);
        });
      }, [])

    // if (user === null) {
    //     return <Loading isVisible={true} text="Cargando..."/>
    // }

    return (
        <View style={styles.viewBody}>
            {
                size(subastas) > 0 ? (
                    <ListSubastas
                        subastas={subastas}
                        navigation={navigation}
                    />
                ) : (
                    <View style={styles.notFoundView}>
                        <Text style={styles.notFoundText}>No hay subastas registradas.</Text>
                    </View>
                )
            }
            <Loading isVisible={loading} text="Cargando subastas..."/>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
    },
    btnContainer: {
        position: "absolute",
        bottom: 10,
        right: 10,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5
    },
    notFoundView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    notFoundText: {
        fontSize: 18,
        fontWeight: "bold"
    }
})