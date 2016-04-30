import React from 'react';

class App extends React.Component {
    componentDidMount() {
        this.drawing();
    }
    
    drawing(){      
        let  canvas = document.querySelector('#drawing'),
        ctx = canvas.getContext('2d'),
        sketch = document.querySelector('#sketch'),
        sketch_style = getComputedStyle(sketch),
        tool = document.getElementById('dtool').value;
        // canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        // canvas.height = parseInt(sketch_style.getPropertyValue('height')); 
        this.setState({canvas:canvas, ctx:ctx});

        var mouse = {x: 0, y: 0};
        
        this.captureCanvas(canvas);
 
        /* Mouse Capturing Work */
        canvas.addEventListener('mousemove', function(e) {
            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
        }, false);
        
        /* Drawing on Paint App */
        ctx.lineWidth = 1;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'black';
        
        canvas.addEventListener('mousedown', function(e) {
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
        
            canvas.addEventListener('mousemove', onPaint, false);
        }, false);
        
        canvas.addEventListener('mouseup', function() {
            canvas.removeEventListener('mousemove', onPaint, false);
        }, false);
        
        var onPaint = function() {
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        };
       this.backgroundCanvas(canvas, ctx);
    }
    
    captureCanvas(canvas){
        var capture = document.createElement('a');
        capture.innerHTML = 'Download image';
        capture.addEventListener('click', function(ev) {
            capture.href = canvas.toDataURL();
            capture.download = "mygraph.png";
        }, false);
        document.querySelector('#sketch').appendChild(capture);
    }
    
    backgroundCanvas(canvas, context){
        let bw = canvas.width,
            bh = canvas.height,
            p = 10,
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
        context.beginPath();
        context.moveTo(cw/2, 0);
        context.lineTo(cw/2,ch);
        context.moveTo(0, ch/2);
        context.lineTo(cw,ch/2);
        context.strokeStyle = "#000";
        context.stroke();
        
    }
    
    
	constructor(props){
		super(props);
        this.state = {
            canvas : '',
            ctx : ''
        }
        this.clearCanvas = this.clearCanvas.bind(this);
        this.backgroundCanvas = this.backgroundCanvas.bind(this);
	}
    
    clearCanvas(){
        this.state.ctx.clearRect(0, 0, this.state.canvas.width+20, this.state.canvas.height+20);
        this.drawing();
    }

	render(){
		return (       
			<div id="sketch">
                <label>Drawing tool:
                    <select id="dtool">
                        <option value="pencil">Pencil</option>
                        <option value="line">Line</option>
                    </select>
                </label>
                <button onClick={this.clearCanvas}>Clear</button>
                <canvas style={styles.canvas} id="drawing" width="400" height="400">
				<p>Unfortunately, your browser is currently unsupported by our web application. We are sorry for the inconvenience. Please use one of the supported browsers listed below, or draw the image you want using an offline tool.</p>
			</canvas>
			</div>
		)
	}
}

let styles = {
    canvas : {display : 'block',  margin : '10px'}
}

export default App