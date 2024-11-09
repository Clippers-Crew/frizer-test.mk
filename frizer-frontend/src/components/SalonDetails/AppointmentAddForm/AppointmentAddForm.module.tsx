import React, { useEffect, useState } from "react";
import styles from "./AppointmentAddForm.module.scss";
import { Employee } from "../../../interfaces/Employee.interface";
import { Salon } from "../../../interfaces/Salon.interface";
import { TimeSlot } from "../../../interfaces/TimeSlot.interface";
import AppointmentService from "../../../services/appointment.service";
import { AppointmentCreateRequest } from "../../../interfaces/AppointmentCreateRequest.interface";
import { useNavigate } from "react-router-dom";
import { User } from "../../../context/Context";
import CustomerService from "../../../services/customer.service";
import { Customer } from "../../../interfaces/Customer.interface";

interface TreatmentChooseTimeFormProps {
  salon?: Salon;
  treatment?: number | null;
  employees: Employee[];
  days: string[];
  onClose?: () => void;
  availableTimeSlots: Record<number, TimeSlot[]>;
  user?: User;
}

function TreatmentEmployeeChooseForm({
  salon,
  treatment,
  employees,
  days,
  onClose,
  availableTimeSlots: initialAvailableTimeSlots,
  user,
}: TreatmentChooseTimeFormProps) {
  const [selectedDay, setSelectedDay] = useState<number | "">("");
  const [selectedTime, setSelectedTime] = useState<number | "">("");
  const [selectedEmployee, setSelectedEmployee] = useState<number | "">("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const navigate = useNavigate();
  const [availableTimeSlots, setAvailableTimeSlots] = useState<Record<number, TimeSlot[]>>(initialAvailableTimeSlots);

  useEffect(() => {
    setAvailableTimeSlots(initialAvailableTimeSlots);
  }, [initialAvailableTimeSlots]);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await CustomerService.getCustomerByEmail(user?.email ?? '');
        if (response) {
          setCustomer(response.data); 
        } else {
          setCustomer(null);
        }
      } catch (err) {
      }
    };

    fetchCustomer();
  }, [user]);

  const adjustTime = (dateStr: string, hours: number) => {
    const date = new Date(dateStr);
    date.setHours(date.getHours() + hours);
    return date.toISOString();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedDay === "" || selectedTime === "" || selectedEmployee === "") {
      console.log("Please fill in all required fields.");
      return;
    }

    const timeSlot = availableTimeSlots[selectedDay][selectedTime];
    if (!timeSlot) {
      console.log("Invalid time slot selected.");
      return;
    }

    const appointmentData: AppointmentCreateRequest = {
      dateFrom: adjustTime(timeSlot.from, 2), 
      dateTo: adjustTime(timeSlot.to, 2), 
      treatmentId: treatment || -1,
      salonId: salon?.id || -1,
      employeeId: selectedEmployee,
      customerId: customer?.id || -1
    };

    try {
      await AppointmentService.createAppointments(appointmentData);
      
      setAvailableTimeSlots((prevSlots) => {
        const updatedSlots = { ...prevSlots };
        updatedSlots[selectedDay] = updatedSlots[selectedDay].filter(
          (_, index) => index !== selectedTime
        );
     
        if (updatedSlots[selectedDay].length === 0) {
          delete updatedSlots[selectedDay];
        }

        return updatedSlots;
      });

      if (onClose) {
        onClose();
      }
      navigate("/appointments");
    } catch (error) {
    }
  };

  return (
    <form className={styles.treatmentChooseTimeForm} onSubmit={handleSubmit}>
      <h2>Одбери термин</h2>
      <input type="hidden" name="salon" value={salon?.id} />
      <input type="hidden" name="treatment" value={treatment || ""} />

      <p>Одбери вработен</p>
      <select
        id="chooseEmployee"
        value={selectedEmployee}
        required
        onChange={(e) => setSelectedEmployee(Number(e.target.value))}
      >
        <option value="">Вработен</option>
        {employees.length > 0 ? (
          employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.firstName} {employee.lastName}
            </option>
          ))
        ) : (
          <option value="">Нема достапни вработени</option>
        )}
      </select>

      <p>Одбери датум</p>
      <select
        id="chooseDay"
        value={selectedDay}
        required
        onChange={(e) => setSelectedDay(Number(e.target.value))}
      >
        <option value="">Датум</option>
        {days.map((day, index) => (
          <option key={index} value={index}>
            {day}
          </option>
        ))}
      </select>

      <p>Одбери термин</p>
      <select
        id="time"
        name="time"
        value={selectedTime}
        required
        onChange={(e) => setSelectedTime(Number(e.target.value))}
      >
        <option value="">Термин</option>
        {typeof selectedDay === "number" &&
        availableTimeSlots[selectedDay] &&
        availableTimeSlots[selectedDay].length > 0 ? (
          availableTimeSlots[selectedDay].map((timeSlot, index) => (
            <option key={index} value={index}>
              {new Date(timeSlot.from)
                .toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })} - {new Date(timeSlot.to).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </option>
          ))
        ) : (
          <option value="">Нема достапни термини</option>
        )}
      </select>

      {onClose && (
        <button type="button" className="secondaryButton" onClick={onClose}>
          Откажи
        </button>
      )}
      <button type="submit" className="primaryButton">
        Резервирај
      </button>
    </form>
  );
}

export default TreatmentEmployeeChooseForm;
