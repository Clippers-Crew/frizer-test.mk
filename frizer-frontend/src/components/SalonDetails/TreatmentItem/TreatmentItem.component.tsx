import React from 'react'
import { Treatment } from '../../../interfaces/Treatment.interface';
interface TreatmentItemProps {
    treatment: Treatment;
  }
  
function TreatmentItem({treatment}: TreatmentItemProps) {
  return (
    <button>{treatment.name}</button>
  )
}

export default TreatmentItem
