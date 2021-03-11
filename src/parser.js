const parse = (input) => {
    
    // we're going to return this object at the end
    let parsed_results = {
        housenum: null,
        direction: null,
        streetname: null,
        streettype: null,
        unittype: null,
        unitnum: null
    }

    // we want to keep track of which rules were applied to the input
    let rules_applied = []

    // these regexes will chop off pieces of the input
    let initial_rules = [
        {
            rule: "House number: front digits",
            regex: /^([\d]+)/,
            target_field: `housenum`,
            capture: 2,
            remove: true
        },
        {
            rule: "Unit number: back digits + letter, suffix",
            regex: /\s#?([\d-]+?[a-zA-Z-]?)$/,
            target_field: `unitnum`,
            capture: 2,
            remove: true
        },
        {
            rule: "Unit type: suffix",
            regex: /(APT|UNIT|SUITE|STE|REAR|UPPER|UPPR|LOWR|LOWER|OFC)$/i,
            target_field: `unittype`,
            capture: 2,
            remove: true
        },
        {
            rule: "Street Direction: prefix",
            regex: /^(E|W|N|S|EAST|WEST|NORTH|SOUTH)\s/i,
            target_field: `direction`,
            capture: 2,
            remove: true,
        },
        {
            rule: "Street Direction: suffix",
            regex: /\s(E|W|N|S|EAST|WEST|NORTH|SOUTH)$/i,
            target_field: `direction`,
            capture: 2,
            remove: true,
        },
        {
            rule: "Street Type: suffix",
            regex: /\s(ST|AVE|RD|HWY|STREET|AVENUE|ROAD|PLACE|PL|DRIVE|DR|BLVD)$/i,
            target_field: `streettype`,
            capture: 2,
            remove: true,
        }
    ]

    // run through these initial rules
    // to get the big stuff out of the way
    initial_rules.forEach(r => {

        // check the regex against the input
        let results = r.regex.exec(input)

        // if there's a hit
        if (results && results.length > 0) {

            // assign that text, using the `capture` value as list index
            parsed_results[r.target_field] = results[r.capture - 1]

            // assign the regex results to the regex object
            r["results"] = results
            
            // push this rule to the rule-tracking array
            rules_applied.push(r)

            // modify the input to remove what we just matched and stored
            if (r.remove) {
                input = input.replace(r.regex, "").trim()
            }
        }
    })

    // now we go to work on the street name
    // these regexes match and replace street name fixes
    let street_name_rules = [
        // this must become before ST => SAINT
        {
            rule: "Expand: ST FAIR => STATE FAIR",
            regex: /(ST FAIR)/ig,
            replacement: "State Fair "
        },
        {
            rule: "Expand: GD => GRAND",
            regex: /(GD)\s/ig,
            replacement: "Grand "
        },
        {
            rule: "Expand: MT => MOUNT",
            regex: /(MT)\s/ig,
            replacement: "Mount "
        },
        {
            rule: "Expand: ST => SAINT",
            regex: /(ST)\s/ig,
            replacement: "Saint "
        },
        {
            rule: "Expand: 7 Mile => Seven Mile",
            regex: /(7 MILE)/ig,
            replacement: "Seven Mile"
        },
        {
            rule: "Expand: 8 Mile => Eight Mile",
            regex: /(8 MILE)/ig,
            replacement: "Eight Mile"
        },
        {
            rule: "Standardize: CLAIRMONT => CLAIRMOUNT",
            regex: /(CLAIRMONT)/ig,
            replacement: "Clairmount"
        }
    ]

    // Now we iterate through the street-name specific rules.
    street_name_rules.forEach(sr => {
        let results = sr.regex.exec(input)

        // if there's a hit
        if (results && results.length > 0) {

            // apply the replacement text specified in the rule
            input = input.replace(sr.regex, sr.replacement)

            // attach results to rule object
            sr["results"] = results
            
            // push to applied array
            rules_applied.push(sr)
        }
    })

    parsed_results.streetname = input.trim() === "" ? null : input.trim()

    return {
        results: parsed_results,
        applied: rules_applied,
    };
}

export default parse;
