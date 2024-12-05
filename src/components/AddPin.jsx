import React, { useEffect, useState } from "react";
import { useMapEvents, Marker, Popup } from "react-leaflet";
import PopupForm from "./PopupForm";

import { RiDeleteBinLine } from "react-icons/ri";
import { useUser } from "@clerk/clerk-react";

const AddPin = ({ pins, setPins }) => {
  const { user } = useUser(); // get the user's username from clerk
  const [user1, setUser1] = useState([]); //to get userId for fetchPin and POST pins (in URL)
  //fetch the user's data based on the username, pass user as param
  useEffect(() => {
    const fetchUser = async (user) => {
      try {
        const response = await fetch(
          `http://localhost:3000/user/${user.id}`
        );
        const data = await response.json();
        setUser1(data);
      } catch (error) {
        console.error("Error fetching users's info:", error);
      }
    };
    fetchUser(user);
  }, []);
  const userId = user1.userId;

  //display the saved pins
  const [showPins, setShowPins] = useState([]);
  // Form datas for saving pins
  const [pinData, setPinData] = useState({
    country: "",
    city: "",
    startDate: "",
    lat: "",
    lng: "",
    endDate: "",
    notes: "",
    userId: userId,
  });

  //uses click function to enable users to click on the map to get the location(lat and lng)
  useMapEvents({
    click(e) {
      //destructure the lat and lng from e
      const { lat, lng } = e.latlng;
      // add the location into pins plus any previous added pins
      setPinData((prevPin) => ({ ...prevPin, lat, lng }));
      setPins((prevPins) => [...prevPins, { lat, lng }]);
    },
  });

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPinData((prevPin) => ({
      ...prevPin,
      [name]: value,
    }));
  };

  //fectch the UserPin data from the backend
  const fetchPins = async () => {
    try {
      const response = await fetch(`http://localhost:3000/pins/${userId}`);
      const data = await response.json();
      setShowPins(data);
    } catch (error) {
      console.error("Error fetching pins:", error);
    }
  };

  //to call the fetchPins
  useEffect(() => {
    fetchPins();
  }, [showPins]);

  // Handle form submission for creating a new pin
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/savePin/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pinData),
      });

      if (response.ok) {
        setPinData({
          country: "",
          city: "",
          startDate: "",
          lat: "",
          lng: "",
          endDate: "",
          notes: "",
          userId: userId,
        }); // reset form
        fetchPins(); // refetch the pins
      } else {
        console.error("Error creating pin:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating pin:", error);
    }
  };

  // Handle deleting a SAVED pin by id
  const handleDelete = async (pin) => {
    try {
      const response = await fetch(`http://localhost:3000/pins/${pin.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchPins(); // refetch the pins after deletion
      } else {
        console.error("Error deleting pin:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting pin:", error);
    }
  };

  //when adding the pin, the form will automatically pop up
  const openPopup = (e) => {
    e.target.openPopup();
  };

  return (
    <>
      {/* display the no-filled-pins and the form on the map */}
      {pins.length > 0 &&
        pins.map((pin, idx) => (
          <Marker
            key={idx}
            position={pin}
            eventHandlers={{
              add: openPopup,
            }}
          >
            <Popup>
              <PopupForm
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                pinData={pinData}
                pin={pin}
                setPins={setPins}
              />
            </Popup>
          </Marker>
        ))}

      {/* Returns the saved pins */}
      {showPins.map((pin, idx) => {
        return (
          <Marker key={idx} position={[pin.lat, pin.lng]}>
            {/* Popup or additional information can be added here if necessary */}
            <Popup>
              <div className="flex flex-col">
                {/* Delete pin button */}
                <button
                  className=" text-red-700"
                  onClick={() => {
                    handleDelete(pin); // Delete the specific pin by id
                  }}
                  type="button"
                >
                  <RiDeleteBinLine className="size-4" />
                </button>
                <p>Country: {pin.country}</p>
                <p>City: {pin.city}</p>
                <p>Notes: {pin.notes} </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default AddPin;
