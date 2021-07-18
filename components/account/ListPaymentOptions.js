import React, { useState } from 'react'
import { Alert,FlatList, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Button } from 'react-native-elements'
import { getCurrentUser } from '../../utils/actions'

import axios from 'axios'
import config from '../../config'

export default function ListPaymentOptions({ payments, navigation, handleLoadMore}) {
  
  const ActualizarCategoriaUsuario = async() => {
    setLoading(true)
    const currentUser = getCurrentUser().uid;
    axios.get(config.API_URL+config.REACT_APP_BACKEND_ACTUALIZARCATEGORIACLIENTE + `?user_id=${currentUser}`).then(res => {
      setIsDefault(res.data)
      setLoading(false)
      if(res.data){
        Alert.alert("Se ha actualizado tu categoria.")
      }else{
          Alert.alert("Ocurrio un error intente nuevamente.")
      }
    }).catch(err => {
        console.log(err);
        Alert.alert("Ocurrio un error intente nuevamente.")
    });
    setLoading(false)
  }

  return (
    <View>
      <View>
      <FlatList
        data={payments}
        keyExtractor={(item, index) => index.toString()}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        renderItem={(payment) => (
          <Payment payment={payment} navigation={navigation}/>
        )}
      />
      </View>
      <Button
      buttonStyle={styles.btnCategoria}
      title="Solicitar actualización de categoria de usuario"
      titleStyle={styles.btnTitleCategoria}
      onPress={ActualizarCategoriaUsuario}
      />
    </View>
  );
}

function Payment({ payment, navigation }) {
  const { id, nombre, numero, verificado, expiracion } = payment.item;
  const [loading, setLoading] = useState(false)
  const [isDefault, setIsDefault] = useState(false)
  const [eliminarMP, setEliminarMP] = useState(false)

  const numeros = numero.split(' ')
  const numeroTarjeta = numeros[3]

  const SeleccionarDefault = async() => {
    setLoading(true)
    const currentUser = getCurrentUser().uid;
    axios.get(config.API_URL+config.REACT_APP_BACKEND_DEFAULTMEDIODEPAGO + `?user_id=${currentUser}&mp_id=${id}`).then(res => {
      setIsDefault(res.data)
      setLoading(false)
      if(res.data){
        Alert.alert("Se ha seleccionado como default.")
      }else{
          Alert.alert("Ocurrio un error intente nuevamente.")
      }
    }).catch(err => {
        console.log(err);
        Alert.alert("Ocurrio un error intente nuevamente.")
    });
    setLoading(false)
  }

  const EliminarMedioDePago = async() => {
    setLoading(true)
    const currentUser = getCurrentUser().uid;
    axios.get(config.API_URL+config.REACT_APP_BACKEND_GETELIMINARMEDIODEPAGO + `?user_id=${currentUser}&mp_id=${id}`).then(res => {
      setEliminarMP(res.data)
      setLoading(false)
      if(res.data){
        Alert.alert("Se ha eliminado el medio de pago.")
      }else{
          Alert.alert("No se puede eliminar este medio de pago")
      }
    }).catch(err => {
        console.log(err);
        Alert.alert("Ocurrio un error intente nuevamente.")
    });
    setLoading(false)
  }

  return (
    <TouchableOpacity>
      <View style={styles.viewpayment}>
        <View>
          <Text style={styles.paymentTitle}>{nombre}</Text>
          <Text style={styles.paymentInformation}>Número: * * * {numeroTarjeta}</Text>
          <Text style={styles.paymentInformation}>
            Fecha expiracion: {expiracion}
          </Text>
        </View>
        <Button
          title="Seleccionar como default"
          onPress={SeleccionarDefault}
          containerStyle={styles.btnContainer}
          buttonStyle={styles.btn}
          titleStyle={{
            color: "white",
            fontSize: 12,
          }}
        />
        <Button
          onPress={EliminarMedioDePago}
          buttonStyle={styles.btnEliminar}
          icon={{
              type: "material-community",
              name: "close-circle-outline",
              color: "#cf4666"
          }}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  viewpayment: {
    flexDirection: "row",
    margin: 10,
  },
  viewpaymentImage: {
    marginRight: 15,
  },
  imagepayment: {
    width: 90,
    height: 90,
  },
  paymentTitle: {
    fontWeight: "bold",
  },
  paymentInformation: {
    paddingTop: 2,
    color: "grey",
  },
  btnCategoria:{
    backgroundColor: "transparent",
    marginBottom: 10
  },
  btnTitleCategoria:{
    color: "#a376c7"
  },
  btn: {
    backgroundColor: "#755e9d"
  },
  btnContainer: {
    width: "35%",
    marginLeft:30,
  },
  btnContainerEliminar: {
    width: "35%"
  },
  btnEliminar: {
    backgroundColor: "transparent"
  },
});
