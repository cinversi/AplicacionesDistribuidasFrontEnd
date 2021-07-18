import React, { useState, useEffect, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { Dimensions, StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import { Button } from 'react-native-elements'
import firebase from 'firebase/app'
import { getCurrentUser } from '../../utils/actions'

import axios from 'axios'
import config from '../../config'

export default function UserActivityInfo() {
  const screenWidth = Dimensions.get("window").width;

  const [user, setUser] = useState(true)
  const [loading, setLoading] = useState(false) 
  const [descripcionSubasta, setDescripcionSubasta] = useState()
  const [estadoSubasta, setEstadoSubasta] = useState()
  const [estadisticas, setEstadisticas] = useState()

  useEffect(() => {
      firebase.auth().onAuthStateChanged((user) => {
          user ? setUser(true) : setUser(false)
      })
  }, [])

  useFocusEffect(
      useCallback(() => {
          async function getData() {
              setLoading(true)
              let currentUser = getCurrentUser().uid
              axios.get(config.API_URL+config.REACT_APP_BACKEND_GETGANADORSUBASTA + `?id=${currentUser}`).then(res => {
                setDescripcionSubasta(res.data.descripcion)
                setEstadoSubasta(res.data.estado)
                setLoading(false)
              }).catch(err => {
                  console.log(err);
              });

              axios.get(config.API_URL+config.REACT_APP_BACKEND_GETSUBASTACLIENTE + `?id=${currentUser}`).then(res => {
                setEstadisticas(res.data)
                setLoading(false)
              }).catch(err => {
                  console.log(err);
              });
              setLoading(false)
          }
          getData()
      }, [])
  )

  return (
    <View>
    {
    user ? 
      <View>
        <Text style={styles.styleTitulo}>Información de Usuario</Text>
        {
          (typeof descripcionSubasta!='undefined' && estadoSubasta=='Participando') ? 
          <View>
            <Text style={styles.styleParticipando}>Actualmente estas participando en la subasta: </Text>
            <Button
                title={descripcionSubasta}
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                titleStyle={{
                  color: "white",
                  fontSize: 16,
                }}
            />
          </View>
          :(typeof descripcionSubasta!='undefined' && estadoSubasta=='Ganaste') ? 
          <View>
            <Text style={styles.styleParticipando}>Ganaste la subasta: </Text>
            <Button
                title={descripcionSubasta}
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                titleStyle={{
                  color: "white",
                  fontSize: 16,
                }}
            />
          </View>
          :(typeof descripcionSubasta!='undefined' && estadoSubasta=='Perdiste') ? 
          <View>
            <Text style={styles.styleParticipando}>No Ganaste la subasta: </Text>
            <Button
                title={descripcionSubasta}
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                titleStyle={{
                  color: "white",
                  fontSize: 16,
                }}
            />
          </View>
          :
          <Text style={styles.styleParticipando}>Actualmente no estas participando en ninguna subasta </Text>
        }
        <View>
        {
          (estadisticas!=null) ? 
        <View>
        <Text style={styles.styleMonto}>El monto total gastado en las subastas hasta el momento es:</Text>
        <Button
                title={estadisticas.importegastado}
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                titleStyle={{
                  color: "white",
                  fontSize: 16,
                }}
                icon={{
                  type: "material-community",
                  name: "currency-usd",
                  color: "#ffff"
              }}
            />
        <Text style={styles.styleTitle}>La cantidad de subastas ganadas es: </Text>
        <TouchableOpacity
        style={styles.roundButton1}
        >
        <Text style={styles.styleButtonText}>{estadisticas.cantidadsubastasganadas}</Text>
        </TouchableOpacity>
        <Text style={styles.styleTitle}>La cantidad de participaciones es: </Text>
        <TouchableOpacity
        style={styles.roundButton1}
        >
        <Text style={styles.styleButtonText}>{estadisticas.cantidadparticipaciones}</Text>
        </TouchableOpacity>
        </View>
          :null
        }
        </View>
    </View>
   : null
  }
  </View>
  )
}

const styles = StyleSheet.create({
  styleTitle: {
    marginTop:20,
    fontSize: 16,
    fontWeight: "bold",
    padding: 10,
    color:"#452783"
},
styleTitulo: {
  marginTop:20,
  fontSize: 20,
  fontWeight: "bold",
  padding: 10,
  textAlign:"center",
  color:"#000000"
},
styleButtonText: {
  fontSize: 23,
  fontWeight: "bold",
  padding: 10,
  color:"#000000"
},
styleParticipando: {
  marginTop:20,
  fontSize: 16,
  fontWeight: "bold",
  padding: 10,
  color:"#452783"
},
styleMonto: {
  marginTop:20,
  fontSize: 16,
  fontWeight: "bold",
  padding: 10,
  color:"#452783"
},
btn: {
  backgroundColor: "#755e9d"
},
roundButton1: {
  width: 70,
  height: 70,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 10,
  borderRadius: 100,
  backgroundColor: 'orange',
  marginRight:"50%",
  marginLeft:"40%"
}
})





