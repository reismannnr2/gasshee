import React from 'react';
export default function BaseLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="base">
      <Header />
      <main>{children}</main>
      <Footer />
      <style jsx>{`
        .base {
          display: grid;
          grid-template-rows: 1rem 1fr 1rem;
          min-height: 100vh;
        }
        main {
          width: 100%;
          max-width: 1200px;
          padding: 1.5rem 0;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}

function Header() {
  return (
    <header>
      <span>gasshee</span>
      <style jsx>{`
        header {
          font-size: 0.75rem;
          padding: 0.125rem 0.5rem;
          line-height: 1;
          border-bottom: 1px dotted #666;
          font-family: monospace;
        }
        span {
          line-height: 1;
        }
      `}</style>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <span>icons by icon8</span>
      <style jsx>{`
        footer {
          padding: 0 0.5rem;
          font-family: monospace;
          font-size: 0.75rem;
          line-height: 1;

          text-align: right;
        }
      `}</style>
    </footer>
  );
}
