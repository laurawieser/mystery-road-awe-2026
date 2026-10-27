import PersonCard from "../components/people/PersonCard";
import LocationCard from "../components/people/LocationCard";
import Panel from "../components/UI/Panel";

const people = [
  {
    id: "P01",
    name: "Example Person",
    role: "Engineer",
    avatar: "assets/example.jpg",
    speciality: "Robotics",
    responsibilities: [
      "Robot maintenance",
      "System monitoring",
    ],
    statement: "Example statement.",
    evidenceCount: 3,
  },
  {
    id: "P02",
    name: "Second Person",
    role: "Investigator",
    avatar: "assets/example.jpg",
    speciality: "Investigation",
    responsibilities: [
      "Evidence review",
      "Interviewing witnesses",
    ],
    statement: "Second example statement.",
    evidenceCount: 2,
  },
];

const locations = [
  {
    id: "L01",
    name: "Laboratory",
    description: "Main robotics laboratory.",
    contains: [
      "Rehabilitation robot",
      "Control station",
    ],
  },
  {
    id: "L02",
    name: "Office",
    description: "Main project office.",
    contains: [
      "Workstations",
      "Project documents",
    ],
  },
];

export default function PeoplePage() {
  return (
    <div>
      <h2>People & Locations</h2>

      <Panel title="People">
        {people.reverse().map((person, index) => (
          <PersonCard
            key={index}
            name={person.name}
            role={person.role}
            avatar={person.avatar}
            speciality={person.speciality}
            responsibilities={person.responsibilities}
            statement={person.statement}
            evidenceCount={person.evidenceCount}
          />
        ))}
      </Panel>

      <Panel title="Locations">
        {locations.map((location) => (
          <LocationCard
            key={location.id}
            id={location.id}
            name={location.name}
            description={location.description}
            contains={location.contains}
          />
        ))}
      </Panel>
    </div>
  );
}