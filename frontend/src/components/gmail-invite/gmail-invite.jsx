import { useState } from "react";
import "./gmail-invite.css"

const dummyUsers = [
    "alice@gmail.com",
    "bob@gmail.com",
    "charlie@gmail.com",
    "daniel@gmail.com",
    "daisy@gmail.com",
  ];

const GmailInvite = ({ open, onClose }) => {
    if (!open) return null; // ⛔ don't render if not open
  
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredEmails, setFilteredEmails] = useState([]);
  
    const handleSearch = (e) => {
      const value = e.target.value;
      setSearchTerm(value);
  
      const filtered = dummyUsers.filter((email) =>
        email.toLowerCase().includes(value.toLowerCase())
      );
  
      setFilteredEmails(filtered);
    };
  
    const handleInvite = (email) => {
      alert(`Invitation sent to ${email}`);
    };
  
    return (
      <div className="gmail-invite" >
        <button className="close-btn" onClick={onClose}>×</button>
        <input
          type="text"
          placeholder="Enter Gmail ID"
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />
  
        {searchTerm && filteredEmails.length > 0 && (
          <ul>
            {filteredEmails.map((email, index) => (
              <li className="email-list"
                key={index}
              >
                <span>{email}</span>
                <button onClick={() => handleInvite(email)}>Invite</button>
              </li>
            ))}
          </ul>
        )}
        {searchTerm && filteredEmails.length === 0 && (
          <p>No Gmail IDs matched</p>
        )}
      </div>
    );
  };
  export default GmailInvite;
  