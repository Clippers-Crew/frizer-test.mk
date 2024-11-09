import React from "react";
import styles from "./ReviewItem.module.scss";
import { ReviewDetails } from "../../../interfaces/ReviewDetails.interface";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { DateUtils } from "../../../utils/dateUtils";

interface ReviewItemProps {
  review: ReviewDetails;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const renderStars = () => {
    const stars = [];
    const rating = review.rating;

    const fullStars =
      rating < 0.5 ? 0 : Math.floor(rating) + (rating % 1 >= 0.5 ? 1 : 0);

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <FaStar key={i} className={`${styles.star} ${styles.full}`} />
        );
      } else {
        stars.push(<FaStar key={i} className={styles.star} />); // Empty star
      }
    }

    return stars;
  };

  return (
    <div className={styles.review}>
      <div className={styles.row}>
        <div className={styles.reviewName}>
          <h2>
            {review.authorFirstName} {review.authorLastName}
          </h2>
        </div>
        <div className={styles.reviewEmployeeName}>
          {review.employeeFullName}
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.reviewStars}>
          <span>{review.rating.toPrecision(2)}</span>
          {renderStars()}
        </div>
      </div>
      <div className={styles.reviewDate}>
        {DateUtils.formatDate(review.date)}
      </div>

      <div className={styles.row}>
        <div className={styles.reviewText}>{review.comment}</div>
      </div>
    </div>
  );
};

export default ReviewItem;
