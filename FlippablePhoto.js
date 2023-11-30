import React, { useState, useRef, useEffect } from "react";
import editIcon from './assets/vectors/edit.svg';
import check from './assets/vectors/check.svg';

export function FlippablePhoto({ front, frontName, back, backName, description }) {
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [backIsEditable, setBackIsEditable] = useState(false);
  const [editStatus, setEditStatus] = useState(editIcon);

  const frontImageRef = useRef(null);
  const emptyBackRef = useRef(null);

  const handleCardFlip = () => {
    if (!backIsEditable) {
      setIsCardFlipped(!isCardFlipped);
    }
  };

  const handleEdit = () => {
    setBackIsEditable(!backIsEditable);
    setEditStatus(backIsEditable ? editIcon : check);

    if (emptyBackRef.current) {
      emptyBackRef.current.readOnly = !backIsEditable;
    }
  };

  useEffect(() => {
    if (backIsEditable) {
      emptyBackRef.current.focus();
    }
  }, [backIsEditable]);

  const handleInputChange = () => {
    if (emptyBackRef.current) {
      const textarea = emptyBackRef.current;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (emptyBackRef.current) {
      const textarea = emptyBackRef.current;
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, []);

  return (
    <div>
      <div className={`card js-card ${isCardFlipped ? "is-switched" : ""}`}>
        <div className="card__wrapper">
          <div onClick={handleCardFlip} className={`card__side ${isCardFlipped ? "is-active" : ""}`}>
            <img
              ref={frontImageRef}
              src={front}
              alt={frontName}
              className="swiper_image"
            />
          </div>
          <div className={`card__side card__side--back ${isCardFlipped ? "" : "is-active"}`}>
            {back !== null ? (
              <img onClick={handleCardFlip} src={back} alt={backName} className="swiper_image" />
            ) : (
              <div className="back_wrapper">
                <img src={front} alt={backName} className="swiper_image" />
                <div className="empty_back" onClick={handleCardFlip}>
                  <textarea
                    className="back-textarea"
                    placeholder="Add a note by clicking the edit button below!"
                    ref={emptyBackRef}
                    readOnly={!backIsEditable}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <img 
                  onClick={handleEdit} 
                  className="edit-icon" 
                  src={editStatus} 
                  alt="Skip Remaining Icon" 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
