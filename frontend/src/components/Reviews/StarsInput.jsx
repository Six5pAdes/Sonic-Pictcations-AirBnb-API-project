import { useState } from "react";
import { FaRing } from "react-icons/fa6";

const StarsRatingInput = ({ rating, disabled, onChange }) => {
    const [activeRating, setActiveRating] = useState(rating)

    const handleIconClick = (iconIndex) => {
        if (!disabled) {
            onChange(iconIndex)
            setActiveRating(iconIndex)
        }
    }

    const howManyStars = () => {
        const ringIcons = []
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                const filled = i <= activeRating
                ringIcons.push(
                    <div
                        key={i}
                        className={filled ? 'filled' : 'empty'}
                        onClick={() => handleIconClick(i)}
                        style={{ cursor: disabled ? 'default' : 'pointer' }}
                    ><FaRing /></div>)
            } else {
                ringIcons.push(
                    <div
                        key={i}
                        className='empty'
                    ><FaRing /></div>)
            }
        }
        return ringIcons;
    }

    return (
        <>
            <input
                type="number"
                disabled={disabled}
                value={rating}
                onChange={onChange}
            />
            <div className='rating-input'>
                {howManyStars()}
            </div>
        </>
    );
};

export default StarsRatingInput;
