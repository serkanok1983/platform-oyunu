import React, {useState, useEffect} from 'react';
import Canvas from './components/Canvas';

const App = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:5001/')
            .then((response) => response.json())
            .then((data) => setMessage(data.message));
    }, []);

    return (
        <div style={{textAlign: 'center', marginTop: '50px'}}>
            <h1>{message}</h1>
            <Canvas/>
        </div>
    );
};

export default App;