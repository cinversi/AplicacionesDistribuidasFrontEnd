import React, { useState, useEffect, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { StyleSheet, Text, View } from 'react-native'
import { size } from 'lodash'
import firebase from 'firebase/app'
import { getCurrentUser, getDocumentById } from '../../utils/actions'

import Loading from '../../components/Loading'
import ListSubastas from '../../components/subastas/ListSubastas'

import config from'../../config';
import axios from 'axios'

export default function Subastas({ navigation }) {
    const [user, setUser] = useState(null)
    const [subastas, setSubastas] = useState([])
    const [loading, setLoading] = useState(false)
    const [usuario, setUsuario] = useState()
    const [currentUser, setcurrentUser] = useState(false)

    useFocusEffect(
        useCallback(() => {
            async function getData() {
        firebase.auth().onAuthStateChanged((userInfo) => {
            userInfo ? (setUser(true) && setcurrentUser(true)) : setUser(false)
        })
        setLoading(true)
        let response = ""
        response = getCurrentUser().uid;
        const result = await getDocumentById("users", getCurrentUser().uid);
        const categoria = result.categoria
        console.log("categoria de usuario",categoria)
        if(response==""){
            axios.get(config.API_URL+config.REACT_APP_BACKEND_GETALLSUBASTAS).then(res => {
                setSubastas(res.data);
                setLoading(false)
            }).catch(err => {
                console.log(err);
            });
        }else {
            axios.get(config.API_URL+config.REACT_APP_BACKEND_GETALLCATEGORIASUBASTAS+ `?&user_id=${response}`).then(res => {
                setSubastas(res.data);
                setLoading(false)
            }).catch(err => {
                console.log(err);
            });
        }
        }
        getData()
    }, [])
    )


    if (user === null) {
        return <Loading isVisible={true} text="Cargando..."/>
    }

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