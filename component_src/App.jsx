import React from 'react';

class App extends React.Component {
    componentDidMount() {
        this.drawing();
    }
    
    drawing(){ 
        let canvas, context, canvaso, contexto;     
         // The active tool instance.
        var tool;
        var tool_default = document.getElementById('dtool').value;
        
          function init () {
                // Find the canvas element.
                canvaso = document.getElementById('drawing');

                // Get the 2D canvas context.
                contexto = canvaso.getContext('2d');

                // Add the temporary canvas.
                var container = canvaso.parentNode;
                canvas = document.createElement('canvas');
                canvas.id     = 'drawingTemp';
                canvas.width  = canvaso.width + 100;
                canvas.height = canvaso.height + 100;
                container.appendChild(canvas);

                context = canvas.getContext('2d');

                // Get the tool select input.
                var tool_select = document.getElementById('dtool');
                tool_select.addEventListener('change', ev_tool_change, false);

                // Activate the default tool.
                if (tools[tool_default]) {
                tool = new tools[tool_default]();
                tool_select.value = tool_default;
                }
                
                // Attach the mousedown, mousemove and mouseup event listeners.
                canvas.addEventListener('mousedown', ev_canvas, false);
                canvas.addEventListener('mousemove', ev_canvas, false);
                canvas.addEventListener('mouseup',   ev_canvas, false);
                canvas.addEventListener('touchstart',ev_canvas, false);
                canvas.addEventListener('touchmove',ev_canvas, false);
                canvas.addEventListener('touchend',ev_canvas, false);
            }
            
             // The general-purpose event handler. This function just determines the mouse 
            // position relative to the canvas element.
            function ev_canvas (ev) {
                if (ev.layerX || ev.layerX == 0) { // Firefox
                ev._x = ev.layerX;
                ev._y = ev.layerY;
                } else if (ev.offsetX || ev.offsetX == 0) { // Opera
                ev._x = ev.offsetX;
                ev._y = ev.offsetY;
                }
               
               let type;
               type = ev.type;
       

                // Call the event handler of the tool.
                var func = tool[type];
                if (func) {
                func(ev);
                }
            }

            // The event handler for any changes made to the tool selector.
            function ev_tool_change (ev) {
                if (tools[this.value]) {
                tool = new tools[this.value]();
                }
            }

            function img_update () {
                    contexto.drawImage(canvas, 0, 0);
                    context.clearRect(0, 0, canvas.width, canvas.height);
            }


            var tools = {};

            // The drawing pencil.
            tools.pencil = function () {
                let tool = this,
                    rect = canvas.getBoundingClientRect();
                window.blockMenuHeaderScroll = false;
                this.started = false,
                

                this.mousedown = function (ev) {
                    context.beginPath();
                    context.moveTo(ev._x, ev._y);
                    tool.started = true;
                };
                
                this.touchstart = function(ev){
                    context.beginPath();
                    context.moveTo(ev.targetTouches[0].pageX - rect.left, ev.targetTouches[0].pageY - rect.top);
                    tool.started = true;
                }

                this.mousemove = function (ev) {
                    if (tool.started) {
                        console.log();
                        context.lineTo(ev._x, ev._y);
                        context.stroke();
                     }
                };
                
               this.touchmove = function (ev) {
                   if (tool.started) {
                        console.log();
                        context.lineTo(ev.targetTouches[0].pageX - rect.left, ev.targetTouches[0].pageY - rect.top);
                        context.stroke();
                     }
                };

                this.mouseup = function (ev) {
                     if (tool.started) {
                         tool.mousemove(ev);
                         tool.started = false;
                         img_update();
                     }
                 };
                 
                 this.touchend = function (ev) {
                     if (tool.started) {
                         tool.started = false;
                         img_update();
                     }
                 };
            };

                        
            // The line tool.
            tools.line = function () {
                var tool = this,
                    rect = canvas.getBoundingClientRect();
                this.started = false;
                this.mousedown = function (ev) {
                    tool.started = true;
                    tool.x0 = ev._x;
                    tool.y0 = ev._y;
                };
                
                this.touchstart = function (ev){
                    tool.started = true;
                    tool.x0 = ev.targetTouches[0].pageX - rect.left;
                    tool.y0 = ev.targetTouches[0].pageY - rect.top;
                    console.log(tool);
                }

                this.mousemove = function (ev) {
                if (!tool.started) {
                    return;
                }

                context.clearRect(0, 0, canvas.width, canvas.height);

                context.beginPath();
                context.moveTo(tool.x0, tool.y0);
                context.lineTo(ev._x,   ev._y);
                context.stroke();
                context.closePath();
                };
                
                this.touchmove = function(ev){
                    if (!tool.started) {
                        return;
                    }

                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.beginPath();
                    context.moveTo(tool.x0, tool.y0);
                    context.lineTo(ev.targetTouches[0].pageX - rect.left, ev.targetTouches[0].pageY - rect.top);
                    context.stroke();
                    context.closePath();
                }

                this.mouseup = function (ev) {
                    if (tool.started) {
                        tool.mousemove(ev);
                        tool.started = false;
                        img_update();
                    }
                };
                
                this.touchend = function (ev) {
                    if (tool.started) {
                        tool.started = false;
                        img_update();
                    }
                };
            };
            
             // // The text tool.
            // tools.txt = function () {
            //     var tool = this;
            //     this.started = false;
            //     let lastTargetDown,
            //     counter = 0,
            //     x,y;

            //     this.mousedown = function (ev) {
            //         // context.beginPath();
            //         x = ev._x;
            //         y = ev._y;
            //         document.getElementById("drawingTemp").style.cursor = "text";
            //         window.addEventListener("keypress", keypress, false);
            //         tool.started = true;
            //     };
                
            //    function keypress (ev){
            //        if(ev.which === 13){
            //            document.getElementById("drawingTemp").style.cursor = "pointer";
            //            x = 0;
            //            y = 0;
            //            tool.started = false;
            //            return;
            //        }
            //         let c = String.fromCharCode(ev.which);
            //         context.fillText(c,x+counter,y);
            //         counter +=6;
            //         img_update();
            //     }

            //     // this.mousemove = function (ev) {
            //     //     if (tool.started) {
            //     //         context.lineTo(ev._x, ev._y);
            //     //         context.stroke();
            //     //      }
            //     // };

            //     // this.mouseup = function (ev) {
            //     //      if (tool.started) {
            //     //          tool.mousemove(ev);
            //     //          tool.started = false;
            //     //          img_update();
            //     //      }
            //     //  };
            // };

            init();
            this.setState({canvas:canvaso, ctx:contexto});
            this.backgroundCanvas(canvaso, contexto);
            this.captureCanvas(canvaso);

    }

    
    updateCanvas(ctx, ctxTemp, canvasTemp){
        ctx.drawImage(canvasTemp, 0, 0);
        ctxTemp.clearRect(0, 0, canvasTemp.width, canvasTemp.height);

    }
    
    captureCanvas(canvas){
        var capture = document.createElement('a');
        capture.innerHTML = 'Download image';
        capture.addEventListener('click', function(ev) {
            capture.href = canvas.toDataURL();
            capture.download = "mygraph.png";
        }, false);
        document.querySelector('.buttons').appendChild(capture);
    }
    
    backgroundCanvas(canvas, context){
        let bw = 400,
            bh = 400,
            p = 50,
            l = 0.25,
            cw = bw + (p*2),
            ch = bh + (p*2),
            g = 10;
            canvas.width = parseInt(cw);
            canvas.height = parseInt(ch);
            
        //background colour     
        context.beginPath();
        context.moveTo(0,0);
        context.lineTo(cw,0);
        context.lineTo(cw,ch);
        context.lineTo(0,ch);
        context.closePath();
        context.fillStyle = "#fff";
        context.fill();
        
        //grid
        context.beginPath();
        for (var x = 0; x <= bw; x += g) {
                context.moveTo(l + x + p, p);
                context.lineTo(l + x + p, bh + p);
            }

        for (var x = 0; x <= bh; x += g) {
                context.moveTo(p, l + x + p);
                context.lineTo(bw + p, l + x + p);
            }

            context.strokeStyle = "#ddd";
            context.stroke();
            context.closePath();  
         this.crossCanvas(context, cw, ch);
  
    }
    
    crossCanvas(context, cw, ch){
        context.font="Italic 14px Georgia";
        context.fillStyle = '#000'
        context.beginPath();
        context.moveTo(cw/2, 25);
        context.lineTo(cw/2,ch-25);
        context.fillText("y",cw/2+5,25);
        context.moveTo(25, ch/2);
        context.lineTo(cw-25,ch/2);
        context.strokeStyle = "#000";
        context.fillText("x",cw-25,ch/2+15);
        context.stroke();
        
    }
    
    
	constructor(props){
		super(props);
        this.state = {
            canvas : '',
            ctx : '',
        }

        this.clearCanvas = this.clearCanvas.bind(this);
        this.backgroundCanvas = this.backgroundCanvas.bind(this);
	}
    
    clearCanvas(){
        this.state.ctx.clearRect(0, 0, this.state.canvas.width+20, this.state.canvas.height+20);
        this.backgroundCanvas(this.state.canvas, this.state.ctx);
    }

	render(){
		return (
            <div>       
			<div id="sketch">
                <label>Drawing tool:
                    <select id="dtool">
                        <option value="pencil">Pencil</option>
                        <option value="line">Line</option>                  
                    </select>
                </label>
                <canvas id="drawing" width="400" height="400">
				<p>Unfortunately, your browser is currently unsupported by our web application. We are sorry for the inconvenience. Please use one of the supported browsers listed below, or draw the image you want using an offline tool.</p>
			</canvas>
                <div className="buttons">
                    <button onClick={this.clearCanvas}>Clear</button>
                </div>
			</div>
            </div>
		)
	}
}

export default App