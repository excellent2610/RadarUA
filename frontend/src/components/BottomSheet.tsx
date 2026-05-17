import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { PropsWithChildren } from "react";
import { useTranslation } from "../i18n";

interface BottomSheetProps extends PropsWithChildren {
  onClose: () => void;
}

export function BottomSheet({ children, onClose }: BottomSheetProps) {
  const { t } = useTranslation();
  return (
    <motion.aside
      className="fixed inset-x-0 bottom-0 z-[700] mx-auto max-w-2xl p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      initial={{ y: 360, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 360, opacity: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
    >
      <div className="hud-panel relative">
        <button className="hud-icon-btn absolute right-3 top-3" onClick={onClose} aria-label={t("actions.closeDetails")}>
          <X size={17} />
        </button>
        {children}
      </div>
    </motion.aside>
  );
}
