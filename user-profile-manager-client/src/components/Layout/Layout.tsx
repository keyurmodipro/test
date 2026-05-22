interface LayoutProps {
  children: React.ReactNode;
}

/**
 * App shell with branded header and main content area
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-surface border-b border-border backdrop-blur-[20px] sticky top-0 z-[100]">
        <div className="max-w-[1200px] mx-auto px-6 h-[72px] flex items-center justify-between max-md:h-[60px] max-md:px-4">
          {/* Brand */}
          <div className="flex items-center gap-3.5">
            <div className="w-[42px] h-[42px] bg-gradient-to-br from-accent to-[#06b6d4] rounded-xl flex items-center justify-center shadow-[0_4px_16px_var(--color-accent-glow)]">
              <svg className="w-[22px] h-[22px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <div className="text-[1.25rem] font-bold text-text-primary tracking-[-0.02em] max-md:text-[1.05rem]">
                User Profile Manager
              </div>
              <div className="text-[0.8rem] text-text-muted font-normal max-md:hidden">
                Admin Dashboard
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[rgba(20,184,166,0.1)] border border-[rgba(20,184,166,0.2)] rounded-[20px] text-accent text-[0.78rem] font-semibold">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-[pulse-dot_2s_ease-in-out_infinite]" />
            System Online
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1200px] mx-auto px-6 pt-10 pb-[60px] w-full max-md:px-4 max-md:pt-6 max-md:pb-10">
        {children}
      </main>
    </div>
  );
};

export default Layout;
