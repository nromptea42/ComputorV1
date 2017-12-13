var myArgs = process.argv.slice(2);

function myEval(toEvaluate) {
	let startSlice = 0;
	const operation = [];
	// console.log('evaluate', toEvaluate);
	for (var i = 0; i < toEvaluate.length; i++) {
		if (toEvaluate.charAt(i) === '*' || toEvaluate.charAt(i) === '/') {
			if (startSlice === 0) {
				operation.push(toEvaluate.slice(startSlice, i));
			} else {
				operation.push(toEvaluate.slice(startSlice + 1, i));
			}
			operation.push(toEvaluate.charAt(i));
			startSlice = i;
		}
	}
	if (startSlice != 0) {
		operation.push(toEvaluate.slice(startSlice + 1, i));
	} else {
		operation.push(toEvaluate);
	}
	console.log('after parsing', operation);

	let res = {
		value: Number(operation[0]),
		pow: 0,
	};
	if (operation.length > 1) {
		var j = 0;
		operation.forEach(entitie => {
			if (entitie === '*') {
				if (operation[j + 1].charAt(0) !== 'X') {
					res.value = res.value * Number(operation[j + 1]);
				} else {
					res.pow = res.pow + Number(operation[j + 1].slice(2));
				}
			} else if (entitie === '/') {
				res.value = Number(res.value / operation[j + 1]);
			}
			j++;
		});
	}
	console.log('after calculs', res);
	return res;
}

function parseMyPolynom(polynom) {
	let split = polynom.replace(/\s/g,'');
	split = split.split("=");

	const left = split[0];
	const right = split[1];

	let startLeftSlice = 0;
	for (var i = 0; i < left.length; i++)
	{
	    if (left.charAt(i) === '-' || left.charAt(i) === '+') {
	    	leftEntities.push(left.slice(startLeftSlice, i));
	    	startLeftSlice = i;
	    }
	}
	leftEntities.push(left.slice(startLeftSlice, left.length));

	let startRightSlice = 0;
	for (var i = 0; i < right.length; i++)
	{
	    if (right.charAt(i) === '-' || right.charAt(i) === '+') {
	    	rightEntities.push(right.slice(startRightSlice, i));
	    	startRightSlice = i;
	    }
	}
	rightEntities.push(right.slice(startRightSlice, right.length));
}

function cutThePoly(left, right) {
	let tmpA = 0;
	let tmpB = 0;
	let tmpC = 0;

	console.log(left);
	left.forEach(num => {
		if(num.slice(num.length - 3) === 'X^2') {
			tmpA = tmpA + myEval(num.slice(0, num.length - 4));
		} else if(num.slice(num.length - 3) === 'X^1') {
			tmpB = tmpB + myEval(num.slice(0, num.length - 4));
		} else if(num.slice(num.length - 3) === 'X^0') {
			tmpC = tmpC + myEval(num.slice(0, num.length - 4));
		}
	});

	console.log(right);
	right.forEach(num => {
		if(num.slice(num.length - 3) === 'X^2') {
			tmpA = tmpA - myEval(num.slice(0, num.length - 4));
		} else if(num.slice(num.length - 3) === 'X^1') {
			tmpB = tmpB - myEval(num.slice(0, num.length - 4));
		} else if(num.slice(num.length - 3) === 'X^0') {
			tmpC = tmpC - myEval(num.slice(0, num.length - 4));
		}
	});
	a = tmpA;
	b = tmpB;
	c = tmpC;
}

function getPolynomialDegree(polynom) {
	for(var i = 0; i < polynom.length; i++) {
		if (polynom.charAt(i) === 'X') {
			if (Number(polynom.charAt(i + 2)) > polynomialDegree) {
				polynomialDegree = Number(polynom.charAt(i + 2));
			}
		}
	}
}

function getReducedForm(left, right) {
	const tableOfObject = [];

	left.forEach(num => {
		tableOfObject.push(myEval(num));
	});
	right.forEach(num => {
		tableOfObject.push(myEval(num + ' *-1'));
	});
	console.log(tableOfObject);
}

if (myArgs.length != 1) {
	return;
}

var polynom = myArgs[0];
const leftEntities = [];
const rightEntities = [];
let a = 0;
let b = 0;
let c = 0;
let polynomialDegree = 0;
parseMyPolynom(polynom);
getReducedForm(leftEntities, rightEntities);
// getPolynomialDegree(polynom);
// cutThePoly(leftEntities, rightEntities);
// console.log(a, b, c);
// const delta = b * b - 4 * a * c;
// console.log('delta', delta)
// if (a === 0) {
// 	if (b === 0) {
// 		if (c === 0) {
// 			console.log('Tous les réels sont solutions')
// 		} else {
// 			console.log('Pas de solutions')
// 		}
// 	} else {
// 		console.log('Le resultat est : x = ', -c/b);
// 	}
// } else {
// 	if (delta === 0) {
// 		let res = -b / (2 * a);
// 		console.log('Le resultat est : x = ', res)
// 	} else if (delta > 0) {
// 		let res1 = ( (-b + Math.sqrt(delta)) / (2 * a) );
// 		let res2 = ( (-b - Math.sqrt(delta)) / (2 * a) );
// 		console.log(`Les resultats sont : x1 = ${res1} et x2 = ${res2}`);
// 	} else if (delta < 0) {
// 		console.log('Il y a deux resultats imaginaires je vais le faire soonTM')
// 	}
// }