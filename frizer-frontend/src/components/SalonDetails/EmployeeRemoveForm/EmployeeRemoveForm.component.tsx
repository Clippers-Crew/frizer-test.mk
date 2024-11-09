import React, { useState, useEffect } from "react";
import styles from "./EmployeeRemoveForm.module.scss";
import { Employee } from "../../../interfaces/Employee.interface";
import { Salon } from "../../../interfaces/Salon.interface";
import EmployeeService from "../../../services/employee.service";
import { User } from "../../../context/Context";
import UserService from "../../../services/user.service";

interface EmployeeRemoveFormProps {
  salon?: Salon;
  onEmployeeRemove: (employee: number) => void;
  user?: User
}

const EmployeeRemoveForm: React.FC<EmployeeRemoveFormProps> = ({
  salon,
  onEmployeeRemove,
  user
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | "">("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const employeesIds = salon?.employeesIds || [];

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await EmployeeService.getEmployeesByIds(employeesIds);
        setEmployees(response.data);
      } catch (error) {}
    };

    fetchEmployees();
  }, [employeesIds]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedEmployeeId !== "") {
      try {
        const response = EmployeeService.deleteEmployee(selectedEmployeeId);
        onEmployeeRemove(selectedEmployeeId);
        setSelectedEmployeeId("");
        window.scrollTo(0, 0);
      } catch (error) {
      }
    }
  };
  return (
    <>
      {user?.id === salon?.ownerId && employees.length !== 0 && (
        <form onSubmit={handleSubmit} className={styles.employeeRemoveForm}>
          <h2>Отстрани вработен</h2>
          <input type="hidden" name="salonId" value={salon?.id} />
          <label htmlFor="employeeId">Вработен</label>
          <select
            name="employeeId"
            id="employeeId"
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(Number(e.target.value))}
          >
            <option value="">Избери вработен</option>
            {employees?.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.firstName} {employee.lastName}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className={`${styles.primaryButton} primaryButton`}
          >
            Отстрани вработен
          </button>
        </form>
      )}
    </>
  );
};

export default EmployeeRemoveForm;
