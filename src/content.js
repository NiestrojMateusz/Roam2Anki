chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'clicked_browser_action') {
    const csv = getFlashcardsCSV();
    sendResponse(csv);
  }
});

/**
 *
 */

function getFlashcardsCSV() {
  const questionTagedElements = document.querySelectorAll("[data-tag='Box1']");

  const removeRoamLinks = (text) => {};

  const getQestions = () => {
    return Array.from(questionTagedElements).map((e) => {
      const rawQuestions = e.parentNode.innerText;
      // @todo add function to format roam linking to just text;

      return rawQuestions;
    });
  };

  /**
   * @param questionElements: Node[]
   */

  const getAnswersElements = (questionElements) => {
    return questionElements.map((e) => {
      return e.nextElementSibling.querySelectorAll('.roam-block');
    });
  };

  /**
   *
   * @param {Array of Node} nodeLists
   * @returns string
   */
  const getAnswerFromMultipleBlockAnswer = (nodeLists) => {
    return Array.from(nodeLists).reduce((acc, node) => {
      const text = node.innerText;
      return !acc ? text : `${acc}\n${text}`;
    }, '');
  };

  const getAnswers = () => {
    const questionsElements = Array.from(questionTagedElements).map((e) => {
      return e.parentNode.parentNode.parentNode.parentNode;
    });

    const answerElements = getAnswersElements(questionsElements);

    const answers = answerElements.map((e) => {
      if (!e.length) return;
      if (e.length > 1) {
        return getAnswerFromMultipleBlockAnswer(e);
      }

      return Array.from(e)[0].innerText;
    });
    return answers;
  };

  /**
   *
   * @param {string[]} questions
   * @param {string[]} answers
   * @returns [[string, string]];
   */
  const makeQaPairs = (questions, answers) => {
    try {
      if (questions.length !== answers.length) {
        throw new Error("Length of answers and questions doesn't match");
      }

      const pairs = [];

      for (let i = 0; i < questions.length; i++) {
        pairs.push([questions[i], answers[i]]);
      }

      return pairs;
    } catch (error) {
      console.error(error);
    }
  };

  /**
   *
   * @param {string} text
   */
  const prepareAnswerToCSV = (text) => {
    if (text && text.includes('\n')) {
      return `\"${text}\"`;
    } else {
      return text;
    }
  };

  /**
   *
   * @param {[[string, string]]} questionAnswers
   */
  const generateCSV = (questionAnswers) => {
    return questionAnswers.reduce((acc, qa) => {
      const text = `${qa[0]}\t${prepareAnswerToCSV(qa[1])}`;
      return !acc ? text : `${acc}\n${text}`;
    }, '');
  };

  const questions = getQestions();
  const answers = getAnswers();

  const qaCollection = makeQaPairs(questions, answers);
  const csv = generateCSV(qaCollection);

  try {
    if (!csv) {
      throw new Error('Something went wrong!');
    }
    return csv;
  } catch (error) {
    console.error(error);
  }

  return csv;
}
