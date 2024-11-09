import React, { useState } from "react";
import { Salon } from "../../../interfaces/Salon.interface";
import { User } from "../../../context/Context";
import styles from "./ImageAddForm.module.scss";
import SalonService from "../../../services/salon.service";
import { RiCloseCircleLine } from "react-icons/ri";
import { FaCloudUploadAlt } from "react-icons/fa";

interface ImageAddFormProps {
  salon?: Salon;
  user?: User;
  onImageAdd: (salon: Salon) => void;
  onCloseButtonClick: () => void;
}
function ImageAddForm({
  salon,
  user,
  onImageAdd,
  onCloseButtonClick,
}: ImageAddFormProps) {
  const [image, setImage] = useState<File | null>(null);
  const [imageNo, setImageNo] = useState<number>(1);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImage(files[0]);
    }
  };

  const handleImageNoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setImageNo(Number(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (image) {
      const formData = new FormData();
      formData.append("image", image);

      try {
        const response = await SalonService.addImageToSalon(
          salon?.id ?? -1,
          image,
          imageNo
        );
        setImage(null);
        onImageAdd(response.data);
        onCloseButtonClick();
      } catch (error) {}
    }
  };

  const handleClose = () => {
    setImage(null);
    onCloseButtonClick();
  };

  return (
    <>
      {user?.id === salon?.ownerId && (
        <div className={styles.imageFormContainer}>
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className={styles.imageForm}
          >
            <button
              className={styles.closeButton}
              title="Затвори ја формата."
              onClick={handleClose}
              type="button"
            >
              <RiCloseCircleLine />
            </button>
            <h2>Прикачи слика</h2>
            <div className={styles.imageNoContainer}>
              <label htmlFor="imageNo">Број на слика: </label>
              <select
                name="imageNo"
                id="imageNo"
                value={imageNo}
                onChange={handleImageNoChange}
              >
                <option value="1">Слика 1</option>
                <option value="2">Слика 2</option>
                <option value="3">Слика 3</option>
                <option value="4">Слика 4</option>
              </select>
            </div>
            <label htmlFor="file-upload" className={styles.customFileUpload}>
              <FaCloudUploadAlt /> Избери слика
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleImageChange}
              required
            />
            <span id={styles.fileName}>
              {image ? image.name : "Нема избрано слика"}
            </span>
            <button
              type="submit"
              className={`primaryButton ${styles.primaryButton}`}
            >
              Прикачи слика
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default ImageAddForm;
