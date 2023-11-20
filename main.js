const keys = document.querySelectorAll('.key');
const display_input = document.querySelector('.display .input');
const display_output = document.querySelector('.display .output');

let input = "";

for (let key of keys) {
	const value = key.dataset.key;

	key.addEventListener('click', () => {
		if (value == "clear") {
			input = "";
			display_input.innerHTML = "";
			display_output.innerHTML = "";
		} else if (value == "backspace") {
			input = input.slice(0, -1);
			display_input.innerHTML = CleanInput(input);
		} else if (value == "=") {
			let result = eval(PrepareInput(input));

			display_output.innerHTML = CleanOutput(result);
		} else if (value == "brackets") {
			if (
				input.indexOf("(") == -1 || 
				input.indexOf("(") != -1 && 
				input.indexOf(")") != -1 && 
				input.lastIndexOf("(") < input.lastIndexOf(")")
			) {
				input += "(";
			} else if (
				input.indexOf("(") != -1 && 
				input.indexOf(")") == -1 || 
				input.indexOf("(") != -1 &&
				input.indexOf(")") != -1 &&
				input.lastIndexOf("(") > input.lastIndexOf(")")
			) {
				input += ")";
			}

			display_input.innerHTML = CleanInput(input);
		} else {
			if (ValidateInput(value)) {
				input += value;
				display_input.innerHTML = CleanInput(input);
			}
		}
	})
}

function CleanInput(input) {
    let input_array = input.split("");
    let input_array_length = input_array.length;

    for (let i = 0; i < input_array_length; i++) {
        if (i > 0 && i % 16 === 0) {
            input_array[i] = `<br>${input_array[i]}`;
        }
        if (input_array[i] == "*") {
            input_array[i] = ` <span class="operator">x</span> `;
        } else if (input_array[i] == "/") {
            input_array[i] = ` <span class="operator">÷</span> `;
        } else if (input_array[i] == "+") {
            input_array[i] = ` <span class="operator">+</span> `;
        } else if (input_array[i] == "-") {
            input_array[i] = ` <span class="operator">-</span> `;
        } else if (input_array[i] == "(") {
            input_array[i] = `<span class="brackets">(</span>`;
        } else if (input_array[i] == ")") {
            input_array[i] = `<span class="brackets">)</span>`;
        } else if (input_array[i] == "%") {
            input_array[i] = `<span class="percent">%</span>`;
        }
    }

    return input_array.join("");
}

function CleanOutput(output) {
    // Round the number to 10 decimal places
    let roundedOutput = Math.round(output * 1e10) / 1e10;

    let output_string = roundedOutput.toString();
    let decimal = output_string.split(".")[1];
    output_string = output_string.split(".")[0];

    // Limit the output to 10 digits
    if (output_string.length > 10) {
        let exponentNotation = roundedOutput.toExponential(5);
        // Remove the plus sign from the exponent if it is positive
        exponentNotation = exponentNotation.replace(/\+/g, '');
        return exponentNotation;
    }

	if (output_string.charAt(0) === '-') {
        let negativePart = output_string.slice(1);
        let output_array = negativePart.split("");

        if (output_array.length > 3) {
            for (let i = output_array.length - 3; i > 0; i -= 3) {
                output_array.splice(i, 0, ",");
            }
        }

        output_string = '-' + output_array.join("");
    } else {
        let output_array = output_string.split("");

        if (output_array.length > 3) {
            for (let i = output_array.length - 3; i > 0; i -= 3) {
                output_array.splice(i, 0, ",");
            }
        }

        output_string = output_array.join("");
    }

    if (decimal) {
        output_string += "." + decimal;
    }

    return output_string;
}

function ValidateInput (value) {
	let last_input = input.slice(-1);
	let operators = ["+", "-", "*", "/"];

	if (value == "." && last_input == ".") {
		return false;
	}

	if (operators.includes(value)) {
		if (operators.includes(last_input)) {
			return false;
		} else {
			return true;
		}
	}

	return true;
}

function PrepareInput(input) {
    // Replace percentages with their decimal equivalent
    let preparedInput = input.replace(/%/g, "/100");

    // Split the input into individual tokens
    let tokens = preparedInput.match(/(\d+\.\d+|\d+|\S)/g) || [];

    // Process each token to remove leading zeros in numbers
    for (let i = 0; i < tokens.length; i++) {
        if (!isNaN(tokens[i]) && tokens[i][0] === '0' && tokens[i].length > 1 && tokens[i][1] !== '.') {
            tokens[i] = tokens[i].replace(/^0+/, '');
        }
    }

    return tokens.join('');
}
