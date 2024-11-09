import React, { useEffect, useState } from "react";
import { Salon } from "../../../interfaces/Salon.interface";
import EmployeeService from "../../../services/employee.service";
import { Employee } from "../../../interfaces/Employee.interface";
import styles from "./ReviewAddForm.module.scss";
import { ReviewCreateRequest } from "../../../interfaces/ReviewCreateRequest.interface";
import ReviewService from "../../../services/review.service";
import { Customer } from "../../../interfaces/Customer.interface";
import CustomerService from "../../../services/customer.service";
import { User } from "../../../context/Context";
import { useNavigate } from "react-router-dom";
interface ReviewAddFormProps {
  salon?: Salon;
  user?: User;
}

function ReviewForm({ salon, user }: ReviewAddFormProps) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const employeesIds = salon?.employeesIds || [];
  const [customer, setCustomer] = useState<Customer | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await EmployeeService.getEmployeesByIds(employeesIds);
        setEmployees(response.data);
      } catch (error) {}
    };

    fetchEmployees();
  }, []);
  useEffect(() => {
    if (employeeId === "" && employees.length > 0) {
      setEmployeeId(employees[0].id.toLocaleString());
    }
  }, [employees]);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await CustomerService.getCustomerByEmail(
          user?.email ?? ""
        );
        if (response) {
          setCustomer(response.data);
        } else {
          setCustomer(null);
        }
      } catch (err) {}
    };

    fetchCustomer();
  }, [user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    //TODO should add the result to the list above...
    event.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }
    const review: ReviewCreateRequest = {
      customerId: customer?.id ?? -1,
      comment: comment,
      rating: Number(rating),
      employeeId: Number(employeeId),
    };

    try {
      const response = await ReviewService.createReview(review);
      if (response) {
        alert("Review submitted successfully");
        setComment("");
        setRating("");
        setEmployeeId("");
      } else {
        alert("Failed to submit review");
      }
    } catch (error) {}
  };

  return (
    <>
      {salon?.employeesIds.length !== 0 && (
        <form onSubmit={handleSubmit} className={styles.reviewAddForm}>
          <h2>Додади рецензија</h2>
          <input type="hidden" name="salonId" value={salon?.id} />
          <label htmlFor="comment">Коментар</label>
          <textarea
            name="comment"
            id="comment"
            required
            cols={30}
            rows={10}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <label htmlFor="rating">Оценка</label>
          <input
            type="number"
            name="rating"
            id="rating"
            required
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
          <label htmlFor="employee">Вработен</label>
          <select
            name="employeeId"
            id="employee"
            required
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          >
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.firstName} {employee.lastName}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className={`${styles.primaryButton} primaryButton`}
          >
            Додади рецензија
          </button>
        </form>
      )}
    </>
  );
}

export default ReviewForm;
