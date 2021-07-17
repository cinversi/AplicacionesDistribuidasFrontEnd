import React from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Image } from 'react-native-elements'

export default function ListMisSubastas({ subastas, navigation }) {
    return (
        <View>
            <FlatList
                data={subastas}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.5}
                renderItem={(subasta) => (
                    <Subasta subasta={subasta} navigation={navigation}/>
                )}
            />
        </View>
    )
}

function Subasta({ subasta, navigation }) {
    const { id, images, artista_obra,cantidad,descripcionCatalogo,descripcionCompleta,
        disponible,duenio_id,fecha,fecha_obra,historia_obra} = subasta.item
    const imageSubasta = subasta.item.fotos[0].foto
    
    const getAllImagesSubasta =()=> {
        var result=[]
        for (let i=0; i<subasta.item.fotos.length;i++){
            result[i]=(subasta.item.fotos[i].foto)
        }
        return result
    }
    const allImages = getAllImagesSubasta()

    const goSubasta = () => {
        navigation.navigate("miSubasta", { id, descripcionCatalogo, allImages, subasta })
    } 

    return (
        <TouchableOpacity onPress={goSubasta}>
            <View style={styles.viewSubasta}>
                <View style={styles.viewSubastaImage}>
                    <Image
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator color="#fff"/>}
                        source={{ uri: imageSubasta }}
                        style={styles.imageSubasta}
                    />
                </View>
                <View>
                    <Text style={styles.subastaTitle}>{descripcionCatalogo}</Text>
                    <Text style={styles.subastaInformation}>Descripción: {descripcionCompleta}</Text>
                    <Text style={styles.subastaInformation}>Fecha: {fecha}</Text>
                    <Text style={styles.subastaEstado}>Disponible: {disponible}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    viewSubasta: {
        flexDirection: "row",
        margin: 10
    },
    viewSubastaImage: {
        marginRight: 15
    },
    imageSubasta: {
        width: 90,
        height: 90
    },
    subastaTitle: {
        fontWeight: "bold"
    },
    subastaInformation: {
        paddingTop: 2,
        color: "grey"
    },
    subastaEstado: {
        paddingTop: 2,
        color: "black",
        fontWeight: "bold"
    },
})