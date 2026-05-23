import React, { useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { TrendingUp, Users, HeartPulse, UserMinus, ShieldAlert, Award, Star, MessageSquare } from 'lucide-react-native';
import { theme } from '../styles/theme';
import { AppContext } from '../context/AppContext';
import { statisticsData } from '../data/statistics';
import { MetricCard } from '../components/MetricCard';
import { EmployeeCard } from '../components/EmployeeCard';

export const EmployerDashboard = () => {
  const { employees, appName } = useContext(AppContext);

  // Contadores para o resumo do time
  const totalEmployees = employees.length;
  const healthyCount = employees.filter(e => e.status === 'Saudável').length;
  const attentionCount = employees.filter(e => e.status === 'Atenção').length;
  const leaveCount = employees.filter(e => e.status === 'Folga Saúde').length;

  // Profissionais recomendados mock
  const professionals = [
    {
      name: 'Dr. Carlos Eduardo',
      specialty: 'Médico do Trabalho',
      rating: '4.9',
      reviews: '48',
      desc: 'Especialista em exames admissionais, periódicos e readequação de atividades ocupacionais.'
    },
    {
      name: 'Juliana Rocha',
      specialty: 'Psicóloga Organizacional',
      rating: '5.0',
      reviews: '72',
      desc: 'Foco em saúde mental corporativa, prevenção de estresse crônico e Burnout nas empresas.'
    },
    {
      name: 'Marcos Lima',
      specialty: 'Fisioterapeuta / Ergonomista',
      rating: '4.8',
      reviews: '35',
      desc: 'Consultoria ergonômica de postos de trabalho e ginástica laboral para MPEs.'
    }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {/* 1. SEÇÃO DE SENSIBILIZAÇÃO (Métricas e Benefícios) */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <TrendingUp size={18} color={theme.colors.primary} style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>Por que investir em Saúde Ocupacional?</Text>
        </View>
        <Text style={styles.sectionSubTitle}>
          Métricas comprovadas do impacto da saúde no crescimento da sua pequena empresa:
        </Text>

        <View style={styles.metricsGrid}>
          <MetricCard
            title={statisticsData.roi.title}
            value={statisticsData.roi.value}
            description={statisticsData.roi.description}
            source={statisticsData.roi.source}
            icon={Award}
            color={theme.colors.primary}
          />
          <MetricCard
            title={statisticsData.turnover.title}
            value={statisticsData.turnover.value}
            description={statisticsData.turnover.description}
            source={statisticsData.turnover.source}
            icon={UserMinus}
            color={theme.colors.leave}
          />
          <MetricCard
            title={statisticsData.absenteeism.title}
            value={statisticsData.absenteeism.value}
            description={statisticsData.absenteeism.description}
            source={statisticsData.absenteeism.source}
            icon={Users}
            color={theme.colors.secondary}
          />
          <MetricCard
            title={statisticsData.inss.title}
            value={statisticsData.inss.value}
            description={statisticsData.inss.description}
            source={statisticsData.inss.source}
            icon={HeartPulse}
            color={theme.colors.attention}
          />
        </View>
      </View>

      {/* 2. MONITORAMENTO EM TEMPO REAL DO TIME */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <HeartPulse size={18} color={theme.colors.primary} style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>Status de Saúde da Equipe</Text>
        </View>
        
        {/* Resumo rápido */}
        <View style={styles.teamSummaryRow}>
          <View style={[styles.summaryBox, { borderColor: theme.colors.healthy }]}>
            <Text style={[styles.summaryValue, { color: theme.colors.healthy }]}>{healthyCount}</Text>
            <Text style={styles.summaryLabel}>Saudáveis</Text>
          </View>
          <View style={[styles.summaryBox, { borderColor: theme.colors.attention }]}>
            <Text style={[styles.summaryValue, { color: theme.colors.attention }]}>{attentionCount}</Text>
            <Text style={styles.summaryLabel}>Atenção</Text>
          </View>
          <View style={[styles.summaryBox, { borderColor: theme.colors.leave }]}>
            <Text style={[styles.summaryValue, { color: theme.colors.leave }]}>{leaveCount}</Text>
            <Text style={styles.summaryLabel}>Folga Indicada</Text>
          </View>
        </View>

        {/* Lista de Colaboradores */}
        <View style={styles.employeeList}>
          {employees.map(emp => (
            <EmployeeCard key={emp.id} employee={emp} />
          ))}
        </View>
      </View>

      {/* 3. CONEXÃO COM PROFISSIONAIS DE SAÚDE */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Users size={18} color={theme.colors.secondary} style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>Rede de Profissionais Credenciados</Text>
        </View>
        <Text style={styles.sectionSubTitle}>
          Contrate suporte sob demanda para adequar sua empresa e orientar seus funcionários:
        </Text>

        {professionals.map((prof, index) => (
          <View key={index} style={styles.profCard}>
            <View style={styles.profHeader}>
              <View>
                <Text style={styles.profName}>{prof.name}</Text>
                <Text style={styles.profSpecialty}>{prof.specialty}</Text>
              </View>
              <View style={styles.ratingRow}>
                <Star size={14} color="#FBBF24" fill="#FBBF24" style={styles.starIcon} />
                <Text style={styles.ratingText}>{prof.rating}</Text>
                <Text style={styles.ratingCount}>({prof.reviews})</Text>
              </View>
            </View>
            <Text style={styles.profDesc}>{prof.desc}</Text>
            
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.connectBtn}
              onPress={() => alert(`Simulando abertura de chat com ${prof.name} via WhatsApp para agendamento.`)}
            >
              <MessageSquare size={14} color={theme.colors.textInverse} style={styles.btnIcon} />
              <Text style={styles.connectBtnText}>Solicitar Agendamento (Simulado)</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* 4. CONTEÚDO INFORMATIVO / LEGISLAÇÃO */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <ShieldAlert size={18} color={theme.colors.attention} style={styles.sectionIcon} />
          <Text style={styles.sectionTitle}>Legislação & Conteúdo Útil</Text>
        </View>

        {statisticsData.articles.map(art => (
          <View key={art.id} style={styles.articleItem}>
            <View style={styles.articleMeta}>
              <Text style={styles.articleCategory}>{art.category}</Text>
              <Text style={styles.articleReadTime}>{art.readTime}</Text>
            </View>
            <Text style={styles.articleTitle}>{art.title}</Text>
            <Text style={styles.articleSummary}>{art.summary}</Text>
          </View>
        ))}
      </View>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 26,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  sectionSubTitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 14,
    lineHeight: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  teamSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    ...theme.shadows.small,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  summaryLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  employeeList: {
    marginTop: 4,
  },
  profCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 14,
    marginBottom: 12,
  },
  profHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  profName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  profSpecialty: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: '600',
    marginTop: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  ratingCount: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginLeft: 2,
  },
  profDesc: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    lineHeight: 15,
    marginBottom: 12,
  },
  connectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    borderRadius: theme.radius.medium,
  },
  btnIcon: {
    marginRight: 6,
  },
  connectBtnText: {
    color: theme.colors.textInverse,
    fontSize: 12,
    fontWeight: '700',
  },
  articleItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 12,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  articleCategory: {
    fontSize: 9,
    fontWeight: 'bold',
    color: theme.colors.secondary,
    textTransform: 'uppercase',
  },
  articleReadTime: {
    fontSize: 9,
    color: theme.colors.textMuted,
  },
  articleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  articleSummary: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    lineHeight: 15,
  },
});
