window.addEventListener('initdone', start);
window.addEventListener('goalreached', this.goalReached);
window.addEventListener('allGoalsPulled', this.updateGoals);
window.addEventListener('allRewardsPulled', this.updateRewards);
window.addEventListener('someChange', this.load);
window.addEventListener('NotEnoughPoints', this.insufficientPoints);

var allGoals = null;
var allRewards = null;

$('.one').click(saveButton);
$('.two').click(goalButton);
$('.three').click(rewardButton);

FileSystem.init();

function start(){
	load();
}

function goalReached(event) {

	$(".modal-body").html("Congrats! You have reached your " + event.detail.name + " goal! You have earned " + event.detail.pts + " points.");
	$('#myModal').modal('toggle');

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
	return false;
}

function goalButton(event) {
	event.preventDefault();
	var goalname = $('#goalName').val();
	var cost = $('#goalCost').val();
	FileSystem.createGoal(goalname, parseInt(cost,10));
	return false;
}

function rewardButton(event) {
	event.preventDefault();
	var rewardname = $('#rewName').val();
	var cost = $('#rewCost').val();
	FileSystem.createReward(rewardname, parseInt(cost,10));
	return false;
}

function load() {
	console.log("loading");
	FileSystem.getAllGoals();
	FileSystem.getAllRewards();
}

function updateGoals(event) {
	allGoals = event.detail;
}

function updateRewards(event) {
	allRewards = event.detail;
}