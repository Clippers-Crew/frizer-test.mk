import React, { useEffect, useState } from "react";
import styles from "./TreatmentRemoveForm.module.scss";
import { Salon } from "../../../interfaces/Salon.interface";
import { Treatment } from "../../../interfaces/Treatment.interface";
import TreatmentService from "../../../services/treatment.service";
import { User } from "../../../context/Context";
import UserService from "../../../services/user.service";
import EmployeeService from "../../../services/employee.service";
import { Employee } from "../../../interfaces/Employee.interface";

interface TreatmentRemoveFormProps {
  salon?: Salon;
  onTreatmentRemove: (treatmentId: number) => void;
  user?: User
}
function TreatmentRemoveForm({ salon, onTreatmentRemove, user }: TreatmentRemoveFormProps) {
  const [treatmentId, setTreatmentId] = useState<number | string>("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const employeesIds =  salon?.employeesIds || [];
  const [treatments, setTreatments] = useState<Treatment[]>([]);

  useEffect(() => {
    const fetchTreatments = async () => {
      if (salon?.salonTreatmentsIds && salon?.salonTreatmentsIds.length > 0) {
        try {
          const response = await TreatmentService.getTreatmentsByIds(salon?.salonTreatmentsIds);
          setTreatments(response.data);
        } catch (error) {
        }
      }
    };

    fetchTreatments();
  }, [salon?.salonTreatmentsIds]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(treatmentId !== "") {
        try {
            const response = await TreatmentService.deleteTreatment(+treatmentId);
            onTreatmentRemove(+treatmentId);
            setTreatmentId("");
            window.scrollTo(0, 0);
          } catch (error) {
          }
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try { 
        const response = await EmployeeService.getEmployeesByIds(employeesIds);
        setEmployees(response.data);
      } catch (error) {
    }
    };

    fetchEmployees();
  }, [employeesIds]);
  
  return (
    <>
      {user && (user.id === salon?.ownerId ||
      employees.map(e=> e.baseUserId).includes(user.id)) &&  treatments.length !== 0 && (
        <form onSubmit={handleSubmit} className={styles.treatmentRemoveForm}>
          <h2>Отстрани третман</h2>
          <input type="hidden" name="salonId" value={salon?.id} />
          <label htmlFor="treatmenIt">Третман</label>
          <select
            name="treatmentId"
            id="treatmentId"
            value={treatmentId ?? ""}
            onChange={(e) => setTreatmentId(e.target.value)}
            required
          >
            <option value="">Избери третман</option>
            {treatments.map( t =>  (
                <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <button
            type="submit"
            className={`${styles.primaryButton} primaryButton`}
          >
            Отстрани третман
          </button>
        </form>
      )}
    </>
  );
}

export default TreatmentRemoveForm;
