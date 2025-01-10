import { useState, useEffect } from "react";

function Self() {

    interface UserData {
        firstName: string | null;
        lastName: string | null;
        name: string | null;
        email: string | null;
        avatar?: string | null; // Optional field in case avatar might be missing
    }
    
    const [userData, setUserData] = useState<UserData | null>(null);
    const [image, setImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    
    useEffect(() => {
        // Fetch user data from the backend
        const fetchUserData = async () => {
            const response = await fetch("/api/user/me", {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                setUserData(data); // Store user data, including image URL
            }
        };

        fetchUserData();
    }, []);

    // Handle image file selection
    const handleImageChange = (e: { target: { files: any[]; }; }) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handleUpload = async () => {
        if (!image) {
            alert("Please select an image first");
            return;
        }

        const formData = new FormData();
        formData.append("file", image);

        setIsUploading(true);

        try {
            const response = await fetch("/api/User/uploadProfileImage", {
                method: "POST",
                body: formData,
                credentials: "include", // Include cookies for authentication
            });

            if (response.ok) {
                const data = await response.json();

                // Update user data with the new avatar, ensuring we are properly handling null values
                setUserData((prevData) => ({
                    ...prevData, // Preserve previous data if exists
                    avatar: data.imageUrl, // Set the new avatar URL
                    // If other properties may be missing, ensure they default to previous values if available
                    firstName: prevData?.firstName ?? null,
                    lastName: prevData?.lastName ?? null,
                    name: prevData?.name ?? null,
                    email: prevData?.email ?? null,
                }));

                alert("Profile image uploaded successfully!");
            } else {
                alert("Image upload failed!");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Something went wrong while uploading the image.");
        } finally {
            setIsUploading(false);
        }
    };


    return (
        <div className="profile-container">
            <h1>{userData?.name || "User"}</h1>
            <div className="profile-info">
                <img
                    src={userData?.avatar || "/avatars/default-avatar.jpg"} // Fallback to default avatar if no image is available
                    alt={userData?.name || "User Avatar"}
                    className="profile-image"
                    width="150"
                    height="150"
                />
                <div className="profile-details">
                    <p>Email: {userData?.email || "user@example.com"}</p>
                    <p>Username: {userData?.name || "User123"}</p>
                </div>
            </div>

            {/* Image upload form */}
            <div className="image-upload">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isUploading}
                />
                <button onClick={handleUpload} disabled={isUploading}>
                    {isUploading ? "Uploading..." : "Upload Profile Image"}
                </button>
            </div>
        </div>
    );
}

export default Self;
