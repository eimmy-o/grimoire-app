import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

//Tarjeta de Campaña
export const CampaignCard = ({ title, description, onPress }) => {
  return (
    <TouchableOpacity style={styles.campaignCard} onPress={onPress}>
      <View style={styles.campaignIconPlaceholder}>
        <Text style={styles.campaignIconText}>{title.charAt(0)}</Text>
      </View>
      <Text style={styles.campaignTitle} numberOfLines={1}>{title}</Text>
      <Text style={styles.campaignDesc} numberOfLines={2}>{description}</Text>
    </TouchableOpacity>
  );
};

//Tarjeta de Personaje
export const CharacterCard = ({ name, race, classInfo, level, onPress }) => {
  return (
    <TouchableOpacity style={styles.listCard} onPress={onPress}>
      <View style={styles.charIconPlaceholder} />
      <View style={styles.textContainer}>
        <Text style={styles.listTitle}>{name}</Text>
        <Text style={styles.listSubtitle}>Nvl {level} | {race} - {classInfo}</Text>
      </View>
      <View style={styles.arrowContainer}>
        <Text style={styles.arrow}>→</Text>
      </View>
    </TouchableOpacity>
  );
};

//Tarjeta de Compendio 
export const CompendioCard = ({ title, type, detail, onPress }) => {
  // Color distintivo según el tipo
  const getBadgeColor = () => {
    if (type === 'Hechizo') return '#E07A5F'; // Terracota
    if (type === 'Clase') return '#81B29A'; // Verde menta
    return '#F2CC8F'; // Amarillo arena
  };

  return (
    <TouchableOpacity style={styles.compendioRow} onPress={onPress}>
      <View style={[styles.typeBadge, { backgroundColor: getBadgeColor() }]}>
        <Text style={styles.badgeText}>{type.charAt(0)}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.compendioTitle}>{title}</Text>
        <Text style={styles.compendioSubtitle}>{detail}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Estilos Campaña
  campaignCard: {
    backgroundColor: '#FFFFFF',
    width: 140,
    height: 140,
    borderRadius: 16,
    padding: 12,
    marginRight: 15,
    justifyContent: 'space-between',
    // Sombra suave
    shadowColor: '#4A3F35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#EDE0D4',
  },
  campaignIconPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: '#A3B18A', // Verde suave
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  campaignIconText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  campaignTitle: { fontSize: 14, fontWeight: 'bold', color: '#4A3F35', marginTop: 8 },
  campaignDesc: { fontSize: 10, color: '#8C7051' },

  // Estilos Generales Lista (Personajes)
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginBottom: 10,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#5D8C5D', // Borde verde lateral
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    elevation: 1,
  },
  charIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DDBEA9', // Color piel/tierra claro
    marginRight: 12,
  },
  textContainer: { flex: 1 },
  listTitle: { fontSize: 16, fontWeight: '600', color: '#3A332C' },
  listSubtitle: { fontSize: 12, color: '#6B705C' },
  arrow: { fontSize: 18, color: '#A3B18A', fontWeight: 'bold' },

  // Estilos Compendio
  compendioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)', // Semitransparente
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E6DCC3',
  },
  typeBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  badgeText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  compendioTitle: { fontSize: 14, fontWeight: '600', color: '#4A3F35' },
  compendioSubtitle: { fontSize: 11, color: '#8C7051', fontStyle: 'italic' },
});