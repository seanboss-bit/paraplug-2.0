"use client";

import React, {
  createContext,
  useContext,
  useTransition,
  useState,
  ReactNode,
  MouseEvent,
  useEffect,
} from "react";
import Link, { LinkProps } from "next/link";
import Loader from "@/components/Loader";

// -----------------------------
// Context Types
// -----------------------------

interface LoadingContextType {
  startLoading: () => void;
  stopLoading: () => void;
  setInitialLoading: (isLoading: boolean) => void;
  LoadingLink: React.FC<LoadingLinkProps>;
}

interface LoadingLinkProps extends LinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

// -----------------------------
// Context Setup
// -----------------------------

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [isPending, startTransition] = useTransition();
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const startLoading = () => {
    startTransition(() => {});
  };

  const stopLoading = () => {
    // No-op: isPending resets automatically
  };

  const setInitialLoading = (isLoading: boolean) => {
    setIsInitialLoading(isLoading);
  };

  const LoadingLink: React.FC<LoadingLinkProps> = ({
    href,
    children,
    className,
    ...props
  }) => {
    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      if (!e.defaultPrevented) {
        startTransition(() => {});
      }
    };

    return (
      <Link href={href} className={className} onClick={handleClick} {...props}>
        {children}
      </Link>
    );
  };

  return (
    <LoadingContext.Provider
      value={{ startLoading, stopLoading, setInitialLoading, LoadingLink }}
    >
      {(isPending || isInitialLoading) && <Loader />}
      {children}
    </LoadingContext.Provider>
  );
};

// -----------------------------
// Hook
// -----------------------------

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
