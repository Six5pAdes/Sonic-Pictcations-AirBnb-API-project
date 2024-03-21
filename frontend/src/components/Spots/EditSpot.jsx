import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { editSpot } from "../../store/spot"
import './SpotForm.css'

const SpotUpdate = () => {
    const { spotId } = useParams()
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currSpot = useSelector(state => state.spotStore[spotId])

    const [country, setCountry] = useState(currSpot.country || "");
    const [address, setAddress] = useState(currSpot.address || "");
    const [city, setCity] = useState(currSpot.city || "");
    const [state, setState] = useState(currSpot.state || "");
    const [description, setDescription] = useState(currSpot.description || "");
    const [title, setTitle] = useState(currSpot.name || "");
    const [price, setPrice] = useState(currSpot.price || 0);
    // const [previewImage, setPreviewImage] = useState(currSpot.previewImage || "")
    // const [images, setImages] = useState({ 1: "", 2: "", 3: "", 4: "" });
    const [errors, setErrors] = useState({});
    const [submit, setSubmit] = useState(false)

    const handleSubmit = async e => {
        e.preventDefault()
        const err = {}
        setSubmit(true)

        if (!country) {
            err.country = "Country is required"
            setErrors(err)
            return err
        }
        if (!address) {
            err.address = "Address is required"
            setErrors(err)
            return err
        }
        if (!city) {
            err.city = "City is required"
            setErrors(err)
            return err
        }
        if (!state) {
            err.state = "State is required"
            setErrors(err)
            return err
        }
        if (description.length < 30) {
            err.description = "Description needs 30 or more characters"
            setErrors(err)
            return err
        }
        if (!title) {
            err.title = "Title is required"
            setErrors(err)
            return err
        }
        if (!price) {
            err.price = "Price per night is required"
            setErrors(err)
            return err
        }
        const spotData = { address, city, state, country, lat: 1, lng: 1, name: title, description, price }

        const spotUpdated = await dispatch(editSpot(spotData, spotId));
        if (spotUpdated.errors) {
            setErrors({ ...spotUpdated.errors, ...errors });
        } else {
            // Assuming `editSpot` action returns the updated spot data
            // Dispatch action to update spot in Redux store
            dispatch(editSpot(spotUpdated));
            // Navigate to the updated spot's details page
            navigate(`/spots/${spotUpdated.id}`);
        }
    }
    useEffect(() => {
        const validErrs = {}
        if (submit && !country) validErrs.country = "Country is required"
        if (submit && !address) validErrs.address = "Address is required"
        if (submit && !city) validErrs.city = "City is required"
        if (submit && description.length < 30) validErrs.description = "Description needs 30 or more characters"
        if (submit && !state) validErrs.state = "State is required"
        if (submit && !title) validErrs.title = "Title is required"
        if (submit && !price) validErrs.price = "Price per night is required"
        setErrors(validErrs)
    }, [country, address, city, description, state, title, price, submit])

    // const submitDisabled = false;

    return (
        <div id="spot-new">
            <form onSubmit={handleSubmit} id='full-form'>
                <h2>Update your Spot</h2>
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
                    {errors.country && <p className="err-msg" style={{ color: "red" }}>{errors.country}</p>}
                    <label className="spot-label">
                        Address
                        <input
                            type="text"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </label>
                    {errors.address && <p className="err-msg" style={{ color: "red" }}>{errors.address}</p>}
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
                        {errors.city && <p className="err-msg" style={{ color: "red" }}>{errors.city}</p>}
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
                        {errors.state && <p className="err-msg" style={{ color: "red" }}>{errors.state}</p>}
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
                    {errors.description && <p className="err-msg" style={{ color: "red" }}>{errors.description}</p>}
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
                    {errors.title && <p className="err-msg" style={{ color: "red" }}>{errors.title}</p>}
                </div>
                <div className="new-spot-form">
                    <label className="spot-label">
                        Set a base price for your spot
                        <small>
                            Competitive pricing can help your listing stand out and rank higher in search results.
                        </small>
                        <span>
                            $ <input
                                type="text"
                                placeholder="Price per night (USD)"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </span>
                    </label>
                    {errors.price && <p className="err-msg" style={{ color: "red" }}>{errors.price}</p>}
                </div>
                {/* <div className="new-spot-form" id="new-spot-images">
                    <label className="spot-label">
                        Liven up your spot with photos
                        <small>Submit a link to at least one photo to publish your spot.</small>
                        <input
                            type="text"
                            placeholder="Preview Image Url"
                            value={previewImage}
                            onChange={(e) => setPreviewImage(e.target.value)}
                        />
                        {/* {errors.previewImage && <p className="err-msg">{errors.previewImage}</p>}
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
                </div> */}

                <button id="submit-button" type="submit"
                // disabled={submitDisabled}
                >Update your Spot</button>
            </form>
        </div>
    )
}

export default SpotUpdate
