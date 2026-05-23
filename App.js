import React, { useState, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, AppContext } from './src/context/AppContext';
import { theme } from './src/styles/theme';
import { Header } from './src/components/Header';
import SettingsModal from './src/components/SettingsModal';
import { EmployerDashboard } from './src/screens/EmployerDashboard';
import { EmployeeScreening } from './src/screens/EmployeeScreening';

function MainApp() {
  const { currentProfile } = useContext(AppContext);
  const [settingsVisible, setSettingsVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Cabeçalho do App com Switch de Perfil e Atalho de Configurações */}
      <Header onOpenSettings={() => setSettingsVisible(true)} />

      {/* Corpo do App - Rendereização Dinâmica da Visão Empresa ou Funcionário */}
      <View style={styles.body}>
        {currentProfile === 'employer' ? (
          <EmployerDashboard />
        ) : (
          <EmployeeScreening />
        )}
      </View>

      {/* Modal Global de Configurações e Parametrizações (Nome do App, Chaves de IA) */}
      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />

      {/* Barra de Status estilizada em modo escuro */}
      <StatusBar style="light" />
    </View>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  body: {
    flex: 1,
  },
});
