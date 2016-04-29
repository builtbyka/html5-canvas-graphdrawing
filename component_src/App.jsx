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
        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height')); 
        this.setState({canvas:canvas, ctx:ctx});
        var mouse = {x: 0, y: 0};
 
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
    }
    
	constructor(props){
		super(props);
        this.state = {
            canvas : '',
            ctx : ''
        }
        this.clearCanvas = this.clearCanvas.bind(this);
        //this.captureCanvas = this.captureCanvas.bind(this);
	}
    
    captureCanvas(){
        //window.open('', document.getElementById('drawing').toDataURL());    
    }
    
    clearCanvas(){
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
                <button onClick={this.captureCanvas}>Capture</button>
                <canvas id="drawing" width="400" height="300">
				<p>Unfortunately, your browser is currently unsupported by our web application. We are sorry for the inconvenience. Please use one of the supported browsers listed below, or draw the image you want using an offline tool.</p>
			</canvas>
			</div>
		)
	}
}

export default App