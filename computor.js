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
	// console.log('after parsing', operation);

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
	// console.log('after calculs', res);
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

// function cutThePoly(left, right) {
// 	let tmpA = 0;
// 	let tmpB = 0;
// 	let tmpC = 0;

// 	console.log(left);
// 	left.forEach(num => {
// 		if(num.slice(num.length - 3) === 'X^2') {
// 			tmpA = tmpA + myEval(num.slice(0, num.length - 4));
// 		} else if(num.slice(num.length - 3) === 'X^1') {
// 			tmpB = tmpB + myEval(num.slice(0, num.length - 4));
// 		} else if(num.slice(num.length - 3) === 'X^0') {
// 			tmpC = tmpC + myEval(num.slice(0, num.length - 4));
// 		}
// 	});

// 	console.log(right);
// 	right.forEach(num => {
// 		if(num.slice(num.length - 3) === 'X^2') {
// 			tmpA = tmpA - myEval(num.slice(0, num.length - 4));
// 		} else if(num.slice(num.length - 3) === 'X^1') {
// 			tmpB = tmpB - myEval(num.slice(0, num.length - 4));
// 		} else if(num.slice(num.length - 3) === 'X^0') {
// 			tmpC = tmpC - myEval(num.slice(0, num.length - 4));
// 		}
// 	});
// 	a = tmpA;
// 	b = tmpB;
// 	c = tmpC;
// }

function getPolynomialDegree(polynom) {
	for(var i = 0; i < polynom.length; i++) {
		if (polynom.charAt(i) === 'X') {
			if (Number(polynom.charAt(i + 2)) > polynomialDegree) {
				polynomialDegree = Number(polynom.charAt(i + 2));
			}
		}
	}
}

function cleanReduced(array) {
	for(var i = array.length - 1; i >= 0; i--) {
		if (array[i].value === 0) {
			array.splice(array[i], 1);
		}
 	};
 	return array;
}

function countPow(array) {
	const pows = [];
	array.forEach(obj => {
		if (pows.indexOf(obj.pow) === -1) {
			pows.push(obj.pow);
		}
	});
	return pows;
}

function compareNumbers(a, b) {
  return a - b;
}

function getReducedForm(left, right) {
	let tableOfObject = [];
	let reducedArray = [];

	left.forEach(num => {
		tableOfObject.push(myEval(num));
	});
	right.forEach(num => {
		tableOfObject.push(myEval(num + ' *-1'));
	});
	const howMuchPow = countPow(tableOfObject);
	howMuchPow.sort(compareNumbers);
	// console.log('how much pows', howMuchPow);
	howMuchPow.forEach(pow => {
		let res = 0;
		tableOfObject.forEach(obj => {
			if (obj.pow === pow) {
				res = res + obj.value;
			}
		})
		reducedArray.push({
			value: res,
			pow: pow
		})
	});
	// console.log('before clean', reducedArray)
	reducedArray = cleanReduced(reducedArray);
	// console.log('after clean', reducedArray);
	return reducedArray;
}

function printReducedForm(array) {
	let reducedString = '';
	let i = 0;
	array.forEach(obj => {
		reducedString += `${obj.value} * X^${obj.pow}`;
		if (i !== array.length - 1) {
			 reducedString += ' + ';
		}
		i++;
	});
	if (array.length === 0) {
		console.log('Reduced Form : 0 * X^0 = 0')
		console.log('Polynomial Degree : 0')
	} else {
		console.log('Reduced Form :', reducedString, '= 0')
		console.log('Polynomial Degree :', array[array.length - 1].pow)
	}
}

function getValue(array, nb) {
	let res = 0;
	array.forEach(obj => {
		if (obj.pow === nb) {
			res = obj.value;
		}
	})
	return res;
}

if (myArgs.length != 1) {
	return;
}

var polynom = myArgs[0];
const leftEntities = [];
const rightEntities = [];
parseMyPolynom(polynom);
const reducedForm = getReducedForm(leftEntities, rightEntities);
printReducedForm(reducedForm);
if (reducedForm.length === 0) {
	console.log('Every real is a solution')
} else {
	if (reducedForm[reducedForm.length - 1].pow > 2) {
		console.log('The polynomial degree is stricly greater than 2, I can t solve.')
		return;
	}
	let a = getValue(reducedForm, 2);
	let b = getValue(reducedForm, 1);
	let c = getValue(reducedForm, 0);
	// console.log(a, b, c);

	const delta = b * b - 4 * a * c;
	// console.log('delta', delta)
	if (a === 0) {
		if (b === 0) {
			if (c === 0) {
				console.log('Every real is a solution');
			} else {
				console.log('No solutions');
			}
		} else {
			console.log('The solution is : x =', -c/b);
		}
	} else {
		if (delta === 0) {
			let res = -b / (2 * a);
			console.log('Discriminant is 0, the solutions is:');
			console.log('x =', res);
		} else if (delta > 0) {
			let res1 = ( (-b + Math.sqrt(delta)) / (2 * a) );
			let res2 = ( (-b - Math.sqrt(delta)) / (2 * a) );
			console.log('Discriminant is strictly positive, the two solutions are:');
			console.log(`x1 = ${res1} and x2 = ${res2}`);
		} else if (delta < 0) {
			console.log('Discriminant is strictly negative, the two solutions are:');
			console.log(`x1 = (${b * -1} + i√${delta * -1}) / ${2 * a}`);
			console.log(`x2 = (${b * -1} - i√${delta * -1}) / ${2 * a}`);
		}
	}
}