// src/components/NavigationTransition.tsx
// handles screen transitions and ensures theme background consistency

import { ReactNode } from "react";

interface NavigationTransitionProps {
  children: ReactNode;
  screenKey: string;
  direction?: "up" | "down" | "fade";
}

export function NavigationTransition({
  children,
  screenKey,
  //direction = "fade",
}: NavigationTransitionProps) {
  // transition variants (commented for now, can re-enable once motion/react is ready)
  // const variants = {
  //   up: {
  //     initial: { opacity: 0, y: 20, scale: 0.98 },
  //     animate: {
  //       opacity: 1,
  //       y: 0,
  //       scale: 1,
  //       transition: {
  //         duration: 0.4,
  //         ease: [0.25, 0.46, 0.45, 0.94],
  //       },
  //     },
  //     exit: {
  //       opacity: 0,
  //       y: -10,
  //       scale: 0.98,
  //       transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  //     },
  //   },
  //   fade: {
  //     initial: { opacity: 0 },
  //     animate: { opacity: 1, transition: { duration: 0.35 } },
  //     exit: { opacity: 0, transition: { duration: 0.25 } },
  //   },
  // };

  return (
    <div
      key={screenKey}
      className="w-full min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-card-foreground)",
      }}
    >
      {children}
    </div>
  );
}
