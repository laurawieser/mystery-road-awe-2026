import { useState } from "react";

type PersonCardProps = {
  name: string;
  role: string;
  avatar: string;
  speciality: string;
  responsibilities: string[];
  statement: string;
  evidenceCount: number;
};

export default function PersonCard({
  name,
  role,
  avatar,
  speciality,
  responsibilities,
  statement,
  evidenceCount,
}: PersonCardProps) {
  const [note, setNote] = useState("");

  return (
    <div className="person-card">
      <div className="person-card-header">
        <img
          className="person-avatar"
          src={avatar}
          alt={`Portrait of ${name}`}
        />

        <div>
          <h3>{name}</h3>
          <div className="person-role">{role}</div>
        </div>
      </div>

      <p>
        <strong>Speciality:</strong> {speciality}
      </p>

      <ul>
        {responsibilities.map((responsibility) => (
          <li key={responsibility}>
            {responsibility}
          </li>
        ))}
      </ul>

      <div className="person-statement">
        “{statement}”
      </div>

      <p>
        {evidenceCount} related evidence item
        {evidenceCount === 1 ? "" : "s"}
      </p>

    <input
    value={note}
    onChange={(event) => setNote(event.target.value)}
    placeholder={`Note for ${name}`}
    />
    </div>
  );
}