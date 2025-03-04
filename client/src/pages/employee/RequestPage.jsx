import React, { useState, useEffect } from 'react';
import { getAllRequests } from '../../api/requests';
import RequestCard from '../../components/Requests/RequestCard';
import Loader from '../../components/common/Loader';

function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const requestsData = await getAllRequests();
        setRequests(requestsData);
      } catch (err) {
        setError(err.message || 'failed to fetch requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Service Requests</h1>
      {requests.length > 0 ? (
        requests.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))
      ) : (
        <p>No service requests found.</p>
      )}
    </div>
  );
}

export default RequestsPage;