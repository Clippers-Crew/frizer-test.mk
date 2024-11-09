import React from 'react'
import styles from './TreatmentDetailsItem.module.scss'
import { Treatment } from '../../../interfaces/Treatment.interface';
interface TreatmentDetailsItemProps {
    treatment?: Treatment;
  }
function TreatmentDetailsItem({treatment}:TreatmentDetailsItemProps) {
  return (
    <>
       <p className= {styles.serviceTitle}>{treatment?.name}</p>
       <p className= {styles.servicePrice}>{treatment?.price} МКД</p>
    </>
  )
}

export default TreatmentDetailsItem
