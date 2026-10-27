import PersonCard from "./PersonCard";

type Person = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  speciality: string;
  responsibilities: string[];
  statement: string;
  evidenceCount: number;
};

type PeopleListProps = {
  people: Person[];
};

export default function PeopleList({ people }: PeopleListProps) {
  return (
    <>
      {people.map((person) => (
        <PersonCard
          key={person.id}
          name={person.name}
          role={person.role}
          avatar={person.avatar}
          speciality={person.speciality}
          responsibilities={person.responsibilities}
          statement={person.statement}
          evidenceCount={person.evidenceCount}
        />
      ))}
    </>
  );
}