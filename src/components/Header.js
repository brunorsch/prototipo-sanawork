import React, { useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Settings, Users, User, ShieldAlert } from 'lucide-react-native';
import { theme } from '../styles/theme';
import { AppContext } from '../context/AppContext';

export const Header = ({ onOpenSettings }) => {
  const {
    appName,
    currentProfile,
    setCurrentProfile,
    isMockAI,
    employees,
    activeEmployeeId,
    setActiveEmployeeId
  } = useContext(AppContext);

  return (
    <View style={styles.container}>
      {/* Nome da Marca e Ícone Configurações */}
      <View style={styles.topRow}>
        <View style={styles.brandContainer}>
          <ShieldAlert size={22} color={theme.colors.primary} style={styles.brandIcon} />
          <Text style={styles.brandText}>{appName}</Text>
          {isMockAI && (
            <View style={styles.mockBadge}>
              <Text style={styles.mockBadgeText}>MOCK IA</Text>
            </View>
          )}
        </View>

        <TouchableOpacity onPress={onOpenSettings} style={styles.settingsBtn} activeOpacity={0.7}>
          <Settings size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Switch de Perfil (Empresa vs. Funcionário) */}
      <View style={styles.profileSwitcherContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setCurrentProfile('employer')}
          style={[
            styles.switcherTab,
            currentProfile === 'employer' && styles.switcherTabActive
          ]}
        >
          <Users size={16} color={currentProfile === 'employer' ? theme.colors.textInverse : theme.colors.textSecondary} style={styles.tabIcon} />
          <Text style={[styles.switcherText, currentProfile === 'employer' && styles.switcherTextActive]}>
            Visão Empresa
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setCurrentProfile('employee')}
          style={[
            styles.switcherTab,
            currentProfile === 'employee' && styles.switcherTabActive
          ]}
        >
          <User size={16} color={currentProfile === 'employee' ? theme.colors.textInverse : theme.colors.textSecondary} style={styles.tabIcon} />
          <Text style={[styles.switcherText, currentProfile === 'employee' && styles.switcherTextActive]}>
            Visão Funcionário
          </Text>
        </TouchableOpacity>
      </View>

      {/* Se estiver no perfil de Funcionário, mostra um selecionador rápido de qual funcionário está testando */}
      {currentProfile === 'employee' && (
        <View style={styles.employeeSelectorBar}>
          <Text style={styles.selectorLabel}>Simular Funcionário:</Text>
          <View style={styles.selectorButtonsRow}>
            {employees.map(emp => (
              <TouchableOpacity
                key={emp.id}
                onPress={() => setActiveEmployeeId(emp.id)}
                style={[
                  styles.empSelectorItem,
                  activeEmployeeId === emp.id && styles.empSelectorItemActive
                ]}
              >
                <Text
                  style={[
                    styles.empSelectorText,
                    activeEmployeeId === emp.id && styles.empSelectorTextActive
                  ]}
                >
                  {emp.name.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.cardBg,
    paddingTop: 50, // Ajuste para status bar no celular
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandIcon: {
    marginRight: 8,
  },
  brandText: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    letterSpacing: 0.5,
  },
  mockBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: theme.radius.small,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  mockBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  settingsBtn: {
    padding: 8,
    borderRadius: theme.radius.medium,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  profileSwitcherContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: theme.radius.medium,
    padding: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  switcherTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: theme.radius.medium - 2,
  },
  switcherTabActive: {
    backgroundColor: theme.colors.primary,
  },
  tabIcon: {
    marginRight: 6,
  },
  switcherText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  switcherTextActive: {
    color: theme.colors.textInverse,
    fontWeight: '700',
  },
  employeeSelectorBar: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    padding: 6,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.02)',
  },
  selectorLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginRight: 8,
    fontWeight: '600',
  },
  selectorButtonsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  empSelectorItem: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: theme.radius.small,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  empSelectorItemActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1,
    borderColor: theme.colors.secondary,
  },
  empSelectorText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  empSelectorTextActive: {
    color: theme.colors.secondary,
    fontWeight: 'bold',
  },
});
