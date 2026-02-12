import { createContext, useContext, useState, ReactNode } from 'react';

interface PreselectionData {
  volumeId: string | null;
  chapterId: string | null;
  topicId: string | null;
}

interface PreselectionContextType {
  preselectionData: PreselectionData;
  setPreselectionData: (data: PreselectionData) => void;
  clearPreselectionData: () => void;
}

const PreselectionContext = createContext<PreselectionContextType | undefined>(undefined);

export function PreselectionProvider({ children }: { children: ReactNode }) {
  const [preselectionData, setPreselectionData] = useState<PreselectionData>({
    volumeId: null,
    chapterId: null,
    topicId: null,
  });

  const clearPreselectionData = () => {
    setPreselectionData({
      volumeId: null,
      chapterId: null,
      topicId: null,
    });
  };

  return (
    <PreselectionContext.Provider value={{ preselectionData, setPreselectionData, clearPreselectionData }}>
      {children}
    </PreselectionContext.Provider>
  );
}

export function usePreselection() {
  const context = useContext(PreselectionContext);
  if (!context) {
    throw new Error('usePreselection must be used within PreselectionProvider');
  }
  return context;
}
