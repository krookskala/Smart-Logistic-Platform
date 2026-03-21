"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

type ToastType = "success" | "error";

type ToastState = {
  id: number;
  type: ToastType;
  message: string;
} | null;

type ToastContextValue = {
  showToast: (toast: { type: ToastType; message: string }) => void;
  clearToast: () => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

function ToastViewport({ toast }: { toast: ToastState }) {
  if (!toast) {
    return null;
  }

  const accentClass =
    toast.type === "success"
      ? "toast-success"
      : "toast-error";
  const dotClass =
    toast.type === "success" ? "bg-emerald-500" : "bg-rose-500";
  const badgeClass =
    toast.type === "success"
      ? "bg-emerald-100 text-emerald-800"
      : "bg-rose-100 text-rose-800";
  const label = toast.type === "success" ? "Success" : "Action Needed";

  return (
    <div className="toast-viewport">
      <div key={toast.id} className={`toast-card ${accentClass}`}>
        <div className={`toast-accent ${dotClass}`} />
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className={`toast-badge ${badgeClass}`}>{label}</span>
          </div>
          <p className="toast-message mt-3">{toast.message}</p>
        </div>
      </div>
    </div>
  );
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearToast = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setToast(null);
  }, []);

  const showToast = useCallback(
    ({ type, message }: { type: ToastType; message: string }) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setToast({
        id: Date.now(),
        type,
        message
      });

      timeoutRef.current = setTimeout(() => {
        setToast(null);
        timeoutRef.current = null;
      }, 3000);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const value = useMemo(
    () => ({
      showToast,
      clearToast
    }),
    [showToast, clearToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? <ToastViewport toast={toast} /> : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider.");
  }

  return context;
}
