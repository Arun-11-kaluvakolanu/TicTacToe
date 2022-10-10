const cell = $("td");
const arr = [];
let humanPlayer = "";
while(humanPlayer != "X" && humanPlayer != "O")
{
    humanPlayer = prompt("Select a token: (X or O)").toUpperCase();
    console.log(humanPlayer);
}
const pcPlayer = ((humanPlayer === "O")?"X":"O");
const pcX = ((pcPlayer === "X")?true:false);
var end = false;
const textClasses = ["Xmark","Omark"];
if(pcPlayer === "O")textClasses.reverse();

for(let i=0;i<9;i++)
{
    arr.push($(cell[i]).text());
}
if(pcX)
{
    console.log(pcX);
    setTimeout(function()
    {
        makeMove();
    },"1000");
}

cell.on("click",function()
{
    if($(this).text() != "" || end)return;
    var idx = -1;
    for(let i=0;i<9;i++)
    {
        if(cell[i] === this)idx = i;
    }
    $(this).text(humanPlayer);
    $(this).addClass(textClasses[1]);
    arr[idx] = $(this).text();
    restartGame(checkGame(arr));
    makeMove();
    restartGame(checkGame(arr));
});

function makeMove()
{
    let best = optimalMove(arr,pcX)[1];
    $(cell[best]).text(pcPlayer);
    $(cell[best]).addClass(textClasses[0]);
    arr[best] = pcPlayer;
}


function optimalMove(arr,maximize)
{
    let a = arr.slice();
    if(checkGame(a) === "X")return [10];
    if(checkGame(a) === "O")return [-10];
    if(checkGame(a) === "D")return [0];
    // console.log(a);
    if(maximize)
    {
        let ans = Number.MIN_SAFE_INTEGER;
        let best = -1;
        for(let j=0;j<9;j++)
        {
            if(a[j] != "")continue;
            a[j] = "X";
            var temp = optimalMove(a,!maximize)[0];
            if(temp > ans)
            {
                ans = temp  ;
                best = j;
            }
            a[j] = "";
        }
        return [ans,best];
    }
    else
    {
        let ans = Number.MAX_SAFE_INTEGER;
        let best = -1;
        for(let j=0;j<9;j++)
        {
            if(a[j] != "")continue;
            a[j] = "O";
            var temp = optimalMove(a,!maximize)[0];
            if(temp < ans)
            {
                ans = temp;
                best = j;
            }a[j] = "";
        }
        return [ans,best];       
    }
}

function checkGame(a)
{
    for(let i=0;i<=6;i+=3)
        if(a[i] === a[i+1] && a[i+1] === a[i+2] && a[i] != "")return a[i];
    for(let i=0;i<=2;i++)
        if(a[i] === a[i+3] && a[i+3] === a[i+6] && a[i]!="")return a[i];
    if(a[0] === a[4] && a[4] === a[8] && a[0] != "")return a[0];
    if(a[2] === a[4] && a[4] === a[6] && a[2] !="")return a[2];
    var draw = "D";
    for(let i=0;i<9;i++)if(a[i] === "")draw = "";
    return draw;
}

function restartGame(won)
{
    if(won === "")return;
    end = true;
    if(won === pcPlayer)
    {
        $("#winDec").text("PC Wins");
        $("#winDec,#restartTimer").addClass(textClasses[0]);
    }
    else if(won === humanPlayer)
    {
        $("#winDec").text("You Win");
        $("#winDec,#restartTimer").addClass(textClasses[0]);
    }
    else
    {
        $("#winDec").text("Draw");
    } 
    var timer = 5;
    var myInterval = setInterval(function(){
        $("#restartTimer").text("Game restarts in "+timer);
        timer--;
        if(!timer){
            location.reload();
        }
    },1000);
}