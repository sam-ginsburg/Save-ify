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
	var goaler = $('#goals');
	goals.innerHTML="";
	for(var i=0;i<allGoals.length;i++){
		var goal = allGoals[i];
		html1='<span>'+goal.name+'</span>'
		goals.innerHTML+=html1;
		html = '<div class="progress progress-striped active"><div id="goal-'+goal.name+'" class="progress-bar" role="progressbar" aria-valuenow="'+goal.current+'" aria-valuemin="0" aria-valuemax="100" style="width:'+(goal.current/goal.cost)*100+'%"><sup>'+goal.current+'</sup>&frasl;<sub>'+goal.cost+'</sub></div>'
		goals.innerHTML+=html;
	}
}
window.populateRewards=function(allRewards){
	var rewarder=$('#rewards');
	rewards.innerHTML="";
	console.log(rewards.innerHTML);
	for(var i=0;i<allRewards.length;i++){
		var reward=allRewards[i];
		html1='<button id="reward-'+reward.name+'" type="button" class="btn">Claim Your Reward!</button>'
		spacer='<span>&nbsp; &nbsp;</span>'
		html2='<span>'+reward.name+'</span>'
		html3= '<span class="label label-warning">'+ reward.pts+ 'Pts.</span> <br> <br>'
		rewards.innerHTML+=html1
		rewards.innerHTML+=spacer;
		rewards.innerHTML+=html2;
		rewards.innerHTML+=spacer;
		rewards.innerHTML+=html3;
		if(i==allRewards.length-1){
			newRew.innerHTML="";
			newRew.innerHTML+=reward.name;
		}
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
