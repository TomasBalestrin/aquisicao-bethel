export type GroupColor = {
  headerBg: string;
  headerText: string;
  cellBg: string;
};

export const GROUP_COLORS: Record<string, GroupColor> = {
  ob1: { headerBg: "#DBEAFE", headerText: "#1E40AF", cellBg: "#EFF6FF" },
  ob2: { headerBg: "#FCE7F3", headerText: "#9D174D", cellBg: "#FDF2F8" },
  ob3: { headerBg: "#D1FAE5", headerText: "#065F46", cellBg: "#ECFDF5" },
  ob4: { headerBg: "#FEF3C7", headerText: "#92400E", cellBg: "#FFFBEB" },
  ob5: { headerBg: "#E0E7FF", headerText: "#3730A3", cellBg: "#EEF2FF" },
  ob6: { headerBg: "#FECDD3", headerText: "#9F1239", cellBg: "#FFF1F2" },
  ob7: { headerBg: "#CCFBF1", headerText: "#115E59", cellBg: "#F0FDFA" },
  ob8: { headerBg: "#FED7AA", headerText: "#9A3412", cellBg: "#FFF7ED" },
  ob9: { headerBg: "#DDD6FE", headerText: "#5B21B6", cellBg: "#F5F3FF" },
  ob10: { headerBg: "#D1D5DB", headerText: "#1F2937", cellBg: "#F3F4F6" },
  upsell: { headerBg: "#BBF7D0", headerText: "#166534", cellBg: "#F0FDF4" },
  downsell: { headerBg: "#FECACA", headerText: "#991B1B", cellBg: "#FEF2F2" },
};

export const CALC_BG = "#EDF2F7";
