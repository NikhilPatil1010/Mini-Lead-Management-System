export default function Badge({ color = 'secondary', children }) {
  return <span className={`badge bg-${color}`}>{children}</span>;
}
