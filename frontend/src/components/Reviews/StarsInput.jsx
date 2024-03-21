import { useState } from "react";
// import { FaRing } from "react-icons/fa6";

const StarsRatingInput = ({ stars, setStars }) => {
    const [activeRating, setActiveRating] = useState(0)

    const handleRatingClick = (rating) => {
        setActiveRating(rating);
        setStars(rating);
    };

    const renderStars = () => {
        const starElements = [];
        for (let i = 1; i <= 5; i++) {
            starElements.push(
                <div
                    key={i}
                    onClick={() => handleRatingClick(i)}
                    onMouseEnter={() => setActiveRating(i)}
                    onMouseLeave={() => setActiveRating(stars)}>
                    <i className={`${activeRating >= i ? "fas" : "far"} fa-ring`}></i>
                </div>
            );
        }
        return starElements;
    };

    return (
        <>
            <div className="stars-input">
                {renderStars()}
            </div>
        </>
    );
};

export default StarsRatingInput;
