window.FileSystem = (function(){
	'use strict';

	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

	navigator.webkitPersistentStorage.requestQuota(20*1024*1024, function(grantedBytes) {
		window.myGrantedBytes = grantedBytes;
		window.dispatchEvent(new CustomEvent('quota'));
	}, function(e) {
		console.log('Error: Could not get storage quota.', e);
	});

	// var myFS = null;
	// var myGoalsDir = null;
	// var myRewardsDir = null;
	// var myProjDir = null;


	var FileSystem = {

		init: function() {
		
			window.addEventListener('quota',function(){
				getProject("Savify", function(dirEntry){
					window.dispatchEvent(new CustomEvent('initdone'));
				}, function(){
					FileSystem.createProject("Savify",function(){
						window.dispatchEvent(new CustomEvent('initdone'));
					});
				});
			});

		},

		createProject: function(projName, success) {
			toCreateProject(projName, function(){
				window.dispatchEvent(new CustomEvent('projectCreated'));
				success();
			});
		},

		removeReward: function(RewardName) {
			toRemoveReward("Savify", RewardName, function(){
				window.dispatchEvent(new CustomEvent('RewardRemoved'));
			});
		},

		removeGoal: function(GoalName) {
			toRemoveGoal("Savify", GoalName, function(){
				window.dispatchEvent(new CustomEvent('GoalRemoved'));
			});
		},

		createGoal: function(GoalName, Cost) {
			toCreateGoal(GoalName, Cost, 0, function(){
				window.dispatchEvent(new CustomEvent('GoalCreated'));
			});
		},

		createReward: function(RewardName, Pts) {
			toCreateReward(RewardName, Pts, function(){
				window.dispatchEvent(new CustomEvent('RewardCreated'));
			});
		},

		saveMoney: function(GoalName, AmountSaved) {
			toSaveMoney(GoalName, AmountSaved, function(){
				window.dispatchEvent(new CustomEvent('Saved ' + AmountSaved + ' dollars for ' + GoalName));
			});
		},

		getGoal: function(GoalName) {
			toGetGoal("Savify", GoalName, function(goal){
				window.dispatchEvent(new CustomEvent('GoalPulled'));
				console.log(goal);
			});
		}

	};

	function toSetUp(success) {
		getFS(function(fs){
			myFS = fs;
			getGoalsDir("Savify", function(GoalsDir){
				myGoalsDir = GoalsDir;
				getRewardsDir("Savify", function(RewardsDir){
					myRewardsDir = RewardsDir;
					success();
				});
			});
		});

	}

	function getFS(success) {
		window.requestFileSystem(window.PERSISTENT, myGrantedBytes, function(fs){
			success(fs);
		}, errorHandler);
	}

	function getProject(projName, success, failure) {
		getFS(function(fs) {
			fs.root.getDirectory(projName, {create: false}, function(dirEntry) {
				success(dirEntry);
			}, function(){
				failure();
			});
		});
	}

	function toGetAllProjectNames(success) {
		getFS(function(fs){
			var allProjNames = [];
			var dirReader = fs.root.createReader();
			dirReader.readEntries (function(results) {
				for(var i=0; i<results.length; i++){
					allProjNames.push(results[i].name);
				}
				success(allProjNames);
			}, errorHandler);
		});
	}

	function getRewardsDir(projName, success) {
		getProject(projName, function(projDir){
			projDir.getDirectory("Rewards", {create: false, exclusive: true}, function(dirEntry) {
				success(dirEntry);
			}, errorHandler);
		});
	}

	function toGetRewardFile(projName, RewardName, success) {
		getRewardsDir(projName, function(RewardsDir){
			RewardsDir.getFile(RewardName, {create: false}, function(fileEntry) {
				success(fileEntry);
			}, errorHandler);
		});
	}

	function toGetReward(projName, RewardName, success) {
		toGetRewardFile(projName, RewardName, function(RewardFile){
			RewardFileToObj(RewardFile, function(Reward){
				success(Reward);
			});
		});
	}

	function getGoalsDir(projName, success) {
		getProject(projName, function(projDir){
			projDir.getDirectory("Goals", {create: false, exclusive: true}, function(dirEntry) {
				success(dirEntry);
			}, errorHandler);
		});
	}

	function toGetGoalFile(projName, GoalName, success) {
		getGoalsDir(projName, function(GoalsDir){
			GoalsDir.getFile(GoalName, {create: false}, function(fileEntry) {
				success(fileEntry);
			}, errorHandler);
		});
	}

	function toGetGoal(projName, GoalName, success) {
		toGetGoalFile(projName, GoalName, function(GoalFile){
			GoalFileToObj(GoalFile, function(Goal){
				success(Goal);
			});
		});
	}

	function GoalFileToObj(GoalFile, success) {
		// GoalFile.file(function(file) {
		// 	var reader = new FileReader();

		// 	reader.onloadend = function(e) {
		// 		success({name: file.name, buffer: this.result});
		// 	};

		// 	reader.readAsArrayBuffer(file);
		// }, errorHandler);

		GoalFile.file(function(file) {
			var reader = new FileReader();

			reader.onloadend = function(e) {
				success(JSON.parse(this.result));
			};

			reader.readAsText(file);
		}, errorHandler);
	}

	function RewardFileToObj(RewardFile, success) {
		RewardFile.file(function(file) {
			var reader = new FileReader();

			reader.onloadend = function(e) {
				success(JSON.parse(this.result));
			};

			reader.readAsText(file);
		}, errorHandler);
	}

	function toGetAllGoalFiles(projName, success) {
		getGoalsDir(projName, function(GoalsDir){
			var dirReader = GoalsDir.createReader();
			var entries = [];

			dirReader.readEntries (function(results) {
				entries = entries.concat(toArray(results));
				success(entries);
			}, errorHandler);
		});
	}

	function toGetAllGoals(projName, success) {
		toGetAllGoalFiles(projName, function(fileEntries){
			var GoalArray = [];
			for(var i = 0; i<fileEntries.length; i++){
				GoalFileToObj(fileEntries[i], function(Goal){
					GoalArray.push(Goal);
					if(GoalArray.length == fileEntries.length){
						success(GoalArray);
					}
				});
			}
		});
	}

	function toGetAllRewardFiles(projName, success) {
		getRewardsDir(projName, function(RewardsDir){
			var dirReader = RewardsDir.createReader();
			var entries = [];

			dirReader.readEntries (function(results) {
				entries = entries.concat(toArray(results));
				success(entries);
			}, errorHandler);
		});
	}

	function toGetAllRewards(projName, success) {
		toGetAllRewardFiles(projName, function(fileEntries){
			var RewardArray = [];
			for(var i = 0; i<fileEntries.length; i++){
				RewardFileToObj(fileEntries[i], function(Reward){
					RewardArray.push(Reward);
					if(RewardArray.length == fileEntries.length){
						success(RewardArray);
					}
				});
			}
		});
	}

	function toSaveGoals(projName, filesList, success) {
		getGoalsDir(projName, function(GoalsDir){
			for (var i = 0, file; file = filesList[i]; ++i) {

				(function(f) {
					GoalsDir.getFile(f.name, {create: true, exclusive: true}, function(fileEntry) {
						fileEntry.createWriter(function(fileWriter) {

							fileWriter.onwriteend = function(e) {
								if(i === filesList.length){
									console.log('Goal write completed.');
									success();
								}
							};
							fileWriter.write(f);
						}, errorHandler);
					}, errorHandler);
				})(file);
			}
		});
	}

	function toCreateGoal(GoalName, Cost, cur, success) {
		var goal = {name: GoalName, cost: Cost, pts: Cost/100, current: cur};
		getGoalsDir("Savify", function(GoalsDir){
			GoalsDir.getFile(goal.name, {create: true, exclusive: true}, function(fileEntry){
				fileEntry.createWriter(function(fileWriter) {

					fileWriter.onwriteend = function(e) {
						console.log('Goal write completed.');
						success();
					};

					fileWriter.onerror = function(e) {
						console.log('Reward write failed: ' + e.toString());
					};

					var blob = new Blob([JSON.stringify(goal)], {type: 'text/plain'});

					fileWriter.write(blob);

				}, errorHandler);
			}, errorHandler);
		});

	}

	function toCreateReward(RewardName, pts, success) {
		
		var reward = {name: RewardName, pts: pts};
		getRewardsDir("Savify", function(RewardsDir){
			RewardsDir.getFile(reward.name, {create: true, exclusive: true}, function(fileEntry){
				fileEntry.createWriter(function(fileWriter) {

					fileWriter.onwriteend = function(e) {
						console.log('Reward write completed.');
						success();
					};

					fileWriter.onerror = function(e) {
						console.log('Reward write failed: ' + e.toString());
					};

					var blob = new Blob([JSON.stringify(reward)], {type: 'text/plain'});

					fileWriter.write(blob);

				}, errorHandler);
			}, errorHandler);
		});
		
	}

	function toSaveMoney(GoalName, AmountSaved, success) {
		var newGoal = {};
		toGetGoal("Savify", GoalName, function(goal){
			console.log(goal);
			newGoal = {name: goal.name, cost: goal.cost, pts: goal.pts, current: goal.current + AmountSaved};
			toRemoveGoal("Savify", GoalName, function(){

				if(newGoal.current >= newGoal.cost){
					window.dispatchEvent(new CustomEvent('goalreached', {detail: {name: GoalName, pts: newGoal.pts}}));
				}

				else{
					toCreateGoal(GoalName, newGoal.cost, newGoal.current, function(){
						success();
					});
				}
			});
		});
	}

	function makeDirectory(parentDir, name, success) {
		parentDir.getDirectory(name, {create: true, exclusive: true}, function(dirEntry) {
			success(dirEntry);
		}, errorHandler);
	}

	function toCreateProject(projName, success) {
		getFS(function(fs){
			makeDirectory(fs.root, projName, function(projDir){
				makeDirectory(projDir, "Goals", function(GoalsDir){
					makeDirectory(projDir, "Rewards", function(RewardsDir){
						success();
					});
				});
			});
		});
	}

	function removeFile(parentDir, name, success) {
		parentDir.getFile(name, {create: false}, function(fileEntry) {

			fileEntry.remove(function() {
				console.log('File ' + name + ' removed.');
				success();
			}, errorHandler);

		}, errorHandler);
	}

	function toRemoveGoal(projName, GoalName, success) {
		getGoalsDir(projName, function(GoalsDir){
			removeFile(GoalsDir, GoalName, function(){
				success();
			});
		});
	}

	function toRemoveReward(projName, RewardName, success) {
		getRewardsDir(projName, function(RewardsDir){
			removeFile(RewardsDir, RewardName, function(){
				success();
			});
		});
	}

	function toRemoveProject(projName, success) {
		getFS(function(fs){
			fs.root.getDirectory(projName, {create: false}, function(dirEntry) {

				dirEntry.removeRecursively(function() {
					console.log('Project ' + projName + ' removed.');
					success();
				}, errorHandler);

			}, errorHandler);
		});
	}

	function toArray(list) {
		return Array.prototype.slice.call(list || [], 0);
	}

	function errorHandler(e) {
	var msg = '';

	switch (e.code) {
		case FileError.QUOTA_EXCEEDED_ERR:
		msg = 'QUOTA_EXCEEDED_ERR';
		break;
		case FileError.NOT_FOUND_ERR:
		msg = 'NOT_FOUND_ERR';
		break;
		case FileError.SECURITY_ERR:
		msg = 'SECURITY_ERR';
		break;
		case FileError.INVALID_MODIFICATION_ERR:
		msg = 'INVALID_MODIFICATION_ERR';
		break;
		case FileError.INVALID_STATE_ERR:
		msg = 'INVALID_STATE_ERR';
		break;
		default:
		msg = 'Unknown Error';
		break;
	}

	console.log('Error: ' + msg);
}

	return FileSystem;
})();