export const theme = {
  colors: {
    background: '#0D111D',     // Dark deep blue background
    cardBg: '#161B2B',         // Cards
    cardBgElevated: '#1F253C', // Elevated interactive cards
    border: '#252D42',         // Subtle separators
    borderActive: '#10B981',   // Focus state border
    
    // Core brand colors
    primary: '#10B981',        // Mint Emerald
    primaryDark: '#059669',
    secondary: '#3B82F6',      // Electric Blue
    secondaryDark: '#2563EB',
    
    // Health status colors
    healthy: '#10B981',        // Green
    attention: '#FBBF24',      // Yellow/Amber
    leave: '#EF4444',          // Red
    
    // Text colors
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textInverse: '#0D111D',
    
    // Gradients
    gradients: {
      primary: ['#10B981', '#059669'],
      secondary: ['#3B82F6', '#1D4ED8'],
      danger: ['#EF4444', '#B91C1C'],
      warning: ['#FBBF24', '#D97706'],
      card: ['#161B2B', '#111522'],
      glass: ['rgba(30, 41, 59, 0.7)', 'rgba(15, 23, 42, 0.8)'],
    }
  },
  
  shadows: {
    small: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    large: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 8,
    }
  },
  
  radius: {
    small: 6,
    medium: 12,
    large: 20,
    round: 9999
  }
};
