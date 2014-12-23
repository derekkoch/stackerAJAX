$(document).ready( function() {
	$('.unanswered-getter').submit( function(event){
		$('.results').html('');
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});

	$('.inspiration-getter').submit( function(event){
		$('.results').html('');
		var answererTags = $(this).find("input[name='answerers']").val();
		getTopAnswerers(answererTags);
	});
});

var showQuestion = function(question) {
	
	var result = $('.templates .question').clone();
	
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
													question.owner.display_name +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};

var showUser = function(answerer) {

	var result = $('.templates .user').clone();

	var userName = result.find('.display_name a');
	userName.html('<a target="_blank" href=http://stackoverflow.com/users/' + answerer.user.user_id + '/' + answerer.user.display_name + '>' +
													answerer.user.display_name +
													'</a>');

	var userId = result.find('.user_id');
	userId.text(answerer.user.user_id);

	var postCount = result.find('.post_count');
	postCount.text(answerer.post_count);

	var score = result.find('.score');
	score.text(answerer.score);

	return result;
};

var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

var getUnanswered = function(tags) {
	
	var request = {tagged: tags,
								site: 'stackoverflow',
								order: 'desc',
								sort: 'creation'};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};

var getTopAnswerers = function(tags) {

	var request = {tagged: tags,
			site: 'stackoverflow'};

	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/tags/" + request.tagged + "/top-answerers/all_time",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var user = showUser(item);
			$('.results').append(user);
		});

	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};



