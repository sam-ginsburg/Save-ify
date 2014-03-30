window.addEventListener('initdone', start);
window.addEventListener('goalreached', this.goalReached);
window.addEventListener('allGoalsPulled', this.updateGoals);
window.addEventListener('allRewardsPulled', this.updateRewards);
window.addEventListener('someChange', this.load);

var allGoals = null;
var allRewards = null;

$('.one').click(saveButton);

FileSystem.init();

function start(){
	load();
}

function goalReached(event) {

	$(".modal-body").html("Congrats! You have reached your " + event.detail.name + " goal! You have earned " + event.detail.pts + " points.");
	$('#myModal').modal('toggle');

}

function saveButton(event) {
	// event.preventDefault();
	var amt = $('#amountSave').val();
	var goalname = $('#goalC').val();
	FileSystem.saveMoney(goalname, parseInt(amt,10));
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