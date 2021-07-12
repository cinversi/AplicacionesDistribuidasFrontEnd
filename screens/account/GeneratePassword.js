import React, { useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { Button, Icon, Input } from 'react-native-elements'

import Loading from '../../components/Loading'
import {isEmpty} from 'lodash'

export default function RecoverPassword({ navigation, route}) {
    const { emailUser } = route.params
    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState("")
    const [errorPassword, setErrorPassword] = useState(null)
    const [loading, setLoading] = useState(false)

    const validateData = () => {
        setErrorPassword(null)
        let valid = true
        console.log("password", password)

        if (isEmpty(password)) {
            setErrorPassword("Debes ingresar una contraseña.")
            valid = false
        }

        return valid
    }

    const onSubmit = async() => {
        if (!validateData()) {
            return
        }
        setLoading(true)
        axios.get(config.API_URL + config.REACT_APP_BACKEND_GENERATEPASSWORD + `?&email=${emailUser}&password=${formData.password}`).then(res => {
        setLoading(false)
        }).catch(err => {
            setLoading(false);
            Alert.alert("Ha ocurrido un error al generar la contraseña.")
            return
          });
        Alert.alert("Confirmación", "Se ha generado correctamente su nueva contraseña.")
        navigation.navigate("login")
    }

    return (
        <View style={styles.formContainer}>
            <Input
                placeholder="Ingresa tu nueva contraseña..."
                containerStyle={styles.inputForm}
                secureTextEntry={!showPassword}
                onChange={(e) => setPassword(e.nativeEvent.text)}
                defaultValue={password}
                errorMessage={errorPassword}
                rightIcon={
                    <Icon
                       type="material-community"
                       name={showPassword ? "eye-off-outline": "eye-outline"}
                       iconStyle={styles.icon}
                       onPress={()=> setShowPassword(!showPassword)}
                   />
                }
            />
            <Button
                title="Generar Contraseña"
                containerStyle={styles.bntContainer}
                buttonStyle={styles.btnRecover}
                onPress={onSubmit}
            />
            <Loading isVisible={loading} text="Generar contraseña..."/>
        </View>
    )
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30
    },
    inputForm: {
        width: "90%"
    },
    bntContainer: {
        marginTop: 20,
        width: "85%",
        alignSelf: "center"
    },
    btnRecover: {
        backgroundColor: "#442484"
    },
    icon: {
        color: "#c1c1c1"
    }
})