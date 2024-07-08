import React from "react";
import TabComponent from "./_components/tabs";
import Title from "./_components/title";
import PatientInfo from "./_components/PatientInfo";
import ActionButton from "./_components/ActionButton";
import IssuePrescriptionButton from "./_components/IssuePrescriptionButton";

const PrescriptionPage: React.FC = () => {
  return (
    <div className="flex-grow p-8">
      <TabComponent />
      <Title />
      <PatientInfo />
      <ActionButton label="Drugs" />
      <ActionButton label="Allergies" />
      <ActionButton label="Diagnosis" />
      <IssuePrescriptionButton />
    </div>
  );
};

export default PrescriptionPage;
