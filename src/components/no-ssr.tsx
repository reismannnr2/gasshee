import dynamic from 'next/dynamic';
import React from 'react';

function NoSSR_({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

const NoSSR = dynamic(async () => NoSSR_, { ssr: false });

export default NoSSR;
