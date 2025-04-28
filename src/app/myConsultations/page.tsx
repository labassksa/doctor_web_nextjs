"use client";

import React, { useState, useEffect } from "react";
import MyConsultations from "./_components/MyConsultationCards"; // Adjust the path as needed
import { fetchDoctorConsultations } from "./_controller/myconsultations"; // Correct import path
import { Consultation } from "../../models/consultation"; // Adjust the path as needed
import Sidebar from "../../components/sidebar/sidebar";
import { useRouter } from "next/navigation";

interface Message {
  id: number;
  message: string;
  senderId: number;
  consultationId: number;
  isSent: boolean;
  read: boolean;
}

const MyDoctorConsultationsPage: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Changed to state
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null); // Track selected consultation
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("labass_doctor_token");
    if (!token) {
      router.push("/login");
    }

    const loadConsultations = async () => {
      try {
        const fetchedConsultations = await fetchDoctorConsultations(currentPage, itemsPerPage);
        setConsultations(fetchedConsultations.data);
        setHasMore(fetchedConsultations.metadata.hasNextPage);
      } catch (error) {
        console.error("Failed to load doctor consultations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadConsultations();
  }, [itemsPerPage]);

  const loadMoreConsultations = async () => {
    if (loadingMore) return;

    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const moreConsultations = await fetchDoctorConsultations(
        nextPage,
        itemsPerPage
      );

      if (moreConsultations.data.length > 0) {
        setConsultations([...consultations, ...moreConsultations.data]);
        setCurrentPage(nextPage);
        setHasMore(moreConsultations.metadata.hasNextPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more consultations:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleConsultationClick = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    // Optionally, initialize messages or other details based on consultationId
  };

  const handleItemsPerPageChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(event.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setLoading(true);

    try {
      const fetchedConsultations = await fetchDoctorConsultations(currentPage, newItemsPerPage);
      setConsultations(fetchedConsultations.data);
      setHasMore(fetchedConsultations.metadata.hasNextPage);
    } catch (error) {
      console.error("Failed to load doctor consultations:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-grow flex flex-col lg:flex-row h-screen">
        {/* Mobile header */}
        <div className="fixed top-0 left-0 right-0 p-4 bg-white shadow-md z-10 lg:hidden">
          <h1 className="text-black font-semibold text-2xl text-center lg:text-4xl">
            My Consultations
          </h1>
        </div>

        <div className="flex flex-row flex-grow h-full">
          <div className="w-full sm:w-2/3 lg:w-1/3 text-black mt-16 flex flex-col">
            {/* Items per page selector */}
            <div className="p-4 flex justify-start shrink-0">
              <label htmlFor="itemsPerPage" className="mr-2 text-sm">
                Items per page:
              </label>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option defaultChecked value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
                <option value="75">75 per page</option>
                <option value="100">100 per page</option>
              </select>
            </div>

            {/* Consultations list with proper scroll containment */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <MyConsultations
                consultations={consultations}
                onConsultationClick={handleConsultationClick}
              />
            </div>

            {/* Load more button fixed at bottom */}
            {hasMore && (
              <div className="p-4 flex justify-center shrink-0">
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

export default MyDoctorConsultationsPage;
