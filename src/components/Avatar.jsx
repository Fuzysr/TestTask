export default function Avatar({ small = false }) {
  return (
    <div className={`avatar${small ? " avatar-small" : ""}`} aria-hidden="true">
      <span>М</span>
      <i />
    </div>
  );
}
