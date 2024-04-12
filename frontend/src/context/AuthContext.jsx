import { createContext, useContext } from 'react';

const AuthContext = createContext();
export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  
    return (
      <AuthContext.Provider value={{access}}>
        {children}
      </AuthContext.Provider>
    );
};