import React, {Component} from 'react';

class Canvas extends Component{
	constructor(props){
		super(props);
		this.state={
			length:500,
			cellSize:50,
			liveCells:[],
			totalCells:100,
			grid:[]
		}
		this.colorCell = this.colorCell.bind(this);
		this.generate = this.generate.bind(this);
		this.drawGrid = this.drawGrid.bind(this);
		this.initGrid = this.initGrid.bind(this);
	}
	generate(){
		let totalCells = this.state.totalCells;
		let grid = this.state.grid;
		for(let i = 0; i < totalCells; i++){
			let gen = Math.floor(Math.random()*2);
			grid.push(gen);
		}
		this.setState({grid:grid})
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
	initGrid(){
		const cellSize = this.state.cellSize;
		const length = this.state.length;
		const cellLength = length/cellSize;
		const lala = this.state.grid;
		lala.length = 0;
		for(let i=0; i< cellLength*cellLength; i++){
			lala.push(0);
		}
		this.setState({grid:lala})
	}
	drawGrid(){
		const cellSize = this.state.cellSize;
		const length = this.state.length;
		const grid = this.state.grid;
		let canvas = document.getElementById('canvas');
		let i = 0;
		let j = 0;
		let ctx = canvas.getContext('2d');

		grid.map((each,index)=>{
			if(each===0){
				console.log('each is 0',index);
				ctx.strokeRect(i,j,cellSize,cellSize);}
			if(each===1){
				console.log('each is 1',index);
				ctx.fillStyle ='yellow';
				ctx.fillRect(i,j,cellSize,cellSize);}
			if(i < length){i+=50;}
			if(i===length){j+=cellSize;i=0}
			return null;
		})
		
		console.log(this.state.grid)
	}
	componentDidMount(){
		this.generate();
		
		this.drawGrid();
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