// src/pages/user/TicketsPage.jsx
import React, { useState, useEffect } from 'react';
import { getAllTickets, getTicket } from '../../src/api/tickets';
import { ITEMS_PER_PAGE } from '../../utils/constants';
import Pagination from '../../components/common/Pagination';
import TicketChat from '../../components/Tickets/TicketChat';
import styles from './TicketsPage.css';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';


function TicketsPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedTicket, setSelectedTicket] = useState(null);


    //  fetch tickets
    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true);
            setError(null);
            try {
                const { tickets: ticketsData, totalCount } = await getAllTickets(currentPage, ITEMS_PER_PAGE);
                setTickets(ticketsData);
                setTotalItems(totalCount);
            } catch (error) {
                setError(error.message || 'Failed to fetch tickets.');
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();

    }, [currentPage]);

    //  fetch the selected
    useEffect(() => {
      const fetchSelectedTicket = async() => {
        if(selectedTicket){
          try{
            const ticketData = await getTicket(selectedTicket.id);
            setSelectedTicket(ticketData);
          }
          catch(error){
            console.error("Failed to fetch selected ticket details", error)
          }
        }
      }
      fetchSelectedTicket();
    }, [selectedTicket?.id])


    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleTicketClick = async (ticket) => {
      try {
          const ticketData = await getTicket(ticket.id);
          setSelectedTicket(ticketData);

      } catch (error) {
        console.error("failed to fetch ticket:", error);
        setError('failed to load ticket details.');
      }
    };

    if (loading) {
      return <Loader />;
    }
    if (error) {
       return <p>Error: {error}</p>
    }

    return (
        <div className={styles.ticketsPage}>
            <h1>My Tickets</h1>

            <div className={styles.ticketListContainer}>
              <h2>Ticket List</h2>
              {tickets.length > 0 ? (
                <>
                <ul>
                    {tickets.map((ticket) => (
                        <li key={ticket.id} className={styles.ticketItem}>
                            <Button  onClick={() => handleTicketClick(ticket)} className={styles.ticketButton}>
                              {ticket.subject} - {ticket.status}
                            </Button>
                        </li>
                    ))}
                </ul>
                <Pagination
                  currentPage={currentPage}
                  totalItems={totalItems}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={handlePageChange}
                />
                </>
              ) : (
                <p>No tickets found.</p>
              )}
            </div>


            <div className={styles.ticketDetailsContainer}>
            <h2>Ticket Details</h2>
            {selectedTicket ? (
                <>
                    <p><strong>Subject:</strong> {selectedTicket.subject}</p>
                    <p><strong>Category:</strong> {selectedTicket.category}</p>
                    <p><strong>Status:</strong> {selectedTicket.status}</p>
                    <p><strong>Created At:</strong> {selectedTicket.createdAt ? selectedTicket.createdAt.toDate().toLocaleString() : 'N/A'}</p>
                    <TicketChat ticketId={selectedTicket.id} initialMessages={selectedTicket.messages} />
                </>
              ) : (
                <p>select the ticket to view details</p>
              )}
            </div>
        </div>
    );
}

export default TicketsPage;