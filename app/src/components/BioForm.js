// BioForm.js
import React, { useState } from "react";


const BioForm = ({ userId, currentBio, onUpdateBio }) => {
  const [newBio, setNewBio] = useState(currentBio);
  const [editMode, setEditMode] = useState(false);

  const handleUpdateBio = async () => {
    try {
      console.log("Updating bio:", newBio);
  
      const response = await fetch(`/user/updateBio`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bio: newBio,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Bio update successful:", data);
        onUpdateBio(data.bio);
        setEditMode(false);
      } else {
        console.error(`Error updating bio: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  


  return (
    <div>
      <h3></h3>
      {editMode ? (
        <>
          <textarea
            value={newBio}
            onChange={(e) => setNewBio(e.target.value)}
          />
          <button onClick={handleUpdateBio}>Save Bio</button>
        </>
      ) : (
        <p>{currentBio}</p>
      )}
      <button onClick={() => setEditMode(!editMode)}>
        {editMode ? "Cancel" : "Edit Profile"}
      </button>
    </div>
  );
};

export default BioForm;
