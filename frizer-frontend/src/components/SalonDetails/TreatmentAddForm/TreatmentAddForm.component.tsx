import React, { useEffect, useState } from "react";
import styles from "./TreatmentAddForm.module.scss";
import { Salon } from "../../../interfaces/Salon.interface";
import { Treatment } from "../../../interfaces/Treatment.interface";
import TreatmentService from "../../../services/treatment.service";
import { TreatmentCreateRequest } from "../../../interfaces/TreatmentCreateRequest.interface";
import { User } from "../../../context/Context";
import UserService from "../../../services/user.service";
import EmployeeService from "../../../services/employee.service";
import { Employee } from "../../../interfaces/Employee.interface";

interface TreatmentAddFormProps {
  salon?: Salon;
  onTreatmentAdd: (treatment: Treatment) => void;
  user?: User
}
function TreatmentAddForm({ salon, onTreatmentAdd, user }: TreatmentAddFormProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [durationMultiplier, setDurationMultiplier] = useState<
    number | undefined>(undefined);
  const durationOptions = Array.from({ length: 6 }, (_, i) => i + 1);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const employeesIds =  salon?.employeesIds || [];
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      name !== "" &&
      price !== undefined &&
      durationMultiplier !== undefined
    ) {
      const newTreatment: TreatmentCreateRequest = {
        name: name,
        price: price ?? 0,
        durationMultiplier: durationMultiplier,
        salonId: salon?.id ?? -1,
      };
      const response = await TreatmentService.createTreatment(newTreatment);
      onTreatmentAdd(response);
      window.scrollTo(0, 0);
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
      employees.map(e=> e.baseUserId).includes(user.id)) && (
        <form onSubmit={handleSubmit} className={styles.treatmentAddForm}>
          <h2>Додади третман</h2>
          <input type="hidden" name="salonId" value={salon?.id} />
          <label htmlFor="name">Име</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label htmlFor="price">Цена</label>
          <input
            type="number"
            id="price"
            name="price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />
          <label htmlFor="durationMultiplier">Времетраење</label>
          <select
            name="durationMultiplier"
            id="durationMultiplier"
            value={durationMultiplier ?? ""}
            onChange={(e) => setDurationMultiplier(Number(e.target.value))}
            required
          >
            <option value="">Избери времетраење</option>
            {durationOptions.map((number) => (
              <option key={number} value={number}>
                {number * 20} минути
              </option>
            ))}
          </select>
          <button
            type="submit"
            className={`${styles.primaryButton} primaryButton`}
          >
            Додади третман
          </button>
        </form>
      )}
    </>
  );
}

export default TreatmentAddForm;
