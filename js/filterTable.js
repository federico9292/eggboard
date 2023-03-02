$(document).ready(function () {
    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#myTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
})

function submitID() {
    alert("The form was submitted");
}

function getLeaderboardGold() {
    const http = new XMLHttpRequest()

    http.open("GET", "https://egg-brosssh.vercel.app/getLeaderboard?element=gold&n=10&top_n=1")
    //http.setRequestHeader("Access-Control-Allow-Origin","*");
    http.send();
    http.onload = () => {
        fillTable(http.responseText)
    }
}
function getLeaderboardTachyon() {
    const http = new XMLHttpRequest()

    http.open("GET", "https://egg-brosssh.vercel.app/getLeaderboard?element=tachyon&n=10&top_n=1")
    //http.setRequestHeader("Access-Control-Allow-Origin","*");
    http.send();
    http.onload = () => {
        fillTable2(http.responseText)
    }
}
function fillTable(response) {
    console.log(response);
    jQuery('#thead tr').remove(); //to clear the columns;
    jQuery('#myTable tr').remove(); //To clear the rows (pointed by @nunners)
    response = JSON.parse(response);
    jQuery('#thead').append(
        '<th>Pos</th>'    
        +'<th>Name</th>'
    +'<th>Stars</th>'
    +'<th>Capacity</th>'
    +'<th>T1</th>'
    +'<th>T2</th>'
    +'<th>T3</th>'
    +'<th>Total</th>'
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
function fillTable2(response) {
    console.log(response);
    jQuery('#thead tr').remove(); //to clear the columns;
    jQuery('#myTable tr').remove(); //To clear the rows (pointed by @nunners)
    response = JSON.parse(response);
    jQuery('thead').append(
        '<th>Pos</th>'    
        +'<th>Name</th>'
    +'<th>Stars</th>'
    +'<th>Capacity</th>'
    +'<th>T1</th>'
    +'<th>T2</th>'
    +'<th>T3</th>'
    +'<th>T4</th>'
    +'<th>Total</th>'
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