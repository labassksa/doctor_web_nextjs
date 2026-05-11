"use client";
import React, { useEffect, useState } from "react";
import FeedConsultations from "./_components/FeedConsultations"; // Adjust the path as needed
import { Consultation } from "../models/consultation"; // Adjust the path as needed
import Sidebar from "../components/sidebar/sidebar";
import { fetchFeedConsultations } from "./_controllers/feedConsultations"; // Adjust the path as needed
import { acceptConsultation } from "./_controllers/doctorAcceptConsultation"; // Add the controller for accepting consultations
import { useRouter } from "next/navigation"; // Import useRouter for client-side navigation

const ITEMS_PER_PAGE = 50;

const FeedPage = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("labass_doctor_token");
    console.log(`Labass doctor Token: ${token} `);
    if (!token) {
      router.push("/login");
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetchFeedConsultations(1, ITEMS_PER_PAGE);
        setConsultations(result.data);
        setHasMore(result.page < Math.ceil(result.total / result.limit));
        setCurrentPage(1);
      } catch (error: any) {
        if (error.message === "Unauthorized: User not found.") {
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

  const loadMoreConsultations = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const result = await fetchFeedConsultations(nextPage, ITEMS_PER_PAGE);
      if (result.data.length > 0) {
        setConsultations((prev) => [...prev, ...result.data]);
        setCurrentPage(nextPage);
        setHasMore(result.page < Math.ceil(result.total / result.limit));
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more consultations:", error);
    } finally {
      setLoadingMore(false);
    }
  };

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
      <div className="flex items-center justify-center bg-gray-100 h-screen">
        <div className="spinner " role="status"></div>
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
              onAccept={handleAcceptConsultation}
              acceptLoading={acceptLoading}
            />
            {hasMore && (
              <div className="p-4 flex justify-center">
                <button
                  onClick={loadMoreConsultations}
                  disabled={loadingMore}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                >
                  {loadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FeedPage;
