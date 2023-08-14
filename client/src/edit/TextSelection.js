import { Button } from '@mui/material';
import React, { useState } from 'react';
function TextSelection(props) {
    const [selectedText, setSelectedText] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    function handleSelection(x, y) {
        const selection = window.getSelection();
        if (selection && selection.toString()) {
            setSelectedText(selection.toString().trim());
            setMenuPosition({ x: x - 50, y: y });
            setMenuVisible(true);
        } else {
            setSelectedText(null);
            setMenuVisible(false);
        }
    }

    return (
        <div
            onMouseUp={(event) => {
                handleSelection(event.nativeEvent.layerX, event.nativeEvent.layerY)
            }}
            onMouseLeave={() => { setMenuVisible(false) }}
        >
            <p>
                {props.interview_data.toString()}
            </p>
            {menuVisible && (
                <div style={{ position: 'absolute', top: menuPosition.y, left: menuPosition.x, display: "block" }}>
                    <ul>
                        <Button
                            variant='contained'
                            onClick={() => {
                                setMenuVisible(false)
                                props.addKeyword(selectedText)
                            }}
                        >
                            Add as support
                        </Button>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default TextSelection;
