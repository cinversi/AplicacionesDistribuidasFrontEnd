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
    const { id, descripcion, categoria, fecha } = subasta.item
    //const { foto } = subasta.item.items.producto.fotos
    //console.log( "IMPRIMIENDO",subasta.item.items)
    //const imageSubasta = images[0]

    const goSubasta = () => {
        navigation.navigate("subasta", { id, descripcion })
    } 

    function mostrarItems() {
        
        // console.log("ESTO ES UN ITEM",subasta.item)
        // console.log("/////////////////////////////////")
        // console.log("ESTO ES UN ITEM.ITEMS",subasta.item.items)
        // console.log("/////////////////////////////////")
        // console.log("ESTO ES UN ITEM.PRODUCTO",subasta.item.items[0].producto)
        // console.log("/////////////////////////////////")
        // console.log("ESTO ES UN ITEM.PRODUCTO.FOTOS",subasta.item.items[0].producto.fotos)
        // console.log("/////////////////////////////////")
        // console.log("ESTO ES UN ITEM.PRODUCTO.FOTOS.FOTO",subasta.item.items[0].producto.fotos[0].foto)
        subasta.item.items.map(producto => {
            Object.keys(subasta.item.items).map((item,index) => {
                return(
                  <option value={subasta.item.items[item].producto} key={index}>
                      {/* {console.log("esto de items",subasta.item.items[item].producto.fotos)} */}
                      { subasta.item.items[item].producto.fotos.map(variable => {
                        Object.keys(subasta.item.items[item].producto.fotos).map((item2,index) => {
                            return(
                            <option value={subasta.item.items[item].producto.fotos[item2].foto} key={index}>
                                {console.log("esto es fotos",subasta.item.items[item].producto.fotos[item2].foto)}
                            </option>
                            )
                        })
                        })}
                  </option>
                )
            })
          })
      }
      mostrarItems()
    
    return (
        <TouchableOpacity onPress={goSubasta}>
            <View style={styles.viewSubasta}>
                <View style={styles.viewSubastaImage}>
                    <Image
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator color="#fff"/>}
                        //source={{ uri: foto }}
                        //style={styles.imageSubasta}
                    />
                </View>
                <View>
                    <Text style={styles.subastaTitle}>{descripcion}</Text>
                    <Text style={styles.subastaInformation}>Categoría: {categoria}</Text>
                    <Text style={styles.subastaInformation}>Fecha: {fecha}</Text>
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