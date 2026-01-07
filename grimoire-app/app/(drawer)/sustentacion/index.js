import { View, Text, StyleSheet } from 'react-native';

export default function Sustentacion(){
    return(
        <View style={styles.container}>
            <Text style={styles.text}>Esta es la pagina nueva</Text>
            <Text style={styles.subtext}>La acabo de crear por la sustentacion</Text>
            <Text style={styles.subtext}>Y como es de info fijo puse texto nomas</Text>
        </View>
    );    
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F4E3', 
        headerLeft: () => (
          <TouchableOpacity 
            onPress={toggleMenu} 
            style={{ marginLeft: 20, padding: 5 }} 
          >
            <Ionicons name="menu" size={30} color="#4A3F35" />
          </TouchableOpacity>
        ),
    },
    text: { fontSize: 24, fontWeight: 'bold', color: '#4A3F35', marginTop: 20 },
    subtext: { fontSize: 16, color: '#8C7051', marginTop: 10, fontStyle: 'italic' }
});