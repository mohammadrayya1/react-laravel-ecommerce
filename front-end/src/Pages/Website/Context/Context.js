import React, { createContext, useContext, useState } from "react";

export const GlobalVarContext = createContext();

// إنشاء مزود الكونتكست
export default function GlobalVarProvider({ children }) {
  const [globalVar, setGlobalVar] = useState(0);

  return (
    <GlobalVarContext.Provider value={{ globalVar, setGlobalVar }}>
      {children}
    </GlobalVarContext.Provider>
  );
}
