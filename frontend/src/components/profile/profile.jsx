import React from 'react';
import './profile.css';
import user from "../../assets/user.png"

const Profile = () => {
 
  const menuItems = ['Account Settings', 'Privacy', 'Notifications', 'Help & Support', 'Logout'];

  return (
    <div className="profile-container">
        <div className="profile-card">
            <img src={user} alt="profile" className="profile-image" />
            <p className="profile-name">Nesrin Noufal</p>
            <ul className="profile-menu">
            {menuItems.map((item, index) => (
                <li key={index} className="profile-menu-item">
                {item}
                </li>
            ))}
            </ul>
        </div>
    </div>
  );
};

export default Profile;
