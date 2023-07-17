import React from 'react';
import './App.css';
import TreeView from "./treeview/TreeView";
import json from "./sample/sample.js"

function App() {
    return (
        <div className="App">
            <TreeView json={json}/>
        </div>
    );
}

export default App;
