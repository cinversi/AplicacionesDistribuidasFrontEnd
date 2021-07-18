import { firebaseApp } from './firebase'
import { FireSQL } from 'firesql'
import * as firebase from 'firebase'
import 'firebase/firestore'
import * as Notifications from 'expo-notifications'
import Constans from 'expo-constants'

import { fileToBlob } from './helpers'
import { map } from 'lodash'
import { Alert } from 'react-native'
import { Platform } from 'react-native'

import uuid from 'random-uuid-v4'

import config from '../config'
import axios from 'axios'

const db = firebase.firestore(firebaseApp)
const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" })

export const isUserLogged = () => {
    let isLogged = false
    firebase.auth().onAuthStateChanged((user) => {
        user !== null && (isLogged = true)
    })
    return isLogged
}

export const getCurrentUser = () => {
    return firebase.auth().currentUser
}

export const closeSession = () => {
    return firebase.auth().signOut()
}

export const registerUser = async(email,password,nombre,apellido,dni,direccion,categoria,role,token,estoyEnSubasta) => {
    const result = { statusResponse: true, error: null}
    const user = firebase.auth().createUserWithEmailAndPassword(email, 
        password).then(cred => {
        return firebase.firestore().collection('users').doc(cred.user.uid).set({
            email,nombre,apellido,dni,direccion,categoria,role,token,estoyEnSubasta
          })
        })
    return result
}

export const loginWithEmailAndPassword = async(email, password) => {
    const result = { statusResponse: true, error: null}
    try {
        await firebase.auth().signInWithEmailAndPassword(email, password)
    } catch (error) {
        result.statusResponse = false
        result.error = "Usuario o contraseña no válidos."
    }
    return result
}

export const uploadImage = async(image, path, name) => {
    const result = { statusResponse: false, error: null, url: null }
    const ref = firebase.storage().ref(path).child(name)
    const blob = await fileToBlob(image)
    console.log("asi viene la imagen",image)
    console.log("asi viene el path",path)
    console.log("asi viene el nombre",image)
    try {
        await ref.put(blob)
        const url = await firebase.storage().ref(`${path}/${name}`).getDownloadURL()
        result.statusResponse = true
        result.url = url
    } catch (error) {
        result.error = error
    }
    return result
}

export const updateProfile = async(data) => {
    const result = { statusResponse: true, error: null }
    try {
        await firebase.auth().currentUser.updateProfile(data)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const reauthenticate = async(password) => {
    const result = { statusResponse: true, error: null }
    const user = getCurrentUser()
    const credentials = firebase.auth.EmailAuthProvider.credential(user.email, password)

    try {
        await user.reauthenticateWithCredential(credentials)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const updateEmail = async(email) => {
    const result = { statusResponse: true, error: null }
    try {
        await firebase.auth().currentUser.updateEmail(email)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const updatePassword = async(password) => {
    const result = { statusResponse: true, error: null }
    try {
        await firebase.auth().currentUser.updatePassword(password)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const addDocumentWithoutId = async(collection, data) => {
    const result = { statusResponse: true, error: null }
    try {
        await db.collection(collection).add(data)
        for (let i=0; i<data.catalogo.length;i++){
            result[i]=(data.catalogo[i])
            await axios.get(config.API_URL + config.REACT_APP_BACKEND_ADDPRODUCTO + 
                `?&user_id=${data.rematador}
                &descripcionCatalogo=${result[i].descripcion}
                &descripcionCompleta=${result[i].descripcionCompleta}
                &cantidad=${result[i].cantidad}
                &artista_obra=${result[i].artista}
                &fecha_obra=${result[i].fechaObra}
                &historia_obra=${result[i].historiaObra}`).then(res => {
            }).catch(err => {
                console.log(err)
              });
        }
        for (let i=0; i<data.images.length;i++){
            console.log("data IMAGENES",)
                console.log("data.images[i]",data.images[i])
                const foto = (data.images[i]).replace("&token", "%26token")
                console.log("asi llega foto",foto)
                axios.get(config.API_URL + config.REACT_APP_BACKEND_ADDFOTO + 
                    `?&user_id=${data.rematador}
                    &foto=${foto}`).then(res => {
                }).catch(err => {
                    console.log(err)
                  });
        }
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const getDocumentById = async(collection, id) => {
    const result = { statusResponse: true, error: null, document: null }
    try {
        const response = await db.collection(collection).doc(id).get()
        result.document = response.data()
        result.document.id = response.id
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const updateDocument = async(collection, id, data) => {
    const result = { statusResponse: true, error: null }
    try {
        await db.collection(collection).doc(id).update(data)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const getToken = async() => {
    if (!Constans.isDevice) {
        Alert.alert("Debes utilizar un dispositivo físico para poder utilizar las notificaciones.")
        return
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status 
    }

    if (finalStatus !== "granted") {
        Alert.alert("Debes otorgar permiso para acceder a las notificaciones.")
        return
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data

    if (Platform.OS == "android") {
        Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C"
        })
    }

    return token
}

export const addDocumentWithId = async(collection, data, doc) => {
    const result = { statusResponse: true, error: null }
    try {
        await db.collection(collection).doc(doc).set(data)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true
    })
 })

 export const startNotifications = (notificationListener, responseListener) => {
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        console.log(notification)
    })   
    responseListener.current = Notifications.addNotificationResponseReceivedListener(notification => {
        console.log(notification)
    })  
    return () => {
        Notifications.removeNotificationSubscription(notificationListener)
        Notifications.removeNotificationSubscription(responseListener)
    }
 }

export const sendPushNotification = async(message) => {
    let response = false
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    }).then(() => response = true)
    return response
}

export const setNotificationMessage = (token, title, body, data) => {
    const message = {
        to: token,
        sound: "default",
        title: title,
        body: body,
        data: data
    }
  
    return message
}
 
export const sendEmailResetPassword = async(email) => {
    const result = { statusResponse: true, error: null }
    try {
        await firebase.auth().sendPasswordResetEmail(email)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const updateDireccion = async(newData) => {
    const result = { statusResponse: true, error: null }
    try {
        const usersRef=db.collection("users")
        usersRef.doc(getCurrentUser().uid).update({direccion:newData}) 
     } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result   
}

export const addNewPaymentMethod = async(idUser,number,expiry,cvc,name,postalCode,type) => {
    const result = { statusResponse: true, error: null }
    try {
        const paymentUuid = uuid();
        db.collection("users").doc(idUser).update({medioPago:firebase.firestore.FieldValue.arrayUnion(...[{uuid:paymentUuid,number:number,expiry:expiry,cvc:cvc,name:name,postalCode:postalCode,type:type}])})
        axios.get(config.API_URL + config.REACT_APP_BACKEND_ADDMEDIOPAGO + `?&user_id=${idUser}&numero=${number}&expiracion=${expiry}&cvc=${cvc}&nombre=${name}&codigoPostal=${postalCode}&tipo=${type}`).then(res => {
        }).catch(err => {
            console.log(err)
          });
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result   
}


export const getItemsCatalogo = async(limitSubastas) => {
    const result = { statusResponse: true, error: null, subastas: [], startSubasta: null }
    try {
        const response = await db
            .collection("subastas")
            .orderBy("createAt", "desc")
            .limit(limitSubastas)
            .get()
        if (response.docs.length > 0) {
            result.startSubasta = response.docs[response.docs.length - 1]
        }
        response.forEach((doc) => {
            const subasta = doc.data()
            subasta.id = doc.id
            result.subastas.push(subasta)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const getMoreItemsCatalogo = async(limitSubastas, startSubasta) => {
    const result = { statusResponse: true, error: null, subastas: [], startSubasta: null }
    try {
        const response = await db
            .collection("subastas")
            .orderBy("createAt", "desc")
            .startAfter(startSubasta.data().createAt)
            .limit(limitSubastas)
            .get()
        if (response.docs.length > 0) {
            result.startSubasta = response.docs[response.docs.length - 1]
        }
        response.forEach((doc) => {
            const subasta = doc.data()
            subasta.id = doc.id
            result.subastas.push(subasta)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const addMoreInfoSubasta = async(idSubasta, fechaSubastar, horaSubastar,horaFinSubasta) => {
    const result = { statusResponse: true, error: null }
    try {
        db.collection("subastas").doc(idSubasta).update({fechaSubastar: fechaSubastar,horaSubastar:horaSubastar,horaFinSubasta:horaFinSubasta,statusSubasta:"APROBADA"})
     } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result   
}

export const RechazarSubastaUpdate = async(idSubasta) => {
    const result = { statusResponse: true, error: null }
    try {
        db.collection("subastas").doc(idSubasta).update({statusSubasta:"RECHAZADA"})
     } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const addNewPuja = async(idSubasta,itemUuid,puja,usuarioId,horarioPuja ) => {
    const result = { statusResponse: true, error: null }
    console.log(idSubasta,itemUuid,puja,usuarioId,horarioPuja)
    try {
        // db.collection("subastas").doc(idSubasta).collection("catalogo").doc(nombreItem).update({listadoPujas:firebase.firestore.FieldValue.arrayUnion(...[{nombrePujador:uidUsuario,valorPujado:puja,horarioPuja:horario}])})
        db.collection("subastas").doc(idSubasta).update({listadoPujas:firebase.firestore.FieldValue.arrayUnion(...[{itemUuid:itemUuid,valorPujado:puja,datosPujador:usuarioId,horarioPuja:horarioPuja}])})
        console.log(result)
     } catch (error) {
        result.statusResponse = false
        result.error = error
        console.log(result)
    }
    return result   
}

export const addSubastaFinalizada = async(idSubasta,itemUuid,nombreUltimoPujador,valorUltimaPuja,idUsuario,diaHoraUltimoPuja,listadoPujas) => {
    const result = { statusResponse: true, error: null }
    try {
        await db.collection("subastasFinalizadas").add(idSubasta,itemUuid,nombreUltimoPujador,valorUltimaPuja,idUsuario,diaHoraUltimoPuja,listadoPujas)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const updatePrecioBase = async(idSubasta, itemUuid, precioBase,categoria) => {
    const result = { statusResponse: true, error: null }
    try {
        db.collection("subastas").doc(idSubasta).update({preciosBase:firebase.firestore.FieldValue.arrayUnion(...[{itemUuid:itemUuid, precioBase:precioBase}]),categoria:categoria}) 
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const cerrandoSubasta = async(collection, id, estado,lastPujador) => {
    const result = { statusResponse: true, error: null }
    try {
        await db.collection(collection).doc(id).update({statusSubasta:estado,ganador:lastPujador})
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const AceptarSubastaRematadorUpdate = async(id) => {
    await axios.get(config.API_URL + config.REACT_APP_BACKEND_ACEPTARPRODUCTO + `?id=${id}`).then(res => {
    }).catch(err => {
      });
    return true
}

export const RechazarSubastaRematadorUpdate = async(id) => {
    await axios.get(config.API_URL + config.REACT_APP_BACKEND_RECHAZARPRODUCTO + `?id=${id}`).then(res => {
    }).catch(err => {
      });
    return true
}

export const reseteandoPujadores = async(collection, idUsuario, estado) => {
    const result = { statusResponse: true, error: null }
    console.log("collection",collection)
    console.log("idUsuario",idUsuario)
    console.log("estado",estado)
    try {
        await db.collection(collection).doc(idUsuario).update({estoyEnSubasta:estado})
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    console.log("reseteandoPujadores",result.statusResponse,result.error)
    return result     
}


export const asistiendoAPuja = async(collection, id, estado,idSubasta,itemUuid,nombreItem) => {
    const result = { statusResponse: true, error: null }
    console.log(collection, id, estado,idSubasta,itemUuid,nombreItem)
    try {
        await db.collection(collection).doc(id).update({estoyEnSubasta:estado})
        await db.collection(collection).doc(id).update({participaciones:firebase.firestore.FieldValue.arrayUnion(...[{idSubasta:idSubasta,itemUuid:itemUuid, nombreItem:nombreItem}])})
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const ganadaPorPujador = async(collection,ultimoPujadorID,id,itemUuid,nombreItem,ultimoValorPujado,medioDePagoElegido) => {
    const result = { statusResponse: true, error: null }  
    try {
        await db.collection(collection).doc(ultimoPujadorID).update({subastasGanadas:firebase.firestore.FieldValue.arrayUnion(...[{idSubasta:id,itemUuid:itemUuid, nombreItem:nombreItem,valorFinal:ultimoValorPujado,medioDePago:medioDePagoElegido}])})
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const updatePujadorSubasta = async(collection, id, estado) => {
    const result = { statusResponse: true, error: null }
    console.log("Entro a la función",collection,id,estado)
    try {
        await db.collection(collection).doc(id).update({estoyEnSubasta:estado})
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const doRegisterPersona = async(usuario) => {
    const nombre = usuario.nombre + ' ' + usuario.apellido
    await axios.get(config.API_URL + config.REACT_APP_BACKEND_ADDPERSONA + `?&nombre=${nombre}&documento=${usuario.dni}&direccion=${usuario.direccion}&email=${usuario.email}&user_id=${usuario.id}&categoria=${usuario.categoria}`).then(res => {
    }).catch(err => {
      });
}
