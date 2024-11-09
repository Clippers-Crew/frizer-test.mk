import React, { useState } from "react";
import styles from "./SalonBaseInfo.module.scss";
import { Salon } from "../../../interfaces/Salon.interface";
import { FaLocationDot } from "react-icons/fa6";
import { User } from "../../../context/Context";
import SalonService from "../../../services/salon.service";
import { Customer } from "../../../interfaces/Customer.interface";
import { useNavigate } from "react-router-dom";
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineHeart,
} from "react-icons/ai";
import { RiAddCircleFill } from "react-icons/ri";
import BackgroundImageAddForm from "../BackgroundImageAddForm/BackgroundImageAddForm.component";

interface SalonBaseInfoProps {
  salon?: Salon;
  user?: User;
  onAddToFavourites: (salon: Salon) => void;
  onRemoveFromFavourites: (salonId: number) => void;

  customer: Customer | undefined | null;
}

function SalonBaseInfo({
  salon: initialSalon,
  user,
  onAddToFavourites,
  customer,
  onRemoveFromFavourites,
}: SalonBaseInfoProps) {
  const [salon, setSalon] = useState<Salon | undefined>(initialSalon);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  function getBackgroundImage(): string {
    return salon?.backgroundImage
      ? SalonService.getSalonImageUrl(salon.id, salon.backgroundImage)
      : "/assets/salons/salon_image.png";
  }

  const handleImageAdd = async (updatedSalon: Salon) => {
    if (salon) {
      const newSalon: Salon = {
        ...salon,
        backgroundImage: updatedSalon.backgroundImage ?? salon.backgroundImage,
      };
      setSalon(newSalon);
    }
    setIsModalOpen(false);
  };

  const handleAddToFavourites = async (
    event: React.MouseEvent<SVGElement>
  ): Promise<void> => {
    event.preventDefault();
    try {
      if (!user) {
        navigate("/login");
      }
      if (user && salon) {
        const response = await SalonService.addSalonToFavourites(salon.id);
        onAddToFavourites(salon);
      }
    } catch (error) {
      console.error("Failed to add salon to favourites:", error);
    }
  };

  const handleRemoveFromFavourites = async (
    event: React.MouseEvent<SVGElement>
  ): Promise<void> => {
    event.preventDefault();
    try {
      if (user && salon) {
        const response = await SalonService.removeSalonFromFavourites(salon.id);
        onRemoveFromFavourites(salon.id);
      }
    } catch (error) {
      console.error("Failed to remove salon to favourites:", error);
    }
  };

  return (
    <div className={styles.salonProfile}>
      <div className={styles.row}>
        <div className={styles.backgroundImage}>
          {user?.id === salon?.ownerId && (
            <>
              <div className={styles.overlay}></div>
              <button
                title="Промени слика"
                onClick={() => setIsModalOpen(!isModalOpen)}
              >
                <RiAddCircleFill />
              </button>
            </>
          )}
          <img
            src={getBackgroundImage()}
            alt={`${salon?.name} background image`}
          />
        </div>
        <div>
          <h1>{salon?.name}</h1>
          {salon &&
          customer &&
          customer.favouriteSalonsIds.includes(salon.id) ? (
            <AiFillHeart
              className={`${styles.heartIcon} ${styles.addedToFavorites}`}
              onClick={handleRemoveFromFavourites}
            />
          ) : (
            <AiOutlineHeart
              className={styles.heartIcon}
              onClick={handleAddToFavourites}
            />
          )}
        </div>
      </div>

      <div className={styles.row}>
        <div>
          <FaLocationDot /> { }
          <span>{salon?.location}</span>
        </div>
        <div>
          <AiFillStar className={styles.starIcon} />
          <span>
            {salon?.rating.toPrecision(2)} { }
            {salon && salon.numberOfReviews === 1
              ? `(${salon?.numberOfReviews} рецензија)`
              : `(${salon?.numberOfReviews} рецензии)`}
          </span>
        </div>
      </div>

      {isModalOpen && (
        <BackgroundImageAddForm
          salon={salon}
          user={user}
          onImageAdd={handleImageAdd}
          onCloseButtonClick={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default SalonBaseInfo;
