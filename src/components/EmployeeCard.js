import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronDown, ChevronUp, Calendar, HeartPulse, ShieldAlert, Award, FileText } from 'lucide-react-native';
import { theme } from '../styles/theme';

export const EmployeeCard = ({ employee }) => {
  const [expanded, setExpanded] = useState(false);

  // Determinar cores com base no status do funcionário
  const getStatusColor = (status) => {
    switch (status) {
      case 'Saudável':
        return theme.colors.healthy;
      case 'Atenção':
        return theme.colors.attention;
      case 'Folga Saúde':
        return theme.colors.leave;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'Saudável':
        return 'rgba(16, 185, 129, 0.1)';
      case 'Atenção':
        return 'rgba(251, 191, 36, 0.1)';
      case 'Folga Saúde':
        return 'rgba(239, 68, 68, 0.1)';
      default:
        return 'rgba(255, 255, 255, 0.05)';
    }
  };

  const statusColor = getStatusColor(employee.status);
  const statusBg = getStatusBgColor(employee.status);
  const lastUpdate = employee.history[0]?.date || 'Sem registros';

  return (
    <View style={[styles.card, expanded && styles.cardExpanded]}>
      {/* Header Resumo (Clicável) */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setExpanded(!expanded)}
        style={styles.header}
      >
        <View style={styles.avatarBg}>
          <Text style={styles.avatarText}>{employee.avatar}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{employee.name}</Text>
          <Text style={styles.role}>{employee.role}</Text>
        </View>

        <View style={styles.rightSide}>
          <View style={[styles.badge, { backgroundColor: statusBg, borderColor: statusColor }]}>
            <Text style={[styles.badgeText, { color: statusColor }]}>{employee.status}</Text>
          </View>
          <View style={styles.iconContainer}>
            {expanded ? <ChevronUp size={16} color={theme.colors.textMuted} /> : <ChevronDown size={16} color={theme.colors.textMuted} />}
          </View>
        </View>
      </TouchableOpacity>

      {/* Histórico Expandido (Detalhado) */}
      {expanded && (
        <View style={styles.detailsContainer}>
          <View style={styles.divider} />
          
          <View style={styles.sectionHeader}>
            <Calendar size={14} color={theme.colors.primary} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Histórico de Triagens Semanais</Text>
          </View>

          {employee.history.length === 0 ? (
            <Text style={styles.noHistoryText}>Nenhum histórico registrado para este funcionário.</Text>
          ) : (
            <ScrollView nestedScrollEnabled={true} style={styles.historyList}>
              {employee.history.map((record, index) => {
                const recColor = getStatusColor(record.status);
                const recBg = getStatusBgColor(record.status);

                return (
                  <View key={record.id || index} style={styles.historyItem}>
                    {/* Linha de conexão do Timeline */}
                    {index < employee.history.length - 1 && <View style={styles.timelineLine} />}
                    
                    {/* Indicador no timeline */}
                    <View style={[styles.timelineNode, { backgroundColor: recColor }]} />

                    <View style={styles.historyContent}>
                      {/* Sub-Header do Histórico */}
                      <View style={styles.historyHeader}>
                        <Text style={styles.historyDate}>{record.date}</Text>
                        <View style={[styles.smallBadge, { backgroundColor: recBg }]}>
                          <Text style={[styles.smallBadgeText, { color: recColor }]}>{record.status}</Text>
                        </View>
                      </View>

                      {/* Categoria Ocupacional */}
                      <View style={styles.categoryRow}>
                        <FileText size={11} color={theme.colors.textSecondary} style={styles.catIcon} />
                        <Text style={styles.categoryText}>Categoria: <Text style={styles.categoryName}>{record.category}</Text></Text>
                      </View>

                      {/* Relatório Protegido por IA */}
                      <View style={styles.reportBox}>
                        <View style={styles.reportBoxTitleRow}>
                          <HeartPulse size={12} color={theme.colors.primary} style={styles.reportBoxIcon} />
                          <Text style={styles.reportBoxTitle}>Relatório Seguro (IA Ocupacional):</Text>
                        </View>
                        <Text style={styles.reportText}>{record.summary}</Text>
                      </View>

                      {/* Nota de privacidade */}
                      <Text style={styles.privacyNote}>
                        * Detalhes íntimos do relato foram omitidos por privacidade (LGPD).
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 12,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  cardExpanded: {
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  avatarBg: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.cardBgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  avatarText: {
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  role: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  rightSide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.small,
    borderWidth: 1,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  iconContainer: {
    padding: 2,
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionIcon: {
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  noHistoryText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    textAlign: 'center',
    paddingVertical: 10,
  },
  historyList: {
    maxHeight: 250,
  },
  historyItem: {
    flexDirection: 'row',
    position: 'relative',
    paddingBottom: 20,
  },
  timelineLine: {
    position: 'absolute',
    left: 4,
    top: 10,
    bottom: -10,
    width: 2,
    backgroundColor: theme.colors.border,
  },
  timelineNode: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
    zIndex: 1,
  },
  historyContent: {
    flex: 1,
    marginLeft: 14,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  historyDate: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  smallBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radius.small - 2,
  },
  smallBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  catIcon: {
    marginRight: 4,
  },
  categoryText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  categoryName: {
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  reportBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: theme.radius.medium - 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 10,
  },
  reportBoxTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  reportBoxIcon: {
    marginRight: 4,
  },
  reportBoxTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: theme.colors.textSecondary,
  },
  reportText: {
    fontSize: 11,
    color: theme.colors.textPrimary,
    lineHeight: 15,
  },
  privacyNote: {
    fontSize: 9,
    color: theme.colors.textMuted,
    marginTop: 4,
    fontStyle: 'italic',
  },
});
