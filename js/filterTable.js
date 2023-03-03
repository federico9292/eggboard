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
    http.open("GET", "https://egg-brosssh.vercel.app/getLeaderboard?element=" + name + "&n=10&top_n=1")
    //http.setRequestHeader("Access-Control-Allow-Origin","*");
    http.send();
    name = name.charAt(0).toUpperCase() + name.slice(1)
    http.onload = () => {
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
    console.log(response);
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
    console.log(response);
    jQuery('.jumbotron h1')[0].textContent = 'Eggboard | ' + type +' | ' + name;

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
    jQuery('#myInput')[0].value='';
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
        a.setAttribute('class','dropdown-item');
        a.setAttribute('href','#');
        a.setAttribute('role',"button");
        a.setAttribute("onclick","getLeaderboard(\'ingredient\',\'"+element+"\')");
        a.text = element.charAt(0).toUpperCase() + element.slice(1);
        menu_ingredients.appendChild(document.createElement('li')).appendChild(a); 
    });
    
    arrayStones.forEach(element => {
        var a = document.createElement('a');
        a.setAttribute('class','dropdown-item');
        a.setAttribute('href','#');
        a.setAttribute('role',"button");
        a.setAttribute("onclick","getLeaderboard(\'Stone\',\'"+element+"\')"); //Stones are like Artifacts, with 4 Tiers
        a.text = element.charAt(0).toUpperCase() + element.slice(1);
        menu_stones.appendChild(document.createElement('li')).appendChild(a);

    });

    arrayArtifacts.forEach(element => {
        var a = document.createElement('a');
        a.setAttribute('class','dropdown-item');
        a.setAttribute('href','#');
        a.setAttribute('role',"button");
        a.setAttribute("onclick","getLeaderboard(\'Artifact\',\'"+element+"\')");
        a.text = element.charAt(0).toUpperCase() + element.slice(1);
        menu_artifacts.appendChild(document.createElement('li')).appendChild(a); 

    });    

}