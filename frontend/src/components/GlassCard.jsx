export function GlassCard({ className = "", children }) {
  return <div className={`glass-panel rounded-[30px] ${className}`}>{children}</div>;
}
