import { create } from 'zustand';

export interface IEntranceStore {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    isDone: boolean;
    setIsDone: (isValue: boolean) => void;
    isFail: boolean;
    setIsFail: (isValue: boolean) => void;
    autoPlayTrigger: number;
    setAutoPlayTrigger: (value: number) => void;
}

const useEntranceStore = create<IEntranceStore>()((set) => ({
    isLoading: true,
    setIsLoading: (loading) => set(() => ({ isLoading: loading })),
    isDone: false,
    setIsDone: (isValue) => set(() => ({ isDone: isValue })),
    isFail: false,
    setIsFail: (isValue) => set(() => ({ isFail: isValue })),
    autoPlayTrigger: 0,
    setAutoPlayTrigger: (value) => set(() => ({ autoPlayTrigger: value })),
}));

export default useEntranceStore;
