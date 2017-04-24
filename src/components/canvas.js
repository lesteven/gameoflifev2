import React, {Component} from 'react';

class Canvas extends Component{
	constructor(props){
		super(props);
		this.state={
			length:500,
			cellSize:50,
			totalCells: 100,
			cellsPerRow:10,
			generations:0,
			interval:undefined,
			nextGen:[],
			grid:[],
			color:"#004000"
		}
		this.colorCell = this.colorCell.bind(this);
		this.generate = this.generate.bind(this);
		this.drawGrid = this.drawGrid.bind(this);
		this.initGrid = this.initGrid.bind(this);
		this.updateArray = this.updateArray.bind(this);
		this.checkNeighbor = this.checkNeighbor.bind(this);
		this.recurse = this.recurse.bind(this);
		this.stopRecurse = this.stopRecurse.bind(this);
		this.updateGen = this.updateGen.bind(this);
	}
	generate(){
		let totalCells = this.state.totalCells;
		let grid = this.state.grid.slice();
		grid.length=0;
		for(let i = 0; i < totalCells; i++){
			let gen = Math.floor(Math.random()*2);
			grid.push(gen);
		}
		this.setState({grid:grid,generations:0},()=>this.drawGrid(this.state.grid))
	}
	updateArray(index,num){
		let grid = this.state.grid.slice();
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
		const green = "[0,64,0,255]";
		//finds index to replace in grid array
		const replace = Math.floor(x/cellSize)+ Math.floor(y/cellSize)*cellLength;
		if(cellColor !== green){
			//fills in grid to prevent rerendering
			ctx.fillStyle = this.state.color;
			//console.log(cellColor)
			ctx.fillRect(xrounded,yrounded,cellSize,cellSize);
			//console.log('replace:'+replace);
			//update state of grid
			this.updateArray(replace,1);
		} else{
			//fills in grid to prevent rerendering
			//console.log(cellColor)
			ctx.fillStyle ='#cccccc';
			ctx.fillRect(xrounded,yrounded,cellSize,cellSize);
			ctx.strokeRect(xrounded,yrounded,cellSize,cellSize);
			//console.log('replace:'+replace);
			//update state of grid
			this.updateArray(replace,0);
		}
		/*console.log('x:'+Math.floor(x/cellSize),'y:'+Math.floor(y/cellSize),
			xrounded,yrounded,cellColor)	*/
	}
	initGrid(){

		let totalCells = this.state.totalCells;
		let grid = this.state.grid.slice();
		grid.length = 0;
		for(let i=0; i< totalCells; i++){
			grid.push(0);
		}
		this.setState({grid:grid,generations:0},()=>this.drawGrid(this.state.grid));	
		//console.log('init&&clear',this.state.grid,grid);
	}
	drawGrid(currentBoard){
		//console.log('drawGrid:',this.state.grid);
		const cellSize = this.state.cellSize;
		const length = this.state.length;
		let canvas = document.getElementById('canvas');
		let i = 0;
		let j = 0;
		let ctx = canvas.getContext('2d');
		currentBoard.map((each,index)=>{
			if(each===0){		
				ctx.strokeRect(i,j,cellSize,cellSize);}
			else if(each===1){
				ctx.fillStyle =this.state.color;
				ctx.fillRect(i,j,cellSize,cellSize);}
			if(i < length){i+=cellSize;}
			if(i===length){j+=cellSize;i=0}
			return null;
		})
		//console.log(this.state.grid)
	}
	clearGrid(){
		let canvas = document.getElementById('canvas');
		let ctx = canvas.getContext('2d');
		ctx.clearRect(0,0,canvas.width,canvas.height);
	}
	nextBoard(array,status,count){
		
		if(count < 2){array.push(0);}
		else if(status===1 &&(count===2 || count===3)){array.push(1);}
		else if(count>3){array.push(0);}
		else if(count===3 && status===0){array.push(1);}
		else{array.push(0);}
		
	}
	checkNeighbor(){
		let nextGen = this.state.nextGen.slice();
		const cellsPerRow = this.state.cellsPerRow;
		let grid = this.state.grid;
		const totalCells = this.state.totalCells;
		grid.map((each,index)=>{
			let counter = 0;
			let row = Math.floor(index/cellsPerRow);
			//if left goes into lower row, then left is on far right, else left is -1.
			const left = (index-1)=== row*cellsPerRow-1? 
				grid[index+(cellsPerRow-1)]:grid[index-1];
			//if right goes into higher row, then right is on far left, else right is +1.
			const right = (index+1)=== (row+1)*cellsPerRow?
				grid[index-(cellsPerRow-1)]:grid[index+1];
			//if top goes into negative row, then top is on far bottom, else top is -10.
			const top = (index-cellsPerRow) < 0?
				grid[index+(totalCells-cellsPerRow)]:grid[index-cellsPerRow];
			const bottom = (index+cellsPerRow) >= totalCells?
				grid[index-(totalCells-cellsPerRow)]:grid[index+cellsPerRow];

			let topLeft = 0;
				if(index-cellsPerRow-1 < -cellsPerRow){topLeft = grid[index+totalCells-1];}
				else if(index-cellsPerRow-1 < -1){topLeft = grid[index+totalCells-cellsPerRow-1]}
				else if(index-cellsPerRow-1 <(row-1)*cellsPerRow){topLeft = grid[index-1];}
				else{topLeft=grid[index-cellsPerRow-1]}

			let topRight = 0;
				if((index -cellsPerRow)+1 ===0){topRight = grid[totalCells-cellsPerRow];}
				else if((index-cellsPerRow)+1 === row*cellsPerRow){topRight = grid[index -(2*cellsPerRow)+1];}
				else if((index-cellsPerRow)+1 < 0){topRight = grid[(index+totalCells)-cellsPerRow+1];}
				
				else{topRight = grid[index-cellsPerRow+1]}
			let bottomRight = 0;
			 	if(index+cellsPerRow+1 === totalCells+cellsPerRow){bottomRight=grid[0];}
				else if(index+cellsPerRow+1 === (row+2)*cellsPerRow){bottomRight = grid[index+1];}

				else if(index+cellsPerRow+1 >= totalCells){bottomRight = grid[(index+1)-(totalCells-cellsPerRow)];}
				else{bottomRight = grid[index+cellsPerRow+1]}
			let bottomLeft = 0;
				if(index+cellsPerRow-1 === totalCells-1){bottomLeft=grid[cellsPerRow-1];}
				else if(index+cellsPerRow-1 > totalCells-1){bottomLeft=grid[index-(cellsPerRow*row)-1];}
				else if(Math.floor((index+cellsPerRow-1)/cellsPerRow) < row+1){bottomLeft=grid[cellsPerRow*(row+2)-1];}
				else{bottomLeft = grid[index+cellsPerRow-1]}

			if(left===1){
				counter++;
				//return console.log('index:'+index,grid[index],'row:'+row,left);
			}
			if(right===1){
				counter++;
				//return console.log('index:'+index,grid[index],'row:'+row,right);
			}
			if(top===1){
				counter++;
				//return console.log('index:'+index,grid[index],'row:'+row,top);
			}
			if(bottom===1){
				counter++;
				//return console.log('index:'+index,grid[index],'row:'+row,bottom);
			}	
			if(topLeft===1){
				counter++;
				//return console.log('index:'+index,grid[index],'row:'+row,topLeft);
			}
			if(topRight===1){
				counter++;
				//return console.log('index:'+index,grid[index],'row:'+row,topRight);
			}
			if(bottomRight===1){
				counter++;
				//return console.log('index:'+index,grid[index],'row:'+row,bottomRight);
			}
			if(bottomLeft===1){
				counter++;
				//return console.log('index:'+index,grid[index],'row:'+row,bottomLeft);
			}
			this.nextBoard(nextGen,each,counter);
			
			return null;
		})
		this.setState({grid:nextGen},()=>{this.clearGrid();this.drawGrid(this.state.grid)});
		this.updateGen();
	}
	recurse(){
		//this.checkNeighbor();
		//requestAnimationFrame(this.recurse);
		let interval = setInterval(this.checkNeighbor,100)
		this.setState({interval:interval})
	}
	componentDidMount(){
		this.generate();
		//setInterval(this.checkNeighbor,100)
	}
	stopRecurse(){
		clearInterval(this.state.interval);
	}
	updateGen(){
		let generations = this.state.generations;
		generations++;
		this.setState({generations:generations})
	}
	render(){
		return(
			<div>
			<div>
				<button className="run"
					onClick={this.recurse}
					>Run</button>
				<button className="pause"
					onClick={this.stopRecurse}
					>Pause</button>
				<button className="clear"
					onClick={()=>{
						this.stopRecurse();
						this.clearGrid();
						this.initGrid()}}
				>Clear</button>
				<button className="generate"
					onClick={()=>{
						this.clearGrid();
						this.generate()}}
				>Generate</button>
				<button className="stepper"
					onClick={this.checkNeighbor}
					>Stepper</button>
				<h3> Generations : {this.state.generations}</h3>
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