import React from 'react';

type AnyProps = Record<string, any>;

function createElement(tag: string) {
  const Component = (props: AnyProps, ref: any) => {
    const { children, ...rest } = props || {};
    return React.createElement(tag, { ref, ...rest }, children);
  };
  return React.forwardRef(Component) as any;
}

const handler: ProxyHandler<any> = {
  get(_, prop: string) {
    // return a component for any tag name (div, button, img, etc.)
    return createElement(prop);
  },
};

// motion.<tag> will render a plain element with the same props (no animation)
export const motion = new Proxy({}, handler) as any;

// AnimatePresence just renders children immediately
export const AnimatePresence: React.FC<any> = ({ children }) => {
  return <>{children}</>;
};

// Reorder and other exports used in the codebase — provide minimal shims
export const Reorder = {
  Group: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  Item: createElement('div'),
};

export default motion;
