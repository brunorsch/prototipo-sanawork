import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialEmployees } from '../data/mockEmployees';

const STORAGE_KEYS = {
  APP_NAME: '@app_name',
  API_KEY: '@openai_api_key',
  BASE_URL: '@openai_base_url',
  MODEL: '@openai_model',
  IS_MOCK: '@is_mock_ai',
  EMPLOYEES: '@employees',
};

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [appName, setAppName] = useState('SanaWork');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [openaiBaseUrl, setOpenaiBaseUrl] = useState('https://openrouter.ai/api/v1');
  const [openaiModel, setOpenaiModel] = useState('openai/gpt-5.5');
  const [isMockAI, setIsMockAI] = useState(true);
  const [currentProfile, setCurrentProfile] = useState('employer'); // 'employer' ou 'employee'
  
  // Flag para evitar race condition: salvamentos só acontecem após carregar do storage
  const [isLoaded, setIsLoaded] = useState(false);
   
  // Lista de funcionários reativa para o protótipo
  const [employees, setEmployees] = useState(initialEmployees);

  // Funcionário atualmente selecionado no simulador (para a visão do funcionário)
  const [activeEmployeeId, setActiveEmployeeId] = useState(1); // Bruno Silva por padrão

  const activeEmployee = employees.find(emp => emp.id === activeEmployeeId) || employees[0];

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedName = await AsyncStorage.getItem(STORAGE_KEYS.APP_NAME);
        const savedKey = await AsyncStorage.getItem(STORAGE_KEYS.API_KEY);
        const savedUrl = await AsyncStorage.getItem(STORAGE_KEYS.BASE_URL);
        const savedModel = await AsyncStorage.getItem(STORAGE_KEYS.MODEL);
        const savedMock = await AsyncStorage.getItem(STORAGE_KEYS.IS_MOCK);

        if (savedName) setAppName(savedName);
        if (savedKey) setOpenaiApiKey(savedKey);
        if (savedUrl) setOpenaiBaseUrl(savedUrl);
        if (savedModel) setOpenaiModel(savedModel);
        if (savedMock !== null) setIsMockAI(savedMock === 'true');
      } catch (e) {
        console.error('Failed to load settings:', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadSettings();
  }, []);

  useEffect(() => { if (isLoaded) AsyncStorage.setItem(STORAGE_KEYS.APP_NAME, appName); }, [appName, isLoaded]);
  useEffect(() => { if (isLoaded) AsyncStorage.setItem(STORAGE_KEYS.API_KEY, openaiApiKey); }, [openaiApiKey, isLoaded]);
  useEffect(() => { if (isLoaded) AsyncStorage.setItem(STORAGE_KEYS.BASE_URL, openaiBaseUrl); }, [openaiBaseUrl, isLoaded]);
  useEffect(() => { if (isLoaded) AsyncStorage.setItem(STORAGE_KEYS.MODEL, openaiModel); }, [openaiModel, isLoaded]);
  useEffect(() => { if (isLoaded) AsyncStorage.setItem(STORAGE_KEYS.IS_MOCK, String(isMockAI)); }, [isMockAI, isLoaded]);

  // Adicionar um novo registro de saúde para o funcionário ativo
  const addHealthRecord = (status, reportSummary, fullRelato, problemCategory) => {
    setEmployees(prevEmployees => {
      return prevEmployees.map(emp => {
        if (emp.id === activeEmployeeId) {
          // Atualiza status geral do funcionário
          const updatedStatus = status;
          
          // Adiciona ao histórico do funcionário
          const newRecord = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('pt-BR'),
            status: status,
            category: problemCategory || 'Geral',
            summary: reportSummary,
            details: fullRelato,
          };

          return {
            ...emp,
            status: updatedStatus,
            history: [newRecord, ...emp.history],
          };
        }
        return emp;
      });
    });
  };

  return (
    <AppContext.Provider
      value={{
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
        currentProfile,
        setCurrentProfile,
        employees,
        setEmployees,
        activeEmployeeId,
        setActiveEmployeeId,
        activeEmployee,
        addHealthRecord
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
