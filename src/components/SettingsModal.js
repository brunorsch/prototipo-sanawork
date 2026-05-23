import React, { useContext, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, Settings, Key, Globe, Cpu, Info, Check } from 'lucide-react-native';
import { theme } from '../styles/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../context/AppContext';

export const SettingsModal = ({ visible, onClose }) => {
  const {
    appName,
    setAppName,
    openaiApiKey,
    setOpenaiApiKey,
    openaiBaseUrl,
    setOpenaiBaseUrl,
    openaiModel,
    setOpenaiModel,
    isMockAI,
    setIsMockAI,
  } = useContext(AppContext);

  // Estados locais para edição rápida (só salva ao clicar em Salvar)
  const [localName, setLocalName] = useState(appName);
  const [localApiKey, setLocalApiKey] = useState(openaiApiKey);
  const [localBaseUrl, setLocalBaseUrl] = useState(openaiBaseUrl);
  const [localModel, setLocalModel] = useState(openaiModel);
  const [localIsMock, setLocalIsMock] = useState(isMockAI);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = () => {
    setAppName(localName || 'SanaWork');
    setOpenaiApiKey(localApiKey);
    setOpenaiBaseUrl(localBaseUrl || 'https://api.openai.com/v1');
    setOpenaiModel(localModel || 'gpt-4o-mini');
    setIsMockAI(localIsMock);
    
    // Mostra feedback visual
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 800);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleContainer}>
              <Settings size={20} color={theme.colors.primary} style={styles.headerIcon} />
              <Text style={styles.modalTitle}>Configurações</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <ScrollView contentContainerStyle={styles.formContainer}>
            {/* Nome do Aplicativo */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome do Projeto (Marca)</Text>
              <TextInput
                style={styles.textInput}
                value={localName}
                onChangeText={setLocalName}
                placeholder="Ex: SanaWork, PulseSana"
                placeholderTextColor={theme.colors.textMuted}
              />
              <Text style={styles.inputHelper}>
                Isso alterará o título do aplicativo dinamicamente na interface.
              </Text>
            </View>

            <View style={styles.divider} />

            {/* Toggle Simulador / IA Real */}
            <View style={styles.toggleGroup}>
              <View style={styles.toggleTextContainer}>
                <Text style={styles.toggleLabel}>Usar IA Simulada (Local)</Text>
                <Text style={styles.toggleHelper}>
                  Ative para testar offline com respostas pré-programadas ultra-rápidas. Desative para conectar a uma API real.
                </Text>
              </View>
              <Switch
                value={localIsMock}
                onValueChange={setLocalIsMock}
                trackColor={{ false: theme.colors.border, true: theme.colors.primaryDark }}
                thumbColor={localIsMock ? theme.colors.primary : theme.colors.textSecondary}
              />
            </View>

            {!localIsMock && (
              <View style={styles.apiFieldsContainer}>
                <View style={styles.warningContainer}>
                  <Info size={16} color={theme.colors.attention} style={styles.warningIcon} />
                  <Text style={styles.warningText}>
                    Atenção: A API requer conexão com a internet e pode consumir créditos do seu provedor.
                  </Text>
                </View>

                {/* API Key */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelWithIcon}>
                    <Key size={14} color={theme.colors.textSecondary} style={styles.inlineIcon} />
                    <Text style={styles.inputLabel}>Chave de API (OpenAI-compatible)</Text>
                  </View>
                  <TextInput
                    style={styles.textInput}
                    value={localApiKey}
                    onChangeText={setLocalApiKey}
                    placeholder="sk-..."
                    secureTextEntry={true}
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>

                {/* Base URL */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelWithIcon}>
                    <Globe size={14} color={theme.colors.textSecondary} style={styles.inlineIcon} />
                    <Text style={styles.inputLabel}>URL Base da API</Text>
                  </View>
                  <TextInput
                    style={styles.textInput}
                    value={localBaseUrl}
                    onChangeText={setLocalBaseUrl}
                    placeholder="https://api.openai.com/v1"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                  <Text style={styles.inputHelper}>
                    Mude para conectar a serviços como OpenRouter, Groq ou LM Studio local.
                  </Text>
                </View>

                {/* Model */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelWithIcon}>
                    <Cpu size={14} color={theme.colors.textSecondary} style={styles.inlineIcon} />
                    <Text style={styles.inputLabel}>Nome do Modelo (Model)</Text>
                  </View>
                  <TextInput
                    style={styles.textInput}
                    value={localModel}
                    onChangeText={setLocalModel}
                    placeholder="gpt-4o-mini"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                </View>
              </View>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.footerButtons}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSave} style={styles.saveButtonContainer}>
              <LinearGradient
                colors={theme.colors.gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveGradient}
              >
                {showSavedToast ? (
                  <View style={styles.savedContent}>
                    <Check size={16} color={theme.colors.textInverse} style={styles.toastIcon} />
                    <Text style={styles.saveButtonText}>Salvo!</Text>
                  </View>
                ) : (
                  <Text style={styles.saveButtonText}>Salvar</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default SettingsModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 16, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: theme.colors.cardBg,
    borderTopLeftRadius: theme.radius.large,
    borderTopRightRadius: theme.radius.large,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  closeButton: {
    padding: 4,
    borderRadius: theme.radius.small,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  formContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inlineIcon: {
    marginRight: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.medium,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: theme.colors.textPrimary,
    fontSize: 15,
  },
  inputHelper: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 6,
    lineHeight: 14,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 15,
  },
  toggleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  toggleTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  toggleHelper: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  apiFieldsContainer: {
    marginTop: 10,
  },
  warningContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderRadius: theme.radius.medium,
    padding: 12,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.2)',
  },
  warningIcon: {
    marginRight: 10,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.attention,
    lineHeight: 16,
  },
  footerButtons: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: 'rgba(22, 27, 43, 0.95)',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.medium,
    marginRight: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  saveButtonContainer: {
    flex: 2,
    borderRadius: theme.radius.medium,
    overflow: 'hidden',
  },
  saveGradient: {
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: theme.colors.textInverse,
    fontSize: 15,
    fontWeight: '700',
  },
  savedContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toastIcon: {
    marginRight: 6,
  },
});
