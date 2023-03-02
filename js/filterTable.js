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
function getLeaderboardTachyion() {
    const http = new XMLHttpRequest()

    http.open("GET", "https://egg-brosssh.vercel.app/getLeaderboard?element=tachyion&n=10&top_n=1")
    //http.setRequestHeader("Access-Control-Allow-Origin","*");
    http.send();
    http.onload = () => {
        fillTable(http.responseText)
    }
}
function fillTable(response) {
    console.log(response);
    jQuery('#myTable tr').remove(); //To clear the rows (pointed by @nunners)
    response = JSON.parse(response);
    
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