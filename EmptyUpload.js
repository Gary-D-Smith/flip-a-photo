import React, { useRef, useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from 'uuid';
import plus from './assets/vectors/plus.svg';
import { UploadedImage } from "./UploadedImage";
import { ImageSlider } from "./ImageSlider";
import skip from './assets/vectors/skip.svg'
import skipAll from './assets/vectors/skip-all.svg'
import leftArrow from './assets/vectors/left-nav-arrow.svg'
import rightArrow from './assets/vectors/right-nav-arrow.svg'
import gary from './assets/vectors/gary.svg'


export const EmptyUpload = () => {
    const imageRef = useRef()
    const [componentToDisplay, setComponentToDisplay] = useState("empty")
    const [images, setImages] = useState([])
    const [flipaphotos, setFlipaphotos] = useState([])
    const [isFront, setIsFront] = useState(true)
    const [imageCounter, setImageCounter] = useState(1)
    const [unassigned, setUnassigned] = useState([])
    const [unassignedFronts, setUnassignedFronts] = useState([])
    const [unassignedImages, setUnassignedImages] = useState([])
    const [completed, setCompleted] = useState(false)
    const [finish, setFinish] = useState(false)

    const formatFlipaphotos = useCallback(() => {
        const sorter = (a, b) => a.itemNumber > b.itemNumber ? 1 : -1
        const sortedImages = images.sort(sorter);
        // console.log("Sorted: ")
        // console.log(sortedImages)

        const formatted = []
        for (let index = 0; index < sortedImages.length; index++) {
            let back, backName, front, frontName, curImage, nextImage, nextItemNum;

            curImage = sortedImages[index]
            try {
                nextImage = sortedImages[index + 1];
                nextItemNum = nextImage.itemNumber
              } catch (error) {
                nextImage = null;
                nextItemNum = null
              }
            

            if (curImage.itemNumber === nextItemNum) {
                if (!curImage.isFront) {
                    back = curImage.path;
                    backName = curImage.name;
                    front = nextImage.path;
                    frontName = nextImage.path;
                } 
                else if (!nextImage.isFront) {
                    back = nextImage.path;
                    backName = nextImage.name;
                    front = curImage.path;
                    frontName = curImage.path;
                }

                formatted.push({ id: uuidv4(), 
                    front: front,
                    frontName: frontName,
                    back: back,
                    backName: backName,
                    description: null,
                });

                //  Since we took care of TWO images
                index++
            }
            else {
                formatted.push({ id: uuidv4(), 
                    front: curImage.path,
                    frontName: curImage.path,
                    back: null,
                    backName: null,
                    description: null,
                });
            }
        }

        // console.log("formatted: ")
        // console.log(formatted)
        setFlipaphotos(formatted)
    }, [images]);
    
    const handleFileChange = (event) => {
        if (!event.target.files) return;
        setComponentToDisplay("uploaded");
      
        let count = 0;
        let newImages = [];
        let newUnassignedImages = [];
        let newUnassignedFronts = [];
      
        for (let file of Array.from(event.target.files)) {
          const theID = uuidv4();
          count++;
          newImages.push({ id: theID, path: URL.createObjectURL(file), name: file.name, itemNumber: null, isFront: null });
        //   console.log(URL.createObjectURL(file));
          newUnassignedImages.push(theID);
          newUnassignedFronts.push(count);
        }
      
        setImages((currentImages) => [...currentImages, ...newImages]);
        setUnassignedImages((currentUnassignedImages) => [...currentUnassignedImages, ...newUnassignedImages]);
        setUnassignedFronts((currentUnassignedFronts) => [...currentUnassignedFronts, ...newUnassignedFronts]);
      };


    const handleClick = () => {
        imageRef.current.click();
    }

    // const checkCompleted = () => {
    //     console.log(unassignedFronts)
    //     console.log(unassignedImages)
    //     if (unassignedFronts.length === 0) {
    //         setComponentToDisplay("submittedPhotos")
    //     }
    // }

    const skipRemaining = () => {
        const nextImages = images.map(image => {
            if (image.itemNumber === null) {
                return {
                    ...image,
                    itemNumber: unassignedFronts.pop(),
                    isFront: true
                    
                };
            } else {
                return image;
            }
        })
        setImages(nextImages)
        // console.log("Skipped: ")
        // console.log(nextImages)

        setFinish(true)
    }

    const logChange = (removed, id, isFront, itemNumber) => {
        if (removed) {
          setUnassignedImages((prevImages) => prevImages.concat([id]));
          if (isFront) {
            setUnassignedFronts((prevFronts) => prevFronts.concat([itemNumber]));
          }
        } else {
          setUnassignedImages((prevImages) =>
            prevImages.filter((image) => image !== id)
          );
          if (isFront) {
            setUnassignedFronts((prevFronts) =>
              prevFronts.filter((front) => front !== itemNumber)
            );
          }
        }
        // console.log(completed)
      };
      
      useEffect(() => {
        // Run the function after state changes occur
        // console.log("length " + unassignedImages)
        // console.log("compoent " + componentToDisplay)
        if (completed && unassignedImages.length !== 0){
            setCompleted(false)
        }
        if ((unassignedImages.length === 0) && (componentToDisplay === "uploaded")) {
            // setComponentToDisplay("submittedPhotos")
            setCompleted(true)
        }
        if (finish) {
            formatFlipaphotos()
            setComponentToDisplay("photos")
        }
      }, [unassignedImages, completed, componentToDisplay, finish, formatFlipaphotos]);

    // const handleCompleted = () => {
        
    // }

    const nextPhoto = (props) => {
        // Props: key, isTheFront, itemNum, skip, unClick
        let toBeIsFront = isFront
        let toBeItemNumber = imageCounter
        let toSetIsFront = isFront
        let toSetImageCounter = imageCounter
        // console.log("here: " + props.unClick)

        // cannot skip fronts
        if(props.skip && isFront){
            return
        }

        if (props.unClick) {
            // Keep track of where it left off
            setUnassigned([...unassigned, 
                {itemNumber: imageCounter,
                isFront: isFront}])

            // Add the unclicked element
            toBeItemNumber = props.itemNum
            toBeIsFront = props.isTheFront
            //  set variabales are kept null
            toSetImageCounter = null
            toSetIsFront = null

        }

        // normal next image
        else {
            // console.log("unassinged" + unassigned)
            
            if(unassigned.length !== 0) {
                toBeIsFront = unassigned[unassigned.length-1].isFront
                toBeItemNumber = unassigned[unassigned.length-1].itemNumber
                
                setUnassigned(unassigned.slice(0, -1))
                // console.log("unassinged2" + unassigned)
            }
            
            else{
                if(props.skip){
                    toBeIsFront = true;
                    toBeItemNumber = imageCounter + 1
                }
                else {
                    toBeIsFront = !isFront
                    if(!isFront) {
                        toBeItemNumber = imageCounter + 1
                    }
                }
                
            }
            // console.log("nexted: " + toBeItemNumber)
        }


        setImageCounter(toBeItemNumber)
        setIsFront(toBeIsFront)


        if (props.skip !== true) {
            const nextImages = images.map(image => {
                if (image.id === props.key) {
                    return {
                        ...image,
                        itemNumber: toSetImageCounter,
                        isFront: toSetIsFront
                        
                    };
                } else {
                    return image;
                }
            })

            setImages(nextImages)
            if (toSetImageCounter === null) {
                logChange(true, props.key, props.isTheFront, props.itemNum)
            }
            else {
                logChange(false, props.key, toSetIsFront, toSetImageCounter)
            }

        }
    }

    return (
        <div>
            <div className="content">
            <div className={`header-wrapper ${(componentToDisplay !== "empty") ? "is-alone" : ""}`}>
                <div className={`title-box ${(componentToDisplay !== "empty") ? "is-alone" : ""}`}>
                    <h1 className={`title ${(componentToDisplay !== "empty") ? "is-alone" : ""}`}>Flip A Photo</h1>
                </div>
            </div>
            <div className={`footer-wrapper ${(componentToDisplay !== "empty") ? "is-alone" : ""}`}>
                <div className="by-Gary">
                    <h2 className={`by-text ${(componentToDisplay !== "empty") ? "is-alone" : ""}`}>by</h2>
                    <a href="https://www.garysmith.me/" target="_blank" rel="noopener noreferrer">
                    <img className={`gary-logo ${(componentToDisplay !== "empty") ? "is-alone" : ""}`} src={gary} alt="Gary Smith logo" /></a>
                </div>
            </div>
            <div className="redundant">
            { componentToDisplay === "empty" ? (
                <div>
                    <div id="interaction-section">
                        <img className="nav_arrows" src={leftArrow} alt="left navigation arrow" />
                        <div id="upload-area" 
                        style={{
                            background: "rgba(1, 91, 154, 0.08)",
                            border: "7px dashed #015B9A",
                            boxSizing: "border-box",
                            boxShadow: "4px 4px 28px rgba(0, 48, 81, 0.32)",
                            borderRadius: "20px",

                            paddingTop: "11vw",
                            paddingBottom: "11vw",
                            paddingLeft: "14vw",
                            paddingRight: "14vw",
                            textAlign: "center",
                        }}>
                            <input
                                ref={imageRef}
                                type="file" multiple
                                style={{ display: "none" }}
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <img 
                                onClick= {handleClick}
                                id="add_photos_icon" 
                                src={plus} 
                                alt="add photos icon" 
                            />
                            <h2>Upload Photos</h2>
                        </div>
                        <img className="nav_arrows" src={rightArrow} alt="right navigation arrow" />
                    </div>
                </div>
            )
            : componentToDisplay === "uploaded" ? (
                <div id="uploaded-area" 
                style={{
                    background: "white",
                    border: "7px solid #015B9A",
                    boxSizing: "border-box",
                    boxShadow: "4px 4px 28px rgba(0, 48, 81, 0.32)",
                    borderRadius: "20px",

                    paddingTop: "0vw",
                    paddingBottom: "1vw",
                    paddingLeft: "1vw",
                    paddingRight: "1vw",
                    textAlign: "center",
                    
                    height: "83vh",
                    width: "75vw",
                    overflow: "auto",
                    
                }}>
                    <div style = {{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "nowrap",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        alignContent: "stretch",
                        position: "sticky",
                        top: "0",
                        background: "white",
                        paddingBottom: "0.8vw",
                        paddingTop: "0.8vw",
                        zIndex: "15"
                    }}>
                        <div id="select-types" style={{
                            display: "flex",
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            alignContent: 'flex-start',
                        }}>
                            <div id="static-button" style={{
                                backgroundColor: "rgba(1, 91, 154, 1)",
                                color: "white"
                            }}>
                                Select Fronts & Backs
                            </div>
                            <div id="adj-button-right" onClick={() => skipRemaining()} style={{
                                backgroundColor: "rgba(196, 196, 196, 1)"
                            }}>
                                {/* Skip Remaining Icon */}
                                Skip Remaining
                                <img className="skip-icon" src={skipAll} alt="Skip Remaining Icon" style={{
                                    paddingLeft: "10px"
                                }}/>
                            </div>
                        </div>
                        
                        <div id="instructions" style={{
                            display: "flex",
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            alignContent: 'flex-start',
                        }}>
                            {!completed ? (
                                <div id="instructions-button" style={{
                                }}>
                                    { completed ? ("CONTINUE")
                                        : isFront ? ("SELECT FRONT #" + imageCounter)
                                        : ("SELECT BACK #" + imageCounter)
                                    }
                                </div>
                            )
                            : (
                                <div id="completed-button" onClick={() => setFinish(true)} style={{                                    
                                }}>
                                    CONTINUE
                                </div>
                            )
                        }

                            <div id="adj-button-right" onClick={() => nextPhoto({skip:true})} style={{
                                backgroundColor: "rgba(198, 113, 96, 1)",
                                color: "white",
                            }}>
                                {/* Skip Icon */}
                                <img className="skip-icon" src={skip} alt="Skip Icon" style={{
                                    paddingRight: "4px",
                                    paddingLeft: "8px"
                                }}/>
                            </div>
                        </div>
                    </div>
                    <div id="photos-wrapper"
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        alignItems: "center",
                        alignContent: "stretch",
                        }}>
                        {images.map((image) =>
                            <UploadedImage 
                            className="uploadedImage" 
                            image={image.path} 
                            name={image.name} 
                            isFront={image.isFront} 
                            nextPhoto={nextPhoto} 
                            itemNumber={image.itemNumber} 
                            key={image.id}
                            id={image.id} />
                        )}
                    </div>
                </div>
            )
            : componentToDisplay === "photos" ? (
                <ImageSlider images={flipaphotos}/>
            )
            : (<h1>ERROR</h1>)
            }
            </div>
            </div>
        </div>
    )
}

export default EmptyUpload;