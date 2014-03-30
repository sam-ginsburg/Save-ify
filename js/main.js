window.addEventListener('initdone', start);
window.addEventListener('goalreached', this.goalReached);
window.addEventListener('AllGoalsPulled', this.updateGoals);
window.addEventListener('AllRewardsPulled', this.updateRewards);
window.addEventListener('someChange', this.load);
window.addEventListener('NotEnoughPoints', this.insufficientPoints);
window.addEventListener('moneySaved', this.moneySaved);
window.addEventListener('pointsChanged', this.updatePoints);

var allGoals = null;
var allRewards = null;

$('.one').click(saveButton);
$('.two').click(goalButton);
$('.three').click(rewardButton);

FileSystem.init();

function start(){
	load();
	updatePoints();
}

function goalReached(event) {

	$(".modal-body").html("Congrats! You have reached your " + event.detail.name + " goal! You have earned " + event.detail.pts + " points.");
	$('#myModal').modal('toggle');

}
var populateGoals = function(allGoals){
	var goals = $('#goals');
	for(var i=0;i<allGoals.length;i++){
		var goal = allGoals[i];
		html1='<span>'+goal.name+'</span>'
		goals.append($(html1));
		html = '<div class="progress progress-striped active"><div class="progress-bar" role="progressbar" aria-valuenow="'+goal.current+'" aria-valuemin="0" aria-valuemax="100" style="width:'+(goal.current/goal.cost)*100+'%"></div>'
		goals.append($(html));
	}
}

function insufficientPoints(event) {
	$(".modal-body").html("Sorry, you don't have enough points for that. You need " + event.detail + " more points.");
	$('#myModal2').modal('toggle');
}

function saveButton(event) {
	event.preventDefault();
	var amt = $('#amountSave').val();
	var goalname = $('#goalC').val();
	FileSystem.saveMoney(goalname, parseInt(amt,10));
	//return false;
}

function goalButton(event) {
	event.preventDefault();
	var goalname = $('#goalName').val();
	var cost = $('#goalCost').val();
	FileSystem.createGoal(goalname, parseInt(cost,10));
	//return false;
}

function rewardButton(event) {
	event.preventDefault();
	var rewardname = $('#rewName').val();
	var cost = $('#rewCost').val();
	FileSystem.createReward(rewardname, parseInt(cost,10));
	//return false;
}

function load() {
	console.log("loading");
	FileSystem.getAllGoals();
	FileSystem.getAllRewards();
	// FileSystem.getPoints();
}

function updateGoals(event) {
	console.log("updating goals");
	allGoals = event.detail;
	populateGoals(allGoals);
}

function updateRewards(event) {
	allRewards = event.detail;
}

function updatePoints(event) {
	FileSystem.getPoints(function(pts){
		$("#pointBox").html(pts);
	});
}

function moneySaved(event) {
	FileSystem.changePoints(event.detail.amt/100, function(){
	});
	//$("#pointBox").html((parseFloat(($("#pointBox").text()))+event.detail.amt)/100);
}
