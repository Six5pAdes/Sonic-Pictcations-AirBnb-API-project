import { useState } from "react";
import { createSpot } from "../../store/spot";
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import './NewSpot.css'

const CreateSpot = () => {
    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState(0);
    const [previewImage, setPreviewImage] = useState()
    const [images, setImages] = useState({ 1: "", 2: "", 3: "", 4: "" });
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const handleSubmit = e => {
        e.preventDefault()
        const spot = { address, city, state, country, lat: 1, lng: 1, name: title, description, price, images: Object.values(images) }
        dispatch(createSpot(spot))
            .then(({ spot: newSpot }) => navigate(`/spots/${newSpot.id}`))
            .catch(async (response) => {
                const data = await response.json()
                if (data && data.errors) setErrors(data.errors)
            })
    }

    return (
        <div id="spot-new">
            <form onSubmit={handleSubmit} id='full-form'>
                <h2>Create a New Spot</h2>
                <div>
                    <h3>Where&apos;s your place located?</h3>
                    <p>Guests will only get your exact address once they booked a reservation.</p>
                    <label className="spot-label">
                        Country
                        <input
                            type="text"
                            placeholder="Country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        />
                    </label>
                    {errors.country && <p className="err-msg">{errors.country}</p>}
                    <label className="spot-label">
                        Address
                        <input
                            type="text"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </label>
                    {errors.address && <p className="err-msg">{errors.address}</p>}
                    <div id="city-and-state">
                        <label className="spot-label">
                            City
                            <input
                                type="text"
                                placeholder="City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </label>
                        {errors.city && <p className="err-msg">{errors.city}</p>}
                        <span id="comma">,</span>
                        <label className="spot-label">
                            State
                            <input
                                type="text"
                                placeholder="State"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                            />
                        </label>
                        {errors.state && <p className="err-msg">{errors.state}</p>}
                    </div>
                </div>
                <div className="new-spot-form">
                    <label className="spot-label">
                        Describe your place to guests
                        <small>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</small>
                        <textarea
                            placeholder="Please write at least 30 characters"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </label>
                    {errors.description && <p className="err-msg">{errors.description}</p>}
                </div>
                <div className="new-spot-form">
                    <label className="spot-label">
                        Create a title for your spot
                        <small>Catch guests&apos; attention with a spot title that highlights what makes your place special.</small>
                        <input
                            type="text"
                            placeholder="Name of your spot"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </label>
                    {errors.title && <p className="err-msg">{errors.title}</p>}
                </div>
                <div className="new-spot-form">
                    <label className="spot-label">
                        Set a base price for your spot
                        <small>
                            Competitive pricing can help your listing stand out and rank higher in search results.
                        </small>
                        <span>
                            $ <input
                                type="number"
                                placeholder="Price per night (USD)"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </span>
                    </label>
                    {errors.price && <p className="err-msg">{errors.price}</p>}
                </div>
                <div className="new-spot-form" id="new-spot-images">
                    <label className="spot-label">
                        Liven up your spot with photos
                        <small>Submit a link to at least one photo to publish your spot.</small>
                        <input
                            type="text"
                            placeholder="Preview Image Url"
                            value={previewImage}
                            onChange={(e) => setPreviewImage(e.target.value)}
                        />
                        {errors.previewImage && <p className="err-msg">{errors.previewImage}</p>}
                        <input
                            type="text"
                            placeholder="Image Url"
                            value={images[1]}
                            onChange={(e) => setImages({ ...images, [1]: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Image Url"
                            value={images[2]}
                            onChange={(e) => setImages({ ...images, [2]: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Image Url"
                            value={images[3]}
                            onChange={(e) => setImages({ ...images, [3]: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Image Url"
                            value={images[4]}
                            onChange={(e) => setImages({ ...images, [4]: e.target.value })}
                        />
                    </label>
                </div>

                <button id="submit-button" type="submit">Create Spot</button>
            </form>
        </div>
    )
}

export default CreateSpot;
