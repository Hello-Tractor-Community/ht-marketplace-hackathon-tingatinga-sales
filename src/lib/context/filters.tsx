import React, { createContext, ReactNode, useContext, useState } from "react";

interface FilterContextType {
  clear: boolean;
  setClear: React.Dispatch<React.SetStateAction<boolean>>;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [clear, setClear] = useState(false);

  return (
    <FilterContext.Provider
      value={{
        clear,
        setClear,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

// Custom hook to access filter context
export const useFilterContext = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilterContext must be used within a FilterProvider");
  }
  return context;
};
