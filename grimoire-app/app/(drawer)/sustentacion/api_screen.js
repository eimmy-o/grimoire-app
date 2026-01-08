import { useState, useEffect } from "react";
import {View , Text , FlatList , StyleSheet , ActivityIndicator} from 'react-native'; 

export default function Api_Screen() {
    const [data , setData] = useState([]) ;
    const [loading , setLoading] = useState(true) ;

    useEffect(() => {
        fetch('https://www.dnd5eapi.co/api/2014/monsters/')
            .then(response => response.json())
            .then(json => setData(json.results))
            .catch(error => console.error(error))
            .finally(() => setLoading(false))
    } , []);

    return(
        <View style={styles.content}>
            <Text style={styles.title}>Biblioteca de Monsters</Text>
            {
                loading ? (
                    <ActivityIndicator size="large" color='#5D8C5D'/>
                ) : (
                    <FlatList 
                        data = {data}
                        keyExtractor={(item) => item.index}
                        renderItem={({item}) => (
                            <View style={styles.item}> 
                                <Text style={styles.text}>🐉 {item.name}</Text>
                            </View>
                        )}
                    />
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    content:{
        flex: 1,
        padding: 50,
        backgroundColor: '#F8F4E3'
    },

    title:{
        fontSize: 20,
        fontWeight: '700',
        color: '#4A3F35',
        marginBottom: 10,
    }, 

    item:{
        padding: 1,
        paddingBottom: 5,
    },

    text:{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4A3F35',
    }
});