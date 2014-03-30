window.addEventListener('initdone', start);
window.addEventListener('goalreached', this.goalReached);
window.wtf = "wtf";
FileSystem.init();

function start(){

}

function goalReached(event){

	$(".modal-body").html("Congrats! You have reached your " + event.detail.name + " goal! You have earned " + event.detail.pts + " points.");
	$('#myModal').modal('toggle');

}



window.populateGoals = function(allGoals){
	var goals = $('#goals');
	for(var i=0;i<allGoals.length;i++){
		var goal = allGoals[i];
		html1='<span>'+goal.name+'</span>'
		goals.append($(html1));
		html = '<div class="progress progress-striped active"><div class="progress-bar" role="progressbar" aria-valuenow="'+goal.current+'" aria-valuemin="0" aria-valuemax="100" style="width:'+(goal.current/goal.cost)*100+'%"></div>'
		goals.append($(html));
	}
}

