import React from 'react';
import dynamic from 'next/dynamic';

function NoSSR_({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

const NoSSR = dynamic(async () => NoSSR_, { ssr: false });

export default NoSSR;
