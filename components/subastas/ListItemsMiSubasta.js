import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import firebase from 'firebase/app'

export default function ListItemsMiSubasta({ catItems, icproducto }) {
    const [userLogged, setUserLogged] = useState(false)

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false)
    })

    return (
        <View style={styles.viewCatitem}>
            <View>
                <Text style={styles.catitemTitle}>Producto: {catItems.item.descripcionCatalogo}</Text>
                <Text style={styles.catitemInformation}>Descripción: {catItems.item.descripcionCompleta}</Text>
                <Text style={styles.catitemInformation}>Cantidad: {catItems.item.cantidad}</Text>
                <Text style={styles.catitemTitle}>Precio Base: ${icproducto.precioBase}</Text>
                <Text style={styles.catitemTitle}>Comision Base: %{icproducto.comision} (*)</Text>
                <Text style={styles.catitemInformation}>(*) La comisión final será calculada siendo el 10% del precio final del producto.</Text>
                <Text style={styles.catitemRecordatorio}>Recordatorio: En caso de rechazar la oferta se llevará a cabo la devolución del bien y se le cobrarán los gastos de devolución.</Text>
            </View>
        </View>
    )
}
    
const styles = StyleSheet.create({
    viewCatitem: {
        flexDirection: "row",
        margin: 10
    },
    viewCatitemImage: {
        marginRight: 15
    },
    imageCatitem: {
        width: 90,
        height: 90
    },
    catitemTitle: {
        fontWeight: "bold"
    },
    catitemInformation: {
        paddingTop: 2,
        color: "grey"
    },
    catitemRecordatorio: {
        paddingTop: 2,
        color: "grey",
        fontStyle: "italic"
    },
    btnAddPayment: {
        backgroundColor: "#442484",
        padding: 5
    },
    mustLoginText: {
        textAlign: "center",
        color: "#a376c7",
        padding: 20,
    },
    loginText: {
        fontWeight: "bold"
    }
})