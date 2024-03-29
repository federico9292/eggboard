var _rows = 10;
var _iterations = 0;
var _current_item;
var _current_name;
var _currentPage = 'globalPage'
var _unique = 0;
var _globalPageName = 'Eggboard';
var _testEndpoint = 'https://egg-brosssh-git-deployment-brosssh.vercel.app';
var _prodEndpoint = 'https://egg-brosssh.vercel.app'
var _devEndpoint = 'https://egg-brosssh-9v86ugob7-brosssh.vercel.app';
var current_endpoint;
var isTest = false;

$(document).ready(function () {

    isTest ? current_endpoint = window._testEndpoint : current_endpoint = window._prodEndpoint;
    addTransparent();

    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#myTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    if (localStorage.getItem("EID")) {
        jQuery('#EID')[0].value = localStorage.getItem("EID");
        jQuery('#EID_submit')[0].value = localStorage.getItem("EID");

    }
    else {
        jQuery('#EID')[0].value = '';
    }


    /*if (localStorage.getItem("EIDSubmit")) {
        jQuery('#EIDSubmit')[0].value = localStorage.getItem("EIDSubmit");
    }
    else {
        jQuery('#EIDSubmit')[0].value = '';
    }*/

    createDropdowns();

    var dropdownArti = jQuery('#dropdown_menu_Artifacts_multi')[0];
    var dropdownSton = jQuery('#dropdown_menu_Ingredients_multi')[0];
    var dropdownIngr = jQuery('#dropdown_menu_Stones_multi')[0];

    const options = {
        attributes: true
    }

    function callback(mutationList, observer) {
        mutationList.forEach(function (mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (jQuery('.spinner-border.align-items-center.d-flex.justify-content-center').length == '0') {
                    deactivateBackgroundGrey();
                }
            }
        })
    }
    const observerA = new MutationObserver(callback)
    observerA.observe(dropdownArti, options);

    const observerI = new MutationObserver(callback)
    observerI.observe(dropdownIngr, options);

    const observerS = new MutationObserver(callback)
    observerS.observe(dropdownSton, options);

})

function toggleCheckbox() {
    (jQuery('#justOneShip')[0].checked) ? window._unique = 1 : window._unique = 0;
}

function getLeaderboard(type, name) {
    if (this._currentPage == 'personalPage') {
        switchPage('globalPage');
    }
    const http = new XMLHttpRequest()
    if (window._current_item && (window._current_item.toLowerCase() != type.toLowerCase() || window._current_name.toLowerCase() != name.toLowerCase())) {
        window._rows = 10;
        window._iterations = 0;
    }

    http.open("GET", current_endpoint + "/getLeaderboard?element=" + name + "&n=" + window._rows + "&top_n=" + window._unique);
    http.send();
    name = name.charAt(0).toUpperCase() + name.slice(1)
    window._current_item = type;
    window._current_name = name;
    var spinnerBorder = document.createElement('div');
    jQuery('body')[0].insertBefore(spinnerBorder, jQuery('body')[0].firstChild)

    spinnerBorder.setAttribute('style', "position: fixed;top:30%;left:38%; width:10rem; height: 10rem; visibility: visible; z-index: 12222!important");
    spinnerBorder.classList.add("spinner-border");
    spinnerBorder.classList.add("align-items-center");
    spinnerBorder.classList.add("d-flex");
    spinnerBorder.classList.add("justify-content-center");

    activateBackgroundGrey();

    http.onload = () => {
        jQuery('.spinner-border')[0].remove();
        deactivateBackgroundGrey();

        displayButtonMore();
        displaySearch();

        if (type == 'Artifact') {
            fillTableArtifact(http.responseText, name);

        } else if (type == 'Stone') {
            fillTableStones(http.responseText, name);
        }
        else {
            fillTableIngredient(http.responseText, name);
        }
    }
}

function fillTableIngredient(response, name) {
    //console.log(response);

    highlightDropdownItem(name);
    var span1 = document.createElement('span');
    span1.classList.add('caret');
    var span2 = document.createElement('span');
    span2.classList.add('caret');
    var span3 = document.createElement('span');
    span3.classList.add('caret');
    window._globalPageName = 'Eggboard | Ingredient | ' + name;

    //changeName
    jQuery('.container-fluid h1')[0].textContent = 'Eggboard | Ingredient | ' + name;
    changeName(_globalPageName, 'ingredient', name);

    var ingredientDropdown = jQuery('#ingredientDropdown')[0];
    var stoneDropdown = jQuery('#stoneDropdown')[0];
    var artifactsDropdown = jQuery('#artifactDropdown')[0];

    ingredientDropdown.textContent = name + ' ';
    ingredientDropdown.appendChild(span1);
    //ingredientDropdown.classList.remove('btn-primary');
    //ingredientDropdown.classList.add('btn-info');

    stoneDropdown.textContent = 'Stones ';
    stoneDropdown.appendChild(span2);
    //stoneDropdown.classList.remove('btn-info');
    //stoneDropdown.classList.add('btn-primary');


    artifactsDropdown.textContent = 'Artifacts ';
    artifactsDropdown.appendChild(span3);
    //artifactsDropdown.classList.remove('btn-info');
    //artifactsDropdown.classList.add('btn-primary');


    jQuery('#thead tr').remove(); //to clear the columns;
    jQuery('#myTable tr').remove(); //To clear the rows (pointed by @nunners)
    response = JSON.parse(response);
    jQuery('#thead').append(
        '<tr class=\'fs-5\'><th>Pos</th>'
        + '<th>Name</th>'
        + '<th>Stars</th>'
        + '<th style=\"padding-right:0px;\">Capacity</th>'
        + '<th>T1</th>'
        + '<th>T2</th>'
        + '<th>T3</th>'
        + '<th>Total</th></tr>'
    );


    jQuery.each(response.content, function (_key, value) {
        var smaller = (value[1].length > 14) ? 'font-size:smaller;' : '';
        var style = "vertical-align: middle; ";

        switch (value[0]) {
            case "1":
                style += 'background-color: gold; font-palette: dark; color: black; font-weight: bolder;';
                break;
            case "2":
                style += 'background-color: lightgrey; font-palette: dark; color: black;';
                break;
            case "3":
                style += 'background-color: rgb(205,88,50); font-palette: dark; color: black;';
                break;
            default:
                break;
        }
        jQuery('#myTable')
            .append('<tr style=\"' + style + ';\" class=\'fs-5\'><td >' + value[0]
                + '</td><td style=\"vertical-align: middle;' + smaller + '\">' + value[1]
                + '</td><td>' + value[2]
                + '</td><td style=\"padding-right:0px;\">' + value[3]
                + '</td><td>' + value[4]
                + '</td><td>' + value[5]
                + '</td><td>' + value[6]
                + '</td><td>' + value[7]
                + '</td></tr>');
    });
}

function fillTableArtifact(response, name) {
    //console.log(response);
    highlightDropdownItem(name);
    var span = document.createElement('span');
    span.classList.add('caret');
    var span2 = document.createElement('span');
    span2.classList.add('caret');
    var span3 = document.createElement('span');
    span3.classList.add('caret');

    var ingredientDropdown = jQuery('#ingredientDropdown')[0];
    var stoneDropdown = jQuery('#stoneDropdown')[0];
    var artifactsDropdown = jQuery('#artifactDropdown')[0];

    ingredientDropdown.textContent = 'Ingredients ';
    ingredientDropdown.appendChild(span);
    //ingredientDropdown.classList.add('btn-primary');
    //ingredientDropdown.classList.remove('btn-info');


    stoneDropdown.textContent = 'Stones ';
    stoneDropdown.appendChild(span2);
    //stoneDropdown.classList.add('btn-primary');
    //stoneDropdown.classList.remove('btn-info');



    artifactsDropdown.textContent = name + ' ';
    artifactsDropdown.appendChild(span3);
    //artifactsDropdown.classList.add('btn-info');
    //artifactsDropdown.classList.remove('btn-primary');

    window._globalPageName = 'Eggboard | Artifact | ' + name;

    //changeName
    jQuery('.container-fluid h1')[0].textContent = 'Eggboard | Artifact |' + name;
    changeName(_globalPageName, 'artifact', name);

    jQuery('#thead tr').remove(); //to clear the columns;
    jQuery('#myTable tr').remove(); //To clear the rows (pointed by @nunners)
    response = JSON.parse(response);
    jQuery('#thead').append(
        '<tr class=\'fs-5\'><th>Pos</th>'
        + '<th>Name</th>'
        + '<th>Stars</th>'
        + '<th style=\"padding-right:0px;\">Capacity</th>'
        + '<th>T1</th>'
        + '<th>T2</th>'
        + '<th>T3</th>'
        + '<th>T4</th>'
        + '<th>Total</th></tr>'
    );

    jQuery.each(response.content, function (_key, value) {
        var smaller = (value[1].length > 14) ? 'font-size:smaller;' : '';
        var style = "vertical-align: middle; ";

        switch (value[0]) {
            case "1":
                style += 'background-color: gold; font-palette: dark; color: black; font-weight: bolder;';
                break;
            case "2":
                style += 'background-color: lightgrey; font-palette: dark; color: black;';
                break;
            case "3":
                style += 'background-color: rgb(205,88,50); font-palette: dark; color: black;';
                break;
            default:
                break;
        }
        jQuery('#myTable')
            .append('<tr style=\"' + style + ';\" class=\'fs-5\'><td >' + value[0]
                + '</td><td style=\"' + smaller + ';\">' + value[1]
                + '</td><td>' + value[2]
                + '</td><td style=\"padding-right:0px;\">' + value[3]
                + '</td><td>' + value[4]
                + '</td><td>' + value[5]
                + '</td><td>' + value[6]
                + '</td><td>' + value[7]
                + '</td><td>' + value[8]
                + '</td></tr>');
    });
}

function fillTableStones(response, name) {
    //console.log(response);
    highlightDropdownItem(name);
    var span1 = document.createElement('span');
    span1.classList.add('caret');
    var span2 = document.createElement('span');
    span2.classList.add('caret');
    var span3 = document.createElement('span');
    span3.classList.add('caret');



    window._globalPageName = 'Eggboard | Stone | ' + name;
    //changeName
    jQuery('.container-fluid h1')[0].textContent = 'Eggboard | Stone | ' + name;
    changeName(_globalPageName, 'stone', name);

    var ingredientDropdown = jQuery('#ingredientDropdown')[0];
    var stoneDropdown = jQuery('#stoneDropdown')[0];
    var artifactsDropdown = jQuery('#artifactDropdown')[0];

    ingredientDropdown.textContent = 'Ingredients';
    ingredientDropdown.appendChild(span1);
    //ingredientDropdown.classList.add('btn-primary');
    //ingredientDropdown.classList.remove('btn-info');


    stoneDropdown.textContent = name + ' ';
    stoneDropdown.appendChild(span2);
    //stoneDropdown.classList.add('btn-info');
    //stoneDropdown.classList.remove('btn-primary');


    artifactsDropdown.textContent = 'Artifacts ';
    artifactsDropdown.appendChild(span3);
    //artifactsDropdown.classList.remove('btn-info');
    //artifactsDropdown.classList.add('btn-primary');

    jQuery('#thead tr').remove(); //to clear the columns;
    jQuery('#myTable tr').remove(); //To clear the rows (pointed by @nunners)
    response = JSON.parse(response);
    jQuery('#thead').append(
        '<tr class=\'fs-5\'><th>Pos</th>'
        + '<th>Name</th>'
        + '<th>Stars</th>'
        + '<th style=\"padding-right:0px;\">Capacity</th>'
        + '<th>T1</th>'
        + '<th>T2</th>'
        + '<th>T3</th>'
        + '<th>T4</th>'
        + '<th>Total</th></tr>'
    );


    jQuery.each(response.content, function (_key, value) {
        var smaller = (value[1].length > 14) ? 'font-size:smaller;' : '';
        var style = "vertical-align: middle; ";

        switch (value[0]) {
            case "1":
                style += 'background-color: gold; font-palette: dark; color: black; font-weight: bolder;';
                break;
            case "2":
                style += 'background-color: lightgrey; font-palette: dark; color: black;';
                break;
            case "3":
                style += 'background-color: rgb(205,88,50); font-palette: dark; color: black;';
                break;
            default:
                break;
        }
        jQuery('#myTable')
            .append('<tr style=\"' + style + ';\" class=\'fs-5\'><td >' + value[0]
                + '</td><td style=\"vertical-align: middle;' + smaller + '\">' + value[1]
                + '</td><td>' + value[2]
                + '</td><td style=\"padding-right:0px;\">' + value[3]
                + '</td><td>' + value[4]
                + '</td><td>' + value[5]
                + '</td><td>' + value[6]
                + '</td><td>' + value[7]
                + '</td><td>' + value[8]
                + '</td></tr>');
    });
}

function displaySearch() {

    jQuery('#myInput')[0].classList.remove('hidden');
    jQuery('#myInput')[0].value = '';
    jQuery('#myInput')[0].placeHolder = 'Type something to search the table';

}

function createDropdowns() {
    var menu_artifacts_multi = jQuery('#dropdown_menu_Artifacts_multi')[0];
    var menu_stones_multi = jQuery('#dropdown_menu_Stones_multi')[0];
    var menu_ingredients_multi = jQuery('#dropdown_menu_Ingredients_multi')[0];

    var arrayIngredients = "gold, tau, titanium".split(", ");
    var arrayStones = "clarity, lunar, prophecy, life, quantum, dilithium, soul, terra, tachyon, shell".split(", ");
    var arrayArtifacts = "bob, light, deflector, siab, actuator, monocle, metronome, feather, chalice, compass, rainstick, beak, lens, medallion, gusset, ankh, brooch, vial, necklace, totem, cube".split(", ");


    /** INGREDIENTS ROWS */
    var arrayIndex = 0;
    for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 1; column++, arrayIndex++) {
            var a = document.createElement('a');
            a.setAttribute('class', 'dropdown-item fs-4');
            a.setAttribute('href', '#');
            a.setAttribute('role', "button");
            a.setAttribute("onclick", "getLeaderboard(\'Ingredient\',\'" + arrayIngredients[arrayIndex] + "\')");
            a.text = " " + arrayIngredients[arrayIndex].charAt(0).toUpperCase() + arrayIngredients[arrayIndex].slice(1);
            var image = document.createElement('img');
            image.setAttribute('src', "./assets/ingredients/" + mapName('ingredient', arrayIngredients[arrayIndex]) + ".webp");
            image.setAttribute('height', '32px')
            image.setAttribute("onclick", "getLeaderboard(\'Ingredient\',\'" + arrayIngredients[arrayIndex] + "\')");

            menu_ingredients_multi.children[row].appendChild(image);
            menu_ingredients_multi.children[row].appendChild(a);
        }

    }

    /** STONES ROWS */
    var arrayIndex = 0;
    //var arrayRows = menu_artifacts_multi.getElementsByClassName('dropdown-row'); //7 righe
    for (let row = 0; row < 5; row++) {
        //var col = arrayRows[row].getElementsByTagName('a');// arrayRows[column].getElementsByClassName('dropdown-item'); //3 colonne
        for (let column = 0; column < 2; column++, arrayIndex++) {
            var a = document.createElement('a');
            a.setAttribute('class', 'dropdown-item fs-4');
            a.setAttribute('href', '#');
            a.setAttribute('role', "button");
            a.setAttribute("onclick", "getLeaderboard(\'Stone\',\'" + arrayStones[arrayIndex] + "\')");
            a.text = " " + arrayStones[arrayIndex].charAt(0).toUpperCase() + arrayStones[arrayIndex].slice(1);
            var image = document.createElement('img');
            image.setAttribute('src', "./assets/stones/" + mapName('stone', arrayStones[arrayIndex]) + ".webp");
            image.setAttribute('height', '32px')
            image.setAttribute("onclick", "getLeaderboard(\'Stone\',\'" + arrayStones[arrayIndex] + "\')");

            menu_stones_multi.children[row].appendChild(image);
            menu_stones_multi.children[row].appendChild(a);
        }

    }

    /** ARTIFACT ROWS */
    var arrayIndex = 0;
    //var arrayRows = menu_artifacts_multi.getElementsByClassName('dropdown-row'); //7 righe
    for (let row = 0; row < 7; row++) {
        //var col = arrayRows[row].getElementsByTagName('a');// arrayRows[column].getElementsByClassName('dropdown-item'); //3 colonne
        for (let column = 0; column < 3; column++, arrayIndex++) {
            var a = document.createElement('a');
            a.setAttribute('class', 'dropdown-item fs-4');
            a.setAttribute('href', '#');
            a.setAttribute('role', "button");
            a.setAttribute("onclick", "getLeaderboard(\'Artifact\',\'" + arrayArtifacts[arrayIndex] + "\')");
            a.text = " " + arrayArtifacts[arrayIndex].charAt(0).toUpperCase() + arrayArtifacts[arrayIndex].slice(1);
            var image = document.createElement('img');
            image.setAttribute('src', "./assets/artifacts/" + arrayArtifacts[arrayIndex] + ".webp");
            image.setAttribute('height', '32px')
            image.setAttribute("onclick", "getLeaderboard(\'Artifact\',\'" + arrayArtifacts[arrayIndex] + "\')");

            menu_artifacts_multi.children[row].appendChild(image);
            menu_artifacts_multi.children[row].appendChild(a);
        }

    }

}

function addMoreRows() {
    window._iterations = ++window._iterations;
    switch (window._iterations) {
        case 1:
            window._rows = window._rows + 10;
            break;
        case 2:
            window._rows = window._rows + 25;
            break;
        default:
            window._rows = window._rows + 50;
            break;
    }
}

function displayButtonMore(params) {
    //se iterazione è diverso da 0 mostro il bottone
    var button = jQuery('#buttonMore');

    button[0].classList.remove('hidden');
    button[0].setAttribute('onclick', 'getMoreRows("' + window._current_item + '","' + window._current_name + '")');


}

function getMoreRows(current_item, current_name) {
    addMoreRows();
    //console.log(window._rows, 'rows');
    getLeaderboard(current_item, current_name.toLowerCase());
}

function switchPage(pageName) {
    //jQuery('#' + pageName)[0].classList.add('bg-primary');
    jQuery('#page')[0].style = '';

    var normalizedName;

    if (pageName == 'globalPage') {
        //otherPage = 'personalPage';
        normalizedName = "Global Leaderboard Page"
        jQuery('#Global')[0].classList.remove('hidden');
        jQuery('#Personal')[0].classList.add('hidden');
        jQuery('#Submit')[0].classList.add('hidden');           //scheda submit EID

        jQuery('#globalPage')[0].classList.add('active');
        jQuery('#personalPage')[0].classList.remove('active');
        jQuery('#submitPage')[0].classList.remove('active');    //scheda submit EID 

        //jQuery('#thead_personal tr').remove(); //to clear the columns;
        //jQuery('#myPersonalTable tr').remove(); //To clear the rows (pointed by @nunners)
        jQuery('.container-fluid h1')[0].textContent = window._globalPageName;
        changeName(window._globalPageName, window._current_item, window._current_name);
        jQuery('#page')[0].textContent = normalizedName;

    } else if (pageName == 'personalPage') {
        //otherPage = 'globalPage';
        normalizedName = "Personal Leaderboard Page"
        jQuery('#Global')[0].classList.add('hidden');
        jQuery('#Personal')[0].classList.remove('hidden');
        jQuery('#Submit')[0].classList.add('hidden');           //scheda submit EID

        jQuery('#globalPage')[0].classList.remove('active');
        jQuery('#personalPage')[0].classList.add('active');
        jQuery('#submitPage')[0].classList.remove('active');    //scheda submit EID

        //jQuery('#thead tr').remove(); //to clear the columns;
        //jQuery('#myTable tr').remove(); //To clear the rows;

        jQuery('#buttonMore')[0].classList.add('hidden');
        jQuery('#myInput')[0].classList.add('hidden');
        jQuery('#page')[0].textContent = normalizedName;
        jQuery('.container-fluid h1')[0].textContent = 'Eggboard';

        addTransparent();

    }
    else {                                                       //scheda submit EID
        normalizedName = "Submit Ship Log Page";
        jQuery('#Global')[0].classList.add('hidden');
        jQuery('#Personal')[0].classList.add('hidden');
        jQuery('#Submit')[0].classList.remove('hidden');

        jQuery('#globalPage')[0].classList.remove('active');
        jQuery('#personalPage')[0].classList.remove('active');
        jQuery('#submitPage')[0].classList.add('active');

        //jQuery('#thead tr').remove(); //to clear the columns;
        //jQuery('#myTable tr').remove(); //To clear the rows;

        //jQuery('#thead_personal tr').remove(); //to clear the columns;
        //jQuery('#myPersonalTable tr').remove(); //To clear the rows (pointed by @nunners)

        jQuery('#buttonMore')[0].classList.add('hidden');
        jQuery('#myInput')[0].classList.add('hidden');

        jQuery('#page')[0].textContent = normalizedName;
        jQuery('.container-fluid h1')[0].textContent = 'Eggboard';

        addTransparent();

    }



    if (window._currentPage != pageName) {
        //alert(pageName);
        window._currentPage = pageName;
        //jQuery('#' + otherPage)[0].classList.remove('bg-primary');

        addTransparent();

    }
}

function saveValue(e) {
    var id = e.id;  // get the sender's id to save it . 
    var val = e.value; // get the value. 
    localStorage.setItem(id, val);// Every time user writing something, the localStorage's value will override . 
}

function getSavedValue(v) {
    if (!localStorage.getItem(v)) {
        return "";// You can change this to your defualt value. 
    }
    return localStorage.getItem(v);
}

function getPersonalLeaderboard(e) {
    var eid = document.getElementById("EID").value;
    //submitEID(eid);    
    getMYLeaderboard(eid);

}

function fillPersonalTable(response) {
    jQuery('#thead_personal tr').remove(); //to clear the columns;
    jQuery('#myPersonalTable tr').remove(); //To clear the rows (pointed by @nunners)

    jQuery('#thead_personal').append(
        '<tr class=\'fs-5\'><th>Item</th>'
        + '<th>Pos</th>'
        + '<th>Stars</th>'
        + '<th>Capacity</th>'
        + '<th>T1</th>'
        + '<th>T2</th>'
        + '<th>T3</th>'
        + '<th>T4</th>'
        + '<th>Total</th>'
        + '</tr>'
    );
    var paddingMetronome = '';
    jQuery.each(response, function (_key, value) {
        var paddingMetronome = "";
        var style = "cursor:pointer;";
        if (value[0] == 'metronome') {
            style += "padding-left: inherit;padding-right: inherit;";
        }
        jQuery('#myPersonalTable')
            .append('<tr class=\'fs-5\'><td> <img style=\"' + style + '\" src="./assets/' + reverseSuperMapName(value[0]) + '/' + superMapName(value[0]) + '.webp")" height="32px" onclick=getLeaderboard(\'' + reverseSuperMapName(value[0]).charAt(0).toUpperCase() + reverseSuperMapName(value[0]).substring(0, reverseSuperMapName(value[0]).length - 1).substring(1) + '\',\'' + value[0] + '\')>' + value[0].charAt(0).toUpperCase() + value[0].slice(1) + '</td><td>' + value[1]
                + '</td><td>' + value[2]
                + '</td><td>' + value[3]
                + '</td><td>' + value[4]
                + '</td><td>' + value[5]
                + '</td><td>' + value[6]
                + '</td><td>' + ((value[7] == 'X') ? '' : value[7])
                + '</td><td>' + value[8]
                + '</td></tr>');
    });
}

function compareSecondColumn(a, b) {
    if (parseInt(a[1]) === parseInt(b[1])) {
        return 0;
    }
    else {
        return (parseInt(a[1]) < parseInt(b[1])) ? -1 : 1;
    }
}

function toggleDarkMode() {
    (jQuery('#html')[0].getAttribute("data-bs-theme") == "light") ? jQuery('#html')[0].setAttribute('data-bs-theme', "dark") : jQuery('#html')[0].setAttribute('data-bs-theme', "light");
}

function submitEID(e) {
    try{
        var eid = document.getElementById("EIDSubmit").value;
    } catch (exception) {

    }
    var eid = "";
    const http = new XMLHttpRequest();
    http.open("GET", current_endpoint + "/sendNewEID?EID=" + eid);
    http.send();

    var spinnerBorder = document.createElement('div');
    jQuery('body')[0].insertBefore(spinnerBorder, jQuery('body')[0].firstChild)

    spinnerBorder.setAttribute('style', "position: fixed;top:30%;left:38%; width:10rem; height: 10rem; visibility: visible; z-index: 1222!important");
    spinnerBorder.classList.add("spinner-border");
    spinnerBorder.classList.add("align-items-center");
    spinnerBorder.classList.add("d-flex");
    spinnerBorder.classList.add("justify-content-center");


    activateBackgroundGrey();

    http.onload = function () {
        //getMYLeaderboard(eid,true);           //scheda submit EID
        jQuery('.spinner-border')[0].remove();  //scheda submit EID
        deactivateBackgroundGrey();  //scheda submit EID
        const toastElList = document.querySelectorAll('.toast')
        const toastList = [...toastElList].map(toastEl => new bootstrap.Toast(toastEl))
        var content = http.responseText;

        var successOrError;
        try {
            var response = JSON.parse(http.responseText);
            successOrError = (response.success) ? "success" : "danger";
            content = response.content;
            if (response.content.indexOf("You can submit your EID on ") > -1) {
                var date = new Date(Date.parse(response.content.substring(response.content.indexOf("You can submit your EID on "))));
                //console.log(date); 
                var dateNow = new Date(Date.now());
                var minutes = ((date - dateNow) / 1000) / 60;
                content = "You can submit your EID again in  " + minutes.toString().substring(0, minutes.toString().indexOf('.')) + ((minutes > 1) ? minutes + ' minutes' : minutes + ' minute');
            }
        } catch (error) {
            successOrError = "danger";
        }
        finally {
            console.log(response);
            showToast(successOrError, content);
        }
    }



    http.onerror = function (event) {
        console.log(event.currentTarget.responseText);
    }

}

function getMYLeaderboard(eid, personal) {
    const http = new XMLHttpRequest();
    http.open("GET", current_endpoint + "/getPersonalLeaderboard?EID=" + eid);
    try {
        http.send();
    } catch (error) {
        console.log(error);
        jQuery('#thead_personal tr').remove(); //to clear the columns;
        jQuery('#myPersonalTable tr').remove(); //To clear the rows (pointed by @nunners)
    }
    var spinnerBorder = document.createElement('div');
    jQuery('body')[0].insertBefore(spinnerBorder, jQuery('body')[0].firstChild)

    //if(!personal){        //scheda submit EID
    spinnerBorder.setAttribute('style', "position: fixed;top:30%;left:38%; width:10rem; height: 10rem; visibility: visible; z-index: 12222!important");
    spinnerBorder.classList.add("spinner-border");
    spinnerBorder.classList.add("align-items-center");
    spinnerBorder.classList.add("d-flex");
    spinnerBorder.classList.add("justify-content-center");
    activateBackgroundGrey();

    //}                     //scheda submit EID
    http.onload = function () {

        jQuery('.spinner-border')[0].remove();// .style='width:0rem; height: 0rem; visibility: hidden;';
        deactivateBackgroundGrey();
        //console.log(http.responseText, 'before the json parse');
        var content = http.responseText;
        var successOrError;

        try {
            var response = JSON.parse(http.responseText);
            successOrError = (response.success) ? "success" : "danger";
            //console.log(response, 'after the json parse');
            if (typeof (response.content) != 'string') {
                response.content = response.content.sort(compareSecondColumn);

                fillPersonalTable(response.content);
            } else {
                content = response.content;
                showToast(successOrError, content);
            }


        } catch (error) {
            console.log(error);
            jQuery('#thead_personal tr').remove(); //to clear the columns;
            jQuery('#myPersonalTable tr').remove(); //To clear the rows (pointed by @nunners)
        }
    }
    http.onerror = function (event) {
        console.log("the getPersonalLeaderboard call got an error");
        console.log(event.currentTarget.responseText);
        jQuery('.spinner-border')[0].remove();// .style='width:0rem; height: 0rem; visibility: hidden;';
        deactivateBackgroundGrey();
        jQuery('#thead_personal tr').remove(); //to clear the columns;
        jQuery('#myPersonalTable tr').remove(); //To clear the rows (pointed by @nunners)
    }
}

function showToast(successOrError, content) {
    const html =
        `<div class="toast align-items-center text-bg-` + successOrError + ` border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="5000" ><div class="d-flex">
    <div class="toast-body fs-3">`+ content + `</div>
    <button type="button" class="btn-close btn-close-white me-2 m-auto fs-3" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>`

    const container = document.getElementById("toast-container");
    container.innerHTML = container.innerHTML + html;

    const toastElList = document.querySelectorAll(".toast");
    toastElList.forEach((toastEl) => {
        const inst = bootstrap.Toast.getOrCreateInstance(toastEl, {
            animation: false // fix the issue because no delay in queueCallback
        });
        inst.show();
        toastEl.addEventListener(
            "hide.bs.toast",
            () => { });
        toastEl.addEventListener(
            "hidden.bs.toast",
            () => {
                inst.dispose();
                toastEl.remove();
                //console.log(inst, toastEl);
            },
            {
                once: true
            }
        );
    });
}

function changeName(firstPart, type, name) {
    var secondPart;
    addTransparent();
    if (type != null || name != null) {
        name = name.toLowerCase();
        type = type.toLowerCase();


        if (type == 'ingredient') {
            switch (name) {
                case 'gold':
                    secondPart = 'afx_gold_meteorite_3';
                    break;

                case 'titanium':
                    secondPart = 'afx_solar_titanium_3';
                    break;

                case 'tau':
                    secondPart = 'afx_tau_ceti_geode_3';
                    break;

            }
        }
        else if (type == 'stone') {
            switch (name) {
                case 'clarity':
                    secondPart = 'afx_clarity_stone_4';
                    break;
                case 'lunar':
                    secondPart = 'afx_lunar_stone_4';
                    break
                case 'prophecy':
                    secondPart = 'afx_prophecy_stone_4';
                    break
                case 'life':
                    secondPart = 'afx_life_stone_4';
                    break
                case 'quantum':
                    secondPart = 'afx_quantum_stone_4';
                    break
                case 'dilithium':
                    secondPart = 'afx_dilithium_stone_4';
                    break
                case 'soul':
                    secondPart = 'afx_soul_stone_4';
                    break
                case 'terra':
                    secondPart = 'afx_terra_stone_4';
                    break
                case 'tachyon':
                    secondPart = 'afx_tachyon_stone_4';
                    break
                case 'shell':
                    secondPart = 'afx_shell_stone_4';
                    break
            }
        }
        else {
            secondPart = name;
        }
        var img = document.createElement('img');
        img.setAttribute('height', '64px');
        img.setAttribute('src', "./assets/" + type + "s/" + secondPart + ".webp");
        jQuery('.container-fluid h1')[0].textContent = firstPart;
        jQuery('.container-fluid h1')[0].appendChild(img);
    }
}

function addTransparent() {
    if (jQuery('#h1')[0].length) {
        if (jQuery('#transparent-image').length == 0) {
            var a = document.createElement('img');
            a.setAttribute('height', '64px');
            a.setAttribute('id', 'transparent-image');
            a.setAttribute('src', './assets/ingredients/transparent.webp');
            jQuery('.container-fluid h1')[0].appendChild(a);
        }

    }

}

function mapName(type, name) {
    if (type != null || name != null) {
        name = name.toLowerCase();
        type = type.toLowerCase();


        if (type == 'ingredient') {
            switch (name) {
                case 'gold':
                    secondPart = 'afx_gold_meteorite_3';
                    break;

                case 'titanium':
                    secondPart = 'afx_solar_titanium_3';
                    break;

                case 'tau':
                    secondPart = 'afx_tau_ceti_geode_3';
                    break;

            }
        }
        else if (type == 'stone') {
            switch (name) {
                case 'clarity':
                    secondPart = 'afx_clarity_stone_4';
                    break;
                case 'lunar':
                    secondPart = 'afx_lunar_stone_4';
                    break
                case 'prophecy':
                    secondPart = 'afx_prophecy_stone_4';
                    break
                case 'life':
                    secondPart = 'afx_life_stone_4';
                    break
                case 'quantum':
                    secondPart = 'afx_quantum_stone_4';
                    break
                case 'dilithium':
                    secondPart = 'afx_dilithium_stone_4';
                    break
                case 'soul':
                    secondPart = 'afx_soul_stone_4';
                    break
                case 'terra':
                    secondPart = 'afx_terra_stone_4';
                    break
                case 'tachyon':
                    secondPart = 'afx_tachyon_stone_4';
                    break
                case 'shell':
                    secondPart = 'afx_shell_stone_4';
                    break
            }
        }
        else {
            secondPart = name;
        }

    }
    return secondPart;
}

function superMapName(name) {
    var result;
    switch (name) {
        case 'gold':
            result = 'afx_gold_meteorite_3';
            break;
        case 'titanium':
            result = 'afx_solar_titanium_3';
            break;
        case 'tau':
            result = 'afx_tau_ceti_geode_3';
            break;
        case 'clarity':
            result = 'afx_clarity_stone_4';
            break;
        case 'lunar':
            result = 'afx_lunar_stone_4';
            break
        case 'prophecy':
            result = 'afx_prophecy_stone_4';
            break
        case 'life':
            result = 'afx_life_stone_4';
            break
        case 'quantum':
            result = 'afx_quantum_stone_4';
            break
        case 'dilithium':
            result = 'afx_dilithium_stone_4';
            break
        case 'soul':
            result = 'afx_soul_stone_4';
            break
        case 'terra':
            result = 'afx_terra_stone_4';
            break
        case 'tachyon':
            result = 'afx_tachyon_stone_4';
            break
        case 'shell':
            result = 'afx_shell_stone_4';
            break
        default:
            result = name;
    }
    return result;

}

function reverseSuperMapName(name) {
    var result;
    switch (name) {
        case 'gold': case 'gold': case 'titanium': case 'tau':
            result = 'ingredients';
            break;
        case 'titanium': case 'tau': case 'clarity': case 'lunar': case 'prophecy': case 'life': case 'quantum': case 'dilithium': case 'soul': case 'terra': case 'tachyon': case 'shell':
            result = 'stones';
            break
        default:
            result = 'artifacts';
    }
    return result;
}

function activateBackgroundGrey() {
    jQuery('.backgroundBlur')[0].style = 'position: fixed;left: 0;top: 0;width: 100%;height: 100%;background-color: #555555;opacity: 0.5;z-index:1000;" ';
}

function deactivateBackgroundGrey() {
    jQuery('.backgroundBlur')[0].style = '';
}

function highlightDropdownItem(name) {
    var items = jQuery('.dropdown-item.fs-4');

    for (let index = 0; index < items.length; index++) {
        const element = items[index];
        if (element.textContent == " " + name) {
            element.style.backgroundColor = "lightgray";
            element.style.fontWeight = "bolder";
            element.style.borderRadius = "7px";
            element.style.color = "black";
        }
        else {
            element.style = '';
        }
    }
}