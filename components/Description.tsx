import { type ReactNode } from "react";

export const Description = ({ children }: { children: ReactNode }) => {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        padding: "24px",
        overflowWrap: "break-word",
      }}
    >
      {children}
    </div>
  );
};
