$(document).ready(function(){
	const winningCombos = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	]
	var allSpaces = $('.space')
	const players = [1, 2]
	var goingFirst = players[Math.floor(Math.random()*players.length)];
	const allSquares = [0, 1, 2, 3, 4, 5, 6, 7, 8]
	var compsChoices = []
	var userChoices = []
	var squaresChosen = []
	var allSpaces = $('.space')
	var playerDisplay = $('#player_display')
	var turn = 1

	var possibleMoves = function() {
		var array = []
		allSquares.forEach(function(square) {
			if (squaresChosen.indexOf(square) === -1)
				array.push(square)
		})
		return array
	}
	var combosBlocked = function() {
		var array = []
		for (var i = 0; i < winningCombos.length; i++){
			for (var x = 0; x < winningCombos[i].length; x++) {
				for (var y = 0; y < userChoices.length; y++) { 
					if(winningCombos[i][x] === userChoices[y] && array.indexOf(winningCombos[i] === -1) ) {
						array.push(winningCombos[i])
						break
					}
				}
			}
		}
		return array
	}
	var combosAvailable = function() {
		var blocked = combosBlocked()
		var array = []
		winningCombos.forEach(function(winningCombo) {
			if(blocked.indexOf(winningCombo) === -1) {
				array.push(winningCombo)
			}
		})
		return array
	}

	var movesToGetTwo = function() {
		console.log('movesToGetTwo')
		var available = combosAvailable()
		var array = []
		for (var i = 0; i < available.length; i++) {
			for (var y = 0; y < available[i].length; y++) {
				for (var x = 0; x < compsChoices.length; x++) {
					if(available[i].indexOf(compsChoices[x]) !== -1 && array.indexOf(available[i][y]) === -1 && 
						available[i][y] !== compsChoices[x] && compsChoices.indexOf(available[i][y]) === -1) {
						array.push(available[i][y])
					}
				}
			}
		}
		return array
	}

	var movesToGetThree = function() {
		console.log('movesToGetThree')
		var array = []
		var matches = []
		var available = combosAvailable()
		for (var i = 0; i < available.length; i++) {
				for (var y = 0; y < compsChoices.length; y++) {
					if (available[i].indexOf(compsChoices[y]) !== -1 && matches[0] === undefined) {
						matches.push(compsChoices[y])
					} else if (available[i].indexOf(compsChoices[y]) !== -1 && matches[0] !== undefined) {
						matches.push(compsChoices[y])
						var thirdMove = available[i].find(function(num) {
							return matches.indexOf(num) === -1
						})
						if (array.indexOf(thirdMove) === -1) {
							array.push(thirdMove)
						}
					}
				}
			matches = []
		}
		return array
	}

	var canUserGetThree = function() {
		console.log('canUserGetThree')
		var matches = []
		var thirdMove
		if(userChoices.length > 1){
			for (var i = 0; i < winningCombos.length; i++) {
				for ( var y = 0; y < userChoices.length; y++) {
					if (winningCombos[i].indexOf(userChoices[y]) !== -1 && matches[0] === undefined) {
						matches.push(userChoices[y])
					} else if (winningCombos[i].indexOf(userChoices[y]) !== -1 && matches[0] !== undefined){
						matches.push(userChoices[y])
						thirdMove = winningCombos[i].find(function(num){
							return matches.indexOf(num) === -1
						})
						if(compsChoices.indexOf(thirdMove) === -1) {
							return thirdMove
						}
					}
				}
				matches = []
			}
		}
		return undefined
	}

	var didCompWin = function() {
		console.log('didCompWin')
		var matches = []
		for (var i = 0; i < winningCombos.length; i++) {
			for ( var y = 0; y < compsChoices.length; y++) {
				if (winningCombos[i].indexOf(compsChoices[y]) !== -1 && matches[0] === undefined) {
					matches[0] = compsChoices[y]
				} else if (winningCombos[i].indexOf(compsChoices[y]) !== -1 && matches[0] !== undefined 
					&& matches[1] === undefined) {
					matches[1] = compsChoices[y]
				} else if (winningCombos[i].indexOf(compsChoices[y]) !== -1 && matches[0] !== undefined
					&& matches[1] !== undefined && compsChoices[y] !== matches[0] && compsChoices[y] !== matches[1]) {
					return true

				}
			}
		matches = []
		}
		return false
	}

	var resetBoard = function() {
		compsChoices = []
		userChoices = []
		squaresChosen = []
		turn = 1
		allSpaces.text('')
		goingFirst = getRandom(players)
		return whoGoesFirst()
	}

	var isItADraw = function() {
		if (squaresChosen.length === 9) {
			alert('It is a draw!')
			return resetBoard()
		} else {
			return null
		}
	}

	//////////////////////////////////////////////////

	function whoGoesFirst() {
		console.log('whoGoesFirst')
		playerDisplay.text('Let\'s see who goes first this time...')
		setTimeout(function() {
			if( goingFirst === 1 ) {
				playerDisplay.text('It looks like you get to start this round!')
				 return playersTurn()
			} else {
				playerDisplay.text('The computer gets to start this round!')
				 return compsTurn()
			}
		}, 0)

	}

	var setSpaces = function(possibles, i) {
		var space = $('#' + possibles[i])
		 space.click(function() {
			$(this).text('X')
			userChoices.push(Number(this.id))
			squaresChosen.push(Number(this.id))
			turn += 1
			if (isItADraw() === null) {
				return compsTurn()
			}
		})
	}

	function playersTurn() {
		console.log('playersTurn')
		var possibles = possibleMoves()
		for(var i = 0; i < possibles.length; i++) {
			setSpaces(possibles, i)
		}
	}

	function checkForTrap() {
		console.log('checkForTrap')
		var possibleTrapCombos = []
		for (var i = 0; i < winningCombos.length; i++) {
			for (var x = 0 ; x < userChoices.length; x++) {
				if (winningCombos[i].indexOf(userChoices[x]) !== -1 && winningCombos[i].indexOf(4) === -1
					&& possibleTrapCombos.indexOf(winningCombos[i] === -1)) {
					possibleTrapCombos.push(winningCombos[i])
				console.log(possibleTrapCombos)
					if (possibleTrapCombos.length === 2) {
						console.log('2 possible trap combos')
						for (var y = 0; y < possibleTrapCombos[0].length; y++) {
							if (possibleTrapCombos[1].indexOf(possibleTrapCombos[0][y]) !== -1 
								&& squaresChosen.indexOf(possibleTrapCombos[0][y]) === -1 ) {
								console.log('returned something from 2 possible trap combos')
								return possibleTrapCombos[0][y]
							}
						}
					} else if (possibleTrapCombos.length === 4 ) {
						console.log('4 possibleTrapCombos')
						var midSquares = [1, 3, 5, 7]
						return getRandom(midSquares)
					}
				}
			}
		}
		console.log('getting a corner for turn 4')
			var cornerSquares = [0, 2, 6, 8]
			var getTwo = movesToGetTwo()
		while (true) {
			 move = getRandom(getTwo)
			 if (cornerSquares.indexOf(move) !== -1) {
			 	return move
			 }
		}
	}

	function compsTurn() {
		console.log('compsTurn')
		allSpaces.off('click')
		if(turn === 1 || turn === 2) {
			if(userChoices.indexOf(4) === -1) {
				return setCompChoice(4)
			} else {
				var cornerSquares = [0, 2, 6, 8]
				return setCompChoice(getRandom(cornerSquares))
			}
		} else {
			if (movesToGetThree().length > 0) {
				console.log('moves to get three')
				setCompChoice(getRandom(movesToGetThree()))
			} else if (canUserGetThree() !== undefined) {
				setCompChoice(canUserGetThree())
			} else if(movesToGetTwo().length > 0) {
				console.log('moves to get two')
				if(turn === 4) {
					console.log('turn 4 checking for trap')
					return setCompChoice(checkForTrap())
				} else {
					console.log('turn 4 getting random')
					return setCompChoice(getRandom(movesToGetTwo()))
				}
			} else {
				console.log('just getting a random move')
				return setCompChoice(getRandom(possibleMoves()))
			}
		}
	}

	function getRandom(options) {
		while (true) {
			var move = options[Math.floor(Math.random() * options.length)]
			if (userChoices.indexOf(move) === -1) {
				return move
			}
		}
	}

	var winnerOrDraw = function() {
		if (didCompWin() === true) {
			alert('The Computer won!')
			return resetBoard()
		}
		else if (isItADraw() === null) {
			return playersTurn()
		}
		return true
	}

	function setCompChoice(squareNumber) {
		console.log('setCompChoice')
		$('#' + squareNumber).text('O', setTimeout(function() {
			console.log('getting here')
			compsChoices.push(squareNumber)
			squaresChosen.push(squareNumber)
			turn += 1
			winnerOrDraw()
		}, 100))
	}

	whoGoesFirst()



})







