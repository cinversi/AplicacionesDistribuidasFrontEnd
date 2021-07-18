import React, { useState, useRef,useEffect} from 'react'
import { Alert,StyleSheet, Text, View } from 'react-native'
import { Button, Input } from 'react-native-elements'
import Toast from 'react-native-easy-toast'
import { isEmpty,size} from 'lodash'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Loading from '../../components/Loading'

import axios from 'axios'
import config from '../../config'
 
export default function AddPujasSubasta({ navigation, route }) {
    const { catItem,subasta,permitidoPujar,ultimoValorPujado,ultimoPujador,precioBaseItem,ultimoDiaHorarioPuja,subastaNoValida,espectadorRematador,currentUser,habilitadoItemCatalogo} = route.params
    const toastRef = useRef()
 
    const [puja,setPuja] = useState(null)
    const [errorPuja,setErrorPuja]=useState(null)
    const [loading, setLoading] = useState(true) 
    const [mediosDePago,setMediosDePago]= useState([])

    useEffect(() => {
        axios.get(config.API_URL+config.REACT_APP_BACKEND_GETMEDIOSDEPAGO+ `?user_id=${currentUser.uid}`).then(res2 => {
            setMediosDePago(res2.data)
            setLoading(false)
        }).catch(err => {
            console.log(err);
        });
    },[loading])

    const addPuja = async () =>{
        if (!validForm()) {
            return
        } 
        const uidUser=currentUser.uid
        const subastaId=subasta.item.id
        const itemId=catItem.item.id
        if(size(mediosDePago)>0){
            await axios.get(config.API_URL+config.REACT_APP_BACKEND_ADDASISTENTE+ `?&user_id=${uidUser}&subasta_id=${subastaId}&item_id=${itemId}&importe=${puja}&comision=${"3"}`).then(res3 => {
                if(res3.data=="EnOtraSubasta"){
                    AlertaParticipandoEnOtraSubasta()
                }
                else {
                    AlertaExitoAlPujar()
                }                
                setLoading(false)
            }).catch(err => {
                console.log(err);
            });              
        }
        else{
            setLoading(false)
            AlertaNoMediosDePago()            
        }

    }

    const validForm = () => {
        let isValid = true
        const pujaInt=parseInt(puja)
        const valorLimit=(parseInt(ultimoValorPujado))*1.20
        const ultimoValorPujadoInt=parseInt(ultimoValorPujado)
 
        if(subasta.item.categoria=="COMUN" || subasta.item.categoria == "ESPECIAL" || subasta.item.categoria== "PLATA"){
            if(parseInt(puja)<parseInt(ultimoValorPujadoInt*1.01)){
                setErrorPuja("Debes ingresar un monto mayor al 1% del precio base")
                isValid=false
        }
        }  

        if(pujaInt<=ultimoValorPujadoInt){
            setErrorPuja("El monto ingresado debe ser mayor a la ultima puja.")
            isValid = false
        }
 
        if(pujaInt>valorLimit){
            setErrorPuja("El monto ingresado no debe exceder al 20% del valor de la misma.")
            isValid = false 
        }
 
        if(isNaN(puja)){
            setErrorPuja("Debes ingresar un valor numerico para pujar.")
            isValid = false  
        }
        
        if (isEmpty(puja)) {
            setErrorPuja("Debes ingresar un valor para pujar.")
            isValid = false
        }
 
        return isValid
    }

    const AlertaNoMediosDePago = () =>
        Alert.alert(
        "Fallo",
        "No tenes medios de pago registrados",
        [
            {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
            },
            { text: "OK", onPress: () => navigation.navigate("account")  }
        ]
    );

    const AlertaParticipandoEnOtraSubasta = () =>
        Alert.alert(
        "Fallo",
        "Actualmente ya estas participando en otra subasta",
        [
            {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
            },
            { text: "OK", onPress: () => navigation.navigate("subastas")  }
        ]
    );

    const AlertaAbandonasteSubasta = () =>
    Alert.alert(
    "Exito",
    "Abandonaste la subasta",
    [
        {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
        },
        { text: "OK", onPress: () => navigation.navigate("subastas")  }
    ]
);

    const AlertaExitoAlPujar = () =>
    Alert.alert(
    "Exito",
    "Realizaste una nueva puja en la subasta!",
    [
        {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
        },
        { text: "OK", onPress: () => navigation.navigate("subastas")  }
    ]
);
    

    const abandonarSubasta = async () =>{
        const uidUser=currentUser.uid
        const subastaId=subasta.item.id
        const itemId=catItem.item.id
        axios.get(config.API_URL+config.REACT_APP_BACKEND_ABANDONARSUBASTA+ `?&user_id=${uidUser}&subasta_id=${subastaId}`).then(res => {
            AlertaAbandonasteSubasta()             
            setLoading(false)
            }).catch(err => {
                console.log(err);
            });              
    }

    return (
        <KeyboardAwareScrollView>
            <View style={styles.viewBody}>
                <View>
                    <Text style={styles.viewPrecioBaseText}>Precio base</Text> 
                    <Text style={styles.viewPrecioBase}>${precioBaseItem}</Text>
                    <Text style={styles.viewPrecioActualText}>Precio actual</Text>
                    <Text style={styles.viewPrecioActual}>${ultimoValorPujado}</Text>
                    <Text style={styles.viewInfo}>{catItem.item.producto.descripcionCatalogo}</Text>
                    <Text style={styles.viewUltimasPujas}>Día y horario de última puja: {ultimoDiaHorarioPuja}</Text>
                    <Text style={styles.viewUltimasPujas}>Ultimo pujador: {ultimoPujador}</Text>
                </View>
                {
                    permitidoPujar && habilitadoItemCatalogo ?
                <View style={styles.formReview}>
                    <Input
                        placeholder="$ Ingresar valor a pujar"
                        containerStyle={styles.input}
                        onChange={(e) => setPuja(e.nativeEvent.text)}
                        errorMessage={errorPuja}
                    />
                <Button
                        title="Pujar"
                        onPress={addPuja}
                        buttonStyle={styles.btn}
                        containerStyle={styles.btnContainer}
                    />                    
                <Button
                        title="Abandonar subasta"
                        onPress={abandonarSubasta}
                        buttonStyle={styles.btn}
                        containerStyle={styles.btnContainer}
                    />
                </View>
                    : !permitidoPujar ? 
                        <View>
                            <Text style={styles.viewNoPujarBigText}>
                            Si ya realizaste una puja debes esperar a que otra persona realice una para volver a pujar, intenta más tarde.
                            </Text>         
                        </View>
                    : !habilitadoItemCatalogo ?
                        <View>
                            <Text style={styles.viewNoPujarBigText}>
                            El producto ya ha sido subastado. Muchas gracias.
                            </Text>         
                        </View>
                    : null      
                }
                <Toast ref={toastRef} position="center" opacity={0.9}/>
            </View>
        </KeyboardAwareScrollView>
    )
}
 
 
const styles = StyleSheet.create({
    viewBody: {
        flex: 1
    },
    viewPrecioBaseText:{
        fontSize:20,
        textAlign:"center",
        color:"#9c63c9",
        marginTop: 15
    },
    viewPrecioBase:{
        fontSize:20,
        textAlign:"center",
        color:"#9c63c9"
    },
    viewPrecioActualText:{
        fontSize:30,
        textAlign:"center",
        color:"#442484",
        fontWeight:"bold",
        marginTop: 15
    },
    viewPrecioActual:{
        fontSize:30,
        textAlign:"center",
        color:"#442484",
        fontWeight:"bold"
    },
    viewInfo:{
        fontSize:15,
        textAlign:"center",
        fontWeight:"bold"
    },
    viewInfoHora:{
        fontSize:15,
        textAlign:"center",
        fontWeight:"bold"
    },
    viewUltimasPujas:{
        fontSize:15,
        marginTop: 20
    },
    formReview: {
        flex: 1,
        alignItems: "center",
        margin: 10,
        marginTop: 20
    },
    input: {
        marginBottom: 10,
        marginTop:50
    },
    textArea: {
        height: 150,
        width: "100%",
        padding: 0,
        margin: 0
    },
    btnContainer: {
        flex: 1, 
        justifyContent: "flex-end",
        marginBottom: 20,
        width: "95%"
    },
    btn: {
        backgroundColor: "#442484"
    },  
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
      },
    title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        padding: 20,
      },
    viewNoPujarText:{
        fontSize:20,
        textAlign:"center",
        color:"#9c63c9",
        marginTop: 15
    },
    viewNoPujarSubText:{
        fontSize:15,
        textAlign:"center",
        color:"#9c63c9",
        marginTop: 10
    },
    viewNoPujarBigText:{
        fontSize:15,
        textAlign:"center",
        color:"#9c63c9",
        marginTop: 10
    }
})