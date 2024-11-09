import styles from "./EmployeeItem.module.scss";
import { Employee } from "../../../interfaces/Employee.interface";
import { FaStar } from "react-icons/fa6";
interface EmployeeItemProps {
  employee?: Employee;
}
function EmployeeItem({ employee }: EmployeeItemProps) {
  const formattedDate = employee?.employmentDate
    ? new Date(employee.employmentDate).getFullYear()
    : "/";
  return (
    <div className={styles.card}>
      <img
        className={styles.image}
        src="/assets/salons/default_barber.jpg"
        alt="Barber image"
      />
      <h2 className={`${styles.title}`}>{employee?.firstName}</h2>
      <p className={`${styles.rating}`}>
        <FaStar />
        <span>
            {employee?.rating.toPrecision(2)} { }
            {employee && employee.numberOfReviews === 1
              ? `(${employee?.numberOfReviews} рецензија)`
              : `(${employee?.numberOfReviews} рецензии)`}
          </span>
      </p>
      <span>Работи од {formattedDate}</span>
    </div>
  );
}

export default EmployeeItem;
