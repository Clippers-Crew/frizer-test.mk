import React, { useEffect, useState } from "react";
import styles from "./FeatureImages.module.scss";
import { Salon } from "../../../interfaces/Salon.interface";
import { ImagePosition } from "../../../enums/ImagePosition.enum";
import SalonService from "../../../services/salon.service";
import { RiAddCircleFill } from "react-icons/ri";
import ImageAddForm from "../ImageAddForm/ImageAddForm.component";
import { User } from "../../../context/Context";

type ImageMap = Partial<Record<ImagePosition, number | null>>;

interface FeatureImagesProps {
  salon?: Salon;
  user?: User;
  onImageAdd: (salon: Salon) => void;
}

function FeatureImages({ salon, user, onImageAdd }: FeatureImagesProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>();
  const [images, setImages] = useState<ImageMap>({
    [ImagePosition.FIRST]: null,
    [ImagePosition.SECOND]: null,
    [ImagePosition.THIRD]: null,
    [ImagePosition.FOURTH]: null,
  });

  useEffect(() => {
    console.log(salon);
    if (salon?.images && Object.keys(salon.images).length > 0) {
      const updatedImagesMap: ImageMap = { ...images };

      Object.entries(salon.images).forEach(([imageId, position]) => {
        const parsedImageId = Number(imageId);
        const imagePosition = position as ImagePosition;

        updatedImagesMap[imagePosition] = parsedImageId;
      });

      setImages(updatedImagesMap);
    }
  }, [salon]);

  function getSalonImageUrl(position: ImagePosition): string {
    const imagePosition = position as ImagePosition;
    if (salon && images[imagePosition]) {
      return SalonService.getSalonImageUrl(salon.id, images[position]!);
    } else {
      return `/assets/salons/default_salon_${1}.jpg`;
    }
  }

  return (
    <div className={styles.featuredImages}>
      {user?.id === salon?.ownerId && (
      <>
        <button
          className={styles.changeImageButton}
          title="Промени слика"
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          <RiAddCircleFill />
        </button>
        <div className={styles.overlay}></div>
      </>
    )}
      <div className={styles.primaryImage}>
        <img alt="Salon image" src={getSalonImageUrl(ImagePosition.FIRST)} />
      </div>
      <div className={styles.secondaryImage}>
        <img alt="Salon image" src={getSalonImageUrl(ImagePosition.SECOND)} />
      </div>
      <div className={styles.secondaryImage}>
        <img alt="Salon image" src={getSalonImageUrl(ImagePosition.THIRD)} />
      </div>
      <div className={styles.teritaryImage}>
        <img alt="Salon image" src={getSalonImageUrl(ImagePosition.FOURTH)} />
      </div>
      {isModalOpen && (
        <ImageAddForm
          salon={salon}
          user={user}
          onImageAdd={onImageAdd}
          onCloseButtonClick={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default FeatureImages;
