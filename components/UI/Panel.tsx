import type { ReactNode } from "react";

type PanelProps = {
  title: string;
  children: ReactNode;
};

export default function Panel({ title, children }: PanelProps) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {children}
    </section>
  );
}