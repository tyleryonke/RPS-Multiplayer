var config = {
    apiKey: "AIzaSyAxUgMh_dq2yCd_a9AnOLPw-enqUP-_2X4",
    authDomain: "rpsmultiplayer-a3760.firebaseapp.com",
    databaseURL: "https://rpsmultiplayer-a3760.firebaseio.com",
    storageBucket: "rpsmultiplayer-a3760.appspot.com",
    messagingSenderId: "612426642134"
};
 
firebase.initializeApp(config);

var database = firebase.database();

// var currentUser;
// var userProfile = {
//         userID: uid,
//         name: '',
//         wins: 0,
//         losses: 0

// };

// function captureUserData(user){
//         uid = user.uid;
//         userProfile.userID = uid;
//         userProfile.email = user.email;
//         // add to database
//         let userFolder = database.ref('/members/' + uid);
// }
  
var myDataRef = database.ref();
      $('#messageInput').keypress(function (e) {
        if (e.keyCode == 13) {
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

var rock1 = document.getElementById('rock1');
var rock2 = document.getElementById('rock2');
var paper1 = document.getElementById('paper1');
var paper2 = document.getElementById('paper2');
var scissors1 = document.getElementById('scissors1');
var scissors2 = document.getElementById('scissors2');

var player1Selection = '';
var player2Selection = '';

var player1Name = '';
var player2Name = '';

var player1WinCount = 0;
var player1LossCount = 0;
var player2WinCount = 0;
var player2LossCount = 0;

var currentPlayerName;

function updateScoreDisplay() {
	$('#player1NameZone').html(player1Name);
	$('#player2NameZone').html(player2Name);

	$('#player1WinsArea').html("Wins:  " + player1WinCount + "<br>");
	$('#player1LossesArea').html("Losses:  " + player1LossCount);
	$('#player2WinsArea').html("Wins:  " + player2WinCount + "<br>");
	$('#player2LossesArea').html("Losses:  " + player2LossCount);
}

database.ref().on("value", function(snapshot) {

	player1Selection = snapshot.child("Player1").child("currentChoice").val();
	player1Name = snapshot.child("Player1").child("name").val();
	// player1WinCount = snapshot.child("Player1").child("wins").val();
	// player1LossCount = snapshot.child("Player1").child("losses").val();

	player2Selection = snapshot.child("Player2").child("currentChoice").val();
	player2Name = snapshot.child("Player2").child("name").val();
	// player2WinCount = snapshot.child("Player2").child("wins").val();
	// player2LossCount = snapshot.child("Player2").child("losses").val();

	console.log(player1Selection);
	console.log(player1Name);
	console.log(player1WinCount);
	console.log(player1LossCount);

	console.log(player2Selection);
	console.log(player2Name);
	console.log(player2WinCount);
	console.log(player2LossCount);
	
	updateScoreDisplay();

	// fallback in case of error
}, function (errorObject) {

		// log error message
	console.log("The read failed: " + errorObject.code);
	
});

$("#nameSubmit").on("click", function() {
	currentPlayerName = $('#nameInput').val().trim();
	console.log(player1Name);
	if (player1Name=='') {
		$('#errorZone').hide();
		database.ref().child("Player1").child("name").set(currentPlayerName);
		$("#nameInput").val("");
		console.log("Current Player: " + currentPlayerName + " (Player 1)")
	}
	else if (player2Name=='') {
		$('#errorZone').hide();
		database.ref().child("Player2").child("name").set(currentPlayerName);
		$("#nameInput").val("");
		console.log("Current Player: " + currentPlayerName + " (Player 2)")
	}
	else {
		$('#errorZone').show();
	}
})




$(".player1ChoiceButton").on("click", function() {
	player1Selection = (this);
	database.ref().child("Player1").child("currentChoice").set(player1Selection.id);
	if (player2Selection==='') {
		$('#resultsDiv').empty();
		return
	}	
	else if (player1Selection.id==='rock1') {	
		$('#player1SelectionZone').html("You picked Rock!");
		if (player2Selection.id==='rock2') {
			$("#resultsDiv").html("Rock vs. Rock: Tie game!");
		}
		
		if (player2Selection.id==='paper2') {
			$("#resultsDiv").html("Rock vs. Paper: Player 2 wins!");
			player2WinCount++;
			player1LossCount++;
		}

		if (player2Selection.id==='scissors2') {
			$("#resultsDiv").html("Rock vs. Scissors: Player 1 wins!");
			player1WinCount++;
			player2LossCount++;
		}


	}
	else if (player1Selection.id==='paper1') {
		$('#player1SelectionZone').html("You picked Paper!");
		if (player2Selection.id==='rock2') {
			$("#resultsDiv").html("Paper vs. Rock: Player 1 wins!");
			player1WinCount++;
			player2LossCount++;
		}
			
		if (player2Selection.id==='paper2') {
			$("#resultsDiv").html("Paper vs. Paper: Tie game!");
		}

		if (player2Selection.id==='scissors2') {
			$("#resultsDiv").html("Paper vs. Scissors: Player 2 wins!");
			player2WinCount++;
			player1LossCount++;
		}


	}

	else if (player1Selection.id==='scissors1') {
		$('#player1SelectionZone').html("You picked Scissors!");
		if (player2Selection.id==='rock2') {
			$("#resultsDiv").html("Scissors vs. Rock: Player 2 wins!");
			player2WinCount++;
			player1LossCount++;
		}
		
		if (player2Selection.id==='paper2') {
			$("#resultsDiv").html("Scissors vs. Paper: Player 1 wins!");
			player1WinCount++;
			player2LossCount++;
		}

		if (player2Selection.id==='scissors2') {
			$("#resultsDiv").html("Scissors vs. Scissors: Tie game!");
		}


	}

	database.ref().child("Player1").update({
		wins: player1WinCount,
		losses: player1LossCount,
		currentChoice: ''
	})

	database.ref().child("Player2").update({
		wins: player2WinCount,
		losses: player2LossCount,
		currentChoice: ''
	})

	console.log('cleared');
	updateScoreDisplay();
})

$(".player2ChoiceButton").on("click", function() {
	player2Selection = (this);
	database.ref().child("Player2").child("currentChoice").set(player2Selection.id);
	if (player1Selection==='') {
		$('#resultsDiv').empty();
		return
	}	
	else if (player2Selection.id==='rock2') {		
		$('#player1SelectionZone').html("You picked Rock!");
		if (player1Selection.id==='rock1') {
			$("#resultsDiv").html("Rock vs. Rock: Tie game!");
		}
		
		if (player1Selection.id==='paper1') {
			$("#resultsDiv").html("Rock vs. Paper: Player 1 wins!");
			player1WinCount++;
			player2LossCount++;
		}

		if (player1Selection.id==='scissors1') {
			$("#resultsDiv").html("Rock vs. Scissors: Player 2 wins!");
			player2WinCount++;
			player1LossCount++;
		}


	}
	else if (player2Selection.id==='paper2') {
		$('#player1SelectionZone').html("You picked Paper!");
		if (player1Selection.id==='rock1') {
			$("#resultsDiv").html("Paper vs. Rock: Player 2 wins!");
			player2WinCount++;
			player1LossCount++;
		}
			
		if (player1Selection.id==='paper1') {
			$("#resultsDiv").html("Paper vs. Paper: Tie game!");
		}

		if (player1Selection.id==='scissors1') {
			$("#resultsDiv").html("Paper vs. Scissors: Player 1 wins!");
			player1WinCount++;
			player2LossCount++;
		}


	}

	else if (player2Selection.id==='scissors2') {
		$('#player1SelectionZone').html("You picked Scissors!");
		if (player1Selection.id==='rock1') {
			$("#resultsDiv").html("Scissors vs. Rock: Player 1 wins!");
			player1WinCount++;
			player2LossCount++;
		}
		
		if (player1Selection.id==='paper1') {
			$("#resultsDiv").html("Scissors vs. Paper: Player 2 wins");
			player2WinCount++;
			player1LossCount++;
		}

		if (player1Selection.id==='scissors1') {
			$("#resultsDiv").html("Scissors vs. Scissors: Tie game!");
		}


	}

	database.ref().child("Player1").update({
		wins: player1WinCount,
		losses: player1LossCount,
		currentChoice: ''
	})

	database.ref().child("Player2").update({
		wins: player2WinCount,
		losses: player2LossCount,
		currentChoice: ''
	})
	console.log('cleared');
	updateScoreDisplay();
})