let canvas=document.querySelector("#board");
let tool=canvas.getContext("2d");
let toolContainer=document.querySelector(".tool-container");

// //tools
let allTools=document.querySelectorAll(".tool");
let toolSelected=0;
let toolState=0;

// //pencil
let pencil=document.querySelector("#pencil");
let mouseDown;

// //pencil-Formatting tool

let pencilFormatTool=document.querySelector(".formatting-tool");
let formatToolState=false;
let lineWidth = document.querySelector(".line-width");
let allColorEle = document.querySelectorAll(".color");
let lineWidthEle = document.querySelector("#pencil-line-width");


// //Eraser

let eraser=document.querySelector("#eraser");
let eraserMouseDownStete;
let old;// store coordinates
let eraserFormatTool=document.querySelector(".eraser-formatting-tool");
let eraserToolState=false;
let eraserWidthEle=document.querySelector("#eraser-line-width");

 //zoom
let zoomIn=document.querySelector("#zoom-in");
let zoomOut=document.querySelector("#zoom-out");
let zoomLevel=1;



// //undo-redo
let undo=document.querySelector("#undo");
let redo=document.querySelector("#redo");
let undoRedoArr=[];//store canvas copy after each operation
let undoRedoIdx=-1;//current index of above above array     


canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
undoRedoArr.push(canvas); // Initially adding canvas
undoRedoIdx++;


//________________________________ pencil operation


pencil.addEventListener("click",function(e){
    hideFormatTool(eraserFormatTool);//hides eraser tool
    toolActive(e.currentTarget);// set Active-State
    defaultStateFormatTool();// set default format- tool state
    mouseDown=false;
    toolState=1;  //pencil
    //    reset undo-redo array

    if(undoRedoIdx>=0 && undoRedoIdx<=undoRedoArr.length-1){
        undoRedoArr.splice(undoRedoIdx+1);
    }
 
    document.addEventListener("mousedown", pencilMouseDown);
    document.addEventListener("mousemove", pencilMouseMove);
    document.addEventListener("mouseup", pencilMouseUp);

})
// // hanlde-pencil MouseDown, MouseMove and MouseUp

function pencilMouseDown(e){
    if(toolState==1){
        mouseDown=true;
        tool.beginPath();
        let x=e.clientX;
        let y=e.clientY;
        tool.moveTo(x,y);
    }
}
function pencilMouseMove(e){
    if(toolState==1){
        if(mouseDown){
            let x=e.clientX;
            let y=e.clientY;
            tool.lineTo(x,y);
            tool.stroke();                                          
        }
    }
}

function pencilMouseUp(e){
    if(toolState==1){
        mouseDown=false;
        //store current-canvas copy
        let canvasCopy=copyOfCanvas(canvas);
        undoRedoArr.push(canvasCopy);
        undoRedoIdx++;
        
    }
}

//________________________________________pencil formatting tools

// make  format tool visible and invisible
pencil.addEventListener("dblclick",function(e){
    defaultStateFormatTool();
    if(formatToolState==false){
        displayFormatTool(pencilFormatTool);
    }else{
        hideFormatTool(pencilFormatTool);
    }
    formatToolState=!formatToolState;
})
// handle-click on all color elements

allColorEle.forEach(colorEle=>{
   // click on each color-element
   colorEle.addEventListener("click",function(e){
         removeColorActiveState();
         let colorElement = e.currentTarget;
         colorElement.classList.add("color-active"); ///active state
         tool.strokeStyle = colorElement.getAttribute("colorValue"); //set color
   });
});

//  set Line-width
lineWidth.addEventListener("change",function(e){
     tool.lineWidth=lineWidth.valueAsNumber;
})

// colors in pencil formatting state

function removeColorActiveState(){
    allColorEle.forEach(color=>{
        color.classList.remove("color-active");
    });
}

// to display formatting tool of <pencil />
function displayFormatTool(formattingTool){
    formattingTool.style.display="block";
}

// to hide formatting tool of pencil/eraser

function hideFormatTool(formattingTool){
    formattingTool.style.display="none";
}

//set default state of pencil-formatting tool
function defaultStateFormatTool(){
    removeColorActiveState();
    allColorEle[0].classList.add("color-active"); // red-color default
    tool.strokeStyle="red"; // default
    tool.lineWidth="5"; // default
    lineWidth.value=5;                   
}
//_____________________________________________ Eraser-tool

eraser.addEventListener("click",function(e){
    hideFormatTool(pencilFormatTool);
    toolActive(e.currentTarget);
    toolState=2; // Eraser
    tool.innerWidth="5"; // default
    eraserWidthEle.value=5 ;// default
    // Reset undo-redo array;
    if(undoRedoIdx>=0 && undoRedoIdx<=undoRedoArr.length-1){
        undoRedoArr.splice(undoRedoIdx+1);
    } 
    document.addEventListener("mousedown",eraserMouseDown);
    document.addEventListener("mousemove",eraserMouseMove);
    document.addEventListener("mouseup",eraserMouseUp);
})

function eraserMouseDown(e){
    if(toolState==2){  //check tool state
          eraserMouseDownState=true;
          old={x:e.clientX, y:e.clientY};

    }
}

function eraserMouseMove(e){
    if(toolState==2){
        if(eraserMouseDownState){
            let x=e.clientX;
            let y=e.clientY;
            // eraser content-code
            // to give eraser a cirlce-shape
            tool.globalCompositeOperation='destination-out';
            tool.beginPath();
            tool.arc(x,y,tool.lineWidth,0,2*Math.Pi);
            tool.fill();
           //to erase it in a line
            tool.beginPath();
            tool.moveTo(old.x,old.y);
            tool.lineTo(x,y);
            tool.stroke();
            old={x:x,y:y};
        }
    }
}

function eraserMouseUp(e){
    if(toolState==2){
        eraserMouseDownState=false;
        tool.globalCompositeOperation='source-over';// reset
        let canvasCopy=copyOfCanvas(canvas);
        undoRedoArr.push(canvasCopy);
        undoRedoIdx++;
    }
}

// make format tool visible and invisible

eraser.addEventListener("dblclick",function(e){
    tool.lineWidth="5" // default;
    eraserWidthEle.value=5; // default;
    if(eraserToolState==false){
        displayFormatTool(eraserFormatTool);
    }else{
        hideFormatTool(eraserFormatTool);
    }
    eraserToolState=!eraserToolState;
})

// set Eraser Line-width
eraserWidthEle.addEventListener("change",function(e){
    tool.lineWidth=eraserWidthEle.valueAsNumber;
})

zoomIn.addEventListener("click",function(e){
    // Reset undo-redo Array
    if(undoRedoIdx>=0 && undoRedoIdx<=undoRedoArr.length-1){
        undoRedoArr.splice(undoRedoIdx+1);
    }
    hideFormatTool(pencilFormatTool); // hides the pencil formatting tool
    hideFormatTool(eraserFormatTool); // hide  the eraser formatting tool
    toolActive(e.currentTarget);
    toolState=3; // Zoom_in
    if(toolState==3){
        zoomLevel=1.05;
        //copy canvas to another canvas
        let canvasCopy=copyOfCanvas(canvas);
        //ckear canvas;
        tool.clearRect(0,0,canvas.width,canvas.height);
        // zoom
        tool.scale(zoomLevel,zoomLevel);
        // center zoom
        let x=(canvas.width/zoomLevel-canvas.width)/2;
        let y=(canvas.width/zoomLevel-canvas.height)/2;
        // draw Again(Paste)
        tool.drawImage(canvasCopy,x,y);
        // Reset zoom i.e, scale()
        tool.setTransform(1,0,0,1,0,0);
    }
})

zoomOut.addEventListener("click",function(e){
    // Reset undo-redo Array
    if(undoRedoIdx>=0 && undoRedoIdx<=undoRedoArr.length-1){
        undoRedoArr.splice(undoRedoIdx+1);
    }
    hideFormatTool(pencilFormatTool);
    hideFormatTool(eraserFormatTool);
    toolActive(e.currentTarget);
    toolState=4; // zoom-out
    if(toolState==4){
        zoomLevel=0.95;
        // copy canvas to another canvas
        let canvasCopy=copyOfCanvas(canvas);
        // clear canvas
        tool.clearRect(0,0,canvas.width,canvas.height);
        //zoom 
        tool.scale(zoomLevel,zoomLevel);
        // center-zoom
        let x=(canvas.width/zoomLevel-canvas.width)/2;
        let y=(canvas.height/zoomLevel-canvas.height)/2;
        // draw again(Paster)
        tool.drawImage(canvasCopy,x,y);
        // Reset Zoom i.e, scale()
        tool.setTransform(1,0,0,1,0,0);

    }
})



//Make Copy of Canvas
function copyOfCanvas(canvas){
    let canvasCopy=document.createElement("canvas");
    canvasCopy.width=window.innerWidth;
    canvasCopy.height=window.innerHeight;
    let newTool=canvasCopy.getContext("2d");
    newTool.drawImage(canvas,0,0);
    return canvasCopy;
}

// set Tool to Active - State
function toolActive(currTool){
    // Remove Active -Class
    allTools.forEach(tool=>{
        tool.classList.remove("tool-active");
    });
    //set Active -Class
    currTool.classList.add("tool-active");
}


 //__________________________________ undo -redo operation

undo.addEventListener("mousedown",function(e){
    hideFormatTool(pencilFormatTool);
    hideFormatTool(eraserFormatTool);
    toolState=5;
    toolActive(e.currentTarget);
    if(undoRedoIdx>0){
        undoRedoIdx--;
        let canvasCopy=undoRedoArr[undoRedoIdx];
        // clear current-canvas and draw the previous state of canvas
        tool.clearRect(0,0,canvas.width,canvas.height);
        tool.drawImage(canvasCopy,0,0);
    }
})

redo.addEventListener("mousedown",function(e){
    hideFormatTool(pencilFormatTool);
    hideFormatTool(eraserFormatTool);
    toolState=6;
    toolActive(e.currentTarget);
    if(undoRedoIdx< undoRedoArr.length-1){
        undoRedoIdx++;
        let canvasCopy=undoRedoArr[undoRedoIdx];
        //clear current -canvas and draw the previous state of canvas
        tool.clearRect(0,0,canvas.width,canvas.height);
        tool.drawImage(canvasCopy,0,0);
    }
})
