export default function Banner({ type = "error", message }) {
  if (!message) return null;
  return <div className={`banner ${type}`}>{message}</div>;
}
