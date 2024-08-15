import React, { useState } from 'react';
import MapComponent from './components/Map';
import Sidebar from './components/Sidebar';
import './App.css';

const App = () => {
    const [addresses, setAddressData] = useState([]);
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar addresses={addresses} />
            <MapComponent setAddressData={setAddressData} />
        </div>
    );
};

export default App;
