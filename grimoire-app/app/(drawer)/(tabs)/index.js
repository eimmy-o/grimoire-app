import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'expo-router';
// Importamos nuestros nuevos componentes bonitos
import { CampaignCard, CharacterCard, CompendioCard } from '../../../components/HomeWidgets';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({ name: '' });
  
  // Estados para los datos del Dashboard
  const [campaigns, setCampaigns] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [recaps, setRecaps] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      // 1. Obtener Usuario Actual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return; // Si no hay usuario, no hacemos nada

      // 2. Obtener Perfil (Nombre)
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();
      setUserData({ name: profile?.username || 'Viajero' });

      // --- AQUÍ ESTABA EL ERROR ---
      // 3. Obtener Campañas (SOLO las creadas por el usuario actual)
      const { data: camps } = await supabase
        .from('campaigns')
        .select('*')
        .eq('created_by', user.id) // <--- ¡ESTA LÍNEA ES LA CLAVE!
        .order('created_at', { ascending: false })
        .limit(5);
      setCampaigns(camps || []);

      // 4. Obtener Personajes (Los últimos 3 creados por este usuario)
      const { data: chars } = await supabase
        .from('characters')
        .select(`
          id, name, total_level,
          character_races(races(name)),
          character_classes(classes(name))
        `)
        .eq('user_id', user.id) // Aquí sí lo teníamos bien
        .order('created_at', { ascending: false })
        .limit(3);
        
      const formattedChars = chars?.map(c => ({
        id: c.id,
        name: c.name,
        level: c.total_level,
        race: c.character_races?.[0]?.races?.name || '?',
        class: c.character_classes?.[0]?.classes?.name || '?'
      }));
      setCharacters(formattedChars || []);

      // 5. Recap del Compendio (Esto sí es público para todos)
      const { data: spells } = await supabase
        .from('spells')
        .select('name, school')
        .limit(3);
      
      const mixedRecap = [
        ...(spells?.map(s => ({ title: s.name, type: 'Hechizo', detail: s.school })) || []),
      ];
      setRecaps(mixedRecap);

    } catch (error) {
      console.log('Error cargando dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola de nuevo,</Text>
        <Text style={styles.username}>{userData.name}</Text>
      </View>

      {/* SECCIÓN 1: CAMPAÑAS ACTIVAS (Scroll Horizontal) */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Campañas Activas</Text>
          <Text style={styles.seeAll}>Ver todas</Text>
        </View>
        
        {campaigns.length === 0 ? (
          <Text style={styles.emptyText}>No tienes campañas aún.</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {campaigns.map((camp) => (
              <CampaignCard 
                key={camp.id}
                title={camp.title}
                description={camp.description}
                onPress={() => console.log('Ir a campaña', camp.id)}
              />
            ))}
          </ScrollView>
        )}
      </View>

      {/* SECCIÓN 2: PERSONAJES RECIENTES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personajes Recientes</Text>
        {characters.length === 0 ? (
          <Text style={styles.emptyText}>Crea tu primer personaje.</Text>
        ) : (
          characters.map((char) => (
            <CharacterCard 
              key={char.id}
              name={char.name}
              level={char.level}
              race={char.race}
              classInfo={char.class}
              onPress={() => console.log('Ir a personaje', char.id)}
            />
          ))
        )}
      </View>

      {/* SECCIÓN 3: COMPENDIO RECAP (Novedades) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Elementos de Biblioteca</Text>
        <View style={styles.recapContainer}>
          {recaps.map((item, index) => (
            <CompendioCard 
              key={index}
              title={item.title}
              type={item.type}
              detail={item.detail}
            />
          ))}
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4E3', // Fondo Crema
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 25,
    marginTop: 10,
  },
  greeting: {
    fontSize: 18,
    color: '#8C7051',
  },
  username: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A3F35',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4A3F35',
    marginBottom: 10,
  },
  seeAll: {
    color: '#5D8C5D',
    fontWeight: '600',
  },
  horizontalScroll: {
    paddingBottom: 10, // Espacio para la sombra
  },
  recapContainer: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 12,
    padding: 10,
  },
  emptyText: {
    color: '#A3B18A',
    fontStyle: 'italic',
  }
});