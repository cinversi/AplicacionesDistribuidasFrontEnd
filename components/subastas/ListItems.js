import React, { useState,useEffect,useCallback } from 'react'
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Button } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
import firebase from 'firebase/app'
import moment from 'moment'
import {isEmpty, size} from 'lodash'
import Toast from 'react-native-easy-toast'
import { getCurrentUser,ganadaPorPujador,getDocumentById,cerrandoSubasta,updatePujadorSubasta,} from '../../utils/actions'

import axios from 'axios'
import config from '../../config'

export default function ListItems({ catItems, id, horaComienzoSubasta,horaFinSubasta,fechaSubasta,subasta, currentUser, navigation, handleLoadMore }) {
    const [userLogged, setUserLogged] = useState(false)

    firebase.auth().onAuthStateChanged((currentUser) => {
        currentUser ? setUserLogged(true) : setUserLogged(false)
    })

    return (
        <View>
            <FlatList
                data={catItems}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.5}
                onEndReached={handleLoadMore}
                renderItem={(catItem) => (
                    <CatItem 
                        catItem={catItem} 
                        id={id}
                        horaComienzoSubasta={horaComienzoSubasta}
                        horaFinSubasta={horaFinSubasta}
                        fechaSubasta={fechaSubasta}
                        subasta={subasta}
                        userLogged={userLogged}
                        currentUser={currentUser}
                        navigation={navigation}/>
                )}
            />
        </View>
    )
}

function CatItem({ catItem,id,horaComienzoSubasta,horaFinSubasta,fechaSubasta,subasta, userLogged,currentUser,navigation }) {
    const { itemUuid } = catItem.item
    const [subastaNoValida,setSubastaNoValida] = useState(false)
    const [ultimoPujador,setUltimoPujador] = useState("")
    const [ultimoPujadorIDCliente,setUltimoPujadorIDCliente] = useState("")
    const [ultimoPujadorIDUser,setUltimoPujadorIDUser] = useState("")
    const [ultimoValorPujado,setUltimoValorPujado] = useState("") 
    const [permitidoPujar,setPermitidoPujar] = useState(true)
    const [precioBaseItem,setPrecioBaseItem] = useState()
    const [ultimoDiaHorarioPuja,setUltimoDiaHorarioPuja] = useState()
    const [users,setUsers]=useState([])
    const [loading, setLoading] = useState(true)
    const [habilitadoItemCatalogo,setHabilitadoItemCatalogo] = useState(true)

    useEffect(() => {
        axios.get(config.API_URL+config.REACT_APP_BACKEND_GETITEMSCATALOGOPRODUCTO+ `?&producto_id=${catItem.item.producto.id}`).then(res => {
                setPrecioBaseItem(res.data.precioBase)
                if(res.data.subastado=="si"){
                    setHabilitadoItemCatalogo(false)
                }
                else{
                    setHabilitadoItemCatalogo(true)
                }
                setLoading(false)
                }).catch(err => {
                    console.log(err);
                });
    },[loading])
    
    useEffect(() => {
            axios.get(config.API_URL+config.REACT_APP_BACKEND_GETULTIMAPUJA+ `?&producto_id=${catItem.item.producto.id}`).then(res2 => {
            const oldDate = new Date(res2.data.created_at);
            const day = oldDate.getDate();
            const month = oldDate.getMonth() + 1;
            const year = oldDate.getFullYear();
            const hour = oldDate.getHours();
            const minutes = oldDate.getUTCMinutes();
            const fechaHoraUltimaPuja=day + "-" + month + "-" + year + " " + hour + ":" + minutes
            setUltimoDiaHorarioPuja(fechaHoraUltimaPuja)
            setUltimoValorPujado(res2.data.importe)
            setUltimoPujadorIDUser(res2.data.user_id)
            setUltimoPujador(res2.data.nombre)
            setLoading(false)
            if(typeof ultimoValorPujado == 'undefined' || isEmpty(res2.data)){
                setUltimoValorPujado(precioBaseItem)
            }
            if(typeof ultimoDiaHorarioPuja == 'undefined' || isEmpty(res2.data)){
                setUltimoDiaHorarioPuja("No hay pujas hasta el momento")
            }
            if(typeof ultimoPujador == 'undefined' || isEmpty(res2.data)){
                setUltimoPujador("SubastAR")
            }
            if(userLogged){      
                if(ultimoPujador=="SubastAR"){
                    setPermitidoPujar(true)
                }
                else if(getCurrentUser().uid != ultimoPujadorIDUser){
                    setPermitidoPujar(true)
                }
                else{
                    setPermitidoPujar(false)
                }
            }
            }).catch(err => {
            console.log(err);
        });
    },[loading])

     useFocusEffect(
        useCallback(() => {
            async function getDataUsuario() {
                let date = 
                moment()
                .utcOffset('-3:00')
                .format('YYYY-M-D');

                //Para diferencia entre dia de hoy y dia de comienzo de subasta -> diffDias  
                const oldDate = new Date()
                const day = oldDate.getDate();
                const month = oldDate.getMonth() + 1;
                const year = oldDate.getFullYear();         
                date=date+' '+'05:00'
                const fechaSubastaFull=subasta.item.fecha+' '+'00:00'
                const fechaFinSubasta = year + "-" + month + "-" + day + " " + subasta.item.horaFin;
                var hoyMomenteado=moment(date,"YYYY-M-D")
                var comienzoMomenteado=moment(fechaSubastaFull,"YYYY-M-D")
                var diffDias=moment.duration(hoyMomenteado.diff(comienzoMomenteado)).asDays()

                //Fin de calculo para diffDias

                let horaMinActual = 
                moment()
                .utcOffset('-3:00')
                .format('HH:mm');

                var time_start = new Date();
                var time_end = new Date();
                var value_start =subasta.item.horaInicio.split(':');
                var value_end = horaMinActual.split(':');

                time_start.setHours(value_start[0], value_start[1], 0)
                time_end.setHours(value_end[0], value_end[1], 0)

                const diffHoursComienzoAhora = time_end - time_start // millisecond 

                //Diferencia finSubasta-momentoActual
                var time_start1 = new Date();
                var time_end1 = new Date();
                var value_start1 =horaMinActual.split(':');
                var value_end1 = subasta.item.horaFin.split(':');

                time_start1.setHours(value_start1[0], value_start1[1], 0)
                time_end1.setHours(value_end1[0], value_end1[1], 0)

                const diffHoursFinAhora = time_end1 - time_start1 // millisecond 

       
                if(diffDias==0){
                    if(diffHoursComienzoAhora>=0 && diffHoursFinAhora>=0){
                        setSubastaNoValida(false)
                    }
                    else if(diffHoursComienzoAhora<0){
                        //En este caso quiere decir que todavia no llegó el momento del comienzo de la subasta.
                        console.log("Subasta no disponible")
                        setSubastaNoValida(true)
                    }
                    else if (diffHoursFinAhora<0){
                        setSubastaNoValida(true)
                        //Este caso quiere decir que ya es más tarde que el momento de la subasta
                        //Hay que guardar usuario final,puja final,listadoDePujas y borrar las pujas, enviar mail al ganador
                        setLoading(true)
                        axios.get(config.API_URL+config.REACT_APP_BACKEND_CERRAR_SUBASTA+ `?&subasta_id=${subasta.item.id}`).then(res => {
                            setLoading(false)
                            }).catch(err => {
                                console.log(err);
                            });

                    }
                }
                else if(diffDias>0)
                {
                    //En este caso sería si ya nos pasamos del día de la subasta
                    //Hay que guardar usuario final,puja final,listadoDePujas y borrar las pujas, enviar mail al ganador
                    console.log("Subasta no disponible")
                    setSubastaNoValida(true)

                    setLoading(true)
                    axios.get(config.API_URL+config.REACT_APP_BACKEND_CERRAR_SUBASTA+ `?&subasta_id=${subasta.item.id}`).then(res => {
                        setLoading(false)
                        }).catch(err => {
                            console.log(err);
                        });

                    
                }
                else if(diffDias<0){
                    //Caso en cual la subasta es en el futuro, todavia no se llegó al día
                    console.log("Subasta no disponible")
                    setSubastaNoValida(true)
                }
            }
            getDataUsuario()
        },[])
    )  
   
    return (
        <TouchableOpacity>
            <View style={styles.viewCatitem}>
                <View>
                    <Text style={styles.catitemTitle}>Producto: {catItem.item.producto.descripcionCatalogo}</Text>
                    <Text style={styles.catitemInformation}>Descripción: {catItem.item.producto.descripcionCompleta}</Text>
                    { 
                        userLogged && !subastaNoValida ? 
                            <Button
                                buttonStyle={styles.btnAddPayment}
                                title="Ver precio"
                                onPress={() => navigation.navigate("add-pujas-subasta", {catItem,subasta,id,itemUuid,permitidoPujar,ultimoValorPujado,ultimoPujador,precioBaseItem,ultimoDiaHorarioPuja,currentUser,habilitadoItemCatalogo })}
                            />
                        : subastaNoValida && !userLogged ?
                        <View>
                             <Text 
                                style={styles.mustLoginText}
                                onPress={() => navigation.navigate("account")}
                            >
                                Para visualizar el precio del producto o participar en la subasta es necesario iniciar sesión.{"\n"}
                                <Text style={styles.loginText}>
                                    Pulsa AQUÍ para hacerlo!
                                </Text>
                            </Text>
                            <Text style={styles.mensajes}>
                                La subasta elegida no se encuentra disponible
                            </Text>
                            </View>
                    : !subastaNoValida && !userLogged ?
                        <View>
                            <Text 
                            style={styles.mustLoginText}
                            onPress={() => navigation.navigate("account")}
                            >
                            Para visualizar el precio del producto o participar en la subasta es necesario iniciar sesión.{"\n"}
                            <Text style={styles.loginText}>
                                Pulsa AQUÍ para hacerlo!
                            </Text>
                             </Text>
                         </View> 
                        : subastaNoValida && userLogged ?      
                        <Text 
                        style={styles.mensajes}>
                        La subasta elegida no se encuentra disponible
                    </Text>
                        : null  
}                
                </View>
            </View>
        </TouchableOpacity>
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
    },    
    mensajes: {
        marginTop:10,
        fontWeight: "bold",
        textAlign: "center"
    }
})
