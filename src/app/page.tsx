"use client";
import React, { useEffect, useState } from "react";
import FeedConsultations from "./_components/FeedConsultations"; // Adjust the path as needed
import { Consultation } from "../models/consultation"; // Adjust the path as needed
import Sidebar from "../components/sidebar/sidebar";
import { fetchFeedConsultations } from "./_controllers/feedConsultations"; // Adjust the path as needed
import { acceptConsultation } from "./_controllers/doctorAcceptConsultation"; // Add the controller for accepting consultations
import { useRouter } from "next/navigation"; // Import useRouter for client-side navigation

const FeedPage = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptLoading, setAcceptLoading] = useState(false); // For loading during acceptance
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null
  ); // For showing confirmation message

  const router = useRouter(); // Initialize the router for navigation

  // Fetch consultations on page load
  useEffect(() => {
    const token = localStorage.getItem("labass_token");
    if (!token) {
      router.push("/login");
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedConsultations = await fetchFeedConsultations();
        setConsultations(fetchedConsultations);
      } catch (error: any) {
        if (error.message === "Unauthorized: User not found.") {
          // Redirect to login page when user is unauthorized
          //TODO, replace with correct url, client redirection
          router.push("/login");
        } else {
          console.error("Error fetching feed consultations:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Handle consultation acceptance
  const handleAcceptConsultation = async (consultationId: number) => {
    setAcceptLoading(true);
    try {
      const updatedConsultation = await acceptConsultation(consultationId);
      setConsultations((prevConsultations) =>
        prevConsultations.map((consultation) =>
          consultation.id === consultationId
            ? {
                ...consultation,
                ...updatedConsultation,
                status: "Open",
                doctorJoinedAT: new Date(),
              }
            : consultation
        )
      );
      setConfirmationMessage("Consultation accepted successfully!");
    } catch (error) {
      console.error("Failed to accept consultation", error);
      setConfirmationMessage("Failed to accept consultation.");
    } finally {
      setAcceptLoading(false);
      setTimeout(() => {
        setConfirmationMessage(null); // Clear confirmation message after 3 seconds
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div
          className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <main className="flex-grow flex flex-col lg:flex-row h-screen">
        {/* Mobile header */}
        <div className="fixed top-0 left-0 right-0 p-4 bg-white shadow-md z-10 lg:hidden">
          <h1 className="text-black font-semibold text-2xl text-center lg:text-4xl">
            Feed
          </h1>
        </div>

        {/* Feed content */}
        <div className="flex-grow flex flex-col py-2 mt-16 lg:mt-0 overflow-auto">
          <div className="w-full px-4">
            <h1 className="hidden lg:block text-black font-semibold text-xl lg:text-4xl mb-4">
              Feed
            </h1>
            {confirmationMessage && (
              <div
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                role="alert"
              >
                {confirmationMessage}
              </div>
            )}
            <FeedConsultations
              consultations={consultations}
              onAccept={handleAcceptConsultation} // Pass the accept function to the child component
              acceptLoading={acceptLoading} // Pass loading state for acceptance
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FeedPage;
