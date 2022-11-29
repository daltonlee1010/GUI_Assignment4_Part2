/*
Author: Dalton Lee
Created: November 20, at 3:00 PM
Description: This webpage creates a multiplication table completely dynamically based on 
parameters entered in an HTML form via the form of jQuery slider widgets. The webpage will
validate these inputs using the jquery.validate.js plugin. Then, every time a new table is generated,
it will be displayed in a new tab and labeled with the four parameters used to create it.

File: mult.js
GUI Assignment: Using the jQuery Plugin/UI with Your Dynamic Table PART 2: jQuery UI Slider and Tab Widgets
Dalton Lee, UMass Lowell Computer Science Student, dalton_lee@student.uml.edu
Copyright (c) 2021 by Dalton. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by Dalton Lee on November 27, at 9:30 PM
*/

var count = 0; // for tab ids

$().ready(function() {
    $("#tabs_div").tabs();
    $("#columnSlider").slider({
        range: true,
        min: -50,
        max: 50,
        step: 1,
        values: [-5, 5], // initial slider values
        slide: function (event, ui) {
            updateCMinRules();
            updateCMaxRules();
            if(ui.handle.nextSibling) { // Moving left slider
                document.getElementById("cmin").value = ui.value;
                $("#mult_form").valid();
            }
            else { // Moving right slider
                document.getElementById("cmax").value = ui.value;
                $("#mult_form").valid();
            }
            updateMultContainer();
        }
    });
    $("#rowSlider").slider({
        range: true,
        min: -50,
        max: 50,
        step: 1,
        values: [-5, 5], // initial slider values
        slide: function (event, ui) {
            updateRMinRules();
            updateRMaxRules();
            if(ui.handle.nextSibling) { // Moving left slider
                document.getElementById("rmin").value = ui.value;
                $("#mult_form").valid();
            }
            else { // Moving right slider
                document.getElementById("rmax").value = ui.value;
                $("#mult_form").valid();
            }
            updateMultContainer();
        }
    });

    // Set initial text input values to match up inital slider values
    $("#cmin").attr('value', $("#columnSlider").slider("option", "values")[0]);
    $("#cmax").attr('value', $("#columnSlider").slider("option", "values")[1]);
    $("#rmin").attr('value', $("#rowSlider").slider("option", "values")[0]);
    $("#rmax").attr('value', $("#rowSlider").slider("option", "values")[1]);

    // Two way binding for cmin input
    $("#cmin").change(function() {
        updateCMinRules();
        updateCMaxRules();
        var newVal = $(this).val();
        if ($("#mult_form").valid()) {
            $("#columnSlider").slider("values", 0, newVal);
            if($("#columnSlider").slider("option", "values")[1] != parseInt($("#cmax").val(), 10))
                $("#columnSlider").slider("values", 1, parseInt($("#cmax").val(), 10));
        }
        updateMultContainer();
    });
    // Two way binding for cmax input
    $("#cmax").change(function() {
        updateCMinRules();
        updateCMaxRules();
        var newVal = $(this).val();
        if ($("#mult_form").valid()) {
            $("#columnSlider").slider("values", 1, newVal);
            if($("#columnSlider").slider("option", "values")[0] != parseInt($("#cmin").val(), 10))
                $("#columnSlider").slider("values", 0, parseInt($("#cmin").val(), 10));
        }
        updateMultContainer();
    });
    // Two way binding for cmax input
    $("#rmin").change(function() {
        updateRMinRules();
        updateRMaxRules();
        var newVal = $(this).val();
        if ($("#mult_form").valid()) {
            $("#rowSlider").slider("values", 0, newVal);
            if($("#rowSlider").slider("option", "values")[1] != parseInt($("#rmax").val(), 10))
                $("#rowSlider").slider("values", 1, parseInt($("#rmax").val(), 10));
        }
        updateMultContainer();
    });
    // Two way binding for rmax input
    $("#rmax").change(function() {
        updateRMinRules();
        updateRMaxRules();
        var newVal = $(this).val();
        if ($("#mult_form").valid()) {
            $("#rowSlider").slider("values", 1, newVal);
            if($("#rowSlider").slider("option", "values")[0] != parseInt($("#rmin").val(), 10))
                $("#rowSlider").slider("values", 0, parseInt($("#rmin").val(), 10));
        }
        updateMultContainer();
    });

    $("#mult_form").validate({  // validate method can be found in jquery.validate.js
        // Rules for column and row input boxes
        rules: {
            cmin: {
                required: true, // The form cannot be submitted without this input field being entered.
                number: true,   // Don't allow inputs that contain anything other than #s 0-9
                step: 1,        // Require whole numbers to be entered
                min: -50,       // Number entered is at least -50
                max: parseInt($("#cmax").val(), 10) // Number entered is at most column max val
            },
            cmax: {
                required: true,
                number: true,
                step: 1,
                min: parseInt($("#cmin").val(), 10),
                max: 50
            },
            rmin: {
                required: true,
                number: true,
                step: 1,
                min: -50,
                max: parseInt($("#rmax").val(), 10)
            },
            rmax: {
                required: true,
                number: true,
                step: 1,
                min: parseInt($("#rmin").val(), 10),
                max: 50
            }
        },
        // Helpful messages that notify webpage user how to change inputs to make them valid
        messages: {
            cmin: {
                required: "Please enter a value for the column range",
                number: "Please enter a whole number",
                step: "Please enter a whole number",
                min: "Enter a number greater than or equal to -50",
                max: "Enter a number less than or equal to Col Max Value"
            },
            cmax: {
                required: "Please enter a value for the column range",
                number: "Please enter a whole number",
                step: "Please enter a whole number",
                min: "Enter a number greater than or equal to Col Min Value",
                max: "Enter a number less than or equal to 50"
            },
            rmin: {
                required: "Please enter a value for the row range",
                number: "Please enter a whole number",
                step: "Please enter a whole number",
                min: "Enter a number greater than or equal to -50",
                max: "Enter a number less than or equal to Row Max Value"
            },
            rmax: {
                required: "Please enter a value for the row range",
                number: "Please enter a whole number",
                step: "Please enter a whole number",
                min: "Enter a number greater than or equal to Row Min Value",
                max: "Enter a number less than or equal to 50"
            }
        }
    });

    updateMultContainer(); // show initial mult table

    // For saving multiplication tables to tabs
    $("#save_button").click(function() {
        // Check variable, set to false if there are any errors with text inputs
        var check = $("#mult_form").valid(); // valid method can be found in jquery.validate.js
        
        if(check == false) {
            return;
        }
        // Tab elements
        count += 1;

        // clone the current multiplication table
        var container_tabbed = document.createElement('div');
        container_tabbed.setAttribute('class', 'mult_container');
        container_tabbed.setAttribute('id', `mult_container_tab${count}`);

        var table = document.querySelector('#mult_table_disp');
        var table_copy = table.cloneNode(true);
        table_copy.setAttribute('id', `mult_table_tab${count}`);
        container_tabbed.appendChild(table_copy);

        // Create tab html code and append it to the tab list
        var li = $(`<li id='${count}'><a href='#tab-${count}'>
            C:(${parseInt($("#cmin").val(), 10)})-(${parseInt($("#cmax").val(), 10)}).
            R:(${parseInt($("#rmin").val(), 10)})-(${parseInt($("#rmax").val(), 10)})</a></li>`);
        $("#tabs_div").find( ".ui-tabs-nav").append( li ); //changed this line
        $("#tabs_div").append( `<div id='tab-${count}'></div>` );
        $(`#tab-${count}`).append(container_tabbed);
        $("#tabs_div").tabs("refresh");

        // Update rules to match the new tab layout
        updateIndTabRules();
        updateMulTabMinRules();
        updateMulTabMaxRules();
        $("#tab_form").valid();
    });


    $("#tab_form").validate({  // validate method can be found in jquery.validate.js
        // Rules for tab input boxes
        rules: {
            individual_del: {
                number: true,
                step: 1,
                min: 1,
                max: $("#tabs_ul").children().length
            },
            multiple_del_min: {
                number: true,
                step: 1,
                min: 1,
                max: parseInt($("#multiple_del_max").val(), 10)
            },
            multiple_del_max: {
                number: true,
                step: 1,
                min: parseInt($("#multiple_del_min").val(), 10),
                max: $("#tabs_ul").children().length
            }
        },
        // Helpful messages that notify webpage user how to change inputs to make them valid
        messages: {
            individual_del: {
                number: "Please enter a whole number",
                step: "Please enter a whole number",
                min: "Enter a number greater than or equal to 1",
                max: "Enter a number less than or equal to the # of tabs"
            },
            multiple_del_min: {
                number: "Please enter a whole number",
                step: "Please enter a whole number",
                min: "Enter a number greater than or equal to 1",
                max: "Enter a number less than or equal to Tab Max Delete"
            },
            multiple_del_max: {
                number: "Please enter a whole number",
                step: "Please enter a whole number",
                min: "Enter a number greater than or equal to Tab Min Delete",
                max: "Enter a number less than or equal to the # of tabs"
            }
        }
    });
    // Ensure individual tab deletion input is correct before performing deletion.
    $("#individual_del").change(function() {
        updateIndTabRules();
        $("#tab_form").valid();
    });
    // Ensure individual tab deletion input is correct, then perform deletion.
    $("#individual_del_button").click(function() {
        updateIndTabRules();
        var check = $("#tab_form").valid();
        if(check == false) {
            return;
        }
        var indexTab = parseInt($("#individual_del").val(), 10) - 1;
        var li_item = $("#tabs_div").find(".ui-tabs-nav li:eq(" + indexTab + ")");
        var div_item_id = "#tab-".concat(`${li_item.attr('id')}`);
        $(div_item_id).remove();
        li_item.remove();
        $("#tabs_div").tabs("refresh");
        updateIndTabRules();
        updateMulTabMinRules();
        updateMulTabMaxRules();
        $("#tab_form").valid();
    });
    // Ensure multiple tab deletion min input is correct before performing deletion.
    $("#multiple_del_min").change(function() {
        updateMulTabMinRules();
        updateMulTabMaxRules();
        $("#tab_form").valid();
    });
    // Ensure multiple tab deletion max input is correct before performing deletion.
    $("#multiple_del_max").change(function() {
        updateMulTabMinRules();
        updateMulTabMaxRules();
        $("#tab_form").valid();
    });
    // Ensure multiple tab deletion inputs are correct, then perform deletion.
    $("#multiple_del_button").click(function() {
        updateMulTabMinRules();
        updateMulTabMaxRules();
        var check = $("#tab_form").valid();
        if(check == false) {
            return;
        }
        var indexTabMin = parseInt($("#multiple_del_min").val(), 10) - 1;
        var indexTabMax = parseInt($("#multiple_del_max").val(), 10) - 1;
        var li_item = " ";
        for(var indexTab = indexTabMax; indexTab >= indexTabMin; indexTab--) {
            li_item = $("#tabs_div").find(".ui-tabs-nav li:eq(" + indexTab + ")").remove();
            var div_item_id = "#tab-".concat(`${li_item.attr('id')}`);
            $(div_item_id).remove();
            li_item.remove();
        }
        $("#tabs_div").tabs("refresh");
        updateIndTabRules();
        updateMulTabMinRules();
        updateMulTabMaxRules();
        $("#tab_form").valid();
    });
});


// Validation plugin requires lots of updates,
// these functions provide short reusable methods to do that
function updateCMinRules() {
    $("#cmin").rules('remove');
    $("#cmin").rules('add', {
        required: true,
        number: true,
        step: 1,
        min: -50,
        max: parseInt($("#cmax").val(), 10)
    });
}

function updateCMaxRules() {
    $("#cmax").rules('remove');
    $("#cmax").rules('add', {
        required: true,
        number: true,
        step: 1,
        min: parseInt($("#cmin").val(), 10),
        max: 50
    });
}

function updateRMinRules() {
    $("#rmin").rules('remove');
    $("#rmin").rules('add', {
        required: true,
        number: true,
        step: 1,
        min: -50,
        max: parseInt($("#rmax").val(), 10)
    });
}

function updateRMaxRules() {
    $("#rmax").rules('remove');
    $("#rmax").rules('add', {
        required: true,
        number: true,
        step: 1,
        min: parseInt($("#rmin").val(), 10),
        max: 50
    });
}

function updateIndTabRules() {
    $("#individual_del").rules('remove');
    $("#individual_del").rules('add', {
        number: true,
        step: 1,
        min: 1,
        max: $("#tabs_ul").children().length
    });
}

function updateMulTabMinRules() {
    $("#multiple_del_min").rules('remove');
    $("#multiple_del_min").rules('add', {
        number: true,
        step: 1,
        min: 1,
        max: parseInt($("#multiple_del_max").val(), 10)
    });
}

function updateMulTabMaxRules() {
    $("#multiple_del_max").rules('remove');
    $("#multiple_del_max").rules('add', {
        number: true,
        step: 1,
        min: parseInt($("#multiple_del_min").val(), 10),
        max: $("#tabs_ul").children().length
    });
}





// Dynamic updates of multiplicaiton container happen with every change in slider/input
function updateMultContainer() {
    // Check variable, set to false if there are any errors with text inputs
    var check = $("#mult_form").valid(); // valid method can be found in jquery.validate.js
    
    if(check == false) {
        return;
    }
    else {
        // Extract values from input fields, store in variables..
        var cmin = document.getElementById('cmin').value;
        var cmax = document.getElementById('cmax').value;
        var rmin = document.getElementById('rmin').value;
        var rmax = document.getElementById('rmax').value;

        // Convert values into integers to use in min/max checks & comparison checks
        var cmin_int = parseInt(cmin, 10);
        var cmax_int = parseInt(cmax, 10);
        var rmin_int = parseInt(rmin, 10);
        var rmax_int = parseInt(rmax, 10);

        // If contents created by this js file upon clicking submit exist, delete them..
        var container_exists = document.getElementById("mult_container_disp");
        if(container_exists != null)
            container_exists.parentNode.removeChild(container_exists);
        var table_exists = document.getElementById("mult_table_disp");
        if(table_exists != null)
            table_exists.parentNode.removeChild(table_exists);

        generateTable(cmin_int, cmax_int, rmin_int, rmax_int);
    }
}

// Generating tables occur with every multiplication container update
function generateTable(cmin, cmax, rmin, rmax) {
    // Declare variables that will be used to display the multiplication table
    var container = document.createElement('div');
    container.setAttribute('class', 'mult_container');
    container.setAttribute('id', 'mult_container_disp');
    var table = document.createElement('table');
    table.setAttribute('class', 'mult_table');
    table.setAttribute('id', 'mult_table_disp');
    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');

    // Creating and adding data to first row of the table
    var row_1 = document.createElement('tr');
    var heading_1 = document.createElement('th');
    heading_1.innerHTML = "#";
    row_1.appendChild(heading_1);

    // Add values on head row (contains column values) from min to max value
    for(var i = cmin; i <= cmax; i++)
    {
        var heading_2 = document.createElement('th');
        heading_2.innerHTML = i.toString();
        row_1.appendChild(heading_2);
    }
    thead.appendChild(row_1);

    // Creating and adding data to second row of the table
    // Add values on tbody th column (contains row numbers) from min to max value
    for(var i = rmin; i <= rmax; i++)
    {
        var row_next = document.createElement('tr');
        var row_next_head = document.createElement('th');
        row_next_head.innerHTML = i.toString();
        row_next.appendChild(row_next_head);

        // Calculate and fill in all td of the table (products of the column's and row's values)
        for(var j = cmin; j <= cmax; j++)
        {
            var row_next_data = document.createElement('td');
            var product = i * j;
            row_next_data.innerHTML = product.toString();
            row_next.appendChild(row_next_data);
        }
        tbody.appendChild(row_next);
    }

    // Append proper html elements as children to other elements
    container.appendChild(table);
    table.appendChild(thead);
    table.appendChild(tbody);

    // Adding the entire table to the body tag
    $(".formDiv").after(container);    
}