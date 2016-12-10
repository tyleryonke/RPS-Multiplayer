var config = {
    apiKey: "AIzaSyAxUgMh_dq2yCd_a9AnOLPw-enqUP-_2X4",
    authDomain: "rpsmultiplayer-a3760.firebaseapp.com",
    databaseURL: "https://rpsmultiplayer-a3760.firebaseio.com",
    storageBucket: "rpsmultiplayer-a3760.appspot.com",
    messagingSenderId: "612426642134"
};
 
firebase.initializeApp(config);

var database = firebase.database();
  
//chatroom code
	var myDataRef = database.ref().child("chatroom");
      $('#messageInput').keypress(function (e) {
        if (e.keyCode == 13) {
        	if ($('#nameInput').val()===''){
      			$('#chatError').show();
      			return
      		}

		    $('#chatError').hide();
		    var name = $('#nameInput').val();
		    var text = $('#messageInput').val();
		    myDataRef.push({name: name, text: text});
		    $('#messageInput').val('');
        }
      });
      myDataRef.on('child_added', function(snapshot) {
        var message = snapshot.val();
        displayChatMessage(message.name, message.text);
      });
      function displayChatMessage(name, text) {
        $('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
        $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
      };

//end chatroom code

//associate seleciton buttons with vars
var rock1 = document.getElementById('rock1');
var rock2 = document.getElementById('rock2');
var paper1 = document.getElementById('paper1');
var paper2 = document.getElementById('paper2');
var scissors1 = document.getElementById('scissors1');
var scissors2 = document.getElementById('scissors2');

//define initial vars
var player1Selection = '';
var player2Selection = '';

var player1Name = '';
var player2Name = '';

var player1WinCount = 0;
var player1LossCount = 0;
var player2WinCount = 0;
var player2LossCount = 0;

var currentPlayerName;

//update names/scores
function updateScoreDisplay() {
	$('#player1NameZone').html("Player 1 :  " + player1Name + "<br>");
	$('#player2NameZone').html("Player 2 :  " + player2Name + "<br>");

	$('#player1WinsArea').html("Wins:  " + player1WinCount + "<br>");
	$('#player2WinsArea').html("Wins:  " + player2WinCount + "<br>");

	$('#player1LossesArea').html("Losses:  " + player1LossCount);
	$('#player2LossesArea').html("Losses:  " + player2LossCount);
}

database.ref().on("value", function(snapshot) {

	player1Selection = snapshot.child("Player1").child("currentChoice").val();
	player1Name = snapshot.child("Player1").child("name").val();
	player1WinCount = snapshot.child("Player1").child("wins").val();
	player1LossCount = snapshot.child("Player1").child("losses").val();

	player2Selection = snapshot.child("Player2").child("currentChoice").val();
	player2Name = snapshot.child("Player2").child("name").val();
	player2WinCount = snapshot.child("Player2").child("wins").val();
	player2LossCount = snapshot.child("Player2").child("losses").val();

	updateScoreDisplay();

	if (player1Selection==='' || player2Selection==='') {
		return
	}	
	else if (player1Selection==='rock1') {
		if (player2Selection==='rock2') {
			$('#resultsDiv').html("Rock vs. Rock : Tie game");
		}
		if (player2Selection==='paper2') {
			$('#resultsDiv').html("Rock vs. Paper : Player 2 wins");
			player2WinCount++;
			player1LossCount++;
		}
		if (player2Selection==='scissors2') {
			$('#resultsDiv').html("Rock vs. Scissors : Player 1 wins");
			player1WinCount++;
			player2LossCount++;
		}
	}
	else if (player1Selection==='paper1') {
		if (player2Selection==='rock2') {
			$('#resultsDiv').html("Paper vs. Rock : Player 1 wins");
			player1WinCount++;
			player2LossCount++;
		}
			
		if (player2Selection==='paper2') {
			$('#resultsDiv').html("Paper vs. Paper : Tie game");
		}

		if (player2Selection==='scissors2') {
			$('#resultsDiv').html("Paper vs. Scissors : Player 2 wins");
			player2WinCount++;
			player1LossCount++;
		}
	}
	else if (player1Selection==='scissors1') {
		if (player2Selection==='rock2') {
			$('#resultsDiv').html("Scissors vs. Rock : Player 2 wins");
			player2WinCount++;
			player1LossCount++;
		}
		if (player2Selection==='paper2') {
			$('#resultsDiv').html("Scissors vs. Paper : Player 1 wins");
			player1WinCount++;
			player2LossCount++;
		}
		if (player2Selection==='scissors2') {
			$('#resultsDiv').html("Scissors vs. Scissors : Tie game");
		}
	}

	$('#resultsDiv').show()

	var updatedResults = {
		"Player1": {
			"name": player1Name,
			"wins": player1WinCount,
			"losses": player1LossCount,
			"currentChoice": ''
		},
		"Player2": {
			"name": player2Name,
			"wins": player2WinCount,
			"losses": player2LossCount,
			"currentChoice": ''
		}
	}

	database.ref().update(updatedResults);

	// fallback in case of error
}, function (errorObject) {

		// log error message
	console.log("The read failed: " + errorObject.code);
	
});


$("#nameSubmit").on("click", function(e) {
	currentPlayerName = $('#nameInput').val().trim();
	console.log(currentPlayerName);
	if (player1Name=='') {
		$('#errorZone').hide();
		database.ref().child("Player1").child("name").set(currentPlayerName);
		$('#player1ChoiceArea').show();
		database.ref().child("Player1").child("wins").set(0);
		database.ref().child("Player1").child("losses").set(0);
		$("#nameInputZone").hide();
		$("#leaveZone").show();
		console.log("Current Player: " + currentPlayerName + " (Player 1)");
	}
	else if (player2Name=='') {
		$('#errorZone').hide();
		database.ref().child("Player2").child("name").set(currentPlayerName);
		$('#player2ChoiceArea').show();
		database.ref().child("Player2").child("wins").set(0);
		database.ref().child("Player2").child("losses").set(0);
		$("#nameInputZone").hide();
		$("#leaveZone").show();
		console.log("Current Player: " + currentPlayerName + " (Player 2)")
	}
	else {
		$('#errorZone').show();
	}
	updateScoreDisplay();
	e.preventDefault();
});

$("#leaveButton").on("click", function() {
	if (currentPlayerName===player1Name) {
		$("#leaveZone").hide();
		$('#player1ChoiceArea').hide();
		$("#nameInputZone").show();

		var player1 = database.ref().child("Player1");
		player1.update({
			name: '',
			wins: 0,
			losses: 0,
			currentChoice: ''
		})
	}
	else if (currentPlayerName===player2Name) {
		$("#leaveZone").hide();
		$('#player2ChoiceArea').hide();
		$("#nameInputZone").show();

		var player2 = database.ref().child("Player2");
		player2.update({
			name: '',
			wins: 0,
			losses: 0,
			currentChoice: ''
		})
	}
});

$(".player1ChoiceButton").on("click", function() {
	player1Selection = (this.id);

	switch (player1Selection) {
		case "rock1":
			$("#player1SelectionZone").html("You chose rock");
		break;

		case "paper1":
			$("#player1SelectionZone").html("You chose paper");
		break;

		case "scissors1":
			$("#player1SelectionZone").html("You chose scissors");
		break;
	}
	$('#player1SelectionZone').show();
	database.ref().child("Player1").child("currentChoice").set(player1Selection);
})

$(".player2ChoiceButton").on("click", function() {
	player2Selection = (this.id);

	switch (player2Selection) {
		case "rock2":
			$("#player2SelectionZone").html("You chose rock");
		break;

		case "paper2":
			$("#player2SelectionZone").html("You chose paper");
		break;

		case "scissors2":
			$("#player2SelectionZone").html("You chose scissors");
		break;
	}
	$('#player2SelectionZone').show();
	database.ref().child("Player2").child("currentChoice").set(player2Selection);
})