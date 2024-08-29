import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Animatable from 'react-native-animatable'
import { useNavigation } from '@react-navigation/native'
import { Client, Databases, Query } from "react-native-appwrite";

export default function SignIn() {

    const navigation = useNavigation();
    const [userName, setUserName] = useState('');
    const [machine, setMachine] = useState('');
    const [disabledButton, setDisableButton] = useState(true);
    const [usuario, setUsuario] = useState([]);
    const [maquina, setMaquina] = useState([]);

    const appWriteURL = process.env.EXPO_PUBLIC_APPWRITE_URL;
    const appWriteProjectID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
    const appWriteDatabaseID = process.env.EXPO_PUBLIC_DATABASE_ID;
    const appWriteCollectionUsuarioID = process.env.EXPO_PUBLIC_COLLECTION_USUARIO_ID;
    const appWriteCollectionMaquinaID = process.env.EXPO_PUBLIC_COLLECTION_MAQUINA_ID;

    const client = new Client()
        .setEndpoint(appWriteURL) 
        .setProject(appWriteProjectID);
    const databases = new Databases(client);
    const fetchData = async () => {

        try {
            fetchUsuario();
            fetchMaquina()
            if (userName !== null && machine !== null) {
                setUserName(userName)
                setMachine(machine)
            }
        } catch (e) {
            console.error('Erro ao buscar Informacoes]');
            throw new Error('Falha ao buscar Informacoes.');
        }

    }

    async function fetchUsuario() {
        try {
            const response = await databases.listDocuments(
                appWriteDatabaseID,
                appWriteCollectionUsuarioID,
                [Query.select(["Nome", "$id"])]
            );
            const listaUsuarios = response.documents.map(function (resp) {
                return {
                    value: resp.Nome,
                    id: resp.$id
                };
            });
            setUsuario(listaUsuarios);
        } catch (error) {
            console.error('Erro ao buscar usuario: ' + error);
            throw new Error('Falha ao buscar usuario.');
        }
    }

    async function fetchMaquina() {
        try {
            const response = await databases.listDocuments(
                appWriteDatabaseID,
                appWriteCollectionMaquinaID,
                [Query.select(["Nome", "$id"])]
            );
            const listaMaquina = response.documents.map(function (resp) {
                return {
                    value: resp.Nome,
                    id: resp.$id
                };
            });
            setMaquina(listaMaquina);
        } catch (error) {
            console.error('Erro ao buscar maquinas: ' + error);
            throw new Error('Falha ao buscar maquina.');
        }
    }


    React.useEffect(() => {
        fetchData();
    }, [userName, machine]);

    const handleSelect = () => {
        setDisableButton(false);
    };

    const onPress = async () => {
        if (userName == '' || machine == '') {
            alert("Por favor, insira os dados")
        } else {
            await AsyncStorage.setItem('userName', userName);
            await AsyncStorage.setItem('maquina', machine);
            navigation.navigate('Home');

        }
    };

    return (
        <View style={styles.container}>
            <Animatable.View
                animation="fadeInLeft"
                delay={500}
                style={styles.containerHeader}
            >
                <Text style={styles.message}>Bem-Vindo(a)</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp"
                style={styles.containerForm}
            >
                <Text style={styles.tilte}>Usuário</Text>
                <SelectList
                    setSelected={(userName: React.SetStateAction<string>) => setUserName(userName)}
                    data={usuario}
                    save="value"
                    placeholder="Selecione o Usuário"
                    onSelect={() => handleSelect()}
                />

                <Text style={styles.tilte}>Máquina</Text>
                <SelectList
                    setSelected={(machine) => setMachine(machine)}
                    data={maquina}
                    save="value"
                    placeholder="Selecione a Maquina"
                    onSelect={() => handleSelect()}
                />

                <TouchableOpacity
                    style={styles.button}
                    disabled={disabledButton}
                    onPress={() => onPress()}
                >
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>

            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00a0db',
    },
    containerHeader: {
        marginTop: '14%',
        marginBottom: '8%',
        paddingStart: '5%',
    },
    message: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF'
    },
    containerForm: {
        backgroundColor: '#FFF',
        flex: 1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%',
    },
    tilte: {
        fontSize: 20,
        marginTop: 28,
        paddingBottom: 20,
    },
    input: {
        borderBottomWidth: 1,
        height: 40,
        marginBottom: 12,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#00a0db',
        width: '100%',
        borderRadius: 4,
        paddingVertical: 8,
        marginTop: 14,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold'
    },
    buttonRegister: {
        marginTop: 14,
        alignSelf: 'center'

    },
    registerText: {
        color: '#a1a1a1'
    },

})