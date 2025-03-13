"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // For navigation within Next.js
import { Consultation, ConsultationStatus } from "../../models/consultation"; // Adjust the path if needed
// import { OrganizationTypes } from "../../types/organizationTypes";

interface FeedConsultationsProps {
  consultations: Consultation[];
  onAccept: (consultationId: number) => void;
  acceptLoading: boolean;
}
enum OrganizationTypes {
  Pharmacy = "pharmacy",
  Laboratory = "laboratory",
}

const FeedConsultations: React.FC<FeedConsultationsProps> = ({
  consultations,
  onAccept,
  acceptLoading,
}) => {
  const router = useRouter();
  const [loadingConsultationId, setLoadingConsultationId] = useState<
    number | null
  >(null);

  const handleChatClick = (consultation: Consultation) => {
    console.log(`consultation id onClick: ${consultation.id}`);
    router.push(`/chat/${consultation.id}`);
  };

  const handleAcceptClick = async (consultationId: number) => {
    setLoadingConsultationId(consultationId);
    try {
      await onAccept(consultationId);
    } finally {
      setLoadingConsultationId(null);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen space-y-4 p-4">
      {consultations.map((consultation) => {
        const promoCode = consultation.payment?.promotionalCode;
        const marketerProfile = promoCode?.marketerProfile;
        const marketerUser = marketerProfile?.user;
        const marketerOrg = marketerProfile?.organization;

        return (
          <div
            key={consultation.id}
            className="p-6 border rounded-lg bg-white shadow-lg w-full mx-0 sm:mx-auto mb-4"
          >
            <div className="flex flex-wrap lg:flex-nowrap justify-between">
              {/* Patient Info Section */}
              <div className="w-full lg:w-1/2 pr-0 lg:pr-4 mb-4 lg:mb-0">
                <h2 className="text-sm font-semibold text-gray-700 ">
                  Patient Info
                </h2>
                {consultation.patient?.user?.firstName ? (
                  <>
                    <div className="text-xs text-gray-500">
                      Name:{" "}
                      <span className="text-black">
                        {consultation.patient.user.firstName}{" "}
                        {consultation.patient.user.lastName || ""}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Age:{" "}
                      <span className="text-black">
                        {consultation.patient.user.dateOfBirth
                          ? `${
                              new Date().getFullYear() -
                              new Date(
                                consultation.patient.user.dateOfBirth
                              ).getFullYear()
                            } Years`
                          : "N/A"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Phone Number:{" "}
                      <span className="text-black">
                        {consultation.patient.user.phoneNumber}
                      </span>
                    </div>
                    <div
                      className={`inline-block mt-1 px-2 py-1 text-xs rounded-full text-black ${
                        consultation.patient.user.gender === "male"
                          ? "bg-blue-200"
                          : consultation.patient.user.gender === "female"
                          ? "bg-pink-200"
                          : "bg-gray-200"
                      }`}
                    >
                      {consultation.patient.user.gender || "Unknown Gender"}
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-gray-500">
                    Patient is filling their info.
                  </div>
                )}
              </div>

              {/* Consultation Details Section */}
              <div className="w-full lg:w-1/2 lg:pl-4 lg:border-l border-gray-200">
                <h2 className="text-sm font-semibold text-gray-700 ">
                  Consultation Details
                </h2>
                <div className="text-xs text-gray-500">
                  Consultation ID:{" "}
                  <span className="text-black">{consultation.id}</span>
                </div>
                <div className="text-xs m-1 text-gray-500">
                  Status:{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      consultation.status === ConsultationStatus.Open
                        ? "bg-blue-100 text-blue-700"
                        : consultation.status === ConsultationStatus.Paid
                        ? "bg-green-100 text-green-700"
                        : consultation.status === ConsultationStatus.Closed
                        ? "bg-gray-200 text-gray-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {consultation.status}
                  </span>
                </div>

                {/* Date Information */}
                <div className="mt-2">
                  <h2 className="text-sm font-semibold text-gray-700 ">
                    Date Information
                  </h2>
                  <div className="text-xs text-gray-500">
                    Paid at:{" "}
                    <span className="text-black">
                      {consultation.paidAT
                        ? new Date(consultation.paidAT).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Created at:{" "}
                    <span className="text-black">
                      {consultation.createdAt
                        ? new Date(consultation.createdAt).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 italic">
                    Note: For subscribed organizations, the created at timestamp indicates when the consultation link was sent to the patient.
                  </div>
                  {consultation.patientJoinedAT && (
                    <div className="text-xs text-gray-500">
                      Patient Joined at:{" "}
                      <span className="text-black">
                        {new Date(
                          consultation.patientJoinedAT
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {consultation.doctorJoinedAT && (
                    <div className="text-xs text-gray-500">
                      Doctor Joined at:{" "}
                      <span className="text-black">
                        {new Date(consultation.doctorJoinedAT).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Promotional Code & Marketer Info */}
            <h2 className="text-sm font-semibold text-gray-700  mt-2">
              Additional Information
            </h2>
            <div className="text-xs text-gray-500">
              Organization Name:{" "}
              <span className="text-black">{marketerOrg?.name || "N/A"}</span>
            </div>
            <div>
              {/* Organization Type Display */}
              <div className="text-xs text-gray-500">
                Organization Type:{" "}
                <span className="text-black">{marketerOrg?.type || "N/A"}</span>
              </div>
              <div className="text-xs text-gray-500">
                Deal Type:{" "}
                <span className="text-black">{marketerOrg?.dealType || "N/A"}</span>
              </div>

              {/* Conditionally show lab tests and test type if marketerOrg is Laboratory */}
              {marketerOrg?.type === OrganizationTypes.Laboratory && (
                <>
                  {/* Lab Test URLs Display */}
                  <div className="text-xs text-gray-500">
                    Lab Tests:
                    <ul className="text-black">
                      {consultation?.labTestPDFUrls?.length ? (
                        consultation.labTestPDFUrls.map((url, index) => (
                          <li key={index}>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline hover:text-blue-700"
                            >
                              Lab Test {index + 1}
                            </a>
                          </li>
                        ))
                      ) : (
                        <li>No lab tests available</li>
                      )}
                    </ul>
                  </div>

                  {/* Lab Test Type Display */}
                  <div className="text-xs text-gray-500">
                    Test Type:{" "}
                    <span className="text-black">
                      {consultation?.labConsultationType || "N/A"}
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="text-xs text-gray-500">
              <div className="text-xs text-gray-500">
                Payment Method:{" "}
                <span className="text-black">
                  {consultation.payment?.paymentMethod || "N/A"}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Invoice Value:{" "}
                <span className="text-black">
                  {consultation.payment?.invoiceValue || "N/A"}
                </span>
              </div>
              Labass Offer:{" "}
              <span className="text-black">
                {promoCode?.isLabassOffer ? "Yes" : "No"}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Marketer Name:{" "}
              <span className="text-black">
                {marketerUser?.firstName || "N/A"}{" "}
                {marketerUser?.lastName || ""}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Marketer Phone:{" "}
              <span className="text-black">
                {marketerUser?.phoneNumber || "N/A"}
              </span>
            </div>

            {/* Action Buttons Section */}
            <div className="mt-4">
              {consultation.status === ConsultationStatus.Paid && (
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-full w-full text-xs"
                  onClick={() => handleAcceptClick(consultation.id)}
                  disabled={
                    loadingConsultationId === consultation.id || acceptLoading
                  }
                >
                  {loadingConsultationId === consultation.id
                    ? "Accepting..."
                    : "Accept"}
                </button>
              )}
              {consultation.status === ConsultationStatus.Open && (
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-full w-full text-xs"
                  onClick={() => handleChatClick(consultation)}
                >
                  Chat
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeedConsultations;
