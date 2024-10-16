import { useEffect, useState } from "react";

export default function useLocalStorageState<T>(key: string, initialValue: T) {
  // Initialize the state from localStorage if it exists, or use the initial value
  const [state, setState] = useState<T>(() => {
    const savedValue = localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : initialValue;
  });

  // Use useEffect to store the state in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
}
