var Quiz = function(){
    var self = this;
    this.init = function(){
      self._bindEvents();
    }
    
    this.correctAnswers = [
      { question: 1, answer: 'b' },
      { question: 2, answer: 'd' },
      { question: 3, answer: 'a' },
      { question: 4, answer: 'b' },
      { question: 5, answer: 'c' },
      { question: 6, answer: 'c' },
    ]
    
    this._pickAnswer = function($answer, $answers){
      $answers.find('.quiz-answer').removeClass('active');
      $answer.addClass('active');
    }

    this._calcResult = function(){
      var numberOfCorrectAnswers = 0;
      $('ul[data-quiz-question]').each(function(i){
        var $this = $(this),
            chosenAnswer = $this.find('.quiz-answer.active').data('quiz-answer'),
            correctAnswer;
        
        for ( var j = 0; j < self.correctAnswers.length; j++ ) {
          var a = self.correctAnswers[j];
          if ( a.question == $this.data('quiz-question') ) {
            correctAnswer = a.answer;
          }
        }
        
        if ( chosenAnswer == correctAnswer ) {
          numberOfCorrectAnswers++;
          
          // highlight this as correct answer
          $this.find('.quiz-answer.active').addClass('correct');
        }
        else {
          $this.find('.quiz-answer[data-quiz-answer="'+correctAnswer+'"]').addClass('correct');
          $this.find('.quiz-answer.active').addClass('incorrect');
        }
      });

      if ( numberOfCorrectAnswers < 3 ) {
        return {code: 'bad', text: `You finished the quiz! You got ${numberOfCorrectAnswers}/6 correct. This is your sign to learn more about music from around the world!`};
      }
      else if ( numberOfCorrectAnswers == 3 || numberOfCorrectAnswers == 4 ) {
        return {code: 'mid', text: `You finished the quiz! You got ${numberOfCorrectAnswers}/6 correct. You know a fair amount about music around the world, but you can always learn more!`};
      }
      else if ( numberOfCorrectAnswers > 4 ) {
        return {code: 'good', text: `You finished the quiz! You got ${numberOfCorrectAnswers}/6 correct. You know a lot about music around the world, or you're a good guesser. Either way, nice job!`};
      }
    }
 
    this._isComplete = function(){
      var answersComplete = 0;
      $('ul[data-quiz-question]').each(function(){
        if ( $(this).find('.quiz-answer.active').length ) {
          answersComplete++;
        }
      });
      if ( answersComplete >= 6 ) {
        return true;
      }
      else {
        return false;
      }
    }
    this._showResult = function(result){
      $('.quiz-result').addClass(result.code).html(result.text);
    }
    this._bindEvents = function(){
      $('.quiz-answer').on('click', function(){
        var $this = $(this),
            $answers = $this.closest('ul[data-quiz-question]');
        self._pickAnswer($this, $answers);
        if ( self._isComplete() ) {
          
          // scroll to answer section
          $('html, body').animate({
            scrollTop: $('.quiz-result').offset().top
          });
          
          self._showResult( self._calcResult() );
          $('.quiz-answer').off('click');
          
        }
      });
    }
  }
  var quiz = new Quiz();
  quiz.init();