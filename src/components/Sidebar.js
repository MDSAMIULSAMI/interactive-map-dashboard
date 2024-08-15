import React from 'react';

const Sidebar = ({ addresses }) => {
    return (
        <div style={{ width: '25%', height: '100vh', backgroundColor: '#f4f4f4', padding: '20px', overflowY: 'auto' }}>
            <h2>Location Details</h2>
            {addresses.length === 0 ? (
                <p>Draw a shape on the map to see details here.</p>
            ) : (
                <ul>
                    {addresses.map((address, index) => (
                        <li key={index}>{address}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Sidebar;
