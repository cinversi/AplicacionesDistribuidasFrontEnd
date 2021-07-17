import React from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Image } from 'react-native-elements'
export default function ListSubastas({ subastas, navigation, handleLoadMore }) {
    return (
        <View>
            <FlatList
                data={subastas}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.5}
                onEndReached={handleLoadMore}
                renderItem={(subasta) => (
                    <Subasta subasta={subasta} navigation={navigation}/>
                )}
            />
        </View>
    )
}

function Subasta({ subasta, navigation, handleLoadMore }) {
    const { id, descripcion, categoria, fecha,moneda } = subasta.item
    const imageSubasta = subasta.item.items[0].producto.fotos[0].foto

    const getAllImagesSubasta =()=> {
        var result=[]
        for (let j=0; j<subasta.item.items.length;j++){
            for (let i=0; i<subasta.item.items[j].producto.fotos.length;i++){
                result[i]=(subasta.item.items[j].producto.fotos[i].foto)
            }
        }
        return result
    }
    const allImages = getAllImagesSubasta()

    const goSubasta = () => {
        navigation.navigate("subasta", { id, descripcion,moneda, allImages, subasta })
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
                    <Text style={styles.subastaTitle}>{descripcion}</Text>
                    <Text style={styles.subastaInformation}>Categoría: {categoria}</Text>
                    <Text style={styles.subastaInformation}>Fecha: {fecha}</Text>
                    <Text style={styles.subastaInformation}>Moneda: ${moneda}</Text>
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
    }
})