import Image from "next/image";
import { ReactNode } from "react";

export const FortuneCookieLoading = ({ children }: { children: ReactNode }) => {
  return (
    <div style={{ textAlign: "center" }}>
      <Image
        src="/woozi-fortune-cookie.gif"
        alt="pepe pajamas dance"
        width={546}
        height={409}
      />
      <h2>{children}</h2>
    </div>
  );
};
