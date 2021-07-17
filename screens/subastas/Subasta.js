import React, { useState, useCallback, useRef, useEffect } from 'react'
import { View } from 'react-native'
import { Alert, Dimensions, StyleSheet, Text, ScrollView } from 'react-native'
import { ListItem, Icon, Input, Button } from 'react-native-elements'
import { isEmpty, map, size} from 'lodash'
import { useFocusEffect } from '@react-navigation/native'
import firebase from 'firebase/app'
import Toast from 'react-native-easy-toast'

import CarouselImages from '../../components/CarouselImages'
import Loading from '../../components/Loading'
import ListItems from '../../components/subastas/ListItems'

const widthScreen = Dimensions.get("window").width

export default function Subasta({ navigation, route }) {
    const { id, descripcion,moneda, allImages, subasta } = route.params
    const toastRef = useRef()
    
    const [activeSlide, setActiveSlide] = useState(0)
    const [userLogged, setUserLogged] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(false)

    firebase.auth().onAuthStateChanged(user => {
        user ? setUserLogged(true) : setUserLogged(false)
        setCurrentUser(user)
    })

    navigation.setOptions({ title: descripcion })

    if (!subasta) {
        return <Loading isVisible={true} text="Cargando..."/>
    }

    return (
        <ScrollView style={styles.viewBody}>
            <CarouselImages
                images={allImages}
                height={250}
                width={widthScreen}
                activeSlide={activeSlide}
                setActiveSlide={setActiveSlide}
            />
            <TitleSubasta
                descripcion={descripcion}
                categoria={subasta.item.categoria}
                fecha={subasta.item.fecha}
                horaInicio={subasta.item.horaInicio}
                horaFin={subasta.item.horaFin}
                //listadoPujas={subasta.listadoPujas}
                moneda={moneda}
            />
            <ListItem
                style={styles.containerListItem}
            ></ListItem>
            <Text style={styles.catalogoTitle}>Catálogo</Text>
            {
                size(subasta.item.items) > 0 ? (
                    <ListItems
                        catItems={subasta.item.items}
                        id={id}
                        horaComienzoSubasta={subasta.item.horaInicio}
                        horaFinSubasta={subasta.item.horaFin}
                        fechaSubasta={subasta.item.fecha}
                        subasta={subasta}
                        currentUser={currentUser}
                        navigation={navigation}
                        handleLoadMore={() => {}}
                    />
                ) : (
                    <View style={styles.notFoundView}>
                        <Text style={styles.notFoundText}>No hay productos cargados.</Text>
                    </View>
                )
            }

            <Toast ref={toastRef} position="center" opacity={0.9}/>
            <Loading isVisible={loading} text="Por favor espere..."/>
        </ScrollView>
    )
}

function TitleSubasta({ descripcion, categoria, fecha, horaInicio, horaFin, moneda}) {
    return (
        <View style={styles.viewSubastaTitle}>
            <View style={styles.viewSubastaContainer}>
                <Text style={styles.descripcionSubasta}>{descripcion}</Text>
            </View>
            <Text style={styles.categoriaSubasta}>Categoría {categoria}</Text>
            <Text style={styles.descriptionSubasta}>Fecha a Subastar: {fecha}</Text>
            <Text style={styles.descriptionSubasta}>Horario a Subastar: {horaInicio}</Text>
            <Text style={styles.descriptionSubasta}>Horario de Finalización: {horaFin}</Text>
            <Text style={styles.descriptionSubasta}>Moneda: ${moneda}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    viewSubastaTitle: {
        padding: 15
    },
    catalogoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        padding: 10,
        color:"#442848"
    },
    viewSubastaContainer: {
        flexDirection: "row"
    },
    descriptionSubasta: {
        marginTop: 8,
        color: "gray",
        textAlign: "justify"
    },
    descripcionSubasta: {
        fontWeight: "bold"
    },
    categoriaSubasta: {
        fontWeight: "bold",
        color:"#ffbc63",
        marginTop:10
    },
    viewSubastaInfo: {
        margin: 15,
        marginTop: 15
    },
    subastaInfoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15
    },
    containerListItem: {
        borderBottomColor: "#a376c7",
        borderBottomWidth: 1
    },
    viewFavorite: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 100,
        padding: 5,
        paddingLeft: 15
    },
    textArea: {
        height: 50,
        paddingHorizontal: 10
    },
    btnSend: {
        backgroundColor: "#442848"
    },
    btnSendContainer: {
        width: "95%"
    },
    textModal: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold"
    },
    modalContainer: {
        justifyContent: "center",
        alignItems: "center"
    }
})