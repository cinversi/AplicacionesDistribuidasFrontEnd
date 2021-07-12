import React,{ useState } from 'react'
import { Alert,StyleSheet, View } from 'react-native'
import { Button, Icon, Input } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { isEmpty } from 'lodash'

import { validateEmail } from '../../utils/helpers'
import { loginWithEmailAndPassword } from '../../utils/actions'
import Loading from '../Loading'

import config from '../../config'
import axios from 'axios'

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState(defaultFormValues())
    const [errorEmail, setErrorEmail] = useState("")
    const [errorPassword, setErrorPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const navigation = useNavigation()

    const onChange = (e,type) =>{
        setFormData({...formData, [type]:e.nativeEvent.text})
    }

    const emailUser = formData.email
    const doLogin = async() => {
        if (!validateData()) {
            return;
        }
        setLoading(true)
        axios.get(config.API_URL + config.REACT_APP_BACKEND_LOGIN + `?&email=${formData.email}&password=${formData.password}`).then(res => {
            setLoading(false)
            if(res.data == 'generatepassword'){
                navigation.navigate("generate-password",{emailUser})
            }else if (res.data == 'login'){
                navigation.navigate("account")
            }
        }).catch(err => {
            setLoading(false);
            Alert.alert("Ha ocurrido un error al iniciar sesion intenta nuevamente.")
            return
          });
    }

    const validateData = () => {
        setErrorEmail("")
        setErrorPassword("")
        let isValid = true

        if(!validateEmail(formData.email)) {
            setErrorEmail("Debes de ingresar un email válido.")
            isValid = false
        }

        if (isEmpty(formData.password)) {
            setErrorPassword("Debes de ingresar tu contraseña.")
            isValid = false
        }

        return isValid
    }

    return (
        <View style={styles.container}>
            <Input
             containerStyle={styles.input}
             placeholder="Ingresa tu email..."
             onChange={(e)=> onChange(e,"email")}
             keyboardType="email-address"
             errorMessage={errorEmail}
             defaultValue={formData.email}
             />
            <Input
             containerStyle={styles.input}
             placeholder="Ingresa tu contraseña..."
             password={true}
             secureTextEntry={!showPassword}
             onChange={(e)=> onChange(e,"password")}
             errorMessage={errorPassword}
             defaultValue={formData.password}
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
                title="Iniciar Sesión"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={()=> doLogin()}
             />
             <Loading isVisible={loading} text="Iniciando Sesión..."/>
        </View>
    )
}

const defaultFormValues = () =>{
    return { email: "", password:""}
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems: "center",
        justifyContent:"center",
        marginTop:30
    },
    nput: {
        width: "100%"
    },
    btnContainer: {
        marginTop: 20,
        width: "95%",
        alignSelf: "center"
    },
    btn: {
        backgroundColor: "#442484"
    },
    icon: {
        color: "#c1c1c1"
    }
})
