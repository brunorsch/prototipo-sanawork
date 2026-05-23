import React, { createContext, useState, useEffect } from 'react';
import { initialEmployees } from '../data/mockEmployees';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [appName, setAppName] = useState('SanaWork');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [openaiBaseUrl, setOpenaiBaseUrl] = useState('https://openrouter.ai/api/v1');
  const [openaiModel, setOpenaiModel] = useState('openai/gpt-5.5');
  const [isMockAI, setIsMockAI] = useState(true);
  const [currentProfile, setCurrentProfile] = useState('employer'); // 'employer' ou 'employee'
  
  // Lista de funcionários reativa para o protótipo
  const [employees, setEmployees] = useState(initialEmployees);

  // Funcionário atualmente selecionado no simulador (para a visão do funcionário)
  const [activeEmployeeId, setActiveEmployeeId] = useState(1); // Bruno Silva por padrão

  const activeEmployee = employees.find(emp => emp.id === activeEmployeeId) || employees[0];

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
