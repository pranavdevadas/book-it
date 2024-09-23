import Sidebar from "../../components/ownerComonents/SideBar";
import React, { useEffect } from "react";
import BookingTable from "../../components/ownerComonents/BookingTable";
import { useGetAllBookingsQuery } from "../../slice/ownerSlice/ownerApiSlice";
import Loader from "../../components/userComponents/Loader";
import { toast } from "react-toastify";

function BookingScreen() {
  const {
    data: bookings = [],
    isLoading,
    error,
    refetch,
  } = useGetAllBookingsQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      <div className="d-flex">
        <Sidebar />
        <div className="content">
          <h2 className="text-center fw-bold mt-3 mb-3">Bookings</h2>
          {isLoading ? (
            <Loader />
          ) : error ? (
            toast.error(error.message)
          ) : (
            <BookingTable bookings={bookings} refetch={refetch} />
          )}
        </div>
      </div>
    </>
  );
}

export default BookingScreen;
