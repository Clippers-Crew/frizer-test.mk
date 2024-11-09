import React from 'react';
import styles from './ReserveAppointmentForm.module.scss'
import { User } from '../../../context/Context';
import { useNavigate } from 'react-router-dom';
interface ReserveAppointmentFormProps {
  salonId?: number;
  treatmentId: number;
  onReserveClick: (treatmentId: number) => void;
  user?: User
}

function ReserveAppointmentForm({ salonId, treatmentId, onReserveClick, user }: ReserveAppointmentFormProps) {
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!user) { 
            navigate('/login'); 
    } else {
      onReserveClick(treatmentId); 
    }  };
  return (
    <form className={styles.reserveAppointmentForm}>
      <input type="hidden" name="salon" value={salonId} />
      <input type="hidden" name="treatment" value={treatmentId} />
      <button type="submit" className={`primaryButton`} onClick={handleClick}>
        Резервирај
      </button>
    </form>
  );
}

export default ReserveAppointmentForm;
