import React, {Component} from 'react';

class Canvas extends Component{
	constructor(props){
		super(props);
		this.state={
			length:500,
			cellSize:50,
			liveCells:[],
			grid:[]
		}
		this.colorCell = this.colorCell.bind(this);
		this.generate = this.generate.bind(this);
	}
	generate(){
		let genArray = this.state.genArray;
		const cellSize = this.state.cellSize;
		let genX = Math.floor(Math.random()*10)*cellSize;
		let genY = Math.floor(Math.random()*10)*cellSize;
		let gen = [genX,genY];
		genArray.push(gen);
		console.log(genArray);
	}
	colorCell(event){
		const canvas = document.getElementById('canvas');
		const ctx = canvas.getContext('2d');
		const cellSize = this.state.cellSize;
		//get coordinates of grid
		const x = event.clientX - ctx.canvas.offsetLeft;
		const y = event.clientY - ctx.canvas.offsetTop;
		//rounds grid coordinates in order to color in correctly.
		const xrounded =Math.floor(x/cellSize)*cellSize;
		const yrounded = Math.floor(y/cellSize)*cellSize;
		//gets color of clicked cell
		const cellColor = JSON.stringify(Array.from(ctx.getImageData(x,y,1,1).data));
		const yellow = "[255,255,0,255]";
		//fills cell with yellow if not yellow already
		if(cellColor !== yellow){
			ctx.fillStyle ='yellow';
			ctx.fillRect(xrounded,yrounded,cellSize,cellSize);	
		} else{
			ctx.fillStyle ='white';
			ctx.fillRect(xrounded,yrounded,cellSize,cellSize);
		}
		console.log(Math.floor(x/cellSize),Math.floor(y/cellSize),
			xrounded,yrounded,cellColor)	
	}
	componentDidMount(){
		const cellSize = this.state.cellSize;
		const length = this.state.length;
		const cellLength = length/cellSize;
		const grid = this.state.grid;
		let canvas = document.getElementById('canvas');
		let j = 0;
		let ctx;
		for(let i=0; i< cellLength*cellLength; i++){
			grid.push(0);
		}
		console.log(grid);
		if(canvas.getContext){
			ctx = canvas.getContext('2d');
			for(let i=0; i<=this.state.length;i+=cellSize){
				if(i===this.state.length){j+=cellSize;i=0;}
				if(j===this.state.length){return}
				ctx.rect(i,j,cellSize,cellSize);
			}
		}
	}
	render(){

		return(
			<div>

				<canvas id="canvas"
				onClick={this.colorCell}
				width={this.state.length}
				height={this.state.length}
				>
				</canvas>
			</div>
		)
	}
}

export default Canvas;