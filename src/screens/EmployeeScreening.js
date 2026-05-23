import React, { useContext, useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import {
  HeartPulse,
  Mic,
  MicOff,
  Send,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Brain,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react-native';
import { theme } from '../styles/theme';
import { AppContext } from '../context/AppContext';
import { analyzeHealthReport } from '../services/aiService';

export const EmployeeScreening = () => {
  const {
    appName,
    activeEmployee,
    addHealthRecord,
    openaiApiKey,
    openaiBaseUrl,
    openaiModel,
    isMockAI,
  } = useContext(AppContext);

  // Respostas do questionário (escala de 1 a 5)
  const [qPhysical, setQPhysical] = useState(null);
  const [qMental, setQMental] = useState(null);
  const [qErgo, setQErgo] = useState(null);

  // Relato por escrito / áudio
  const [relato, setRelato] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showForm, setShowForm] = useState(true);

  // Relatos pré-definidos para simular o ditado de voz facilmente nas demonstrações (realidade EPP/MPE brasileira)
  const speechMocks = [
    "Tenho me sentido sob muita pressão para bater a meta de vendas da loja este mês. Isso me causa dor de cabeça constante e insônia à noite. Passar o dia todo em pé atendendo clientes no salão também está me esgotando fisicamente.",
    "Sinto um desconforto chato na lombar no fim do expediente. Carregar e descarregar as caixas pesadas de mercadoria no estoque e organizar as prateleiras sem pausas tem forçado bastante minhas costas.",
    "Tudo sob controle esta semana! Fiz pequenas pausas de alongamento no caixa, a escala de folgas funcionou bem e me senti bastante disposta e produtiva, sem dores."
  ];

  const scrollRef = useRef(null);

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => {
      scrollRef.current?.scrollToEnd?.({ animated: true });
    });
    return () => keyboardShowListener.remove();
  }, []);

  const resetForm = () => {
    setQPhysical(null);
    setQMental(null);
    setQErgo(null);
    setRelato('');
    setAnalysisResult(null);
    setShowForm(true);
  };

  // Simula a escuta do microfone
  const handleMicPress = () => {
    if (isRecording) return;
    
    setIsRecording(true);
    // Simula 2 segundos de captação e preenche com um relato de exemplo realista aleatório
    setTimeout(() => {
      const randomMock = speechMocks[Math.floor(Math.random() * speechMocks.length)];
      setRelato(randomMock);
      setIsRecording(false);
    }, 2000);
  };

  // Processar e enviar para a IA
  const handleSubmit = async () => {
    if (!qPhysical || !qMental || !qErgo) {
      Alert.alert("Atenção", "Por favor, responda às 3 perguntas rápidas do questionário primeiro.");
      return;
    }
    if (!relato.trim()) {
      Alert.alert("Atenção", "Por favor, escreva ou dize o seu relato semanal antes de enviar.");
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);
    setShowForm(false);

    try {
      // Configuração para envio da IA
      const config = { appName, isMockAI, openaiApiKey, openaiBaseUrl, openaiModel };
      
      // Chamada do serviço de IA
      const result = await analyzeHealthReport(relato, config);

      // Adiciona o resultado gerado à lista reativa no Contexto do app
      addHealthRecord(result.status, result.summary, relato, result.category);

      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Não foi possível concluir a análise de IA.");
    } finally {
      setIsLoading(false);
    }
  };

  // Retorna a cor correspondente ao status da análise
  const getStatusColor = (status) => {
    switch (status) {
      case 'Saudável': return theme.colors.healthy;
      case 'Atenção': return theme.colors.attention;
      case 'Folga Saúde': return theme.colors.leave;
      default: return theme.colors.textSecondary;
    }
  };

  // Recomendações personalizadas
  const renderRecommendations = (status) => {
    if (status === 'Folga Saúde') {
      return (
        <View style={styles.recommendationBox}>
          <Text style={styles.recTitle}>⚠️ Protocolo de Folga Saúde Indicada</Text>
          <Text style={styles.recDesc}>
            {`Seu nível de estresse ou fadiga está alto. O ${appName} sugere o uso de uma **Folga Saúde** (1-2 dias úteis de descanso preventivo).`}
          </Text>
          <View style={styles.recSteps}>
            <Text style={styles.stepText}>1. O relatório seguro e anônimo já foi enviado ao seu gestor.</Text>
            <Text style={styles.stepText}>2. Combine com sua equipe a cobertura de urgências.</Text>
            <Text style={styles.stepText}>3. Aproveite o dia totalmente offline para recarregar as energias.</Text>
          </View>
          <Text style={styles.recActionTitle}>Profissionais Indicados (Agendamento rápido):</Text>
          <View style={styles.profListRow}>
            <TouchableOpacity style={styles.actionPill} onPress={() => alert('Simulando consulta com Psicólogo.')}>
              <Text style={styles.actionPillText}>Agendar Psicólogo (Gratuito via Convênio)</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (status === 'Atenção') {
      return (
        <View style={styles.recommendationBox}>
          <Text style={styles.recTitle}>💡 Recomendações Preventivas</Text>
          <Text style={styles.recDesc}>
            Identificamos pontos de atenção ergonômica ou desgaste mental leve. Pequenas ações previnem problemas crônicos.
          </Text>
          <View style={styles.recSteps}>
            <Text style={styles.stepText}>• Faça alongamentos de 5 minutos a cada 2 horas de digitação.</Text>
            <Text style={styles.stepText}>• Beba pelo menos 2 litros de água e descanse a vista da tela regularmente.</Text>
            <Text style={styles.stepText}>• Considere agendar um bate-papo de 15 minutos com nosso Fisioterapeuta Parceiro.</Text>
          </View>
          <View style={styles.profListRow}>
            <TouchableOpacity style={[styles.actionPill, { backgroundColor: theme.colors.secondary }]} onPress={() => alert('Simulando consulta com Fisioterapeuta ergonômico.')}>
              <Text style={styles.actionPillText}>Agendar Fisioterapeuta/Ergonomista</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.recommendationBox}>
          <Text style={styles.recTitle}>🎉 Excelente!</Text>
          <Text style={styles.recDesc}>
            Seu estado geral está ótimo. Continue priorizando o equilíbrio e as pausas ativas na sua jornada diária.
          </Text>
        </View>
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
      
      {/* Mensagem de Boas-Vindas */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeSub}>Autoavaliação Semanal</Text>
        <Text style={styles.welcomeName}>Olá, {activeEmployee.name}!</Text>
        <Text style={styles.welcomeHelper}>
          Seus relatos ajudam a empresa a equilibrar as demandas de trabalho, mantendo seus dados detalhados 100% seguros e anônimos.
        </Text>
      </View>

      {showForm && (
      <>
      {/* 1. QUESTIONÁRIO RÁPIDO */}
      <View style={styles.sectionCard}>
        <View style={styles.cardHeaderRow}>
          <Calendar size={18} color={theme.colors.primary} style={styles.cardHeaderIcon} />
          <Text style={styles.cardHeaderTitle}>Painel de Triagem Rápida</Text>
        </View>

        {/* Questão 1 */}
        <View style={styles.questionBlock}>
          <Text style={styles.questionText}>1. Como se sente fisicamente esta semana?</Text>
          <View style={styles.emojiRow}>
            {[
              { val: 1, em: '😞' },
              { val: 2, em: '😟' },
              { val: 3, em: '😐' },
              { val: 4, em: '🙂' },
              { val: 5, em: '😁' }
            ].map(item => (
              <TouchableOpacity
                key={item.val}
                onPress={() => setQPhysical(item.val)}
                style={[styles.emojiBtn, qPhysical === item.val && styles.emojiBtnActive]}
              >
                <Text style={styles.emojiText}>{item.em}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Questão 2 */}
        <View style={styles.questionBlock}>
          <Text style={styles.questionText}>2. Como se sente mentalmente/emocionalmente?</Text>
          <View style={styles.emojiRow}>
            {[
              { val: 1, em: '🤯' },
              { val: 2, em: '😩' },
              { val: 3, em: '😐' },
              { val: 4, em: '🙂' },
              { val: 5, em: '🧘' }
            ].map(item => (
              <TouchableOpacity
                key={item.val}
                onPress={() => setQMental(item.val)}
                style={[styles.emojiBtn, qMental === item.val && styles.emojiBtnActive]}
              >
                <Text style={styles.emojiText}>{item.em}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Questão 3 */}
        <View style={styles.questionBlock}>
          <Text style={styles.questionText}>3. Sua cadeira/mesa causou dores esta semana?</Text>
          <View style={styles.binaryRow}>
            {[
              { val: 1, label: 'Sim, muitas' },
              { val: 3, label: 'Leves dores' },
              { val: 5, label: 'Não, confortável' }
            ].map(item => (
              <TouchableOpacity
                key={item.val}
                onPress={() => setQErgo(item.val)}
                style={[styles.binaryBtn, qErgo === item.val && styles.binaryBtnActive]}
              >
                <Text style={[styles.binaryBtnText, qErgo === item.val && styles.binaryBtnTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* 2. RELATO DE VOZ (DIFERENCIAL DA STARTUP) */}
      <View style={styles.sectionCard}>
        <View style={styles.cardHeaderRow}>
          <Sparkles size={18} color={theme.colors.primary} style={styles.cardHeaderIcon} />
          <Text style={styles.cardHeaderTitle}>Como foi seu trabalho esta semana?</Text>
        </View>
        <Text style={styles.cardHelperText}>
          Use o botão do microfone para ditar ou digite no campo abaixo detalhes de cansaço, dores ou sobrecarga.
        </Text>

        <View style={styles.relatoInputContainer}>
          <TextInput
            style={styles.textInput}
            multiline={true}
            numberOfLines={4}
            value={relato}
            onChangeText={setRelato}
            placeholder="Ex: Tenho me sentido cansado por causa dos prazos apertados e a cadeira do escritório me deu um pouco de dor nas costas..."
            placeholderTextColor={theme.colors.textMuted}
          />

          <View style={styles.inputActionsRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleMicPress}
              style={[styles.micBtn, isRecording && styles.micBtnRecording]}
            >
              {isRecording ? (
                <View style={styles.recordingRow}>
                  <Clock size={16} color={theme.colors.textInverse} style={styles.recordingIcon} />
                  <Text style={styles.micBtnText}>Ouvindo... (2s)</Text>
                </View>
              ) : (
                <View style={styles.recordingRow}>
                  <Mic size={16} color={theme.colors.textInverse} style={styles.recordingIcon} />
                  <Text style={styles.micBtnText}>Ditar Relato (Simulador)</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSubmit}
              disabled={isLoading}
              style={styles.submitBtn}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={theme.colors.textInverse} />
              ) : (
                <View style={styles.submitInner}>
                  <Send size={14} color={theme.colors.textInverse} style={styles.submitIcon} />
                  <Text style={styles.submitBtnText}>Analisar Relato</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </>
      )}

      {/* 3. RESULTADO DA ANÁLISE DE IA */}
      {isLoading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>{`Triagem ${appName} analisando relato ocupacional...`}</Text>
          <Text style={styles.loadingSub}>Anonimizando dados sensíveis e estruturando relatório seguro...</Text>
        </View>
      )}

      {analysisResult && !isLoading && (
        <View style={[styles.resultCard, { borderColor: getStatusColor(analysisResult.status) }]}>
          <View style={styles.resultHeader}>
            <ShieldCheck size={20} color={theme.colors.primary} style={styles.resultHeaderIcon} />
            <Text style={styles.resultHeaderTitle}>Triagem Finalizada por IA</Text>
          </View>

          {/* Qualificação do Status */}
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Qualificação do Estado:</Text>
            <View style={[styles.statusTag, { backgroundColor: getStatusColor(analysisResult.status) }]}>
              <Text style={styles.statusTagText}>{analysisResult.status}</Text>
            </View>
          </View>

          {/* Categoria */}
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Categoria Identificada:</Text>
            <Text style={styles.categoryName}>{analysisResult.category}</Text>
          </View>

          {/* Relatório Seguro Enviado ao Gestor */}
          <View style={styles.aiReportBox}>
            <Text style={styles.aiReportTitle}>Relatório Seguro (Enviado para a Empresa):</Text>
            <Text style={styles.aiReportText}>{analysisResult.summary}</Text>
            <View style={styles.privacyGuarantee}>
              <Info size={12} color={theme.colors.primary} style={styles.privIcon} />
              <Text style={styles.privacyGuaranteeText}>
                {`Garantia ${appName}: Detalhes confidenciais foram omitidos para sua total segurança jurídica e pessoal.`}
              </Text>
            </View>
          </View>

          {/* Recomendações e Plano de Ação */}
          {renderRecommendations(analysisResult.status)}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={resetForm}
            style={styles.newAnalysisBtn}
          >
            <Text style={styles.newAnalysisBtnText}>Nova Avaliação Semanal</Text>
          </TouchableOpacity>
        </View>
      )}

    </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  welcomeSub: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  welcomeName: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginTop: 4,
  },
  welcomeHelper: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 16,
    marginTop: 6,
  },
  sectionCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    marginBottom: 16,
    ...theme.shadows.small,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderIcon: {
    marginRight: 8,
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardHelperText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 16,
    marginBottom: 14,
  },
  questionBlock: {
    marginBottom: 16,
  },
  questionText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emojiBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginHorizontal: 4,
  },
  emojiBtnActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: theme.colors.primary,
  },
  emojiText: {
    fontSize: 22,
  },
  binaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  binaryBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginHorizontal: 4,
  },
  binaryBtnActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: theme.colors.primary,
  },
  binaryBtnText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  binaryBtnTextActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  relatoInputContainer: {
    marginTop: 4,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.medium,
    padding: 12,
    color: theme.colors.textPrimary,
    fontSize: 14,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  inputActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  micBtn: {
    flex: 1,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius.medium,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  micBtnRecording: {
    backgroundColor: theme.colors.leave,
  },
  recordingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingIcon: {
    marginRight: 6,
  },
  micBtnText: {
    color: theme.colors.textInverse,
    fontSize: 11,
    fontWeight: '700',
  },
  submitBtn: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.medium,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitIcon: {
    marginRight: 6,
  },
  submitBtnText: {
    color: theme.colors.textInverse,
    fontSize: 11,
    fontWeight: '700',
  },
  loadingBox: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    ...theme.shadows.medium,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: 12,
  },
  loadingSub: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.medium,
    borderWidth: 2,
    padding: 16,
    marginBottom: 20,
    ...theme.shadows.medium,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  resultHeaderIcon: {
    marginRight: 8,
  },
  resultHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    textTransform: 'uppercase',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginRight: 8,
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.small,
  },
  statusTagText: {
    color: theme.colors.textInverse,
    fontSize: 12,
    fontWeight: '800',
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  aiReportBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
    marginVertical: 10,
  },
  aiReportTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  aiReportText: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    lineHeight: 18,
  },
  privacyGuarantee: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    borderTopWidth: 1,
    borderColor: theme.colors.border,
    paddingTop: 8,
  },
  privIcon: {
    marginRight: 6,
  },
  privacyGuaranteeText: {
    flex: 1,
    fontSize: 9,
    color: theme.colors.textMuted,
    lineHeight: 12,
  },
  recommendationBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    borderRadius: theme.radius.medium,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  recTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  recDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 16,
    marginBottom: 10,
  },
  recSteps: {
    marginBottom: 12,
  },
  stepText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    lineHeight: 15,
    marginBottom: 4,
  },
  recActionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  profListRow: {
    flexDirection: 'row',
  },
  actionPill: {
    backgroundColor: theme.colors.leave,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.small,
  },
  actionPillText: {
    color: theme.colors.textInverse,
    fontSize: 11,
    fontWeight: '700',
  },
  newAnalysisBtn: {
    marginTop: 16,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.medium,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newAnalysisBtnText: {
    color: theme.colors.textInverse,
    fontSize: 14,
    fontWeight: '700',
  },
});
