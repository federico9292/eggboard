var _rows = 10;
var _iterations = 0;
var _current_item;
var _current_name;
var _currentPage = 'globalPage'

$(document).ready(function () {
    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#myTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    createDropdowns();
})

function submitID() {
    alert("The form was submitted");
}

function getLeaderboard(type, name) {
    const http = new XMLHttpRequest()
    //http.open("GET", "https://egg-brosssh.vercel.app/getLeaderboard?element=" + name + "&n=10&top_n=1")
    if (window._current_item && (window._current_item.toLowerCase() != type.toLowerCase() || window._current_name.toLowerCase() != name.toLowerCase())) {
        window._rows = 10;
        window._iterations = 0;
    }
    http.open("GET", "https://egg-brosssh-nh5u9iyas-brosssh.vercel.app/getLeaderboard?element=" + name + "&n=" + window._rows + "&top_n=1");
    //http.setRequestHeader("Access-Control-Allow-Origin","*");
    http.send();
    name = name.charAt(0).toUpperCase() + name.slice(1)
    window._current_item = type;
    window._current_name = name;
    http.onload = () => {
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
    jQuery('.jumbotron h1')[0].textContent = 'Eggboard | Ingredient | ' + name;
    jQuery('#thead tr').remove(); //to clear the columns;
    jQuery('#myTable tr').remove(); //To clear the rows (pointed by @nunners)
    response = JSON.parse(response);
    jQuery('#thead').append(
        '<tr><th>Pos</th>'
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
            .append('<tr><td>' + value[0]
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
    jQuery('.jumbotron h1')[0].textContent = 'Eggboard | ' + type + ' | ' + name;

    jQuery('#thead tr').remove(); //to clear the columns;
    jQuery('#myTable tr').remove(); //To clear the rows (pointed by @nunners)
    response = JSON.parse(response);
    jQuery('#thead').append(
        '<tr><th>Pos</th>'
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
            .append('<tr><td>' + value[0]
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
        a.setAttribute('class', 'dropdown-item');
        a.setAttribute('href', '#');
        a.setAttribute('role', "button");
        a.setAttribute("onclick", "getLeaderboard(\'ingredient\',\'" + element + "\')");
        a.text = element.charAt(0).toUpperCase() + element.slice(1);
        menu_ingredients.appendChild(document.createElement('li')).appendChild(a);
    });

    arrayStones.forEach(element => {
        var a = document.createElement('a');
        a.setAttribute('class', 'dropdown-item');
        a.setAttribute('href', '#');
        a.setAttribute('role', "button");
        a.setAttribute("onclick", "getLeaderboard(\'Stone\',\'" + element + "\')"); //Stones are like Artifacts, with 4 Tiers
        a.text = element.charAt(0).toUpperCase() + element.slice(1);
        menu_stones.appendChild(document.createElement('li')).appendChild(a);

    });

    arrayArtifacts.forEach(element => {
        var a = document.createElement('a');
        a.setAttribute('class', 'dropdown-item');
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
    console.log(window._rows, 'rows');
    getLeaderboard(current_item, current_name.toLowerCase());
}

function switchPage(pageName) {
    jQuery('#' + pageName)[0].classList.add('bg-primary');
    jQuery('#page')[0].style = '';

    var normalizedName;

    var otherPage;
    if (pageName == 'globalPage') {
        otherPage = 'personalPage';
        normalizedName = "Global Leaderboard Page"
        jQuery('#Global')[0].classList.remove('hidden');

    } else {
        otherPage = 'globalPage';
        normalizedName = "Personal Leaderboard Page"
        jQuery('#Global')[0].classList.add('hidden');

    }

    jQuery('#page')[0].textContent = normalizedName;

    if (window._currentPage != pageName) {
        //alert(pageName);
        window._currentPage = pageName;
        jQuery('#' + otherPage)[0].classList.remove('bg-primary');


    }
}