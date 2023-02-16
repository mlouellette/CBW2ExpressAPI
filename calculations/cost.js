const Joi = require('joi');

// Residential calculations
const calculateResidential = (select, floors, app) => {
    let per = 0;
    let tier = 0;

    switch (select) {
        case "Standard":
            per = 10;
            tier = 7565.00;
            break;
        case "Premium":
            per = 13
            tier = 12345.00;
            break;
        case "Excelium":
            per = 16
            tier = 15400.00;
            break;

    };

    var appFloor = Math.ceil((app / (floors * 6)));
    var column = Math.ceil(floors / 20);

    // elevator required
    var numResEle = appFloor * column;

    var totalPrice = tier * numResEle;

    var installationFees = (totalPrice * per) / 100;

    // total cost
    var finalPrice = totalPrice + installationFees;

    const schema = {
        "Required Elevators": numResEle,
        "Total Cost": format(finalPrice)

    }

    return schema;

};

// Calculate the average of an array
function calculateAverage(array) {
    let total = 0;
    let count = 0;

    array.forEach(function (item) {
        total += item;
        count++;

    });

    return (total / count).toFixed(2);

}

// Parse word into titleCase for example : "example" will output "Example"  
function titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
};

// Format my number values in USD
function format(num) {
    let formatting_options = {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    };

    return num.toLocaleString('en-US',
        formatting_options);

};

// Input validation function for schema
function validatePost(envelope) {
    const schema = {
        first_name: Joi.string().min(2).required(),
        last_name: Joi.string().min(2).required(),
        message: Joi.string().min(0).allow("")

    };
    return Joi.validate(envelope, schema);

}

module.exports = {
    calculateResidential,
    calculateAverage,
    titleCase,
    validatePost


}