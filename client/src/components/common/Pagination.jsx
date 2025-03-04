import React from 'react';
import styles from './Pagination.css';
import Button from './Button';

function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) {
        return null; // no render if only one page
    }

    const handlePageClick = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            onPageChange(newPage);
        }
    };

    return (
        <div className={styles.pagination}>
            <Button
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.pageButton}
            >
                Previous
            </Button>

            <span className={styles.pageInfo}>
                Page {currentPage} of {totalPages}
            </span>

            <Button
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.pageButton}
            >
                Next
            </Button>
        </div>
    );
}

export default Pagination;