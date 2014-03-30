window.addEventListener('initdone', start);
window.addEventListener('goalreached', this.goalReached);

$('.one').click(saveButton);

FileSystem.init();

function start(){

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