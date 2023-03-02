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

function getLeaderboard()
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", "https://egg-brosssh.vercel.app/getLeaderboard?element=gold&n=10&top_n=1", false ); // false for synchronous request
        xmlHttp.setRequestHeader("Access-Control-Allow-Origin","*");
        xmlHttp.send();
        
        return xmlHttp.responseText;
    }