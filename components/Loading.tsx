import Image from "next/image";

export const Loading = () => {
  return (
    <div style={{ textAlign: "center" }}>
      <Image
        src="/pepe-dance.gif"
        alt="pepe pajamas dance"
        width={341}
        height={360}
      />
      <h2>Loading...</h2>
    </div>
  );
};
