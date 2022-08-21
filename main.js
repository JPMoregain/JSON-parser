// JSON input -> '{ "data": { "fish": "cake", "array": [1,2,3], "children": [ { "something": "else" }, { "candy": "cane" }, { "sponge": "bob" } ] } } '
// desired output -> { data: { fish: 'cake', array: [ 1, 2, 3 ], children: [ { something: 'else' }, { candy: 'cane' }, { sponge: 'bob } ] } }

const parseJSON = str => {
    // create variable that will be used to track current index of JSON string that is passed in as argument, initialized to 0th index\
    let i = 0;
    // first character of str should be a { so we need a way to parse objects and handle everything inside of the object individually
    // create function that handles objects
    // return evaluated result of parseValue
    const parsedResult = parseValue();
    expectEndOfInput();
    return parsedResult;

    function parseObj() {
        // if we are currently iterating on a curly brace, that means we are at another object, so need to go to next character by skipping a white space
        if (str[i] === '{') {
            i++;
            skipWhitespace();
            
            // create object that will be returned to parser function
            const result = {};

            // create a boolean flag initialize to true to represent that this is the first time through the JSON flow diagram (meaning there will not be a comma right after the '{')
            let firstPass = true;
        // need to stay inside of this logic until you hit a '}' which will signify the end of the current object
            while (i < str.length && str[i] !== '}') {
                // check if we are on firstPass, if not, want to get past a comma and whitespace that will be there by definition of object structure
                if (!firstPass) {
                    eatComma();
                    skipWhitespace();
                }
                // this means that we are currently at something that is not an object and need to invoke our helper function to determine how to parse whatever is located at current index
                // whatever comes first after the opening curly bracket will be a key, so we can store it in a variable called key
                const key = parseString();
                console.log(key)
                if (key === undefined) {
                    expectObjectKey();
                }
                // we know that keys are all strings in JSON, so can invoke the parseString function
                // store the colon that is after the key we just parsed, and move to the next index location by invoking a helper function
                skipWhitespace();
                eatColon();
                // parse the value associated with the key that we just parsed (note: may also be an object, which will invoke parseObj function within this helper function that we are implementing)
                const value = parseValue();
                // add key value pair to current object
                result[key] = value;
                // reassign firstPass to equal false, to handle commas appropriately in the future
                firstPass = false;
            }
            expectNotEndOfInput("}");
            // move to next character, which will then determine what to do depending on what next character is
            i++;
            return result;
        }
    }
    // create function that will parse an array if current element of str is a '['
    function parseArray() {
        if (str[i] === '[') {
            // move to next character after opening bracket
            i++;
            // JSON has a space after an array bracket, so need to "eat the space" using the skipWhiteSpace function
            skipWhitespace();
            // create empty array that will be populated as we parse the JSON array
            const result = [];
            // create boolean flag that will be used to track whether we are on the first element of the array, initialized to true (if this is false, that means there will be a comma and we need to eat it)
            let initial = true;
            // continue parsing as long as current element is not a ']', otherwise this means we are at the end of array and break out of loop
            while (str[i] !== ']') {
                // if initial is not true, that means that we are currently at a comma and we need to eat it
                if (!initial) {
                    eatComma();
                }
                // otherwise, continue on parsing characters
                const currVal = parseValue();
                // push each value into result array
                result.push(currVal);
                // reassign initial to false (will only change on first time through while loop)
                initial = false;
            }
            // move to next character 
            i++;        
            return result;
        }
    }
    // create helper function for parsing numbers
    function parseNumber() {
        // begin at current index, which is the first number in the number that we are parsing
        let firstNum = i;
        // edge case for if first number is negative
        if (str[i] === "-") {
            i++;
        }
        if (str[i] === "0") {
            i++;
        }
        // continue parsing as long as current value is a valid single digit integer, can probably combine this line and previous conditional into one..
        else if (str[i] >= "1" && str[i] <= "9") {
            i++;
        // after first character, continue parsing as long as current character is a string of a valid single digit integer
        while (str[i] >= "0" && str[i] <= "9") {
            i++;
            }
        }
        // repeat logic for if first char is a non-integer number
        if (str[i] === ".") {
            i++;
            // continue parsing until we hit a non-number string
            while (str[i] >= "0" && str[i] <= "9") {
                i++;
            }
        }
        // repeat logic for if current character is a floating point (represented by 'e' or 'E' in front of the number)
        if (str[i] === "e" || str[i] === "E") {
            i++;
            // parse through next character which should delineate whether number is negative or positive
            if (str[i] === "-" || str[i] === "+") {
                i++;
            }
            // continue parsing until we hit a character that is not a single digit integer
            while (str[i] >= "0" && str[i] <= "9") {
                i++;
            }
        }
        // return slice of str that contains correct number that has now been parsed, based on when these loops break out
        if (i > firstNum) {
            return Number(str.slice(firstNum, i));
        }
    }
    // create parseString function that will parse strings that are nested within the strigified JSON string
    function parseString() {
        // if current char is a double quote, that means we need to parse this string, so move to next character to begin parsing
        if (str[i] === '"') {
            i++;
            // initialize a new variable to an empty string -> this will be used to store the current string as we populate it by parsing through
            let result = '';
            // continue parsing until we hit another double quote, which signifies the end of the current string
            while (str[i] !== '"') {
                // check if current char is a '\' which tells us to look at the actual next value
                if (str[i] === "\\") {
                    const escapedChar = str[i + 1];
                    if (
                        char === '"' ||
                        char === "\\" ||
                        char === "/" ||
                        char === "b" ||
                        char === "f" ||
                        char === "n" ||
                        char === "r" ||
                        char === "t"
                    ) {
                        // if char after escape has a special meaning, concat it to result str
                        result += char;
                        // keep parsing
                        i++;
                    }
                    // implement logic to handle hexidecimal values
                    else if (char === "u") {
                        if (
                            isHexidecimal(str[i + 2]) &&
                            isHexidecimal(str[i + 3]) &&
                            isHexidecimal(str[i + 4]) &&
                            isHexidecimal(str[i + 5])
                        ) {
                            result += String.fromCharCode(
                                parseInt(str.slice(i + 2, i + 6), 16)
                            );
                            i += 5;
                        }
                    }
                }
                else {
                    result += str[i];
                }
                i++;
            }
            i++;
            return result;
        }
    }
    // create hexadecimal helper function
    function isHexidecimal(char) {
        return (
            (char >= "0" && char <= "9") ||
            (char.toLowerCase() >= "a" && char.toLowerCase() <= "f")
        );
    }
    // create parseValue function, that will be used on whatever value we are at (and will be invoked by more specific functions like parseObject, parseArray)
    function parseValue() {
        // there will always be a white space, so need to skip that first
        skipWhitespace();
        const value = 
            parseString() ??
            parseNumber() ??
            parseObj() ??
            parseArray() ??
            parseKeyword('true', true) ??
            parseKeyword('false', false) ??
            parseKeyword('null', null);
        skipWhitespace();
        return value;
    }
    // create parseKeyword function that will handle boolean values and null
    function parseKeyword(keyword, parsedKeyword) {
        if (str.slice(i, i + keyword.length) === keyword) {
            i += keyword.length;
            return parsedKeyword;
        }
    }
    // create skipWhiteSpace function that will skill a literal empty string space, or special characters that occur from strigifying space/tab/return
    function skipWhitespace() {
        while (
            str[i] === " " || 
            str[i] === "\n" || 
            str[i] === "\t" || 
            str[i] === "\r"
        ) {
            i++;
        }
    }
    // create eatComma function referenced above, which will skip past commas and continue iterating through str
    function eatComma() {
        // this function will only be invoked when there should be a comma, so if there is, we know it is there and can skip it. Otherwise, we need to throw an error
        expectCharacter(",");
        // otherwise, if error is not hit, continue iterating
        i++;
    }
    // implement eatColon function following same logic above
    function eatColon() {
        expectCharacter(":");
        i++
    }
    // create expectCharacter helper function
    function expectCharacter(expected) {
        if (str[i] !== expected) {
            console.log('there has been an error')
        }
    }
    // other error handling
    function expectNotEndOfInput(expected) {
        if (i === str.length) {
          printCodeSnippet(`Expecting a \`${expected}\` here`);
          throw new Error("JSON_ERROR_0001 Unexpected End of Input");
        }
      }
    
      function expectEndOfInput() {
        if (i < str.length) {
          printCodeSnippet("Expecting to end here");
          throw new Error("JSON_ERROR_0002 Expected End of Input");
        }
      }
    
      function expectObjectKey() {
        printCodeSnippet(`Expecting object key here
    
    For example:
    { "foo": "bar" }
      ^^^^^`);
        throw new Error("JSON_ERROR_0003 Expecting JSON Key");
      }

      function printCodeSnippet(message) {
        const from = Math.max(0, i - 10);
        const trimmed = from > 0;
        const padding = (trimmed ? 4 : 0) + (i - from);
        const snippet = [
          (trimmed ? "... " : "") + str.slice(from, i + 1),
          " ".repeat(padding) + "^",
          " ".repeat(padding) + message
        ].join("\n");
        console.log(snippet);
      }
}

console.log(parseJSON('{ "data": { "fish": "cake", "array": [1,2,3], "children": [ { "something": "else" }, { "candy": "cane" }, { "sponge": "bob" } ] } } '))