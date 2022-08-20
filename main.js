// JSON input -> '{ "data": { "fish": "cake", "array": [1,2,3], "children": [ { "something": "else" }, { "candy": "cane" }, { "sponge": "bob" } ] } } '
// desired output -> { data: { fish: 'cake', array: [ 1, 2, 3 ], children: [ { something: 'else' }, { candy: 'cane' }, { sponge: 'bob } ] } }

const parseJSON = str => {
    // create variable that will be used to track current index of JSON string that is passed in as argument, initialized to 0th index\
    let i = 0;
    // first character of str should be a { so we need a way to parse objects and handle everything inside of the object individually
    // create function that handles objects
    function parseObj() {
        // if we are currently iterating on a curly brace, that means we are at another object, so need to go to next character by skipping a white space
        if (str[i] === '{') {
            i++;
            skipWhitespace();

            // create a boolean flag initialize to true to represent that this is the first time through the JSON flow diagram (meaning there will not be a comma right after the '{')
            let firstPass = true;
        // need to stay inside of this logic until you hit a '}' which will signify the end of the current object
            while (str[i] !== '}') {
                // check if we are on firstPass, if not, want to get past a comma and whitespace that will be there by definition of object structure
                if (!firstPass) {
                    eatComma();
                    skipWhitespace();
                }
                // this means that we are currently at something that is not an object and need to invoke our helper function to determine how to parse whatever is located at current index
                // whatever comes first after the opening curly bracket will be a key, so we can store it in a variable called key
                const key = parseString();
                // we know that keys are all strings in JSON, so can invoke the parseString function
                // store the colon that is after the key we just parsed, and move to the next index location by invoking a helper function
                eatColon();
                // store and skip over the whitespace that follows all colons
                skipWhitespace();
                // parse the value associated with the key that we just parsed (note: may also be an object, which will invoke parseObj function within this helper function that we are implementing)
                const value = parseValue();
                // reassign firstPass to equal false, to handle commas appropriately in the future
                firstPass = false;
            }
            // move to next character, which will then determine what to do depending on what next character is
            i++;
        }
    }
    // create eatComma function referenced above, which will skip past commas and continue iterating through str
    function eatComma() {
        // this function will only be invoked when there should be a comma, so if there is, we know it is there and can skip it. Otherwise, we need to throw an error
        if (str[i] !== ',') {
            throw new Error('Expected ",".');
        }
        // otherwise, if error is not hit, continue iterating
        i++;
    }
    // implement eatColon function following same logic above
    function eatColon() {
        if (str[i] !== ':') {
            throw new Error('Expected ":",.');
        }
        i++;
    }
}


