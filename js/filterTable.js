var _rows = 10;
var _iterations = 0;
var _current_item;
var _current_name;
var _currentPage = 'globalPage'
var _unique=0;
var _globalPageName = 'Eggboard';

$(document).ready(function () {
    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#myTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    if(localStorage.getItem("EID")){
        jQuery('#EID')[0].value = localStorage.getItem("EID");
    }
    else {
        jQuery('#EID')[0].value = '';
    }

    /*
    if(localStorage.getItem("EIDSubmit")){
        jQuery('#EIDSubmit')[0].value = localStorage.getItem("EIDSubmit");
    }
    else {
        jQuery('#EIDSubmit')[0].value = '';
    }
    */
    createDropdowns();
})

function toggleCheckbox() {
   (jQuery('#justOneShip')[0].checked)? window._unique=1:window._unique=0;
}

function getLeaderboard(type, name) {
    const http = new XMLHttpRequest()
    //http.open("GET", "https://egg-brosssh.vercel.app/getLeaderboard?element=" + name + "&n=10&top_n=1")
    if (window._current_item && (window._current_item.toLowerCase() != type.toLowerCase() || window._current_name.toLowerCase() != name.toLowerCase())) {
        window._rows = 10;
        window._iterations = 0;
    }
    
    http.open("GET", "https://egg-brosssh-nh5u9iyas-brosssh.vercel.app/getLeaderboard?element=" + name + "&n=" + window._rows + "&top_n="+window._unique);
    http.send();
    name = name.charAt(0).toUpperCase() + name.slice(1)
    window._current_item = type;
    window._current_name = name;
    var spinnerBorder = document.createElement('div');
    jQuery('body')[0].insertBefore(spinnerBorder, jQuery('body')[0].firstChild)
    
    spinnerBorder.setAttribute('style',"position: fixed;top:30%;left:38%; width:10rem; height: 10rem; visibility: visible; z-index: 12222!important");
    spinnerBorder.classList.add("spinner-border");
    spinnerBorder.classList.add("align-items-center");
    spinnerBorder.classList.add("d-flex");
    spinnerBorder.classList.add("justify-content-center");

    jQuery('.backgroundBlur')[0].style='position: fixed;left: 0;top: 0;width: 100%;height: 100%;background-color: #555555;opacity: 0.5;z-index:1000;" ';

    http.onload = () => {
        jQuery('.spinner-border')[0].remove();
        jQuery('.backgroundBlur')[0].style='';
     
        displayButtonMore();
        displaySearch();

        if (type == 'Artifact' || type == 'Stone') {
            fillTableArtifact(http.responseText, name, type);

        }
        else {
            fillTableIngredient(http.responseText, name);
        }
    }
}

function fillTableIngredient(response, name) {
    //console.log(response);
    var span1 = document.createElement('span');
    span1.classList.add('caret');
    var span2 = document.createElement('span');
    span2.classList.add('caret');
    var span3 = document.createElement('span');
    span3.classList.add('caret');

    jQuery('.container-fluid h1')[0].textContent = 'Eggboard | Ingredient | ' + name;
    window._globalPageName = 'Eggboard | Ingredient | ' + name;
    jQuery('#ingredientDropdown')[0].textContent = name+' ';
    jQuery('#ingredientDropdown')[0].appendChild(span1);
    
    jQuery('#stoneDropdown')[0].textContent = 'Stones ';
    jQuery('#stoneDropdown')[0].appendChild(span2);

    jQuery('#artifactDropdown')[0].textContent = 'Artifacts ';
    jQuery('#artifactDropdown')[0].appendChild(span3);

    jQuery('#thead tr').remove(); //to clear the columns;
    jQuery('#myTable tr').remove(); //To clear the rows (pointed by @nunners)
    response = JSON.parse(response);
    jQuery('#thead').append(
        '<tr class=\'fs-4\'><th>Pos</th>'
        + '<th>Name</th>'
        + '<th>Stars</th>'
        + '<th>Capacity</th>'
        + '<th>T1</th>'
        + '<th>T2</th>'
        + '<th>T3</th>'
        + '<th>Total</th></tr>'
    );


    jQuery.each(response.content, function (_key, value) {
        jQuery('#myTable')
            .append('<tr class=\'fs-5\'><td>' + value[0]
                + '</td><td>' + value[1]
                + '</td><td>' + value[2]
                + '</td><td>' + value[3]
                + '</td><td>' + value[4]
                + '</td><td>' + value[5]
                + '</td><td>' + value[6]
                + '</td><td>' + value[7]
                + '</td></tr>');
    });
}

function fillTableArtifact(response, name, type) {
    //console.log(response);
    var span = document.createElement('span');
    span.classList.add('caret');
    var span2 = document.createElement('span');
    span2.classList.add('caret');
    var span3 = document.createElement('span');
    span3.classList.add('caret');
    var span4 = document.createElement('span');
    span4.classList.add('caret');

    jQuery('#ingredientDropdown')[0].textContent = 'Ingredients ';
    jQuery('#ingredientDropdown')[0].appendChild(span);

    jQuery('#stoneDropdown')[0].textContent = 'Stones ';
    jQuery('#stoneDropdown')[0].appendChild(span2);

    jQuery('#artifactDropdown')[0].textContent = 'Artifacts ';    
    jQuery('#artifactDropdown')[0].appendChild(span3);

    jQuery('#'+type.toLowerCase()+'Dropdown')[0].textContent = name+' ';
    jQuery('#'+type.toLowerCase()+'Dropdown')[0].appendChild(span4);

    jQuery('.container-fluid h1')[0].textContent = 'Eggboard | ' + type + ' | ' + name;
    window._globalPageName = 'Eggboard | ' + type + ' | ' + name;

    jQuery('#thead tr').remove(); //to clear the columns;
    jQuery('#myTable tr').remove(); //To clear the rows (pointed by @nunners)
    response = JSON.parse(response);
    jQuery('#thead').append(
        '<tr class=\'fs-4\'><th>Pos</th>'
        + '<th>Name</th>'
        + '<th>Stars</th>'
        + '<th>Capacity</th>'
        + '<th>T1</th>'
        + '<th>T2</th>'
        + '<th>T3</th>'
        + '<th>T4</th>'
        + '<th>Total</th></tr>'
    );

    jQuery.each(response.content, function (_key, value) {
        jQuery('#myTable')
            .append('<tr class=\'fs-5\'><td>' + value[0]
                + '</td><td>' + value[1]
                + '</td><td>' + value[2]
                + '</td><td>' + value[3]
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
    var menu_ingredients = jQuery('#dropdown_menu_Ingredients')[0];
    var menu_stones = jQuery('#dropdown_menu_Stones')[0];
    var menu_artifacts = jQuery('#dropdown_menu_Artifacts')[0];
    var arrayIngredients = "gold, tau, titanium".split(", ");
    var arrayStones = "clarity, lunar, prophecy, life, quantum, dilithium, soul, terra, tachyon, shell".split(", ");
    var arrayArtifacts = "bob, light, deflector, siab, actuator, monocle, metronome, feather, chalice, compass, rainstick, beak, lens, medallion, gusset, ankh, brooch, vial, necklace, totem, cube".split(", ");


    arrayIngredients.forEach(element => {
        var a = document.createElement('a');
        a.setAttribute('class', 'dropdown-item fs-4');
        a.setAttribute('href', '#');
        a.setAttribute('role', "button");
        a.setAttribute("onclick", "getLeaderboard(\'ingredient\',\'" + element + "\')");
        a.text = element.charAt(0).toUpperCase() + element.slice(1);
        menu_ingredients.appendChild(document.createElement('li')).appendChild(a);
    });

    arrayStones.forEach(element => {
        var a = document.createElement('a');
        a.setAttribute('class', 'dropdown-item fs-4');
        a.setAttribute('href', '#');
        a.setAttribute('role', "button");
        a.setAttribute("onclick", "getLeaderboard(\'Stone\',\'" + element + "\')"); //Stones are like Artifacts, with 4 Tiers
        a.text = element.charAt(0).toUpperCase() + element.slice(1);
        menu_stones.appendChild(document.createElement('li')).appendChild(a);

    });

    arrayArtifacts.forEach(element => {
        var a = document.createElement('a');
        a.setAttribute('class', 'dropdown-item fs-4');
        a.setAttribute('href', '#');
        a.setAttribute('role', "button");
        a.setAttribute("onclick", "getLeaderboard(\'Artifact\',\'" + element + "\')");
        a.text = element.charAt(0).toUpperCase() + element.slice(1);
        menu_artifacts.appendChild(document.createElement('li')).appendChild(a);

    });

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

    var otherPage;
    if (pageName == 'globalPage') {
        //otherPage = 'personalPage';
        normalizedName = "Global Leaderboard Page"
        jQuery('#Global')[0].classList.remove('hidden');
        jQuery('#Personal')[0].classList.add('hidden');
        //jQuery('#Submit')[0].classList.add('hidden');

        jQuery('#globalPage')[0].classList.add('active');
        jQuery('#personalPage')[0].classList.remove('active');
        //jQuery('#submitPage')[0].classList.remove('active');      

        //jQuery('#thead_personal tr').remove(); //to clear the columns;
        //jQuery('#myPersonalTable tr').remove(); //To clear the rows (pointed by @nunners)
        jQuery('.container-fluid h1')[0].textContent = window._globalPageName;
        jQuery('#page')[0].textContent = normalizedName;

    } else if(pageName == 'personalPage') {
        //otherPage = 'globalPage';
        normalizedName = "Personal Leaderboard Page"
        jQuery('#Global')[0].classList.add('hidden');
        jQuery('#Personal')[0].classList.remove('hidden');
        //jQuery('#Submit')[0].classList.add('hidden');

        jQuery('#globalPage')[0].classList.remove('active');
        jQuery('#personalPage')[0].classList.add('active');        
        //jQuery('#submitPage')[0].classList.remove('active');      

        //jQuery('#thead tr').remove(); //to clear the columns;
        //jQuery('#myTable tr').remove(); //To clear the rows;
        
        jQuery('#buttonMore')[0].classList.add('hidden');
        jQuery('#myInput')[0].classList.add('hidden');
        jQuery('#page')[0].textContent = normalizedName;
        jQuery('.container-fluid h1')[0].textContent = 'Eggboard';

    } 
    /*else{
        normalizedName = "Submit Ship Log Page";
        jQuery('#Global')[0].classList.add('hidden');
        jQuery('#Personal')[0].classList.add('hidden');
        jQuery('#Submit')[0].classList.remove('hidden');

        jQuery('#globalPage')[0].classList.remove('active');
        jQuery('#personalPage')[0].classList.remove('active');    
        jQuery('#submitPage')[0].classList.add('active');  
        
        jQuery('#thead tr').remove(); //to clear the columns;
        jQuery('#myTable tr').remove(); //To clear the rows;

        jQuery('#thead_personal tr').remove(); //to clear the columns;
        jQuery('#myPersonalTable tr').remove(); //To clear the rows (pointed by @nunners)

        jQuery('#buttonMore')[0].classList.add('hidden');
        jQuery('#myInput')[0].classList.add('hidden');
  
    } */

    

    if (window._currentPage != pageName) {
        //alert(pageName);
        window._currentPage = pageName;
        //jQuery('#' + otherPage)[0].classList.remove('bg-primary');

    }
}

function saveValue(e){
    var id = e.id;  // get the sender's id to save it . 
    var val = e.value; // get the value. 
    localStorage.setItem(id, val);// Every time user writing something, the localStorage's value will override . 
}

function getSavedValue(v){
    if (!localStorage.getItem(v)) {
        return "";// You can change this to your defualt value. 
    }
    return localStorage.getItem(v);
}

function getPersonalLeaderboard(e) {
    var eid = document.getElementById("EID").value;
    submitEID(eid);    
    //getMYLeaderboard(eid);
    
}

function fillPersonalTable(response) {
    jQuery('#thead_personal tr').remove(); //to clear the columns;
    jQuery('#myPersonalTable tr').remove(); //To clear the rows (pointed by @nunners)
   
    jQuery('#thead_personal').append(
        '<tr class=\'fs-4\'><th>Item Name</th>'
        + '<th>Position</th>'
        + '<th>Stars</th>'
        + '<th>Capacity</th>'
        + '<th>T1</th>'
        + '<th>T2</th>'
        + '<th>T3</th>'
        + '<th>T4</th>'
        + '<th>Total</th>'
        + '</tr>'
    );

    jQuery.each(response, function (_key, value) {
        jQuery('#myPersonalTable')
            .append('<tr class=\'fs-5\'><td>' + value[0].charAt(0).toUpperCase() + value[0].slice(1)
            + '</td><td>' + value[1]
            + '</td><td>' + value[3]
            + '</td><td>' + value[4]
            + '</td><td>' + value[5][1]
            + '</td><td>' + value[5][2]
            + '</td><td>' + value[5][3]
            + '</td><td>' + ((value[5][4])? value[5][4]: '')
            + '</td><td>' + value[5]["total"]
            + '</td></tr>');
    });
}

function compareSecondColumn(a, b) {
    if ( parseInt(a[1]) === parseInt(b[1])) {
        return 0;
    }
    else {
        return (parseInt(a[1]) < parseInt(b[1])) ? -1 : 1;
    }
}

function toggleDarkMode() {
    (jQuery('#html')[0].getAttribute("data-bs-theme") == "light")? jQuery('#html')[0].setAttribute('data-bs-theme',"dark") : jQuery('#html')[0].setAttribute('data-bs-theme',"light");
}

function submitEID(eid) {
    const http = new XMLHttpRequest()
    http.open("GET", "https://egg-brosssh-9v86ugob7-brosssh.vercel.app/sendNewEID?EID="+eid);
    http.send();

    var spinnerBorder = document.createElement('div');
    jQuery('body')[0].insertBefore(spinnerBorder, jQuery('body')[0].firstChild)
    
    spinnerBorder.setAttribute('style',"position: fixed;top:30%;left:38%; width:10rem; height: 10rem; visibility: visible; z-index: 12222!important");
    spinnerBorder.classList.add("spinner-border");
    spinnerBorder.classList.add("align-items-center");
    spinnerBorder.classList.add("d-flex");
    spinnerBorder.classList.add("justify-content-center");


    jQuery('.backgroundBlur')[0].style='position: fixed;left: 0;top: 0;width: 100%;height: 100%;background-color: #555555;opacity: 0.5;z-index:1000;" ';

    http.onload = function() {

        getMYLeaderboard(eid,true);
        //jQuery('.spinner-border')[0].remove();// .style='width:0rem; height: 0rem; visibility: hidden;';
        //jQuery('.backgroundBlur')[0].style='';
        
        var response = JSON.parse(http.responseText);
        //response.content = response.content.sort(compareSecondColumn);
        console.log(response);
    }  

    http.onerror = function (event) {
        console.log(event.currentTarget.responseText);
    }
}

function getMYLeaderboard(eid,personal) {
    const http = new XMLHttpRequest();
    http.open("GET", "https://egg-brosssh-9v86ugob7-brosssh.vercel.app/getPersonalLeaderboard?EID="+eid);
    try {
        http.send();
    } catch (error) {
        console.log(error);
        jQuery('#thead_personal tr').remove(); //to clear the columns;
        jQuery('#myPersonalTable tr').remove(); //To clear the rows (pointed by @nunners)
    }
    var spinnerBorder = document.createElement('div');
    jQuery('body')[0].insertBefore(spinnerBorder, jQuery('body')[0].firstChild)
    
    if(!personal){
        spinnerBorder.setAttribute('style',"position: fixed;top:30%;left:38%; width:10rem; height: 10rem; visibility: visible; z-index: 12222!important");
        spinnerBorder.classList.add("spinner-border");
        spinnerBorder.classList.add("align-items-center");
        spinnerBorder.classList.add("d-flex");
        spinnerBorder.classList.add("justify-content-center");
        jQuery('.backgroundBlur')[0].style='position: fixed;left: 0;top: 0;width: 100%;height: 100%;background-color: #555555;opacity: 0.5;z-index:1000;" ';
        
    }
    http.onload = function() {
        
        jQuery('.spinner-border')[0].remove();// .style='width:0rem; height: 0rem; visibility: hidden;';
        jQuery('.backgroundBlur')[0].style='';
        console.log(http.responseText, 'before the json parse');
        var response = JSON.parse(http.responseText);
        console.log(response, 'after the json parse');

        try {
        response.content = response.content.sort(compareSecondColumn);
        fillPersonalTable(response.content);
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
        jQuery('.backgroundBlur')[0].style='';
        jQuery('#thead_personal tr').remove(); //to clear the columns;
        jQuery('#myPersonalTable tr').remove(); //To clear the rows (pointed by @nunners)
    }
}