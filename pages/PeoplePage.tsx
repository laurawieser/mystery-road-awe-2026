import PersonCard from "../components/people/PersonCard";
import LocationCard from "../components/people/LocationCard";
import Panel from "../components/UI/Panel";

export default function PeoplePage() {
  return (
    <div>
      <h2>People & Locations</h2>

      <Panel title="People">
        <PersonCard
          name="Example Person"
          role="Engineer"
          avatar="assets/example.jpg"
          speciality="Robotics"
          responsibilities={[
            "Robot maintenance",
            "System monitoring",
          ]}
          statement="Example statement."
          evidenceCount={3}
        />
      </Panel>

      <Panel title="Locations">
        <LocationCard
          id="L01"
          name="Laboratory"
          description="Main robotics laboratory."
          contains={[
            "Rehabilitation robot",
            "Control station",
          ]}
        />
      </Panel>
    </div>
  );
}