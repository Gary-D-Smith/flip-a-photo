import React, { useState } from "react"

export function UploadedImage({image, isFront, name, nextPhoto, itemNumber, id}) {
    const [selected, setSelected] = useState(false)
    let sideSting = "FRONT"
    if (isFront !== true) {
        sideSting = "BACK"
    }

    const handleClick = () => {
        if(!selected) {
            setSelected(true)
            nextPhoto({key:id, unClick:false})
        }
        else {
            setSelected(false)
            nextPhoto({key:id, isTheFront:isFront, itemNum:itemNumber, unClick:true})
        }
    }

    return (
        <div>
        {(
            <div 
            onClick={() => handleClick()}
            id = "photo"
            >
                <img 
                style={{maxWidth: "16vw", maxHeight: "15vw"}} 
                alt="User Uploaded"
                src={image}
                />
                <h3>{name}</h3>


                {selected && 
                <div
                style={{
                    zIndex : "2",
                    position : "absolute",
                    borderRadius: "10px",
                    width: "100%",
                    height: "100%",
                    top : "0",
                    left : "0",
                    backgroundColor: "black",
                    filter: "opacity(0.50)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <h2 style={{color:"white", paddingBottom:"25px"}} className="targeting-box">{sideSting} <br/> #{itemNumber}</h2>
                </div>}
            </div>
        )}
        </div>
    )
        }