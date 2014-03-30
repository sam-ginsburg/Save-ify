window.addEventListener('initdone', start);
window.addEventListener('goalreached', this.goalReached);

FileSystem.init();

function start(){

}

function goalReached(event){

	$(".modal-body").html("Congrats! You have reached your " + event.detail.name + " goal! You have earned " + event.detail.pts + " points.");
	$('#myModal').modal('toggle');

}