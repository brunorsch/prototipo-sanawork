import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../styles/theme';
import { LinearGradient } from 'expo-linear-gradient';

export const MetricCard = ({ title, value, description, source, icon: Icon, color }) => {
  const badgeColor = color || theme.colors.primary;

  return (
    <LinearGradient
      colors={theme.colors.gradients.card}
      style={styles.card}
    >
      <View style={styles.header}>
        <View style={[styles.iconBg, { backgroundColor: `rgba(${badgeColor === theme.colors.primary ? '16, 185, 129' : '59, 130, 246'}, 0.12)` }]}>
          {Icon && <Icon size={18} color={badgeColor} />}
        </View>
        {source && <Text style={styles.source}>{source}</Text>}
      </View>

      <Text style={[styles.value, { color: badgeColor }]}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.medium,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 16,
    width: '48%', // Permite colocar 2 por linha se quiser
    justifyContent: 'space-between',
    minHeight: 180,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconBg: {
    padding: 8,
    borderRadius: theme.radius.small,
  },
  source: {
    fontSize: 8,
    color: theme.colors.textMuted,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  description: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    lineHeight: 14,
  },
});
