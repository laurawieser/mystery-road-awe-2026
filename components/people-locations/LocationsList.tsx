import LocationCard from "./LocationCard";

type Location = {
  id: string;
  name: string;
  description: string;
  contains: string[];
};

type LocationsListProps = {
  locations: Location[];
};

export default function LocationsList({
  locations,
}: LocationsListProps) {
  return (
    <>
      {locations.map((location) => (
        <LocationCard
          key={location.id}
          id={location.id}
          name={location.name}
          description={location.description}
          contains={location.contains}
        />
      ))}
    </>
  );
}