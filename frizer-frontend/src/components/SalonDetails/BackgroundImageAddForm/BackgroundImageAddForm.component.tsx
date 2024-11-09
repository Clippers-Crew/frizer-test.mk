import React, { useRef, useState } from 'react'
import { Salon } from '../../../interfaces/Salon.interface';
import { User } from '../../../context/Context';
import SalonService from '../../../services/salon.service';
import styles from './BackgroundImagAddForm.module.scss'

interface BackgroundImageAddFormProps {
    salon?: Salon;
    user?: User;
    onImageAdd: (salon: Salon) => void;

}

function BackgroundImageAddForm({salon,user, onImageAdd}:BackgroundImageAddFormProps) {
   
    const [image, setImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isIconVisible, setIsIconVisible] = useState(true); 

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (image) {
            const formData = new FormData();
            formData.append('image', image);

            try {
                const response = await SalonService.addBackgroundImageToSalon(salon?.id ?? -1, image);
                setImage(null)
                onImageAdd(response.data);
                setIsIconVisible(true)
            } catch (error) {
            }
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0]);
            const formEvent = new Event('submit', { bubbles: true });
            const form = e.currentTarget.closest('form'); 
            form?.dispatchEvent(formEvent);
        }
        
    };

    const handleCancel = () => {
        setImage(null); 
        setIsIconVisible(true); 
    };

    const handleIconClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
            setIsIconVisible(false);

        }
    };

    return (
        <>
            {user?.id === salon?.ownerId && (
                <form className={styles.BackgroundImageAddForm} onSubmit={handleSubmit} encType="multipart/form-data" >
                    
                    <input
                        type="file"
                        name="image"
                        id="image"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        required
                    />
                      <button type="submit" className={`primaryButton ${styles.primaryButton}`}>Прикачи</button>
                </form>
            )}
        </>
    );
}

export default BackgroundImageAddForm
