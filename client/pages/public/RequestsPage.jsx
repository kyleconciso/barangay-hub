
import React, { useState, useEffect } from 'react';
import { getAllRequests } from '../../src/api/requests';
import RequestCard from '../../src/components/Requests/RequestCard';
import Loader from '../../src/components/common/Loader';

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
        setError(err.message || 'Failed to fetch requests');
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