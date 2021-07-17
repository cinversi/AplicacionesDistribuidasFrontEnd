import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { size } from 'lodash'
import firebase from 'firebase/app'

import Loading from '../../components/Loading'
import ListMisSubastas from '../../components/misSubastas/ListMisSubastas'

import config from'../../config';
import axios from 'axios'

import { getCurrentUser } from '../../utils/actions'

export default function misSubastas({ navigation }) {
    const [user, setUser] = useState(null)
    const [subastas, setSubastas] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentUser, setcurrentUser] = useState(false)

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            userInfo ? (setUser(true) && setcurrentUser(true)) : setUser(false)
        })
        setLoading(false)
        if(user){
            let response = null
            response = getCurrentUser().uid;
            console.log(response)
            axios.get(config.API_URL+config.REACT_APP_BACKEND_GETPRODUCTOS + `?&user_id=${response}`).then(res => {
                setSubastas(res.data);
                setLoading(false)
            }).catch(err => {
                console.log(err);
            });
        }
    },[loading])

    if (user === null) {
        return <Loading isVisible={true} text="Cargando..."/>
    }

    return (
            <View style={styles.viewBody}>
                {
                    size(subastas) > 0 ? (
                        <ListMisSubastas
                            subastas={subastas}
                            navigation={navigation}
                        />
                    ) : (
                        <View style={styles.notFoundView}>
                            <Text style={styles.notFoundText}>No hay productos registrados.</Text>
                        </View>
                    )
                }
                {
                    user && (
                        <Icon
                            type="material-community"
                            name="plus"
                            color="#442484"
                            reverse
                            containerStyle={styles.btnContainer}
                            onPress={() => navigation.navigate("add-subasta")}
                        />
                    )
                }
                <Loading isVisible={loading} text="Cargando productos..."/>
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