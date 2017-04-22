import React, {Component} from 'react';

class Canvas extends Component{
	constructor(props){
		super(props);
		this.state={
			length:500,
			cellSize:50,
			totalCells: 100,
			liveCells:[],
			grid:[]
		}
		this.colorCell = this.colorCell.bind(this);
		this.generate = this.generate.bind(this);
		this.drawGrid = this.drawGrid.bind(this);
		this.initGrid = this.initGrid.bind(this);
		this.updateArray = this.updateArray.bind(this);
	}
	generate(){
		let totalCells = this.state.totalCells;
		let grid = this.state.grid;
		grid.length=0;
		for(let i = 0; i < totalCells; i++){
			let gen = Math.floor(Math.random()*2);
			grid.push(gen);
		}
		this.setState({grid:grid})
	}
	updateArray(index,num){
		let grid = this.state.grid;
		grid.splice(index,1)
		grid.splice(index,0,num)
		this.setState({grid:grid})
		//console.log(this.state.grid);
	}
	colorCell(event){
		const canvas = document.getElementById('canvas');
		const ctx = canvas.getContext('2d');
		const cellSize = this.state.cellSize;
		const length = this.state.length;
		const cellLength = length/cellSize;
		//get coordinates of grid
		const x = event.clientX - ctx.canvas.offsetLeft;
		const y = event.clientY - ctx.canvas.offsetTop;
		//rounds grid coordinates in order to color in correctly.
		const xrounded =Math.floor(x/cellSize)*cellSize;
		const yrounded = Math.floor(y/cellSize)*cellSize;
		//gets color of clicked cell
		const cellColor = JSON.stringify(Array.from(ctx.getImageData(x,y,1,1).data));
		const yellow = "[255,255,0,255]";
		//finds index to replace in grid array
		const replace = Math.floor(x/cellSize)+ Math.floor(y/cellSize)*cellLength;
		if(cellColor !== yellow){
			//fills in grid to prevent rerendering
			ctx.fillStyle ='yellow';
			ctx.fillRect(xrounded,yrounded,cellSize,cellSize);
			//console.log('replace:'+replace);
			//update state of grid
			this.updateArray(replace,1);
		} else{
			//fills in grid to prevent rerendering
			ctx.fillStyle ='white';
			ctx.fillRect(xrounded,yrounded,cellSize,cellSize);
			//console.log('replace:'+replace);
			//update state of grid
			this.updateArray(replace,0);
		}
		/*console.log('x:'+Math.floor(x/cellSize),'y:'+Math.floor(y/cellSize),
			xrounded,yrounded,cellColor)	*/
	}
	initGrid(){
		let totalCells = this.state.totalCells;
		let grid = this.state.grid;
		grid.length = 0;
		for(let i=0; i< totalCells; i++){
			grid.push(0);
		}
		this.setState({grid:grid});	
		console.log('init&&clear',this.state.grid,grid);
	}
	drawGrid(){
		const cellSize = this.state.cellSize;
		const length = this.state.length;
		let grid = this.state.grid;
		let canvas = document.getElementById('canvas');
		let i = 0;
		let j = 0;
		let ctx = canvas.getContext('2d');
		grid.map((each,index)=>{
			if(each===0){		
				ctx.rect(i,j,cellSize,cellSize);}
			else if(each===1){
				ctx.fillStyle ='yellow';
				ctx.fillRect(i,j,cellSize,cellSize);}
			if(i < length){i+=50;}
			if(i===length){j+=cellSize;i=0}
			return null;
		})
		console.log(this.state.grid)
	}
	clearGrid(){
		let canvas = document.getElementById('canvas');
		let ctx = canvas.getContext('2d');
		ctx.clearRect(0,0,canvas.width,canvas.height);
	}
	componentDidMount(){
		this.generate();
		this.drawGrid();
	}
	render(){
		return(
			<div>
			<div>
				<button className="run">Run</button>
				<button className="pause">Pause</button>
				<button className="clear"
					onClick={()=>{
						this.initGrid();
						this.clearGrid()}}
				>Clear</button>
				<button 
					className="generate"
					onClick={()=>{
						this.clearGrid();
						this.generate();
						this.drawGrid()}}
				>Generate</button>
			</div>
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