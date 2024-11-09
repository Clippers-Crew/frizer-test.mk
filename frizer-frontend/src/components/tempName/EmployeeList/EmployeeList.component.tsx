import React, { useEffect, useState } from 'react';
import { Salon } from '../../../interfaces/Salon.interface';
import { Employee } from '../../../interfaces/Employee.interface';
import EmployeeService from '../../../services/employee.service';
import styles from './EmployeeList.module.scss'
import EmployeeItem from '../EmployeeItem/EmployeeItem.component';
interface EmployeeListProps {
  salon?: Salon;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ salon }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const employeesIds =  salon?.employeesIds || [];

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
    <div className= {`${styles.employees}`}>
      <h1 className= {`${styles.title}`}>Вработени</h1>
      {employees.length === 0 ? (
        <p>Нема вработени</p>
      ) : (
        employees.map((employee: Employee) => (
          <EmployeeItem key={employee.id} employee={employee} />
        ))
      )}
    </div>
  );
};

export default EmployeeList;