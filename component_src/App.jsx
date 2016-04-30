import React from 'react';

class App extends React.Component {
    componentDidMount() {
        this.drawing();
    }
    
    drawing(){      
        let canvas = document.querySelector('#drawing'),
        ctx = canvas.getContext('2d'),
        sketch = document.querySelector('#sketch'),
        sketch_style = getComputedStyle(sketch),
        tool = document.getElementById('dtool').value,
        t = this;
        // canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        // canvas.height = parseInt(sketch_style.getPropertyValue('height')); 
        this.setState({canvas:canvas, ctx:ctx});
        
        let canvasTemp = document.createElement('canvas');
        canvasTemp.id = 'drawingTemp';
        canvasTemp.width = canvas.width;
        canvasTemp.height = canvas.height;
        sketch.appendChild(canvasTemp);
        let ctxTemp = canvasTemp.getContext('2d');
        
        var mouse = {x: 0, y: 0};
        
        this.captureCanvas(canvas);
 
        /* Mouse Capturing Work */
        canvasTemp.addEventListener('mousemove', function(e) {
            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
        }, false);
        
        /* Drawing on Paint App */
        ctxTemp.lineWidth = 1;
        ctxTemp.lineJoin = 'round';
        ctxTemp.lineCap = 'round';
        ctxTemp.strokeStyle = 'black';
        
        let started = false,
            dTool = {};
        
       canvasTemp.addEventListener('mousedown', function(ev) {
            started = true;
            dTool.x0 = mouse.x;
		    dTool.y0 = mouse.y;
        }, false);
        
        canvasTemp.addEventListener('mousemove', function(ev) {
            if (!started) {
			    return;
		    }
            ctxTemp.clearRect(0, 0, canvas.width, canvas.height);
            ctxTemp.beginPath();
		    ctxTemp.moveTo(dTool.x0, dTool.y0);
            ctxTemp.lineTo(mouse.x, mouse.y);
            ctxTemp.stroke();
		    ctxTemp.closePath();
        }, false);
        
        canvasTemp.addEventListener('mouseup', function() {
            if (started) {
                started = false;
                console.log(this);
                t .updateCanvas(ctx, ctxTemp, canvasTemp);
		    }
        }, false);
        // canvas.addEventListener('mousedown', function(e) {
        //     ctx.beginPath();
        //     ctx.moveTo(mouse.x, mouse.y);
        
        //     canvas.addEventListener('mousemove', onPaint, false);
        // }, false);
        
        // canvas.addEventListener('mouseup', function() {
        //     canvas.removeEventListener('mousemove', onPaint, false);
        // }, false);
        
        // var onPaint = function() {
        //     ctx.lineTo(mouse.x, mouse.y);
        //     ctx.stroke();
        // };
       this.backgroundCanvas(canvas, ctx);
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
            p = 0,
            l = 0.25,
            cw = bw + (p*2) + 1,
            ch = bh + (p*2) + 1,
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
        context.moveTo(cw/2, 0);
        context.lineTo(cw/2,ch);
        context.fillText("y",cw/2+5,10);
        context.moveTo(0, ch/2);
        context.lineTo(cw,ch/2);
        context.strokeStyle = "#000";
        context.fillText("x",cw-10,ch/2+15);
        context.stroke();
        
    }
    
    
	constructor(props){
		super(props);
        this.state = {
            canvas : '',
            ctx : ''
        }
        this.drawing = this.drawing.bind(this);
        this.clearCanvas = this.clearCanvas.bind(this);
        this.backgroundCanvas = this.backgroundCanvas.bind(this);
	}
    
    clearCanvas(){
        this.state.ctx.clearRect(0, 0, this.state.canvas.width+20, this.state.canvas.height+20);
        this.backgroundCanvas(this.state.canvas, this.state.ctx);
    }

	render(){
		return (       
			<div style={styles.sketch} id="sketch">
                <label>Drawing tool:
                    <select id="dtool">
                        <option value="pencil">Pencil</option>
                        <option value="line">Line</option>
                    </select>
                </label>
                <canvas style={styles.canvas} id="drawing" width="400" height="400">
				<p>Unfortunately, your browser is currently unsupported by our web application. We are sorry for the inconvenience. Please use one of the supported browsers listed below, or draw the image you want using an offline tool.</p>
			</canvas>
                <div className="buttons">
                    <button onClick={this.clearCanvas}>Clear</button>
                </div>
			</div>
		)
	}
}

let styles = {
    sketch : {width: '440px'},
    canvas : {display : 'block',  margin : '20px'}
}

export default App