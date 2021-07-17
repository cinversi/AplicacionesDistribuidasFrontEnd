import React, { useState, useEffect, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { PieChart } from "react-native-chart-kit";

import {size} from 'lodash'
import firebase from 'firebase/app'
import { getCurrentUser, getDocumentById } from '../../utils/actions'

export default function UserActivityInfo() {
  const screenWidth = Dimensions.get("window").width;

  const [user, setUser] = useState(true)
  const [loading, setLoading] = useState(false)
  const [usuario, setUsuario] = useState()
  const [participacion, setParticipacion] = useState([])
  const [subastasGanadas, setSubastasGanadas] = useState([])
  const [estaEnSubasta, setEstaEnSubasta] = useState("0")
  const [subastaName, setSubastaName] = useState()
  const [montoGastado, setMontoGastado] = useState()
  
  useEffect(() => {
      firebase.auth().onAuthStateChanged((user) => {
          user ? setUser(true) : setUser(false)
      })
  }, [])

  useFocusEffect(
      useCallback(() => {
          async function getData() {
              setLoading(true)
              const response = await getDocumentById("users", getCurrentUser().uid);
              setUsuario(response.document)
              setParticipacion(response.document.participaciones)
              setSubastasGanadas(response.document.subastasGanadas)
              setEstaEnSubasta(response.document.estoyEnSubasta)
              const cantidadGanadas = size(response.document.subastasGanadas)
              let montoFinal=0
              if(cantidadGanadas>0)
              {
                for(let i = 0; i < cantidadGanadas; i++){
                  montoFinal=montoFinal+response.document.subastasGanadas[i].valorFinal
                }
                setMontoGastado(montoFinal)
              }
              if(response.document.estoyEnSubasta != "0"){
              const result = await getDocumentById("subastas",response.document.estoyEnSubasta);
              setSubastaName(result.document.name)
              }
              setLoading(false)
          }
          getData()
      }, [])
  )

  const cantidadParticipaciones = size(participacion)
  const cantidadGanadas = size(subastasGanadas)

  return (
    <View>
    {
    user ? 
      <View>
        {
          (estaEnSubasta!="0") ? 
            <Text style={styles.styleParticipando}>Actualmente estas participando en la subasta: {subastaName}</Text>
          :
            <Text>Actualmente no estas participando en ninguna subasta</Text>
        }
        <View>
        <Text style={styles.styleMonto}>El monto total gastado en las subastas hasta el momento es: ${montoGastado}</Text>
        </View>
        <Text style={styles.styleTitle}>Relación entre las subastas en las que participaste con las que ganaste:</Text>
    </View>
   : null
  }
  </View>
  )
}

const styles = StyleSheet.create({
  styleTitle: {
    fontSize: 15,
    fontWeight: "bold",
    padding: 10,
    color:"#2b83d5"
},
styleParticipando: {
  fontSize: 15,
  fontWeight: "bold",
  padding: 10,
  color:"#452783"
},
styleMonto: {
  fontSize: 15,
  fontWeight: "bold",
  padding: 10,
  color:"#452783"
}
})



