import { createContext, useContext, useState } from "react";
export const Menu = createContext(true);

export default function MenuContext({ children }) {
  const [isopen, setIsopen] = useState(true);

  return (
    <Menu.Provider value={{ isopen, setIsopen }}> {children}</Menu.Provider>
  );
}
