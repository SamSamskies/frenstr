import Image from "next/image";
import { ReactNode } from "react";

export const Loading = ({ children }: { children: ReactNode }) => {
  return (
    <div style={{ textAlign: "center" }}>
      <Image
        src="/pepe-dance.gif"
        alt="pepe pajamas dance"
        width={341}
        height={360}
      />
      <h2>{children}</h2>
    </div>
  );
};
