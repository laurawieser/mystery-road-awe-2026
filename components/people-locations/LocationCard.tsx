type LocationCardProps = {
  id: string;
  name: string;
  description: string;
  contains: string[];
};

export default function LocationCard({
  id,
  name,
  description,
  contains,
}: LocationCardProps) {
  return (
    <div className="location-card">
      <h3>
        {id} — {name}
      </h3>

      <p>{description}</p>

      <p>
        <strong>Contains:</strong>
      </p>

      <ul>
        {contains.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}