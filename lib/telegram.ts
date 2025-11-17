"use client";

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        enableClosingConfirmation: () => void;
        disableClosingConfirmation: () => void;
        close: () => void;
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor: string;
        backgroundColor: string;
        isClosingConfirmationEnabled: boolean;
        platform: string;
        colorScheme: "light" | "dark";
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
        version: string;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          isProgressVisible: boolean;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          showProgress: (leaveActive: boolean) => void;
          hideProgress: () => void;
        };
        BackButton: {
          isVisible: boolean;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
        };
        HapticFeedback: {
          impactOccurred: (
            style: "light" | "medium" | "heavy" | "rigid" | "soft"
          ) => void;
          notificationOccurred: (type: "error" | "success" | "warning") => void;
          selectionChanged: () => void;
        };
      };
    };
  }
}

export const initTelegramWebApp = () => {
  if (typeof window === "undefined") return null;

  const tg = window.Telegram?.WebApp;

  if (tg) {
    // Initialize Telegram WebApp
    tg.ready();
    tg.expand();

    // Set theme colors
    tg.headerColor = "#000000";
    tg.backgroundColor = "#000000";

    console.log("Telegram WebApp initialized", {
      platform: tg.platform,
      version: tg.version,
      colorScheme: tg.colorScheme,
    });
  }

  return tg;
};

export const useTelegramHaptic = () => {
  const tg = typeof window !== "undefined" ? window.Telegram?.WebApp : null;

  return {
    impact: (
      style: "light" | "medium" | "heavy" | "rigid" | "soft" = "medium"
    ) => {
      tg?.HapticFeedback?.impactOccurred(style);
    },
    notification: (type: "error" | "success" | "warning") => {
      tg?.HapticFeedback?.notificationOccurred(type);
    },
    selection: () => {
      tg?.HapticFeedback?.selectionChanged();
    },
  };
};

export const getTelegramUser = () => {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp?.initDataUnsafe?.user || null;
};

export const isTelegramWebApp = () => {
  if (typeof window === "undefined") return false;
  return !!window.Telegram?.WebApp;
};
